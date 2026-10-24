/* Pembaruan Dukcapil untuk Data Pemetaan.
   ------------------------------------------------------------------
   Membaca atribut terbaru TANPA mengubah poligon/aplikasi peta. Backup
   Git dibuat sebelum pembaruan, hasil dibangun di folder sementara,
   divalidasi, lalu ditukar dengan laporan lama.

   Biasa (seluruh atribut):
     node alat/perbarui-datapemetaan.js
   Hanya provinsi + kab/kota (mis. pembaruan jumlah penduduk):
     node alat/perbarui-datapemetaan.js --tingkat=provinsi,kabkota
   Satu provinsi:
     node alat/perbarui-datapemetaan.js --tingkat=kecamatan,desa --hanya=33
   Satu kab/kota:
     node alat/perbarui-datapemetaan.js --tingkat=desa --hanya=3301

   Perlu working tree bersih agar backup Git dapat memulihkan data lama.
   Jalankan dari mana saja; lokasi proyek ditentukan dari berkas alat.
*/
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const AKAR = process.env.PEMETAAN_AKAR ? path.resolve(process.env.PEMETAAN_AKAR) : path.resolve(__dirname, '..');
const HOST = process.env.PEMETAAN_HOST || 'https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services';
const AGAMA = ['islam', 'kristen', 'katholik', 'hindu', 'budha', 'konghucu', 'kepercayaan'];
const KODE = { provinsi: [2], kabkota: [2, 2], kecamatan: [2, 2, 2], desa: [2, 2, 2, 4] };
const LAYANAN = {
  provinsi: ['AGR_VISUAL_PROP_FIX', 1, ['no_prop', 'nama_prop'], 'prop'],
  kabkota: ['AGR_VISUAL_KAB_FIX', 3, ['no_prop', 'no_kab', 'nama_kab'], 'kab'],
  kecamatan: ['AGR_VISUAL_KEC_FIX', 2, ['no_prop', 'no_kab', 'no_kec', 'nama_kec'], 'kec'],
  desa: ['AGR_VISUAL_KEL_FIX', 0, ['no_prop', 'no_kab', 'no_kec', 'no_kel', 'nama_kel'], 'desa']
};
const arg = argumen => {
  const a = process.argv.find(x => x.startsWith('--' + argumen + '='));
  return a ? a.slice(argumen.length + 3) : '';
};
const KERING = process.argv.includes('--dry-run');
const LEWATI_BACKUP = process.argv.includes('--tanpa-backup');
if (KERING && LEWATI_BACKUP) { throw new Error('--dry-run sudah tidak mengubah data; jangan gabungkan dengan --tanpa-backup.'); }
const jeda = ms => new Promise(resolve => setTimeout(resolve, ms));
const pad = (n, lebar) => String(n).padStart(lebar, '0');
let KERJA = AKAR;
function kodeBaris(r, tingkat) { return KODE[tingkat].map((n, i) => pad(r[i], n)).join(''); }
function pastikanLengkap(lama, baru, tingkat, bagian) {
  const lamaUnik = new Map(lama.map(r => [kodeBaris(r, tingkat), r]));
  const baruUnik = new Map(baru.map(r => [kodeBaris(r, tingkat), r]));
  const hilang = [...lamaUnik.keys()].filter(k => !baruUnik.has(k));
  if (hilang.length) { throw new Error('Wilayah hilang dari sumber ' + bagian + ': ' + hilang.slice(0, 10).join(', ')); }
  for (const [k, r] of lamaUnik) {
    const b = baruUnik.get(k);
    if (JSON.stringify(r.slice(0, KODE[tingkat].length)) !== JSON.stringify(b.slice(0, KODE[tingkat].length))) { throw new Error('Identitas wilayah berubah pada ' + k + '; tinjau sumber sebelum mengganti.'); }
  }
}
function node(script, args) {
  const r = spawnSync(process.execPath, [path.join(AKAR, script), ...args], { cwd: AKAR, env: { ...process.env, PEMETAAN_AKAR: KERJA }, stdio: 'inherit' });
  if (r.status !== 0) { throw new Error(script + ' gagal (kode ' + r.status + ').'); }
}
function git(args) {
  const r = spawnSync('git', args, { cwd: AKAR, encoding: 'utf8' });
  if (r.status !== 0) { throw new Error(r.stderr || 'Git gagal.'); }
  return r.stdout.trim();
}
function backup(keterangan) {
  const perubahan = git(['status', '--porcelain', '--untracked-files=all', '--', '.', ':!Docs/setting rumahweb.txt']);
  if (perubahan) { throw new Error('Working tree belum bersih. Commit/simpan perubahan dulu sebelum pembaruan Dukcapil.'); }
  git(['commit', '--allow-empty', '-m', 'Backup sebelum pembaruan Data Pemetaan: ' + keterangan, '-m', 'Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>']);
  console.log('Backup Git dibuat. Titik pulih: ' + git(['rev-parse', 'HEAD']));
}
function versiData() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-data';
}
async function ambil(tingkat, saring) {
  const [layanan, lapisan, kolom] = LAYANAN[tingkat];
  const p = new URLSearchParams({
    where: '1=1' + (saring || ''),
    outFields: kolom.join(',') + ',jumlah_penduduk,' + AGAMA.join(','),
    returnGeometry: 'false', resultRecordCount: '10000', orderByFields: 'objectid ASC', f: 'json'
  });
  const hasil = [];
  for (;;) {
    p.set('resultOffset', String(hasil.length));
    const url = HOST + '/' + layanan + '/FeatureServer/' + lapisan + '/query?' + p;
    let r;
    for (let coba = 1; ; coba++) {
      try {
        r = await fetch(url);
        if (!r.ok) { throw new Error('HTTP ' + r.status); }
        break;
      } catch (e) {
        if (coba >= 4) { throw new Error('Dukcapil tidak dapat dibaca: ' + e.message); }
        await jeda(1500 * coba);
      }
    }
    const d = await r.json();
    if (d.error) { throw new Error(JSON.stringify(d.error)); }
    if (!Array.isArray(d.features)) { throw new Error('Respons Dukcapil tidak lengkap.'); }
    d.features.forEach(f => hasil.push(f.attributes));
    if (d.features.length < 10000) { break; }
    if (d.exceededTransferLimit === false) { throw new Error('Pagination Dukcapil tidak dapat diverifikasi.'); }
    await jeda(350);
  }
  return hasil;
}
function baca(berkas, variabel) {
  const s = fs.readFileSync(berkas, 'utf8');
  const mulai = s.indexOf('window.' + variabel);
  if (mulai < 0) { throw new Error('Variabel tidak ada: ' + berkas); }
  return JSON.parse(s.slice(s.indexOf('[', mulai), s.lastIndexOf(']') + 1));
}
function tulis(tingkat, bagian, daftar) {
  const ket = LAYANAN[tingkat];
  const berkas = path.join(KERJA, 'data', 'agama', ket[3] + '-' + bagian + '.js');
  const isi = '/* DATA AGAMA ' + ket[3].toUpperCase() + ' — bagian ' + bagian + ' (Dukcapil Kemendagri)\n' +
    '   Sumber: gis.dukcapil.kemendagri.go.id · ArcGIS FeatureServer, tanpa kunci\n' +
    '   Ambil: ' + new Date().toISOString().slice(0, 10) + ' · tanpa batas wilayah\n' +
    '   Kolom a: [' + ket[2].join(', ') + ', jumlah_penduduk, ' + AGAMA.join(', ') + ']\n' +
    '   Dibuat oleh alat/perbarui-datapemetaan.js — jangan diubah manual. */\n' +
    'window.AGAMA_' + ket[3].toUpperCase() + ' = ' + JSON.stringify(daftar) + ';\n';
  fs.writeFileSync(berkas, isi, 'utf8');
}
async function perbarui(tingkat, bagian) {
  console.log('\n== ' + tingkat + ' ==');
  if (!bagian) {
    const semua = await ambil(tingkat, '');
    const namaKolom = LAYANAN[tingkat][2][LAYANAN[tingkat][2].length - 1];
    const rapi = semua.filter(a => a && a[namaKolom]).map(a => [...LAYANAN[tingkat][2].map(k => a[k]), a.jumlah_penduduk === undefined ? null : a.jumlah_penduduk, ...AGAMA.map(g => a[g] === undefined ? null : a[g])]);
    if (semua.length < 1) { throw new Error('Tidak ada data dari Dukcapil: ' + tingkat); }
    const lama = baca(path.join(KERJA, 'data', 'agama', ket[3] + '-nasional.js'), 'AGAMA_' + ket[3].toUpperCase());
    pastikanLengkap(lama, rapi, tingkat, 'nasional');
    tulis(tingkat, 'nasional', rapi);
    console.log(rapi.length + ' record bernama; ' + (semua.length - rapi.length) + ' entri tanpa identitas.');
    return;
  }
  for (const kodeBagian of bagian) {
    if (!/^\d{2}(?:\d{2})?$/.test(kodeBagian) || (tingkat !== 'desa' && kodeBagian.length !== 2)) { throw new Error('Kode bagian tidak sesuai tingkat: ' + tingkat + ' / ' + kodeBagian); }
    const kodeBerkas = tingkat === 'desa' ? kodeBagian.slice(0, 4) : kodeBagian.slice(0, 2);
    const saring = tingkat === 'desa'
      ? ' AND no_prop=' + Number(kodeBagian.slice(0, 2)) + (kodeBagian.length === 4 ? ' AND no_kab=' + Number(kodeBagian.slice(2, 4)) : '')
      : ' AND no_prop=' + Number(kodeBagian);
    const data = await ambil(tingkat, saring);
    const rapi = data.filter(a => a && a[LAYANAN[tingkat][2][LAYANAN[tingkat][2].length - 1]]).map(a => [...LAYANAN[tingkat][2].map(k => a[k]), a.jumlah_penduduk === undefined ? null : a.jumlah_penduduk, ...AGAMA.map(g => a[g] === undefined ? null : a[g])]);
    if (!rapi.length) { throw new Error('Data kosong: ' + tingkat + ' ' + kodeBagian); }
    if (tingkat === 'desa' && kodeBagian.length === 2) {
      const perKabupaten = new Map();
      rapi.forEach(function (r) {
        const kk = pad(r[0], 2) + pad(r[1], 2);
        if (!perKabupaten.has(kk)) { perKabupaten.set(kk, []); }
        perKabupaten.get(kk).push(r);
      });
      for (const [kk, daftar] of perKabupaten) {
        const lama = baca(path.join(KERJA, 'data', 'agama', 'desa-' + kk + '.js'), 'AGAMA_DESA');
        pastikanLengkap(lama, daftar, tingkat, kk);
        tulis(tingkat, kk, daftar);
        console.log(kk + ' · ' + daftar.length + ' record bernama.');
      }
    } else {
      const lama = baca(path.join(KERJA, 'data', 'agama', LAYANAN[tingkat][3] + '-' + kodeBerkas + '.js'), 'AGAMA_' + LAYANAN[tingkat][3].toUpperCase());
      pastikanLengkap(lama, rapi, tingkat, kodeBerkas);
      tulis(tingkat, kodeBerkas, rapi);
    }
    console.log(kodeBagian + ' · ' + rapi.length + ' record bernama; ' + (data.length - rapi.length) + ' entri tanpa identitas.');
    await jeda(200);
  }
}
function siapkanKerja(sementara) {
  KERJA = path.join(sementara, 'proyek');
  fs.mkdirSync(KERJA, { recursive: true });
  for (const nama of ['data', 'js']) { fs.cpSync(path.join(AKAR, nama), path.join(KERJA, nama), { recursive: true }); }
  fs.cpSync(path.join(AKAR, 'alat'), path.join(KERJA, 'alat'), { recursive: true });
  for (const nama of ['datapemetaan.html']) { fs.copyFileSync(path.join(AKAR, nama), path.join(KERJA, nama)); }
  if (process.env.PEMETAAN_CACHE_SUMBER) {
    for (const nama of ['kecamatan-sumber.json', 'desa-sumber.json']) {
      fs.copyFileSync(path.join(process.env.PEMETAAN_CACHE_SUMBER, nama), path.join(KERJA, 'data', 'datapemetaan', nama));
    }
  }
  return path.join(KERJA, 'data', 'datapemetaan');
}
function auditBagian(keluaran, tingkat, bagian) {
  const indeks = JSON.parse(fs.readFileSync(path.join(keluaran, 'indeks.json'), 'utf8'));
  for (const t of tingkat) {
    for (const kodeBagian of bagian || []) {
      if (t === 'kecamatan' && kodeBagian.length !== 2) { throw new Error('Kecamatan harus difilter per provinsi.'); }
      if (t === 'desa' && ![2, 4].includes(kodeBagian.length)) { throw new Error('Desa harus difilter per provinsi/kabupaten.'); }
      const pk = kodeBagian.slice(0, 2);
      if (!indeks.provinsi[pk]) { throw new Error('Provinsi filter tidak ada: ' + pk); }
      const berkas = t === 'kecamatan' ? 'kec-' + pk + '.js' : t === 'desa' && kodeBagian.length === 4 ? 'desa-' + kodeBagian + '.js' : '';
      if (berkas) {
        const lokasi = path.join(KERJA, 'data', 'agama', berkas);
        if (t === 'desa' && kodeBagian.length === 2) {
          if (!fs.readdirSync(path.dirname(lokasi)).some(n => new RegExp('^desa-' + pk + '\\d{2}\\.js$').test(n))) { throw new Error('Berkas desa provinsi tidak ada: ' + pk); }
        } else if (!fs.existsSync(lokasi)) { throw new Error('Berkas hasil pembaruan tidak ada: ' + berkas); }
      }
      if (t === 'desa' && kodeBagian.length === 4) {
        const d = JSON.parse(fs.readFileSync(path.join(keluaran, 'kabupaten-' + kodeBagian + '.json'), 'utf8'));
        if (d.kabupaten.provinsi !== pk) { throw new Error('Kabupaten filter tidak sesuai provinsi: ' + kodeBagian); }
      }
    }
  }
}
function tukarHasil(sementara, keluaran) {
  const agama = path.join(AKAR, 'data', 'agama');
  const laporan = path.join(AKAR, 'data', 'datapemetaan');
  const cadangan = path.join(sementara, 'cadangan');
  fs.mkdirSync(cadangan, { recursive: true });
  const folder = [[path.join(KERJA, 'data', 'agama'), agama, 'agama'], [keluaran, laporan, 'datapemetaan']];
  const berkas = ['datapemetaan.html', 'js/datapemetaan.js'];
  try {
    for (const [baru, lama, nama] of folder) {
      fs.renameSync(lama, path.join(cadangan, nama));
      fs.renameSync(baru, lama);
    }
    for (const nama of berkas) {
      const lokasi = path.join(AKAR, nama);
      fs.copyFileSync(lokasi, path.join(cadangan, nama.replace(/\//g, '_')));
      fs.copyFileSync(path.join(KERJA, nama), lokasi);
    }
  } catch (e) {
    for (const [baru, lama, nama] of folder) {
      const simpan = path.join(cadangan, nama);
      if (fs.existsSync(simpan)) { fs.rmSync(lama, { recursive: true, force: true }); fs.renameSync(simpan, lama); }
    }
    for (const nama of berkas) {
      const simpan = path.join(cadangan, nama.replace(/\//g, '_'));
      if (fs.existsSync(simpan)) { fs.copyFileSync(simpan, path.join(AKAR, nama)); }
    }
    throw e;
  }
}
async function utama() {
  const tingkat = [...new Set((arg('tingkat') || 'provinsi,kabkota,kecamatan,desa').split(','))];
  const hanya = arg('hanya');
  const bagianFilter = hanya ? hanya.split(',') : null;
  if (tingkat.some(t => !LAYANAN[t])) { throw new Error('Tingkat tidak dikenal.'); }
  if (hanya && !/^[0-9,]+$/.test(hanya)) { throw new Error('Pilihan --hanya harus berupa kode angka.'); }
  if (tingkat.includes('desa') && !hanya && !tingkat.includes('kecamatan')) { throw new Error('Pembaruan seluruh desa harus disertai kecamatan untuk menjaga hierarki.'); }
  if (bagianFilter) {
    for (const t of tingkat) {
      const panjang = { provinsi: [2], kabkota: [2], kecamatan: [2], desa: [2, 4] }[t];
      if (bagianFilter.some(k => !panjang.includes(k.length))) { throw new Error('Kode --hanya tidak sesuai tingkat: ' + t); }
    }
    if (tingkat.includes('kecamatan') && tingkat.includes('desa') && bagianFilter.some(k => k.length !== 2)) { throw new Error('Pembaruan kecamatan+desa harus memakai kode provinsi.'); }
  }
  const sementara = fs.mkdtempSync(path.join(os.tmpdir(), 'pemetaan-laporan-'));
  let berhasil = false;
  try {
    const keluaran = siapkanKerja(sementara);
    if (!KERING && !LEWATI_BACKUP) { backup(tingkat.join(',') + (hanya ? ' / ' + hanya : '')); }
    for (const t of tingkat) {
      let bagian = bagianFilter;
      if (!bagian && (t === 'kecamatan' || t === 'desa')) {
        bagian = t === 'kecamatan'
          ? [...new Set(baca(path.join(KERJA, 'data', 'wilayah-warna', 'prop-nasional.js'), 'WARNA_PROP').map(d => pad(d.a[0], 2)))]
          : fs.readdirSync(path.join(KERJA, 'data', 'wilayah-warna')).filter(n => /^desa-\d{4}\.js$/.test(n)).map(n => n.slice(5, 9));
      }
      await perbarui(t, bagian);
    }
    node('alat/buat-datapemetaan.js', ['--keluaran=' + keluaran].concat(process.argv.includes('--luring') ? ['--luring'] : []));
    node('alat/audit-datapemetaan.js', ['--folder=' + keluaran]);
    auditBagian(keluaran, tingkat, bagianFilter);
    for (const berkas of ['datapemetaan.html', 'js/datapemetaan.js']) {
      const lokasi = path.join(KERJA, berkas);
      let isi = fs.readFileSync(lokasi, 'utf8');
      isi = isi.replace(/\d{8}-(?:\d+|data)/g, versiData());
      fs.writeFileSync(lokasi, isi, 'utf8');
    }
    if (!KERING) { tukarHasil(sementara, keluaran); }
    console.log(KERING ? '\nSimulasi berhasil. Data sumber dan laporan aktif tidak berubah.' : '\nPembaruan berhasil; sumber dan laporan aktif diganti setelah seluruh audit lulus.');
    console.log(KERING ? 'Gunakan perintah tanpa --dry-run untuk menerapkan hasil.' : 'Periksa perubahan, uji laporan, lalu commit hasilnya.');
    berhasil = true;
  } finally {
    fs.rmSync(sementara, { recursive: true, force: true });
    if (!berhasil) { console.error('\nPembaruan gagal. Data sumber dan laporan aktif tidak diganti.'); }
  }
}
utama().catch(e => { console.error('GAGAL: ' + e.message); process.exit(1); });
