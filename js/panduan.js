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

   PANDUAN INTERAKTIF
   ------------------
   Di dalam kalimat panduan, kata kunci ditulis dengan tanda [[kata|aksi]].
   Saat digambar, tanda itu menjadi tautan yang bisa diketuk dan langsung
   memperagakan yang dimaksud — peta benar-benar bergerak, tombol benar-benar
   ditekan. Jadi pemakai tidak hanya membaca, tapi melihat sendiri caranya.

   Jenis aksi:
     seret / cubit          peta diperagakan bergerak atau membesar
     tekan:#id              tombol itu benar-benar ditekan
     sorot:#id              tombol / kolom itu dikedipkan (tidak ditekan)
     tingkat:provinsi       tombol tingkat di daftar anggota ditekan
     wilayah:provinsi       kolom pilihan wilayah di form dikedipkan
     populasi:provinsi      daftar Populasi dibuka, lalu tingkat itu dipilih
     agama:islam            daftar Agama dibuka, lalu agama itu dipilih
     agama-tingkat:provinsi daftar Agama dibuka, lalu tingkat itu dipilih

   Tombol yang mengubah data (Simpan, Hapus) sengaja hanya DIKEDIPKAN, tidak
   ditekan — supaya data anggota tidak tersimpan atau terhapus tanpa sengaja.

   Di PC panduan muncul sebagai kolom di sisi kanan, sehingga form atau
   daftar di kiri tetap terlihat dan bisa langsung dicoba. Di HP panduan
   menutupi layar karena layarnya sempit; saat tautan gerak peta diketuk,
   panduan menyingkir sebentar supaya peta terlihat, lalu kembali.

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
        'Seret peta dengan satu [[jari|seret]] (HP) atau tahan tombol [[kiri|seret]] mouse lalu geser (PC).',
        'Cubit [[dua|cubit]] jari (HP) atau gulir [[roda|cubit]] mouse (PC) untuk memperbesar dan memperkecil.',
        'Ketuk tombol [[Satelit|tekan:#tombol-jenis]] untuk berganti ke [[peta|tekan:#tombol-jenis]] jalan. Ketuk sekali lagi untuk kembali ke citra satelit.',
        'Ketuk tombol [[\u25C0|tekan:#geser-kiri]] atau [[\u25B6|tekan:#geser-kanan]] di bilah bawah untuk menggeser peta ke kiri atau ke kanan.'
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
        'Ketuk tombol [[Anggota|tekan:#tombol-anggota]] untuk membuka daftar. Ketuk sekali lagi untuk menutupnya.',
        'Ketuk salah satu tombol tingkat ([[Provinsi|tingkat:provinsi]], [[Kabupaten/Kota|tingkat:kabkota]], [[Kecamatan|tingkat:kecamatan]], [[Desa/Kelurahan|tingkat:desa]]) untuk mengelompokkan daftar menurut tingkat itu.',
        'Ketuk satu anggota untuk membuka rinciannya di peta.',
        'Ketuk [[+ Anggota|tekan:#anggota-tambah]] untuk menambah anggota baru.',
        'Ketuk [[Kategori|tekan:#anggota-kat-tombol]] untuk menambah, mengubah, atau menghapus kategori.',
        'Ketuk tanda [[\u2715|tekan:#anggota-tutup]] di kanan atas untuk menutup daftar.'
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
        'Isi [[Nama anggota|sorot:#fa-nama]].',
        'Pilih wilayah dari tingkat atas ke bawah: [[Provinsi|wilayah:provinsi]], lalu [[Kabupaten/Kota|wilayah:kabkota]], lalu [[Kecamatan|wilayah:kecamatan]], lalu [[Desa/Kelurahan|wilayah:desa]].',
        'Perhatikan keterangan jumlah penduduk dan jumlah penduduk menurut agama yang muncul setelah wilayah dipilih.',
        'Tentukan titik lokasi: ketuk peta tepat di lokasi anggota, atau ketuk [[\u21BA Titik tengah wilayah|tekan:#fa-pin-tengah]] untuk memakai titik tengah wilayah.',
        'Pilih [[Kategori|sorot:#fa-kategori]], lalu isi [[Inisial penanda|sorot:#fa-inisial]] (1\u20133 huruf).',
        'Isi [[Keterangan|sorot:#fa-rincian]], satu baris satu isi, dengan format: Nama = Isi.',
        'Ketuk [[Simpan|sorot:#fa-simpan]]. Ketuk [[Batal|sorot:#fa-batal]] untuk membatalkan, atau [[Hapus|sorot:#fa-hapus]] untuk menghapus anggota.'
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
        'Ketuk [[Kategori|tekan:#anggota-kat-tombol]] di kepala daftar anggota.',
        'Ketik nama kategori baru, lalu ketuk [[+ Tambah|sorot:#kat-tambah]].',
        'Ketuk satu kategori untuk memilihnya.',
        'Ketuk [[Edit|sorot:#kat-ubah]] untuk mengubah namanya, atau [[Del|sorot:#kat-hapus]] untuk menghapusnya.',
        'Ketuk [[Kategori|tekan:#anggota-kat-tombol]] sekali lagi untuk kembali ke daftar anggota.'
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
        'Ketuk tombol [[Suku|tekan:#tombol-suku]] untuk membuka panel daftar suku.',
        'Ketuk satu suku pada daftar.',
        'Baca rincian yang muncul di bagian atas panel.',
        'Ketuk suku lain untuk berganti. Di PC panel tetap terbuka; di HP panel menutup supaya peta terlihat.',
        'Ketuk [[Matikan peta suku|tekan:#suku-mati]] untuk mematikan, atau [[\u2715|tekan:#suku-tutup]] untuk menutup panel.'
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
        'Ketuk tombol [[Populasi|tekan:#tombol-warna]] untuk membuka daftar.',
        'Ketuk salah satu tingkat: [[Provinsi|populasi:provinsi]], [[Kabupaten/Kota|populasi:kabkota]], [[Kecamatan|populasi:kecamatan]], atau [[Desa/Kelurahan|populasi:desa]].',
        'Perhatikan keterangan warna yang muncul di kiri bawah peta.',
        'Ketuk satu wilayah di peta untuk melihat rinciannya.',
        'Ketuk [[Matikan peta penduduk|tekan:#tombol-warna]] untuk mematikan.'
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
        'Ketuk tombol [[Agama|tekan:#tombol-agama]] untuk membuka daftar.',
        'Ketuk salah satu dari tujuh agama: [[Islam|agama:islam]], [[Kristen|agama:kristen]], [[Katolik|agama:katholik]], [[Hindu|agama:hindu]], [[Budha|agama:budha]], [[Konghucu|agama:konghucu]], atau [[Kepercayaan|agama:kepercayaan]].',
        'Ketuk tingkat wilayah: [[Provinsi|agama-tingkat:provinsi]], [[Kabupaten/Kota|agama-tingkat:kabkota]], [[Kecamatan|agama-tingkat:kecamatan]], atau [[Desa/Kelurahan|agama-tingkat:desa]].',
        'Perhatikan keterangan warna yang muncul di kiri bawah peta.',
        'Ketuk satu wilayah di peta untuk melihat rincian tujuh agama.',
        'Ketuk [[Matikan peta agama|tekan:#agama-mati]] untuk mematikan.'
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
        'Ketuk tombol [[\u2315|tekan:#tombol-cari]] di kanan bilah atas.',
        'Ketik minimal tiga huruf. Hasil muncul di bawah kotak pencarian.',
        'Ketuk salah satu hasil.',
        'Ketuk [[\u2715|tekan:#cari-tutup]] atau tekan tombol Esc untuk menutup.'
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
        'Nyalakan peta [[Populasi|tekan:#tombol-warna]] atau peta [[Agama|tekan:#tombol-agama]] lebih dulu.',
        'Ketuk satu wilayah di peta.',
        'Baca kartu rincian yang muncul di kiri bawah.',
        'Ketuk [[\u2715|tekan:#kartu-tutup]] pada kartu untuk menutupnya.'
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
  var jamSingkir = null;
  var jamKunci = 0;

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

  function lebarPC() {
    return window.matchMedia('(min-width: 900px)').matches;
  }

  /* ---------- tautan di dalam kalimat ---------- */

  /* Tanda [[kata|aksi]] diurai menjadi potongan teks dan tautan. */
  var POLA = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;

  function urai(teks) {
    var bagian = [];
    var pos = 0;
    var m;
    POLA.lastIndex = 0;
    while ((m = POLA.exec(teks)) !== null) {
      if (m.index > pos) { bagian.push({ teks: teks.slice(pos, m.index) }); }
      bagian.push({ label: m[1], aksi: m[2] });
      pos = m.index + m[0].length;
    }
    if (pos < teks.length) { bagian.push({ teks: teks.slice(pos) }); }
    return bagian;
  }

  function tulis(el, teks) {
    var bagian = urai(teks);
    for (var i = 0; i < bagian.length; i++) {
      var b = bagian[i];
      if (b.teks !== undefined) {
        el.appendChild(document.createTextNode(b.teks));
        continue;
      }
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'panduan-tautan';
      t.dataset.aksi = b.aksi;
      t.textContent = b.label;
      t.title = 'Ketuk untuk mencoba';
      t.addEventListener('click', (function (aksi, tombol) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();
          jalankan(aksi, tombol);
        };
      })(b.aksi, t));
      el.appendChild(t);
    }
  }

  /* ---------- menjalankan aksi ---------- */

  /* Di HP panduan menutupi seluruh layar, jadi saat tautan gerak peta
     diketuk panduan menyingkir sebentar supaya peta terlihat bergerak,
     lalu kembali sendiri. Di PC peta sudah terlihat, jadi tidak perlu. */
  function singkir(ms) {
    if (lebarPC() || !elPanduan || elPanduan.hidden) { return; }
    elPanduan.classList.add('panduan-singkir');
    if (jamSingkir) { clearTimeout(jamSingkir); }
    jamSingkir = setTimeout(function () {
      jamSingkir = null;
      if (elPanduan) { elPanduan.classList.remove('panduan-singkir'); }
    }, ms || 1800);
  }

  function kilat(tombol) {
    if (!tombol) { return; }
    tombol.classList.add('panduan-tautan-mati');
    setTimeout(function () { tombol.classList.remove('panduan-tautan-mati'); }, 900);
  }

  function bisaDitekan(el) {
    return !!(el && !el.hidden && el.getClientRects().length > 0);
  }

  function gerakPeta(jenis) {
    var peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : null;
    if (!peta) { return; }
    singkir(1900);

    if (jenis === 'seret') {
      peta.panBy([-150, 0], { duration: 700 });
      setTimeout(function () { peta.panBy([150, 0], { duration: 700 }); }, 820);
      return;
    }

    var z = peta.getZoom();
    peta.easeTo({ zoom: z + 1, duration: 700 });
    setTimeout(function () { peta.easeTo({ zoom: z, duration: 700 }); }, 820);
  }

  function tekan(sel, tombol) {
    var el = document.querySelector(sel);
    if (!bisaDitekan(el)) { kilat(tombol); return; }
    /* Di HP panduan menutupi layar — ditutup dulu supaya hasilnya terlihat.
       Di PC panduan hanya kolom kanan, jadi tetap terbuka. */
    if (!lebarPC()) { tutup(); }
    el.click();
    /* Tombol yang ditekan bisa mengubah keadaan (mis. + Anggota membuka
       form, ✕ menutup daftar). Panduan ikut menyesuaikan supaya tetap
       sesuai tempat pemakai berada. */
    setTimeout(periksaUlang, 140);
  }

  function periksaUlang() {
    if (!elPanduan || elPanduan.hidden) { return; }
    if (Date.now() < jamKunci) { return; }
    var k = keadaan();
    if (k !== sedang) { tampilkan(k); }
  }

  function sorot(sel, tombol) {
    var el = document.querySelector(sel);
    if (!bisaDitekan(el)) { kilat(tombol); return; }
    singkir(1900);
    el.classList.add('panduan-sorot');
    setTimeout(function () { el.classList.remove('panduan-sorot'); }, 1750);
  }

  /* Membuka daftar melayang (Populasi / Agama) lalu memilih satu butir.
     Daftar Populasi punya perilaku klik-pilih/klik-mati, jadi kadang perlu
     dua kali ketuk sebelum daftarnya benar-benar terbuka. */
  function bukaDaftar(idTombol, idDaftar, sel, tombol) {
    var daftar = document.getElementById(idDaftar);
    var tb = document.getElementById(idTombol);
    if (!daftar || !tb) { kilat(tombol); return; }

    /* Panduan tidak boleh berpindah sendiri selama aksi ini berjalan —
       daftar terbuka lalu tertutup lagi, dan itu akan membuat panduan
       melompat ke panduan lain. */
    jamKunci = Date.now() + 1600;

    if (!lebarPC()) { tutup(); }

    function pilih() {
      var b = document.querySelector(sel);
      if (bisaDitekan(b)) { b.click(); } else { kilat(tombol); }
    }

    if (!daftar.hidden) { pilih(); return; }

    tb.click();
    setTimeout(function () {
      var d = document.getElementById(idDaftar);
      if (d && d.hidden) { tb.click(); }
      setTimeout(pilih, 90);
    }, 90);
  }

  function jalankan(aksi, tombol) {
    var pisah = aksi.indexOf(':');
    var nama = pisah < 0 ? aksi : aksi.slice(0, pisah);
    var arg = pisah < 0 ? '' : aksi.slice(pisah + 1);

    if (nama === 'seret' || nama === 'cubit') { gerakPeta(nama); return; }
    if (nama === 'tekan') { tekan(arg, tombol); return; }
    if (nama === 'sorot') { sorot(arg, tombol); return; }
    if (nama === 'tingkat') {
      tekan('.anggota-tingkat-tombol[data-kelompok="' + arg + '"]', tombol);
      return;
    }
    if (nama === 'wilayah') {
      sorot('#fa-tingkat-wilayah [data-tingkat="' + arg + '"]', tombol);
      return;
    }
    if (nama === 'populasi') {
      bukaDaftar('tombol-warna', 'pemilih-warna',
        '.pilihan-warna[data-warna="' + arg + '"]', tombol);
      return;
    }
    if (nama === 'agama') {
      bukaDaftar('tombol-agama', 'pemilih-agama',
        '.agama-chip[data-agama="' + arg + '"]', tombol);
      return;
    }
    if (nama === 'agama-tingkat') {
      bukaDaftar('tombol-agama', 'pemilih-agama',
        '[data-agama-tingkat="' + arg + '"]', tombol);
    }
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
      tulis(p, butir);
      d.appendChild(p);
      return d;
    }

    var daftar = document.createElement(jenis === 'nomor' ? 'ol' : 'ul');
    daftar.className = jenis === 'nomor' ? 'panduan-langkah' : 'panduan-butir';
    for (var i = 0; i < butir.length; i++) {
      var li = document.createElement('li');
      tulis(li, butir[i]);
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
    if (jamSingkir) { clearTimeout(jamSingkir); jamSingkir = null; }
    elPanduan.classList.remove('panduan-singkir');
    tampilkan(keadaan());
    elPanduan.hidden = false;
    elPanduan.setAttribute('aria-hidden', 'false');
    if (elTombol) { elTombol.setAttribute('aria-expanded', 'true'); }
  }

  function tutup() {
    if (!elPanduan) { return; }
    if (jamSingkir) { clearTimeout(jamSingkir); jamSingkir = null; }
    elPanduan.classList.remove('panduan-singkir');
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

    /* Kalau pemakai membuka atau menutup fitur terbuka, panduan ikut
       menyesuaikan. Dipasang di fase tangkap supaya berjalan sebelum
       pengubah keadaan, lalu ditunda sebentar agar keadaannya sudah
       menetap. */
    document.addEventListener('click', function (e) {
      if (elPanduan.hidden) { return; }
      if (elPanduan.contains(e.target)) { return; }
      if (elTombol.contains(e.target)) { return; }
      if (Date.now() < jamKunci) { return; }
      setTimeout(function () {
        if (elPanduan.hidden) { return; }
        if (Date.now() < jamKunci) { return; }
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
