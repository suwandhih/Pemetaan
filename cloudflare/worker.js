/* Pemetaan — Worker perantara ke database Neon (orderan 7)
   ------------------------------------------------------------------
   TUGAS
     Menjadi perantara antara situs (GitHub Pages) dan database Neon,
     supaya data anggota SAMA di HP dan PC.

   KENAPA HARUS LEWAT WORKER
     Situs Pemetaan hanya berkas statis — kalau alamat + sandi database
     ditanam di JavaScript, siapa pun bisa membacanya lewat "View Source"
     lalu menghapus seluruh data. Sandi disimpan di Worker sebagai
     *secret*, jadi tidak pernah ikut terkirim ke peramban.

   PENGAMANAN
     1. Sandi database hanya ada di secret Worker (DATABASE_URL).
     2. Peran database `pemetaan_api` — HANYA boleh SELECT/INSERT/
        UPDATE/DELETE. Tidak bisa menghapus tabel atau mengubah struktur.
     3. Permintaan hanya diterima dari asal (Origin) yang terdaftar
        di DAFTAR_ASAL.
        4. SETIAP permintaan — termasuk membaca — wajib menyertakan kunci
           aplikasi (secret KUNCI). Kunci tidak ikut tersimpan di kode
           situs, jadi hanya orang yang tahu kuncinya bisa membuka data.

   CARA PAKAI
     Permintaan: POST, isi JSON { aksi, kunci, ... }
     Jawaban   : JSON { ok: true, ... }  atau  { ok: false, pesan }

     aksi:
       ambilSemua                 -> { anggota, kategori, pengaturan }
       simpanAnggota  { anggota } -> { anggota }
       simpanAnggotaBanyak { anggota[] } -> { jumlah }
       hapusAnggota   { id }
       simpanKategori { nama }
       hapusKategori  { nama }
       simpanAtur     { nama, nilai }
       kosongkan                                  (hapus semua anggota)
       tarikTokomedia { kategori? }               (ambil data tokomedia.org)
       tarikRumahweb  { kategori? }               (ambil data API TokoMedia
                                                   di Rumahweb — baca saja)
       cek                                        (uji sambungan)
*/

import { neon } from '@neondatabase/serverless';
import { BAHASA, PROVINSI } from './peta-bahasa.js';

/* Asal yang diizinkan memanggil Worker ini. Tambahkan alamat lain
   (misal alamat uji lokal) di sini, jangan di berkas situs. */
const DAFTAR_ASAL = [
  'https://suwandhih.github.io',
  'http://127.0.0.1:8777',
  'http://localhost:8777'
];

function kepala(asal) {
  return {
    'Access-Control-Allow-Origin': asal || DAFTAR_ASAL[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function balas(data, asal, kode) {
  return new Response(JSON.stringify(data), {
    status: kode || 200,
    headers: kepala(asal)
  });
}

function teks(v, maks) {
  if (v === null || v === undefined) { return ''; }
  return String(v).slice(0, maks || 500);
}

function angka(v) {
  if (v === null || v === undefined || v === '') { return null; }
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function senarai(v) {
  /* Keterangan disimpan sebagai daftar { label, nilai } — sama dengan
     bentuk di js/member.js (bacaRincian). Jangan dijadikan teks, nanti
     tampilannya berubah jadi "[object Object]". */
  if (!Array.isArray(v)) { return []; }
  return v.slice(0, 40).map(function (x) {
    if (x && typeof x === 'object') {
      return { label: teks(x.label, 120), nilai: teks(x.nilai, 400) };
    }
    return { label: teks(x, 120), nilai: '' };
  }).filter(function (x) { return x.label !== '' || x.nilai !== ''; });
}

/* Ubah baris database (snake_case) menjadi objek yang dipakai situs
   (camelCase) — sama seperti objek di js/member.js. */
function keSitus(b) {
  return {
    id: b.id,
    nama: b.nama,
    kategori: b.kategori || '',
    inisial: b.inisial || '',
    rincian: Array.isArray(b.rincian) ? b.rincian : [],
    lon: b.lon === null ? null : Number(b.lon),
    lat: b.lat === null ? null : Number(b.lat),
    kodeProvinsi: b.kode_provinsi || '',
    kodeKabkota: b.kode_kabkota || '',
    kodeKecamatan: b.kode_kecamatan || '',
    kodeDesa: b.kode_desa || '',
    provinsi: b.provinsi || '',
    kabkota: b.kabkota || '',
    kecamatan: b.kecamatan || '',
    desa: b.desa || '',
    dibuat: b.dibuat instanceof Date ? b.dibuat.toISOString() : b.dibuat,
    diubah: b.diubah instanceof Date ? b.diubah.toISOString() : b.diubah
  };
}

/* ==================================================================
   TARIK DATA TOKOMEDIA.ORG
   ------------------------------------------------------------------
   Tokomedia belum memasang API-nya (semua alamat /api/... mengembalikan
   halaman login) dan situsnya tidak mengirim header CORS, jadi peramban
   TIDAK bisa mengambil datanya langsung. Worker bisa, karena berjalan di
   server.

   Yang diambil: 5 halaman kategori, masing-masing berisi tabel bahasa
   per gugus pulau. Cukup 5 permintaan sekali tekan tombol [Update].

   Koordinat: tokomedia.org TIDAK menyimpan lokasi. Titik dihitung dari
   nama bahasa -> provinsi (cloudflare/peta-bahasa.js). Jika bahasa tidak
   terpetakan, titik dilewati dan dicatat sebagai gagal; bukan ditebak.
   ================================================================== */

const KATEGORI_TM = [
  { id: 'film-isa', nama: 'Film Isa Al-Masih', ikon: 'ikon-orang',
    url: 'https://tokomedia.org/film-riwayat-isa-al-masih' },
  { id: 'film-ikatan', nama: 'Film Ikatan Ilahi', ikon: 'ikon-rantai',
    url: 'https://tokomedia.org/film-ikatan-ilahi' },
  { id: 'video-ks', nama: 'Video Kitab Suci', ikon: 'ikon-kamera',
    url: 'https://tokomedia.org/film-kitab-suci-injil' },
  { id: 'clip-ks', nama: 'Clip Kitab Suci', ikon: 'ikon-putar',
    url: 'https://tokomedia.org/clip' },
  { id: 'aplikasi', nama: 'Aplikasi Kitab Suci', ikon: 'ikon-ponsel',
    url: 'https://tokomedia.org/koleksi-aplikasi' }
];

function bukaEntitas(t) {
  return String(t)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&raquo;/g, '\u00BB')
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(Number(n)); })
    .trim();
}

function buangTag(t) {
  return bukaEntitas(String(t).replace(/<[^>]*>/g, ''));
}

/* Ambil daftar bahasa dari satu halaman kategori.
   Bentuk halaman: <th>Sumatera</th> ... <tbody> <a href='/...'>Aceh</a> ... */
function bacaHalaman(html) {
  const hasil = [];
  const pola = /<th>([\s\S]*?)<\/th>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/g;
  let m;
  while ((m = pola.exec(html)) !== null) {
    const gugus = buangTag(m[1]);
    const isi = m[2];
    const polaA = /<a\s+href='([^']+)'[^>]*>([\s\S]*?)<\/a>/g;
    let a;
    while ((a = polaA.exec(isi)) !== null) {
      const nama = buangTag(a[2]);
      if (!nama) { continue; }
      hasil.push({ gugus: gugus, nama: nama, url: a[1] });
    }
  }
  return hasil;
}

/* Titik untuk satu bahasa. Bahasa harus punya provinsi yang terverifikasi;
   tidak memakai titik gugus/Indonesia karena dapat jatuh di laut. */
function titikUntuk(nama) {
  const kode = BAHASA[nama];
  const provinsi = kode && PROVINSI[kode];
  if (!provinsi) {
    return { lon: null, lat: null, kodeProvinsi: '', provinsi: '', cara: 'tidak-terpetakan' };
  }
  return {
    lon: provinsi.lon,
    lat: provinsi.lat,
    kodeProvinsi: kode,
    provinsi: provinsi.n,
    posisi: provinsi.p || [[provinsi.lon, provinsi.lat]],
    cara: 'provinsi'
  };
}

function inisialDari(nama) {
  const bersih = String(nama).replace(/^Bahasa\s+/i, '').replace(/[^A-Za-z]/g, '');
  return (bersih.slice(0, 2) || '??').toUpperCase();
}

/* Pilih titik penanda dari titik-titik yang telah diverifikasi di daratan
   provinsi. Tidak ada offset geometri yang bisa menggeser penanda ke laut. */
function geser(titik, urutan, jumlah, geserSudut, jari) {
  const posisi = titik.posisi || [[titik.lon, titik.lat]];
  const putaran = Math.floor((geserSudut || 0) * posisi.length / (2 * Math.PI));
  const dipilih = posisi[(urutan + putaran) % posisi.length];
  return { lon: dipilih[0], lat: dipilih[1] };
}

/* Sebar bahasa pada kandidat daratan provinsinya agar tidak menumpuk.
   Tiap kategori menggunakan urutan kandidat yang berbeda. */
function sebarPerProvinsi(daftar, putaran, jari) {
  const grup = {};
  daftar.forEach(function (a) {
    const k = a.kodeProvinsi || 'lain';
    if (!grup[k]) { grup[k] = []; }
    grup[k].push(a);
  });
  const geserSudut = (putaran || 0) * 2 * Math.PI;
  Object.keys(grup).forEach(function (k) {
    const isi = grup[k];
    isi.forEach(function (a, i) {
      const t = geser({ lon: a.lon, lat: a.lat, posisi: a.posisi }, i, isi.length, geserSudut, jari);
      a.lon = t.lon;
      a.lat = t.lat;
    });
  });
  return daftar;
}

async function tarikTokomedia(pilih) {
  const dipakai = pilih && pilih.length
    ? KATEGORI_TM.filter(function (k) { return pilih.indexOf(k.id) >= 0; })
    : KATEGORI_TM;

  const anggota = [];
  const gagal = [];
  let urut = 0;

  for (let i = 0; i < dipakai.length; i++) {
    const kat = dipakai[i];
    let html;
    try {
      const jawab = await fetch(kat.url, {
        headers: {
          'User-Agent': 'PemetaanBot/1.0 (+https://suwandhih.github.io/Pemetaan/)',
          'Accept': 'text/html'
        }
      });
      if (!jawab.ok) { throw new Error('HTTP ' + jawab.status); }
      html = await jawab.text();
    } catch (e) {
      gagal.push(kat.nama + ': ' + e.message);
      continue;
    }

    const daftar = bacaHalaman(html);
    if (!daftar.length) {
      gagal.push(kat.nama + ': daftar bahasa tidak ditemukan di halaman');
      continue;
    }

    daftar.forEach(function (b) {
      const t = titikUntuk(b.nama);
      if (t.cara !== 'provinsi') {
        gagal.push(kat.nama + ' / ' + b.nama + ': bahasa belum terpetakan ke provinsi; titik tidak ditampilkan');
        return;
      }
      urut += 1;
      anggota.push({
        id: 'tm-' + kat.id + '-' + String(urut).padStart(4, '0'),
        nama: b.nama + ' - ' + kat.nama,
        kategori: kat.nama,
        ikon: kat.ikon,
        inisial: inisialDari(b.nama),
        rincian: [
          { label: 'Bahasa', nilai: b.nama },
          { label: 'Kategori', nilai: kat.nama },
          { label: 'Gugus', nilai: b.gugus },
          { label: 'Provinsi', nilai: t.provinsi },
          { label: 'Sumber', nilai: 'https://tokomedia.org' + b.url }
        ],
        lon: t.lon,
        lat: t.lat,
        posisi: t.posisi,
        kodeProvinsi: t.kodeProvinsi,
        kodeKabkota: '',
        kodeKecamatan: '',
        kodeDesa: '',
        provinsi: t.provinsi,
        kabkota: '',
        kecamatan: '',
        desa: ''
      });
    });

    sebarPerProvinsi(anggota.slice(awal), i / dipakai.length, 0);
  }

  return { anggota: anggota, gagal: gagal };
}

/* ==================================================================
   TARIK DATA DARI RUMAHWEB (API TokoMedia) — BACA SAJA
   ------------------------------------------------------------------
   Sejak orderan 27, data media diambil dari API TokoMedia di Rumahweb,
   bukan lagi dengan membaca halaman tokomedia.org. Bedanya:

     - Hasilnya JSON terstruktur, bukan tebakan dari HTML.
     - Nama bahasa + gugus pulau datang langsung dari database.
     - Sekali jalan hanya perlu 5 permintaan (1 per kelompok media).

   Jalurnya: peramban -> Worker ini -> pemetaan-bridge.php (Rumahweb)
             -> API TokoMedia.

   Kenapa tidak langsung dari peramban? Karena token API TokoMedia harus
   disimpan di sisi server. Kalau ditaruh di JavaScript, siapa pun bisa
   membacanya lewat "View Source".

   KUNCI: env.RUMAHWEB_KUNCI (secret Worker). Berkas pemetaan-bridge.php
   memeriksa kunci ini; tanpa kunci yang benar jawabannya 401.
   ================================================================== */

const ALAMAT_RUMAHWEB = 'https://suwandhih.my.id/pemetaan-bridge.php';

/* Kelompok media yang dipakai dashboard Pemetaan -> id kategori TokoMedia.
   Urutannya sama dengan MEDIA di js/media.js.

   Clip Kitab Suci tidak ada di sini karena kategorinya (127) tidak punya
   daftar bahasa — isinya daftar video. Ditangani terpisah di bawah. */
const GRUP_RUMAHWEB = [
  { id: 1, nama: 'Film Isa Al-Masih', ikon: 'ikon-orang' },
  { id: 304, nama: 'Film Ikatan Ilahi', ikon: 'ikon-rantai' },
  { id: 126, nama: 'Video Kitab Suci', ikon: 'ikon-kamera' }
];

/* Gugus aplikasi disimpan sebagai atribut sumber, bukan dijadikan provinsi.
   Setiap aplikasi tetap menjadi rekaman sendiri; nama bahasa dipetakan hanya
   bila ada pada katalog BAHASA yang sudah disusun dari data pemetaan. */
const GUGUS_APLIKASI = [
  { tag: 'Jawa-Bali-NusaTenggara', nama: 'Jawa, Bali, Nusa Tenggara' },
  { tag: 'Jawa-Bali-Nusa Tenggara', nama: 'Jawa, Bali, Nusa Tenggara' },
  { tag: 'Maluku-Papua', nama: 'Maluku, Papua' },
  { tag: 'Sumatera', nama: 'Sumatera' },
  { tag: 'Kalimantan', nama: 'Kalimantan' },
  { tag: 'Sulawesi', nama: 'Sulawesi' },
  { tag: 'Indonesia', nama: 'Indonesia' }
];

/* Clip yang tersedia saat ini berbahasa Indonesia. Bahasa nasional tidak
   membuktikan provinsi; jangan menempatkan titik wakil di Jakarta. */

async function panggilRumahweb(env, jalur, isi) {
  const badan = new URLSearchParams();
  badan.set('path', jalur);
  Object.keys(isi || {}).forEach(function (k) { badan.set(k, isi[k]); });

  const jawab = await fetch(ALAMAT_RUMAHWEB, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Pemetaan-Kunci': env.RUMAHWEB_KUNCI || ''
    },
    body: badan.toString()
  });
  if (!jawab.ok) {
    throw new Error('Rumahweb HTTP ' + jawab.status);
  }
  return jawab.json();
}

async function tarikRumahweb(env, pilih) {
  const dipakai = pilih && pilih.length
    ? GRUP_RUMAHWEB.filter(function (g) { return pilih.indexOf(g.nama) >= 0; })
    : GRUP_RUMAHWEB;

  const anggota = [];
  const gagal = [];
  const gagalBaca = [];
  let urut = 0;

  for (let i = 0; i < dipakai.length; i++) {
    const grup = dipakai[i];
    let jawab;
    try {
      jawab = await panggilRumahweb(env, 'category/languages', { id: grup.id });
    } catch (e) {
      gagal.push(grup.nama + ': ' + e.message);
      gagalBaca.push(grup.nama);
      continue;
    }
    if (!jawab || jawab.status !== 200 || !Array.isArray(jawab.data)) {
      gagal.push(grup.nama + ': ' + ((jawab && jawab.message) || 'tidak ada data'));
      gagalBaca.push(grup.nama);
      continue;
    }

    const awal = anggota.length;
    jawab.data.forEach(function (b) {
      const t = titikUntuk(b.name);
      if (t.cara !== 'provinsi') {
        gagal.push(grup.nama + ' / ' + b.name + ': bahasa belum terpetakan ke provinsi; tanpa titik pada peta');
      }

      urut += 1;
      anggota.push({
        id: 'tm-' + grup.id + '-' + b.id,
        nama: b.name + ' - ' + grup.nama,
        kategori: grup.nama,
        ikon: grup.ikon,
        inisial: inisialDari(b.name),
        rincian: [
          { label: 'Bahasa', nilai: b.name },
          { label: 'Kategori', nilai: grup.nama },
          { label: 'Gugus', nilai: b.region || '' },
          { label: 'Provinsi', nilai: t.provinsi },
          { label: 'Sumber', nilai: 'https://tokomedia.org/' + (b.slug || '') }
        ],
        lon: t.cara === 'provinsi' ? t.lon : null,
        lat: t.cara === 'provinsi' ? t.lat : null,
        posisi: t.cara === 'provinsi' ? t.posisi : null,
        kodeProvinsi: t.kodeProvinsi,
        kodeKabkota: '',
        kodeKecamatan: '',
        kodeDesa: '',
        provinsi: t.provinsi,
        kabkota: '',
        kecamatan: '',
        desa: ''
      });
    });

    if (anggota.length === awal) {
      gagal.push(grup.nama + ': tidak ada bahasa yang bisa dipetakan');
      gagalBaca.push(grup.nama);
      continue;
    }
    sebarPerProvinsi(anggota.slice(awal), i / dipakai.length, 0.12 + i * 0.06);
  }

  /* Aplikasi Kitab Suci — baca seluruh aplikasi, bukan lima ringkasan gugus.
     Satu bahasa boleh memiliki lebih dari satu aplikasi: rekaman aplikasi
     dihitung terpisah, sedangkan laporan menghitung bahasa unik. */
  if (!pilih || !pilih.length || pilih.indexOf('Aplikasi Kitab Suci') >= 0) {
    const awal = anggota.length;
    let selesai = false;
    try {
      for (let halaman = 1; halaman <= 20 && !selesai; halaman++) {
        const jawab = await panggilRumahweb(env, 'aplikasi/list', {
          page: halaman, per_page: 100, sort: 'default'
        });
        if (!jawab || jawab.status !== 200 || !Array.isArray(jawab.data)) {
          throw new Error((jawab && jawab.message) || 'daftar aplikasi tidak tersedia');
        }
        const total = jawab.pagination && Number(jawab.pagination.total);
        if (!jawab.data.length || (halaman > 1 && total === anggota.length - awal)) {
          throw new Error('nomor halaman aplikasi berulang; pembacaan dihentikan');
        }
        jawab.data.forEach(function (b) {
          if (!b.id || !b.name) { throw new Error('aplikasi tanpa ID/nama pada halaman ' + halaman); }
          const t = titikUntuk(b.name);
          if (t.cara !== 'provinsi') {
            gagal.push('Aplikasi Kitab Suci / ' + b.name + ' (ID ' + b.id + '): bahasa belum terpetakan ke provinsi');
          }
          const gugus = GUGUS_APLIKASI.find(function (g) {
            return String(b.tag || '').toLocaleLowerCase('id-ID').indexOf('#' + g.tag.toLocaleLowerCase('id-ID')) >= 0;
          });
          urut += 1;
          anggota.push({
            id: 'tm-aplikasi-' + b.id,
            nama: b.name + ' - Aplikasi Kitab Suci',
            kategori: 'Aplikasi Kitab Suci',
            ikon: 'ikon-ponsel',
            inisial: inisialDari(b.name),
            rincian: [
              { label: 'Bahasa', nilai: b.name },
              { label: 'Kategori', nilai: 'Aplikasi Kitab Suci' },
              { label: 'Gugus', nilai: gugus ? gugus.nama : '' },
              { label: 'Provinsi', nilai: t.provinsi },
              { label: 'Sumber', nilai: b.url || 'https://tokomedia.org/koleksi-aplikasi' },
              { label: 'ID sumber', nilai: String(b.id) }
            ],
            lon: t.cara === 'provinsi' ? t.lon : null,
            lat: t.cara === 'provinsi' ? t.lat : null,
            posisi: t.cara === 'provinsi' ? t.posisi : null,
            kodeProvinsi: t.kodeProvinsi,
            kodeKabkota: '',
            kodeKecamatan: '',
            kodeDesa: '',
            provinsi: t.provinsi,
            kabkota: '',
            kecamatan: '',
            desa: ''
          });
        });
        const jumlah = anggota.length - awal;
        if (jawab.pagination) {
          if (!Number.isFinite(total) || total < 0 || total > 10000 || jumlah > total) {
            throw new Error('total aplikasi tidak konsisten dengan halaman yang dibaca');
          }
          selesai = jumlah === total;
        } else {
          selesai = jawab.data.length < 100;
        }
      }
      if (!selesai) { throw new Error('daftar aplikasi melebihi batas 2.000 rekaman'); }
    } catch (e) {
      anggota.splice(awal);
      gagal.push('Aplikasi Kitab Suci: pembacaan lengkap dibatalkan; ' + e.message);
      gagalBaca.push('Aplikasi Kitab Suci');
    }
    if (anggota.length > awal) {
      sebarPerProvinsi(anggota.slice(awal), 0.86, 0.36);
    }
  }

  /* Clip Kitab Suci — satu kategori Indonesia pada sumber saat ini.
     Simpan jumlah video, tetapi jangan mengarang lokasi provinsi. */
  if (!pilih || !pilih.length || pilih.indexOf('Clip Kitab Suci') >= 0) {
    let jawab = null;
    try {
      jawab = await panggilRumahweb(env, 'ckitab/index', { per_page: 100 });
    } catch (e) {
      gagal.push('Clip Kitab Suci: ' + e.message);
      gagalBaca.push('Clip Kitab Suci');
    }
    if (jawab && jawab.status === 200 && Array.isArray(jawab.data) && jawab.data.length) {
      urut += 1;
      anggota.push({
        id: 'tm-clip-indonesia',
        nama: 'Clip Kitab Suci - Indonesia',
        kategori: 'Clip Kitab Suci',
        ikon: 'ikon-putar',
        inisial: 'CL',
        rincian: [
          { label: 'Bahasa', nilai: 'Indonesia' },
          { label: 'Kategori', nilai: 'Clip Kitab Suci' },
          { label: 'Jumlah video', nilai: String(jawab.data.length) },
          { label: 'Provinsi', nilai: '' },
          { label: 'Sumber', nilai: 'https://tokomedia.org/clip' }
        ],
        lon: null,
        lat: null,
        posisi: null,
        kodeProvinsi: '',
        kodeKabkota: '',
        kodeKecamatan: '',
        kodeDesa: '',
        provinsi: '',
        kabkota: '',
        kecamatan: '',
        desa: ''
      });
    } else if (!jawab || jawab.status !== 200) {
      gagal.push('Clip Kitab Suci: tidak ada data');
      gagalBaca.push('Clip Kitab Suci');
    }
  }

  return { anggota: anggota, gagal: gagal, gagalBaca: gagalBaca };
}

export default {
  async fetch(permintaan, env) {
    const asal = permintaan.headers.get('Origin') || '';
    const asalDikenal = DAFTAR_ASAL.indexOf(asal) >= 0 ? asal : null;

    if (permintaan.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: kepala(asalDikenal) });
    }
    if (permintaan.method !== 'POST') {
      return balas({ ok: false, pesan: 'Hanya menerima POST.' }, asalDikenal, 405);
    }
    if (!asalDikenal) {
      return balas({ ok: false, pesan: 'Asal tidak diizinkan: ' + (asal || 'kosong') }, null, 403);
    }
    if (!env.DATABASE_URL) {
      return balas({ ok: false, pesan: 'DATABASE_URL belum diisi di Worker.' }, asalDikenal, 500);
    }

    let isi;
    try {
      isi = await permintaan.json();
    } catch (e) {
      return balas({ ok: false, pesan: 'Isi permintaan bukan JSON.' }, asalDikenal, 400);
    }

    const aksi = teks(isi.aksi, 40);
    const sql = neon(env.DATABASE_URL);

    /* Semua aksi wajib memakai kunci aplikasi. Data anggota bersifat internal,
       jadi tidak boleh bisa dibaca orang lain walau alamat Worker diketahui. */
        if (!env.KUNCI || teks(isi.kunci, 200) !== env.KUNCI) {
          return balas({ ok: false, pesan: 'Kunci aplikasi salah.' }, asalDikenal, 401);
        }

    try {
      if (aksi === 'cek') {
        const r = await sql`select count(*)::int as n from anggota`;
        return balas({ ok: true, pesan: 'tersambung', jumlah: r[0].n }, asalDikenal);
      }

      if (aksi === 'ambilSemua') {
        const a = await sql`select * from anggota order by dibuat`;
        const k = await sql`select nama from kategori order by nama`;
        const p = await sql`select nama, nilai from pengaturan`;
        return balas({
          ok: true,
          anggota: a.map(keSitus),
          kategori: k.map(function (r) { return r.nama; }),
          pengaturan: p.reduce(function (o, r) { o[r.nama] = r.nilai; return o; }, {})
        }, asalDikenal);
      }

      if (aksi === 'simpanAnggota') {
        const g = isi.anggota || {};
        const id = teks(g.id, 60);
        if (!id) { return balas({ ok: false, pesan: 'id anggota kosong.' }, asalDikenal, 400); }
        if (!teks(g.nama, 200)) { return balas({ ok: false, pesan: 'nama anggota kosong.' }, asalDikenal, 400); }

        const baris = await sql`
          insert into anggota (
            id, nama, kategori, inisial, rincian, lon, lat,
            kode_provinsi, kode_kabkota, kode_kecamatan, kode_desa,
            provinsi, kabkota, kecamatan, desa, dibuat, diubah
          ) values (
            ${id}, ${teks(g.nama, 200)}, ${teks(g.kategori, 100)}, ${teks(g.inisial, 3)},
            ${JSON.stringify(senarai(g.rincian))}::jsonb,
            ${angka(g.lon)}, ${angka(g.lat)},
            ${teks(g.kodeProvinsi, 20)}, ${teks(g.kodeKabkota, 20)},
            ${teks(g.kodeKecamatan, 20)}, ${teks(g.kodeDesa, 20)},
            ${teks(g.provinsi, 200)}, ${teks(g.kabkota, 200)},
            ${teks(g.kecamatan, 200)}, ${teks(g.desa, 200)},
            ${g.dibuat || new Date().toISOString()}::timestamptz,
            ${g.diubah || new Date().toISOString()}::timestamptz
          )
          on conflict (id) do update set
            nama = excluded.nama, kategori = excluded.kategori,
            inisial = excluded.inisial, rincian = excluded.rincian,
            lon = excluded.lon, lat = excluded.lat,
            kode_provinsi = excluded.kode_provinsi,
            kode_kabkota = excluded.kode_kabkota,
            kode_kecamatan = excluded.kode_kecamatan,
            kode_desa = excluded.kode_desa,
            provinsi = excluded.provinsi, kabkota = excluded.kabkota,
            kecamatan = excluded.kecamatan, desa = excluded.desa,
            diubah = excluded.diubah
          returning *`;
        return balas({ ok: true, anggota: keSitus(baris[0]) }, asalDikenal);
      }

      if (aksi === 'simpanAnggotaBanyak') {
        const daftar = Array.isArray(isi.anggota) ? isi.anggota : [];
        if (!daftar.length) {
          return balas({ ok: false, pesan: 'Daftar anggota kosong.' }, asalDikenal, 400);
        }
        if (daftar.length > 2000) {
          return balas({ ok: false, pesan: 'Terlalu banyak: ' + daftar.length + ' (maks 2000).' }, asalDikenal, 400);
        }

        /* Dikirim per kelompok 100 baris dalam SATU perintah. Cara ini
           jauh lebih cepat daripada 699 perintah terpisah, dan tetap
           aman karena tiap nilai tetap dikirim sebagai parameter
           (bukan disambung ke dalam teks perintah). */
        const SAH = daftar.filter(function (g) {
          return g && teks(g.id, 60) && teks(g.nama, 200);
        });
        if (!SAH.length) {
          return balas({ ok: false, pesan: 'Tidak ada baris yang sah.' }, asalDikenal, 400);
        }

        const KELOMPOK = 100;
        let masuk = 0;
        for (let mulai = 0; mulai < SAH.length; mulai += KELOMPOK) {
          const bagian = SAH.slice(mulai, mulai + KELOMPOK);
          const nilai = [];
          const arg = [];
          bagian.forEach(function (g, i) {
            const o = i * 17;
            nilai.push('($' + (o + 1) + ',$' + (o + 2) + ',$' + (o + 3) + ',$' + (o + 4) +
              ',$' + (o + 5) + '::jsonb,$' + (o + 6) + ',$' + (o + 7) +
              ',$' + (o + 8) + ',$' + (o + 9) + ',$' + (o + 10) + ',$' + (o + 11) +
              ',$' + (o + 12) + ',$' + (o + 13) + ',$' + (o + 14) + ',$' + (o + 15) +
              ',$' + (o + 16) + '::timestamptz,$' + (o + 17) + '::timestamptz)');
            arg.push(
              teks(g.id, 60), teks(g.nama, 200), teks(g.kategori, 100), teks(g.inisial, 3),
              JSON.stringify(senarai(g.rincian)),
              angka(g.lon), angka(g.lat),
              teks(g.kodeProvinsi, 20), teks(g.kodeKabkota, 20),
              teks(g.kodeKecamatan, 20), teks(g.kodeDesa, 20),
              teks(g.provinsi, 200), teks(g.kabkota, 200),
              teks(g.kecamatan, 200), teks(g.desa, 200),
              g.dibuat || new Date().toISOString(),
              g.diubah || new Date().toISOString()
            );
          });

          const perintah =
            'insert into anggota (' +
            'id, nama, kategori, inisial, rincian, lon, lat,' +
            'kode_provinsi, kode_kabkota, kode_kecamatan, kode_desa,' +
            'provinsi, kabkota, kecamatan, desa, dibuat, diubah' +
            ') values ' + nilai.join(',') +
            ' on conflict (id) do update set' +
            ' nama = excluded.nama, kategori = excluded.kategori,' +
            ' inisial = excluded.inisial, rincian = excluded.rincian,' +
            ' lon = excluded.lon, lat = excluded.lat,' +
            ' kode_provinsi = excluded.kode_provinsi,' +
            ' kode_kabkota = excluded.kode_kabkota,' +
            ' kode_kecamatan = excluded.kode_kecamatan,' +
            ' kode_desa = excluded.kode_desa,' +
            ' provinsi = excluded.provinsi, kabkota = excluded.kabkota,' +
            ' kecamatan = excluded.kecamatan, desa = excluded.desa,' +
            ' diubah = excluded.diubah';

          await sql.query(perintah, arg);
          masuk += bagian.length;
        }
        return balas({ ok: true, jumlah: masuk }, asalDikenal);
      }

      if (aksi === 'tarikTokomedia') {
        const pilih = Array.isArray(isi.kategori) ? isi.kategori : null;
        const hasil = await tarikTokomedia(pilih);
        if (!hasil.anggota.length) {
          return balas({
            ok: false,
            pesan: 'Tidak ada data yang berhasil ditarik.',
            gagal: hasil.gagal
          }, asalDikenal, 502);
        }
        return balas({
          ok: true,
          anggota: hasil.anggota,
          jumlah: hasil.anggota.length,
          gagal: hasil.gagal
        }, asalDikenal);
      }

      if (aksi === 'tarikRumahweb') {
        if (!env.RUMAHWEB_KUNCI) {
          return balas({
            ok: false,
            pesan: 'Kunci jembatan Rumahweb belum dipasang di Worker.'
          }, asalDikenal, 500);
        }
        const pilih = Array.isArray(isi.kategori) ? isi.kategori : null;
        const hasil = await tarikRumahweb(env, pilih);
        if (!hasil.anggota.length) {
          return balas({
            ok: false,
            pesan: 'Tidak ada data yang berhasil ditarik dari Rumahweb.',
            gagal: hasil.gagal
          }, asalDikenal, 502);
        }
        return balas({
          ok: true,
          anggota: hasil.anggota,
          jumlah: hasil.anggota.length,
          gagal: hasil.gagal,
          gagalBaca: hasil.gagalBaca
        }, asalDikenal);
      }

      if (aksi === 'hapusAnggota') {
        const id = teks(isi.id, 60);
        if (!id) { return balas({ ok: false, pesan: 'id anggota kosong.' }, asalDikenal, 400); }
        await sql`delete from anggota where id = ${id}`;
        return balas({ ok: true, id: id }, asalDikenal);
      }

      if (aksi === 'kosongkan') {
        await sql`delete from anggota`;
        return balas({ ok: true }, asalDikenal);
      }

      if (aksi === 'simpanKategori') {
        const nama = teks(isi.nama, 100);
        if (!nama) { return balas({ ok: false, pesan: 'nama kategori kosong.' }, asalDikenal, 400); }
        await sql`insert into kategori (nama) values (${nama}) on conflict (nama) do nothing`;
        return balas({ ok: true, nama: nama }, asalDikenal);
      }

      if (aksi === 'hapusKategori') {
        const nama = teks(isi.nama, 100);
        await sql`delete from kategori where nama = ${nama}`;
        return balas({ ok: true, nama: nama }, asalDikenal);
      }

      if (aksi === 'simpanAtur') {
        const nama = teks(isi.nama, 100);
        const nilai = teks(isi.nilai, 2000);
        await sql`
          insert into pengaturan (nama, nilai) values (${nama}, ${nilai})
          on conflict (nama) do update set nilai = excluded.nilai`;
        return balas({ ok: true, nama: nama, nilai: nilai }, asalDikenal);
      }

      return balas({ ok: false, pesan: 'Aksi tidak dikenal: ' + aksi }, asalDikenal, 400);
    } catch (e) {
      return balas({ ok: false, pesan: 'Galat database: ' + e.message }, asalDikenal, 500);
    }
  }
};