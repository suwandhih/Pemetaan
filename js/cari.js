/* Pemetaan — pencarian (orderan 19)
   ------------------------------------------------------------------
   Tiga hal yang bisa dicari:

   1. WILAYAH — provinsi · kabupaten/kota · kecamatan · desa/kelurahan.
      Datanya dari indeks yang dibuat alat/buat-indeks-cari.js:
        data/cari-wilayah.js  (7.798 entri · ±253 KB) — dimuat segera
        data/cari-desa.js    (83.411 entri · ±3,3 MB) — dimuat di latar belakang
      Berkas desa 13× lebih besar, jadi dimuat menyusul supaya pencarian
      provinsi/kab/kecamatan bisa langsung dipakai.

   2. ANGGOTA — nama, kategori, atau inisial. Datanya dari modul anggota
      (js/member.js) lewat window.PD_ANGGOTA.

   3. NAMA JALAN / TEMPAT — ditanyakan langsung ke OpenStreetMap (Nominatim)
      saat pemakai berhenti mengetik. Tidak disimpan di proyek, jadi tidak
      menambah ukuran repo.
      Diuji 17 Okt 2026: HTTP 200 · CORS `*` · "Jalan Malioboro Yogyakarta"
      ketemu (-7,7932, 110,3658).
      Batas sopan OSM: maksimal 1 permintaan/detik — karena itu permintaan
      diberi jeda 400 ms setelah ketikan berhenti, dan hanya dijalankan bila
      ketikan 3 huruf atau lebih. */

(function () {
  'use strict';

  var KUNCI_WILAYAH = 'CARI_WILAYAH';
  var KUNCI_DESA = 'CARI_DESA';
  var BERKAS_WILAYAH = 'data/cari-wilayah.js';
  var BERKAS_DESA = 'data/cari-desa.js';

  var BATAS_HASIL = 30;      /* hasil ditampilkan paling banyak */
  var JEDA_KETIK = 220;      /* ms — menunggu ketikan berhenti */
  var JEDA_JALAN = 400;      /* ms — batas sopan Nominatim */
  var MIN_JALAN = 3;         /* huruf minimal untuk mencari nama jalan */

  var peta = null;
  var elCari = document.getElementById('cari');
  var elIsian = document.getElementById('cari-isian');
  var elHasil = document.getElementById('cari-hasil');
  var elTombol = document.getElementById('tombol-cari');

  var wilayahSiap = false;
  var desaSiap = false;
  var desaSedangMuat = false;
  var anggotaSiap = false;

  var jamKetik = null;
  var jamJalan = null;
  var urutJalan = 0;
  var hasilJalan = [];
  var pesanJalan = '';

  /* ---------- bantu ---------- */

  function angka(n) {
    return Number(n).toLocaleString('id-ID');
  }

  /* Membuang tanda diakritik & menyeragamkan huruf besar/kecil, supaya
     "NUSA TENGGARA" cocok dengan "nusa tenggara" dan "DKI" dengan "dki". */
  function rata(teks) {
    return String(teks || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function tingkatDariKode(kode) {
    var n = kode.split('.').length;
    if (n === 1) { return 'provinsi'; }
    if (n === 2) { return 'kabkota'; }
    if (n === 3) { return 'kecamatan'; }
    return 'desa';
  }

  var IKON_TINGKAT = {
    provinsi: '\uD83D\uDDFA\uFE0F',
    kabkota: '\uD83C\uDFD9\uFE0F',
    kecamatan: '\uD83D\uDCCD',
    desa: '\uD83C\uDFE1'
  };

  var LABEL_TINGKAT = {
    provinsi: 'Provinsi',
    kabkota: 'Kabupaten/Kota',
    kecamatan: 'Kecamatan',
    desa: 'Desa/Kelurahan'
  };

  /* ---------- memuat berkas indeks ---------- */

  function muatSkrip(berkas, kunci) {
    if (window[kunci]) { return Promise.resolve(window[kunci]); }
    return new Promise(function (selesai, gagal) {
      var s = document.createElement('script');
      s.src = berkas;
      s.onload = function () { selesai(window[kunci] || []); };
      s.onerror = function () { gagal(new Error('tidak termuat: ' + berkas)); };
      document.head.appendChild(s);
    });
  }

  function muatWilayah() {
    if (wilayahSiap) { return Promise.resolve(); }
    wilayahSiap = true;
    return muatSkrip(BERKAS_WILAYAH, KUNCI_WILAYAH)
      .then(function () { gambarHasil(); })
      .catch(function () { wilayahSiap = false; });
  }

  /* Desa dimuat di latar belakang — tidak menunggu, tidak menghalangi. */
  function muatDesa() {
    if (desaSiap || desaSedangMuat) { return; }
    desaSedangMuat = true;
    muatSkrip(BERKAS_DESA, KUNCI_DESA)
      .then(function () {
        desaSiap = true;
        desaSedangMuat = false;
        gambarHasil();
      })
      .catch(function () { desaSedangMuat = false; });
  }

  /* ---------- mencari wilayah ---------- */

  function cariWilayah(kata) {
    var hasil = [];
    var kunci = rata(kata);

    function telusur(daftar, tingkat) {
      if (!daftar) { return; }
      for (var i = 0; i < daftar.length; i++) {
        var d = daftar[i];
        if (rata(d[1]).indexOf(kunci) < 0) { continue; }
        hasil.push({ jenis: 'wilayah', tingkat: tingkat, kode: d[0], nama: d[1], induk: d[2] });
      }
    }

    telusur(window[KUNCI_WILAYAH], null);
    telusur(window[KUNCI_DESA], 'desa');

    /* Yang namanya PERSIS sama didahulukan, lalu yang namanya lebih pendek
       (biasanya wilayah yang lebih besar / lebih dikenal). */
    hasil.sort(function (a, b) {
      var a1 = rata(a.nama) === kunci ? 0 : 1;
      var b1 = rata(b.nama) === kunci ? 0 : 1;
      if (a1 !== b1) { return a1 - b1; }
      var a2 = rata(a.nama).indexOf(kunci);
      var b2 = rata(b.nama).indexOf(kunci);
      if (a2 !== b2) { return a2 - b2; }
      return a.nama.length - b.nama.length;
    });
    return hasil;
  }

  /* ---------- mencari anggota ---------- */

  function cariAnggota(kata) {
    var daftar = (typeof PD_ANGGOTA !== 'undefined' && PD_ANGGOTA.ambilAnggota)
      ? PD_ANGGOTA.ambilAnggota() : [];
    var kunci = rata(kata);
    var hasil = [];
    for (var i = 0; i < daftar.length; i++) {
      var a = daftar[i];
      var teks = rata([a.nama, a.kategori, a.inisial, a.provinsi, a.kabkota,
        a.kecamatan, a.desa].join(' '));
      if (teks.indexOf(kunci) < 0) { continue; }
      hasil.push({ jenis: 'anggota', anggota: a });
    }
    return hasil;
  }

  /* ---------- mencari nama jalan (OpenStreetMap) ---------- */

  function cariJalan(kata) {
    var urut = ++urutJalan;
    var u = 'https://nominatim.openstreetmap.org/search?format=json&limit=8' +
      '&countrycodes=id&q=' + encodeURIComponent(kata);

    fetch(u, { headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        if (!r.ok) { throw new Error('HTTP ' + r.status); }
        return r.json();
      })
      .then(function (j) {
        if (urut !== urutJalan) { return; }   /* ketikan sudah berubah */
        hasilJalan = (j || []).map(function (d) {
          return {
            jenis: 'jalan',
            nama: String(d.display_name || '').split(',')[0].trim(),
            alamat: d.display_name,
            lat: parseFloat(d.lat),
            lng: parseFloat(d.lon)
          };
        });
        pesanJalan = hasilJalan.length ? '' : 'Nama jalan tidak ditemukan di OpenStreetMap.';
        gambarHasil();
      })
      .catch(function () {
        if (urut !== urutJalan) { return; }
        hasilJalan = [];
        pesanJalan = 'Nama jalan tidak bisa dicari (butuh internet).';
        gambarHasil();
      });
  }

  /* ---------- menggambar hasil ---------- */

  function barisWilayah(h) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cari-baris';
    var tingkat = h.tingkat || tingkatDariKode(h.kode);
    var induk = '';
    if (h.induk) {
      var d = cariInduk(h.induk);
      if (d) { induk = d; }
    }
    b.innerHTML =
      '<span class="cari-ikon"></span>' +
      '<span class="cari-isi">' +
        '<span class="cari-nama"></span>' +
        '<span class="cari-ket"></span>' +
      '</span>';
    b.querySelector('.cari-ikon').textContent = IKON_TINGKAT[tingkat] || '\uD83D\uDCCD';
    b.querySelector('.cari-nama').textContent = h.nama;
    b.querySelector('.cari-ket').textContent =
      LABEL_TINGKAT[tingkat] + (induk ? ' \u00B7 ' + induk : '');
    b.addEventListener('click', function () { keWilayah(h); });
    return b;
  }

  /* Nama induk (kabupaten/kota atau provinsi) dari kode — untuk keterangan. */
  function cariInduk(kode) {
    var daftar = window[KUNCI_WILAYAH];
    if (!daftar) { return ''; }
    for (var i = 0; i < daftar.length; i++) {
      if (daftar[i][0] === kode) { return daftar[i][1]; }
    }
    return '';
  }

  function barisAnggota(h) {
    var a = h.anggota;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cari-baris';
    b.innerHTML =
      '<span class="cari-ikon cari-titik"></span>' +
      '<span class="cari-isi">' +
        '<span class="cari-nama"></span>' +
        '<span class="cari-ket"></span>' +
      '</span>';
    b.querySelector('.cari-titik').style.background =
      (typeof PD_ANGGOTA !== 'undefined' && PD_ANGGOTA.warnaKategori)
        ? PD_ANGGOTA.warnaKategori(a.kategori) : '#58a6ff';
    b.querySelector('.cari-nama').textContent = a.nama || '(tanpa nama)';
    b.querySelector('.cari-ket').textContent = [a.kategori, a.kabkota || a.provinsi]
      .filter(function (x) { return !!x; }).join(' \u00B7 ');
    b.addEventListener('click', function () { keAnggota(a); });
    return b;
  }

  function barisJalan(h) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cari-baris';
    b.innerHTML =
      '<span class="cari-ikon">\uD83D\uDEE3\uFE0F</span>' +
      '<span class="cari-isi">' +
        '<span class="cari-nama"></span>' +
        '<span class="cari-ket"></span>' +
      '</span>';
    b.querySelector('.cari-nama').textContent = h.nama;
    b.querySelector('.cari-ket').textContent = h.alamat;
    b.addEventListener('click', function () { keJalan(h); });
    return b;
  }

  function judulGrup(teks, jumlah) {
    var d = document.createElement('div');
    d.className = 'cari-grup';
    d.textContent = teks + ' (' + jumlah + ')';
    return d;
  }

  function gambarHasil() {
    if (!elHasil) { return; }
    var kata = (elIsian.value || '').trim();
    elHasil.innerHTML = '';

    if (kata.length < 2) {
      elHasil.innerHTML = '<p class="cari-pesan">Ketik minimal 2 huruf. ' +
        'Bisa nama wilayah, nama anggota/yayasan, atau nama jalan.</p>';
      return;
    }

    var wilayah = wilayahSiap ? cariWilayah(kata) : [];
    var anggota = cariAnggota(kata);

    var ada = false;

    if (anggota.length) {
      ada = true;
      elHasil.appendChild(judulGrup('Anggota', anggota.length));
      anggota.slice(0, BATAS_HASIL).forEach(function (h) {
        elHasil.appendChild(barisAnggota(h));
      });
    }

    if (wilayah.length) {
      ada = true;
      elHasil.appendChild(judulGrup('Wilayah', wilayah.length));
      wilayah.slice(0, BATAS_HASIL).forEach(function (h) {
        elHasil.appendChild(barisWilayah(h));
      });
      if (wilayah.length > BATAS_HASIL) {
        var p = document.createElement('p');
        p.className = 'cari-pesan';
        p.textContent = 'Menampilkan ' + BATAS_HASIL + ' dari ' + angka(wilayah.length) +
          ' wilayah yang cocok. Persempit ketikan untuk hasil lebih tepat.';
        elHasil.appendChild(p);
      }
    }

    if (hasilJalan.length) {
      ada = true;
      elHasil.appendChild(judulGrup('Jalan / Tempat (OpenStreetMap)', hasilJalan.length));
      hasilJalan.forEach(function (h) { elHasil.appendChild(barisJalan(h)); });
    }

    if (!ada) {
      var pesan = 'Tidak ada yang cocok dengan "' + kata + '".';
      if (!wilayahSiap) { pesan = 'Sedang memuat daftar wilayah\u2026'; }
      else if (desaSedangMuat) { pesan += ' Daftar desa masih dimuat.'; }
      if (pesanJalan) { pesan += ' ' + pesanJalan; }
      elHasil.innerHTML = '<p class="cari-pesan"></p>';
      elHasil.querySelector('.cari-pesan').textContent = pesan;
      return;
    }

    /* Keterangan tambahan: desa masih dimuat, atau anggota belum tersambung. */
    var catatan = [];
    if (desaSedangMuat) { catatan.push('Daftar desa/kelurahan masih dimuat\u2026'); }
    if (!anggotaSiap) { catatan.push('Anggota belum dimuat \u2014 isi kode database dulu.'); }
    if (catatan.length) {
      var c = document.createElement('p');
      c.className = 'cari-pesan';
      c.textContent = catatan.join(' ');
      elHasil.appendChild(c);
    }
  }

  /* ---------- aksi hasil ---------- */

  function keWilayah(h) {
    if (!peta) { return; }
    var tingkat = h.tingkat || tingkatDariKode(h.kode);
    var daftar = (tingkat === 'desa') ? window[KUNCI_DESA] : window[KUNCI_WILAYAH];
    if (!daftar) { return; }

    /* Kotak batas wilayah dihitung dari poligon resmi — diambil dari data
       batas yang sudah ada, bukan dari indeks (indeks tidak memuat poligon). */
    var poligon = (typeof PD_ANGGOTA !== 'undefined' && PD_ANGGOTA.daftarPoligon)
      ? PD_ANGGOTA.daftarPoligon(tingkat) : null;
    if (!poligon) { return; }

    var kolom = { provinsi: 1, kabkota: 2, kecamatan: 3, desa: 4 }[tingkat];
    var d = null;
    for (var i = 0; i < poligon.length; i++) {
      if (kodeDariPoligon(poligon[i], kolom) === h.kode) { d = poligon[i]; break; }
    }
    if (!d) { return; }

    var k = kotakDari(d.g);
    if (!k) { return; }
    var lngTepi = Math.max((k[2] - k[0]) * 0.06, 0.004);
    var latTepi = Math.max((k[3] - k[1]) * 0.06, 0.004);
    peta.fitBounds(
      [[k[0] - lngTepi, k[1] - latTepi], [k[2] + lngTepi, k[3] + latTepi]],
      { padding: 0, duration: 900, maxZoom: 15 }
    );

    if (typeof PD_ANGGOTA !== 'undefined' && PD_ANGGOTA.sorotWilayah) {
      PD_ANGGOTA.sorotWilayah(tingkat, h.kode);
    }
    tutup();
  }

  function keAnggota(a) {
    if (!peta) { return; }
    if (typeof a.lon === 'number' && typeof a.lat === 'number') {
      peta.flyTo({ center: [a.lon, a.lat], zoom: Math.max(peta.getZoom(), 14), duration: 900 });
    }
    if (typeof PD_ANGGOTA !== 'undefined' && PD_ANGGOTA.bukaKartuAnggota) {
      PD_ANGGOTA.bukaKartuAnggota(a.id);
    }
    tutup();
  }

  function keJalan(h) {
    if (!peta || !isFinite(h.lat) || !isFinite(h.lng)) { return; }
    peta.flyTo({ center: [h.lng, h.lat], zoom: 16, duration: 900 });
    if (typeof PD_ANGGOTA !== 'undefined' && PD_ANGGOTA.tunjukTitik) {
      PD_ANGGOTA.tunjukTitik(h.lng, h.lat, h.nama);
    }
    tutup();
  }

  /* Kode wilayah dari entri poligon — sama dengan kodeDari() di js/member.js. */
  var LEBAR = [2, 2, 2, 4];
  function kodeDariPoligon(d, kolom) {
    var bagian = [];
    for (var i = 0; i < kolom; i++) {
      bagian.push(String(d.a[i]).padStart(LEBAR[i], '0'));
    }
    return bagian.join('.');
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

  /* ---------- buka / tutup ---------- */

  function buka() {
    if (!elCari) { return; }
    elCari.hidden = false;
    if (elTombol) { elTombol.setAttribute('aria-expanded', 'true'); }
    muatWilayah();
    muatDesa();
    if (elIsian) { elIsian.focus(); }
    gambarHasil();
  }

  function tutup() {
    if (!elCari) { return; }
    elCari.hidden = true;
    if (elTombol) { elTombol.setAttribute('aria-expanded', 'false'); }
    if (elIsian) { elIsian.value = ''; }
    hasilJalan = [];
    pesanJalan = '';
    urutJalan++;
    if (elHasil) { elHasil.innerHTML = ''; }
  }

  function ketik() {
    if (jamKetik) { clearTimeout(jamKetik); }
    jamKetik = setTimeout(function () {
      gambarHasil();
      /* Nama jalan ditanyakan ke OSM hanya bila ketikan cukup panjang. */
      var kata = (elIsian.value || '').trim();
      if (kata.length < MIN_JALAN) {
        hasilJalan = [];
        pesanJalan = '';
        return;
      }
      if (jamJalan) { clearTimeout(jamJalan); }
      jamJalan = setTimeout(function () { cariJalan(kata); }, JEDA_JALAN);
    }, JEDA_KETIK);
  }

  /* ---------- mulai ---------- */

  function mulai() {
    if (!elCari || !elIsian || !elTombol) { return; }
    peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : null;

    elTombol.addEventListener('click', function () {
      if (elCari.hidden) { buka(); } else { tutup(); }
    });
    document.getElementById('cari-tutup').addEventListener('click', tutup);
    elIsian.addEventListener('input', ketik);
    elIsian.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { tutup(); }
    });

    /* Keadaan anggota dipantau supaya keterangan "belum dimuat" tepat. */
    if (typeof PD_ANGGOTA !== 'undefined' && PD_ANGGOTA.ambilAnggota) {
      anggotaSiap = PD_ANGGOTA.ambilAnggota().length > 0;
    }
    window.PD_CARI = {
      buka: buka,
      tutup: tutup,
      setAnggotaSiap: function (v) { anggotaSiap = !!v; }
    };
  }

  var coba = 0;
  (function ulang() {
    if (typeof PD !== 'undefined' && PD.peta) { mulai(); return; }
    if (coba++ < 60) { setTimeout(ulang, 100); }
  })();
})();
