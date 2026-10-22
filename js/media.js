/* Pemetaan — menu "Media on/off"
   ------------------------------------------------------------------
   TUGAS
     Menyediakan satu menu untuk menghidupkan / mematikan kelompok data
     yang tampil di peta. Menggantikan tombol mata (👁) yang dulu hanya
     bisa menyembunyikan SELURUH penanda sekaligus — sekarang pemakai
     bisa memilih kelompok mana yang mau dilihat.

   KENAPA DINAMIS
     Daftar kelompok dibaca dari data yang benar-benar ada, bukan
     ditulis tetap di kode. Lima kelompok media tokomedia.org selalu
     ditampilkan lebih dulu (supaya menunya tidak pernah kosong), lalu
     kategori lain yang dipakai anggota ikut menyusul di bawahnya.

   CARA KERJA
     Setiap baris = satu kategori. Ketuk baris untuk menghidupkan atau
     mematikan. Dua tombol di bawah untuk menghidupkan / mematikan
     semuanya serempak. Keadaan disimpan di database (kunci
     `media_nyala`), jadi sama di PC maupun HP dan tetap tersimpan
     setelah halaman ditutup.

   HUBUNGAN DENGAN js/member.js
     js/member.js memanggil PD_MEDIA.saring() setiap kali penanda
     digambar. Hasilnya null bila semua kelompok hidup (tidak ada
     penyaringan), atau daftar nama kategori yang hidup.

   Dibuat: 2026-10-22 (orderan 24)
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  var KUNCI = 'media_nyala';

  /* Lima kelompok media tokomedia.org — urutannya tetap, mengikuti
     urutan yang dipakai pemilik proyek. */
  var MEDIA = [
    { nama: 'Film Isa Al-Masih', ikon: 'ikon-orang' },
    { nama: 'Film Ikatan Ilahi', ikon: 'ikon-rantai' },
    { nama: 'Video Kitab Suci', ikon: 'ikon-kamera' },
    { nama: 'Clip Kitab Suci', ikon: 'ikon-putar' },
    { nama: 'Aplikasi Kitab Suci', ikon: 'ikon-ponsel' }
  ];

  var elPemilih = document.getElementById('pemilih-media');
  var elTombol = document.getElementById('tombol-media');
  var elIkon = document.getElementById('media-ikon');

  var nyala = {};        /* nama kategori -> true / false */
  var terpasang = false;
  var siap = false;

  /* ---------- daftar kelompok ---------- */

  /* Lima kelompok media selalu ada; kategori lain menyusul bila dipakai
     anggota. Dibaca ulang setiap kali menu dibuka supaya kategori baru
     langsung muncul tanpa perlu memuat ulang halaman. */
  function daftarKategori() {
    var hasil = [];
    var ada = {};
    var anggota = (window.PD_ANGGOTA && window.PD_ANGGOTA.ambilAnggota)
      ? window.PD_ANGGOTA.ambilAnggota() : [];

    anggota.forEach(function (a) {
      if (a.kategori) { ada[a.kategori] = true; }
    });

    MEDIA.forEach(function (m) {
      hasil.push(m.nama);
      delete ada[m.nama];
    });

    Object.keys(ada).sort().forEach(function (n) { hasil.push(n); });
    return hasil;
  }

  function ikonUntuk(nama) {
    for (var i = 0; i < MEDIA.length; i++) {
      if (MEDIA[i].nama === nama) { return MEDIA[i].ikon; }
    }
    return (window.PD_IKON ? PD_IKON.untukKategori(nama) : 'ikon-pin');
  }

  /* ---------- keadaan ---------- */

  function hidup(nama) {
    return nyala[nama] !== false;
  }

  function jumlahHidup() {
    return daftarKategori().filter(hidup).length;
  }

  /* Dipakai js/member.js. null = semua hidup, jadi tidak perlu disaring. */
  function saring() {
    var semua = daftarKategori();
    var mati = semua.filter(function (n) { return !hidup(n); });
    if (!mati.length) { return null; }
    return semua.filter(hidup);
  }

  /* Simpanan adalah `const` tingkat atas (js/simpanan.js), bukan properti
     window — jadi diperiksa dengan typeof, sama seperti js/tokomedia.js. */
  function adaSimpanan() {
    return typeof Simpanan !== 'undefined' && !!Simpanan.simpanAtur;
  }

  function simpan() {
    if (!adaSimpanan()) { return; }
    Simpanan.simpanAtur(KUNCI, JSON.stringify(nyala));
  }

  function muat() {
    if (!adaSimpanan()) { return Promise.resolve(); }
    return Simpanan.ambilAtur(KUNCI).then(function (v) {
      if (!v) { return; }
      try {
        var isi = JSON.parse(v);
        if (isi && typeof isi === 'object') { nyala = isi; }
      } catch (e) { /* nilai lama / rusak — diabaikan, semua dianggap hidup */ }
    }).catch(function () { /* diabaikan */ });
  }

  /* ---------- menggambar ---------- */

  function baris(nama) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'media-baris';
    b.dataset.media = nama;
    b.setAttribute('role', 'option');

    var g = document.createElement('span');
    g.className = 'media-gambar';
    if (window.PD_IKON && PD_IKON.gambar) {
      g.style.backgroundImage = 'url("' + PD_IKON.gambar(ikonUntuk(nama), '#f2f7fc') + '")';
    }

    var t = document.createElement('span');
    t.className = 'media-nama';
    t.textContent = nama;

    var k = document.createElement('span');
    k.className = 'media-keadaan';

    b.appendChild(g);
    b.appendChild(t);
    b.appendChild(k);

    b.addEventListener('click', function () {
      nyala[nama] = !hidup(nama);
      simpan();
      tandai();
      terapkan();
    });

    return b;
  }

  function bangun() {
    if (!elPemilih) { return; }
    elPemilih.innerHTML = '';

    var kepala = document.createElement('div');
    kepala.className = 'media-kepala';
    kepala.textContent = 'Media on/off';
    elPemilih.appendChild(kepala);

    daftarKategori().forEach(function (nama) {
      elPemilih.appendChild(baris(nama));
    });

    var pisah = document.createElement('div');
    pisah.className = 'media-pisah';
    elPemilih.appendChild(pisah);

    var serempak = document.createElement('div');
    serempak.className = 'media-serempak';

    [['hidup', 'Semua hidup'], ['mati', 'Semua mati']].forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'media-serempak-tombol';
      b.dataset.serempak = p[0];
      b.textContent = p[1];
      b.addEventListener('click', function () { semua(p[0] === 'hidup'); });
      serempak.appendChild(b);
    });

    elPemilih.appendChild(serempak);
  }

  function tandai() {
    var semua = daftarKategori();
    var hidupN = semua.filter(hidup).length;

    var b = elPemilih ? elPemilih.querySelectorAll('.media-baris') : [];
    for (var i = 0; i < b.length; i++) {
      var nama = b[i].dataset.media;
      var on = hidup(nama);
      b[i].classList.toggle('nyala', on);
      b[i].setAttribute('aria-selected', on ? 'true' : 'false');
      var k = b[i].querySelector('.media-keadaan');
      if (k) { k.textContent = on ? 'Hidup' : 'Mati'; }
    }

    if (elTombol) {
      elTombol.setAttribute('aria-pressed', hidupN ? 'true' : 'false');
      elTombol.title = hidupN === semua.length
        ? 'Media on/off — semua ' + semua.length + ' kelompok tampil di peta'
        : 'Media on/off — ' + hidupN + ' dari ' + semua.length + ' kelompok tampil di peta';
    }
    if (elIkon) { elIkon.style.opacity = hidupN ? '1' : '0.45'; }
  }

  /* ---------- menerapkan ke peta ---------- */

  function terapkan() {
    if (window.PD_ANGGOTA && window.PD_ANGGOTA.terapkanTampil) {
      window.PD_ANGGOTA.terapkanTampil();
    }
  }

  function semua(hidupSemua) {
    daftarKategori().forEach(function (n) { nyala[n] = !!hidupSemua; });
    simpan();
    tandai();
    terapkan();
  }

  /* ---------- buka / tutup ---------- */

  function bukaTutup(buka) {
    if (!elPemilih || !elTombol) { return; }
    if (buka) { bangun(); tandai(); }
    elPemilih.hidden = !buka;
    elTombol.setAttribute('aria-expanded', buka ? 'true' : 'false');
    if (buka) {
      /* Tiga daftar melayang memakai tempat yang sama — hanya satu boleh
         terbuka. Panel Suku memakai kolom kiri di PC, jadi ikut ditutup. */
      var w = document.getElementById('pemilih-warna');
      if (w) { w.hidden = true; }
      var a = document.getElementById('pemilih-agama');
      if (a) { a.hidden = true; }
      if (window.PD_SUKU && window.PD_SUKU.tutupPanel) { window.PD_SUKU.tutupPanel(); }
    }
  }

  function pasang() {
    if (!elPemilih || !elTombol) { return; }

    elTombol.addEventListener('click', function () {
      bukaTutup(elPemilih.hidden);
    });

    document.addEventListener('click', function (e) {
      if (elPemilih.hidden) { return; }
      if (elPemilih.contains(e.target) || elTombol.contains(e.target)) { return; }
      bukaTutup(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'm' || e.key === 'M') { bukaTutup(elPemilih.hidden); }
      if (e.key === 'Escape' && !elPemilih.hidden) { bukaTutup(false); }
    });
  }

  /* ---------- mulai ---------- */

  /* Dipasang langsung, tidak menunggu peta. Daftar barisnya dibangun
     ulang setiap kali menu dibuka (lihat bukaTutup), jadi data anggota
     yang baru masuk pun langsung ikut terbaca. */
  function mulai() {
    if (terpasang) { return; }
    terpasang = true;
    pasang();
    muat().then(function () {
      siap = true;
      bangun();
      tandai();
      terapkan();
    });
  }

  window.PD_MEDIA = {
    MEDIA: MEDIA,
    siap: function () { return siap; },
    hidup: hidup,
    saring: saring,
    semua: semua,
    terapkan: terapkan,
    bukaTutup: bukaTutup,
    /* Dipakai js/panduan.js untuk membuka menu lalu memilih satu baris. */
    segarkan: function () { bangun(); tandai(); }
  };

  mulai();
})();
