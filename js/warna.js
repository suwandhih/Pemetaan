/* Pemetaan — peta tematik jumlah penduduk (orderan 16)
   ------------------------------------------------------------------
   Data  : Dukcapil Kemendagri (gis.dukcapil.kemendagri.go.id)
           38 provinsi · 514 kab/kota · 7.285 kecamatan · 83.489 desa
   Berkas: data/wilayah-warna/prop-nasional.js   (38 provinsi)
           data/wilayah-warna/kab-nasional.js    (514 kab/kota)
           data/wilayah-warna/kec-<provinsi>.js  (dimuat saat tingkat kecamatan dipilih)
           data/wilayah-warna/desa-<kabkota>.js  (dimuat saat tingkat desa dipilih)

   Angka yang dipakai JUMLAH PENDUDUK menurut Dukcapil — bukan perkiraan.
   Angka Dukcapil berbeda dari BPS karena cara pencatatannya berbeda:
   diukur 16 Okt 2026 — jumlah 38 provinsi = 284.973.643 (Dukcapil)
   vs 287.198.383 (BPS 2026). Karena itu sumbernya selalu ditulis di layar.

   Warna provinsi & kab/kota dihitung dari KEPADATAN (jiwa/km²), bukan
   jumlah jiwa. Sebabnya diukur: dengan jumlah jiwa, seluruh Pulau Jawa
   jadi satu warna gelap dan seluruh Papua satu warna terang — peta tidak
   memberi keterangan apa-apa. Kecamatan & desa Dukcapil tidak mengisi
   kolom luas, jadi keduanya memakai jumlah jiwa; itu ditulis di layar
   supaya tidak menyesatkan. */

(function () {
  'use strict';

  var PETA = {
    'tanpa': { nama: 'Populasi', ikon: '\uD83D\uDC41', tingkat: null },
    'provinsi': { nama: 'Provinsi', ikon: '\uD83D\uDDFA\uFE0F', tingkat: 'provinsi', berkas: 'prop-nasional.js', kunci: 'PROP' },
    'kabkota': { nama: 'Kabupaten/Kota', ikon: '\uD83C\uDFD9\uFE0F', tingkat: 'kabkota', berkas: 'kab-nasional.js', kunci: 'KAB' },
    'kecamatan': { nama: 'Kecamatan', ikon: '\uD83D\uDCCD', tingkat: 'kecamatan', kunci: 'KEC' },
    'desa': { nama: 'Desa/Kelurahan', ikon: '\uD83C\uDFE1', tingkat: 'desa', kunci: 'DESA' }
  };

  var WARNA = [
    '#0d3b66', '#1560a8', '#2f8fd0', '#63c2de',
    '#c9e8b0', '#ffe08a', '#f2a65a', '#e8563f', '#a01f2e'
  ];
  var TANPA_NILAI = '#39434e';

  var KUNCI_SIMPAN = 'peta_warna';
  var KELAS = WARNA.length;

  var aktif = 'tanpa';
  var lapisanAda = false;
  var terpasang = false;

  var peta = null;
  var elWarna = document.getElementById('pemilih-warna');
  var elTombol = document.getElementById('tombol-warna');
  var elKartu = document.getElementById('kartu');
  var elDerajat = document.getElementById('derajat');

    /* Keterangan warna bisa ditutup supaya tidak menutupi peta di HP. */
    function pasangTutupDerajat() {
      if (!elDerajat) { return; }
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

  /* ---------- bantu ---------- */

  function angka(n) {
    return Number(n).toLocaleString('id-ID');
  }

  function angkaRingkas(n) {
    if (!(n > 0)) { return '—'; }
    if (n >= 1e6) { return (n / 1e6).toFixed(1).replace('.', ',') + ' jt'; }
    if (n >= 1e3) { return Math.round(n / 1e3) + ' rb'; }
    return Math.round(n).toString();
  }

  /* Bentuk koordinat dari Dukcapil ada dua: Polygon (satu cincin) dan
     MultiPolygon. Keduanya dijadikan MultiPolygon supaya seragam. */
  function jadiMulti(g) {
    if (!g || !g.length) { return []; }
    var pertama = g[0];
    if (pertama && pertama.length && typeof pertama[0][0] === 'number') {
      return [g];
    }
    return g;
  }

  function ambilKiriman(nama, kunci) {
      if (window[kunci]) { return Promise.resolve(window[kunci]); }
      return new Promise(function (selesai, gagal) {
      var s = document.createElement('script');
      s.src = 'data/wilayah-warna/' + nama;
      s.onload = function () { selesai(window[kunci] || null); };
      s.onerror = function () { gagal(new Error('tidak termuat: ' + nama)); };
      document.head.appendChild(s);
    });
  }

    /* Desa & kelurahan dipecah menjadi 514 berkas (satu per kabupaten/kota,
     rata-rata 140 KB). Diukur 16 Okt 2026: seluruhnya 71 MB — mustahil dimuat
     dari HP. Jadi tingkat ini hanya dibuka saat peta sudah di-zoom mendekati
     satu kabupaten, dan yang dimuat hanya kab/kota yang benar-benar terlihat. */
    
    /* Dipakai modul lain (js/warna.js) untuk memuat berkas batas wilayah. */
    window.PD_MUAT_BAGIAN = muatBagianSkrip;

    /* Berkas bagian menulis ke `window.WARNA_<TINGKAT>` — nama yang sama untuk
       seluruh bagian. Supaya bagian untuk wilayah lain tidak saling menimpa,
       isinya dipindahkan ke kunci sendiri (`WARNA_<TINGKAT>_<bagian>`) begitu
       selesai dimuat. */
    function muatBagianSkrip(tingkat, bagian) {
      var kunciBersama = 'WARNA_' + tingkat;
      var kunciSendiri = kunciBersama + '_' + bagian;
      if (window[kunciSendiri]) { return Promise.resolve(window[kunciSendiri]); }

      return new Promise(function (selesai, gagal) {
        var s = document.createElement('script');
        s.src = 'data/wilayah-warna/' + tingkat.toLowerCase() + '-' + bagian + '.js';
        s.onload = function () {
          var d = window[kunciBersama];
          window[kunciSendiri] = d;
          selesai(d || null);
        };
        s.onerror = function () { gagal(new Error('tidak termuat: ' + bagian)); };
        document.head.appendChild(s);
      });
    }

    /* Kode wilayah resmi (Kepmendagri) disusun dari kolom angka, dengan angka
       nol di depan supaya lebarnya tetap: 2 + 2 + 2 + 4 angka.
       Diuji 16 Okt 2026 — tanpa penambal ini Buleleng jadi "51.8", bukan
       "51.08", sehingga berkas desa tidak ketemu (permintaan 404). */
    function kodeWilayah(a) {
      var n = [2, 2, 2, 4];
      var bagian = [];
      for (var i = 0; i < n.length; i++) {
        if (a[i] === undefined || a[i] === null) { break; }
        bagian.push(String(a[i]).padStart(n[i], '0'));
      }
      return bagian.join('.');
    }

  /* ---------- mengubah data tersimpan menjadi GeoJSON ---------- */

  function keGeoJSON(daftar, banyakKolom) {
    var fitur = [];
    for (var i = 0; i < daftar.length; i++) {
      var d = daftar[i];
      var a = d.a;
        var jiwa = a[banyakKolom];
        var kk = a[banyakKolom + 1];
        /* Luas & kepadatan dihitung SENDIRI dari batas poligon, tidak memakai
           kolom Dukcapil. Diukur 16 Okt 2026: kolom `luas_wilayah` salah
           satuan pada 33 dari 514 kabupaten/kota (KOTA SURABAYA tercatat
           335.925 km² — mustahil), dan kolom `kepadatan_penduduk` sering
           kosong. Karena itu keduanya dihitung dari batas resmi. */
        var luas = (typeof PD !== 'undefined' && PD.luasKm2) ? PD.luasKm2(d.g) : 0;
        var padat = (jiwa > 0 && luas > 0) ? jiwa / luas : 0;
        fitur.push({
          type: 'Feature',
          id: i,
          properties: {
            nama: a[banyakKolom - 1],
            kode: kodeWilayah(a),
            jiwa: jiwa,
            kk: kk,
            luas: luas,
            padat: padat
          },
          geometry: { type: 'MultiPolygon', coordinates: jadiMulti(d.g) }
        });
      }
      return { type: 'FeatureCollection', features: fitur };
    }

  /* ---------- warna ---------- */

  /* Nilai dipotong menjadi 9 kelas dengan cara "kuantil": setiap kelas berisi
     jumlah wilayah yang sama banyak. Dipilih daripada selang tetap karena
     sebaran penduduk Indonesia sangat miring — beberapa wilayah saja yang
     sangat padat. Dengan kuantil, warna tersebar merata dan perbedaan
     antar-wilayah di tengah sebaran tetap terbaca. */
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

  function siapkanSkala(fc, pakaiPadat) {
    var nilai = [];
    for (var i = 0; i < fc.features.length; i++) {
      var n = pakaiPadat ? fc.features[i].properties.padat : fc.features[i].properties.jiwa;
      if (n > 0) { nilai.push(n); }
    }
    if (nilai.length < 3) { return null; }
    nilai.sort(function (a, b) { return a - b; });
    return {
      batas: batasKuantil(nilai, KELAS),
      min: nilai[0],
      maks: nilai[nilai.length - 1],
      pakaiPadat: !!pakaiPadat
    };
  }

  function warnai(fc, pakaiPadat) {
    var skala = siapkanSkala(fc, pakaiPadat);

      /* Kunci pewarnaan memakai KODE wilayah, bukan nama. Nama kecamatan bisa
         kembar dalam satu provinsi (mis. "SUKAMAJU" ada di beberapa kabupaten)
         — MapLibre menolak label kembar pada ekspresi `match`. */
      var ekspresi = ['match', ['get', 'kode']];

      for (var i = 0; i < fc.features.length; i++) {
        var p = fc.features[i].properties;
        var n = skala ? (pakaiPadat ? p.padat : p.jiwa) : 0;
        p.kelas = (skala && n > 0) ? kelasDari(n, skala.batas) : -1;
        ekspresi.push(p.kode, p.kelas < 0 ? TANPA_NILAI : WARNA[Math.min(p.kelas, KELAS - 1)]);
      }
      ekspresi.push(TANPA_NILAI);

      peta.setPaintProperty('wilayah-isi', 'fill-color', ekspresi);
      tampilkanDerajat(skala);
      return skala;
    }

  function tampilkanDerajat(skala) {
    if (!elDerajat) { return; }
    if (!skala) { elDerajat.hidden = true; return; }
      /* Bila pemakai menutup keterangannya, jangan dibuka ulang sendiri —
         kecuali tingkat peta diganti. */
      if (window.__derajatDisembunyikan) { return; }
      elDerajat.hidden = false;
      elDerajat.innerHTML = '';

    var judul = document.createElement('div');
    judul.className = 'derajat-judul';
    judul.textContent = skala.pakaiPadat ? 'Kepadatan (jiwa/km²)' : 'Jumlah penduduk (jiwa)';
    elDerajat.appendChild(judul);

    for (var i = 0; i <= skala.batas.length; i++) {
      var bawah = i === 0 ? skala.min : skala.batas[i - 1];
      var atas = i < skala.batas.length ? skala.batas[i] : null;
      var baris = document.createElement('div');
      baris.className = 'derajat-baris';
      var kotak = document.createElement('span');
      kotak.className = 'derajat-kotak';
      kotak.style.background = WARNA[Math.min(i, KELAS - 1)];
      var teks = document.createElement('span');
      teks.textContent = atas === null
        ? '\u2265 ' + angkaRingkas(bawah)
        : angkaRingkas(bawah) + ' \u2013 ' + angkaRingkas(atas);
      baris.appendChild(kotak);
      baris.appendChild(teks);
      elDerajat.appendChild(baris);
    }

    var catatan = document.createElement('div');
    catatan.className = 'derajat-catatan';
    catatan.textContent = window.__pemetaanSumber || 'Sumber: Dukcapil Kemendagri';
    elDerajat.appendChild(catatan);

        pasangTutupDerajat();
      }

  /* ---------- lapisan peta ---------- */

  function siapkanLapisan() {
    if (!peta) { return; }
    if (peta.getSource('wilayah')) { lapisanAda = true; return; }
    if (lapisanAda) { return; }

    peta.addSource('wilayah', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    peta.addLayer({
      id: 'wilayah-isi',
      type: 'fill',
      source: 'wilayah',
      paint: { 'fill-color': TANPA_NILAI, 'fill-opacity': 0.62 }
    });

    /* Tepi wilayah diberi garis supaya batas yang berimpit dengan laut tetap
           terbaca di atas citra satelit yang gelap. Lebar garis TETAP (bukan
           mengikuti zoom): ekspresi `zoom` hanya boleh berdiri sendiri sebagai
           `step`/`interpolate` di tingkat teratas, tidak boleh dibungkus `case`
           (peringatan MapLibre 16 Okt 2026). `filter` juga tidak boleh memakai
           `feature-state`. */
        peta.addLayer({
          id: 'wilayah-garis',
          type: 'line',
          source: 'wilayah',
          paint: {
            'line-color': [
              'case', ['boolean', ['feature-state', 'sorot'], false], '#ffffff',
              'rgba(255,255,255,0.42)'
            ],
            'line-width': [
              'case', ['boolean', ['feature-state', 'sorot'], false], 2, 0.7
            ]
          }
        });

    lapisanAda = true;

    peta.on('mousemove', 'wilayah-isi', function (e) {
      peta.getCanvas().style.cursor = 'pointer';
      if (e.features && e.features.length) { sorot(e.features[0].id); }
    });

    peta.on('mouseleave', 'wilayah-isi', function () {
      peta.getCanvas().style.cursor = '';
      sorot(null);
    });

    peta.on('click', 'wilayah-isi', function (e) {
      if (e.features && e.features.length) { bukaKartu(e.features[0].properties); }
    });
  }

  var disorot = null;

  function sorot(id) {
    if (!peta || disorot === id) { return; }
    if (disorot !== null) {
      try { peta.setFeatureState({ source: 'wilayah', id: disorot }, { sorot: false }); }
      catch (e) { /* lewat */ }
    }
    disorot = id;
    if (id !== null) {
      try { peta.setFeatureState({ source: 'wilayah', id: id }, { sorot: true }); }
      catch (e) { /* lewat */ }
    }
  }

  function bukaKartu(p) {
    if (!elKartu) { return; }
    var baris = [
      ['Tingkat', PETA[aktif] ? PETA[aktif].nama : '—'],
      ['Jumlah penduduk', p.jiwa > 0 ? angka(p.jiwa) + ' jiwa' : '—'],
      ['Kepala keluarga', p.kk > 0 ? angka(p.kk) : '—'],
      ['Luas', p.luas > 0 ? angka(Math.round(p.luas)) + ' km²' : '—'],
      ['Kepadatan', p.padat > 0 ? angka(Math.round(p.padat)) + ' jiwa/km²' : '—'],
      ['Kode wilayah', (p.kode || '—').split('.')[0]],
      ['Sumber', 'Dukcapil Kemendagri']
    ];
    var isi = '<p class="kartu-judul">' + p.nama + '</p><table class="kartu-tabel">';
    for (var i = 0; i < baris.length; i++) {
      isi += '<tr><td>' + baris[i][0] + '</td><td>' + baris[i][1] + '</td></tr>';
    }
    isi += '</table>';
    document.getElementById('kartu-isian').innerHTML = isi;
    elKartu.hidden = false;
  }

  /* Tingkat menentukan banyak kolom data, karena susunan kolomnya bertambah
     satu setiap turun tingkat. */
  function banyakKolom(tingkat) {
    if (tingkat === 'provinsi') { return 2; }
    if (tingkat === 'kabkota') { return 3; }
    if (tingkat === 'kecamatan') { return 4; }
    return 5;
  }

  function bagianSekarang(tingkat) {
    return (typeof PD !== 'undefined' && PD.bagianSekarang)
      ? PD.bagianSekarang(tingkat) : null;
  }

  /* ---------- memilih tingkat ---------- */

  function ganti(id) {
    var p = PETA[id];
    if (!p || id === aktif) { return; }

    if (!p.tingkat) {
      aktif = 'tanpa';
      simpan('tanpa');
      tandai();
      kosongkan();
      return;
    }

    bagianSekarang(p.tingkat); // pastikan PD sudah siap

    aktif = id;
        window.__derajatDisembunyikan = false;
        simpan(id);
        tandai();

    if (p.berkas) {
          ambilKiriman(p.berkas, 'WARNA_' + p.kunci).then(function (daftar) {
        if (aktif !== id || !daftar) { return; }
        pakai(p, daftar, true);
      }, function (e) {
        console.warn('Pemetaan:', e.message);
      });
      return;
    }

    muatBagian(p, id);
  }

  function muatBagian(p, id) {
      var peta = PD.peta;
      var z = peta.getZoom();
      var perlu = p.tingkat === 'desa' ? 8 : 5;

      /* Batas berkas desa terlalu besar untuk dimuat dari jauh (71 MB seluruh
         Indonesia). Jadi tingkat desa hanya dibuka saat sudah dekat, dan yang
         dimuat hanya kab/kota yang benar-benar terlihat di layar. */
      if (z < perlu) {
        elDerajat.hidden = true;
        document.getElementById('kartu-isian').innerHTML =
          '<p class="kartu-judul">Perbesar dulu</p>' +
          '<p class="derajat-catatan">Tingkat ' + p.nama + ' baru bisa dibuka ' +
          'setelah peta diperbesar sampai z' + perlu + '. ' +
          'Sekarang z' + z.toFixed(1) + ' — ketuk peta dua kali atau cubit untuk memperbesar.</p>';
        elKartu.hidden = false;
        return;
      }

      var bagian = bagianSekarang(p.tingkat);
      if (!bagian || !bagian.length) {
        elDerajat.hidden = true;
        document.getElementById('kartu-isian').innerHTML =
          '<p class="kartu-judul">Wilayah belum dipilih</p>' +
          '<p class="derajat-catatan">Geser peta ke wilayah Indonesia dulu, lalu pilih ' +
          p.nama + ' lagi.</p>';
        elKartu.hidden = false;
        return;
      }

      var kunciDaftar = bagian.join(',');
      window.__pemetaanBagian = kunciDaftar;

      /* Semua bagian yang terlihat dimuat lalu digabung menjadi satu. Setiap
         bagian disimpan di kunci `window` sendiri supaya tidak saling menimpa. */
      var janji = bagian.map(function (b) {
        return window.PD_MUAT_BAGIAN(p.kunci, b)
          .then(function (d) { return d; }, function () { return null; });
      });

      Promise.all(janji).then(function (hasil) {
        if (aktif !== id) { return; }
        var gabung = [];
        for (var i = 0; i < hasil.length; i++) {
          if (hasil[i] && hasil[i].length) { gabung = gabung.concat(hasil[i]); }
        }
        if (!gabung.length) { elDerajat.hidden = true; return; }
        pakai(p, gabung, false, bagian, kunciDaftar);
      });
    }

  function kosongkan() {
    if (lapisanAda && peta.getSource('wilayah')) {
      try {
        peta.getSource('wilayah').setData({ type: 'FeatureCollection', features: [] });
      } catch (e) { /* lewat */ }
    }
    if (elDerajat) { elDerajat.hidden = true; }
    if (elKartu) { elKartu.hidden = true; }
  }

  function pakai(p, daftar, pakaiPadat, bagian) {
    peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : peta;
    lapisanAda = !!peta.getSource('wilayah');
    if (!lapisanAda) { siapkanLapisan(); }
    if (!peta.getSource('wilayah')) { return; }

      /* Kartu keterangan lama ditutup — kalau tidak, pesan "Perbesar dulu"
         dari percobaan sebelumnya tetap terlihat padahal tingkat barunya
         sudah berhasil dimuat (ditemukan saat uji live 16 Okt 2026). */
      if (elKartu) { elKartu.hidden = true; }

      var fc = keGeoJSON(daftar, banyakKolom(p.tingkat));
      window.__pemetaanFC = fc;
      window.__pemetaanPadat = pakaiPadat;
      disorot = null;

    var sumber = 'Sumber: Dukcapil Kemendagri';
    if (p.tingkat === 'kecamatan') { sumber += ' \u00B7 ' + fc.features.length + ' kecamatan'; }
    if (p.tingkat === 'desa') { sumber += ' \u00B7 ' + fc.features.length + ' desa/kelurahan'; }
    window.__pemetaanSumber = sumber;

    peta.getSource('wilayah').setData(fc);
    warnai(fc, pakaiPadat);
  }

  /* ---------- simpan pilihan ---------- */

  function simpan(id) {
    try { localStorage.setItem(KUNCI_SIMPAN, id); } catch (e) { /* lewat */ }
  }

  function ambilSimpan() {
    try {
      var n = localStorage.getItem(KUNCI_SIMPAN);
      return (n && PETA[n]) ? n : 'tanpa';
    } catch (e) {
      return 'tanpa';
    }
  }

  function tandai() {
    if (!elTombol) { return; }
    var p = PETA[aktif] || PETA.tanpa;
    var nyala = aktif !== 'tanpa';
    document.getElementById('warna-nama').textContent = 'Populasi';
    document.getElementById('warna-ikon').textContent = '\uD83D\uDC41';
    elTombol.setAttribute('aria-pressed', nyala ? 'true' : 'false');
    elTombol.title = nyala
      ? 'Populasi (' + p.nama + ') aktif \u2014 klik untuk mematikan'
      : 'Klik untuk memilih tingkat populasi';
    var b = document.querySelectorAll('.pilihan-warna');
    for (var i = 0; i < b.length; i++) {
      var ini = b[i].dataset.warna === aktif;
      b[i].classList.toggle('nyala', ini);
      b[i].setAttribute('aria-selected', ini ? 'true' : 'false');
    }
  }

  /* ---------- tombol ---------- */

  function bukaTutup(buka) {
    if (!elWarna) { return; }
    elWarna.hidden = !buka;
    elTombol.setAttribute('aria-expanded', buka ? 'true' : 'false');
  }

  function bangun() {
    if (!elWarna || !elTombol) { return; }
    elWarna.innerHTML = '';

    Object.keys(PETA).forEach(function (id) {
      var p = PETA[id];
      if (!p.tingkat) { return; }
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pilihan-warna';
      b.dataset.warna = id;
      b.setAttribute('role', 'option');
      b.innerHTML = '<span>' + p.ikon + '</span><span>' + p.nama + '</span>';
      b.addEventListener('click', function () {
        ganti(id);
        bukaTutup(false);
      });
      elWarna.appendChild(b);
    });

    /* Klik pilih ON, klik lagi OFF. */
    elTombol.addEventListener('click', function () {
      if (aktif !== 'tanpa') {
        bukaTutup(false);
        ganti('tanpa');
        return;
      }
      bukaTutup(elWarna.hidden);
    });

    document.addEventListener('click', function (e) {
      if (elWarna.hidden) { return; }
      if (elWarna.contains(e.target) || elTombol.contains(e.target)) { return; }
      bukaTutup(false);
    });

    document.getElementById('kartu-tutup').addEventListener('click', function () {
      elKartu.hidden = true;
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'w' || e.key === 'W') { bukaTutup(elWarna.hidden); }
    });
  }

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
      if (aktif === 'tanpa') { return; }
      setTimeout(function () {
        lapisanAda = false;
        siapkanLapisan();
        if (window.__pemetaanFC && peta.getSource('wilayah')) {
          try {
            peta.getSource('wilayah').setData(window.__pemetaanFC);
            warnai(window.__pemetaanFC, window.__pemetaanPadat);
          } catch (e) { /* lewat */ }
        }
      }, 0);
    });

    /* Kecamatan & desa dipecah per bagian. Saat peta digeser ke provinsi atau
       kab/kota lain, berkas bagian yang baru dimuat menggantikan yang lama. */
    peta.on('moveend', function () {
      var p = PETA[aktif];
      if (!p || !p.tingkat || p.berkas) { return; }
      var bagian = bagianSekarang(p.tingkat);
      if (!bagian || bagian === window.__pemetaanBagian) { return; }
      muatBagian(p, aktif);
    });

    var awal = ambilSimpan();
    if (awal !== 'tanpa') { ganti(awal); } else { kosongkan(); }
  }

  window.PD_WARNA = { ganti: ganti, PETA: PETA };

  var coba = 0;
  (function ulang() {
    if (typeof PD !== 'undefined' && PD.peta) { mulai(); return; }
    if (coba++ < 60) { setTimeout(ulang, 100); }
  })();
})();