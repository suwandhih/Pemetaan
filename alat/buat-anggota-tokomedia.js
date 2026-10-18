/* Pemetaan — pembangkit data anggota dari tokomedia.org
   ------------------------------------------------------------------
   TUGAS
     Mengubah daftar bahasa tokomedia.org (5 kategori) menjadi berkas
     data anggota yang dipakai aplikasi Pemetaan.

   SUMBER
     alat/sumber-tokomedia/<kategori>.csv   daftar bahasa per kategori
     alat/sumber-tokomedia/peta-provinsi.json  nama bahasa -> kode provinsi
     data/wilayah-warna/prop-nasional.js    nama + batas provinsi

   HASIL
     data/anggota-tokomedia.js  ->  window.ANGGOTA_TOKOMEDIA = [...]

   CARA PAKAI
     node alat/buat-anggota-tokomedia.js

   CATATAN PENTING
     · Satu bahasa di satu kategori = satu anggota. Bahasa yang muncul di
       3 kategori menjadi 3 anggota (sesuai keputusan pemilik proyek).
     · Titik peta = titik tengah kotak batas provinsi asal bahasa. Ini
       PERKIRAAN — tokomedia.org tidak menerbitkan koordinat.
     · Tiap kategori digeser sedikit (lingkaran kecil) supaya 5 anggota
       dari provinsi yang sama tidak bertumpuk tepat di satu titik.
*/

'use strict';

const fs = require('fs');
const path = require('path');

const AKAR = path.resolve(__dirname, '..');
const SUMBER = path.join(__dirname, 'sumber-tokomedia');

/* ---------- kategori ---------- */

const KATEGORI = [
  { berkas: 'film-isa', nama: 'Film Isa Al-Masih', ikon: 'ikon-orang' },
  { berkas: 'film-ikatan', nama: 'Film Ikatan Ilahi', ikon: 'ikon-rantai' },
  { berkas: 'video-ks', nama: 'Video Kitab Suci', ikon: 'ikon-kamera' },
  { berkas: 'clip-ks', nama: 'Clip Kitab Suci', ikon: 'ikon-putar' },
  { berkas: 'aplikasi', nama: 'Aplikasi Kitab Suci', ikon: 'ikon-ponsel' }
];

/* ---------- baca CSV sederhana ---------- */

function bacaCsv(nama) {
  const isi = fs.readFileSync(path.join(SUMBER, nama), 'utf8').replace(/^\uFEFF/, '');
  const baris = isi.split(/\r?\n/).filter(function (b) { return b.trim() !== ''; });
  const kepala = pecah(baris[0]);
  return baris.slice(1).map(function (b) {
    const sel = pecah(b);
    const o = {};
    kepala.forEach(function (k, i) { o[k] = sel[i] || ''; });
    return o;
  });
}

function pecah(baris) {
  const hasil = [];
  let kini = '';
  let dalamKutip = false;
  for (let i = 0; i < baris.length; i++) {
    const c = baris[i];
    if (c === '"') {
      if (dalamKutip && baris[i + 1] === '"') { kini += '"'; i++; }
      else { dalamKutip = !dalamKutip; }
    } else if (c === ',' && !dalamKutip) {
      hasil.push(kini); kini = '';
    } else {
      kini += c;
    }
  }
  hasil.push(kini);
  return hasil;
}

/* ---------- baca provinsi + titik tengah ---------- */

function bacaProvinsi() {
  const berkas = path.join(AKAR, 'data', 'wilayah-warna', 'prop-nasional.js');
  const isi = fs.readFileSync(berkas, 'utf8');
  const mulai = isi.indexOf('window.WARNA_PROP');
  const data = JSON.parse(isi.slice(isi.indexOf('[', mulai), isi.lastIndexOf(']') + 1));

  const peta = {};
  data.forEach(function (d) {
    const kode = String(d.a[0]).padStart(2, '0');
    peta[kode] = { kode: kode, nama: d.a[1], tengah: titikTengah(d.g) };
  });
  return peta;
}

/* Titik tengah = pusat kotak batas (bukan titik berat). Dipilih karena
   lebih mudah dipahami: titiknya selalu berada di dalam kotak wilayah. */
function titikTengah(geometri) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  (function jelajah(v) {
    if (typeof v[0] === 'number') {
      if (v[0] < minX) { minX = v[0]; }
      if (v[0] > maxX) { maxX = v[0]; }
      if (v[1] < minY) { minY = v[1]; }
      if (v[1] > maxY) { maxY = v[1]; }
      return;
    }
    v.forEach(jelajah);
  })(geometri);
  return { lon: (minX + maxX) / 2, lat: (minY + maxY) / 2 };
}

/* ---------- bantu ---------- */

function inisial(nama) {
  const bersih = nama.replace(/^Bahasa\s+/i, '').replace(/[^A-Za-z]/g, '');
  return (bersih.slice(0, 2) || '??').toUpperCase();
}

function bulat(n) {
  return Math.round(n * 10000) / 10000;
}

/* Geser titik sedikit per kategori supaya tidak bertumpuk tepat.
   Jari-jari 0,12 derajat ≈ 13 km — masih di dalam provinsi. */
function geser(titik, urutan, jumlah) {
  if (jumlah <= 1) { return titik; }
  const sudut = (2 * Math.PI * urutan) / jumlah - Math.PI / 2;
  const r = 0.12;
  return {
    lon: bulat(titik.lon + r * Math.cos(sudut)),
    lat: bulat(titik.lat + r * Math.sin(sudut))
  };
}

/* ---------- bangun ---------- */

function bangun() {
  const provinsi = bacaProvinsi();
  const petaProvinsi = JSON.parse(
    fs.readFileSync(path.join(SUMBER, 'peta-provinsi.json'), 'utf8')
  );

  const anggota = [];
  const belumDipetakan = [];
  let urut = 0;

  KATEGORI.forEach(function (kat, iKat) {
    const baris = bacaCsv(kat.berkas + '.csv');

    baris.forEach(function (b) {
      const nama = (b.nama || '').trim();
      if (!nama) { return; }

      const kode = petaProvinsi[nama];
      if (!kode) { belumDipetakan.push(nama); return; }

      const prov = provinsi[kode];
      if (!prov) { belumDipetakan.push(nama + ' (kode ' + kode + ')'); return; }

      const titik = geser(prov.tengah, iKat, KATEGORI.length);
      urut += 1;

      anggota.push({
        id: 'tm-' + String(urut).padStart(4, '0'),
        nama: nama + ' - ' + kat.nama,
        kategori: kat.nama,
        ikon: kat.ikon,
        inisial: inisial(nama),
        rincian: [
          { label: 'Bahasa', nilai: nama },
          { label: 'Kategori', nilai: kat.nama },
          { label: 'Gugus', nilai: (b.grup || '').trim() },
          { label: 'Provinsi', nilai: prov.nama },
          { label: 'Sumber', nilai: 'https://tokomedia.org' + (b.url || '') }
        ],
        lon: titik.lon,
        lat: titik.lat,
        kodeProvinsi: prov.kode,
        kodeKabkota: '',
        kodeKecamatan: '',
        kodeDesa: '',
        provinsi: prov.nama,
        kabkota: '',
        kecamatan: '',
        desa: ''
      });
    });
  });

  return { anggota: anggota, belumDipetakan: belumDipetakan };
}

/* ---------- tulis ---------- */

const hasil = bangun();

if (hasil.belumDipetakan.length) {
  console.error('GAGAL: ada bahasa yang belum punya provinsi:');
  hasil.belumDipetakan.forEach(function (n) { console.error('  - ' + n); });
  process.exit(1);
}

const kepala = [
  '/* DATA ANGGOTA — hasil olahan tokomedia.org',
  '   ------------------------------------------------------------------',
  '   JANGAN diubah manual. Bangkitkan ulang dengan:',
  '     node alat/buat-anggota-tokomedia.js',
  '',
  '   Sumber: https://tokomedia.org (5 kategori, daftar bahasa per gugus)',
  '   Titik peta = titik tengah kotak batas provinsi asal bahasa (PERKIRAAN).',
  '   Jumlah anggota: ' + hasil.anggota.length,
  '*/',
  ''
].join('\n');

const isi = kepala +
  'window.ANGGOTA_TOKOMEDIA = ' +
  JSON.stringify(hasil.anggota, null, 0).replace(/\},\{/g, '},\n{') +
  ';\n';

const tujuan = path.join(AKAR, 'data', 'anggota-tokomedia.js');
fs.writeFileSync(tujuan, isi, 'utf8');

const perKategori = {};
hasil.anggota.forEach(function (a) { perKategori[a.kategori] = (perKategori[a.kategori] || 0) + 1; });

console.log('OK  ' + hasil.anggota.length + ' anggota -> ' + path.relative(AKAR, tujuan));
Object.keys(perKategori).forEach(function (k) {
  console.log('    ' + k + ': ' + perKategori[k]);
});
console.log('    ukuran: ' + Math.round(fs.statSync(tujuan).size / 1024) + ' KB');
