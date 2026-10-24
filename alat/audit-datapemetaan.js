/* Audit seluruh hierarki Data Pemetaan tanpa mengubah data.
   node alat/audit-datapemetaan.js
   node alat/audit-datapemetaan.js --folder=data/datapemetaan
*/
'use strict';
const fs = require('fs');
const path = require('path');
const AKAR = path.resolve(__dirname, '..');
const pilihan = process.argv.find(a => a.startsWith('--folder='));
const FOLDER = path.resolve(AKAR, pilihan ? pilihan.slice(9) : path.join('data', 'datapemetaan'));
const AGAMA = 8;
const kesalahan = [];
function wajib(syarat, pesan) { if (!syarat) { kesalahan.push(pesan); } }
function baca(nama) {
  const lokasi = path.join(FOLDER, nama);
  if (!fs.existsSync(lokasi)) { throw new Error('Berkas hilang: ' + nama); }
  return JSON.parse(fs.readFileSync(lokasi, 'utf8'));
}
function angkaSah(daftar, label, bolehKosong) {
  if (daftar === null && bolehKosong) { return; }
  wajib(Array.isArray(daftar) && daftar.length === AGAMA, label + ': agama harus berisi total + 7 kategori');
  (daftar || []).forEach((n, i) => wajib(n === null || (Number.isFinite(n) && n >= 0), label + ': nilai agama tidak sah pada indeks ' + i));
}
try {
  const indeks = baca('indeks.json');
  const bahasaSuku = baca('bahasa-suku.json');
  const provinsi = Object.entries(indeks.provinsi);
  const kodeProvinsi = new Set(), kodeKabupaten = new Set(), kodeKecamatan = new Set(), kodeDesa = new Set();
  const bahasa = new Set(), suku = new Set();
  const berkasDiharapkan = new Set(['indeks.json', 'bahasa-suku.json']);
  const totalAgama = Array(AGAMA).fill(0);
  let desaTanpaPenduduk = 0, desaTanpaGeometri = 0, desaTanpaInduk = 0, kecTingkatAtas = 0;
  wajib(provinsi.length === indeks.total.provinsi, 'Jumlah provinsi tidak cocok dengan indeks');
  for (const [pk, p] of provinsi) {
    wajib(/^\d{2}$/.test(pk) && !kodeProvinsi.has(pk), 'Kode provinsi tidak sah/ganda: ' + pk);
    kodeProvinsi.add(pk);
    angkaSah(p.agama, 'Provinsi ' + pk);
    p.agama.forEach((n, i) => { if (n !== null) totalAgama[i] += n; });
    const d = baca('provinsi-' + pk + '.json');
    berkasDiharapkan.add('provinsi-' + pk + '.json');
    wajib(d.provinsi.kode === pk && d.provinsi.nama === p.nama, 'Rincian provinsi tidak cocok: ' + pk);
    wajib(d.kabupaten.length === p.kab && d.provinsi.desa === p.desa && d.provinsi.kec === p.kec, 'Jumlah wilayah provinsi tidak cocok: ' + pk);
    wajib(d.kelompokTambahan.length === 0, 'Kabupaten tanpa induk tidak boleh dibuat: ' + pk);
    const bahasaProvinsi = bahasaSuku[pk];
    wajib(bahasaProvinsi && bahasaProvinsi.bahasa.length === d.provinsi.bahasa.length, 'Bahasa provinsi tidak cocok: ' + pk);
    d.provinsi.bahasa.forEach(nama => bahasa.add(nama));
    d.provinsi.suku.forEach(s => suku.add(s.nama));
    let kecProvinsi = 0, desaProvinsi = 0;
    for (const q of d.kabupaten) {
      wajib(q.kode.slice(0, 2) === pk && /^\d{4}$/.test(q.kode) && !kodeKabupaten.has(q.kode), 'Kabupaten ganda/induk salah: ' + q.kode);
      kodeKabupaten.add(q.kode);
      angkaSah(q.agama, 'Kabupaten ' + q.kode);
      const kd = baca('kabupaten-' + q.kode + '.json');
      berkasDiharapkan.add('kabupaten-' + q.kode + '.json');
      wajib(kd.kabupaten.kode === q.kode && kd.kabupaten.provinsi === pk, 'Rincian kabupaten tidak cocok: ' + q.kode);
      wajib(kd.kecamatan.length === q.kec && kd.kabupaten.desa === q.desa, 'Jumlah wilayah kabupaten tidak cocok: ' + q.kode);
      let desaKabupaten = 0;
      for (const k of kd.kecamatan) {
        wajib(k.kode.slice(0, 4) === q.kode && /^\d{6}$/.test(k.kode) && !kodeKecamatan.has(k.kode), 'Kecamatan ganda/induk salah: ' + k.kode);
        kodeKecamatan.add(k.kode);
        angkaSah(k.agama, 'Kecamatan ' + k.kode, true);
        const kc = baca('kecamatan-' + k.kode + '.json');
        berkasDiharapkan.add('kecamatan-' + k.kode + '.json');
        wajib((k.agama === null) === !!kc.kecamatan.tanpaInduk, 'Status agama kecamatan tidak sesuai sumber: ' + k.kode);
        wajib(kc.kecamatan.kode === k.kode && kc.kecamatan.kabupaten === q.kode, 'Rincian kecamatan tidak cocok: ' + k.kode);
        wajib(kc.desa.length === k.desa, 'Jumlah desa kecamatan tidak cocok: ' + k.kode);
        if (kc.kecamatan.tanpaInduk) desaTanpaInduk += kc.desa.length;
        if (!kc.kecamatan.tanpaInduk) kecTingkatAtas++;
        for (const v of kc.desa) {
          wajib(v.kode.slice(0, 6) === k.kode && /^\d{10}$/.test(v.kode) && !kodeDesa.has(v.kode), 'Desa ganda/induk salah: ' + v.kode);
          wajib(typeof v.nama === 'string' && v.nama.trim(), 'Nama desa kosong: ' + v.kode);
          wajib(v.kecamatan === k.kode, 'Induk desa tidak cocok: ' + v.kode);
          wajib(v.penduduk === undefined, 'Penduduk desa harus dibaca dari larik agama terbaru: ' + v.kode);
          angkaSah(v.agama, 'Desa ' + v.kode);
          kodeDesa.add(v.kode);
          if (v.agamaTanpaTotal) desaTanpaPenduduk++;
          if (v.tanpaGeometri) desaTanpaGeometri++;
        }
        desaKabupaten += kc.desa.length;
      }
      wajib(desaKabupaten === q.desa, 'Jumlah desa kabupaten tidak sama dengan anak: ' + q.kode);
      kecProvinsi += kd.kecamatan.length;
      desaProvinsi += desaKabupaten;
    }
    wajib(kecProvinsi === p.kec && desaProvinsi === p.desa, 'Jumlah anak provinsi tidak cocok: ' + pk);
  }
  Object.entries(indeks.total).forEach(([nama, nilai]) => {
    const sebenarnya = { provinsi: kodeProvinsi.size, kabupaten: kodeKabupaten.size, kecamatan: kodeKecamatan.size, desa: kodeDesa.size, bahasa: bahasa.size, suku: suku.size, agama: 7 }[nama];
    wajib(nilai === sebenarnya, 'Total ' + nama + ' tidak cocok: ' + nilai + ' vs ' + sebenarnya);
  });
  wajib(indeks.desaTanpaPenduduk === desaTanpaPenduduk, 'Jumlah desa tanpa penduduk tidak cocok');
  wajib(indeks.desaTanpaGeometri === desaTanpaGeometri, 'Jumlah desa tanpa geometri tidak cocok');
  wajib(indeks.desaTanpaIndukKecamatan === desaTanpaInduk, 'Jumlah desa tanpa induk kecamatan tidak cocok');
  wajib(indeks.kabupatenTanpaInduk === 0, 'Tidak boleh ada kabupaten rekaan');
  wajib(indeks.kecamatanSumber - indeks.kecamatanTanpaIdentitas - indeks.kecamatanDuplikatAtribut > 0, 'Audit sumber kecamatan tidak cocok');
  wajib(kodeKecamatan.size >= indeks.kecamatanSumber - indeks.kecamatanTanpaIdentitas - indeks.kecamatanDuplikatAtribut, 'Kecamatan sumber hilang dari hierarki');
  wajib(indeks.kecamatanSumber - indeks.kecamatanTanpaIdentitas - indeks.kecamatanDuplikatAtribut === kecTingkatAtas, 'Asal-usul kecamatan tidak cocok');
  wajib(kodeKecamatan.size - kecTingkatAtas === indeks.kelompokTanpaIndukKecamatan, 'Jumlah kelompok tambahan tidak cocok');
  wajib(Object.values(indeks.provinsi).every(p => p.kecamatanTingkatAtas === undefined || Number.isInteger(p.kecamatanTingkatAtas)), 'Metadata asal kecamatan tidak sah');
  wajib(indeks.desaSumber === kodeDesa.size + indeks.entriSumberTanpaIdentitas + indeks.desaDuplikatAtribut, 'Audit sumber desa tidak cocok');
  const berkasAda = new Set(fs.readdirSync(FOLDER).filter(n => n.endsWith('.json')));
  for (const nama of berkasDiharapkan) wajib(berkasAda.has(nama), 'Berkas rincian tidak tersedia: ' + nama);
  for (const nama of berkasAda) wajib(berkasDiharapkan.has(nama), 'Berkas JSON tidak terhubung: ' + nama);
  wajib(totalAgama[0] > 0, 'Total penduduk tidak tersedia');
  if (kesalahan.length) throw new Error(kesalahan.slice(0, 30).join('\n') + (kesalahan.length > 30 ? '\n… ' + (kesalahan.length - 30) + ' galat lain' : ''));
  console.log(JSON.stringify({ ok: true, total: indeks.total, jumlahPenduduk: totalAgama[0], agama: totalAgama.slice(1), sumber: { kecamatan: indeks.kecamatanSumber, desa: indeks.desaSumber, kecamatanKosong: indeks.kecamatanTanpaIdentitas, desaKosong: indeks.entriSumberTanpaIdentitas, kecamatanDuplikat: indeks.kecamatanDuplikatAtribut, desaDuplikat: indeks.desaDuplikatAtribut }, berkas: berkasAda.size, desaTanpaPenduduk, desaTanpaGeometri, desaTanpaInduk }, null, 2));
} catch (e) {
  console.error('AUDIT GAGAL: ' + e.message);
  process.exit(1);
}
