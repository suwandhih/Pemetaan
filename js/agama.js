/* Pemetaan — peta tematik penduduk menurut agama (orderan 21)
   ------------------------------------------------------------------
   Data  : Dukcapil Kemendagri (gis.dukcapil.kemendagri.go.id)
           38 provinsi · 514 kab/kota · 7.246 kecamatan · 83.411 desa
   Berkas: data/agama/prop-nasional.js   (38 provinsi)
           data/agama/kab-nasional.js    (514 kab/kota)
           data/agama/kec-<provinsi>.js  (dimuat saat tingkat kecamatan dipilih)
           data/agama/desa-<kabkota>.js  (dimuat saat tingkat desa dipilih)

   Batas wilayah TIDAK disimpan lagi di sini — dipakai berkas yang sama
   dengan peta Populasi (data/wilayah-warna/), lalu disambung lewat kode
   wilayah. Jadi tidak ada poligon yang disimpan dua kali.

   Warna = PERSENTASE penduduk, bukan jumlah jiwa. Sebabnya: dengan jumlah
   jiwa, seluruh Pulau Jawa menjadi satu warna gelap dan seluruh Papua satu
   warna terang — peta tidak memberi keterangan apa-apa. Persentase
   menjawab pertanyaan yang sebenarnya ditanyakan: "di sini mayoritas
   agama apa, dan seberapa kuat". Angka jiwanya tetap ditulis di kartu
   dan di blok form anggota.

   Diukur 17 Okt 2026: jumlah 7 agama 284.915.499 vs jumlah penduduk
   284.973.643 (selisih 0,02%) pada tingkat provinsi & kab/kota. Selisih
   itu berasal dari penduduk yang agamanya belum tercatat Dukcapil. Karena
   itu persentase dihitung dari JUMLAH PENDUDUK, bukan dari jumlah 7 agama
   — supaya tidak dilebih-lebihkan.

   Lapisan peta (`wilayah`, `wilayah-isi`, `wilayah-garis`) DIPAKAI
   BERSAMA dengan js/warna.js. Karena itu keduanya tidak boleh menyala
   bersamaan: menyalakan yang satu mematikan yang lain. */

(function () {
  'use strict';

  /* Nama kolom Dukcapil memakai "katholik"; yang ditulis di layar "Katolik". */
  var AGAMA = [
    { id: 'islam', nama: 'Islam', warna: '#1b7f4b' },
    { id: 'kristen', nama: 'Kristen', warna: '#1f6fd0' },
    { id: 'katholik', nama: 'Katolik', warna: '#7b3fa0' },
    { id: 'hindu', nama: 'Hindu', warna: '#e07b1f' },
    { id: 'budha', nama: 'Budha', warna: '#c9a227' },
    { id: 'konghucu', nama: 'Konghucu', warna: '#c0392b' },
    { id: 'kepercayaan', nama: 'Kepercayaan', warna: '#8a6a4a' }
  ];

  var TINGKAT = {
    provinsi: { nama: 'Provinsi', ikon: '\uD83D\uDDFA\uFE0F', kunci: 'PROP', berkas: 'prop-nasional.js' },
    kabkota: { nama: 'Kabupaten/Kota', ikon: '\uD83C\uDFD9\uFE0F', kunci: 'KAB', berkas: 'kab-nasional.js' },
    kecamatan: { nama: 'Kecamatan', ikon: '\uD83D\uDCCD', kunci: 'KEC' },
    desa: { nama: 'Desa/Kelurahan', ikon: '\uD83C\uDFE1', kunci: 'DESA' }
  };

  var URUT_TINGKAT = ['provinsi', 'kabkota', 'kecamatan', 'desa'];
  var LEBAR_KODE = [2, 2, 2, 4];
  var KELAS = 6;
  /* Dipakai hanya bila wilayah yang bernilai lebih dari nol kurang dari 3
     (mis. Konghucu di sebagian provinsi) — kuantil tidak ada artinya di situ. */
  var BATAS_TETAP = [1, 5, 15, 40, 70];
  var TANPA_NILAI = '#39434e';
  var KUNCI_SIMPAN = 'peta_agama';

  var aktif = null;
  var agamaTerpilih = 'islam';
  var terpasang = false;
  var klikTerpasang = false;
  var derajatDitutupSementara = false;
  var derajatTerakhir = null;
  var peta = null;

  var elPemilih = document.getElementById('pemilih-agama');
  var elTombol = document.getElementById('tombol-agama');
  var elKartu = document.getElementById('kartu');
  var elDerajat = document.getElementById('derajat');

  /* ---------- bantu ---------- */

  function angka(n) {
    return Number(n).toLocaleString('id-ID');
  }

  /* Persentase ditulis dengan angka di belakang koma hanya bila memang
     perlu — 0,004% dan 12% tidak boleh ditulis sama-sama bulat. Nilai di
     bawah 0,1% perlu lebih banyak angka: tanpa itu Konghucu & Kepercayaan
     selalu tertulis "0,00%" dan keterangan warnanya jadi tidak terbaca. */
  function persen(v) {
    if (!(v > 0)) { return '0%'; }
    if (v < 0.001) { return v.toFixed(4).replace('.', ',') + '%'; }
    if (v < 0.1) { return v.toFixed(3).replace('.', ',') + '%'; }
    if (v < 1) { return v.toFixed(2).replace('.', ',') + '%'; }
    if (v < 10) { return v.toFixed(1).replace('.', ',') + '%'; }
    return Math.round(v) + '%';
  }

  /* Jumlah angka di belakang koma untuk keterangan warna. Batas kelas
     dihitung dari sebaran, jadi pada agama yang jumlahnya sangat kecil
     (Konghucu, Kepercayaan) batas-batasnya bisa tertulis sama bila
     desimalnya kurang — diukur 17 Okt 2026: Konghucu tingkat kab/kota
     berbatas 0,00009%–3,5%, dan dengan 3 desimal seluruh kelas bawah
     tertulis "0,001%". Sebaliknya Kristen tingkat provinsi berbatas
     2,0%–2,4% dan dengan 0 desimal tertulis "2% – 2%".
     Karena itu desimal ditentukan dari DUA hal: nilai batas terkecil dan
     jarak terkecil antar batas — diambil yang paling banyak. */
  function desimalUntuk(n) {
    if (!(n > 0)) { return 0; }
    if (n >= 1) { return 0; }
    if (n >= 0.1) { return 1; }
    if (n >= 0.01) { return 2; }
    if (n >= 0.001) { return 3; }
    if (n >= 0.0001) { return 4; }
    return 5;
  }

  function desimalKelas(batas) {
    var terkecil = Infinity;
    var jarak = Infinity;
    var sebelumnya = 0;
    for (var i = 0; i < batas.length; i++) {
      if (batas[i] > 0 && batas[i] < terkecil) { terkecil = batas[i]; }
      var d = batas[i] - sebelumnya;
      if (d > 0 && d < jarak) { jarak = d; }
      sebelumnya = batas[i];
    }
    return Math.max(desimalUntuk(terkecil), desimalUntuk(jarak));
  }

  function persenKelas(v, desimal) {
    if (!(v > 0)) { return '0%'; }
    return v.toFixed(desimal).replace('.', ',') + '%';
  }

  function agamaDari(id) {
    for (var i = 0; i < AGAMA.length; i++) {
      if (AGAMA[i].id === id) { return AGAMA[i]; }
    }
    return AGAMA[0];
  }

  function namaAgama(id) { return agamaDari(id).nama; }

  function jadiMulti(g) {
    if (!g || !g.length) { return []; }
    var pertama = g[0];
    if (pertama && pertama.length && typeof pertama[0][0] === 'number') { return [g]; }
    return g;
  }

  /* `kolom` = jumlah kolom kode wilayah (provinsi 1, kab/kota 2, kecamatan 3,
     desa 4) — bukan indeks kolom penduduk. */
  function kodeWilayah(a, kolom) {
    var bagian = [];
    for (var i = 0; i < kolom; i++) {
      bagian.push(String(a[i]).padStart(LEBAR_KODE[i], '0'));
    }
    return bagian.join('.');
  }

  /* Indeks kolom penduduk di dalam baris data agama. Sama artinya dengan
     `banyakKolom` di js/warna.js: nama wilayah ada di kolom ini dikurangi 1,
     dan jumlah kolom kode wilayah = kolom ini dikurangi 1. */
  function banyakKolom(tingkat) {
    if (tingkat === 'provinsi') { return 2; }
    if (tingkat === 'kabkota') { return 3; }
    if (tingkat === 'kecamatan') { return 4; }
    return 5;
  }

  function kolomKode(tingkat) { return banyakKolom(tingkat) - 1; }

  function bagianSekarang(tingkat) {
    return (typeof PD !== 'undefined' && PD.bagianSekarang)
      ? PD.bagianSekarang(tingkat) : null;
  }

  /* ---------- tangga warna ---------- */

  function hexKeHsl(h) {
    var r = parseInt(h.slice(1, 3), 16) / 255;
    var g = parseInt(h.slice(3, 5), 16) / 255;
    var b = parseInt(h.slice(5, 7), 16) / 255;
    var maks = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var l = (maks + min) / 2;
    var s = 0;
    var hue = 0;
    if (maks !== min) {
      var d = maks - min;
      s = l > 0.5 ? d / (2 - maks - min) : d / (maks + min);
      if (maks === r) { hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; }
      else if (maks === g) { hue = ((b - r) / d + 2) / 6; }
      else { hue = ((r - g) / d + 4) / 6; }
    }
    return [hue * 360, s * 100, l * 100];
  }

  function hslKeHex(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    s = Math.min(100, Math.max(0, s)) / 100;
    l = Math.min(100, Math.max(0, l)) / 100;

    function kanal(p, q, t) {
      if (t < 0) { t += 1; }
      if (t > 1) { t -= 1; }
      if (t < 1 / 6) { return p + (q - p) * 6 * t; }
      if (t < 1 / 2) { return q; }
      if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
      return p;
    }

    var r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = kanal(p, q, h + 1 / 3);
      g = kanal(p, q, h);
      b = kanal(p, q, h - 1 / 3);
    }

    function heks(x) {
      var n = Math.round(x * 255);
      return (n < 16 ? '0' : '') + n.toString(16);
    }
    return '#' + heks(r) + heks(g) + heks(b);
  }

  /* Tangga satu agama: dari muda ke tua. Dipakai supaya "makin tua = makin
     besar persentasenya" terbaca tanpa membaca angka. Warna termuda sengaja
     tidak terlalu pucat — di atas citra satelit yang gelap warna pucat
     hilang. */
  function tangga(warna, banyak) {
    var hsl = hexKeHsl(warna);
    var h = hsl[0];
    var s = Math.max(hsl[1], 55);
    var terang = 70;
    var gelap = 20;
    var hasil = [];
    for (var i = 0; i < banyak; i++) {
      var l = banyak > 1 ? terang - (terang - gelap) * (i / (banyak - 1)) : terang;
      hasil.push(hslKeHex(h, s, l));
    }
    return hasil;
  }

  /* ---------- memuat berkas ---------- */

  function muatSkrip(nama, kunciBersama, kunciSendiri) {
    if (window[kunciSendiri]) { return Promise.resolve(window[kunciSendiri]); }
    return new Promise(function (selesai, gagal) {
      var s = document.createElement('script');
      s.src = 'data/agama/' + nama;
      s.onload = function () {
        /* Berkas menulis ke `window.AGAMA_<TINGKAT>` — nama yang sama untuk
           seluruh bagian. Dipindahkan ke kunci sendiri supaya bagian wilayah
           lain tidak saling menimpa. */
        var d = window[kunciBersama];
        window[kunciSendiri] = d || [];
        selesai(window[kunciSendiri]);
      };
      s.onerror = function () {
        window[kunciSendiri] = [];
        gagal(new Error('tidak termuat: ' + nama));
      };
      document.head.appendChild(s);
    });
  }

  function muatAgama(tingkat, bagian) {
    var t = TINGKAT[tingkat];
    if (!t) { return Promise.resolve([]); }
    var kunciBersama = 'AGAMA_' + t.kunci;
    var kunciSendiri = kunciBersama + (bagian ? '_' + bagian : '');
    var nama = t.berkas || (tingkat === 'kecamatan' ? 'kec-' : 'desa-') + bagian + '.js';
    return muatSkrip(nama, kunciBersama, kunciSendiri);
  }

  /* Dipakai js/member.js untuk blok daftar agama di bawah form anggota. */
  window.PD_MUAT_AGAMA = muatAgama;

  /* Batas wilayah dipakai bersama dengan peta Populasi. Provinsi & kab/kota
     sudah dimuat index.html; kecamatan & desa dimuat per bagian. */
  function muatGeometri(tingkat, bagian) {
    var t = TINGKAT[tingkat];
    if (t.berkas) {
      var kunci = 'WARNA_' + t.kunci;
      if (window[kunci]) { return Promise.resolve(window[kunci]); }
      return new Promise(function (selesai, gagal) {
        var s = document.createElement('script');
        s.src = 'data/wilayah-warna/' + t.berkas;
        s.onload = function () { selesai(window[kunci] || []); };
        s.onerror = function () { gagal(new Error('tidak termuat: ' + t.berkas)); };
        document.head.appendChild(s);
      });
    }
    return window.PD_MUAT_BAGIAN(t.kunci, bagian);
  }

  /* ---------- warna ---------- */

  function batasKuantil(nilai, banyak) {
    var urut = nilai.slice().sort(function (a, b) { return a - b; });
    var batas = [];
    for (var i = 1; i < banyak; i++) {
      var b = urut[Math.floor(urut.length * i / banyak)];
      if (!batas.length || b > batas[batas.length - 1]) { batas.push(b); }
    }
    return batas;
  }

  function kelasDari(n, batas) {
    for (var i = 0; i < batas.length; i++) {
      if (n < batas[i]) { return i; }
    }
    return batas.length;
  }

  /* ---------- lapisan peta ---------- */

  function pastikanLapisan() {
    if (!peta) { return false; }
    if (peta.getSource('wilayah')) { return true; }
    /* Lapisan dibuat oleh js/warna.js. `paksa` perlu karena penanda di sana
       masih bernilai true setelah peta dasar diganti. */
    if (window.PD_WARNA && window.PD_WARNA.siapkanLapisan) {
      window.PD_WARNA.siapkanLapisan(true);
    }
    return !!peta.getSource('wilayah');
  }

  function pasangKlik() {
    if (klikTerpasang || !peta) { return; }
    klikTerpasang = true;
    peta.on('click', 'wilayah-isi', function (e) {
      if (!aktif) { return; }
      if (e.features && e.features.length) { bukaKartu(e.features[0].properties); }
    });
  }

  /* ---------- menyambung batas wilayah dengan angka agama ---------- */

  function pakai(geo, agm, tingkat) {
    peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : peta;
    if (!peta || !aktif) { return; }
    if (!pastikanLapisan()) { return; }
    pasangKlik();

    var kolom = banyakKolom(tingkat);
    var kk = kolomKode(tingkat);
    var petaAgama = {};
    for (var i = 0; i < agm.length; i++) {
      /* Berkas agama menyimpan barisnya sebagai array langsung
         ([kode…, nama, penduduk, islam, …]), bukan objek {a,g} seperti
         berkas batas wilayah. */
      petaAgama[kodeWilayah(agm[i], kk)] = agm[i];
    }

    var fitur = [];
    for (var j = 0; j < geo.length; j++) {
      var a = geo[j].a;
      var kode = kodeWilayah(a, kk);
      var r = petaAgama[kode] || null;
      var penduduk = r ? (r[kolom] || 0) : 0;
      var p = { nama: a[kolom - 1], kode: kode, penduduk: penduduk, ada: !!r };
      for (var k = 0; k < AGAMA.length; k++) {
        var n = r ? (r[kolom + 1 + k] || 0) : 0;
        p[AGAMA[k].id] = n;
        p[AGAMA[k].id + '_p'] = penduduk > 0 ? (n * 100 / penduduk) : 0;
      }
      fitur.push({
        type: 'Feature',
        id: j,
        properties: p,
        geometry: { type: 'MultiPolygon', coordinates: jadiMulti(geo[j].g) }
      });
    }

    var fc = { type: 'FeatureCollection', features: fitur };
    window.__agamaFC = fc;
    if (elKartu) { elKartu.hidden = true; }
    peta.getSource('wilayah').setData(fc);
    warnai(fc, tingkat);
  }

  function warnai(fc, tingkat) {
    var id = aktif.agama;
    var nilai = [];
    for (var i = 0; i < fc.features.length; i++) {
      var v = fc.features[i].properties[id + '_p'];
      if (v > 0) { nilai.push(v); }
    }

    var skala = null;
    if (nilai.length >= 3) {
      nilai.sort(function (a, b) { return a - b; });
      skala = {
        batas: batasKuantil(nilai, KELAS),
        min: nilai[0],
        maks: nilai[nilai.length - 1]
      };
    }

    var warna = tangga(agamaDari(id).warna, KELAS);
    /* Kunci pewarnaan memakai KODE wilayah, bukan nama — nama kecamatan bisa
       kembar dalam satu provinsi dan MapLibre menolak label kembar. */
    var ekspresi = ['match', ['get', 'kode']];

    for (var j = 0; j < fc.features.length; j++) {
      var p = fc.features[j].properties;
      var n = p[id + '_p'];
      var kelas = -1;
      if (p.ada) {
        kelas = skala ? kelasDari(n, skala.batas) : kelasDari(n, BATAS_TETAP);
      }
      p.kelas = kelas;
      ekspresi.push(p.kode, kelas < 0 ? TANPA_NILAI : warna[Math.min(kelas, KELAS - 1)]);
    }
    ekspresi.push(TANPA_NILAI);

    peta.setPaintProperty('wilayah-isi', 'fill-color', ekspresi);
    tampilkanDerajat(skala, warna, tingkat, fc.features.length);
  }

  function pasangTutupDerajat() {
    if (!elDerajat) { return; }
    if (document.getElementById('derajat-tutup')) { return; }
    var t = document.createElement('button');
    t.type = 'button';
    t.id = 'derajat-tutup';
    t.setAttribute('aria-label', 'Sembunyikan keterangan warna');
    t.textContent = '\u2715';
    t.addEventListener('click', function () {
      elDerajat.hidden = true;
      window.__derajatDisembunyikan = true;
    });
    elDerajat.appendChild(t);
  }

  function tampilkanDerajat(skala, warna, tingkat, jumlah) {
    if (!elDerajat) { return; }
    if (!skala) { elDerajat.hidden = true; derajatTerakhir = null; return; }
    derajatTerakhir = [skala, warna, tingkat, jumlah];
    if (window.__derajatDisembunyikan) { return; }
    /* Daftar melayang sedang terbuka — jangan ditampilkan dulu, nanti
       dikembalikan saat daftar ditutup (lihat bukaTutup). */
    if (elPemilih && !elPemilih.hidden) { return; }
    elDerajat.hidden = false;
    elDerajat.innerHTML = '';

    var judul = document.createElement('div');
    judul.className = 'derajat-judul';
    judul.textContent = namaAgama(aktif.agama) + ' \u2014 persentase penduduk (%)';
    elDerajat.appendChild(judul);

    var desimal = desimalKelas(skala.batas);
    for (var i = 0; i <= skala.batas.length; i++) {
      var bawah = i === 0 ? 0 : skala.batas[i - 1];
      var atas = i < skala.batas.length ? skala.batas[i] : null;
      var baris = document.createElement('div');
      baris.className = 'derajat-baris';
      var kotak = document.createElement('span');
      kotak.className = 'derajat-kotak';
      kotak.style.background = warna[Math.min(i, KELAS - 1)];
      var teks = document.createElement('span');
      teks.textContent = atas === null
        ? '\u2265 ' + persenKelas(bawah, desimal)
        : persenKelas(bawah, desimal) + ' \u2013 ' + persenKelas(atas, desimal);
      baris.appendChild(kotak);
      baris.appendChild(teks);
      elDerajat.appendChild(baris);
    }

    var catatan = document.createElement('div');
    catatan.className = 'derajat-catatan';
    catatan.textContent = 'Sumber: Dukcapil Kemendagri \u00B7 ' + jumlah + ' ' +
      TINGKAT[tingkat].nama.toLowerCase() + ' \u00B7 persentase dari jumlah penduduk';
    elDerajat.appendChild(catatan);

    pasangTutupDerajat();
  }

  /* ---------- kartu rincian ---------- */

  function barisAgama(p, bisaDiklik) {
    var penduduk = p.penduduk || 0;
    var isi = '';
    for (var i = 0; i < AGAMA.length; i++) {
      var g = AGAMA[i];
      var n = p[g.id] || 0;
      var pc = p[g.id + '_p'] || 0;
      var tag = bisaDiklik ? 'button' : 'div';
      var atribut = bisaDiklik
        ? ' type="button" data-agama="' + g.id + '" title="Warnai peta menurut ' + g.nama + '"'
        : '';
      isi += '<' + tag + ' class="agama-baris' + (bisaDiklik ? '' : ' agama-baris-tetap') + '"' +
        atribut + '>' +
        '<span class="agama-nama">' + g.nama + '</span>' +
        '<span class="agama-bar"><i style="width:' + pc.toFixed(2) + '%;background:' +
        g.warna + '"></i></span>' +
        '<span class="agama-angka">' + angka(n) + ' \u00B7 ' + persen(pc) + '</span>' +
        '</' + tag + '>';
    }
    return isi;
  }

  function mayoritasDari(p) {
    var teratas = null;
    for (var i = 0; i < AGAMA.length; i++) {
      var n = p[AGAMA[i].id] || 0;
      if (!teratas || n > teratas.n) {
        teratas = { g: AGAMA[i], n: n, p: p[AGAMA[i].id + '_p'] || 0 };
      }
    }
    return teratas;
  }

  function bukaKartu(p) {
    if (!elKartu || !aktif) { return; }
    var penduduk = p.penduduk || 0;
    var may = mayoritasDari(p);

    var isi = '<p class="kartu-judul">' + p.nama + '</p>';
    isi += '<table class="kartu-tabel">' +
      '<tr><td>Tingkat</td><td>' + TINGKAT[aktif.tingkat].nama + '</td></tr>' +
      '<tr><td>Jumlah penduduk</td><td>' +
      (penduduk > 0 ? angka(penduduk) + ' jiwa' : '\u2014') + '</td></tr>' +
      '<tr><td>Mayoritas</td><td>' +
      (penduduk > 0 ? may.g.nama + ' ' + persen(may.p) : '\u2014') + '</td></tr>' +
      '</table>';
    isi += '<div class="agama-daftar">' + barisAgama(p, false) + '</div>';
    isi += '<p class="derajat-catatan">Sumber: Dukcapil Kemendagri \u00B7 ' +
      'persentase dihitung dari jumlah penduduk</p>';

    document.getElementById('kartu-isian').innerHTML = isi;
    elKartu.hidden = false;
  }

  /* ---------- memuat sesuai tingkat ---------- */

  function pesanKartu(judul, pesan) {
    if (elDerajat) { elDerajat.hidden = true; }
    if (!elKartu) { return; }
    document.getElementById('kartu-isian').innerHTML =
      '<p class="kartu-judul">' + judul + '</p>' +
      '<p class="derajat-catatan">' + pesan + '</p>';
    elKartu.hidden = false;
  }

  function gabung(hasil) {
    var semua = [];
    for (var i = 0; i < hasil.length; i++) {
      if (hasil[i] && hasil[i].length) { semua = semua.concat(hasil[i]); }
    }
    return semua;
  }

  function muat() {
    if (!aktif || !peta) { return; }
    var tingkat = aktif.tingkat;
    var t = TINGKAT[tingkat];

    if (!t.berkas) {
      var z = peta.getZoom();
      var perlu = tingkat === 'desa' ? 8 : 5;
      /* Berkas desa terlalu besar untuk dimuat dari jauh (66 MB seluruh
         Indonesia). Jadi tingkat ini hanya dibuka saat sudah dekat, dan yang
         dimuat hanya bagian yang benar-benar terlihat di layar. */
      if (z < perlu) {
        pesanKartu('Perbesar dulu', 'Tingkat ' + t.nama + ' baru bisa dibuka ' +
          'setelah peta diperbesar sampai z' + perlu + '. Sekarang z' + z.toFixed(1) +
          ' \u2014 ketuk peta dua kali atau cubit untuk memperbesar.');
        return;
      }

      var bagian = bagianSekarang(tingkat);
      if (!bagian || !bagian.length) {
        pesanKartu('Wilayah belum dipilih', 'Geser peta ke wilayah Indonesia dulu, ' +
          'lalu pilih ' + t.nama + ' lagi.');
        return;
      }

      window.__agamaBagian = bagian.join(',');
      var janjiG = bagian.map(function (b) {
        return muatGeometri(tingkat, b).catch(function () { return []; });
      });
      var janjiA = bagian.map(function (b) {
        return muatAgama(tingkat, b).catch(function () { return []; });
      });

      Promise.all([Promise.all(janjiG), Promise.all(janjiA)]).then(function (h) {
        if (!aktif || aktif.tingkat !== tingkat) { return; }
        pakai(gabung(h[0]), gabung(h[1]), tingkat);
      });
      return;
    }

    Promise.all([muatGeometri(tingkat), muatAgama(tingkat)]).then(function (h) {
      if (!aktif || aktif.tingkat !== tingkat) { return; }
      pakai(h[0] || [], h[1] || [], tingkat);
    }, function (e) {
      console.warn('Pemetaan:', e.message);
    });
  }

  /* ---------- menyalakan / mematikan ---------- */

  function simpan() {
    try {
      localStorage.setItem(KUNCI_SIMPAN,
        aktif ? aktif.tingkat + '|' + aktif.agama : '');
    } catch (e) { /* lewat */ }
  }

  function ambilSimpan() {
    try {
      var s = localStorage.getItem(KUNCI_SIMPAN);
      if (!s) { return null; }
      var b = s.split('|');
      if (b.length !== 2 || !TINGKAT[b[0]]) { return null; }
      return { tingkat: b[0], agama: b[1] };
    } catch (e) {
      return null;
    }
  }

  function matikan() {
    if (!aktif) { return; }
    aktif = null;
    window.__agamaFC = null;
    window.__agamaBagian = null;
    derajatTerakhir = null;
    tandai();
    if (elDerajat) { elDerajat.hidden = true; }
    if (elKartu) { elKartu.hidden = true; }
    if (peta && peta.getSource('wilayah')) {
      try {
        peta.getSource('wilayah').setData({ type: 'FeatureCollection', features: [] });
      } catch (e) { /* lewat */ }
    }
  }

  function ganti(tingkat, agamaId) {
    if (!TINGKAT[tingkat]) { return; }
    if (aktif && aktif.tingkat === tingkat && aktif.agama === agamaId) { return; }

    /* Peta Populasi memakai lapisan yang sama — dimatikan dulu supaya tidak
       saling menimpa. */
    if (window.PD_WARNA && window.PD_WARNA.ganti) { window.PD_WARNA.ganti('tanpa'); }
    /* Peta suku (orderan 20) memakai #kartu yang sama — dimatikan dulu. */
    if (window.PD_SUKU && window.PD_SUKU.aktif && window.PD_SUKU.aktif()) {
      window.PD_SUKU.matikan();
    }

    aktif = { tingkat: tingkat, agama: agamaId };
    agamaTerpilih = agamaId;
    window.__derajatDisembunyikan = false;
    simpan();
    tandai();
    muat();
  }

  /* ---------- tombol & daftar ---------- */

  function tandai() {
    if (!elTombol) { return; }
    var nyala = !!aktif;
    elTombol.setAttribute('aria-pressed', nyala ? 'true' : 'false');
    elTombol.title = nyala
      ? 'Agama (' + namaAgama(aktif.agama) + ' \u00B7 ' + TINGKAT[aktif.tingkat].nama +
        ') aktif \u2014 klik untuk ganti agama atau tingkat'
      : 'Klik untuk memilih peta agama';

    var mati = document.getElementById('agama-mati');
    if (mati) { mati.hidden = !nyala; }

    var dipilih = aktif ? aktif.agama : agamaTerpilih;
    var chips = document.querySelectorAll('.agama-chip');
    for (var i = 0; i < chips.length; i++) {
      var ini = chips[i].dataset.agama === dipilih;
      chips[i].classList.toggle('nyala', ini);
      chips[i].setAttribute('aria-pressed', ini ? 'true' : 'false');
    }

    var lv = document.querySelectorAll('[data-agama-tingkat]');
    for (var j = 0; j < lv.length; j++) {
      var on = !!aktif && lv[j].dataset.agamaTingkat === aktif.tingkat;
      lv[j].classList.toggle('nyala', on);
      lv[j].setAttribute('aria-selected', on ? 'true' : 'false');
    }
  }

  function bukaTutup(buka) {
    if (!elPemilih) { return; }
    elPemilih.hidden = !buka;
    elTombol.setAttribute('aria-expanded', buka ? 'true' : 'false');
    if (buka) {
      /* Dua daftar melayang tidak boleh terbuka bersamaan — letaknya sama. */
      var w = document.getElementById('pemilih-warna');
      if (w) { w.hidden = true; }
      /* Panel Suku (orderan 20) memakai kolom kiri yang sama di PC. */
      if (window.PD_SUKU && window.PD_SUKU.tutupPanel) { window.PD_SUKU.tutupPanel(); }
      /* Di HP sempit dengan form terbuka, area peta hanya ±280 px — daftar
         ini dan keterangan warna tidak muat bersama (diukur 17 Okt 2026:
         daftar 44–273 px, keterangan 55–237 px). Keterangan disembunyikan
         selama daftar terbuka, lalu dikembalikan. */
      if (elDerajat && !elDerajat.hidden) {
        elDerajat.hidden = true;
        derajatDitutupSementara = true;
      }
    } else if (derajatDitutupSementara) {
      derajatDitutupSementara = false;
      if (derajatTerakhir) {
        tampilkanDerajat(derajatTerakhir[0], derajatTerakhir[1],
          derajatTerakhir[2], derajatTerakhir[3]);
      }
    }
  }

  function pilihAgama(id) {
    /* Daftar ditutup lebih dulu supaya keterangan warna bisa tampil —
       keduanya tidak muat bersama di HP sempit. */
    bukaTutup(false);
    if (aktif) {
      ganti(aktif.tingkat, id);
      return;
    }
    /* Belum ada tingkat yang menyala — langsung buka tingkat provinsi supaya
       satu ketukan sudah memberi hasil. */
    ganti('provinsi', id);
  }

  function bangun() {
    if (!elPemilih || !elTombol) { return; }
    elPemilih.innerHTML = '';

    var kepala = document.createElement('div');
    kepala.className = 'agama-kepala';
    kepala.textContent = 'Agama';
    elPemilih.appendChild(kepala);

    var chips = document.createElement('div');
    chips.className = 'agama-chips';
    AGAMA.forEach(function (g) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'agama-chip';
      b.dataset.agama = g.id;
      b.innerHTML = '<i style="background:' + g.warna + '"></i>' + g.nama;
      b.addEventListener('click', function () { pilihAgama(g.id); });
      chips.appendChild(b);
    });
    elPemilih.appendChild(chips);

    var pisah = document.createElement('div');
    pisah.className = 'agama-pisah';
    elPemilih.appendChild(pisah);

    var kepala2 = document.createElement('div');
    kepala2.className = 'agama-kepala';
    kepala2.textContent = 'Tingkat wilayah';
    elPemilih.appendChild(kepala2);

    URUT_TINGKAT.forEach(function (t) {
      var d = TINGKAT[t];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pilihan-warna';
      b.dataset.agamaTingkat = t;
      b.setAttribute('role', 'option');
      b.innerHTML = '<span>' + d.ikon + '</span><span>' + d.nama + '</span>';
      b.addEventListener('click', function () {
        ganti(t, aktif ? aktif.agama : agamaTerpilih);
        bukaTutup(false);
      });
      elPemilih.appendChild(b);
    });

    /* Tombol mematikan peta agama. Ditampilkan hanya saat peta agama menyala
       supaya daftar tidak penuh tombol yang tidak berguna. */
    var mati = document.createElement('button');
    mati.type = 'button';
    mati.className = 'agama-mati';
    mati.id = 'agama-mati';
    mati.textContent = 'Matikan peta agama';
    mati.addEventListener('click', function () {
      bukaTutup(false);
      matikan();
      simpan();
    });
    elPemilih.appendChild(mati);

    /* Tombol membuka/menutup daftar. Mematikan peta agama dilakukan lewat
       tombol "Matikan" di dalam daftar — kalau tombol ini langsung
       mematikan, pemakai tidak bisa berganti agama atau tingkat tanpa
       mematikan dulu (diuji 17 Okt 2026). */
    elTombol.addEventListener('click', function () {
      bukaTutup(elPemilih.hidden);
    });

    document.addEventListener('click', function (e) {
      if (elPemilih.hidden) { return; }
      if (elPemilih.contains(e.target) || elTombol.contains(e.target)) { return; }
      bukaTutup(false);
    });
  }

  /* ---------- dipakai js/member.js ---------- */

  /* Angka agama satu wilayah, dimuat sesuai kebutuhan. Mengembalikan baris
     data mentah Dukcapil atau null bila tidak ada. */
  function untukWilayah(tingkat, kode) {
    var t = TINGKAT[tingkat];
    if (!t || !kode) { return Promise.resolve(null); }

    var bagian = null;
    if (!t.berkas) {
      var pisah = kode.split('.');
      bagian = tingkat === 'kecamatan' ? pisah[0] : pisah.slice(0, 2).join('');
    }

    return muatAgama(tingkat, bagian).then(function (daftar) {
      var kk = kolomKode(tingkat);
      for (var i = 0; i < daftar.length; i++) {
        if (kodeWilayah(daftar[i], kk) === kode) { return daftar[i]; }
      }
      return null;
    }, function () { return null; });
  }

  /* Blok daftar agama untuk form anggota. Tiap baris bisa diketuk untuk
     mewarnai peta menurut agama itu. */
  function ringkas(a, tingkat) {
    var kolom = banyakKolom(tingkat);
    var penduduk = a[kolom] || 0;
    var p = { penduduk: penduduk };
    for (var i = 0; i < AGAMA.length; i++) {
      var n = a[kolom + 1 + i] || 0;
      p[AGAMA[i].id] = n;
      p[AGAMA[i].id + '_p'] = penduduk > 0 ? (n * 100 / penduduk) : 0;
    }
    var may = mayoritasDari(p);

    var h = '<p class="fa-catatan fa-agama-judul">Jumlah penduduk menurut agama ' +
      '<span class="fa-agama-sumber">(Dukcapil Kemendagri)</span></p>';
    h += '<p class="fa-catatan fa-agama-mayoritas">Mayoritas <strong>' + may.g.nama +
      ' ' + persen(may.p) + '</strong> \u00B7 ' + angka(penduduk) + ' jiwa</p>';
    h += '<div class="agama-daftar">' + barisAgama(p, true) + '</div>';
    h += '<p class="fa-catatan fa-agama-petunjuk">Ketuk salah satu agama untuk ' +
      'mewarnai peta menurut agama itu.</p>';
    return h;
  }

  window.PD_AGAMA = {
    ganti: ganti,
    matikan: matikan,
    aktif: function () { return !!aktif; },
    untukWilayah: untukWilayah,
    ringkas: ringkas,
    AGAMA: AGAMA,
    TINGKAT: TINGKAT
  };

  /* ---------- mulai ---------- */

  function mulai() {
    if (terpasang) { return; }
    peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : null;
    if (!peta) { return; }
    terpasang = true;

    bangun();
    tandai();

    /* Peta dasar bisa diganti (orderan 15). Ketika itu terjadi seluruh
       lapisan hilang, jadi lapisan tematik dipasang ulang dan warnanya
       diterapkan kembali ke data yang sama. */
    peta.on('styledata', function () {
      if (!aktif) { return; }
      setTimeout(function () {
        if (!aktif) { return; }
        if (!pastikanLapisan()) { return; }
        if (window.__agamaFC && peta.getSource('wilayah')) {
          try {
            peta.getSource('wilayah').setData(window.__agamaFC);
            warnai(window.__agamaFC, aktif.tingkat);
          } catch (e) { /* lewat */ }
        }
      }, 0);
    });

    /* Kecamatan & desa dipecah per bagian. Saat peta digeser ke provinsi atau
       kab/kota lain, berkas bagian yang baru dimuat menggantikan yang lama. */
    peta.on('moveend', function () {
      if (!aktif) { return; }
      var t = TINGKAT[aktif.tingkat];
      if (t.berkas) { return; }
      var bagian = bagianSekarang(aktif.tingkat);
      if (!bagian || bagian.join(',') === window.__agamaBagian) { return; }
      muat();
    });

    var s = ambilSimpan();
    if (s) { ganti(s.tingkat, s.agama); }
  }

  var coba = 0;
  (function ulang() {
    if (typeof PD !== 'undefined' && PD.peta) { mulai(); return; }
    if (coba++ < 60) { setTimeout(ulang, 100); }
  })();
})();
