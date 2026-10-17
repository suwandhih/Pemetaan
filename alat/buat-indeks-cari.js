/* Pembuat indeks pencarian wilayah — orderan 19
   ------------------------------------------------------------------
   Membaca berkas batas wilayah yang sudah ada (data/wilayah-warna/*.js)
   lalu mengambil HANYA kode & namanya, tanpa poligon. Hasilnya jauh lebih
   kecil sehingga bisa dimuat cepat saat kotak cari dibuka.

   Diukur 17 Okt 2026 (sebelum dipisah):
     provinsi + kab/kota + kecamatan  →  7.798 entri · ±160 KB
     desa/kelurahan                   → 83.411 entri · ±2,1 MB

   Karena desa 13× lebih besar, hasilnya dipecah dua berkas:
     data/cari-wilayah.js  → provinsi + kab/kota + kecamatan (dimuat segera)
     data/cari-desa.js     → desa/kelurahan (dimuat di latar belakang)

   Bentuk tiap entri: [kode, nama, kodeInduk]
     kodeInduk dipakai untuk menulis "BADUNG · Bali" pada hasil pencarian.

   Cara pakai:  node alat/buat-indeks-cari.js
   Dibuat otomatis — jangan diubah manual. */

'use strict';

const fs = require('fs');
const path = require('path');

const AKAR = path.join(__dirname, '..');
const MASUK = path.join(AKAR, 'data', 'wilayah-warna');
const KELUAR = path.join(AKAR, 'data');

/* Membaca `window.WARNA_<KUNCI> = [...]` dari sebuah berkas data. */
function bacaDaftar(berkas, kunci) {
  const isi = fs.readFileSync(berkas, 'utf8');
  const tanda = 'window.WARNA_' + kunci + ' = ';
  const i = isi.indexOf(tanda);
  if (i < 0) { throw new Error('tanda tidak ditemukan di ' + berkas); }
  const teks = isi.slice(i + tanda.length).trim().replace(/;\s*$/, '');
  return JSON.parse(teks);
}

/* Kode wilayah resmi dari kolom angka, dengan angka nol di depan supaya
   lebarnya tetap: 2 + 2 + 2 + 4 angka. Sama dengan kodeWilayah() di
   js/warna.js — tanpa penambal ini Buleleng jadi "51.8", bukan "51.08". */
const LEBAR = [2, 2, 2, 4];

function kodeDari(a, kolom) {
  const bagian = [];
  for (let i = 0; i < kolom; i++) {
    bagian.push(String(a[i]).padStart(LEBAR[i], '0'));
  }
  return bagian.join('.');
}

function induk(kode, tingkat) {
  const b = kode.split('.');
  return b.slice(0, tingkat - 1).join('.');
}

function tulis(namaBerkas, kunci, daftar, catatan) {
  const berkas = path.join(KELUAR, namaBerkas);
  const isi =
    '/* INDEKS PENCARIAN — ' + catatan + '\n' +
    '   Sumber: data/wilayah-warna/*.js (Dukcapil Kemendagri)\n' +
    '   Dibuat: ' + new Date().toISOString().slice(0, 10) + ' oleh alat/buat-indeks-cari.js\n' +
    '   Bentuk: [kode, nama, kodeInduk] — tanpa poligon, supaya berkasnya kecil.\n' +
    '   Jangan diubah manual. */\n' +
    'window.' + kunci + ' = ' + JSON.stringify(daftar) + ';\n';
  fs.writeFileSync(berkas, isi, 'utf8');
  const kb = fs.statSync(berkas).size / 1024;
  console.log('  ' + namaBerkas + ' · ' + daftar.length + ' entri · ' +
    (kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.round(kb) + ' KB'));
  return daftar.length;
}

function mulai() {
  console.log('Sumber: ' + MASUK);

  /* --- provinsi + kab/kota + kecamatan --- */
  const wilayah = [];

  bacaDaftar(path.join(MASUK, 'prop-nasional.js'), 'PROP').forEach((d) => {
    wilayah.push([kodeDari(d.a, 1), d.a[1], '']);
  });

  bacaDaftar(path.join(MASUK, 'kab-nasional.js'), 'KAB').forEach((d) => {
    const kode = kodeDari(d.a, 2);
    wilayah.push([kode, d.a[2], induk(kode, 2)]);
  });

  const berkasKec = fs.readdirSync(MASUK).filter((f) => /^kec-\d+\.js$/.test(f));
  berkasKec.forEach((f) => {
    bacaDaftar(path.join(MASUK, f), 'KEC').forEach((d) => {
      const kode = kodeDari(d.a, 3);
      wilayah.push([kode, d.a[3], induk(kode, 3)]);
    });
  });

  console.log('\n== wilayah (provinsi + kab/kota + kecamatan) ==');
  tulis('cari-wilayah.js', 'CARI_WILAYAH', wilayah,
    'provinsi · kabupaten/kota · kecamatan');

  /* --- desa/kelurahan --- */
  const desa = [];
  const berkasDesa = fs.readdirSync(MASUK).filter((f) => /^desa-\d+\.js$/.test(f));
  berkasDesa.forEach((f) => {
    bacaDaftar(path.join(MASUK, f), 'DESA').forEach((d) => {
      const kode = kodeDari(d.a, 4);
      desa.push([kode, d.a[4], induk(kode, 4)]);
    });
  });

  console.log('\n== desa/kelurahan ==');
  tulis('cari-desa.js', 'CARI_DESA', desa, 'desa/kelurahan');

  console.log('\nselesai.');
}

mulai();
