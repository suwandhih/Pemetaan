/* Pemetaan — pembangkit peta bahasa -> koordinat untuk Worker
   ------------------------------------------------------------------
   TUGAS
     Menghasilkan cloudflare/peta-bahasa.js, yaitu berkas yang dipakai
     Worker untuk menentukan KOORDINAT setiap bahasa yang ditarik dari
     tokomedia.org.

   KENAPA DIWUJUDKAN SEBAGAI BERKAS
     Worker berjalan di Cloudflare, tidak bisa membaca data/wilayah-warna
     (85 MB). Jadi kandidat titik daratan provinsi dihitung SEKALI di sini,
     lalu ditanam sebagai angka kecil.

   HASIL
     cloudflare/peta-bahasa.js
       export const BAHASA   = { "Aceh": "11", ... }   nama -> kode provinsi
       export const PROVINSI = { "11": { n: "ACEH", lon, lat, p: [[lon,lat], ...] }, ... }
       export const GUGUS    = { "Sumatera": { lon, lat }, ... }

   CARA PAKAI
     node alat/buat-peta-bahasa.js
*/

'use strict';

const fs = require('fs');
const path = require('path');

const AKAR = path.resolve(__dirname, '..');
const SUMBER = path.join(__dirname, 'sumber-tokomedia');

/* ---------- provinsi + kandidat titik daratan ---------- */

function bacaProvinsi() {
  const berkas = path.join(AKAR, 'data', 'wilayah-warna', 'prop-nasional.js');
  const isi = fs.readFileSync(berkas, 'utf8');
  const mulai = isi.indexOf('window.WARNA_PROP');
  const data = JSON.parse(isi.slice(isi.indexOf('[', mulai), isi.lastIndexOf(']') + 1));

  const peta = {};
  data.forEach(function (d) {
    const kode = String(d.a[0]).padStart(2, '0');
    const posisi = titikDalamPoligon(d.g);
    peta[kode] = {
      n: d.a[1],
      posisi: posisi,
      tengah: { lon: posisi[0][0], lat: posisi[0][1] }
    };
  });
  return peta;
}

function titikDalamPoligon(geometri) {
  const cincin = [];
  (function kumpul(v) {
    if (typeof v[0][0] === 'number') { cincin.push(v); return; }
    v.forEach(kumpul);
  })(geometri);

  const ring = cincin.reduce(function (terbesar, calon) {
    return Math.abs(luas(calon)) > Math.abs(luas(terbesar || [])) ? calon : terbesar;
  }, null);
  if (!ring) { throw new Error('Poligon provinsi tidak memiliki cincin'); }

  const xs = ring.map(function (p) { return p[0]; });
  const ys = ring.map(function (p) { return p[1]; });
  const minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
  const minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
  const langkah = 36;
  const calon = [];
  for (let x = 0; x < langkah; x++) {
    for (let y = 0; y < langkah; y++) {
      const p = [minX + (x + 0.5) * (maxX - minX) / langkah,
        minY + (y + 0.5) * (maxY - minY) / langkah];
      const bulatP = [bulat(p[0]), bulat(p[1])];
      if (dalamCincin(p, ring) && dalamCincin(bulatP, ring)) { calon.push(bulatP); }
    }
  }
  if (!calon.length) {
    for (let i = 0; i < ring.length; i += Math.max(1, Math.floor(ring.length / 300))) {
      if (dalamCincin(ring[i], ring)) { calon.push(ring[i]); }
    }
  }
  if (!calon.length) { throw new Error('Tidak dapat menemukan titik daratan di dalam poligon'); }

  const titik = [];
  const pusat = calon.reduce(function (s, p) {
    s[0] += p[0] / calon.length;
    s[1] += p[1] / calon.length;
    return s;
  }, [0, 0]);
  calon.sort(function (a, b) {
    return (a[0] - pusat[0]) ** 2 + (a[1] - pusat[1]) ** 2 -
      ((b[0] - pusat[0]) ** 2 + (b[1] - pusat[1]) ** 2);
  });
  titik.push(calon.shift());
  while (calon.length && titik.length < 48) {
    let terbaik = 0, jarakTerbaik = -1;
    calon.forEach(function (p, i) {
      const jarak = Math.min.apply(null, titik.map(function (t) {
        return (p[0] - t[0]) ** 2 + (p[1] - t[1]) ** 2;
      }));
      if (jarak > jarakTerbaik) { terbaik = i; jarakTerbaik = jarak; }
    });
    titik.push(calon.splice(terbaik, 1)[0]);
  }
  return titik.map(function (p) { return [bulat(p[0]), bulat(p[1])]; });
}

function luas(ring) {
  if (!ring || !ring.length) { return 0; }
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return a / 2;
}

function dalamCincin(p, ring) {
  let dalam = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) &&
        p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) {
      dalam = !dalam;
    }
  }
  return dalam;
}

/* ---------- gugus pulau ----------
   Dipakai untuk menampilkan lokasi wakil tiap gugus. Setiap titik wakil
   diambil dari kandidat daratan provinsinya, bukan titik tengah kotak batas. */

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
    lon: provinsi[k].tengah.lon,
    lat: provinsi[k].tengah.lat,
    p: provinsi[k].posisi
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
  '   PROVINSI kode provinsi -> nama + titik-titik di dalam poligon daratan',
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

const tujuanSitus = path.join(AKAR, 'data', 'peta-bahasa.js');
fs.writeFileSync(tujuanSitus,
  '/* Daftar bahasa -> kode provinsi untuk laporan dashboard. Dibangkitkan oleh alat/buat-peta-bahasa.js. */\n' +
  'window.PETA_BAHASA = ' + JSON.stringify(bahasa) + ';\n', 'utf8');

console.log('OK  ' + Object.keys(bahasa).length + ' bahasa · ' +
  Object.keys(PROVINSI).length + ' provinsi · ' + Object.keys(GUGUS).length + ' gugus');
console.log('    -> ' + path.relative(AKAR, tujuan) +
  ' (' + Math.round(fs.statSync(tujuan).size / 1024) + ' KB)');
console.log('    -> ' + path.relative(AKAR, tujuanSitus) +
  ' (' + Math.round(fs.statSync(tujuanSitus).size / 1024) + ' KB)');
