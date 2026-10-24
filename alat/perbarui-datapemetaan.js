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
const AKAR = path.resolve(__dirname, '..');
const HOST = 'https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services';
const AGAMA = ['islam', 'kristen', 'katholik', 'hindu', 'budha', 'konghucu', 'kepercayaan'];
const KODE = { provinsi: [2], kabkota: [2, 2], kecamatan: [2, 2, 2], desa: [2, 2, 2, 4] };
const LAYANAN = {
  provinsi: ['AGR_VISUAL_PROP_FIX', 1, ['no_prop', 'nama_prop'], 'prop'],
  kabkota: ['AGR_VISUAL_KAB_FIX', 3, ['no_prop', 'no_kab', 'nama_kab'], 'kab'],
  kecamatan: ['AGR_VISUAL_KEC_FIX', 2, ['no_prop', 'no_kab', 'no_kec', 'nama_kec'], 'kec'],
  desa: ['AGR_VISUAL_KEL_FIX', 0, ['no_prop', 'no_kab', 'no_kec', 'no_kel', 'nama_kel'], 'desa']
};
const TOTAL = { provinsi: 38, kabkota: 514, kecamatan: 7246, desa: 83411 };
const arg = argumen => {
  const a = process.argv.find(x => x.startsWith('--' + argumen + '='));
  return a ? a.slice(argumen.length + 3) : '';
};
const KERING = process.argv.includes('--dry-run');
const LEWATI_BACKUP = process.argv.includes('--tanpa-backup');
const jeda = ms => new Promise(resolve => setTimeout(resolve, ms));
const pad = (n, lebar) => String(n).padStart(lebar, '0');
const kode = (a, tingkat) => KODE[tingkat].map((n, i) => pad(a[i], n)).join('');
function node(script, args) {
  const r = spawnSync(process.execPath, [path.join(AKAR, script), ...args], { cwd: AKAR, stdio: 'inherit' });
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
  git(['commit', '--allow-empty', '-m', 'Backup sebelum pembaruan Data Pemetaan: ' + keterangan]);
  console.log('Backup Git dibuat. Titik pulih: ' + git(['rev-parse', 'HEAD']));
}
function tanggal(berkas) {
  const isi = fs.readFileSync(berkas, 'utf8');
  const m = isi.match(/Ambil: (\d{4}-\d{2}-\d{2})/);
  if (m) { return m[1]; }
  const s = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(berkas, isi.replace('Dibuat oleh', 'Ambil: ' + s + ' · Dibuat oleh'), 'utf8');
  return s;
}
async function ambil(tingkat, saring) {
  const [layanan, lapisan, kolom] = LAYANAN[tingkat];
  const p = new URLSearchParams({
    where: '1=1' + (saring || ''),
    outFields: kolom.join(',') + ',jumlah_penduduk,' + AGAMA.join(','),
    returnGeometry: 'false', resultRecordCount: '10000', f: 'json'
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
    (d.features || []).forEach(f => hasil.push(f.attributes));
    if ((d.features || []).length < 10000) { break; }
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
  const berkas = path.join(AKAR, 'data', 'agama', ket[3] + '-' + bagian + '.js');
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
    const rapi = semua.filter(a => a && a[namaKolom]).map(a => [...LAYANAN[tingkat][2].map(k => a[k]), a.jumlah_penduduk, ...AGAMA.map(g => a[g] || 0)]);
    if (semua.length < 1) { throw new Error('Tidak ada data dari Dukcapil: ' + tingkat); }
    tulis(tingkat, 'nasional', rapi);
    console.log(rapi.length + ' record bernama; ' + (semua.length - rapi.length) + ' entri tanpa identitas.');
    return;
  }
  for (const kodeBagian of bagian) {
    const saring = tingkat === 'desa'
      ? ' AND no_prop=' + Number(kodeBagian.slice(0, 2)) + ' AND no_kab=' + Number(kodeBagian.slice(2, 4))
      : ' AND no_prop=' + Number(kodeBagian);
    const data = await ambil(tingkat, saring);
    const rapi = data.filter(a => Object.values(a).some(v => v !== null)).map(a => [...LAYANAN[tingkat][2].map(k => a[k]), a.jumlah_penduduk || 0, ...AGAMA.map(g => a[g] || 0)]);
    if (!rapi.length) { throw new Error('Data kosong: ' + tingkat + ' ' + kodeBagian); }
    tulis(tingkat, kodeBagian, rapi);
    console.log(kodeBagian + ' · ' + rapi.length + ' record');
    await jeda(200);
  }
}
function tukarFolder(baru, lama) {
  const cadangan = lama + '.sebelum';
  fs.rmSync(cadangan, { recursive: true, force: true });
  fs.renameSync(lama, cadangan);
  try {
    fs.renameSync(baru, lama);
    fs.rmSync(cadangan, { recursive: true, force: true });
  } catch (e) {
    fs.rmSync(lama, { recursive: true, force: true });
    fs.renameSync(cadangan, lama);
    throw e;
  }
}
function auditTotal(indeks, tingkat, bagian) {
  const total = indeks.total;
  if (tingkat === 'provinsi' && (total.provinsi !== 38 || total.kabupaten !== 514)) { throw new Error('Provinsi/kabupaten tidak konsisten.'); }
  if (tingkat === 'kabkota' && total.kabupaten !== 514) { throw new Error('Kabupaten tidak konsisten.'); }
  if (tingkat === 'kecamatan' && bagian) {
    const kodeBagian = bagian[0].length === 2 ? bagian[0] : bagian[0].slice(0, 2);
    const p = indeks.provinsi[kodeBagian];
    if (!p || !p.kec) { throw new Error('Kecamatan provinsi tidak konsisten.'); }
  }
  if (tingkat === 'desa' && bagian) {
    const kk = bagian[0].length === 4 ? bagian[0] : '';
    if (kk) {
      const d = JSON.parse(fs.readFileSync(path.join(AKAR, 'data', 'datapemetaan', 'kabupaten-' + kk + '.json'), 'utf8'));
      if (!d.kabupaten.desa) { throw new Error('Desa kabupaten tidak konsisten.'); }
    }
  }
}
async function utama() {
  const tingkat = (arg('tingkat') || 'provinsi,kabkota,kecamatan,desa').split(',');
  const hanya = arg('hanya');
  if (tingkat.some(t => !LAYANAN[t])) { throw new Error('Tingkat tidak dikenal.'); }
  if (hanya && !/^[0-9,]+$/.test(hanya)) { throw new Error('Pilihan --hanya harus berupa kode angka.'); }
  if (tingkat.includes('desa') && !hanya && !tingkat.includes('kecamatan')) { throw new Error('Pembaruan seluruh desa harus disertai kecamatan untuk menjaga hierarki.'); }
  const sementara = fs.mkdtempSync(path.join(os.tmpdir(), 'pemetaan-laporan-'));
  const laporan = path.join(AKAR, 'data', 'datapemetaan');
  const keluaran = path.join(sementara, 'datapemetaan');
  fs.mkdirSync(keluaran, { recursive: true });
  let berhasil = false;
  try {
    if (fs.existsSync(path.join(laporan, 'indeks.json'))) {
      for (const f of fs.readdirSync(laporan)) {
        if (/^(indeks|bahasa-suku|provinsi-|kabupaten-)\w*\.json$/.test(f)) { fs.copyFileSync(path.join(laporan, f), path.join(keluaran, f)); }
      }
    }
    if (!LEWATI_BACKUP) { backup(tingkat.join(',') + (hanya ? ' / ' + hanya : '')); }
    for (const t of tingkat) {
      let bagian = hanya ? hanya.split(',') : null;
      if (!bagian && (t === 'kecamatan' || t === 'desa')) {
        bagian = t === 'kecamatan'
          ? [...new Set(baca(path.join(AKAR, 'data', 'wilayah-warna', 'prop-nasional.js'), 'WARNA_PROP').map(d => pad(d.a[0], 2)))]
          : fs.readdirSync(path.join(AKAR, 'data', 'wilayah-warna')).filter(n => /^desa-\d{4}\.js$/.test(n)).map(n => n.slice(5, 9));
      }
      await perbarui(t, bagian);
    }
    node('alat/buat-datapemetaan.js', ['--keluaran=' + keluaran]);
    const indeks = JSON.parse(fs.readFileSync(path.join(keluaran, 'indeks.json'), 'utf8'));
    for (const t of tingkat) { auditTotal(indeks, t, hanya ? hanya.split(',') : null); }
    if (!KERING) {
      tukarFolder(keluaran, laporan);
      node('alat/buat-datapemetaan.js', ['--luring']);
    } else {
      console.log('Dry-run: indeks baru divalidasi di ' + keluaran + '; laporan aktif tidak ditukar.');
    }
    console.log('\nPembaruan berhasil dan indeks lama terganti setelah validasi.');
    console.log('Periksa perubahan, uji laporan, lalu commit hasilnya. Titik pulih tersedia pada commit backup di atas.');
    berhasil = true;
  } finally {
    fs.rmSync(sementara, { recursive: true, force: true });
    if (!berhasil) { console.error('\nPembaruan gagal. Folder laporan lama tidak ditukar. Gunakan titik pulih Git bila sumber agama perlu dipulihkan.'); }
  }
}
utama().catch(e => { console.error('GAGAL: ' + e.message); process.exit(1); });
