/* Pemetaan — jangkar & label media per provinsi
   ------------------------------------------------------------------
   TUGAS
     Menjawab pertanyaan "provinsi ini punya media apa saja?" langsung
     dari peta. Setiap provinsi yang punya data media diberi satu
     jangkar (titik) di titik tengahnya, dan satu label pendek yang
     menyebut kelompok medianya — mis. "Film Isa · Video · Clip".

   KENAPA JANGKAR + LABEL
     Titik di peta tidak berguna kalau tidak jelas isinya. Jangkar
     menunjukkan TEMPAT, label menunjukkan ISI. Keduanya dipisah supaya
     MapLibre bisa menyembunyikan label yang saling bertumpuk tanpa ikut
     menghilangkan jangkarnya.

   HUBUNGAN DENGAN MODUL LAIN
     - js/member.js : sumber data anggota (PD_ANGGOTA.ambilAnggota) dan
                      warna kategori (PD_ANGGOTA.warnaKategori).
     - js/media.js  : kelompok media yang sedang hidup (PD_MEDIA.hidup).
                      Media yang dimatikan tidak ikut muncul di label.
     - js/inti.js   : peta (PD.peta) dan font label (GLYPHS).
     - data/wilayah-warna/prop-nasional.js : poligon 38 provinsi, dipakai
                      untuk menghitung titik tengah — tidak ada data baru.

   Dibuat: 2026-10-22 (orderan 26)
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  var SUMBER = 'media-provinsi';
  var LAPISAN_JANGKAR = 'media-jangkar';
  var LAPISAN_LABEL = 'media-label';

  /* Nama pendek untuk lima kelompok media — dipakai di label peta supaya
     muat. Nama panjangnya tetap dipakai di menu Media on/off. */
  var PENDEK = {
    'Film Isa Al-Masih': 'Film Isa',
    'Film Ikatan Ilahi': 'Film Ilahi',
    'Video Kitab Suci': 'Video',
    'Clip Kitab Suci': 'Clip',
    'Aplikasi Kitab Suci': 'Ap Kitab'
  };

  /* Urutan tetap kelompok media — sama dengan urutan di js/media.js. */
  var URUT = [
    'Film Isa Al-Masih', 'Film Ikatan Ilahi', 'Video Kitab Suci',
    'Clip Kitab Suci', 'Aplikasi Kitab Suci'
  ];

  var peta = null;
  var terpasang = false;
  var jam = null;
  var siap = false;

  /* ---------- titik daratan provinsi ---------- */

  /* Poligon Dukcapil berbentuk Polygon (satu cincin) atau MultiPolygon
     (banyak cincin). Keduanya diratakan jadi daftar cincin dulu. */
  function kumpulRing(g, keluar) {
    if (!g || !g.length) { return; }
    if (typeof g[0][0] === 'number') { keluar.push(g); return; }
    for (var i = 0; i < g.length; i++) { kumpulRing(g[i], keluar); }
  }

  function luasRing(ring) {
    var a = 0;
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    }
    return a / 2;
  }

  function dalamRing(titik, ring) {
    var dalam = false;
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      var a = ring[i], b = ring[j];
      if ((a[1] > titik[1]) !== (b[1] > titik[1]) &&
          titik[0] < (b[0] - a[0]) * (titik[1] - a[1]) / (b[1] - a[1]) + a[0]) {
        dalam = !dalam;
      }
    }
    return dalam;
  }

  /* Titik berat satu cincin (rumus titik berat poligon). */
  function titikBeratRing(ring) {
    var x = 0, y = 0, a = 0;
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      var f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
      a += f;
      x += (ring[j][0] + ring[i][0]) * f;
      y += (ring[j][1] + ring[i][1]) * f;
    }
    if (a === 0) { return ring[0]; }
    a *= 0.5;
    return [x / (6 * a), y / (6 * a)];
  }

  /* Cari titik-titik di dalam poligon daratan terbesar provinsi. Grid
     deterministik ini menghindari titik berat di laut untuk bentuk bulan sabit. */
  function titikProvinsi(d) {
    var ring = [];
    kumpulRing(d.g, ring);
    if (!ring.length) { return null; }
    var terbaik = null, terluas = -1;
    ring.forEach(function (r) {
      var l = Math.abs(luasRing(r));
      if (l > terluas) { terluas = l; terbaik = r; }
    });
    if (!terbaik) { return null; }

    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    terbaik.forEach(function (p) {
      minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]);
    });
    var titik = [];
    for (var x = 0; x < 36; x++) {
      for (var y = 0; y < 36; y++) {
        var p = [minX + (x + 0.5) * (maxX - minX) / 36,
          minY + (y + 0.5) * (maxY - minY) / 36];
        if (dalamRing(p, terbaik)) { titik.push(p); }
      }
    }
    if (!titik.length) { return titikBeratRing(terbaik); }
    var pusat = titik.reduce(function (s, p) {
      s[0] += p[0] / titik.length; s[1] += p[1] / titik.length; return s;
    }, [0, 0]);
    titik.sort(function (a, b) {
      return Math.pow(a[0] - pusat[0], 2) + Math.pow(a[1] - pusat[1], 2) -
        (Math.pow(b[0] - pusat[0], 2) + Math.pow(b[1] - pusat[1], 2));
    });
    return titik[0];
  }

  function kodeProv(d) {
    var n = String(d.a[0]);
    return n.length < 2 ? ('0' + n) : n;
  }

  /* ---------- isi media tiap provinsi ---------- */

  /* Hasil: { '33': { nama: 'JAWA TENGAH', media: { 'Video Kitab Suci': true } } }
     Hanya kelompok media yang HIDUP di menu Media on/off yang dihitung,
     jadi label selalu sejalan dengan penanda yang tampil di peta. */
  function inventaris() {
    var anggota = (window.PD_ANGGOTA && window.PD_ANGGOTA.ambilAnggota)
      ? window.PD_ANGGOTA.ambilAnggota() : [];
    var hidup = (window.PD_MEDIA && window.PD_MEDIA.hidup)
      ? window.PD_MEDIA.hidup : function () { return true; };
    var hasil = {};

    anggota.forEach(function (a) {
      var kode = a.kodeProvinsi;
      if (!kode) { return; }
      if (URUT.indexOf(a.kategori) < 0) { return; }
      if (!hidup(a.kategori)) { return; }
      if (!hasil[kode]) {
        hasil[kode] = { nama: a.provinsi || '', media: {}, titik: null };
      }
      hasil[kode].media[a.kategori] = true;
      if (!hasil[kode].titik && Number.isFinite(Number(a.lon)) && Number.isFinite(Number(a.lat))) {
        hasil[kode].titik = [Number(a.lon), Number(a.lat)];
      }
    });

    return hasil;
  }

  function warna(nama) {
    return (window.PD_ANGGOTA && window.PD_ANGGOTA.warnaKategori)
      ? window.PD_ANGGOTA.warnaKategori(nama) : '#58a6ff';
  }

  function data() {
    var inv = inventaris();
    var daftar = window.WARNA_PROP || [];
    var fitur = [];

    daftar.forEach(function (d) {
      var kode = kodeProv(d);
      var p = inv[kode];
      if (!p) { return; }

      var media = URUT.filter(function (n) { return p.media[n]; });
      if (!media.length) { return; }

      var titik = p.titik || titikProvinsi(d);
      if (!titik) { return; }

      fitur.push({
        type: 'Feature',
        properties: {
          kode: kode,
          nama: d.a[1],
          label: media.map(function (n) { return PENDEK[n] || n; })
            .join(' \u00B7 '),
          jumlah: media.length,
          warna: warna(media[0])
        },
        geometry: { type: 'Point', coordinates: titik }
      });
    });

    return { type: 'FeatureCollection', features: fitur };
  }

  /* ---------- lapisan peta ---------- */

  function siapkanLapisan() {
    if (!peta || !peta.isStyleLoaded()) { return false; }
    if (peta.getSource(SUMBER)) { return true; }

    peta.addSource(SUMBER, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });

    /* Jangkar: bulatan terang dengan cincin warna kelompok media pertama.
       Sama bahasanya dengan penanda anggota supaya terbaca sebagai satu
       keluarga tampilan. */
    peta.addLayer({
      id: LAPISAN_JANGKAR,
      type: 'circle',
      source: SUMBER,
      minzoom: 3.5,
      paint: {
        'circle-radius': 5.5,
        'circle-color': '#f2f7fc',
        'circle-stroke-color': ['get', 'warna'],
        'circle-stroke-width': 2.5
      }
    });

    /* Label: nama pendek kelompok media. `text-variable-anchor` membuat
       MapLibre memilih sisi yang paling lapang, jadi label tidak saling
       menimpa saat provinsinya berdekatan. */
    peta.addLayer({
      id: LAPISAN_LABEL,
      type: 'symbol',
      source: SUMBER,
      minzoom: 4,
      layout: {
        'text-field': ['get', 'label'],
        'text-font': ['Open Sans Bold'],
        /* Kecil saat peta dilihat dari jauh (banyak provinsi), membesar
           saat diperbesar supaya tetap terbaca. */
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10, 7, 12.5],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 1.1,
        'text-justify': 'auto',
        'text-max-width': 12,
        'text-allow-overlap': false,
        'text-ignore-placement': false,
        'text-padding': 8
      },
      paint: {
        'text-color': '#f2f7fc',
        'text-halo-color': '#0b0f14',
        'text-halo-width': 1.8,
        'text-halo-blur': 0.4
      }
    });

    /* Ketuk jangkar atau label → provinsinya diberi garis merah berkedip,
       memakai mekanisme sorot yang sudah ada di js/member.js. */
    [LAPISAN_JANGKAR, LAPISAN_LABEL].forEach(function (id) {
      peta.on('click', id, function (e) {
        if (!e.features || !e.features.length) { return; }
        var kode = e.features[0].properties.kode;
        if (window.PD_ANGGOTA && window.PD_ANGGOTA.sorotWilayah) {
          window.PD_ANGGOTA.sorotWilayah('provinsi', kode);
        }
      });
      peta.on('mouseenter', id, function () {
        peta.getCanvas().style.cursor = 'pointer';
      });
      peta.on('mouseleave', id, function () {
        peta.getCanvas().style.cursor = '';
      });
    });

    return true;
  }

  /* ---------- keterangan (pilin) ---------- */

  /* Hanya kelompok media yang benar-benar ada di peta yang ditampilkan,
     supaya keterangannya tidak pernah berbohong. */
  function keterangan() {
    var el = document.getElementById('keterangan-media');
    var daftar = document.getElementById('km-daftar');
    if (!el || !daftar) { return; }

    var inv = inventaris();
    var ada = {};
    Object.keys(inv).forEach(function (k) {
      Object.keys(inv[k].media).forEach(function (n) { ada[n] = true; });
    });

    var pakai = URUT.filter(function (n) { return ada[n]; });
    if (!pakai.length) {
      el.hidden = true;
      daftar.innerHTML = '';
      return;
    }

    daftar.innerHTML = '';
    pakai.forEach(function (n) {
      var s = document.createElement('span');
      s.className = 'km-pil';
      var i = document.createElement('i');
      i.style.background = warna(n);
      s.appendChild(i);
      s.appendChild(document.createTextNode(PENDEK[n] || n));
      daftar.appendChild(s);
    });
    el.hidden = false;
  }

  /* ---------- menggambar ---------- */

  function gambar() {
    if (!peta) { return; }
    if (!siapkanLapisan()) { segarkan(); return; }
    peta.getSource(SUMBER).setData(data());
    keterangan();
  }

  /* Dipanggil berkali-kali dalam satu tarikan napas (mis. saat anggota
     selesai dimuat) — ditunda sebentar supaya tidak dihitung berulang. */
  function segarkan() {
    if (jam) { clearTimeout(jam); }
    jam = setTimeout(gambar, 60);
  }

  /* ---------- mulai ---------- */

  function mulai() {
    if (terpasang) { return; }
    peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : null;
    if (!peta) { return; }
    terpasang = true;

    /* Gaya peta diganti (tombol Satelit/Map) → seluruh lapisan dibuang,
       jadi jangkar & label harus dipasang ulang. */
    peta.on('styledata', segarkan);
    peta.on('load', segarkan);
    /* Data anggota dimuat asinkron. Jangan menggambar label dari array kosong
       sebelum pembacaan database selesai. */
    if (window.PD_ANGGOTA && PD_ANGGOTA.muat) {
      PD_ANGGOTA.muat().then(segarkan, segarkan);
    }

    siap = true;
    segarkan();
  }

  window.PD_LABEL = {
    siap: function () { return siap; },
    segarkan: segarkan,
    gambar: gambar,
    data: data,
    inventaris: inventaris
  };

  var coba = 0;
  (function ulang() {
    if (typeof PD !== 'undefined' && PD.peta) { mulai(); return; }
    if (coba++ < 60) { setTimeout(ulang, 100); }
  })();
})();
