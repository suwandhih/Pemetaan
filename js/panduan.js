/* Pemetaan — panduan pemakaian di dalam aplikasi
   ------------------------------------------------------------------
   Satu tombol [?] di bilah atas. Saat diketuk, aplikasi melihat dulu
   pemakai sedang berada di mana, lalu menampilkan panduan yang cocok
   dengan tempat itu — bukan panduan umum yang panjang.

   Setiap panduan disusun dengan urutan yang sama:
     1. Untuk apa        — tujuan fitur, ditulis lebih dulu
     2. Cara pakai       — langkah bernomor, jelas harus klik apa
     3. Yang akan terjadi— akibat dari langkah itu (mis. peta terbang)
     4. Catatan          — hal yang perlu diketahui

   Di PC panduan muncul sebagai kolom di sisi kanan, sehingga form atau
   daftar di kiri tetap terlihat dan bisa langsung dicoba. Di HP panduan
   menutupi layar karena layarnya sempit.

   Di bawah panduan ada daftar fitur lain yang bisa diketuk, supaya
   pemakai bisa berpindah panduan tanpa menutup.

   Bahasa memakai "Anda" supaya bisa dipakai siapa saja, bukan hanya
   pemilik proyek.

   Dibuat: 2026-10-17
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  /* ---------- isi panduan ---------- */

  var PANDUAN = [
    {
      id: 'peta',
      judul: 'Peta & navigasi',
      untuk: 'Melihat Indonesia lewat citra satelit atau peta jalan, dan ' +
        'menjelajah dengan menggeser serta memperbesar peta.',
      langkah: [
        'Seret peta dengan satu jari (HP) atau tahan tombol kiri mouse lalu geser (PC).',
        'Cubit dua jari (HP) atau gulir roda mouse (PC) untuk memperbesar dan memperkecil.',
        'Ketuk tombol Satelit untuk berganti ke peta jalan. Ketuk sekali lagi untuk kembali ke citra satelit.',
        'Ketuk tombol \u25C0 atau \u25B6 di bilah bawah untuk menggeser peta ke kiri atau ke kanan.'
      ],
      hasil: [
        'Peta bergerak dan berubah ukuran sesuai perintah Anda.',
        'Nama tombol bergantian: Satelit \u21C4 Map.',
        'Angka di tengah bilah bawah menunjukkan posisi peta saat ini.'
      ],
      catatan: [
        'Di PC peta memenuhi tinggi layar. Indonesia memanjang ke samping, jadi kadang perlu digeser kiri-kanan.',
        'Di HP lebar peta dibatasi supaya tidak mengecil; sisa lebar layar bisa digeser kiri-kanan.'
      ]
    },
    {
      id: 'anggota',
      judul: 'Daftar anggota',
      untuk: 'Melihat, mengelompokkan, dan membuka data anggota yang sudah ' +
        'disimpan — misalnya yayasan, sekolah, atau rumah sakit.',
      langkah: [
        'Ketuk tombol Anggota untuk membuka daftar. Ketuk sekali lagi untuk menutupnya.',
        'Ketuk salah satu tombol tingkat (Provinsi, Kabupaten/Kota, Kecamatan, Desa/Kelurahan) untuk mengelompokkan daftar menurut tingkat itu.',
        'Ketuk satu anggota untuk membuka rinciannya di peta.',
        'Ketuk + Anggota untuk menambah anggota baru.',
        'Ketuk Kategori untuk menambah, mengubah, atau menghapus kategori.',
        'Ketuk tanda \u2715 di kanan atas untuk menutup daftar.'
      ],
      hasil: [
        'Peta terbang ke lokasi anggota yang diketuk, dan penandanya disorot.',
        'Daftar tersusun ulang menurut tingkat yang Anda pilih.'
      ],
      catatan: [
        'Data anggota tersimpan di database, jadi sama di PC maupun HP.',
        'Titik kecil di bawah kepala daftar menunjukkan keadaan sambungan: hijau berarti tersambung, kuning berarti sedang luring.',
        'Di PC daftar menjadi kolom di sisi kiri sehingga peta tetap terlihat.'
      ]
    },
    {
      id: 'form',
      judul: 'Tambah / ubah anggota',
      untuk: 'Menyimpan lokasi anggota baru, atau mengubah anggota yang sudah ' +
        'ada — lengkap dengan wilayah sampai desa/kelurahan dan titik lokasi ' +
        'yang tepat.',
      langkah: [
        'Isi Nama anggota.',
        'Pilih wilayah dari tingkat atas ke bawah: Provinsi, lalu Kabupaten/Kota, lalu Kecamatan, lalu Desa/Kelurahan.',
        'Perhatikan keterangan jumlah penduduk dan jumlah penduduk menurut agama yang muncul setelah wilayah dipilih.',
        'Tentukan titik lokasi: ketuk peta tepat di lokasi anggota, atau ketuk \u21BA Titik tengah wilayah untuk memakai titik tengah wilayah.',
        'Pilih Kategori, lalu isi Inisial penanda (1\u20133 huruf).',
        'Isi Keterangan, satu baris satu isi, dengan format: Nama = Isi.',
        'Ketuk Simpan. Ketuk Batal untuk membatalkan, atau Hapus untuk menghapus anggota.'
      ],
      hasil: [
        'Peta terbang ke wilayah yang Anda pilih setiap kali tingkat wilayah berubah.',
        'Wilayah yang dipilih diberi garis merah berkedip keliling areanya.',
        'Pin \uD83D\uDCCD muncul di titik yang Anda tentukan, dan bisa digeser dengan mengetuk peta di tempat lain.',
        'Setelah Simpan, penanda anggota langsung muncul di peta.'
      ],
      catatan: [
        'Di HP peta menempati 45% bagian atas dan form 55% bagian bawah, jadi peta tetap terlihat saat mengisi.',
        'Di PC form menjadi kolom di sisi kiri sehingga peta tetap terlihat penuh.',
        'Kalau wilayah sudah dikunci, yang bisa diubah hanya nama, kategori, inisial, dan keterangan.'
      ]
    },
    {
      id: 'kategori',
      judul: 'Kelola kategori',
      untuk: 'Mengatur kelompok anggota — misalnya Yayasan, Sekolah, Rumah ' +
        'Sakit — supaya daftar mudah disaring dan penandanya berwarna berbeda.',
      langkah: [
        'Ketuk Kategori di kepala daftar anggota.',
        'Ketik nama kategori baru, lalu ketuk + Tambah.',
        'Ketuk satu kategori untuk memilihnya.',
        'Ketuk Edit untuk mengubah namanya, atau Del untuk menghapusnya.',
        'Ketuk Kategori sekali lagi untuk kembali ke daftar anggota.'
      ],
      hasil: [
        'Kategori baru langsung tersedia di pilihan Kategori pada form anggota.',
        'Penanda anggota di peta memakai warna kategorinya.'
      ],
      catatan: [
        'Kategori yang masih dipakai anggota tidak bisa dihapus.',
        'Selama mode Kategori terbuka, daftar anggota disembunyikan supaya layar kerja bersih.'
      ]
    },
    {
      id: 'suku',
      judul: 'Peta suku bangsa',
      untuk: 'Melihat kawasan utama 28 kelompok suku bangsa Indonesia menurut ' +
        'BPS Sensus Penduduk 2010, beserta jumlah jiwanya.',
      langkah: [
        'Ketuk tombol Suku untuk membuka panel daftar suku.',
        'Ketuk satu suku pada daftar.',
        'Baca rincian yang muncul di bagian atas panel.',
        'Ketuk suku lain untuk berganti. Di PC panel tetap terbuka; di HP panel menutup supaya peta terlihat.',
        'Ketuk Matikan peta suku untuk mematikan, atau \u2715 untuk menutup panel.'
      ],
      hasil: [
        'Peta terbang ke kawasan utama suku yang Anda pilih.',
        'Seluruh provinsi di dalam kawasan itu diberi garis merah berkedip.',
        'Satu titik penanda ditaruh di titik tengah kawasan.',
        'Rincian menampilkan jumlah jiwa, persentase terhadap penduduk Indonesia, jumlah provinsi yang disorot, dan daftar kawasan utama.'
      ],
      catatan: [
        'Titik penanda dan garis wilayah adalah perkiraan. BPS tidak menerbitkan koordinat suku, jadi titik ditaruh di titik tengah kawasan utama.',
        'Suku yang bertanda "gabungan" adalah kelompok gabungan menurut BPS, bukan satu suku tunggal.',
        'Persentase dihitung dari penduduk Indonesia Sensus 2010, bukan dari jumlah 28 suku.'
      ]
    },
    {
      id: 'populasi',
      judul: 'Peta penduduk',
      untuk: 'Melihat sebaran jumlah penduduk atau kepadatan penduduk di empat ' +
        'tingkat wilayah, supaya terlihat wilayah mana yang padat dan mana ' +
        'yang jarang.',
      langkah: [
        'Ketuk tombol Populasi untuk membuka daftar.',
        'Ketuk salah satu tingkat: Provinsi, Kabupaten/Kota, Kecamatan, atau Desa/Kelurahan.',
        'Perhatikan keterangan warna yang muncul di kiri bawah peta.',
        'Ketuk satu wilayah di peta untuk melihat rinciannya.',
        'Ketuk Matikan peta penduduk untuk mematikan.'
      ],
      hasil: [
        'Peta diwarnai menurut jumlah penduduk wilayah itu.',
        'Keterangan warna muncul di kiri bawah, dan bisa ditutup dengan \u2715.',
        'Kartu rincian menampilkan jumlah penduduk, kepala keluarga, luas, kepadatan, dan kode wilayah.'
      ],
      catatan: [
        'Tingkat Kecamatan baru bisa dibuka setelah peta cukup dekat; Desa/Kelurahan butuh lebih dekat lagi.',
        'Wilayah yang datanya kosong diwarnai abu-abu, bukan dikarang.'
      ]
    },
    {
      id: 'agama',
      judul: 'Peta agama',
      untuk: 'Melihat sebaran penduduk menurut agama di empat tingkat wilayah, ' +
        'disajikan dalam persentase supaya tidak sekadar mengulang peta ' +
        'penduduk.',
      langkah: [
        'Ketuk tombol Agama untuk membuka daftar.',
        'Ketuk salah satu dari tujuh agama: Islam, Kristen, Katolik, Hindu, Budha, Konghucu, atau Kepercayaan.',
        'Ketuk tingkat wilayah: Provinsi, Kabupaten/Kota, Kecamatan, atau Desa/Kelurahan.',
        'Perhatikan keterangan warna yang muncul di kiri bawah peta.',
        'Ketuk satu wilayah di peta untuk melihat rincian tujuh agama.',
        'Ketuk Matikan peta agama untuk mematikan.'
      ],
      hasil: [
        'Peta diwarnai menurut persentase agama yang Anda pilih.',
        'Kartu rincian menampilkan jumlah jiwa dan persentase tiap agama, serta agama mayoritas wilayah itu.'
      ],
      catatan: [
        'Persentase dihitung dari jumlah penduduk wilayah, bukan dari jumlah tujuh agama.',
        'Konghucu dan Kepercayaan tetap disajikan dalam angka jumlah, sesuai permintaan.',
        'Tingkat Kecamatan dan Desa/Kelurahan butuh peta cukup dekat, sama seperti peta penduduk.'
      ]
    },
    {
      id: 'cari',
      judul: 'Cari',
      untuk: 'Mencari wilayah, anggota, atau nama jalan dengan cepat, tanpa ' +
        'harus menggeser peta sendiri.',
      langkah: [
        'Ketuk tombol \u2315 di kanan bilah atas.',
        'Ketik minimal tiga huruf. Hasil muncul di bawah kotak pencarian.',
        'Ketuk salah satu hasil.',
        'Ketuk \u2715 atau tekan tombol Esc untuk menutup.'
      ],
      hasil: [
        'Peta terbang ke tempat yang Anda pilih.',
        'Kalau hasilnya anggota, rincian anggota ikut terbuka.'
      ],
      catatan: [
        'Nama jalan diambil dari OpenStreetMap, jadi perlu sambungan internet.',
        'Pencarian nama jalan dibatasi satu permintaan per detik supaya tidak membebani layanan publik.'
      ]
    },
    {
      id: 'kartu',
      judul: 'Rincian wilayah',
      untuk: 'Melihat angka satu wilayah yang diketuk di peta.',
      langkah: [
        'Nyalakan peta Populasi atau peta Agama lebih dulu.',
        'Ketuk satu wilayah di peta.',
        'Baca kartu rincian yang muncul di kiri bawah.',
        'Ketuk \u2715 pada kartu untuk menutupnya.'
      ],
      hasil: [
        'Kartu menampilkan angka wilayah itu sesuai peta yang sedang menyala.'
      ],
      catatan: [
        'Kartu hanya muncul kalau peta Populasi atau peta Agama sedang menyala.',
        'Di PC kartu dibuat ringkas dan lebarnya dibatasi supaya tidak menutupi peta.'
      ]
    }
  ];

  /* ---------- unsur halaman ---------- */

  var elPanduan = document.getElementById('panduan');
  var elTombol = document.getElementById('tombol-panduan');
  var elIsi = document.getElementById('panduan-isi');
  var elDaftar = document.getElementById('panduan-daftar');
  var elJudul = document.getElementById('panduan-judul');

  var sedang = null;

  /* ---------- mengenali keadaan ---------- */

  function terlihat(id) {
    var el = document.getElementById(id);
    return !!(el && !el.hidden);
  }

  /* Urutan pemeriksaan penting: yang paling dalam diperiksa lebih dulu.
     #anggota-kategori-panel berada di dalam #panel-anggota, jadi harus
     diperiksa sebelum panelnya. */
  function keadaan() {
    if (terlihat('form-anggota')) { return 'form'; }
    if (terlihat('anggota-kategori-panel')) { return 'kategori'; }
    if (terlihat('panel-anggota')) { return 'anggota'; }
    if (terlihat('panel-suku')) { return 'suku'; }
    if (terlihat('pemilih-warna')) { return 'populasi'; }
    if (terlihat('pemilih-agama')) { return 'agama'; }
    if (terlihat('cari')) { return 'cari'; }
    if (terlihat('kartu')) { return 'kartu'; }
    return 'peta';
  }

  function cariPanduan(id) {
    for (var i = 0; i < PANDUAN.length; i++) {
      if (PANDUAN[i].id === id) { return PANDUAN[i]; }
    }
    return PANDUAN[0];
  }

  /* ---------- menggambar ---------- */

  function blok(judul, kelas, butir, jenis) {
    if (!butir || !butir.length) { return null; }
    var d = document.createElement('div');
    d.className = 'panduan-blok ' + kelas;

    var h = document.createElement('p');
    h.className = 'panduan-sub';
    h.textContent = judul;
    d.appendChild(h);

    if (jenis === 'teks') {
      var p = document.createElement('p');
      p.className = 'panduan-teks';
      p.textContent = butir;
      d.appendChild(p);
      return d;
    }

    var daftar = document.createElement(jenis === 'nomor' ? 'ol' : 'ul');
    daftar.className = jenis === 'nomor' ? 'panduan-langkah' : 'panduan-butir';
    for (var i = 0; i < butir.length; i++) {
      var li = document.createElement('li');
      li.textContent = butir[i];
      daftar.appendChild(li);
    }
    d.appendChild(daftar);
    return d;
  }

  function tampilkan(id) {
    if (!elIsi) { return; }
    var p = cariPanduan(id);
    sedang = p.id;

    if (elJudul) { elJudul.textContent = p.judul; }
    elIsi.innerHTML = '';

    var b1 = blok('Untuk apa', 'panduan-untuk', p.untuk, 'teks');
    if (b1) { elIsi.appendChild(b1); }

    var b2 = blok('Cara pakai', 'panduan-cara', p.langkah, 'nomor');
    if (b2) { elIsi.appendChild(b2); }

    var b3 = blok('Yang akan terjadi', 'panduan-hasil', p.hasil, 'butir');
    if (b3) { elIsi.appendChild(b3); }

    var b4 = blok('Catatan', 'panduan-catatan', p.catatan, 'butir');
    if (b4) { elIsi.appendChild(b4); }

    gambarDaftar(p.id);
    elIsi.scrollTop = 0;
  }

  function gambarDaftar(kecuali) {
    if (!elDaftar) { return; }
    elDaftar.innerHTML = '';
    for (var i = 0; i < PANDUAN.length; i++) {
      var p = PANDUAN[i];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'panduan-pilih';
      b.dataset.panduan = p.id;
      b.textContent = p.judul;
      if (p.id === kecuali) {
        b.classList.add('nyala');
        b.setAttribute('aria-current', 'true');
      }
      b.addEventListener('click', (function (id) {
        return function () { tampilkan(id); };
      })(p.id));
      elDaftar.appendChild(b);
    }
  }

  /* ---------- buka / tutup ---------- */

  function buka() {
    if (!elPanduan) { return; }
    tampilkan(keadaan());
    elPanduan.hidden = false;
    elPanduan.setAttribute('aria-hidden', 'false');
    if (elTombol) { elTombol.setAttribute('aria-expanded', 'true'); }
  }

  function tutup() {
    if (!elPanduan) { return; }
    elPanduan.hidden = true;
    elPanduan.setAttribute('aria-hidden', 'true');
    if (elTombol) { elTombol.setAttribute('aria-expanded', 'false'); }
  }

  function aktif() {
    return !!(elPanduan && !elPanduan.hidden);
  }

  /* ---------- mulai ---------- */

  function mulai() {
    if (!elPanduan || !elTombol) { return; }

    elTombol.addEventListener('click', function (e) {
      /* Jangan diteruskan ke pendengar klik di document — kalau diteruskan,
         daftar melayang yang sedang terbuka ikut tertutup. */
      e.stopPropagation();
      if (elPanduan.hidden) { buka(); } else { tutup(); }
    });

    /* Klik di dalam panduan tidak boleh menutup daftar atau panel lain
       yang sedang terbuka di belakangnya. */
    elPanduan.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    var tutupEl = document.getElementById('panduan-tutup');
    if (tutupEl) {
      tutupEl.addEventListener('click', function () { tutup(); });
    }

    /* Kalau pemakai membuka atau menutup fitur lain sementara panduan
       terbuka, panduan ikut menyesuaikan. Dipasang di fase tangkap supaya
       berjalan sebelum pengubah keadaan, lalu ditunda sebentar agar
       keadaannya sudah menetap. */
    document.addEventListener('click', function (e) {
      if (elPanduan.hidden) { return; }
      if (elPanduan.contains(e.target)) { return; }
      if (elTombol.contains(e.target)) { return; }
      setTimeout(function () {
        if (elPanduan.hidden) { return; }
        var k = keadaan();
        if (k !== sedang) { tampilkan(k); }
      }, 0);
    }, true);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !elPanduan.hidden) { tutup(); }
    });
  }

  window.PD_PANDUAN = {
    buka: buka,
    tutup: tutup,
    aktif: aktif,
    keadaan: keadaan,
    PANDUAN: PANDUAN
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    mulai();
  }
})();
