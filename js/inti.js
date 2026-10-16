/* Pemetaan — inti peta
   Orderan 14: fokus Indonesia, negara tetangga tetap tampil, HP tegak,
   PC selebar HP, scroll kiri-kanan. */

(function () {
  'use strict';

  var SUMBER = {
    citra: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    batas: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
  };

  /* Indonesia + negara tetangga. Tetangga ikut masuk supaya peta tidak
     kosong dan pulau yang berbatasan (Kalimantan, Papua, Timor) tampak utuh.
     Batas dirapatkan supaya ujung geser tidak menampilkan laut kosong:
     barat 92° (Sumatera + Malaysia) · timur 148° (Papua + PNG). */
  var BATAS = [[92, -15], [148, 13]];

  /* Kotak Indonesia: dipakai untuk menghitung tinggi tampilan. */
  var INDONESIA = [[95.0, -11.1], [141.4, 6.1]];

  var PUSAT = [118.0, -2.5];

  /* Perkiraan wilayah menurut titik tengah peta. Dipakai untuk keterangan
     di bilah atas. Urutan penting: yang lebih khusus diperiksa lebih dulu. */
  var WILAYAH = [
    { nama: 'Papua', lon: [130.0, 141.5], lat: [-9.5, 0.5] },
    { nama: 'Maluku', lon: [125.5, 135.0], lat: [-8.5, 3.0] },
    { nama: 'Nusa Tenggara', lon: [114.5, 127.5], lat: [-11.5, -7.5] },
    { nama: 'Sulawesi', lon: [118.0, 125.5], lat: [-6.5, 2.0] },
    { nama: 'Kalimantan', lon: [108.5, 119.5], lat: [-4.5, 7.5] },
    { nama: 'Jawa', lon: [105.0, 115.5], lat: [-9.5, -5.0] },
    { nama: 'Sumatera', lon: [94.5, 106.5], lat: [-6.5, 6.5] }
  ];

  var peta = null;
  var elPeta = document.getElementById('peta');
  var elWilayah = document.getElementById('wilayah');
  var elPosisi = document.getElementById('posisi');

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

  function gaya() {
    return {
      version: 8,
      sources: {
        citra: {
          type: 'raster',
          tiles: [SUMBER.citra],
          tileSize: 256,
          maxzoom: 19,
          attribution: 'Citra: Esri, Maxar, Earthstar Geographics'
        },
        batas: {
          type: 'raster',
          tiles: [SUMBER.batas],
          tileSize: 256,
          maxzoom: 19
        }
      },
      layers: [
        { id: 'latar', type: 'background', paint: { 'background-color': '#05080b' } },
        { id: 'citra', type: 'raster', source: 'citra' },
        { id: 'batas', type: 'raster', source: 'batas', paint: { 'raster-opacity': 0.9 } }
      ]
    };
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
    });
  }

  function mulai() {
    if (typeof maplibregl === 'undefined') {
      tampilkanGalat('Pustaka peta tidak termuat. Periksa berkas js/lib/maplibre-gl.js.');
      return;
    }

    peta = new maplibregl.Map({
      container: 'peta',
      style: gaya(),
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
