/* Pengambil data agama Dukcapil Kemendagri — 4 tingkat, TANPA batas wilayah
   ------------------------------------------------------------------
   Sumber: ArcGIS FeatureServer Ditjen Dukcapil Kemendagri — tanpa kunci API.
     https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services/<layanan>/FeatureServer/<lapisan>
     · AGR_VISUAL_PROP_FIX / 1  →     38 provinsi
     · AGR_VISUAL_KAB_FIX  / 3  →    514 kab/kota
     · AGR_VISUAL_KEC_FIX  / 2  →  7.285 kecamatan
     · AGR_VISUAL_KEL_FIX  / 0  → 83.489 desa/kelurahan

   Berbeda dari alat/ambil-dukcapil.js, alat ini TIDAK mengambil batas
   wilayah (returnGeometry=false). Batas wilayah sudah ada di
   data/wilayah-warna/ (73 MB) dan tidak perlu diunduh ulang. Yang diambil
   hanya angka: jumlah penduduk + 7 kolom agama.

   Cara pakai:
     node alat/ambil-agama.js --tingkat=provinsi,kabkota
     node alat/ambil-agama.js --tingkat=kecamatan
     node alat/ambil-agama.js --tingkat=desa
     node alat/ambil-agama.js --tingkat=desa --hanya=1116
     node alat/ambil-agama.js --tingkat=desa --ulang     (paksa ambil ulang)

   Hasil: data/agama/<kunci kecil>-<bagian>.js
     window.AGAMA_PROP / AGAMA_KAB / AGAMA_KEC / AGAMA_DESA
     a = [kode…, nama, jumlah_penduduk, islam, kristen, katholik, hindu,
          budha, konghucu, kepercayaan]
   Susunan kolom sengaja disamakan dengan data/wilayah-warna/ supaya
   `banyakKolom()` di js/warna.js bisa dipakai apa adanya:
   a[banyakKolom] = jumlah penduduk, a[banyakKolom + 1] = islam, dst. */

'use strict';

const fs = require('fs');
const path = require('path');

const AKAR = path.join(__dirname, '..');
const KELUARAN = path.join(AKAR, 'data', 'agama');
const WARNA_DIR = path.join(AKAR, 'data', 'wilayah-warna');
const HOST = 'https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services';

/* Nama kolom di layanan Dukcapil ditulis `katholik` (bukan `katolik`).
   Diperiksa langsung ke layanan 17 Okt 2026 pada keempat tingkat. */
const AGAMA = ['islam', 'kristen', 'katholik', 'hindu', 'budha', 'konghucu', 'kepercayaan'];

const LAYANAN = {
  provinsi: {
    layanan: 'AGR_VISUAL_PROP_FIX', lapisan: 1, kunci: 'PROP',
    kolom: ['no_prop', 'nama_prop'], pecah: null
  },
  kabkota: {
    layanan: 'AGR_VISUAL_KAB_FIX', lapisan: 3, kunci: 'KAB',
    kolom: ['no_prop', 'no_kab', 'nama_kab'], pecah: null
  },
  kecamatan: {
    layanan: 'AGR_VISUAL_KEC_FIX', lapisan: 2, kunci: 'KEC',
    kolom: ['no_prop', 'no_kab', 'no_kec', 'nama_kec'], pecah: 'provinsi'
  },
  desa: {
    layanan: 'AGR_VISUAL_KEL_FIX', lapisan: 0, kunci: 'DESA',
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

const adaFlag = (nama) => process.argv.includes('--' + nama);

const jeda = (ms) => new Promise((r) => setTimeout(r, ms));

/* Saringan dikirim sebagai bagian dari `where`, BUKAN parameter sendiri.
   Diuji 16 Okt 2026 pada alat/ambil-dukcapil.js: mengirim `&no_prop=11`
   sebagai parameter terpisah DIABAIKAN ArcGIS. */
async function ambilSatu(ket, saring, hasil) {
  const kolom = ket.kolom.join(',');
  const where = saring ? '1%3D1' + saring : '1%3D1';
  let geser = hasil.length;
  let ulang = 0;

  for (;;) {
    const u = HOST + '/' + ket.layanan + '/FeatureServer/' + ket.lapisan + '/query?' +
      'where=' + where +
      '&outFields=' + kolom + ',jumlah_penduduk,' + AGAMA.join(',') +
      '&returnGeometry=false' +
      '&orderByFields=objectid&resultOffset=' + geser + '&resultRecordCount=10000' +
      '&f=json';

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

function rapikan(fitur, ket) {
  const p = fitur.attributes;
  if (!p) { return null; }
  const a = ket.kolom.map((k) => p[k]);
  a.push(p.jumlah_penduduk || 0);
  for (const g of AGAMA) { a.push(p[g] || 0); }
  return a;
}

function tulis(ket, bagian, daftar) {
  const nama = ket.kunci.toLowerCase() + '-' + bagian + '.js';
  const berkas = path.join(KELUARAN, nama);
  const isi =
    '/* DATA AGAMA ' + ket.kunci + ' — bagian ' + bagian + ' (Dukcapil Kemendagri)\n' +
    '   Sumber: gis.dukcapil.kemendagri.go.id · ArcGIS FeatureServer, tanpa kunci\n' +
    '   Ambil: ' + new Date().toISOString().slice(0, 10) + ' · tanpa batas wilayah\n' +
    '   Kolom a: [' + ket.kolom.join(', ') + ', jumlah_penduduk, ' + AGAMA.join(', ') + ']\n' +
    '   Dibuat oleh alat/ambil-agama.js — jangan diubah manual. */\n' +
    'window.AGAMA_' + ket.kunci + ' = ' + JSON.stringify(daftar) + ';\n';
  fs.writeFileSync(berkas, isi, 'utf8');
  return { nama, kb: fs.statSync(berkas).size / 1024, baris: daftar.length };
}

/* Daftar kab/kota diambil dari berkas batas wilayah yang sudah ada
   (data/wilayah-warna/desa-<4 angka>.js) — tidak perlu permintaan tambahan. */
function daftarKabupaten() {
  return fs.readdirSync(WARNA_DIR)
    .filter((n) => /^desa-\d{4}\.js$/.test(n))
    .map((n) => n.slice(5, 9))
    .sort();
}

function ringkas(rapi, banyakKolom) {
  const j = { penduduk: 0 };
  for (const g of AGAMA) { j[g] = 0; }
  for (const a of rapi) {
    j.penduduk += a[banyakKolom] || 0;
    for (let i = 0; i < AGAMA.length; i++) { j[AGAMA[i]] += a[banyakKolom + 1 + i] || 0; }
  }
  return j;
}

async function kerjakan(nama, daftarBagian) {
  const ket = LAYANAN[nama];
  const banyakKolom = ket.kolom.length;
  console.log('\n== ' + nama + ' ==');

  if (!ket.pecah) {
    const semua = [];
    await ambilSatu(ket, null, semua);
    const rapi = semua.map((f) => rapikan(f, ket)).filter(Boolean);
    const h = tulis(ket, 'nasional', rapi);
    const j = ringkas(rapi, banyakKolom);
    console.log('  ' + h.nama + ' · ' + h.baris + ' baris · ' + Math.round(h.kb) + ' KB');
    console.log('  penduduk ' + j.penduduk.toLocaleString('id-ID') +
      ' · jumlah 7 agama ' + AGAMA.reduce((s, g) => s + j[g], 0).toLocaleString('id-ID'));
    return;
  }

  const kolomSaring = ket.pecah === 'provinsi' ? 'no_prop' : 'no_kab';
  let semuaRapi = [];
  let lewat = 0;

  for (const bagian of daftarBagian) {
    const namaBerkas = ket.kunci.toLowerCase() + '-' + bagian + '.js';
    if (!adaFlag('ulang') && fs.existsSync(path.join(KELUARAN, namaBerkas))) {
      lewat++;
      continue;
    }

    /* Desa dipecah per kab/kota. `no_kab` saja TIDAK unik — angka 16 ada di
       banyak provinsi. Jadi penyaringnya provinsi + kabupaten. */
    let saring;
    if (ket.pecah === 'kabkota') {
      const kode = String(bagian).padStart(4, '0');
      saring = '%20AND%20no_prop%3D' + Number(kode.slice(0, 2)) +
        '%20AND%20no_kab%3D' + Number(kode.slice(2, 4));
    } else {
      saring = '%20AND%20' + kolomSaring + '%3D' + bagian;
    }

    const kumpul = [];
    await ambilSatu(ket, saring, kumpul);
    if (!kumpul.length) { continue; }
    const rapi = kumpul.map((f) => rapikan(f, ket)).filter(Boolean);
    const h = tulis(ket, bagian, rapi);
    semuaRapi = semuaRapi.concat(rapi);
    console.log('  ' + h.nama + ' · ' + h.baris + ' baris · ' + Math.round(h.kb) + ' KB');
    await jeda(200);
  }

  if (lewat) { console.log('  (' + lewat + ' berkas sudah ada, dilewati)'); }
  if (semuaRapi.length) {
    const j = ringkas(semuaRapi, banyakKolom);
    console.log('  penduduk ' + j.penduduk.toLocaleString('id-ID') +
      ' · jumlah 7 agama ' + AGAMA.reduce((s, g) => s + j[g], 0).toLocaleString('id-ID'));
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
      bagian = daftarKabupaten();
    } else {
      bagian = [null];
    }
    await kerjakan(t, bagian);
  }
  console.log('\nselesai.');
}

mulai().catch((e) => { console.error('GAGAL: ' + e.message); process.exit(1); });
