/* Data Pemetaan — pembangkit indeks wilayah, bahasa, dan suku.
   Angka penduduk/agama tetap dibaca dari berkas sumber, bukan diduplikasi.
   Jalankan setelah pembaruan Dukcapil/katalog bahasa:
     node alat/buat-datapemetaan.js
*/
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const AKAR = path.resolve(__dirname, '..');
const argumen = process.argv.slice(2);
const arg = argumen.find(function (a) { return a.startsWith('--keluaran='); });
const KELUARAN = arg ? path.resolve(AKAR, arg.slice('--keluaran='.length)) : path.join(AKAR, 'data', 'datapemetaan');
const LURING = argumen.includes('--luring');
const TANPA_SUMBER = argumen.includes('--tanpa-sumber');

function baca(nama, variabel) {
  const isi = fs.readFileSync(nama, 'utf8');
  const tanggal = (isi.match(/Ambil: (\d{4}-\d{2}-\d{2})/) || [])[1] || null;
  const konteks = { window: {} };
  vm.runInNewContext(isi, konteks, { filename: nama });
  const data = konteks.window[variabel];
  if (!data || typeof data !== 'object') { throw new Error('Data tidak ditemukan: ' + nama); }
  return { data, tanggal };
}

function kode(n, panjang) {
  return String(n).padStart(panjang, '0');
}

function tulis(nama, isi) {
  fs.writeFileSync(path.join(KELUARAN, nama), JSON.stringify(isi), 'utf8');
}

async function kecamatanTanpaGeometri() {
  const berkas = path.join(KELUARAN, 'kecamatan-tanpa-geometri.json');
  if (LURING && fs.existsSync(berkas)) { return JSON.parse(fs.readFileSync(berkas, 'utf8')); }
  const params = new URLSearchParams({
    where: '1=1', outFields: 'no_prop,no_kab,no_kec,nama_kec,jumlah_penduduk,islam,kristen,katholik,hindu,budha,konghucu,kepercayaan',
    returnGeometry: 'false', resultRecordCount: '10000', f: 'json'
  });
  const jawab = await fetch('https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services/AGR_VISUAL_KEC_FIX/FeatureServer/2/query?' + params);
  if (!jawab.ok) { throw new Error('Dukcapil kecamatan HTTP ' + jawab.status); }
  const isi = await jawab.json();
  if (isi.error) { throw new Error(JSON.stringify(isi.error)); }
  const hasil = (isi.features || []).map(function (f) {
    const a = f.attributes;
    return {
      kode: kode(a.no_prop, 2) + kode(a.no_kab, 2) + kode(a.no_kec, 2), nama: a.nama_kec,
      kabupaten: kode(a.no_prop, 2) + kode(a.no_kab, 2), desa: [],
      agama: [a.jumlah_penduduk, a.islam, a.kristen, a.katholik, a.hindu, a.budha, a.konghucu, a.kepercayaan], tanpaGeometri: true
    };
  });
  if (hasil.length !== 7285) { throw new Error('Atribut kecamatan tidak lengkap: ' + hasil.length); }
  tulis('kecamatan-tanpa-geometri.json', hasil);
  return hasil;
}

async function desaTanpaGeometri() {
  const berkas = path.join(KELUARAN, 'desa-tanpa-geometri.json');
  if (LURING && fs.existsSync(berkas)) { return JSON.parse(fs.readFileSync(berkas, 'utf8')); }
  const params = new URLSearchParams({
    where: '1=1',
    outFields: 'no_prop,no_kab,no_kec,no_kel,nama_kel,jumlah_penduduk,islam,kristen,katholik,hindu,budha,konghucu,kepercayaan',
    returnGeometry: 'false', resultRecordCount: '10000', f: 'json'
  });
  const hasil = [];
  for (;;) {
    params.set('resultOffset', String(hasil.length));
    const url = 'https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services/AGR_VISUAL_KEL_FIX/FeatureServer/0/query?' + params;
    const jawab = await fetch(url);
    if (!jawab.ok) { throw new Error('Dukcapil desa HTTP ' + jawab.status); }
    const isi = await jawab.json();
    if (isi.error) { throw new Error(JSON.stringify(isi.error)); }
    (isi.features || []).forEach(function (f) {
      const a = f.attributes;
      hasil.push({
        kode: kode(a.no_prop, 2) + kode(a.no_kab, 2) + kode(a.no_kec, 2) + kode(a.no_kel, 4),
        nama: a.nama_kel,
        kecamatan: kode(a.no_prop, 2) + kode(a.no_kab, 2) + kode(a.no_kec, 2),
        agama: [a.jumlah_penduduk, a.islam, a.kristen, a.katholik, a.hindu, a.budha, a.konghucu, a.kepercayaan],
        tanpaGeometri: true
      });
    });
    if ((isi.features || []).length < 10000) { break; }
  }
  if (hasil.length !== 83489) { throw new Error('Atribut desa tidak lengkap: ' + hasil.length); }
  tulis('desa-tanpa-geometri.json', hasil);
  return hasil;
}

async function utama() {
  fs.mkdirSync(KELUARAN, { recursive: true });
  const prop = baca(path.join(AKAR, 'data', 'wilayah-warna', 'prop-nasional.js'), 'WARNA_PROP');
  const kab = baca(path.join(AKAR, 'data', 'wilayah-warna', 'kab-nasional.js'), 'WARNA_KAB');
  const agamaProp = baca(path.join(AKAR, 'data', 'agama', 'prop-nasional.js'), 'AGAMA_PROP');
  const agamaKab = baca(path.join(AKAR, 'data', 'agama', 'kab-nasional.js'), 'AGAMA_KAB');
  const bahasa = baca(path.join(AKAR, 'data', 'peta-bahasa.js'), 'PETA_BAHASA').data;
  const sukuKonteks = { window: {}, document: { getElementById: function () { return null; } }, setTimeout: setTimeout };
  vm.runInNewContext(fs.readFileSync(path.join(AKAR, 'js', 'suku.js'), 'utf8'), sukuKonteks);
  const suku = sukuKonteks.window.PD_SUKU;
  if (!suku || !Array.isArray(suku.SUKU) || suku.SUKU.length !== 28) {
    throw new Error('Katalog 28 kelompok suku BPS tidak terbaca.');
  }

  const provinsi = {};
  prop.data.forEach(function (d) {
    const k = kode(d.a[0], 2);
    provinsi[k] = {
      kode: k, nama: d.a[1], kodeLengkap: d.k,
      kab: [], kec: 0, desa: 0, agama: null, bahasa: [], suku: []
    };
  });

  const agamaProv = {};
  agamaProp.data.forEach(function (a) { agamaProv[kode(a[0], 2)] = a; });
  Object.keys(provinsi).forEach(function (k) {
    const p = provinsi[k];
    const a = agamaProv[k];
    if (!a) { throw new Error('Agama provinsi tidak ditemukan: ' + k); }
    p.agama = a.slice(2);
    p.dataPenduduk = prop.data.find(function (d) {
      return kode(d.a[0], 2) === k;
    }).a[2];
    if (a[2] !== p.dataPenduduk) { throw new Error('Penduduk dan agama berbeda sumber: ' + k); }
    delete p.dataPenduduk;
  });

  const kabupaten = {};
  const agamaKabMap = {};
  agamaKab.data.forEach(function (a) { agamaKabMap[kode(a[0], 2) + kode(a[1], 2)] = a; });
  kab.data.forEach(function (d) {
    const k = kode(d.a[0], 2) + kode(d.a[1], 2);
    const pk = k.slice(0, 2);
    const a = agamaKabMap[k];
    if (!provinsi[pk] || !a || a[3] !== d.a[3]) { throw new Error('Kabupaten/agama tidak cocok: ' + k); }
    kabupaten[k] = { kode: k, nama: d.a[2], provinsi: pk, kecamatan: [], desa: 0, agama: a.slice(3) };
    provinsi[pk].kab.push(k);
  });

  const kecamatan = {};
  const desa = {};
  const tambahanKab = {};
  const tambahanKec = {};
  let jumlahKec = 0, jumlahDesa = 0;
  const berkasKec = {};
  const berkasAgamaKec = {};
  const berkasDesa = {};
  const berkasAgamaDesa = {};
  fs.readdirSync(path.join(AKAR, 'data', 'wilayah-warna')).forEach(function (nama) {
    let m = nama.match(/^kec-(\d{2})\.js$/);
    if (m) { berkasKec[m[1]] = nama; }
    m = nama.match(/^desa-(\d{4})\.js$/);
    if (m) { berkasDesa[m[1]] = nama; }
  });
  fs.readdirSync(path.join(AKAR, 'data', 'agama')).forEach(function (nama) {
    let m = nama.match(/^kec-(\d{2})\.js$/);
    if (m) { berkasAgamaKec[m[1]] = nama; }
    m = nama.match(/^desa-(\d{4})\.js$/);
    if (m) { berkasAgamaDesa[m[1]] = nama; }
  });

  Object.keys(provinsi).forEach(function (pk) {
    if (!berkasKec[pk] || !berkasAgamaKec[pk]) { throw new Error('Kecamatan/agama kurang: ' + pk); }
    const w = baca(path.join(AKAR, 'data', 'wilayah-warna', berkasKec[pk]), 'WARNA_KEC');
    const a = baca(path.join(AKAR, 'data', 'agama', berkasAgamaKec[pk]), 'AGAMA_KEC');
    const petaAgama = {};
    a.data.forEach(function (r) { petaAgama[kode(r[0], 2) + kode(r[1], 2) + kode(r[2], 2)] = r; });
    w.data.forEach(function (d) {
      const k = kode(d.a[0], 2) + kode(d.a[1], 2) + kode(d.a[2], 2);
      const kk = k.slice(0, 4);
      const ag = petaAgama[k];
      if (!kabupaten[kk] || !ag || ag[4] !== d.a[4]) { throw new Error('Kecamatan/agama tidak cocok: ' + k); }
      kecamatan[k] = { kode: k, nama: d.a[3], kabupaten: kk, desa: [], agama: ag.slice(4) };
      kabupaten[kk].kecamatan.push(k);
      provinsi[pk].kec++;
      jumlahKec++;
    });
  });

  function catatDesa(d, kc, ag) {
    const kk = kc.slice(0, 4);
    const pk = kk.slice(0, 2);
    if (!provinsi[pk]) { throw new Error('Desa dengan provinsi tidak dikenal: ' + d.kode); }
    if (!kabupaten[kk] && !tambahanKab[kk]) {
      tambahanKab[kk] = { kode: kk, nama: 'Kelompok desa ' + kk + ' — induk kabupaten tidak tercatat', provinsi: pk, kecamatan: [], desa: 0, agama: null, tanpaInduk: true };
      provinsi[pk].kab.push(kk);
    }
    const kab = kabupaten[kk] || tambahanKab[kk];
    if (!kecamatan[kc] && !tambahanKec[kc]) {
      tambahanKec[kc] = { kode: kc, nama: 'Kode kecamatan ' + kc.slice(4) + ' (induk tidak tercatat)', kabupaten: kk, desa: [], agama: null, tanpaInduk: true };
      kab.kecamatan.push(kc);
    }
    desa[d.kode] = d;
    (kecamatan[kc] || tambahanKec[kc]).desa.push(d.kode);
    kab.desa++;
    provinsi[pk].desa++;
    jumlahDesa++;
  }

  Object.keys(berkasDesa).forEach(function (kk) {
    if (!berkasAgamaDesa[kk]) { throw new Error('Agama desa kurang: ' + kk); }
    const w = baca(path.join(AKAR, 'data', 'wilayah-warna', berkasDesa[kk]), 'WARNA_DESA');
    const a = baca(path.join(AKAR, 'data', 'agama', berkasAgamaDesa[kk]), 'AGAMA_DESA');
    const petaAgama = {};
    a.data.forEach(function (r) { petaAgama[kode(r[0], 2) + kode(r[1], 2) + kode(r[2], 2) + kode(r[3], 4)] = r; });
    w.data.forEach(function (d) {
      const k = kode(d.a[0], 2) + kode(d.a[1], 2) + kode(d.a[2], 2) + kode(d.a[3], 4);
      const kc = k.slice(0, 6);
      const ag = petaAgama[k];
      if (!ag) { throw new Error('Desa/agama tidak ditemukan: ' + k); }
      catatDesa({ kode: k, nama: d.a[4], kecamatan: kc, agama: ag.slice(5),
        penduduk: d.a[5], agamaTanpaTotal: d.a[5] === null && ag[5] === 0 }, kc);
    });
  });

  const atributKec = TANPA_SUMBER ? [] : await kecamatanTanpaGeometri();
  atributKec.forEach(function (d) {
    if (kecamatan[d.kode]) { return; }
    if (!d.nama || d.kode.includes('null') || !kabupaten[d.kabupaten]) { return; }
    kecamatan[d.kode] = d;
    kabupaten[d.kabupaten].kecamatan.push(d.kode);
    provinsi[d.kabupaten.slice(0, 2)].kec++;
    jumlahKec++;
  });

  const atributDesa = TANPA_SUMBER ? [] : await desaTanpaGeometri();
  atributDesa.forEach(function (d) {
    if (desa[d.kode] || !d.nama || d.kode.includes('null')) { return; }
    catatDesa(d, d.kecamatan);
  });

  Object.values(tambahanKec).forEach(function (p) {
    const nama = {};
    p.desa.forEach(function (kd) {
      const bagian = desa[kd].nama.split(/[\/\-]/)[0].trim();
      if (bagian.length > 3 && !/^(I|II|III|IV|V|\d+)$/i.test(bagian)) { nama[bagian] = true; }
    });
    const umum = Object.keys(nama);
    if (umum.length === 1) { p.nama = umum[0] + ' (induk tidak tercatat)'; }
  });

  Object.entries(bahasa).forEach(function ([nama, pk]) {
    if (!provinsi[pk]) { throw new Error('Bahasa dengan provinsi tidak dikenal: ' + nama); }
    provinsi[pk].bahasa.push(nama);
  });
  Object.keys(provinsi).forEach(function (pk) {
    provinsi[pk].bahasa.sort(function (a, b) { return a.localeCompare(b, 'id'); });
    suku.SUKU.forEach(function (s) {
      const kawasan = [];
      s.kawasan.forEach(function (nama) {
        const kodeKawasan = suku.kodeUntukKawasan(nama);
        if (!kodeKawasan) { throw new Error('Kawasan suku tidak terpetakan: ' + nama); }
        if (kodeKawasan.includes(pk)) { kawasan.push(nama); }
      });
      if (kawasan.length) { provinsi[pk].suku.push({ nama: s.nama, kawasan: kawasan }); }
    });
  });

  Object.values(provinsi).forEach(function (p) { p.kab.sort(); });
  Object.values(kabupaten).forEach(function (p) { p.kecamatan.sort(); });
  Object.values(tambahanKab).forEach(function (p) { p.kecamatan.sort(); });
  Object.values(kecamatan).forEach(function (p) { p.desa.sort(); });
  Object.values(tambahanKec).forEach(function (p) { p.desa.sort(); });

  const salinanKecamatan = Object.assign({}, kecamatan);
  Object.assign(kecamatan, tambahanKec);
  const semuaKabupaten = Object.assign({}, kabupaten, tambahanKab);
  const semuaDesa = Object.values(desa).map(function (d) { return d.kode; }).sort();
  if (new Set(semuaDesa).size !== semuaDesa.length) { throw new Error('Ada desa yang terdaftar lebih dari sekali.'); }
  Object.values(kecamatan).forEach(function (p) {
    if (!semuaKabupaten[p.kabupaten]) { throw new Error('Induk kabupaten tidak ada: ' + p.kode); }
    p.desa.forEach(function (kd) { if (!desa[kd]) { throw new Error('Desa tidak ada pada indeks: ' + kd); } });
  });
  Object.values(provinsi).forEach(function (p) {
    p.kab.forEach(function (kk) { if (!semuaKabupaten[kk]) { throw new Error('Kabupaten pada provinsi tidak ada: ' + kk); } });
    p.bahasa.forEach(function (nama) { if (bahasa[nama] !== p.kode) { throw new Error('Bahasa tidak cocok dengan provinsi: ' + nama); } });
  });
  if (!TANPA_SUMBER && atributDesa.length !== 83489) {
    throw new Error('Jumlah atribut desa sumber tidak lengkap: ' + atributDesa.length);
  }

  const meta = {
    judul: 'Data Pemetaan',
    tahap: 1,
    dibuat: new Date().toISOString(),
    sumber: {
      wilayah: prop.tanggal,
      agama: agamaProp.tanggal,
      bahasa: 'Katalog Pemetaan — 430 nama bahasa, provinsi ditinjau manual'
    },
    total: {
      provinsi: Object.keys(provinsi).length,
      kabupaten: Object.keys(kabupaten).length,
      kecamatan: jumlahKec,
      desa: jumlahDesa,
      bahasa: Object.keys(bahasa).length,
      suku: suku.SUKU.length,
      agama: 7
    },
    desaTanpaPenduduk: Object.values(desa).filter(function (d) { return d.agamaTanpaTotal; }).length,
    kecamatanSumber: atributKec.length,
    desaSumber: atributDesa.length,
    kecamatanTanpaIdentitas: atributKec.filter(function (d) { return !d.nama || d.kode.includes('null'); }).length,
    entriSumberTanpaIdentitas: atributDesa.filter(function (d) { return !d.nama || d.kode.includes('null'); }).length,
    desaTanpaGeometri: atributDesa.filter(function (d) { return !!d.nama && !d.kode.includes('null'); }).length,
    desaTanpaIndukKecamatan: Object.values(tambahanKec).reduce(function (n, p) { return n + p.desa.length; }, 0),
    kelompokTanpaIndukKecamatan: Object.keys(tambahanKec).length,
    kabupatenTanpaInduk: Object.keys(tambahanKab).length,
    provinsi: Object.fromEntries(Object.entries(provinsi).map(function ([k, p]) {
      return [k, { nama: p.nama, kab: p.kab.length, kec: p.kec, desa: p.desa,
        bahasa: p.bahasa.length, suku: p.suku.length, agama: p.agama }];
    }))
  };
  tulis('indeks.json', meta);
  tulis('bahasa-suku.json', Object.fromEntries(Object.entries(provinsi).map(function ([k, p]) {
    return [k, { bahasa: p.bahasa, suku: p.suku }];
  })));
  Object.entries(provinsi).forEach(function ([k, p]) {
    tulis('provinsi-' + k + '.json', {
      provinsi: p,
      kabupaten: p.kab.map(function (kk) {
        const q = kabupaten[kk] || tambahanKab[kk];
        return { kode: kk, nama: q.nama, kec: q.kecamatan.length, desa: q.desa, agama: q.agama };
      })
    });
  });
  Object.assign(kabupaten, tambahanKab);
  Object.assign(kecamatan, tambahanKec);
  Object.entries(kabupaten).forEach(function ([k, p]) {
    tulis('kabupaten-' + k + '.json', {
      kabupaten: p,
      kecamatan: p.kecamatan.map(function (kc) {
        const q = kecamatan[kc];
        return { kode: kc, nama: q.nama, desa: q.desa.length, agama: q.agama };
      })
    });
  });
  Object.entries(kecamatan).forEach(function ([k, p]) {
    tulis('kecamatan-' + k + '.json', { kecamatan: p, desa: p.desa.map(function (kd) { return desa[kd]; }) });
  });

  ['desa-tanpa-geometri.json', 'kecamatan-tanpa-geometri.json'].forEach(function (nama) {
    const lokasi = path.join(KELUARAN, nama);
    if (fs.existsSync(lokasi)) { fs.unlinkSync(lokasi); }
  });

  const semua = Object.assign({}, meta.total);
  const penjumlahan = { kab: 0, kec: 0, desa: 0, bahasa: 0, suku: 0 };
  Object.values(provinsi).forEach(function (p) {
    penjumlahan.kab += p.kab.length;
    penjumlahan.kec += p.kec;
    penjumlahan.desa += p.desa;
    penjumlahan.bahasa += p.bahasa.length;
    penjumlahan.suku += p.suku.length;
  });
  if (TANPA_SUMBER && (meta.kecamatanSumber !== 0 || meta.desaSumber !== 0)) { throw new Error('Sumber audit kosong tidak konsisten.'); }
  if (semua.provinsi !== 38 || semua.kabupaten !== 514 || semua.kecamatan !== 7246 || semua.desa !== 83411 ||
      penjumlahan.kab !== semua.kabupaten || penjumlahan.kec !== semua.kecamatan || penjumlahan.desa !== semua.desa) {
    throw new Error('Total data berbeda dari hierarki yang diharapkan: ' + JSON.stringify({ semua, penjumlahan }));
  }
  const totalAgama = Array(8).fill(0);
  Object.values(provinsi).forEach(function (p) { p.agama.forEach(function (n, i) { totalAgama[i] += n; }); });
  if (totalAgama[0] !== agamaProp.data.reduce(function (s, a) { return s + a[2]; }, 0)) {
    throw new Error('Total penduduk tidak konsisten.');
  }
  console.log('OK — indeks Data Pemetaan');
  console.log(JSON.stringify({ total: semua, jumlahPenduduk: totalAgama[0], bahasaTercatat: penjumlahan.bahasa,
    hubunganSukuProvinsi: penjumlahan.suku, berkas: 1 + semua.provinsi + semua.kabupaten + semua.kecamatan }, null, 2));
}

utama();
