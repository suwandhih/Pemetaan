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
     mematikan. Satu tombol utama On/Off menyembunyikan atau memulihkan
     tampilan tanpa mengubah pilihan kategori. Pilihan kategori dan
     keadaan utama disimpan di database (`media_nyala` dan
     `media_utama`), jadi sama di PC maupun HP dan tetap tersimpan
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
  var KUNCI_UTAMA = 'media_utama';

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

  var nyala = {};        /* nama kategori -> pilihan pengguna */
  var utamaNyala = true; /* saklar tampilan, terpisah dari pilihan */
  var terpasang = false;
  var siap = false;
  var kategoriTersedia = [];   /* seluruh kategori yang terdaftar */

  /* ---------- daftar kelompok ---------- */

  /* Lima kelompok media selalu ada; kategori lain menyusul. Daftarnya
     diambil dari dua tempat: kategori yang benar-benar dipakai anggota,
     dan daftar kategori resmi (Simpanan.semuaKategori). Kategori yang
     belum dipakai anggota tetap ditampilkan supaya pemakai bisa
     mengaturnya lebih dulu — orderan 24 meminta SEMUA kategori bisa
     dihidupkan / dimatikan. */
  function daftarKategori() {
    var hasil = [];
    var ada = {};

    var anggota = (window.PD_ANGGOTA && window.PD_ANGGOTA.ambilAnggota)
      ? window.PD_ANGGOTA.ambilAnggota() : [];
    anggota.forEach(function (a) {
      if (a.kategori) { ada[a.kategori] = true; }
    });
    kategoriTersedia.forEach(function (n) { ada[n] = true; });

    MEDIA.forEach(function (m) {
      hasil.push(m.nama);
      delete ada[m.nama];
    });

    Object.keys(ada).sort().forEach(function (n) { hasil.push(n); });
    return hasil;
  }

  /* Dibaca ulang setiap kali menu dibuka, supaya kategori yang baru
     ditambah atau dihapus langsung ikut terlihat. */
  function segarkanKategori() {
    if (typeof Simpanan === 'undefined' || !Simpanan.semuaKategori) {
      return Promise.resolve();
    }
    return Simpanan.semuaKategori().then(function (d) {
      kategoriTersedia = (d || []).slice();
    }).catch(function () { /* diabaikan — pakai daftar yang sudah ada */ });
  }

  function ikonUntuk(nama) {
    for (var i = 0; i < MEDIA.length; i++) {
      if (MEDIA[i].nama === nama) { return MEDIA[i].ikon; }
    }
    return (window.PD_IKON ? PD_IKON.untukKategori(nama) : 'ikon-pin');
  }

  /* ---------- keadaan ---------- */

  function dipilih(nama) {
    return nyala[nama] !== false;
  }

  function hidup(nama) {
    return utamaNyala && dipilih(nama);
  }

  /* [] = saklar utama mati, sehingga seluruh penanda disaring tanpa
     mengubah pilihan kategori yang akan dipulihkan saat On. */
  function saring() {
    if (!utamaNyala) { return []; }
    var semua = daftarKategori();
    var mati = semua.filter(function (n) { return !dipilih(n); });
    if (!mati.length) { return null; }
    return semua.filter(dipilih);
  }

  /* Simpanan adalah `const` tingkat atas (js/simpanan.js), bukan properti
     window — jadi diperiksa dengan typeof, sama seperti js/tokomedia.js. */
  function adaSimpanan() {
    return typeof Simpanan !== 'undefined' && !!Simpanan.simpanAtur;
  }

  function simpanPilihan() {
    if (adaSimpanan()) { Simpanan.simpanAtur(KUNCI, JSON.stringify(nyala)); }
  }

  function simpanUtama() {
    if (adaSimpanan()) { Simpanan.simpanAtur(KUNCI_UTAMA, utamaNyala ? '1' : '0'); }
  }

  function muat() {
    if (!adaSimpanan()) { return Promise.resolve(); }
    return Promise.all([
      Simpanan.ambilAtur(KUNCI),
      Simpanan.ambilAtur(KUNCI_UTAMA)
    ]).then(function (nilai) {
      utamaNyala = nilai[1] !== '0';
      if (!nilai[0]) { return; }
      try {
        var isi = JSON.parse(nilai[0]);
        if (isi && typeof isi === 'object') { nyala = isi; }
      } catch (e) { /* nilai lama / rusak — diabaikan, semua dianggap dipilih */ }
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
      nyala[nama] = !dipilih(nama);
      simpanPilihan();
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

    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'media-utama';
    b.className = 'media-serempak-tombol';
    b.setAttribute('aria-pressed', 'true');
    b.addEventListener('click', function () { semua(); });
    serempak.appendChild(b);

    elPemilih.appendChild(serempak);
  }

  function tandai() {
    var semua = daftarKategori();
    var pilihanN = semua.filter(dipilih).length;

    var b = elPemilih ? elPemilih.querySelectorAll('.media-baris') : [];
    for (var i = 0; i < b.length; i++) {
      var nama = b[i].dataset.media;
      var on = dipilih(nama);
      b[i].classList.toggle('nyala', on);
      b[i].setAttribute('aria-selected', on ? 'true' : 'false');
      var k = b[i].querySelector('.media-keadaan');
      if (k) { k.textContent = on ? 'Dipilih' : 'Tidak dipilih'; }
    }

    var utama = document.getElementById('media-utama');
    if (utama) {
      utama.textContent = utamaNyala ? 'On' : 'Off';
      utama.classList.toggle('nyala', utamaNyala);
      utama.setAttribute('aria-pressed', utamaNyala ? 'true' : 'false');
      utama.setAttribute('aria-label', utamaNyala
        ? 'On — klik untuk mematikan tampilan media tanpa menghapus pilihan'
        : 'Off — klik untuk menghidupkan hanya media yang dipilih');
      utama.title = utamaNyala
        ? 'On — klik untuk Off; pilihan kategori tetap disimpan'
        : 'Off — klik untuk On dan tampilkan hanya kategori yang dipilih';
    }

    if (elTombol) {
      elTombol.setAttribute('aria-pressed', utamaNyala ? 'true' : 'false');
      elTombol.title = (utamaNyala ? 'Media On — ' : 'Media Off — ') +
        pilihanN + ' dari ' + semua.length + ' kelompok dipilih';
    }
    if (elIkon) { elIkon.style.opacity = utamaNyala ? '1' : '0.45'; }
  }

  /* ---------- menerapkan ke peta ---------- */

  function terapkan() {
    if (window.PD_ANGGOTA && window.PD_ANGGOTA.terapkanTampil) {
      window.PD_ANGGOTA.terapkanTampil();
    }
    /* Orderan 26: label provinsi menyebut kelompok media yang hidup saja,
       jadi keterangan di peta ikut berubah saat menu ini dipakai. */
    if (window.PD_LABEL && window.PD_LABEL.segarkan) {
      window.PD_LABEL.segarkan();
    }
  }

  function semua(nyalaUtama) {
    utamaNyala = arguments.length ? !!nyalaUtama : !utamaNyala;
    simpanUtama();
    tandai();
    terapkan();
  }

  /* ---------- buka / tutup ---------- */

  function bukaTutup(buka) {
    if (!elPemilih || !elTombol) { return; }
    if (buka) {
      /* Kategori bisa berubah sejak menu terakhir dibuka — dibaca ulang
         dulu, baru digambar. */
      segarkanKategori().then(function () {
        bangun();
        tandai();
      });
    }
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
    segarkanKategori().then(muat).then(function () {
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
    utama: function () { return utamaNyala; },
    saring: saring,
    semua: semua,
    terapkan: terapkan,
    bukaTutup: bukaTutup,
    /* Dipakai js/panduan.js untuk membuka menu lalu memilih satu baris. */
    segarkan: function () { bangun(); tandai(); }
  };

  mulai();
})();
