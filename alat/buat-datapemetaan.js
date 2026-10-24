/* Data Pemetaan — pembangkit indeks wilayah, bahasa, dan suku.
   Angka penduduk/agama tetap dibaca dari berkas sumber, bukan diduplikasi.
   Jalankan setelah pembaruan Dukcapil/katalog bahasa:
     node alat/buat-datapemetaan.js
*/
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const AKAR = process.env.PEMETAAN_AKAR ? path.resolve(process.env.PEMETAAN_AKAR) : path.resolve(__dirname, '..');
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
  if (n === null || n === undefined || n === '' || !Number.isFinite(Number(n))) { throw new Error('Kode wilayah kosong/tidak sah.'); }
  return String(n).padStart(panjang, '0');
}

function bersihkanSumber(daftar, panjangKode) {
  let kosong = 0, duplikat = 0;
  const unik = new Map();
  daftar.forEach(function (d) {
    if (d.tanpaIdentitas) { kosong++; return; }
    const kodeWilayah = String(d.kode || '');
    const nama = typeof d.nama === 'string' ? d.nama.trim() : '';
    if (!nama || !new RegExp('^\\d{' + panjangKode + '}$').test(kodeWilayah)) { throw new Error('Identitas sumber tidak lengkap: ' + (kodeWilayah || nama || 'tanpa nama')); }
    d.nama = nama;
    const lama = unik.get(kodeWilayah);
    if (!lama) { unik.set(kodeWilayah, d); return; }
    const kunciLama = panjangKode === 6 ? [lama.kabupaten, lama.nama] : [lama.kecamatan, lama.nama];
    const kunciBaru = panjangKode === 6 ? [d.kabupaten, d.nama] : [d.kecamatan, d.nama];
    if (JSON.stringify(kunciLama) !== JSON.stringify(kunciBaru)) { throw new Error('Kode sumber sama tetapi identitas/induk berbeda: ' + kodeWilayah); }
    duplikat++;
  });
  return { data: [...unik.values()], kosong, duplikat, mentah: daftar.length };
}

async function ambilJson(url) {
  for (let coba = 1; ; coba++) {
    try {
      const jawab = await fetch(url);
      if (!jawab.ok) { throw new Error('HTTP ' + jawab.status); }
      const isi = await jawab.json();
      if (isi.error) { throw new Error(JSON.stringify(isi.error)); }
      return isi;
    } catch (e) {
      if (coba === 4) { throw new Error('Sumber Dukcapil tidak dapat dibaca: ' + e.message); }
      await new Promise(function (resolve) { setTimeout(resolve, coba * 1500); });
    }
  }
}

function tulis(nama, isi) {
  fs.writeFileSync(path.join(KELUARAN, nama), JSON.stringify(isi), 'utf8');
}

async function atributSumber(tingkat) {
  const desaTingkat = tingkat === 'desa';
  const namaBerkas = (desaTingkat ? 'desa' : 'kecamatan') + '-sumber.json';
  const berkas = path.join(KELUARAN, namaBerkas);
  if (LURING && fs.existsSync(berkas)) { const d = JSON.parse(fs.readFileSync(berkas, 'utf8')); if (Array.isArray(d.data) && Number.isInteger(d.kosong)) { return d; } }
  const kodeKolom = desaTingkat ? 'no_prop,no_kab,no_kec,no_kel' : 'no_prop,no_kab,no_kec';
  const namaKolom = desaTingkat ? 'nama_kel' : 'nama_kec';
  const params = new URLSearchParams({
    where: '1=1', outFields: kodeKolom + ',' + namaKolom + ',jumlah_penduduk,islam,kristen,katholik,hindu,budha,konghucu,kepercayaan',
    returnGeometry: 'false', resultRecordCount: '10000', orderByFields: 'objectid ASC', f: 'json'
  });
  const hasil = [];
  for (;;) {
    params.set('resultOffset', String(hasil.length));
    const layanan = desaTingkat ? 'AGR_VISUAL_KEL_FIX/FeatureServer/0' : 'AGR_VISUAL_KEC_FIX/FeatureServer/2';
    const isi = await ambilJson('https://gis.dukcapil.kemendagri.go.id/arcgis/rest/services/' + layanan + '/query?' + params);
    if (!Array.isArray(isi.features)) { throw new Error('Respons atribut ' + tingkat + ' tidak lengkap.'); }
    isi.features.forEach(function (f) {
      const a = f.attributes;
      const nilaiKode = [a.no_prop, a.no_kab, a.no_kec].concat(desaTingkat ? [a.no_kel] : []);
      if (!a[namaKolom] && nilaiKode.every(function (n) { return !n; })) { hasil.push({ tanpaIdentitas: true }); return; }
      const kodeWilayah = kode(a.no_prop, 2) + kode(a.no_kab, 2) + kode(a.no_kec, 2) + (desaTingkat ? kode(a.no_kel, 4) : '');
      hasil.push({ kode: kodeWilayah, nama: a[namaKolom],
        kabupaten: kodeWilayah.slice(0, 4), kecamatan: kodeWilayah.slice(0, 6), desa: [],
        agama: [a.jumlah_penduduk, a.islam, a.kristen, a.katholik, a.hindu, a.budha, a.konghucu, a.kepercayaan], tanpaGeometri: true });
    });
    if (isi.features.length < 10000) { break; }
    if (isi.exceededTransferLimit === false) { throw new Error('Pagination sumber ' + tingkat + ' tidak dapat diverifikasi.'); }
    await new Promise(function (resolve) { setTimeout(resolve, 350); });
  }
  const bersih = bersihkanSumber(hasil, desaTingkat ? 10 : 6);
  const keluaran = { diambil: new Date().toISOString(), mentah: bersih.mentah, kosong: bersih.kosong, duplikat: bersih.duplikat, data: bersih.data };
  tulis(namaBerkas, keluaran);
  return keluaran;
}

async function utama() {
  fs.mkdirSync(KELUARAN, { recursive: true });
  const sumberKec = TANPA_SUMBER ? { data: [], kosong: 0, duplikat: 0, mentah: 0 } : await atributSumber('kecamatan');
  const sumberDesa = TANPA_SUMBER ? { data: [], kosong: 0, duplikat: 0, mentah: 0 } : await atributSumber('desa');
  const atributKec = new Map(sumberKec.data.map(function (d) { return [d.kode, d]; }));
  const atributDesa = new Map(sumberDesa.data.map(function (d) { return [d.kode, d]; }));
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
    if (a[2] !== p.dataPenduduk) { console.warn('Catatan: penduduk provinsi terbaru berbeda dari geometri lama: ' + k); }
    delete p.dataPenduduk;
  });

  const kabupaten = {};
  const agamaKabMap = {};
  agamaKab.data.forEach(function (a) { agamaKabMap[kode(a[0], 2) + kode(a[1], 2)] = a; });
  kab.data.forEach(function (d) {
    const k = kode(d.a[0], 2) + kode(d.a[1], 2);
    const pk = k.slice(0, 2);
    const a = agamaKabMap[k];
    if (!provinsi[pk] || !a) { throw new Error('Kabupaten/agama tidak cocok: ' + k); }
    if (a[3] !== d.a[3]) { console.warn('Catatan: penduduk kabupaten terbaru berbeda dari geometri lama: ' + k); }
    kabupaten[k] = { kode: k, nama: d.a[2], provinsi: pk, kecamatan: [], desa: 0, agama: a.slice(3) };
    provinsi[pk].kab.push(k);
  });

  const kecamatan = {};
  const desa = {};
  const tambahanKab = {};
  const tambahanKec = {};
  const duplikatKecamatan = [];
  let kecTingkatAtas = 0;
  const desaPetaLama = new Set();
  const berkasKec = {}, berkasAgamaKec = {}, berkasDesa = {}, berkasAgamaDesa = {};
  function petaSumber(data, panjang) {
    const peta = new Map();
    data.forEach(function (r) {
      const k = kode(r[0], 2) + kode(r[1], 2) + kode(r[2], 2) + (panjang === 10 ? kode(r[3], 4) : '');
      if (!r[panjang === 10 ? 4 : 3]) { return; }
      const lama = peta.get(k);
      if (lama && JSON.stringify(lama) !== JSON.stringify(r)) { throw new Error('Atribut agama berbeda untuk kode yang sama: ' + k); }
      peta.set(k, r);
    });
    return peta;
  }
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
    const petaAgama = petaSumber(a.data, 6);
    w.data.forEach(function (d) {
      const k = kode(d.a[0], 2) + kode(d.a[1], 2) + kode(d.a[2], 2);
      const kk = k.slice(0, 4);
      const ag = petaAgama[k];
      if (!kabupaten[kk] || (!ag && !atributKec.has(k))) { throw new Error('Kecamatan/agama tidak cocok: ' + k); }
      const sumber = atributKec.get(k);
      const agamaWilayah = ag ? ag.slice(4) : sumber.agama;
      if (kecamatan[k]) {
        if (kecamatan[k].nama === d.a[3]) {
          duplikatKecamatan.push(k);
          return;
        }
        throw new Error('Kode kecamatan sama tetapi isi berbeda: ' + k);
      }
      kecamatan[k] = { kode: k, nama: d.a[3], kabupaten: kk, desa: [], agama: agamaWilayah };
      kabupaten[kk].kecamatan.push(k);
      provinsi[pk].kec++;
      kecTingkatAtas++;
    });
  });

  const duplikatDesa = [];
  function catatDesa(d, kc) {
    if (desa[d.kode]) {
      const lama = desa[d.kode];
      if (lama.kecamatan === kc && lama.nama === d.nama) {
        duplikatDesa.push(d.kode);
        return;
      }
      throw new Error('Kode desa sama tetapi isi/induk berbeda: ' + d.kode);
    }
    const kk = kc.slice(0, 4);
    const pk = kk.slice(0, 2);
    if (!provinsi[pk]) { throw new Error('Desa dengan provinsi tidak dikenal: ' + d.kode); }
    if (!kabupaten[kk]) { throw new Error('Desa tidak memiliki kabupaten resmi yang dikenal: ' + d.kode); }
    const kab = kabupaten[kk];
    if (!kecamatan[kc] && !tambahanKec[kc]) {
      tambahanKec[kc] = { kode: kc, nama: 'Kode kecamatan ' + kc.slice(4) + ' (induk tidak tercatat)', kabupaten: kk, desa: [], agama: null, tanpaInduk: true };
      kab.kecamatan.push(kc);
    }
    desa[d.kode] = d;
    (kecamatan[kc] || tambahanKec[kc]).desa.push(d.kode);
    kab.desa++;
    provinsi[pk].desa++;
  }

  Object.keys(berkasDesa).forEach(function (kk) {
    if (!berkasAgamaDesa[kk]) { throw new Error('Agama desa kurang: ' + kk); }
    const w = baca(path.join(AKAR, 'data', 'wilayah-warna', berkasDesa[kk]), 'WARNA_DESA');
    const a = baca(path.join(AKAR, 'data', 'agama', berkasAgamaDesa[kk]), 'AGAMA_DESA');
    const petaAgama = petaSumber(a.data, 10);
    w.data.forEach(function (d) {
      const k = kode(d.a[0], 2) + kode(d.a[1], 2) + kode(d.a[2], 2) + kode(d.a[3], 4);
      const kc = k.slice(0, 6);
      const ag = petaAgama[k];
      if (!ag && !atributDesa.has(k)) { throw new Error('Desa/agama tidak ditemukan: ' + k); }
      desaPetaLama.add(k);
      const sumber = atributDesa.get(k);
      const agamaWilayah = sumber ? sumber.agama : ag.slice(5);
      catatDesa({ kode: k, nama: d.a[4], kecamatan: kc, agama: agamaWilayah,
        agamaTanpaTotal: d.a[5] === null && agamaWilayah[0] === 0 }, kc);
    });
  });

  sumberKec.data.forEach(function (d) {
    if (!kabupaten[d.kabupaten]) { throw new Error('Kecamatan sumber tidak memiliki kabupaten yang dikenal: ' + d.kode); }
    if (kecamatan[d.kode]) { return; }
    d.tanpaInduk = true;
    tambahanKec[d.kode] = d;
  });

  if (!TANPA_SUMBER) {
    const petaDesaSumber = atributDesa;
    Object.keys(desa).forEach(function (k) {
      const d = petaDesaSumber.get(k);
      if (d) {
        desa[k].agama = d.agama;
        desa[k].agamaTanpaTotal = !(d.agama[0] > 0);
      }
    });
  }
  sumberDesa.data.forEach(function (d) {
    if (!desa[d.kode]) { catatDesa(d, d.kecamatan); }
  });

  Object.values(tambahanKec).forEach(function (p) {
    const nama = {};
    p.desa.forEach(function (kd) {
      const bagian = desa[kd].nama.split(/[\/\-]/)[0].trim();
      if (bagian.length > 3 && !/^(I|II|III|IV|V|\d+)$/i.test(bagian)) { nama[bagian] = true; }
    });
    const umum = Object.keys(nama);
    if (!p.nama && umum.length === 1) { p.nama = umum[0] + ' (induk tidak tercatat)'; }
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

  Object.assign(kecamatan, tambahanKec);
  function urutKode(a, b) { return Number(a) - Number(b) || String(a).localeCompare(String(b)); }
  Object.values(provinsi).forEach(function (p) { p.kab = [...new Set(p.kab)].sort(urutKode); });
  Object.values(kabupaten).forEach(function (p) { p.kecamatan = [...new Set(p.kecamatan)].sort(urutKode); });
  Object.values(tambahanKab).forEach(function (p) { p.kecamatan = [...new Set(p.kecamatan)].sort(urutKode); });
  Object.values(kecamatan).forEach(function (p) { p.desa = [...new Set(p.desa)].sort(urutKode); });

  const semuaKabupaten = Object.assign({}, kabupaten, tambahanKab);
  const semuaDesa = [];
  Object.values(kecamatan).forEach(function (p) { p.desa.forEach(function (kd) { semuaDesa.push(kd); }); });
  semuaDesa.sort();
  if (new Set(semuaDesa).size !== semuaDesa.length || semuaDesa.length !== Object.keys(desa).length) { throw new Error('Ada desa yang terdaftar lebih dari sekali atau tidak memiliki induk.'); }
  Object.values(kecamatan).forEach(function (p) {
    if (!semuaKabupaten[p.kabupaten]) { throw new Error('Induk kabupaten tidak ada: ' + p.kode); }
    p.desa.forEach(function (kd) { if (!desa[kd]) { throw new Error('Desa tidak ada pada indeks: ' + kd); } });
  });
  Object.values(provinsi).forEach(function (p) {
    p.kelompokTambahan = [];
    p.kec = p.kab.reduce(function (n, kk) { return n + semuaKabupaten[kk].kecamatan.length; }, 0);
    p.kab.forEach(function (kk) { if (!semuaKabupaten[kk]) { throw new Error('Kabupaten pada provinsi tidak ada: ' + kk); } });
    p.bahasa.forEach(function (nama) { if (bahasa[nama] !== p.kode) { throw new Error('Bahasa tidak cocok dengan provinsi: ' + nama); } });
  });
  if (!TANPA_SUMBER && (!sumberKec.data.length || !sumberDesa.data.length || sumberKec.mentah !== sumberKec.data.length + sumberKec.kosong + sumberKec.duplikat || sumberDesa.mentah !== sumberDesa.data.length + sumberDesa.kosong + sumberDesa.duplikat)) {
    throw new Error('Audit jumlah sumber tidak konsisten.');
  }

  const meta = {
    judul: 'Data Pemetaan',
    tahap: 1,
    dibuat: new Date().toISOString(),
    sumber: {
      wilayah: prop.tanggal,
      agama: agamaProp.tanggal,
      atributKecamatanDesa: [sumberKec.diambil, sumberDesa.diambil].filter(Boolean).sort()[0] || null,
      atributKecamatan: sumberKec.diambil || null,
      atributDesa: sumberDesa.diambil || null,
      atributSumber: TANPA_SUMBER ? 'Tidak disertakan (--tanpa-sumber)' : 'Dukcapil ArcGIS, diambil saat indeks dibuat',
      bahasa: 'Katalog Pemetaan — 430 nama bahasa, provinsi ditinjau manual'
    },
    total: {
      provinsi: Object.keys(provinsi).length,
      kabupaten: Object.keys(kabupaten).length,
      kecamatan: Object.keys(kecamatan).length,
      desa: Object.keys(desa).length,
      bahasa: Object.keys(bahasa).length,
      suku: suku.SUKU.length,
      agama: 7
    },
    desaTanpaPenduduk: Object.values(desa).filter(function (d) { return d.agamaTanpaTotal; }).length,
    kecamatanSumber: sumberKec.mentah,
    desaSumber: sumberDesa.mentah,
    kecamatanTanpaIdentitas: sumberKec.kosong,
    entriSumberTanpaIdentitas: sumberDesa.kosong,
    kecamatanDuplikatAtribut: sumberKec.duplikat,
    desaDuplikatAtribut: sumberDesa.duplikat,
    desaTanpaGeometri: sumberDesa.data.filter(function (d) { return !desaPetaLama.has(d.kode); }).length,
    desaTanpaIndukKecamatan: Object.values(tambahanKec).reduce(function (n, p) { return n + p.desa.length; }, 0),
    kelompokTanpaIndukKecamatan: Object.keys(tambahanKec).length,
    kabupatenTanpaInduk: Object.keys(tambahanKab).length,
    desaDuplikatIdentik: duplikatDesa.length,
    kecamatanDuplikatIdentik: duplikatKecamatan.length,
    provinsi: Object.fromEntries(Object.entries(provinsi).map(function ([k, p]) {
      return [k, { nama: p.nama, kab: p.kab.length, kec: p.kec, desa: p.desa,
        kelompokTambahan: p.kelompokTambahan.length, kecamatanTingkatAtas: p.kab.reduce(function (n, kk) { return n + kabupaten[kk].kecamatan.filter(function (kc) { return !kecamatan[kc].tanpaInduk; }).length; }, 0), bahasa: p.bahasa.length, suku: p.suku.length, agama: p.agama }];
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
      }),
      kelompokTambahan: p.kelompokTambahan.map(function (kk) {
        const q = tambahanKab[kk];
        return { kode: kk, nama: q.nama, kec: q.kecamatan.length, desa: q.desa, agama: q.agama, tanpaInduk: true };
      })
    });
  });
  Object.assign(kabupaten, tambahanKab);
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

  fs.readdirSync(KELUARAN).forEach(function (nama) {
    if (!/\.json$/.test(nama)) { return; }
    const m = nama.match(/^(provinsi|kabupaten|kecamatan)-(\d+)\.json$/);
    const sah = !m || (m[1] === 'provinsi' ? provinsi[m[2]] : m[1] === 'kabupaten' ? kabupaten[m[2]] : kecamatan[m[2]]);
    if (!sah || ['desa-tanpa-geometri.json', 'kecamatan-tanpa-geometri.json', 'desa-sumber.json', 'kecamatan-sumber.json'].includes(nama)) {
      fs.unlinkSync(path.join(KELUARAN, nama));
    }
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
  const totalKecamatan = Object.keys(kecamatan).length;
  const totalDesa = Object.keys(desa).length;
  if (Object.keys(tambahanKab).length || Object.keys(tambahanKec).length !== Object.values(kecamatan).filter(function (p) { return p.tanpaInduk; }).length || (!TANPA_SUMBER && (totalKecamatan !== kecTingkatAtas + Object.keys(tambahanKec).length)) ||
      semua.provinsi !== Object.keys(provinsi).length || semua.kabupaten !== Object.keys(kabupaten).length || semua.kecamatan !== totalKecamatan || semua.desa !== totalDesa ||
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
