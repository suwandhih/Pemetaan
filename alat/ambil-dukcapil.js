/* Pengambil data Dukcapil Kemendagri — penduduk + batas wilayah 4 tingkat
   (provinsi · kab/kota · kecamatan · desa/kelurahan)
   ------------------------------------------------------------------
   Sumber: ArcGIS FeatureServer Ditjen Dukcapil Kemendagri — tanpa kunci API.
     https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services/<layanan>/FeatureServer/<lapisan>
     · AGR_VISUAL_PROP_FIX / 1  →     38 provinsi
     · AGR_VISUAL_KAB_FIX  / 3  →    514 kab/kota
     · AGR_VISUAL_KEC_FIX  / 2  →  7.285 kecamatan
     · AGR_VISUAL_KEL_FIX  / 0  → 83.489 desa/kelurahan
   Diuji 16 Okt 2026: HTTP 200 · CORS `*` · tanpa kunci.

   Cara pakai:
     node alat/ambil-dukcapil.js --tingkat=provinsi,kabkota
     node alat/ambil-dukcapil.js --tingkat=desa --hanya=33      (1 provinsi)
     node alat/ambil-dukcapil.js --tingkat=desa --hanya=3314    (1 kabupaten)

   Penyederhana poligon (`maxAllowableOffset`, derajat) — diukur 16 Okt 2026:
     provinsi  0,02   → 1,4 MB · 83.439 titik      0,05 → 1,2 MB
     kab/kota  0,01   → 1,9 MB · 514 fitur         0,05 → 1,3 MB
     kecamatan 0,01   → 249 KB per 576 fitur
     desa      0,0005 → 159 KB per 239 desa (28 titik/desa, halus)
   Dipakai: provinsi 0,02 · kab/kota 0,01 · kecamatan 0,01 · desa 0,0005.

   Hasil: data/wilayah-warna/<tingkat>-<bagian>.js */

'use strict';

const fs = require('fs');
const path = require('path');

const AKAR = path.join(__dirname, '..');
const KELUARAN = path.join(AKAR, 'data', 'wilayah-warna');
const HOST = 'https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services';

const LAYANAN = {
  provinsi: {
    layanan: 'AGR_VISUAL_PROP_FIX', lapisan: 1, kunci: 'PROP', offset: 0.02,
    kolom: ['no_prop', 'nama_prop'], pecah: null
  },
  kabkota: {
    layanan: 'AGR_VISUAL_KAB_FIX', lapisan: 3, kunci: 'KAB', offset: 0.01,
    kolom: ['no_prop', 'no_kab', 'nama_kab'], pecah: null
  },
  kecamatan: {
    layanan: 'AGR_VISUAL_KEC_FIX', lapisan: 2, kunci: 'KEC', offset: 0.01,
    kolom: ['no_prop', 'no_kab', 'no_kec', 'nama_kec'], pecah: 'provinsi'
  },
  desa: {
    layanan: 'AGR_VISUAL_KEL_FIX', lapisan: 0, kunci: 'DESA', offset: 0.0005,
    kolom: ['no_prop', 'no_kab', 'no_kec', 'no_kel', 'nama_kel'], pecah: 'kabkota'
  }
};

/* 38 kode provinsi Indonesia menurut Kepmendagri. */
const PROVINSI = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 31, 32, 33, 34, 35, 36,
  51, 52, 53, 61, 62, 63, 64, 65, 71, 72, 73, 74, 75, 76,
  81, 82, 91, 92, 93, 94, 95, 96
];

function arg(nama, bawaan) {
  const cari = '--' + nama + '=';
  const t = process.argv.find((a) => a.startsWith(cari));
  return t ? t.slice(cari.length) : bawaan;
}

const jeda = (ms) => new Promise((r) => setTimeout(r, ms));

/* Saringan dikirim sebagai bagian dari `where`, BUKAN parameter sendiri.
   Diuji 16 Okt 2026: mengirim `&no_prop=11` sebagai parameter terpisah
   DIABAIKAN ArcGIS — permintaan 1 provinsi mengembalikan seluruh 7.285
   kecamatan nasional (berkas 3,6 MB × 38, bukan 0,2 MB × 38). */
async function ambilSatu(ket, saring, hasil) {
  const kolom = ket.kolom.join(',');
  const where = saring ? '1%3D1' + saring : '1%3D1';
  let geser = hasil.length;
  let ulang = 0;

  for (;;) {
    const u = HOST + '/' + ket.layanan + '/FeatureServer/' + ket.lapisan + '/query?' +
      'where=' + where +
      '&outFields=' + kolom + ',jumlah_penduduk,jumlah_kk,luas_wilayah,kepadatan_penduduk' +
      '&returnGeometry=true&outSR=4326&maxAllowableOffset=' + ket.offset +
      '&orderByFields=objectid&resultOffset=' + geser + '&resultRecordCount=10000' +
      '&f=geojson';

    let jawab;
    try {
      jawab = await fetch(u);
    } catch (e) {
      if (ulang++ < 4) { await jeda(4000); continue; }
      throw new Error('gagal menyambung: ' + e.message);
    }
    if (!jawab.ok) {
      if (ulang++ < 4) { await jeda(4000); continue; }
      throw new Error('HTTP ' + jawab.status);
    }

    const teks = await jawab.text();
    let isi;
    try {
      isi = JSON.parse(teks);
    } catch (e) {
      if (ulang++ < 4) { await jeda(4000); continue; }
      throw new Error('bukan JSON: ' + teks.slice(0, 200));
    }
    if (isi.error) { throw new Error(JSON.stringify(isi.error).slice(0, 300)); }

    const fitur = isi.features || [];
    for (const f of fitur) { hasil.push(f); }
    if (fitur.length < 10000) { break; }
    geser = hasil.length;
    await jeda(400);
  }
  return hasil;
}

/* 5 angka di belakang koma (±1 m) sudah lebih dari cukup — memangkas ukuran
   berkas tanpa mengubah bentuk yang terlihat. */
function bulatkan(k) {
  if (!k || !k.length) { return k; }
  if (typeof k[0] === 'number') {
    return [Math.round(k[0] * 1e5) / 1e5, Math.round(k[1] * 1e5) / 1e5];
  }
  return k.map(bulatkan);
}

function rapikan(fitur, ket) {
  const p = fitur.properties;
  if (!fitur.geometry || !fitur.geometry.coordinates) { return null; }
  const a = ket.kolom.map((k) => p[k]);
  a.push(p.jumlah_penduduk, p.jumlah_kk, p.luas_wilayah, p.kepadatan_penduduk);
  return {
    k: ket.kolom.map((k) => p[k]).join('.'),
    a: a,
    g: bulatkan(fitur.geometry.coordinates)
  };
}

function tulis(ket, bagian, daftar) {
  const nama = ket.kunci.toLowerCase() + '-' + bagian + '.js';
  const berkas = path.join(KELUARAN, nama);
  const isi =
    '/* DATA ' + ket.kunci + ' — bagian ' + bagian + ' (Dukcapil Kemendagri)\n' +
    '   Sumber: gis.dukcapil.kemendagri.go.id · ArcGIS FeatureServer, tanpa kunci\n' +
    '   Ambil: ' + new Date().toISOString().slice(0, 10) + ' · penyederhana ' + ket.offset + '°\n' +
    '   Kolom a: [' + ket.kolom.join(', ') + ', jumlah_penduduk, jumlah_kk, luas_wilayah, kepadatan_penduduk]\n' +
    '   g = koordinat [bujur, lintang]. Dibuat oleh alat/ambil-dukcapil.js — jangan diubah manual. */\n' +
    'window.WARNA_' + ket.kunci + ' = ' + JSON.stringify(daftar) + ';\n';
  fs.writeFileSync(berkas, isi, 'utf8');
  return { nama, kb: fs.statSync(berkas).size / 1024, baris: daftar.length };
}

/* no_kab sudah memuat penanda jenis: 01-69 kabupaten · 71-99 kota.
   Kode wilayah resmi = provinsi + kabupaten (mis. 11 + 16 = 1116). */
async function daftarKabupaten() {
  const ket = LAYANAN.kabkota;
  const mentah = [];
  await ambilSatu(ket, null, mentah);
  return mentah.map((f) =>
    String(f.properties.no_prop).padStart(2, '0') + String(f.properties.no_kab).padStart(2, '0')
  );
}

async function kerjakan(nama, daftarBagian) {
  const ket = LAYANAN[nama];
  console.log('\n== ' + nama + ' ==');

  if (!ket.pecah) {
    const semua = [];
    await ambilSatu(ket, null, semua);
    const rapi = semua.map((f) => rapikan(f, ket));
    const h = tulis(ket, 'nasional', rapi);
    const jiwa = rapi.reduce((s, r) => s + (r.a[r.a.length - 4] || 0), 0);
    console.log('  ' + h.nama + ' · ' + h.baris + ' baris · ' + Math.round(h.kb / 1024) + ' MB · ' + jiwa.toLocaleString('id-ID') + ' jiwa');
    return;
  }

  const kolomSaring = ket.pecah === 'provinsi' ? 'no_prop' : 'no_kab';
  for (const bagian of daftarBagian) {
      /* Desa dipecah per kab/kota. `no_kab` saja TIDAK unik — angka 16 ada di
         banyak provinsi (Aceh, Jateng, Papua, …). Diukur 16 Okt 2026: tanpa
         memakai provinsi sekaligus, permintaan desa untuk kab 11.16 menarik
         desa dari provinsi lain. Jadi penyaringnya provinsi + kabupaten. */
      let saring;
      if (ket.pecah === 'kabkota') {
        const kode = String(bagian).padStart(4, '0');
        saring = '%20AND%20no_prop%3D' + Number(kode.slice(0, 2)) + '%20AND%20no_kab%3D' + Number(kode.slice(2, 4));
      } else {
        saring = '%20AND%20' + kolomSaring + '%3D' + bagian;
      }

      const kumpul = [];
      await ambilSatu(ket, saring, kumpul);
      if (!kumpul.length) { continue; }
      const rapi = kumpul.map((f) => rapikan(f, ket)).filter(Boolean);
      const buang = kumpul.length - rapi.length;
      if (buang) { console.log('    (dibuang ' + buang + ' baris tanpa geometri)'); }
      const h = tulis(ket, bagian, rapi);
      console.log('  ' + h.nama + ' · ' + h.baris + ' baris · ' + Math.round(h.kb) + ' KB');
      await jeda(250);
    }
  }

async function mulai() {
  fs.mkdirSync(KELUARAN, { recursive: true });

  const tingkat = arg('tingkat', 'provinsi,kabkota').split(',');
  const hanya = arg('hanya', '');

  console.log('Sumber  : ' + HOST);
  console.log('Tingkat : ' + tingkat.join(', '));

  for (const t of tingkat) {
    const ket = LAYANAN[t];
    if (!ket) { console.log('tingkat tidak dikenal: ' + t); continue; }

    let bagian;
    if (hanya) {
      bagian = hanya.split(',');
    } else if (ket.pecah === 'provinsi') {
      bagian = PROVINSI;
    } else if (ket.pecah === 'kabkota') {
      bagian = await daftarKabupaten();
    } else {
      bagian = [null];
    }
    await kerjakan(t, bagian);
  }
  console.log('\nselesai.');
}

mulai().catch((e) => { console.error('GAGAL: ' + e.message); process.exit(1); });