/* Pemetaan — inti peta
   Orderan 14: fokus Indonesia, negara tetangga tetap tampil, HP tegak,
   PC selebar HP, scroll kiri-kanan.
   Orderan 15: pemilih jenis peta — citra satelit atau peta jalan. */

(function () {
  'use strict';

  var ARCGIS = 'https://server.arcgisonline.com/ArcGIS/rest/services/';

  var SUMBER = {
    citra: ARCGIS + 'World_Imagery/MapServer/tile/{z}/{y}/{x}',
    batas: ARCGIS + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
  };

  /* Orderan 15 — jenis peta yang bisa dipilih. Semuanya ubin raster supaya
     tampilannya sama di HP dan PC, dan semuanya CORS `*` (diuji 2026-10-16).
     `maks` = batas zoom resmi penyedia; di atas itu MapLibre memperbesar ubin
     terakhir, jadi peta tetap jalan. Urutan pertama = pilihan awal. */
  var JENIS = [
    {
      id: 'satelit',
      nama: 'Citra Satelit',
      ikon: '\uD83D\uDEF0\uFE0F',
      ket: 'Esri World Imagery',
      atribusi: 'Citra: Esri, Maxar, Earthstar Geographics',
      latar: '#05080b',
      dasar: { tiles: [SUMBER.citra], maks: 19 },
      garis: { tiles: [SUMBER.batas], maks: 19, buram: 0.9 }
    },
    {
      id: 'jalan',
      nama: 'Peta Jalan',
      ikon: '\uD83D\uDDFA\uFE0F',
      ket: 'OpenStreetMap',
      atribusi: 'Peta: \u00A9 OpenStreetMap contributors',
      latar: '#dfe6ec',
      dasar: { tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], maks: 19 }
    },
    {
      id: 'gelap',
      nama: 'Peta Gelap',
      ikon: '\uD83C\uDF19',
      ket: 'CARTO Dark Matter',
      atribusi: 'Peta: \u00A9 OpenStreetMap contributors \u00B7 CARTO',
      latar: '#0a0e13',
      dasar: { tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'], maks: 20 }
    },
    {
      id: 'medan',
      nama: 'Peta Medan',
      ikon: '\u26F0\uFE0F',
      ket: 'Esri World Terrain',
      atribusi: 'Medan: Esri, USGS, NOAA',
      latar: '#0d1218',
      dasar: { tiles: [ARCGIS + 'World_Terrain_Base/MapServer/tile/{z}/{y}/{x}'], maks: 13 }
    }
  ];

  var KUNCI_SIMPAN = 'peta_jenis';
  var jenisAktif = JENIS[0].id;

  /* Indonesia + negara tetangga. Tetangga ikut masuk supaya peta tidak
     kosong dan pulau yang berbatasan (Kalimantan, Papua, Timor) tampak utuh.
     Batas dirapatkan supaya ujung geser tidak menampilkan laut kosong:
     barat 92° (Sumatera + Malaysia) · timur 148° (Papua + PNG). */
  var BATAS = [[92, -15], [148, 13]];

  /* Kotak Indonesia: dipakai untuk menghitung tinggi tampilan. */
  var INDONESIA = [[95.0, -11.1], [141.4, 6.1]];

  var PUSAT = [118.0, -2.5];

  /* Wilayah menurut kotak batas asli Indonesia, dipakai untuk menghitung
     tinggi tampilan dan mencari kode provinsi yang sedang dilihat. */
  var WILAYAH = [
    { kode: '11', nama: 'Sumatera', lon: [94.5, 106.5], lat: [-6.5, 6.5] },
    { kode: '12', nama: 'Jawa', lon: [105.0, 115.5], lat: [-9.5, -5.0] },
    { kode: '51', nama: 'Bali & Nusa Tenggara', lon: [114.5, 127.5], lat: [-11.5, -7.5] },
    { kode: '61', nama: 'Kalimantan', lon: [108.5, 119.5], lat: [-4.5, 7.5] },
    { kode: '71', nama: 'Sulawesi', lon: [118.0, 125.5], lat: [-6.5, 2.0] },
    { kode: '81', nama: 'Maluku', lon: [125.5, 135.0], lat: [-8.5, 3.0] },
    { kode: '91', nama: 'Papua', lon: [130.0, 141.5], lat: [-9.5, 0.5] }
  ];

  /* 38 kode provinsi beserta batas kotaknya — dipakai agar peta tematik
     tingkat kecamatan tahu berkas mana yang harus dimuat. Dibuat dari
     koordinat titik tengah tiap provinsi. */
  var PROVINSI_KOTAK = [];

  var peta = null;
  var elPeta = document.getElementById('peta');
  var elWilayah = document.getElementById('wilayah');
  var elPosisi = document.getElementById('posisi');

  /* Dipakai modul lain (js/warna.js) — peta & pencari kode wilayah. */
  var PD = (window.PD = {
    peta: null,
    kodeProvinsiSekarang: null,
    bagianSekarang: null
  });

  function tampilkanGalat(pesan) {
    var el = document.createElement('div');
    el.id = 'galat';
    el.textContent = pesan;
    document.getElementById('bingkai').appendChild(el);
  }

  /* Tinggi mercator (0..1) untuk sebuah lintang. */
  function mercatorY(lat) {
    var s = Math.sin(lat * Math.PI / 180);
    return 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI);
  }

  /* Tinggi peta yang benar-benar terlihat: dikurangi bilah atas & bawah,
     supaya ujung Indonesia tidak tertutup bilah. */
  function tinggiTerlihat() {
    var bilah = 2 * parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--tinggi-bilah')
    );
    return Math.max(120, elPeta.clientHeight - bilah);
  }

  /* Zoom supaya seluruh tinggi Indonesia pas di tinggi layar.
     Lebar sengaja tidak dipakai: sisa lebar itulah yang di-scroll kiri-kanan. */
  function zoomUntukTinggi(tinggiPx) {
    var fraksi = Math.abs(mercatorY(INDONESIA[0][1]) - mercatorY(INDONESIA[1][1]));
    return Math.log2(tinggiPx / (512 * fraksi));
  }

  function namaWilayah(lon, lat) {
    for (var i = 0; i < WILAYAH.length; i++) {
      var w = WILAYAH[i];
      if (lon >= w.lon[0] && lon <= w.lon[1] && lat >= w.lat[0] && lat <= w.lat[1]) {
        return w.nama;
      }
    }
    return 'Perairan / negara tetangga';
  }

  /* Mencari provinsi yang paling dekat dengan titik tengah peta. Dipakai
     cadangan bila pencarian lewat kotak tidak menghasilkan apa-apa. */
  function cariProvinsi(lon, lat) {
    var daftar = window.WARNA_PROP;
    if (!daftar) { return null; }
    var terdekat = null;
    var jarakTerdekat = Infinity;
    for (var i = 0; i < daftar.length; i++) {
      var d = daftar[i];
      var t = kotakDari(d.g);
      if (!t) { continue; }
      var tengah = [(t[0] + t[2]) / 2, (t[1] + t[3]) / 2];
      var j = kuadratJarak(lon, lat, tengah[0], tengah[1]);
      if (j < jarakTerdekat) { jarakTerdekat = j; terdekat = d.a[0]; }
    }
    return terdekat === null ? null : String(terdekat);
  }

  function kuadratJarak(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return dx * dx + dy * dy;
  }

  /* Luas wilayah (km2) dihitung SENDIRI dari batas poligon — bukan dari kolom
     luas_wilayah Dukcapil.
     Sebabnya (diukur 16 Okt 2026): kolom itu tidak konsisten satuannya.
     33 dari 514 kabupaten/kota jelas salah — mis. KOTA SURABAYA tercatat
     335.925 km2 (seluruh Indonesia hanya 1,9 juta km2) sedangkan KOTA MEDAN
     279,29 km2. Karena itu luas dihitung dari batas resminya.

     Rumus: kelebihan bola (spherical excess) — sama dengan yang dipakai
     Mapbox/geojson-area. Jari-jari bumi 6.378.137 m. */
  var JARI_BUMI = 6378137;

  function luasKm2(koordinat) {
    var luas = 0;
    (function telusur(x) {
      if (!x || !x.length) { return; }
      if (typeof x[0][0] === 'number') {
        luas += Math.abs(luasCincin(x));
        return;
      }
      for (var i = 0; i < x.length; i++) { telusur(x[i]); }
    })(koordinat);
    return luas / 1e6;
  }

  function luasCincin(cincin) {
    var jumlah = 0;
    for (var i = 0; i < cincin.length; i++) {
      var p1 = cincin[i];
      var p2 = cincin[(i + 1) % cincin.length];
      jumlah += (p2[0] - p1[0]) * Math.PI / 180 *
        (2 + Math.sin(p1[1] * Math.PI / 180) + Math.sin(p2[1] * Math.PI / 180));
    }
    return jumlah * JARI_BUMI * JARI_BUMI / 2;
  }

  PD.luasKm2 = luasKm2;

  /* Mencari kab/kota yang paling dekat dengan sebuah titik (cadangan). */
  function kodeKabupatenDi(titik) {
    var daftar = window.WARNA_KAB;
    if (!daftar) { return null; }
    var terdekat = null;
    var jarakTerdekat = Infinity;
    for (var i = 0; i < daftar.length; i++) {
      var k = KOTAK_KAB[i] && KOTAK_KAB[i].kotak;
      if (!k) { continue; }
      var j = kuadratJarak(titik.lng, titik.lat, (k[0] + k[2]) / 2, (k[1] + k[3]) / 2);
      if (j < jarakTerdekat) { jarakTerdekat = j; terdekat = KOTAK_KAB[i].kode; }
    }
    return terdekat;
  }

  var KOTAK_KAB = [];
  var KOTAK_PROP = [];

  function siapkanKotakKayu() {
    if (window.WARNA_PROP) {
      KOTAK_PROP = window.WARNA_PROP.map(function (d) {
        return { kode: petakanKode(d.a[0], 2), kotak: kotakDari(d.g) };
      });
    }
    if (window.WARNA_KAB) {
      KOTAK_KAB = window.WARNA_KAB.map(function (d) {
        return { kode: d.k.split('.').slice(0, 2).map(function (x) { return petakanKode(x, 2); }).join(''), kotak: kotakDari(d.g) };
      });
    }
  }

  function petakanKode(n, lebar) {
    return String(n).padStart ? String(n).padStart(lebar, '0') : ('00000000' + n).slice(-lebar);
  }

  /* Kotak pembatas (bbox) dari seluruh koordinat satu wilayah. */
  function kotakDari(g) {
    var k = [Infinity, Infinity, -Infinity, -Infinity];
    (function telusur(x) {
      if (!x || !x.length) { return; }
      if (typeof x[0] === 'number') {
        if (x[0] < k[0]) { k[0] = x[0]; }
        if (x[1] < k[1]) { k[1] = x[1]; }
        if (x[0] > k[2]) { k[2] = x[0]; }
        if (x[1] > k[3]) { k[1] = k[1]; k[3] = Math.max(k[3], x[1]); }
        return;
      }
      for (var i = 0; i < x.length; i++) { telusur(x[i]); }
    })(g);
    return k[0] === Infinity ? null : k;
  }

  /* Kode bagian yang kotaknya bersentuhan dengan layar. Dipakai peta tematik
     (orderan 16) supaya SELURUH wilayah yang terlihat ikut diwarnai — bukan
     hanya yang titik tengahnya paling dekat. */
  function bagianTerlihat(daftar, batas, palingBanyak) {
    var hasil = [];
    for (var i = 0; i < daftar.length && hasil.length < palingBanyak; i++) {
      var k = daftar[i].kotak;
      if (!k) { continue; }
      if (k[2] < batas.getWest() || k[0] > batas.getEast()) { continue; }
      if (k[3] < batas.getSouth() || k[1] > batas.getNorth()) { continue; }
      hasil.push(daftar[i].kode);
    }
    return hasil;
  }

  /* Titik tengah seluruh koordinat (cukup untuk memilih berkas kecamatan). */
  function tengahKotak(g) {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    (function telusur(k) {
      if (!k || !k.length) { return; }
      if (typeof k[0] === 'number') {
        if (k[0] < minX) { minX = k[0]; }
        if (k[0] > maxX) { maxX = k[0]; }
        if (k[1] < minY) { minY = k[1]; }
        if (k[1] > maxY) { maxY = k[1]; }
        return;
      }
      for (var i = 0; i < k.length; i++) { telusur(k[i]); }
    })(g);
    if (minX === Infinity) { return null; }
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  }

  function angka(n, desimal) {
    return n.toFixed(desimal).replace('.', ',');
  }

  function perbaruiKeterangan() {
    var c = peta.getCenter();
    var z = peta.getZoom();
    elWilayah.textContent = namaWilayah(c.lng, c.lat);
    elPosisi.textContent = angka(c.lng, 1) + '\u00B0 BT \u00B7 ' +
      angka(c.lat, 1) + '\u00B0 \u00B7 z' + angka(z, 1);
  }

  function cariJenis(id) {
    for (var i = 0; i < JENIS.length; i++) {
      if (JENIS[i].id === id) { return JENIS[i]; }
    }
    return JENIS[0];
  }

  function ambilSimpanan() {
    try {
      var n = localStorage.getItem(KUNCI_SIMPAN);
      return n ? cariJenis(n).id : JENIS[0].id;
    } catch (e) {
      return JENIS[0].id;
    }
  }

  function simpanPilihan(id) {
    try { localStorage.setItem(KUNCI_SIMPAN, id); } catch (e) { /* diabaikan */ }
  }

  /* Font untuk teks peta (huruf di dalam penanda anggota). Diuji 16 Okt 2026:
   HTTP 200 · CORS `*`. MapLibre menolak lapisan `symbol` tanpa `glyphs`,
   jadi alamat ini wajib ada di gaya peta. */
  var GLYPHS = 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf';

  function bangunGaya(j) {
    var sumber = {
      dasar: {
        type: 'raster',
        tiles: j.dasar.tiles,
        tileSize: 256,
        maxzoom: j.dasar.maks,
        attribution: j.atribusi
      }
    };
    var lapisan = [
      { id: 'latar', type: 'background', paint: { 'background-color': j.latar } },
      { id: 'dasar', type: 'raster', source: 'dasar' }
    ];

    /* Garis batas negara hanya menempel di atas citra satelit. Peta jalan
       (OSM/CARTO) sudah memuat garis batasnya sendiri, jadi tidak perlu. */
    if (j.garis) {
      sumber.batas = {
        type: 'raster',
        tiles: j.garis.tiles,
        tileSize: 256,
        maxzoom: j.garis.maks
      };
      lapisan.push({
        id: 'batas',
        type: 'raster',
        source: 'batas',
        paint: { 'raster-opacity': j.garis.buram }
      });
    }

    return { version: 8, glyphs: GLYPHS, sources: sumber, layers: lapisan };
  }

  /* Orderan 15 — tombol pembuka di bilah atas + daftar pilihan yang melayang.
     Dibuat sendiri (bukan lewat MapLibre) supaya bentuk dan letaknya sama di
     HP maupun di PC. */
  function bangunPemilih() {
    var wadah = document.getElementById('pemilih-peta');
    var tombol = document.getElementById('tombol-jenis');
    if (!wadah || !tombol) { return; }

    wadah.innerHTML = '';
    for (var i = 0; i < JENIS.length; i++) {
      (function (j) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'pilihan-peta';
        b.dataset.jenis = j.id;
        b.setAttribute('role', 'option');
        b.innerHTML =
          '<span class="pilihan-ikon">' + j.ikon + '</span>' +
          '<span class="pilihan-nama">' + j.nama + '</span>' +
          '<span class="pilihan-ket">' + j.ket + '</span>';
        b.addEventListener('click', function () {
          gantiJenis(j.id);
          bukaTutupPemilih(false);
        });
        wadah.appendChild(b);
      })(JENIS[i]);
    }

    tombol.addEventListener('click', function () {
      bukaTutupPemilih(wadah.hidden);
    });

    /* Klik di luar daftar menutupnya. */
    document.addEventListener('click', function (e) {
      if (wadah.hidden) { return; }
      if (wadah.contains(e.target) || tombol.contains(e.target)) { return; }
      bukaTutupPemilih(false);
    });
  }

  function bukaTutupPemilih(buka) {
    var wadah = document.getElementById('pemilih-peta');
    var tombol = document.getElementById('tombol-jenis');
    if (!wadah || !tombol) { return; }
    wadah.hidden = !buka;
    tombol.setAttribute('aria-expanded', buka ? 'true' : 'false');
  }

  function tandaiPemilih() {
    var j = cariJenis(jenisAktif);
    document.getElementById('jenis-ikon').textContent = j.ikon;
    document.getElementById('jenis-nama').textContent = j.nama;

    var b = document.querySelectorAll('.pilihan-peta');
    for (var i = 0; i < b.length; i++) {
      var ini = b[i].dataset.jenis === jenisAktif;
      b[i].classList.toggle('nyala', ini);
      b[i].setAttribute('aria-selected', ini ? 'true' : 'false');
    }
  }

  /* Mengganti jenis peta tidak menggeser titik tengah maupun zoom, jadi apa
     yang sedang dilihat tetap di tempat yang sama. */
  function gantiJenis(id) {
    var j = cariJenis(id);
    if (!peta || j.id === jenisAktif) { return; }

    jenisAktif = j.id;
    simpanPilihan(j.id);
    tandaiPemilih();
    document.getElementById('atribusi').textContent = j.atribusi;

    var pusat = peta.getCenter();
    var zoom = peta.getZoom();
    peta.setStyle(bangunGaya(j));
    peta.once('styledata', function () {
      peta.jumpTo({ center: pusat, zoom: zoom });
    });
    perbaruiKeterangan();
  }

  function pasangTombol() {
    var langkah = 0.35; // bagian lebar layar tiap kali geser

    function geser(arah) {
      peta.panBy([arah * elPeta.clientWidth * langkah, 0], { duration: 350 });
    }

    document.getElementById('geser-kiri').addEventListener('click', function () { geser(-1); });
    document.getElementById('geser-kanan').addEventListener('click', function () { geser(1); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { geser(-1); }
      else if (e.key === 'ArrowRight') { geser(1); }
      else if (e.key >= '1' && e.key <= String(JENIS.length)) {
        gantiJenis(JENIS[Number(e.key) - 1].id);
      }
    });
  }

  function mulai() {
    if (typeof maplibregl === 'undefined') {
      tampilkanGalat('Pustaka peta tidak termuat. Periksa berkas js/lib/maplibre-gl.js.');
      return;
    }

    jenisAktif = ambilSimpanan();
    var j = cariJenis(jenisAktif);

    peta = new maplibregl.Map({
      container: 'peta',
      style: bangunGaya(j),
      center: PUSAT,
      zoom: zoomUntukTinggi(tinggiTerlihat()),
      minZoom: 2,
      maxZoom: 18,
      maxBounds: BATAS,
      renderWorldCopies: false,
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: false
    });

    peta.touchZoomRotate.disableRotation();
    peta.keyboard.disable(); // panah dipakai untuk geser kiri-kanan

    document.getElementById('atribusi').textContent = j.atribusi;
    bangunPemilih();
    tandaiPemilih();

    PD.peta = peta;
    siapkanKotakKayu();
    PD.kodeProvinsiSekarang = function () {
      var c = peta.getCenter();
      return cariProvinsi(c.lng, c.lat);
    };
    /* Kecamatan dipecah per provinsi, desa per kab/kota. Yang diambil adalah
       SEMUA bagian yang kotaknya bersentuhan dengan layar — supaya seluruh
       wilayah yang terlihat ikut berwarna saat peta digeser. */
    PD.bagianSekarang = function (tingkat) {
      var batas = peta.getBounds();
      if (tingkat === 'kecamatan') {
        var p = bagianTerlihat(KOTAK_PROP, batas, 6);
        return p.length ? p : null;
      }
      if (tingkat === 'desa') {
        var k = bagianTerlihat(KOTAK_KAB, batas, 8);
        return k.length ? k : null;
      }
      return null;
    };

    peta.on('load', function () {
      peta.resize();
      peta.jumpTo({ center: PUSAT, zoom: zoomUntukTinggi(tinggiTerlihat()) });
      perbaruiKeterangan();
    });

    peta.on('move', perbaruiKeterangan);

    peta.on('error', function (e) {
      if (e && e.error) { console.warn('Pemetaan:', e.error.message); }
    });

    window.addEventListener('resize', function () {
      peta.resize();
      perbaruiKeterangan();
    });

    pasangTombol();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    mulai();
  }
})();