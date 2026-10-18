/* Pemetaan — pembangkit peta bahasa -> koordinat untuk Worker
   ------------------------------------------------------------------
   TUGAS
     Menghasilkan cloudflare/peta-bahasa.js, yaitu berkas yang dipakai
     Worker untuk menentukan KOORDINAT setiap bahasa yang ditarik dari
     tokomedia.org.

   KENAPA DIWUJUDKAN SEBAGAI BERKAS
     Worker berjalan di Cloudflare, tidak bisa membaca data/wilayah-warna
     (85 MB). Jadi titik tengah provinsi dihitung SEKALI di sini, lalu
     ditanam sebagai angka kecil.

   HASIL
     cloudflare/peta-bahasa.js
       export const BAHASA   = { "Aceh": "11", ... }   nama -> kode provinsi
       export const PROVINSI = { "11": { n: "ACEH", lon, lat }, ... }
       export const GUGUS    = { "Sumatera": { lon, lat }, ... }

   CARA PAKAI
     node alat/buat-peta-bahasa.js
*/

'use strict';

const fs = require('fs');
const path = require('path');

const AKAR = path.resolve(__dirname, '..');
const SUMBER = path.join(__dirname, 'sumber-tokomedia');

/* ---------- provinsi + titik tengah ---------- */

function bacaProvinsi() {
  const berkas = path.join(AKAR, 'data', 'wilayah-warna', 'prop-nasional.js');
  const isi = fs.readFileSync(berkas, 'utf8');
  const mulai = isi.indexOf('window.WARNA_PROP');
  const data = JSON.parse(isi.slice(isi.indexOf('[', mulai), isi.lastIndexOf(']') + 1));

  const peta = {};
  data.forEach(function (d) {
    const kode = String(d.a[0]).padStart(2, '0');
    peta[kode] = { n: d.a[1], tengah: titikTengah(d.g) };
  });
  return peta;
}

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

/* ---------- gugus pulau ----------
   Dipakai sebagai CADANGAN bila ada bahasa baru di tokomedia.org yang
   belum tercatat di peta-provinsi.json. Titiknya = rata-rata titik tengah
   provinsi anggota gugus itu. */

const ANGGOTA_GUGUS = {
  'Sumatera': ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21'],
  'Jawa, Bali, Nusa Tenggara': ['31', '32', '33', '34', '35', '36', '51', '52', '53'],
  'Kalimantan': ['61', '62', '63', '64', '65'],
  'Sulawesi': ['71', '72', '73', '74', '75', '76'],
  'Maluku, Papua': ['81', '82', '91', '92', '93', '94', '95', '96']
};

function bangunGugus(provinsi) {
  const hasil = {};
  Object.keys(ANGGOTA_GUGUS).forEach(function (nama) {
    const kode = ANGGOTA_GUGUS[nama];
    let lon = 0, lat = 0, n = 0;
    kode.forEach(function (k) {
      if (!provinsi[k]) { return; }
      lon += provinsi[k].tengah.lon;
      lat += provinsi[k].tengah.lat;
      n += 1;
    });
    hasil[nama] = { lon: bulat(lon / n), lat: bulat(lat / n) };
  });
  return hasil;
}

function bulat(n) {
  return Math.round(n * 10000) / 10000;
}

/* ---------- tulis ---------- */

const provinsi = bacaProvinsi();
const bahasa = JSON.parse(fs.readFileSync(path.join(SUMBER, 'peta-provinsi.json'), 'utf8'));
delete bahasa._catatan;

const PROVINSI = {};
Object.keys(provinsi).sort().forEach(function (k) {
  PROVINSI[k] = {
    n: provinsi[k].n,
    lon: bulat(provinsi[k].tengah.lon),
    lat: bulat(provinsi[k].tengah.lat)
  };
});

const GUGUS = bangunGugus(provinsi);

const isi = [
  '/* Pemetaan — peta bahasa -> koordinat (dipakai Worker)',
  '   ------------------------------------------------------------------',
  '   JANGAN diubah manual. Bangkitkan ulang dengan:',
  '     node alat/buat-peta-bahasa.js',
  '',
  '   BAHASA   nama bahasa tokomedia.org -> kode provinsi Dukcapil',
  '   PROVINSI kode provinsi -> nama + titik tengah kotak batas',
  '   GUGUS    cadangan bila ada bahasa baru yang belum terpetakan',
  '',
  '   Jumlah bahasa terpetakan: ' + Object.keys(bahasa).length,
  '*/',
  '',
  'export const BAHASA = ' + JSON.stringify(bahasa, null, 0).replace(/\},"/g, '},\n"') + ';',
  '',
  'export const PROVINSI = ' + JSON.stringify(PROVINSI, null, 0).replace(/\},"/g, '},\n"') + ';',
  '',
  'export const GUGUS = ' + JSON.stringify(GUGUS, null, 0) + ';',
  ''
].join('\n');

const tujuan = path.join(AKAR, 'cloudflare', 'peta-bahasa.js');
fs.writeFileSync(tujuan, isi, 'utf8');

console.log('OK  ' + Object.keys(bahasa).length + ' bahasa · ' +
  Object.keys(PROVINSI).length + ' provinsi · ' + Object.keys(GUGUS).length + ' gugus');
console.log('    -> ' + path.relative(AKAR, tujuan) +
  ' (' + Math.round(fs.statSync(tujuan).size / 1024) + ' KB)');
