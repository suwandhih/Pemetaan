/* Pemetaan — titik lokasi suku bangsa (orderan 20)
   ------------------------------------------------------------------
   Sumber angka : Badan Pusat Statistik, "Kewarganegaraan, Suku Bangsa,
                  Agama, dan Bahasa Sehari-hari Penduduk Indonesia —
                  Sensus Penduduk 2010", Tabel P1.2 (28 kelompok suku).
   Sumber batas : Dukcapil Kemendagri (data/wilayah-warna/prop-nasional.js)
                  — berkas yang sama dipakai peta Populasi & Agama.

   Kenapa tidak meniru cara DataPeta: di sana tiap suku ditaruh di IBU KOTA
   PROVINSI ASAL, sehingga suku Jawa jatuh di Semarang padahal BPS sendiri
   mencatat Jawa tersebar di 8 provinsi. Di sini yang digambar adalah
   KAWASAN UTAMA yang disebut BPS — seluruh provinsi di dalamnya diberi
   garis merah berkedip, dan satu titik penanda ditaruh di titik tengah
   kawasan itu.

   TITIK & WILAYAH ADALAH PERKIRAAN. BPS tidak menerbitkan koordinat suku;
   yang diterbitkan hanya daftar kawasan utama. Titik di sini = titik tengah
   kotak batas seluruh kawasan, bukan lokasi persis. Hal ini ditulis di
   kartu supaya tidak menyesatkan.

   Sebagian "kawasan utama" bukan nama provinsi (mis. "Sulawesi",
   "Pulau Madura", "Perkotaan di DKI Jakarta"). Kawasan seperti itu
   dipetakan ke provinsi yang memuatnya — bukan dikarang — dan di kartu
   tetap ditulis apa adanya seperti BPS menuliskannya.

   Lapisan peta modul ini TERPISAH dari lapisan Populasi/Agama (sumber
   `suku-sorot` & `suku-titik` sendiri), jadi tidak saling menimpa. Yang
   dijaga hanya kartu rincian: ketiganya memakai #kartu yang sama, jadi
   menyalakan yang satu mematikan yang lain. */

(function () {
  'use strict';

  /* Jumlah penduduk Indonesia, Sensus Penduduk 2010 (BPS). Dipakai sebagai
     pembagi persentase — bukan jumlah 28 suku, supaya tidak dilebih-lebihkan. */
  var TOTAL_SP2010 = 237641326;

  /* 28 kelompok suku BPS SP2010, diurutkan dari yang terbanyak.
     `kawasan` = daftar "kawasan utama" apa adanya seperti BPS menuliskannya. */
  var SUKU = [
    { nama: 'Jawa', jiwa: 97094536, gabungan: false,
      kawasan: ['Banten', 'Jawa Tengah', 'Jawa Timur', 'DI Yogyakarta', 'Lampung',
        'Sumatera Utara', 'DKI Jakarta', 'Jawa Barat'] },
    { nama: 'Sunda', jiwa: 41359454, gabungan: false,
      kawasan: ['Jawa Barat', 'Banten', 'DKI Jakarta', 'Jawa Tengah', 'Lampung',
        'Sumatera Selatan'] },
    { nama: 'Batak', jiwa: 8466969, gabungan: false,
      kawasan: ['Sumatera Utara', 'Riau', 'Kepulauan Riau', 'DKI Jakarta', 'Jawa Barat'] },
    { nama: 'Asal Sulawesi', jiwa: 7634262, gabungan: true,
      kawasan: ['Sulawesi'] },
    { nama: 'Madura', jiwa: 7179356, gabungan: false,
      kawasan: ['Pulau Madura', 'Jawa Timur', 'Kalimantan Barat'] },
    { nama: 'Betawi', jiwa: 6807968, gabungan: false,
      kawasan: ['DKI Jakarta', 'Jawa Barat', 'Banten'] },
    { nama: 'Minangkabau', jiwa: 6462713, gabungan: false,
      kawasan: ['Sumatera Barat', 'Riau', 'Bengkulu', 'Jambi', 'DKI Jakarta',
        'Jawa Barat', 'Aceh', 'Sumatera Utara'] },
    { nama: 'Bugis', jiwa: 6359700, gabungan: false,
      kawasan: ['Sulawesi Selatan'] },
    { nama: 'Melayu', jiwa: 5365399, gabungan: false,
      kawasan: ['Riau', 'Kalimantan Barat', 'Sumatera Utara', 'Sumatera Selatan',
        'Kepulauan Riau', 'Jambi', 'Bengkulu', 'Kepulauan Bangka Belitung'] },
    { nama: 'Asal Sumatera Selatan', jiwa: 5119581, gabungan: true,
      kawasan: ['Sumatera Selatan', 'Lampung'] },
    { nama: 'Asal NTT', jiwa: 4184923, gabungan: true,
      kawasan: ['Nusa Tenggara Timur'] },
    { nama: 'Banjar', jiwa: 4127124, gabungan: false,
      kawasan: ['Kalimantan Selatan', 'Kalimantan Tengah', 'Kalimantan Timur', 'Riau'] },
    { nama: 'Asal Aceh', jiwa: 4091451, gabungan: true,
      kawasan: ['Aceh', 'Sumatera Utara'] },
    { nama: 'Bali', jiwa: 3946416, gabungan: false,
      kawasan: ['Bali', 'Pulau Lombok', 'Nusa Tenggara Barat'] },
    { nama: 'Sasak', jiwa: 3173127, gabungan: false,
      kawasan: ['Nusa Tenggara Barat'] },
    { nama: 'Dayak', jiwa: 3009494, gabungan: false,
      kawasan: ['Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Utara',
        'Kalimantan Timur'] },
    { nama: 'Tionghoa', jiwa: 2832510, gabungan: false,
      kawasan: ['Perkotaan di DKI Jakarta', 'Pulau Sumatra', 'Pulau Jawa',
        'Kalimantan Barat'] },
    { nama: 'Asal Papua', jiwa: 2693630, gabungan: true,
      kawasan: ['Papua', 'Papua Barat'] },
    { nama: 'Makassar', jiwa: 2672590, gabungan: false,
      kawasan: ['Sulawesi Selatan'] },
    { nama: 'Asal Sumatra', jiwa: 2204472, gabungan: true,
      kawasan: ['Pulau Sumatra'] },
    { nama: 'Maluku', jiwa: 2203415, gabungan: false,
      kawasan: ['Kepulauan Maluku'] },
    { nama: 'Asal Kalimantan', jiwa: 1968620, gabungan: true,
      kawasan: ['Pulau Kalimantan'] },
    { nama: 'Jambi', jiwa: 1415547, gabungan: false,
      kawasan: ['Jambi'] },
    { nama: 'Lampung', jiwa: 1381660, gabungan: false,
      kawasan: ['Lampung'] },
    { nama: 'Asal NTB', jiwa: 1280094, gabungan: true,
      kawasan: ['Nusa Tenggara Barat'] },
    { nama: 'Gorontalo', jiwa: 1251494, gabungan: false,
      kawasan: ['Gorontalo'] },
    { nama: 'Minahasa', jiwa: 1237177, gabungan: false,
      kawasan: ['Sulawesi Utara'] },
    { nama: 'Nias', jiwa: 1041925, gabungan: false,
      kawasan: ['Pulau Nias', 'Sumatera Utara'] }
  ];

  /* Kawasan utama yang MEMANG nama provinsi → kode provinsi.
     Beberapa nama memakai wilayah tahun 2010, karena itulah yang dicatat BPS:
       · "Kalimantan Timur" 2010 = hari ini 64 + 65 (Kaltara memisah 2012)
       · "Papua" 2010           = hari ini 91 + 93 + 94 + 95 (memisah 2022)
       · "Papua Barat" 2010     = hari ini 92 + 96 (Papua Barat Daya memisah 2022)
     Hal ini ditulis di kartu supaya tidak menyesatkan. */
  var PROVINSI = {
    'Aceh': ['11'],
    'Sumatera Utara': ['12'],
    'Sumatera Barat': ['13'],
    'Riau': ['14'],
    'Jambi': ['15'],
    'Sumatera Selatan': ['16'],
    'Bengkulu': ['17'],
    'Lampung': ['18'],
    'Kepulauan Bangka Belitung': ['19'],
    'Kepulauan Riau': ['21'],
    'DKI Jakarta': ['31'],
    'Jawa Barat': ['32'],
    'Jawa Tengah': ['33'],
    'DI Yogyakarta': ['34'],
    'Jawa Timur': ['35'],
    'Banten': ['36'],
    'Bali': ['51'],
    'Nusa Tenggara Barat': ['52'],
    'Nusa Tenggara Timur': ['53'],
    'Kalimantan Barat': ['61'],
    'Kalimantan Tengah': ['62'],
    'Kalimantan Selatan': ['63'],
    'Kalimantan Timur': ['64', '65'],
    'Kalimantan Utara': ['65'],
    'Sulawesi Utara': ['71'],
    'Sulawesi Tengah': ['72'],
    'Sulawesi Selatan': ['73'],
    'Sulawesi Tenggara': ['74'],
    'Gorontalo': ['75'],
    'Sulawesi Barat': ['76'],
    'Maluku': ['81'],
    'Maluku Utara': ['82'],
    'Papua': ['91', '93', '94', '95'],
    'Papua Barat': ['92', '96']
  };

  /* Kawasan utama yang BUKAN nama provinsi → provinsi yang memuatnya.
     Dipetakan ke provinsi, bukan dikarang: "Sulawesi" memang berisi 6
     provinsi, "Pulau Madura" memang bagian Jawa Timur, dst. */
  var KAWASAN = {
    'Sulawesi': ['71', '72', '73', '74', '75', '76'],
    'Pulau Sumatra': ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21'],
    'Pulau Jawa': ['31', '32', '33', '34', '35', '36'],
    'Kepulauan Maluku': ['81', '82'],
    'Pulau Kalimantan': ['61', '62', '63', '64', '65'],
    'Pulau Madura': ['35'],
    'Pulau Lombok': ['52'],
    'Pulau Nias': ['12'],
    'Perkotaan di DKI Jakarta': ['31']
  };

  var KUNCI_SIMPAN = 'peta_suku';

  var aktif = null;          /* indeks suku yang menyala, atau null */
  var terpasang = false;
  var lapisanSiap = false;
  var kedipJalan = false;
  var derajatDitutupSementara = false;
  var peta = null;

  var elPemilih = document.getElementById('panel-suku');
  var elTombol = document.getElementById('tombol-suku');

  /* ---------- bantu ---------- */

  function angka(n) {
    return Number(n).toLocaleString('id-ID');
  }

  function persen(v) {
    if (!(v > 0)) { return '0%'; }
    if (v < 1) { return v.toFixed(2).replace('.', ',') + '%'; }
    if (v < 10) { return v.toFixed(1).replace('.', ',') + '%'; }
    return Math.round(v) + '%';
  }

  function jadiMulti(g) {
    if (!g || !g.length) { return []; }
    var pertama = g[0];
    if (pertama && pertama.length && typeof pertama[0][0] === 'number') {
      return [g];
    }
    return g;
  }

  function kotakDari(g) {
    var k = [Infinity, Infinity, -Infinity, -Infinity];
    (function telusur(x) {
      if (!x || !x.length) { return; }
      if (typeof x[0] === 'number') {
        if (x[0] < k[0]) { k[0] = x[0]; }
        if (x[1] < k[1]) { k[1] = x[1]; }
        if (x[0] > k[2]) { k[2] = x[0]; }
        if (x[1] > k[3]) { k[3] = x[1]; }
        return;
      }
      for (var i = 0; i < x.length; i++) { telusur(x[i]); }
    })(g);
    return k[0] === Infinity ? null : k;
  }

  /* ---------- kawasan → kode provinsi ---------- */

  function kodeKawasan(nama) {
    if (PROVINSI[nama]) { return PROVINSI[nama]; }
    if (KAWASAN[nama]) { return KAWASAN[nama]; }
    return null;
  }

  function namaProvinsi(kode) {
    var daftar = window.WARNA_PROP || [];
    for (var i = 0; i < daftar.length; i++) {
      if (String(daftar[i].a[0]).padStart(2, '0') === kode) { return daftar[i].a[1]; }
    }
    return kode;
  }

  /* Seluruh provinsi yang disorot untuk satu suku, tanpa kembar. */
  function kodeSuku(s) {
    var kumpul = {};
    for (var i = 0; i < s.kawasan.length; i++) {
      var kode = kodeKawasan(s.kawasan[i]);
      if (!kode) { continue; }
      for (var j = 0; j < kode.length; j++) { kumpul[kode[j]] = true; }
    }
    return Object.keys(kumpul).sort();
  }

  /* ---------- lapisan peta ---------- */

  var LAPISAN_SOROT = 'suku-sorot';
  var SUMBER_SOROT = 'suku-sorot';
  var LAPISAN_TITIK = 'suku-titik';
  var SUMBER_TITIK = 'suku-titik';
  var LAPISAN_NAMA = 'suku-nama';

  function siapkanLapisan() {
    if (!peta) { return false; }
    if (peta.getSource(SUMBER_SOROT)) { lapisanSiap = true; return true; }

    peta.addSource(SUMBER_SOROT, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    peta.addLayer({
      id: LAPISAN_SOROT,
      type: 'line',
      source: SUMBER_SOROT,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#ff3b30', 'line-width': 1.8, 'line-opacity': 1 }
    });

    peta.addSource(SUMBER_TITIK, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    /* Bulatan putih + cincin merah: menonjol di citra satelit gelap maupun
       di peta jalan yang terang — sama seperti pin anggota (orderan 18). */
    peta.addLayer({
      id: LAPISAN_TITIK,
      type: 'circle',
      source: SUMBER_TITIK,
      paint: {
        'circle-radius': 7,
        'circle-color': '#ffffff',
        'circle-stroke-color': '#ff3b30',
        'circle-stroke-width': 3
      }
    });
    peta.addLayer({
      id: LAPISAN_NAMA,
      type: 'symbol',
      source: SUMBER_TITIK,
      layout: {
        'text-field': ['get', 'nama'],
        'text-font': ['Open Sans Bold'],
        'text-size': 12,
        'text-offset': [0, 1.2],
        'text-anchor': 'top',
        'text-allow-overlap': true
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#0b0f14',
        'text-halo-width': 1.6
      }
    });

    lapisanSiap = true;
    return true;
  }

  /* Kedipan: opacity 1,0 ↔ 0,35 tiap 700 ms — sama dengan garis merah
     orderan 18, supaya keduanya terlihat sebagai satu bahasa tampilan. */
  function mulaiKedip() {
    if (kedipJalan) { return; }
    kedipJalan = true;
    var nyala = true;
    (function langkah() {
      if (!kedipJalan) { return; }
      if (peta && peta.getLayer(LAPISAN_SOROT)) {
        peta.setPaintProperty(LAPISAN_SOROT, 'line-opacity', nyala ? 1 : 0.35);
      }
      nyala = !nyala;
      setTimeout(langkah, 700);
    })();
  }

  function hentikanKedip() {
    kedipJalan = false;
    if (peta && peta.getLayer(LAPISAN_SOROT)) {
      peta.setPaintProperty(LAPISAN_SOROT, 'line-opacity', 1);
    }
  }

  /* ---------- menggambar ---------- */

  function gambar(i) {
    peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : peta;
    if (!peta || i === null || i === undefined) { return; }
    if (!siapkanLapisan()) { return; }

    var s = SUKU[i];
    var kode = kodeSuku(s);
    var daftar = window.WARNA_PROP || [];
    var fitur = [];
    var kotak = [Infinity, Infinity, -Infinity, -Infinity];

    for (var j = 0; j < daftar.length; j++) {
      var k = String(daftar[j].a[0]).padStart(2, '0');
      if (kode.indexOf(k) < 0) { continue; }
      fitur.push({
        type: 'Feature',
        properties: { kode: k, nama: daftar[j].a[1] },
        geometry: { type: 'MultiPolygon', coordinates: jadiMulti(daftar[j].g) }
      });
      var b = kotakDari(daftar[j].g);
      if (!b) { continue; }
      if (b[0] < kotak[0]) { kotak[0] = b[0]; }
      if (b[1] < kotak[1]) { kotak[1] = b[1]; }
      if (b[2] > kotak[2]) { kotak[2] = b[2]; }
      if (b[3] > kotak[3]) { kotak[3] = b[3]; }
    }

    window.__sukuFC = { type: 'FeatureCollection', features: fitur };
    window.__sukuKode = kode.join(',');

    peta.getSource(SUMBER_SOROT).setData(window.__sukuFC);
    if (fitur.length) { mulaiKedip(); } else { hentikanKedip(); }

    /* Satu titik penanda di titik tengah seluruh kawasan. */
    var titik = [];
    if (kotak[0] !== Infinity) {
      titik.push({
        type: 'Feature',
        properties: { nama: s.nama },
        geometry: {
          type: 'Point',
          coordinates: [(kotak[0] + kotak[2]) / 2, (kotak[1] + kotak[3]) / 2]
        }
      });
    }
    peta.getSource(SUMBER_TITIK).setData({ type: 'FeatureCollection', features: titik });
    window.__sukuTitik = { type: 'FeatureCollection', features: titik };

    if (kotak[0] !== Infinity) {
      var lngTepi = Math.max((kotak[2] - kotak[0]) * 0.06, 0.02);
      var latTepi = Math.max((kotak[3] - kotak[1]) * 0.06, 0.02);
      peta.fitBounds(
        [[kotak[0] - lngTepi, kotak[1] - latTepi], [kotak[2] + lngTepi, kotak[3] + latTepi]],
        { padding: 0, duration: 900, maxZoom: 9 }
      );
    }

    isiRincian(i);
  }
  /* ---------- rincian suku ---------- */

  /* Rincian ditulis di dalam panel (bukan di #kartu) supaya peta tidak
     tertutup kotak hitam saat terbang — permintaan pemilik proyek
     2026-10-17. Di HP panelnya menutupi layar, jadi rinciannya tetap
     terbaca penuh. */
  function isiRincian(i) {
    var el = document.getElementById('suku-rincian');
    if (!el) { return; }
    if (i === null || i === undefined || !SUKU[i]) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    var s = SUKU[i];
    var kode = kodeSuku(s);
    var bagian = s.jiwa * 100 / TOTAL_SP2010;

    var isi = '<p class="suku-rincian-judul">' + s.nama + '</p>';
    isi += '<table class="kartu-tabel">' +
      '<tr><td>Jumlah jiwa</td><td>' + angka(s.jiwa) + ' jiwa</td></tr>' +
      '<tr><td>Penduduk Indonesia</td><td>' + persen(bagian) + '</td></tr>' +
      '<tr><td>Provinsi disorot</td><td>' + kode.length + ' provinsi</td></tr>' +
      '</table>';

    isi += '<p class="fa-catatan suku-kepala">Kawasan utama menurut BPS ' +
      '<span class="fa-agama-sumber">(Sensus Penduduk 2010)</span></p>';
    isi += '<div class="suku-kawasan">';
    for (var j = 0; j < s.kawasan.length; j++) {
      var nama = s.kawasan[j];
      var k = kodeKawasan(nama);
      var catatan;
      if (PROVINSI[nama]) {
        catatan = 'provinsi';
      } else if (k) {
        catatan = 'kawasan \u00B7 digambar sebagai ' + k.length + ' provinsi';
      } else {
        catatan = 'tidak digambar di peta';
      }
      isi += '<div class="suku-kawasan-baris">' +
        '<span class="suku-kawasan-nama">' + nama + '</span>' +
        '<span class="suku-kawasan-catatan">' + catatan + '</span>' +
        '</div>';
    }
    isi += '</div>';

    if (s.gabungan) {
      isi += '<p class="derajat-catatan suku-catatan">BPS mencatat suku ini ' +
        'sebagai <strong>kelompok gabungan</strong> \u2014 bukan satu suku tunggal, ' +
        'melainkan gabungan beberapa suku dari wilayah itu.</p>';
    }
    isi += '<p class="derajat-catatan suku-catatan">Titik penanda &amp; garis ' +
      'wilayah adalah <strong>perkiraan</strong>: BPS tidak menerbitkan koordinat ' +
      'suku, jadi titik ditaruh di titik tengah kawasan utama.</p>';

    el.innerHTML = isi;
    el.hidden = false;
    el.scrollTop = 0;
  }

  /* ---------- menyalakan / mematikan ---------- */

  function simpan() {
    try {
      localStorage.setItem(KUNCI_SIMPAN, aktif === null ? '' : String(aktif));
    } catch (e) { /* lewat */ }
  }

  function ambilSimpan() {
    try {
      var s = localStorage.getItem(KUNCI_SIMPAN);
      if (s === null || s === '') { return null; }
      var i = parseInt(s, 10);
      return (i >= 0 && i < SUKU.length) ? i : null;
    } catch (e) {
      return null;
    }
  }

  function kosongkan() {
    if (peta && peta.getSource(SUMBER_SOROT)) {
      try {
        peta.getSource(SUMBER_SOROT).setData({ type: 'FeatureCollection', features: [] });
        peta.getSource(SUMBER_TITIK).setData({ type: 'FeatureCollection', features: [] });
      } catch (e) { /* lewat */ }
    }
    hentikanKedip();
    isiRincian(null);
  }

  function matikan() {
    if (aktif === null) { return; }
    aktif = null;
    window.__sukuFC = null;
    window.__sukuTitik = null;
    window.__sukuKode = null;
    tandai();
    kosongkan();
  }

  function ganti(i) {
    if (i === null || i === undefined || !SUKU[i]) { return; }
    if (aktif === i) { return; }

    /* Peta Populasi & Agama memakai #kartu yang sama — dimatikan dulu supaya
       kartu rinciannya tidak saling menimpa. */
    if (window.PD_WARNA && window.PD_WARNA.ganti) { window.PD_WARNA.ganti('tanpa'); }
    if (window.PD_AGAMA && window.PD_AGAMA.matikan) { window.PD_AGAMA.matikan(); }

    aktif = i;
    simpan();
    tandai();
    gambar(i);

    /* Di PC panel daftar tetap terbuka supaya pemakai bisa mengetuk suku
       satu per satu sambil melihat peta terbang — peta masih terlihat penuh
       di sisa lebar. Di HP panel menutupi seluruh layar, jadi harus ditutup
       supaya peta terlihat. */
    if (!lebarLayarPC()) { bukaTutup(false); }
  }

  function lebarLayarPC() {
    return window.matchMedia('(min-width: 900px)').matches;
  }

  /* ---------- tombol & daftar ---------- */

  function tandai() {
    if (!elTombol) { return; }
    var nyala = aktif !== null;
    elTombol.setAttribute('aria-pressed', nyala ? 'true' : 'false');
    elTombol.title = nyala
      ? 'Suku (' + SUKU[aktif].nama + ') aktif \u2014 klik untuk ganti suku'
      : 'Klik untuk memilih suku';

    var mati = document.getElementById('suku-mati');
    if (mati) { mati.hidden = !nyala; }

    var baris = document.querySelectorAll('.suku-baris');
    for (var i = 0; i < baris.length; i++) {
      var ini = parseInt(baris[i].dataset.suku, 10) === aktif;
      baris[i].classList.toggle('nyala', ini);
      baris[i].setAttribute('aria-selected', ini ? 'true' : 'false');
    }
  }

  function bukaTutup(buka) {
    if (!elPemilih) { return; }
    elPemilih.hidden = !buka;
    elPemilih.setAttribute('aria-hidden', buka ? 'false' : 'true');
    elTombol.setAttribute('aria-expanded', buka ? 'true' : 'false');
    if (!buka) {
      /* Keterangan warna Populasi yang disembunyikan sementara dikembalikan
         — tapi hanya bila peta Populasi memang masih menyala. */
      if (derajatDitutupSementara) {
        derajatDitutupSementara = false;
        var dd = document.getElementById('derajat');
        if (dd && window.PD_WARNA && window.PD_WARNA.aktif &&
            window.PD_WARNA.aktif() !== 'tanpa') {
          dd.hidden = false;
        }
      }
      return;
    }
    /* Dua daftar melayang memakai tempat yang sama — hanya satu boleh
       terbuka. Keterangan warna Populasi juga disembunyikan sementara. */
    var w = document.getElementById('pemilih-warna');
    if (w) { w.hidden = true; }
    var a = document.getElementById('pemilih-agama');
    if (a) { a.hidden = true; }
    /* Panel Anggota & form isian juga memakai kolom kiri yang sama di PC —
       ditutup supaya tidak saling menutupi (diuji 17 Okt 2026: keduanya
       terbuka bersamaan membuat daftar suku tidak bisa diklik). */
    if (window.PD_ANGGOTA && window.PD_ANGGOTA.tutupPanel) {
      window.PD_ANGGOTA.tutupPanel();
    }
    if (window.PD_ANGGOTA && window.PD_ANGGOTA.tutupForm) {
      window.PD_ANGGOTA.tutupForm();
    }
    var d = document.getElementById('derajat');
    if (d && !d.hidden) {
      d.hidden = true;
      derajatDitutupSementara = true;
    }
  }

  function bangun() {
    if (!elPemilih || !elTombol) { return; }
    var elDaftar = document.getElementById('suku-daftar');
    if (!elDaftar) { return; }
    elDaftar.innerHTML = '';

    var terbesar = SUKU[0].jiwa;
    for (var i = 0; i < SUKU.length; i++) {
      var s = SUKU[i];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'suku-baris';
      b.dataset.suku = String(i);
      b.setAttribute('role', 'option');
      b.title = 'Lihat kawasan utama ' + s.nama + ' di peta';
      b.innerHTML =
        '<span class="suku-nama">' + s.nama +
        (s.gabungan ? '<span class="suku-tanda">gabungan</span>' : '') + '</span>' +
        '<span class="suku-angka">' + angka(s.jiwa) + ' \u00B7 ' +
        persen(s.jiwa * 100 / TOTAL_SP2010) + '</span>' +
        '<span class="suku-bar"><i style="width:' +
        (s.jiwa * 100 / terbesar).toFixed(2) + '%"></i></span>';
      b.addEventListener('click', (function (n) {
        return function () { ganti(n); };
      })(i));
      elDaftar.appendChild(b);
    }

    var jumlah = document.getElementById('suku-jumlah');
    if (jumlah) { jumlah.textContent = SUKU.length + ' suku'; }

    var mati = document.getElementById('suku-mati');
    if (mati) {
      mati.addEventListener('click', function () {
        matikan();
        simpan();
      });
    }

    elTombol.addEventListener('click', function () {
      bukaTutup(elPemilih.hidden);
    });

    var tutup = document.getElementById('suku-tutup');
    if (tutup) {
      tutup.addEventListener('click', function () { bukaTutup(false); });
    }

    document.addEventListener('click', function (e) {
      if (elPemilih.hidden) { return; }
      if (elPemilih.contains(e.target) || elTombol.contains(e.target)) { return; }
      bukaTutup(false);
    });
  }

  window.PD_SUKU = {
    ganti: ganti,
    matikan: matikan,
    aktif: function () { return aktif !== null; },
    tutupPanel: function () { bukaTutup(false); },
    SUKU: SUKU,
    kodeUntukKawasan: kodeKawasan
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
       lapisan hilang, jadi lapisan suku dipasang ulang dan gambarnya
       diterapkan kembali ke data yang sama. */
    peta.on('styledata', function () {
      if (aktif === null) { return; }
      setTimeout(function () {
        if (aktif === null) { return; }
        lapisanSiap = false;
        if (!siapkanLapisan()) { return; }
        if (window.__sukuFC) {
          try {
            peta.getSource(SUMBER_SOROT).setData(window.__sukuFC);
            /* Titik penanda juga harus dipasang ulang — kalau tidak, garis
               merahnya kembali tapi titiknya hilang (diuji 17 Okt 2026). */
            if (window.__sukuTitik) {
              peta.getSource(SUMBER_TITIK).setData(window.__sukuTitik);
            }
            mulaiKedip();
          } catch (e) { /* lewat */ }
        }
      }, 0);
    });

    var awal = ambilSimpan();
    if (awal !== null) { ganti(awal); }
  }

  var coba = 0;
  (function ulang() {
    if (typeof PD !== 'undefined' && PD.peta) { mulai(); return; }
    if (coba++ < 60) { setTimeout(ulang, 100); }
  })();
})();
