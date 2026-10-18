/* Pemetaan — icon penanda anggota
   ------------------------------------------------------------------
   TUGAS
     Menyediakan icon gambar untuk bulatan penanda di peta, menggantikan
     tulisan 2–3 huruf. Icon dipilih menurut kategori anggota.

   KENAPA GAMBAR, BUKAN HURUF
     Huruf 2–3 karakter sulit dibedakan saat penanda berdekatan. Icon
     bentuk langsung terbaca: orang, rantai, kamera, tombol putar, ponsel.

   CARA PASANG
     MapLibre menyimpan gambar di dalam gaya peta. Gambar HILANG setiap
     kali gaya peta diganti (tombol Satelit/Map), jadi harus dipasang
     ulang — lihat pasangUlang() yang dipanggil dari js/member.js.

   UKURAN
     Digambar 64×64 lalu ditampilkan 15 px. Digambar besar supaya tetap
     tajam di layar berkerapatan tinggi (HP).
*/

(function () {
  'use strict';

  var WARNA = '#0b0f14';

  function svg(isi) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' +
      'width="64" height="64" fill="' + WARNA + '">' + isi + '</svg>';
  }

  function garis(d) {
    return '<path d="' + d + '" fill="none" stroke="' + WARNA +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  /* ---------- kumpulan icon ---------- */

  var DAFTAR = {
    /* Lima kategori tokomedia.org — bentuknya mengikuti gambar acuan
       pemilik proyek. */
    'ikon-orang': svg(
      '<circle cx="12" cy="7.5" r="4"/>' +
      '<path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z"/>'
    ),
    'ikon-rantai': svg(
      garis('M10.5 13.5a4.5 4.5 0 0 0 6.4.4l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1.5 1.5') +
      garis('M13.5 10.5a4.5 4.5 0 0 0-6.4-.4l-2.6 2.6a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5')
    ),
    'ikon-kamera': svg(
      '<rect x="2" y="6" width="13" height="12" rx="2.5"/>' +
      '<path d="M15 10.5l6.5-3.2v9.4L15 13.5z"/>'
    ),
    'ikon-putar': svg('<path d="M6.5 3.5l14 8.5-14 8.5z"/>'),
    'ikon-ponsel': svg(
      garis('M7.5 2.5h9a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V4a1.5 1.5 0 0 1 1.5-1.5z') +
      garis('M10.5 18.5h3')
    ),

    /* Pilihan tambahan — dipakai bila pemilik proyek ingin menandai
       anggota dengan bentuk lain. */
    'ikon-buku': svg(
      '<path d="M3.5 4.5h6.5a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H3.5z"/>' +
      '<path d="M20.5 4.5H14a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6.5z"/>'
    ),
    'ikon-audio': svg(
      '<path d="M3.5 9.5v5h3.5l5 4v-13l-5 4z"/>' +
      garis('M16.5 8.5a5 5 0 0 1 0 7') +
      garis('M19 6a8.5 8.5 0 0 1 0 12')
    ),
    'ikon-globe': svg(
      garis('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z') +
      garis('M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z') +
      garis('M3.2 12h17.6')
    ),
    'ikon-bintang': svg(
      '<path d="M12 2.5l2.9 6.2 6.8 1-4.9 4.8 1.2 6.8L12 18.1l-6 3.2 1.2-6.8-4.9-4.8 6.8-1z"/>'
    ),
    'ikon-pin': svg(
      '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7z"/>' +
      '<circle cx="12" cy="9" r="2.6" fill="#f2f7fc"/>'
    ),
    'ikon-rumah': svg(
      '<path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z"/>'
    ),
    'ikon-sekolah': svg(
      '<path d="M12 2.5l9 4.5-9 4.5-9-4.5z"/>' +
      '<path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5l-6 3z"/>'
    ),
    'ikon-kesehatan': svg(
      '<path d="M9.5 2.5h5v7h7v5h-7v7h-5v-7h-7v-5h7z"/>'
    ),
    'ikon-sosial': svg(
      '<circle cx="8.5" cy="8" r="3.2"/>' +
      '<circle cx="16" cy="9.5" r="2.6"/>' +
      '<path d="M2.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6z"/>' +
      '<path d="M14.5 20c0-2.6 1.6-4.8 3.9-5.6 1.9.6 3.1 2.4 3.1 4.4v1.2z"/>'
    )
  };

  /* ---------- kategori -> icon ---------- */

  /* Nama kategori tokomedia.org dipetakan langsung. Kategori lain
     (buatan pemilik proyek) memakai icon bawaan menurut namanya. */
  var KATEGORI = {
    'Film Isa Al-Masih': 'ikon-orang',
    'Film Ikatan Ilahi': 'ikon-rantai',
    'Video Kitab Suci': 'ikon-kamera',
    'Clip Kitab Suci': 'ikon-putar',
    'Aplikasi Kitab Suci': 'ikon-ponsel',
    'Yayasan': 'ikon-sosial',
    'Sekolah': 'ikon-sekolah',
    'Kesehatan': 'ikon-kesehatan',
    'Sosial': 'ikon-sosial',
    'Pemerintahan': 'ikon-rumah',
    'Lainnya': 'ikon-pin'
  };

  function untukKategori(nama) {
    if (!nama) { return 'ikon-pin'; }
    if (KATEGORI[nama]) { return KATEGORI[nama]; }
    /* Kategori buatan sendiri — pilih icon tetap supaya tidak kosong. */
    var n = 0;
    for (var i = 0; i < nama.length; i++) { n = (n * 31 + nama.charCodeAt(i)) % 9973; }
    var cadangan = ['ikon-pin', 'ikon-bintang', 'ikon-globe', 'ikon-rumah'];
    return cadangan[n % cadangan.length];
  }

  /* ---------- pasang ke peta ---------- */

  function pasangSatu(peta, id, selesai) {    if (peta.hasImage(id)) { selesai(); return; }
    var gambar = new Image(64, 64);
    gambar.onload = function () {
      try {
        if (!peta.hasImage(id)) { peta.addImage(id, gambar); }
      } catch (e) { /* diabaikan — icon hilang lebih baik daripada peta mati */ }
      selesai();
    };
    gambar.onerror = function () { selesai(); };
    gambar.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(DAFTAR[id]);
  }

  /* Dipanggil setiap kali gaya peta siap (termasuk setelah ganti jenis
     peta). `selesai` dijalankan setelah semua icon masuk. */
  function pasang(peta, selesai) {
    if (!peta) { if (selesai) { selesai(); } return; }
    var kunci = Object.keys(DAFTAR);
    var sisa = kunci.length;
    if (!sisa) { if (selesai) { selesai(); } return; }
    kunci.forEach(function (id) {
      pasangSatu(peta, id, function () {
        sisa -= 1;
        if (sisa === 0) { if (selesai) { selesai(); } }
      });
    });
  }

  window.PD_IKON = {
    DAFTAR: DAFTAR,
    KATEGORI: KATEGORI,
    untukKategori: untukKategori,
    pasang: pasang,
    /* Diperiksa ulang setiap kali penanda digambar — gambar hilang saat
       gaya peta diganti, dan objek petanya tetap sama. */
    lengkap: function (peta) {
      if (!peta) { return false; }
      var kunci = Object.keys(DAFTAR);
      for (var i = 0; i < kunci.length; i++) {
        if (!peta.hasImage(kunci[i])) { return false; }
      }
      return true;
    }
  };
})();
