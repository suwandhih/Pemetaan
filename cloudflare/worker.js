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
       cek                                        (uji sambungan)
*/

import { neon } from '@neondatabase/serverless';
import { BAHASA, PROVINSI, GUGUS } from './peta-bahasa.js';

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

   Koordinat: tokomedia.org TIDAK menyimpan lokasi. Jadi titik dihitung
   dari nama bahasa -> provinsi (cloudflare/peta-bahasa.js). Bila nama
   bahasanya belum terpetakan, dipakai titik tengah gugus pulaunya.
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

/* Gugus pulau -> nama yang dipakai di peta-bahasa.js */
const GUGUS_ALIAS = {
  'sumatera': 'Sumatera',
  'jawa, bali, nusa tenggara': 'Jawa, Bali, Nusa Tenggara',
  'jawa - bali - nusa tenggara': 'Jawa, Bali, Nusa Tenggara',
  'kalimantan': 'Kalimantan',
  'sulawesi': 'Sulawesi',
  'maluku, papua': 'Maluku, Papua',
  'maluku - papua': 'Maluku, Papua'
};

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

/* Titik untuk satu bahasa. Urutan: provinsi -> gugus -> tengah Indonesia. */
function titikUntuk(nama, gugus) {
  const kode = BAHASA[nama];
  if (kode && PROVINSI[kode]) {
    return {
      lon: PROVINSI[kode].lon,
      lat: PROVINSI[kode].lat,
      kodeProvinsi: kode,
      provinsi: PROVINSI[kode].n,
      cara: 'provinsi'
    };
  }
  const kunci = GUGUS_ALIAS[String(gugus || '').toLowerCase()];
  if (kunci && GUGUS[kunci]) {
    return {
      lon: GUGUS[kunci].lon,
      lat: GUGUS[kunci].lat,
      kodeProvinsi: '',
      provinsi: '',
      cara: 'gugus'
    };
  }
  return { lon: 118, lat: -2.5, kodeProvinsi: '', provinsi: '', cara: 'indonesia' };
}

function inisialDari(nama) {
  const bersih = String(nama).replace(/^Bahasa\s+/i, '').replace(/[^A-Za-z]/g, '');
  return (bersih.slice(0, 2) || '??').toUpperCase();
}

/* Geser titik sedikit supaya anggota dari provinsi yang sama tidak
   bertumpuk tepat di satu titik. Jari-jari 0,12 derajat ≈ 13 km —
   masih di dalam provinsi. */
function geser(titik, urutan, jumlah, geserSudut, jari) {
  if (jumlah <= 1 && !jari) { return titik; }
  const sudut = (2 * Math.PI * urutan) / Math.max(jumlah, 1) - Math.PI / 2 + (geserSudut || 0);
  const r = jari || 0.12;
  return {
    lon: Math.round((titik.lon + r * Math.cos(sudut)) * 10000) / 10000,
    lat: Math.round((titik.lat + r * Math.sin(sudut)) * 10000) / 10000
  };
}

/* Sebar anggota satu kategori yang berada di provinsi sama ke lingkaran
   kecil. Tanpa ini, semua bahasa dari satu provinsi menumpuk di satu
   titik dan hanya terlihat sebagai satu penanda.

   `putaran` (0..1) menggeser sudut lingkaran per kategori, dan `jari`
   membuat jari-jari berbeda per kategori — supaya anggota dari kategori
   berbeda tidak bertumpuk di titik yang sama. */
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
      const t = geser({ lon: a.lon, lat: a.lat }, i, isi.length, geserSudut, jari);
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
      const t = titikUntuk(b.nama, b.gugus);
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
          { label: 'Provinsi', nilai: t.provinsi || '(perkiraan gugus)' },
          { label: 'Sumber', nilai: 'https://tokomedia.org' + b.url }
        ],
        lon: t.lon,
        lat: t.lat,
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

    /* Sebar anggota kategori ini supaya tidak menumpuk per provinsi.
       Sudut dan jari lingkaran berbeda per kategori. */
    sebarPerProvinsi(anggota.slice(-daftar.length), i / dipakai.length, 0.12 + i * 0.06);
  }

  return { anggota: anggota, gagal: gagal };
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