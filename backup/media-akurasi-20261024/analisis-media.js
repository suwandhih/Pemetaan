/* Analisis target bahasa dan produk media (orderan 32).
   Perhitungan murni dapat diuji di Node; tampilan hanya membaca data laporan. */
(function (akar, modul) {
  if (typeof module === 'object' && module.exports) { module.exports = modul(); }
  else { akar.AnalisisMedia = modul(); }
}(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  var INTI = ['Film Isa Al-Masih', 'Film Ikatan Ilahi', 'Video Kitab Suci'];
  var TAMBAHAN = ['Clip Kitab Suci', 'Aplikasi Kitab Suci'];
  var SEMUA = INTI.concat(TAMBAHAN);
  var SINGKAT = { 'Film Isa Al-Masih': 'Film Isa', 'Film Ikatan Ilahi': 'Film Ilahi', 'Video Kitab Suci': 'Video Kitab Suci', 'Clip Kitab Suci': 'Clip', 'Aplikasi Kitab Suci': 'Aplikasi' };
  function normal(n) { return String(n || '').toLocaleLowerCase('id-ID').replace(/^bahasa\s+/i, '').replace(/\s+/g, ' ').trim(); }
  function rincian(a, label) { var r = (a.rincian || []).find(function (x) { return x.label === label; }); return r ? String(r.nilai || '').trim() : ''; }
  function bahasa(a) {
    var dariRincian = rincian(a, 'Bahasa');
    if (dariRincian) { return dariRincian; }
    var judul = String(a.nama || '').trim();
    if (!/ - /.test(judul) || SEMUA.indexOf(judul.split(' - ')[0]) >= 0) { return ''; }
    return judul.replace(/\s+-\s+(Film|Video|Clip|Aplikasi)[\s\S]*$/, '');
  }
  function pk(a) { var k = String(a.kodeProvinsi || '').trim(); return k ? k.padStart(2, '0') : ''; }
  function angka(n) { return n === null || n === undefined ? '—' : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function persen(n, d) { return d > 0 ? (n / d * 100).toFixed(1).replace('.', ',').replace(',0', '') + '%' : '—'; }
  function buat(tag, kelas, teks) { var e = document.createElement(tag); if (kelas) e.className = kelas; if (teks !== undefined) e.textContent = teks; return e; }
  function hitung(masukan) {
    var indeks = masukan.indeks, katalog = masukan.katalog || [], tersimpan = masukan.tersimpan || [];
    var target = [];
    Object.entries(masukan.bahasaSuku).forEach(function (x) {
      (x[1].bahasa || []).forEach(function (nama) { target.push({ nama: nama, pk: x[0], provinsi: indeks.provinsi[x[0]].nama }); });
    });
    var entri = target.slice(), namaTarget = new Map();
    target.forEach(function (t) {
      var k = normal(t.nama) + '|' + t.pk;
      if (!namaTarget.has(k)) { namaTarget.set(k, Object.assign({}, t, { nama: t.nama.replace(/^Bahasa\s+/i, ''), alternatif: [t.nama], entri: [t] })); }
      else { var lama = namaTarget.get(k); lama.alternatif.push(t.nama); lama.entri.push(t); }
    });
    target = [...namaTarget.values()];
    var kunci = new Map(target.map(function (t) { return [normal(t.nama) + '|' + t.pk, t]; }));
    var targetNama = new Map();
    target.forEach(function (t) {
      var n = normal(t.nama);
      if (!targetNama.has(n)) { targetNama.set(n, []); }
      targetNama.get(n).push(t);
    });
    function targetTunggal(a) {
      var daftar = targetNama.get(normal(bahasa(a))) || [];
      return daftar.length === 1 ? daftar[0] : null;
    }
    function cocok(a, m, t) {
      if (a.kategori !== m || normal(bahasa(a)) !== normal(t.nama)) { return false; }
      if (INTI.indexOf(m) >= 0) { return pk(a) === t.pk; }
      return pk(a) === t.pk || (!pk(a) && targetTunggal(a) === t);
    }
    var pasangan = katalog.map(function (a) {
      var t = TAMBAHAN.indexOf(a.kategori) >= 0 && !pk(a) ? targetTunggal(a) : kunci.get(normal(bahasa(a)) + '|' + pk(a));
      return t && cocok(a, a.kategori, t) ? t : null;
    });
    var bahasaTarget = target.map(function (t) {
      var produk = {}, kurang = [];
      SEMUA.forEach(function (m) {
        var api = katalog.filter(function (a) { return cocok(a, m, t); });
        var simpan = tersimpan.filter(function (a) { return cocok(a, m, t); });
        produk[m] = { api: api, simpan: simpan, ada: api.length > 0 };
        if (INTI.indexOf(m) >= 0 && !api.length) { kurang.push(m); }
      });
      var isi = INTI.some(function (m) { return produk[m].ada; });
      var jumlah = INTI.filter(function (m) { return produk[m].ada; }).length;
      return Object.assign({}, t, { produk: produk, isi: isi, jumlahInti: jumlah, kurang: kurang,
        status: jumlah === 3 ? 'lengkap' : jumlah ? 'sebagian' : 'belum' });
    });
    var kategori = {};
    SEMUA.forEach(function (m) {
      var wajib = INTI.indexOf(m) >= 0;
      var tercakup = bahasaTarget.filter(function (b) { return b.produk[m].ada; }).length;
      var api = katalog.filter(function (a) { return a.kategori === m; });
      kategori[m] = { target: wajib ? target.length : null, terpenuhi: tercakup,
        belum: wajib ? target.length - tercakup : null, wajib: wajib,
        recordApi: api.length, recordSimpan: tersimpan.filter(function (a) { return a.kategori === m; }).length,
        terbanding: api.filter(function (a) { return pasangan[katalog.indexOf(a)]; }).length };
    });
    var luar = katalog.filter(function (a, i) { return !pasangan[i]; }).map(function (a) {
      var jumlahNama = (targetNama.get(normal(bahasa(a))) || []).length;
      return { media: a, alasan: !bahasa(a) ? 'Bahasa tidak tersedia' : !jumlahNama ? 'Bahasa belum ada dalam katalog target' : !pk(a) && jumlahNama > 1 ? 'Nama bahasa muncul di beberapa provinsi; provinsi rekaman diperlukan' : !pk(a) ? 'Nasional/gugus; bukan target bahasa spesifik' : 'Provinsi tidak sesuai target bahasa' };
    });
    var provinsi = Object.entries(indeks.provinsi).map(function (x) {
      var daftar = bahasaTarget.filter(function (b) { return b.pk === x[0]; });
      var isi = daftar.filter(function (b) { return b.isi; }).length;
      var lengkap = daftar.filter(function (b) { return b.status === 'lengkap'; }).length;
      return { pk: x[0], nama: x[1].nama, target: daftar.length, entri: entri.filter(function (e) { return e.pk === x[0]; }).length, isi: isi, kurangIsi: daftar.length - isi,
        lengkap: lengkap, sebagian: daftar.filter(function (b) { return b.status === 'sebagian'; }).length,
        belum: daftar.filter(function (b) { return b.status === 'belum'; }).length,
        kurangProduk: daftar.reduce(function (n, b) { return n + b.kurang.length; }, 0) };
    });
    return { target: target.length, entriKatalog: entri.length, entri: entri, bahasa: bahasaTarget, kategori: kategori, provinsi: provinsi, luar: luar,
      isi: bahasaTarget.filter(function (b) { return b.isi; }).length,
      lengkap: bahasaTarget.filter(function (b) { return b.status === 'lengkap'; }).length,
      sebagian: bahasaTarget.filter(function (b) { return b.status === 'sebagian'; }).length,
      belum: bahasaTarget.filter(function (b) { return b.status === 'belum'; }).length,
      kurangProduk: bahasaTarget.reduce(function (n, b) { return n + b.kurang.length; }, 0),
      prioritas: bahasaTarget.filter(function (b) { return b.kurang.length; }).sort(function (a, b) {
        return Number(a.isi) - Number(b.isi) || b.kurang.length - a.kurang.length || a.nama.localeCompare(b.nama, 'id');
      }) };
  }

  var konfig = {}, model = null, siap = false, punyaKatalog = false, parsial = false;
  var filter = { cari: '', provinsi: 'semua', status: 'semua', urut: 'kurang', tampilan: 'target' };
  function tidakAda() { return parsial ? 'belum ditemukan pada data terbaca' : 'belum tercatat'; }
  function ringkasPeringatan(d) { if (parsial) { d.appendChild(buat('p', 'catatan', 'Katalog belum lengkap. Angka “belum” hanya berarti belum ditemukan pada rekaman yang berhasil dibaca; bukan bukti produk tidak tersedia.')); } }
  var batas = 50;
  function kartu(judul, nilai, catatan) {
    var c = buat('article', 'analisis-kartu'); c.append(buat('span', '', judul), buat('strong', '', nilai), buat('small', '', catatan)); return c;
  }
  function donat(judul, ada, target, keterangan) {
    var f = buat('figure', 'donat'), box = buat('div', 'donat-lingkar');
    var ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 120 120'); s.setAttribute('role', 'img');
    s.setAttribute('aria-label', judul + ': ' + (punyaKatalog ? ada + ' dari ' + target + ' bahasa, ' + persen(ada, target) : 'belum dibaca'));
    var latar = document.createElementNS(ns, 'circle'); latar.setAttribute('cx', '60'); latar.setAttribute('cy', '60'); latar.setAttribute('r', '47'); latar.setAttribute('class', 'donat-latar');
    var nilai = document.createElementNS(ns, 'circle'); nilai.setAttribute('cx', '60'); nilai.setAttribute('cy', '60'); nilai.setAttribute('r', '47'); nilai.setAttribute('class', 'donat-nilai');
    var keliling = 2 * Math.PI * 47, rasio = target ? ada / target : 0;
    nilai.setAttribute('stroke-dasharray', (punyaKatalog ? keliling * rasio : 0) + ' ' + keliling);
    s.append(latar, nilai); box.appendChild(s);
    var angkaTengah = buat('strong', '', punyaKatalog ? persen(ada, target) : '—'); box.appendChild(angkaTengah); f.appendChild(box);
    var cap = buat('figcaption'); cap.appendChild(buat('h3', '', judul));
    cap.appendChild(buat('p', '', punyaKatalog ? angka(ada) + ' sudah · ' + angka(target - ada) + (parsial ? ' belum ditemukan' : ' belum') : 'Baca API untuk membandingkan'));
    cap.appendChild(buat('small', '', keterangan)); f.appendChild(cap); return f;
  }
  function gambarRingkasan(d) {
    ringkasPeringatan(d);
    var ringkas = buat('div', 'analisis-ringkasan');
    ringkas.append(kartu('Target bahasa unik', angka(model.target), model.entriKatalog + ' entri katalog · variasi “Bahasa …” disatukan'),
      kartu('Sudah ada isi film/video', punyaKatalog ? angka(model.isi) : '—', punyaKatalog ? persen(model.isi, model.target) + ' dari target' : 'Menunggu katalog API'),
      kartu(parsial ? 'Belum ditemukan isi' : 'Belum ada isi', punyaKatalog ? angka(model.target - model.isi) : '—', parsial ? 'Dari rekaman yang berhasil dibaca' : 'Prioritas cakupan isi'),
      kartu('Lengkap 3 film/video', punyaKatalog ? angka(model.lengkap) : '—', punyaKatalog ? model.sebagian + ' sebagian · ' + model.belum + ' belum' : 'Ukuran kedua'),
      kartu(parsial ? 'Kekurangan pada data terbaca' : 'Kekurangan produk', punyaKatalog ? angka(model.kurangProduk) : '—', 'Dari ' + angka(model.target * 3) + ' pasangan bahasa × film/video' + (parsial ? ' · sementara' : '')));
    d.appendChild(ringkas);
    var judul = buat('div', 'baris-judul'), isi = buat('div'); isi.append(buat('h2', '', 'Apa yang sudah terpenuhi?'), buat('p', 'kecil', 'Dua ukuran: cakupan isi dan kelengkapan tiap produk. Bagian “belum” baru sah setelah katalog berhasil dibaca.'));
    judul.appendChild(isi); d.appendChild(judul);
    if (parsial) { d.appendChild(buat('p', 'kecil', 'Hasil sementara: bagian “belum” berarti belum ditemukan pada kategori yang berhasil dibaca.')); }
    var grafik = buat('div', 'donat-grid');
    grafik.appendChild(donat('Cakupan isi', model.isi, model.target, 'Minimal satu dari tiga jenis film/video.'));
    INTI.forEach(function (m) { var k = model.kategori[m]; grafik.appendChild(donat(SINGKAT[m], k.terpenuhi, k.target, k.recordApi + ' record katalog · bahasa unik dihitung sekali')); });
    d.appendChild(grafik);
    var tambahan = buat('div', 'analisis-tambahan');
    TAMBAHAN.forEach(function (m) {
      var k = model.kategori[m], c = buat('article', 'kotak-produk');
      c.append(buat('h3', '', SINGKAT[m]), buat('strong', '', punyaKatalog ? angka(k.terpenuhi) + ' bahasa teridentifikasi' : '—'),
        buat('p', '', k.recordApi + ' record katalog · ' + k.recordSimpan + ' tersimpan'),
        buat('small', '', 'Dibandingkan bila bahasa tersedia. Rekaman nasional/gugus tidak dianggap target bahasa yang belum terpenuhi.'));
      tambahan.appendChild(c);
    });
    d.appendChild(tambahan);
    if (punyaKatalog && model.luar.length) {
      var b = buat('button', 'tombol kecil', model.luar.length + ' media di luar perbandingan bahasa'); b.type = 'button'; b.dataset.aksi = 'luar';
      b.addEventListener('click', function () { konfig.bukaMedia(model.luar, 'Media nasional/gugus atau di luar target'); });
      var w = buat('div', 'catatan'); w.appendChild(b); w.appendChild(buat('p', 'kecil', 'Ditampilkan terpisah; tidak ditebak bahasa atau provinsinya.')); d.appendChild(w);
    }
  }
  function pilihProvinsi(kode) { filter.provinsi = kode; filter.cari = ''; filter.status = 'semua'; filter.tampilan = 'target'; batas = 50; gambar(); var m = document.getElementById('matriks-bahasa'); if (m) m.scrollIntoView({ block: 'start' }); }
  function gambarProvinsi(d) {
    var judul = buat('div', 'baris-judul'), teks = buat('div'); teks.append(buat('h2', '', '38 provinsi: mana yang masih kurang?'), buat('p', 'kecil', 'Batang menunjukkan cakupan isi. ' + (parsial ? 'Pada data terbaca, angka' : 'Angka') + ' kanan = bahasa belum memiliki isi film/video. Klik untuk membuka matriks provinsi.'));
    var select = buat('select'); select.id = 'urut-provinsi'; select.setAttribute('aria-label', 'Urutkan provinsi');
    [['kurang', 'Kekurangan terbanyak'], ['nama', 'Nama provinsi'], ['target', 'Target bahasa terbanyak']].forEach(function (x) { var o = buat('option', '', x[1]); o.value = x[0]; o.selected = filter.urut === x[0]; select.appendChild(o); });
    judul.append(teks, select); d.appendChild(judul);
    var daftar = model.provinsi.slice().sort(function (a, b) { return filter.urut === 'nama' ? a.nama.localeCompare(b.nama, 'id') : filter.urut === 'target' ? b.target - a.target || a.nama.localeCompare(b.nama, 'id') : b.kurangIsi - a.kurangIsi || b.target - a.target || a.nama.localeCompare(b.nama, 'id'); });
    var grafik = buat('div', 'grafik-provinsi');
    daftar.forEach(function (p) {
      var b = buat('button', 'baris-provinsi'); b.type = 'button'; b.dataset.provinsi = p.pk;
      var kepala = buat('span', 'provinsi-kepala'); kepala.append(buat('strong', '', p.nama), buat('small', '', p.target ? p.kurangIsi + (parsial ? ' belum ditemukan' : ' belum') + ' · ' + p.target + ' target / ' + p.entri + ' entri' : 'Belum ada bahasa pada katalog'));
      var batang = buat('span', 'batang-target'), bagian = buat('span', 'batang-terpenuhi');
      bagian.style.width = punyaKatalog && p.target ? p.isi / p.target * 100 + '%' : '0%'; batang.appendChild(bagian);
      var kaki = buat('span', 'provinsi-angka', punyaKatalog ? p.isi + ' ada isi · ' + p.lengkap + ' lengkap' : 'Menunggu katalog');
      b.append(kepala, batang, kaki); b.addEventListener('click', function () { pilihProvinsi(p.pk); }); grafik.appendChild(b);
    });
    d.appendChild(grafik);
  }
  function gambarPrioritas(d) {
    var box = buat('section', 'prioritas'); box.append(buat('h2', '', parsial ? 'Prioritas sementara' : 'Prioritas berikutnya'), buat('p', 'kecil', (parsial ? 'Berdasarkan rekaman yang berhasil dibaca; verifikasi ulang setelah katalog lengkap. ' : '') + (parsial ? 'Bahasa yang belum ditemukan' : 'Bahasa tanpa isi') + ' lebih dahulu, lalu bahasa yang produk film/videonya belum lengkap.'));
    if (!punyaKatalog) { box.appendChild(buat('p', 'catatan', 'Baca katalog media untuk menghitung prioritas berdasarkan data terbaru.')); d.appendChild(box); return; }
    var daftar = buat('ol', 'daftar-prioritas');
    model.prioritas.slice(0, 12).forEach(function (b) {
      var li = buat('li'), tombol = buat('button', 'prioritas-nama', b.nama); tombol.type = 'button'; tombol.addEventListener('click', function () { konfig.bukaBahasa(b); });
      li.append(tombol, buat('span', '', b.provinsi), buat('strong', '', b.isi ? (parsial ? 'Belum ditemukan ' : 'Kurang ') + b.kurang.length + ' produk' : parsial ? 'Belum ditemukan isi' : 'Belum ada isi'));
      daftar.appendChild(li);
    });
    box.appendChild(daftar); d.appendChild(box);
  }
  function terfilter() {
    var kata = normal(filter.cari);
    var daftar = filter.tampilan === 'entri' ? model.bahasa.flatMap(function (b) {
      return b.entri.map(function (e) { return Object.assign({}, b, { namaTampil: e.nama, namaKelompok: b.nama, alternatifTampil: false }); });
    }) : model.bahasa;
    return daftar.filter(function (b) {
      return (filter.provinsi === 'semua' || b.pk === filter.provinsi) &&
        (filter.status === 'semua' || b.status === filter.status || (filter.status === 'tanpa-isi' && !b.isi)) &&
        (!kata || normal(b.nama).includes(kata) || (b.alternatif || []).some(function (n) { return normal(n).includes(kata); }) || normal(b.provinsi).includes(kata));
    }).sort(function (a, b) { return Number(a.isi) - Number(b.isi) || b.kurang.length - a.kurang.length || a.nama.localeCompare(b.nama, 'id'); });
  }
  function sel(b, m) {
    var p = b.produk[m], tombol = buat('button', 'sel-produk ' + (p.ada ? 'ada' : 'kosong'), punyaKatalog ? p.ada ? '✓' : '—' : '?');
    tombol.type = 'button'; tombol.title = SINGKAT[m] + ': ' + (punyaKatalog ? p.ada ? p.api.length + ' katalog; ' + p.simpan.length + ' tersimpan' : tidakAda() : 'belum dibandingkan');
    tombol.setAttribute('aria-label', b.nama + ', ' + tombol.title); tombol.addEventListener('click', function () { konfig.bukaBahasa(b); }); return tombol;
  }
  function gambarMatriks(d) {
    var judul = buat('div', 'baris-judul'), teks = buat('div'); teks.append(buat('h2', '', 'Matriks bahasa × produk'), buat('p', 'kecil', 'Klik nama bahasa atau status produk untuk melihat judul/nama media. Lengkap berarti ketiga jenis film/video tersedia.' + (parsial ? ' Tanda “—” berarti belum ditemukan pada data terbaca.' : '')));
    judul.appendChild(teks); d.appendChild(judul);
    if (punyaKatalog) { d.appendChild(buat('p', 'kecil', parsial ? 'Belum: belum ditemukan produk pada data yang berhasil dibaca, bukan bukti produk tidak ada.' : 'Belum: ketiga produk film/video belum tercatat pada katalog yang berhasil dibaca.')); }
    var alat = buat('div', 'matriks-alat'), cari = buat('input'); cari.type = 'search'; cari.id = 'cari-matriks'; cari.placeholder = 'Cari bahasa atau provinsi…'; cari.value = filter.cari; cari.setAttribute('aria-label', 'Cari bahasa atau provinsi dalam matriks');
    var prov = buat('select'); prov.id = 'filter-provinsi'; prov.setAttribute('aria-label', 'Filter provinsi');
    var semua = buat('option', '', 'Semua provinsi'); semua.value = 'semua'; prov.appendChild(semua);
    Object.entries(konfig.indeks.provinsi).forEach(function (x) { var o = buat('option', '', x[1].nama); o.value = x[0]; o.selected = filter.provinsi === x[0]; prov.appendChild(o); });
    var status = buat('select'); status.id = 'filter-status'; status.setAttribute('aria-label', 'Filter kelengkapan');
    [['semua', 'Semua status'], ['lengkap', 'Lengkap 3 film/video'], ['sebagian', 'Sebagian produk'], ['belum', 'Belum ada produk'], ['tanpa-isi', 'Belum ada isi film/video']].forEach(function (x) { var o = buat('option', '', x[1]); o.value = x[0]; o.selected = filter.status === x[0]; status.appendChild(o); });
    var tampilan = buat('select'); tampilan.id = 'tampilan-matriks'; tampilan.setAttribute('aria-label', 'Tampilan target unik atau entri katalog');
    [['target', model.target + ' target bahasa unik'], ['entri', model.entriKatalog + ' entri katalog']].forEach(function (x) { var o = buat('option', '', x[1]); o.value = x[0]; o.selected = filter.tampilan === x[0]; tampilan.appendChild(o); });
    alat.append(cari, prov, status, tampilan); d.appendChild(alat);
    if (!punyaKatalog) { d.appendChild(buat('p', 'catatan', 'Daftar ' + model.entriKatalog + ' entri / ' + model.target + ' target unik tersedia, tetapi status produknya belum dibandingkan. Baca katalog media terbaru untuk mengisi matriks.')); }
    var hasil = terfilter(), wrap = buat('div', 'tabel-bungkus matriks-bungkus'), table = buat('table', 'tabel matriks'), thead = buat('thead'), hr = buat('tr');
    ['Bahasa', 'Provinsi', 'Isi', 'FI', 'II', 'Video', 'Clip', 'App', 'Status'].forEach(function (h) { var th = buat('th', '', h); th.scope = 'col'; hr.appendChild(th); }); thead.appendChild(hr); table.appendChild(thead);
    var body = buat('tbody'); body.id = 'isi-matriks';
    hasil.slice(0, batas).forEach(function (b) {
      var tr = buat('tr'), th = buat('th'), nama = buat('button', 'tombol-nama', b.namaTampil || b.nama); th.scope = 'row'; nama.type = 'button'; nama.addEventListener('click', function () { konfig.bukaBahasa(b); }); th.appendChild(nama);
      if (b.namaTampil && b.namaTampil !== b.nama) { th.appendChild(buat('small', 'alias-matriks', 'Target: ' + b.nama)); } tr.appendChild(th);
      tr.appendChild(buat('td', 'kecil', b.provinsi));
      var isi = buat('td', '', punyaKatalog ? b.isi ? 'Ada' : parsial ? 'Tidak ditemukan' : 'Belum' : '—'); tr.appendChild(isi);
      SEMUA.forEach(function (m) { var td = buat('td'); td.appendChild(sel(b, m)); tr.appendChild(td); });
      tr.appendChild(buat('td', 'status-' + b.status, punyaKatalog ? b.status === 'lengkap' ? 'Lengkap' : b.status === 'sebagian' ? 'Sebagian' : parsial ? 'Tidak ditemukan' : 'Belum' : 'Belum dibandingkan'));
      body.appendChild(tr);
    });
    if (!hasil.length) { var tr = buat('tr'), td = buat('td', 'tanpa-hasil', 'Tidak ada bahasa yang cocok dengan filter.'); td.colSpan = 9; tr.appendChild(td); body.appendChild(tr); }
    table.appendChild(body); wrap.appendChild(table); d.appendChild(wrap);
    var kaki = buat('div', 'matriks-kaki'); kaki.appendChild(buat('span', 'kecil', 'Menampilkan ' + Math.min(batas, hasil.length) + ' dari ' + hasil.length + ' bahasa'));
    if (hasil.length > batas) { var lebih = buat('button', 'tombol kecil', 'Tampilkan 50 bahasa lagi'); lebih.type = 'button'; lebih.id = 'matriks-lebih'; kaki.appendChild(lebih); }
    d.appendChild(kaki);
  }
  function gambar() {
    if (!model || typeof document === 'undefined') { return; }
    var d = document.getElementById('analisis-isi'); if (!d) { return; }
    d.replaceChildren(); gambarRingkasan(d); gambarProvinsi(d); gambarPrioritas(d);
    var matriks = buat('section'); matriks.id = 'matriks-bahasa'; gambarMatriks(matriks); d.appendChild(matriks);
  }
  function pasang(pilihan) {
    konfig = pilihan;
    if (siap || typeof document === 'undefined') { return; }
    siap = true;
    var panel = document.getElementById('panel-analisis');
    document.getElementById('muat-analisis').addEventListener('click', function () { konfig.muatMedia(); });
    panel.addEventListener('input', function (e) { if (e.target.id === 'cari-matriks') { filter.cari = e.target.value; batas = 50; gambarMatriksPadaTempat(); } });
    panel.addEventListener('change', function (e) {
      if (e.target.id === 'filter-provinsi') { filter.provinsi = e.target.value; batas = 50; gambarMatriksPadaTempat(); }
      if (e.target.id === 'filter-status') { filter.status = e.target.value; batas = 50; gambarMatriksPadaTempat(); }
      if (e.target.id === 'tampilan-matriks') { filter.tampilan = e.target.value; batas = 50; gambarMatriksPadaTempat(); }
      if (e.target.id === 'urut-provinsi') { filter.urut = e.target.value; gambar(); }
    });
    panel.addEventListener('click', function (e) { if (e.target.id === 'matriks-lebih') { batas += 50; gambarMatriksPadaTempat(); } });
  }
  function gambarMatriksPadaTempat() {
    var lama = document.getElementById('matriks-bahasa'); if (!lama) { return; }
    var aktif = document.activeElement, id = aktif && aktif.id, awal = aktif && aktif.selectionStart, akhir = aktif && aktif.selectionEnd;
    var baru = buat('section'); baru.id = 'matriks-bahasa'; gambarMatriks(baru); lama.replaceWith(baru);
    if (id && lama.contains(aktif)) {
      var pengganti = document.getElementById(id);
      if (pengganti) { pengganti.focus(); if (id === 'cari-matriks' && awal !== null) { pengganti.setSelectionRange(awal, akhir); } }
    }
  }
  function perbarui(data) {
    konfig.indeks = data.indeks; punyaKatalog = Array.isArray(data.katalog);
    parsial = punyaKatalog && Array.isArray(data.gagalMedia) && data.gagalMedia.length > 0;
    model = hitung(data); gambar();
  }
  function bukaProvinsi(kode) { pilihProvinsi(kode); var tab = document.getElementById('tab-analisis'); if (tab) { tab.click(); } }
  return { hitung: hitung, pasang: pasang, perbarui: perbarui, bukaProvinsi: bukaProvinsi, normal: normal, INTI: INTI, TAMBAHAN: TAMBAHAN };
}));
