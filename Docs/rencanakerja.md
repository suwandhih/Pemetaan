# Rencana Kerja

Daftar induk seluruh orderan. Lihat aturan mainnya di [agents.md](./agents.md).
Aturan pengelolaan:
* Orderan dikerjakan satu per satu (aturan 6).
* Status `SELESAI` hanya sah bila dinyatakan pemilik proyek, disertai tanggal
  penyelesaian (aturan 7).
* Usulan dari asisten ditulis di bagian bawah dan **tidak diproses** tanpa izin
  (aturan 2).

> ## 🏁 PROYEK DINYATAKAN SELESAI — 2026-10-17
>
> Pemilik proyek menyatakan **proyek Pemetaan selesai** pada 2026-10-17.
> Seluruh **22 orderan** berstatus `SELESAI`.
>
> Setelah itu pemilik proyek menambah **5 orderan baru** (23–27) pada
> 2026-10-18 dan 2026-10-22. Keadaan terkini:
>
> | Ringkasan | Jumlah |
> |---|---|
> | Orderan selesai | **27** |
> | Commit | 72 |
> | Berkas data | 1.110 (81,4 MB) |
> | Modul JavaScript | 12 (270 KB) |
> | Rentang waktu | 2026-10-12 → 2026-10-22 |
>
> **Situs live:** https://suwandhih.github.io/Pemetaan/
> **Repo:** https://github.com/suwandhih/Pemetaan
>
> Dokumen proyek: [agents.md](./agents.md) (aturan) ·
> [rencanakerja.md](./rencanakerja.md) (berkas ini) ·
> [prompt.md](./prompt.md) (konsep) ·
> [CHANGELOG.md](./CHANGELOG.md) (riwayat)

---

## Daftar Orderan

Dicatat 2026-10-12. Dikerjakan **satu per satu** (aturan 6), tidak sekaligus.

| No | Orderan | Status | Estimasi | Tanggal Selesai |
|----|---------|--------|----------|-----------------|
| 1 | Konsep aplikasi: berjalan di Chrome Android; kode di-push ke GitHub; data memakai database Neon; berjalan juga di Chrome PC dengan lebar 50% (simulasi ukuran HP) | **SELESAI** | 30–45 mnt | 2026-10-17 |
| 2 | UI HP berdiri (portrait); penampakan peta bisa di-scroll kiri-kanan; peta Sumatera–Jawa muat dari atas ke bawah | **SELESAI** | 30–45 mnt | 2026-10-17 |
| 3 | Peta menjadi utama sehingga harus tetap/freeze; input data tambahan dan panel lain memakai hide/unhide | **SELESAI** | 40–60 mnt | 2026-10-17 |
| 4 | UI peta memakai citra satelit; harus terlihat gunung, danau, sungai, rumah, jalan, dan nama jalan | **SELESAI** | 45–60 mnt | 2026-10-17 |
| 5 | Detail peta setara `suwandhih.github.io/petadunia/app/index.html`; citra satelit memakai versi terbaru (data lama sudah banyak berubah, hampir tidak bisa dipakai) | **SELESAI** — sudah terpenuhi, terverifikasi | 10 mnt | 2026-10-17 |
| 6 | Tahap awal: peta dan tampilan sudah bisa diakses di PC maupun HP; konsep dasar UI, penempatan data, dan isian data | **SELESAI** | 90–150 mnt | 2026-10-17 |
| 7 | Setelan database: aktifkan Neon Data API, buat tabel, pasang RLS, sambungkan aplikasi ke database | **SELESAI** ✅ — data sama di PC dan HP lewat Worker `pemetaan-api` (bukan Data API, sebab Data API mewajibkan pendaftaran akun publik) · rincian di bawah | 60–90 mnt | 2026-10-16 |
| 8 | Setelan GitHub: siapkan repo, cabang, GitHub Pages, dan cara unggah perubahan | **SELESAI** ✅ — repo + remote + push ✅ · **GitHub Pages ✅ aktif** | 30–45 mnt | 2026-10-16 |
| 9 | `aturan.md` diganti nama menjadi **`agents.md`** — berisi aturan + catatan agar asisten diingatkan setiap mulai proyek | **SELESAI** ✅ | 5 mnt | 2026-10-16 |
| 10 | Pastikan `rencanakerja.md` berfungsi sebagai **daftar orderan**: yang belum selesai dan yang sudah selesai | **SELESAI** ✅ | 5 mnt | 2026-10-17 |
| 11 | Buat **`prompt.md`** — konsep proyek, supaya AI lain dapat membuat ulang **persis sama** | **SELESAI** ✅ — `Docs/prompt.md` (22,8 KB, 13 bagian) | 30–45 mnt | 2026-10-17 |
| 12 | Buat **`CHANGELOG.md`** — catatan semua perkembangan, perbaikan, dan hal baru | **SELESAI** ✅ — `Docs/CHANGELOG.md` (riwayat lengkap, terbaru di atas) | 15–20 mnt | 2026-10-17 |
| 13 | Jawab & siapkan: apakah GitHub sudah siap kerja untuk proyek pemetaan | **SELESAI** ✅ — repo publik + Pages aktif + push berjalan | 20–30 mnt | 2026-10-16 |
| 14 | **Peta Indonesia + negara tetangga** — fokus Indonesia, tetangga tetap tampil supaya tidak kosong; beberapa pulau Indonesia berbatasan langsung dengan negara lain | **SELESAI** ✅ | 45–60 mnt | 2026-10-16 |
| 15 | **Fitur citra satelit atau peta** — peta memakai citra satelit, tetapi bisa juga dalam bentuk peta (contoh acuan: `petadunia`) | **SELESAI** ✅ — 2 pilihan, satu tombol bergantian | 30–45 mnt | 2026-10-16 |
| 16 | **Data jumlah penduduk berjenjang** — provinsi → kabupaten/kota → kecamatan → desa/kelurahan, disajikan seperti `DataPeta`; sumber Dukcapil Kemendagri | **SELESAI** ✅ — 38 / 514 / 7.285 / 83.489 wilayah | 90–150 mnt | 2026-10-16 |
| 17 | **User input data anggota** — tambah/ubah/hapus data per lokasi; pengelompokan bisa per desa, kecamatan, kabupaten, atau provinsi; konsep diambil dari `DataPeta` lalu disesuaikan | **SELESAI** ✅ | 90–120 mnt | 2026-10-16 |
| 18 | **Form Tambah Anggota + Peta interaktif di bawah form** — saat pilih provinsi peta otomatis fokus ke provinsi; pilih kab/kota fokus lebih dalam ke kab/kota; pilih kecamatan fokus ke kecamatan; pilih desa/kelurahan fokus ke desa/kelurahan | **SELESAI** ✅ — termasuk pin lokasi, garis merah berkedip, tombol peta bergantian | 30–45 mnt | 2026-10-17 |
| 19 | **Fitur Cari `[⌕]`** — pencarian lokasi/wilayah atau nama anggota/yayasan | **SELESAI** ✅ — wilayah, anggota, dan nama jalan | 30–45 mnt | 2026-10-17 |
| 20 | **Titik lokasi suku-suku** — data dari `c:\data\datapeta` dipelajari & **diolah ulang**, disajikan menurut konsep Pemetaan (bukan meniru cara saji DataPeta) | **SELESAI** ✅ — 28 suku BPS SP2010, panel seperti panel Anggota | 60–90 mnt | 2026-10-17 |
| 21 | **Jumlah beragama berjenjang** — provinsi → kabupaten/kota → kecamatan → desa/kelurahan; data dari `c:\data\datapeta` dipelajari, **angka diolah & disajikan** menurut konsep Pemetaan | **SELESAI** ✅ — 7 agama, disajikan dalam persentase | 90–120 mnt | 2026-10-17 |
| 22 | **Ralat orderan 14d — tampilan PC lebar (responsive)**: PC lebar penuh, peta **memenuhi tinggi layar tanpa ruang kosong**; HP tetap seperti sekarang (bila layar HP lebih lebar, peta ikut lebih lebar, tidak mengecil; tidak muat → geser kiri-kanan) | **SELESAI** ✅ | 45–60 mnt | 2026-10-17 |
| 23 | **Data anggota dari tokomedia.org** — 5 kategori (Film Isa Al-Masih, Film Ikatan Ilahi, Video Kitab Suci, Clip Kitab Suci, Aplikasi Kitab Suci), masing-masing berisi bahasa daerah. Data lama dihapus termasuk kategori. Tombol **[↻ Update]** menarik data terbaru dari tokomedia.org lewat Worker, **selalu disertai koordinat**. Icon kategori menggantikan 2 digit di bulatan peta. Penggabungan penanda (cluster) **dihapus** atas permintaan pemilik proyek — 699 penanda tampil satu per satu | **SELESAI** ✅ — 699 anggota masuk database, 5 kategori baru, 699 titik unik, 7 lapisan penanda, icon tepat di dalam bulatan. Datanya kemudian **dihapus atas perintah pemilik proyek** (orderan 1–3, 2026-10-22); backup tersimpan | 100–140 mnt | 2026-10-18 |
| 24 | **Menu "Media on/off"** — tombol mata (👁) dihapus, diganti menu yang bisa memilih kelompok data mana yang tampil di peta. Bilah atas menjadi **ikon saja** supaya 8 tombol muat di HP | **SELESAI** ✅ — `js/media.js` baru, keadaan disimpan di database, 2 bagian panduan baru | 60–90 mnt | 2026-10-22 |
| 25 | **Seluruh kategori bisa dihidupkan / dimatikan** — bukan hanya kategori yang sedang dipakai anggota | **SELESAI** ✅ — daftar digabung dari kategori terpakai + daftar kategori resmi, dibaca ulang setiap menu dibuka | 20–30 mnt | 2026-10-22 |
| 26 | **Jangkar & label media per provinsi** — setiap provinsi yang punya data media harus jelas media apa saja isinya, memakai jangkar + label | **SELESAI** ✅ — `js/label.js` baru, 1 jangkar + 1 label per provinsi, label mengikuti menu Media on/off, ketuk → garis merah provinsi | 90–120 mnt | 2026-10-22 |
| 27 | **Pemetaan memakai 2 server** — Neon untuk data anggota (baca/tulis), Rumahweb untuk data media TokoMedia (**baca saja**). Dibuat jembatan tambahan `pemetaan-bridge.php` di cPanel; `tm-bridge.php` milik TokoMedia **tidak disentuh**. Tombol [↻ Update] beralih memakai API TokoMedia, bukan lagi membaca halaman tokomedia.org | **SELESAI** ✅ — 300 anggota dari 5 kelompok media, 35 provinsi berlabel, 0 gagal. Token API tetap di sisi server | 120–180 mnt | 2026-10-22 |
| 28 | **Perbaiki penempatan seluruh media di daratan provinsi yang benar** — cocokkan bahasa pada Film Isa Al-Masih, Film Ikatan Ilahi, Video Kitab Suci, Clip Kitab Suci, dan Aplikasi Kitab Suci ke provinsi yang sesuai; pastikan titik anggota dan label berada di daratan provinsi, tidak di laut | **SELESAI** ✅ — atas keputusan pemilik proyek 2026-10-23; Worker terpasang; 304 record diperbarui; 0 titik berkoordinat provinsi keluar poligon; 6 data tanpa pemetaan disimpan tanpa titik agar tidak mengarang lokasi | 60–120 mnt | 2026-10-23 |
| 29 | **Dashboard laporan cakupan layanan Indonesia** — report manajemen berbasis teks dan visual tentang jumlah media per gugus pulau/provinsi, wilayah/bahasa yang belum ada media, serta sebaran data anggota yang dimasukkan pengguna (yayasan, sekolah, dan kategori lain). Sertakan analisis indikatif suku dari irisan kawasan utama BPS SP2010 dengan provinsi yang memiliki media; beri peringatan jelas bahwa ini indikasi cakupan wilayah, bukan bukti suku/individu telah menerima layanan. Desain responsif, mudah dibaca, detail, terinspirasi galeri dashboard/data-visualization Awwwards tanpa menyalin desain tertentu | **MENUNGGU KONFIRMASI** — dipublikasikan, situs live terverifikasi; jeda atas permintaan pemilik proyek 2026-10-23, lanjut besok | 3–5 jam | — |
| 30 | **Revisi Media on/off** — ganti tombol [Semua hidup] dan [Semua mati] dengan satu tombol utama On/Off. Off menyembunyikan semua media sementara tanpa menghapus pilihan kategori pengguna; On memulihkan hanya kategori yang dipilih. Pilihan kategori tetap dapat diubah saat Off dan berlaku setelah On. Perintah dan persetujuan pengerjaan 2026-10-24. | **MENUNGGU KONFIRMASI** — implementasi dan verifikasi lokal selesai 2026-10-24; 24 pemeriksaan utama browser lulus, termasuk Off → ubah pilihan → reload → On; klik nyata dan ganti Satelit/Map juga lulus; 0 galat runtime aplikasi | 60–90 mnt | — |
| 31 | **`datapemetaan.html` — cermin seluruh data Pemetaan, dibangun bertahap** — laporan interaktif, data terbuka saat diklik, bukan satu halaman raksasa yang menampilkan semuanya sekaligus. **Tahap 1 (disepakati 2026-10-24):** ringkasan Indonesia dan 38 provinsi; jumlah serta daftar kabupaten/kota, kecamatan, desa/kelurahan; penduduk; tujuh agama/kepercayaan dalam jumlah dan persentase; bahasa per provinsi dari katalog 430 bahasa; 28 kelompok suku/kelompok gabungan BPS SP2010 beserta kawasan utama dan penjelasan batas datanya; total masing-masing dari 5 jenis media beserta judul/nama bahasa; perbandingan bahasa provinsi dengan media yang sudah/belum tersedia. Entri media tanpa provinsi ditampilkan terpisah, tidak ditebak. Tahap selanjutnya membuka rincian kabupaten/kota → kecamatan → desa/kelurahan. Pembaruan media mengikuti API; pembaruan Dukcapil dilakukan melalui tindakan manual yang juga memperbarui seluruh turunan laporan, dengan tanggal/sumber data ditampilkan—bukan mengunduh seluruh Dukcapil setiap halaman dibuka. Total agama berarti jumlah penduduk per kategori, bukan menjumlahkan semua agama; suku bukan daftar seluruh suku atau tempat tinggal individu. | **DIKERJAKAN** — tahap 1 dimulai 2026-10-24 atas perintah pemilik proyek | 4–6 jam (tahap 1) | — |

### Orderan di luar daftar bernomor (perintah langsung pemilik proyek)

| Orderan | Status | Tanggal Selesai |
|---|---|---|
| **Panduan pemakaian di dalam aplikasi** — tombol `?` yang mengenali posisi pemakai, 9 panduan, urutan Untuk apa → Cara pakai → Yang akan terjadi → Catatan | **SELESAI** ✅ | 2026-10-17 |
| **Panduan pemakaian interaktif** — kata kunci dalam kalimat panduan menjadi tautan yang benar-benar menjalankan aksinya (peta bergerak, tombol ditekan) | **SELESAI** ✅ | 2026-10-17 |
| **Revisi panel Suku** — daftar suku diubah dari kotak melayang menjadi panel seperti panel Anggota | **SELESAI** ✅ | 2026-10-17 |
| **Revisi bilah atas** — `[Anggota][👁]` dipindah ke paling kiri | **SELESAI** ✅ | 2026-10-17 |
| **Perbaikan popup "Save password?" Chrome** | **SELESAI** ✅ | 2026-10-17 |
| **Perbaikan cari desa/kecamatan** yang poligonnya belum dimuat | **SELESAI** ✅ | 2026-10-17 |
| **Pemulihan data (orderan 1–3, 2026-10-22)** — data kategori dihapus setelah di-backup; kategori lama (Yayasan, Sekolah, Rumah Sakit/Kesehatan, dll.) dipulihkan ke data anggota | **SELESAI** ✅ | 2026-10-22 |
| **Bilah atas ikon saja** — `[Anggota][👁][Satelit][Populasi][Agama][Suku][⌕][?]` diganti ikon supaya 8 tombol muat di layar HP; keterangan ikon masuk panduan | **SELESAI** ✅ | 2026-10-22 |
| **Panduan ikon bilah atas** — bagian panduan baru yang menjelaskan arti setiap ikon | **SELESAI** ✅ | 2026-10-22 |
| **Panduan label media** — bagian panduan baru yang menjelaskan jangkar & label media di peta | **SELESAI** ✅ | 2026-10-22 |
| **Panduan perbarui data media** — bagian panduan baru yang menjelaskan tombol [↻ Update] dan sifat baca-saja-nya | **SELESAI** ✅ | 2026-10-22 |
| **Jembatan Rumahweb untuk Pemetaan** — `pemetaan-bridge.php` di cPanel, terpisah dari `tm-bridge.php`; hanya endpoint baca, wajib kunci di header | **SELESAI** ✅ | 2026-10-22 |


### Rincian Orderan 14 (perintah 2026-10-16)

| Butir | Isi | Status |
|---|---|---|
| 14a | Peta Indonesia sebagai **fokus utama**; negara tetangga **tetap tampil** supaya terlihat nyata, bukan kosong | ✅ |
| 14b | Pulau Indonesia yang **berbatasan langsung** dengan negara lain (Kalimantan–Malaysia, Papua–PNG, Timor, dll.) harus tampak menyatu, tidak terpotong | ✅ |
| 14c | **Letak peta di HP tegak (portrait)** | ✅ |
| 14d | ~~**Di PC lebarnya sama dengan lebar HP** — supaya tampilan di 2 perangkat **sama**~~ **DIBATALKAN 2026-10-17** — diganti **orderan 22** (PC lebar penuh, responsive) | ❌ |
| 14e | **Konsep scroll kiri–kanan** pada peta | ✅ |

### Berkas yang dibuat (orderan 14)

| Berkas | Isi |
|---|---|
| `index.html` | Kerangka: peta, bilah atas (nama wilayah), bilah bawah (posisi + tombol geser) |
| `css/gaya.css` | Tampilan; lebar bingkai = `min(100vw, 430px)` → di PC sama dengan HP |
| `js/inti.js` | Peta MapLibre, citra Esri, batas geser, hitung zoom, tombol geser |
| `js/lib/maplibre-gl.js` | MapLibre GL JS 5.9.0 — disimpan lokal (954 KB) |
| `js/lib/maplibre-gl.css` | Gaya bawaan MapLibre (69 KB) |

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Sumber citra & batas Esri | ✅ HTTP 200 · `image/jpeg` & `image/png` · CORS `*` |
| MapLibre 5.9.0 dari unpkg | ✅ HTTP 200 · CORS `*` · disimpan lokal |
| Sintaks `maplibre-gl.js` & `inti.js` | ✅ `node --check` lulus keduanya |
| Peta tampil | ✅ 1 kanvas, **0 galat** halaman, 0 galat konsol |
| Tinggi Indonesia pas di layar | ✅ z4,5 · Aceh sampai Timor tampak |
| Geser kiri–kanan | ✅ 118,0° → 122,2° → 113,8° (tombol ◀ ▶) |
| Ujung geser barat | ✅ 97,3° BT — Sumatera + Malaysia, **tidak kosong** |
| Ujung geser timur | ✅ 142,7° BT — Papua + PNG, **tidak kosong** |
| Pulau berbatasan tampak utuh | ✅ Kalimantan–Malaysia · Papua–PNG (garis batas putih terlihat) |
| Lebar di PC | ✅ jendela 1152 px → bingkai **430 px** (sama dengan HP) |
| Lebar di HP | ✅ jendela 312 px → bingkai **312 px** (penuh) |
| Bilah tidak menutupi peta | ✅ tinggi peta dikurangi 2 × 40 px bilah |

### Rincian Orderan 16 (perintah 2026-10-16)

Pemilik proyek memilih **pilihan A**: data penduduk sampai kecamatan & desa
diambil dari **Dukcapil Kemendagri**.

| Butir | Isi | Status |
|---|---|---|
| 16a | Jumlah penduduk **provinsi** (38) | ✅ |
| 16b | Jumlah penduduk **kabupaten/kota** (514) | ✅ |
| 16c | Jumlah penduduk **kecamatan** (7.285) | ✅ |
| 16d | Jumlah penduduk **desa/kelurahan** (83.489) | ✅ |
| 16e | Peta diwarnai menurut datanya (warna bertingkat 9 kelas) | ✅ |
| 16f | Keterangan warna + sumber data tampil di layar | ✅ |
| 16g | Klik wilayah → jumlah penduduk, KK, luas, kepadatan, kode wilayah | ✅ |
| 16h | Berjalan bersama 4 jenis peta (orderan 15) | ✅ |

### Sumber data (ditemukan 2026-10-16, sangat penting)

Sebelumnya disimpulkan *"Dukcapil Pusat tidak menerbitkan rekap yang bisa
diunduh"*. **Kesimpulan itu keliru.** Setelah menelusuri halaman
`dukcapil.kemendagri.go.id`, ditemukan tautan
`gis.dukcapil.kemendagri.go.id/peta` yang di dalamnya ada ArcGIS
**Experience Builder**. Dari sana ditemukan **FeatureServer terbuka**:

| Tingkat | Layanan / lapisan | Jumlah | Poligon? |
|---|---|---|---|
| Provinsi | `AGR_VISUAL_PROP_FIX` / 1 | 38 | ✅ |
| Kabupaten/Kota | `AGR_VISUAL_KAB_FIX` / 3 | 514 | ✅ |
| Kecamatan | `AGR_VISUAL_KEC_FIX` / 2 | 7.285 | ✅ |
| Desa/Kelurahan | `AGR_VISUAL_KEL_FIX` / 0 | 83.489 | ✅ |

Diuji 2026-10-16: **HTTP 200**, **CORS `*`**, **tanpa kunci API**, dan tiap
fitur memuat **jumlah penduduk + poligon batasnya**. Ini menutup kebutuhan
orderan 16 tanpa perlu menelusuri ±500 situs daerah.

Kolom yang tersedia jauh lebih banyak daripada kebutuhan awal: jumlah
penduduk · kepala keluarga · luas wilayah · kepadatan · agama (7 kolom) ·
jenis kelamin · kelompok umur · pendidikan · pekerjaan · golongan darah.

### ⚠️ Angka Dukcapil BEDA dengan BPS — bukan salah, memang beda dasar

| Sumber | Jumlah penduduk Indonesia | Sifat |
|---|---|---|
| **Dukcapil Kemendagri** (yang dipakai) | **284.973.643** jiwa | hasil pencatatan administrasi (KTP/KK) |
| BPS 2026 (dipakai `DataPeta`) | **287.198.383** jiwa | hasil proyeksi sensus |

Selisih **2.224.740 jiwa (±0,8%)**. Sebabnya berbeda: Dukcapil menghitung
orang yang **tercatat** di KTP/KK, BPS menghitung **perkiraan** jumlah
penduduk. Contoh terukur: Bali — Dukcapil 4.375.263 vs BPS 4.488.243
(selisih 112.980). Karena itu **sumbernya selalu ditulis di layar**, tidak
disamarkan.

### Berkas data (hasil pengambilan)

Ambil ulang dengan: `node alat/ambil-dukcapil.js --tingkat=provinsi,kabkota,kecamatan,desa`

| Kelompok | Berkas | Jumlah | Ukuran | Dimuat |
|---|---|---|---|---|
| Provinsi | `prop-nasional.js` | 38 | 1,4 MB | bersama halaman |
| Kabupaten/Kota | `kab-nasional.js` | 514 | 1,8 MB | bersama halaman |
| Kecamatan | `kec-<provinsi>.js` | 38 | 3,5 MB | saat tingkat kecamatan dipilih |
| Desa/Kelurahan | `desa-<kabkota>.js` | 514 | 71 MB | saat tingkat desa dipilih |

Karena batas desa seluruh Indonesia besarnya 71 MB, tingkat **desa hanya
dibuka saat peta diperbesar sampai z8**, dan yang dimuat hanya kab/kota yang
terlihat di layar (rata-rata 140 KB tiap berkas). Tingkat **kecamatan**
memakai batas z5.

### Penyederhana poligon (diukur, bukan dikira)

Dukcapil menyediakan penyederhana di sisi peladen (`maxAllowableOffset`,
dalam derajat). Terukur 2026-10-16:

| Tingkat | Penyederhana | Hasil |
|---|---|---|
| Provinsi | 0,02° | 1,4 MB · 83.439 titik |
| Kabupaten/Kota | 0,01° | 1,9 MB · 514 fitur |
| Kecamatan | 0,01° | ±150 KB tiap provinsi |
| Desa/Kelurahan | 0,0005° (±55 m) | ±140 KB tiap kabupaten · 28 titik/desa |

### Bug yang ditemukan & diperbaiki (2026-10-16)

| # | Bug | Sebab | Perbaikan |
|---|---|---|---|
| 1 | Permintaan 1 provinsi mengembalikan 7.285 kecamatan (berkas 3,6 MB × 38) | Saringan dikirim sebagai parameter sendiri (`&no_prop=11`) — **diabaikan ArcGIS** | Saringan dijadikan bagian dari `where` |
| 2 | Desa kab 11.16 berisi desa provinsi lain | `no_kab` saja tidak unik (angka 16 ada di banyak provinsi) | Saringan memakai `no_prop` **dan** `no_kab` |
| 3 | Berkas `desa-515.js` → 404 (padahal ada `desa-5101.js`) | Kode disusun dari angka sehingga nol di depan hilang (`51` + `8` = `518`, bukan `5108`) | Kode disusun ulang di peramban dengan penambal nol |
| 4 | Peringatan MapLibre `zoom expression…` | `zoom` dibungkus `case` | Lebar garis dibuat tetap |
| 5 | Peringatan MapLibre `feature-state … with filters` | `feature-state` dipakai di `filter` | Dipindah ke `paint` |
| 6 | Peringatan `Branch labels must be unique` | Nama kecamatan bisa kembar dalam 1 provinsi | Ekspresi warna memakai **kode wilayah**, bukan nama |

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| FeatureServer Dukcapil | ✅ HTTP 200 · CORS `*` · tanpa kunci |
| Jumlah fitur tiap tingkat | ✅ 38 · 514 · 7.285 · 83.489 — sama dengan daftar resmi |
| Jumlah penduduk terbaca | ✅ 284.973.643 jiwa (Dukcapil) |
| Peta tematik provinsi | ✅ 38 wilayah · 9 kelas kepadatan 5 – ≥1.000 jiwa/km² |
| Peta tematik kab/kota | ✅ 514 wilayah · kelas kepadatan |
| Peta tematik kecamatan | ✅ 1.320 kecamatan (Jateng+Jatim+Yogyakarta) saat z7 |
| Peta tematik desa | ✅ 1.798 desa/kelurahan saat z9 |
| Klik wilayah | ✅ "KALIMANTAN TENGAH · 2.825.290 jiwa · 922.338 KK · 153.444 km² · 18 jiwa/km²" |
| Kode wilayah | ✅ `35.14.09` · `33.09.10.2007` — nol di depan utuh |
| Berjalan bersama 4 jenis peta | ✅ lapisan tematik dipasang ulang saat peta dasar diganti |
| Tombol "Perbesar dulu" | ✅ muncul saat tingkat desa dibuka pada z4,6 |
| Lebar tetap sama di PC & HP | ✅ PC 1152 px → bingkai 430 px · HP 390 px → 312 px |
| Keterangan warna muat di layar | ✅ HP 312 px → panel 164 px, tidak keluar layar |
| Galat konsol | ✅ **0 galat**, 0 peringatan |

### Berkas yang dibuat (orderan 16)

| Berkas | Isi |
|---|---|
| `alat/ambil-dukcapil.js` | Pengambil data Dukcapil (4 tingkat, penyederhana, ulang otomatis) |
| `js/warna.js` | Peta tematik: kelas kuantil 9 warna, keterangan, kartu wilayah |
| `data/wilayah-warna/*.js` | 554 berkas data (73 MB) |
| `index.html` | Tombol jenis warna, daftar tingkat, kartu wilayah, keterangan warna |
| `css/gaya.css` | Gaya tombol + daftar + kartu + keterangan warna |
| `js/inti.js` | Pencari kode provinsi & kab/kota untuk memuat berkas bagian |

### Rincian Orderan 17 (perintah 2026-10-16)

Pemilik proyek: *"lanjut user input data member-nya... per lokasi atau kota atau
desa bisa per kab atau provinsi — bisa pelajari c:\data\datapeta sudah dibuat
konsep dipindahkan dan sesuaikan dengan kondisi pemetaan"*.

| Butir | Isi | Status |
|---|---|---|
| 17a | **Tambah** anggota: nama, wilayah, kategori, inisial, keterangan | ✅ |
| 17b | **Ubah** anggota (wilayah dikunci, sisanya bisa diubah) | ✅ |
| 17c | **Hapus** anggota (dengan konfirmasi) | ✅ |
| 17d | Daftar anggota dikelompokkan per **Desa/Kelurahan · Kecamatan · Kabupaten/Kota · Provinsi** | ✅ |
| 17e | Satu wilayah boleh punya **banyak** anggota (tombol [+][✎][−] per wilayah) | ✅ |
| 17f | **Penanda di peta** — satu titik per anggota, warna menurut kategori | ✅ |
| 17g | Klik penanda → keterangan lengkap anggota | ✅ |
| 17h | Data **tersimpan permanen** di peramban (IndexedDB, tanpa internet) | ✅ |
| 17i | Pemilih wilayah 4 tingkat dari data Dukcapil + jumlah penduduk otomatis | ✅ |

### Yang diambil dari `DataPeta`, dan yang disesuaikan

| Bagian | DataPeta | Pemetaan (setelah disesuaikan) | Sebab |
|---|---|---|---|
| Data satu anggota | `nama`, `wilayah` (teks), `kategori`, `lon`, `lat`, `inisial`, `rincian[]` | sama, **ditambah kode wilayah 4 tingkat** | Kode resmi tidak bisa salah tulis; nama bisa |
| Penyimpanan | IndexedDB `peta-indonesia` | IndexedDB `pemetaan` (3 tabel) | Sama, tapi berkas terpisah (`js/simpanan.js`) supaya nanti mudah diganti Neon |
| Daftar anggota | dikelompokkan per kota | dikelompokkan **4 tingkat pilihan** | Permintaan pemilik proyek |
| Tombol wilayah | [+][✎][−] per kota | sama, per wilayah tingkat terpilih | Konsepnya bagus, dipertahankan |
| Form isian | panel samping, peta tetap terlihat | **lembar bawah** (bisa ditutup) | Bingkai Pemetaan hanya 430 px — panel samping tidak muat |
| Kunci wilayah | saat ubah / tambah dari baris kota | sama | Dipertahankan |
| Penanda | SVG di atas gambar | **lapisan MapLibre** (circle + huruf) | Pemetaan memakai MapLibre, bukan SVG |
| Kategori | daftar bisa ditambah | 6 kategori awal: Yayasan · Sekolah · Kesehatan · Sosial · Pemerintahan · Lainnya | — |

### ⚠️ Temuan penting: kolom `luas_wilayah` Dukcapil tidak bisa dipercaya

Diukur 2026-10-16: dari 514 kabupaten/kota, **33 baris** jelas salah satuan
(kemungkinan hektar, bukan km²). Bukti:

| Wilayah | Kolom Dukcapil | Kenyataan | Hitungan sendiri dari batas |
|---|---|---|---|
| KOTA SURABAYA | **335.925** km² | ±330 km² | 328 km² ✓ |
| KOTA BANDUNG | 166.593 km² | ±167 km² | 163 km² ✓ |
| KOTA MEDAN | 279,29 km² ← benar | ±265 km² | 274 km² ✓ |
| KOTA MALANG | — | ±145 km² | benar setelah dihitung |

Seluruh Indonesia hanya 1,9 juta km², jadi 335.925 km² untuk satu kota
mustahil. Karena itu **luas dihitung sendiri** dari batas poligon resmi
(rumus kelebihan bola, sama dengan yang dipakai Mapbox/geojson-area) di
`PD.luasKm2()`. Kepadatan pun dihitung dari luas itu, **tidak** memakai kolom
`kepadatan_penduduk` yang sering kosong.

Dampak: skala warna peta tematik (orderan 16) juga diperbaiki — sebelumnya
kabupaten yang luasnya salah tampak sebagai "jarang penduduk" padahal padat.

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Simpan anggota baru | ✅ "Yayasan Cahaya Nusantara" di Kota Surabaya tersimpan |
| Jumlah penduduk otomatis | ✅ "KOTA SURABAYA berpenduduk 3.018.022 jiwa · KK 1.004.044 · luas 328 km² · kepadatan 9.208 jiwa/km²" |
| Daftar dikelompokkan per kab/kota | ✅ 3 wilayah: BADUNG · JAKARTA PUSAT · KOTA SURABAYA |
| Daftar dikelompokkan per provinsi | ✅ JAWA TIMUR (3 anggota dari data uji awal) |
| Ganti tingkat saat ada data | ✅ per kab/kota → "KOTA SURABAYA"; per provinsi → "JAWA TIMUR" |
| Penanda di peta | ✅ 3 titik · lapisan `anggota-lingkaran` + `anggota-huruf` ada |
| Warna penanda menurut kategori | ✅ Yayasan ungu · Sekolah kuning · Kesehatan biru |
| Data tersimpan permanen | ✅ muat ulang halaman → 3 anggota tetap ada |
| Wilayah dikunci saat ubah | ✅ pilihan wilayah `disabled` + catatan kuning |
| Lebar PC = lebar HP | ✅ PC 1152 px → bingkai 430 px → panel 428 px |
| Galat konsol | ✅ **0 galat** |

### Bug yang ditemukan & diperbaiki (orderan 17)

| # | Bug | Sebab | Perbaikan |
|---|---|---|---|
| 1 | Peta tergambar **dua kali** (2 kanvas) | `js/inti.js` termuat dua kali — kesalahan saat menyunting `index.html` | Duplikat dibuang |
| 2 | Peringatan `text-field requires glyphs` | Gaya peta tidak punya `glyphs`, padahal penanda memakai huruf | `glyphs` ditambahkan di `bangunGaya()` (diuji HTTP 200 · CORS `*`) |
| 3 | Pemilih wilayah tidak muncul | `bangunPemilih()` tidak dipanggil di `mulai()` | Dipanggil |
| 4 | Indeks kolom salah (nama/jiwa tertukar) | Salah hitung: nama ada di `a[jumlahKolom]`, bukan `a[jumlahKolom-1]` | Rumus kolom diperbaiki + ditulis di kepala berkas |
| 5 | Atribut `data-tingkat` bentrok | Dipakai tombol panel **dan** pilihan form | Tombol panel → `data-kelompok` |
| 6 | Berkas lama tetap dipakai peramban | Singgahan (`cache`) Chrome | Penanda versi `?v=YYYYMMDD-nn` di `index.html` |
| 7 | Luas wilayah janggal (Surabaya 335.925 km²) | Kolom `luas_wilayah` Dukcapil salah satuan pada 33 baris | Luas dihitung sendiri dari poligon |

### Berkas yang dibuat (orderan 17)

| Berkas | Isi |
|---|---|
| `js/simpanan.js` | IndexedDB: tabel `anggota`, `kategori`, `pengaturan` |
| `js/member.js` | Daftar anggota, pemilih 4 tingkat, form, penanda peta, kartu |
| `index.html` | Panel anggota, tombol `☰ Anggota`, form lembar bawah, penanda versi |
| `css/gaya.css` | Gaya panel, tombol tingkat, baris anggota, form, kartu |
| `js/inti.js` | `PD.luasKm2()` (luas dari poligon) + penyedia peta untuk modul lain |

Catatan: kalau database **Neon** (orderan 7) nanti sudah siap, hanya
`js/simpanan.js` yang perlu diganti — seluruh pemakaian di `js/member.js`
memakai nama fungsi yang sama.

Catatan: uji dijalankan lewat server lokal `python -m http.server` di
`127.0.0.1:8777`, bukan `file://`, supaya sama dengan keadaan di GitHub Pages.

### Rincian Orderan 15 (perintah 2026-10-16)

| Butir | Isi | Status |
|---|---|---|
| 15a | Peta memakai **citra satelit** (sudah ada dari orderan 14) | ✅ |
| 15b | Citra satelit **bisa diganti menjadi peta** (jalan, gelap, medan) | ✅ |
| 15c | Pilihan jenis peta **terbaca jelas** di HP sempit (288 px) — tidak terpotong | ✅ |
| 15d | Pilihan yang dipakai **diingat** (`localStorage`) saat halaman dibuka ulang | ✅ |
| 15e | Ganti jenis peta **tidak menggeser** titik tengah & zoom yang sedang dilihat | ✅ |

### Jenis peta yang tersedia (orderan 15)

| Jenis | Sumber ubin | Batas zoom | Keterangan |
|---|---|---|---|
| 🛰️ **Citra Satelit** | Esri World Imagery + garis batas Esri | 19 | Pilihan awal; tetap seperti orderan 14 |
| 🗺️ **Peta Jalan** | OpenStreetMap | 19 | Nama tempat, jalan, batas negara |
| 🌙 **Peta Gelap** | CARTO Dark Matter | 20 | Peta gelap, enak untuk latar data |
| ⛰️ **Peta Medan** | Esri World Terrain Base | 13 | Relief daratan, laut, dasar laut |

Semua ubin **raster**, jadi tampilannya sama di HP dan PC, dan tidak butuh
berkas gaya (style JSON) dari luar.

### Cara memakai

1. Ketuk tombol jenis peta di bilah atas (contoh: **🛰️ Citra Satelit ▾**).
2. Daftar empat jenis peta terbuka; ketuk salah satu.
3. Pilihan langsung berlaku dan diingat.
4. Pintasan papan tuts (PC): tombol angka **1–4**.

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Keempat sumber ubin | ✅ HTTP 200 · CORS `*` (OSM, CARTO, Esri Imagery, Esri Terrain, Esri Boundaries) |
| Sintaks `js/inti.js` | ✅ `node --check` lulus |
| Keempat jenis peta tampil | ✅ ubin termuat: satelit 20 · jalan 20 · gelap 10 · medan 10 |
| Keterangan sumber ikut berubah | ✅ "Citra: Esri…" · "Peta: © OpenStreetMap…" · "Peta: © OpenStreetMap… CARTO" · "Medan: Esri, USGS, NOAA" |
| Posisi tidak bergeser saat ganti peta | ✅ tetap `118,0° BT · -2,5° · z4,6` di keempat jenis |
| Tombol terbaca utuh di HP sempit | ✅ jendela 360 px → bingkai 288 px, tombol 108 px, nama tidak terpotong |
| Daftar pilihan tidak keluar layar | ✅ bingkai 288 px → panel 219 px, `dalamBingkai: true` |
| Pilihan diingat | ✅ pilih "Peta Jalan" → muat ulang → tombol menampilkan "🗺️ Peta Jalan" |
| Lebar PC tetap = lebar HP | ✅ jendela 1152 px → bingkai **430 px** |
| Geser kiri–kanan tetap jalan | ✅ 98,6° (Sumatera) → 141,4° (Papua) |
| Galat halaman | ✅ **0 galat konsol**, 0 permintaan gagal |

### Berkas yang diubah (orderan 15)

| Berkas | Perubahan |
|---|---|
| `js/inti.js` | Daftar `JENIS` peta, `bangunGaya(j)`, `bangunPemilih()`, `gantiJenis()`, `simpanPilihan()` |
| `index.html` | Tombol `#tombol-jenis` + wadah daftar `#pemilih-peta` |
| `css/gaya.css` | Gaya tombol jenis peta + daftar pilihan melayang |

### Bukti uji di situs live (2026-10-16)

Situs: <https://suwandhih.github.io/Pemetaan/> — commit `3afd461`, status
GitHub Pages `built`.

| Uji | Hasil |
|---|---|
| Berkas live | ✅ `index.html` · `css/gaya.css` · `js/inti.js` — HTTP 200 semua |
| Peta tampil saat dibuka | ✅ Citra Satelit · 20 ubin Esri termuat · `Sulawesi` |
| Ganti ke Peta Jalan | ✅ tombol jadi "🗺️ Peta Jalan" · keterangan "Peta: © OpenStreetMap contributors" |
| Ganti ke Peta Gelap | ✅ tombol jadi "🌙 Peta Gelap" · keterangan "… · CARTO" |
| Ganti ke Peta Medan | ✅ tombol jadi "⛰️ Peta Medan" · keterangan "Medan: Esri, USGS, NOAA" |
| Kembali ke Citra Satelit | ✅ tombol jadi "🛰️ Citra Satelit" · keterangan "Citra: Esri, Maxar…" |
| Posisi tidak bergeser | ✅ tetap `118,0° BT · -2,5° · z4,6` di keempat jenis |
| Galat di situs live | ✅ **0 galat konsol**, 0 permintaan gagal |

Catatan hubungan antar-orderan:

* Orderan 1–5 berisi **syarat** dari aplikasi yang akan dibangun.
* Orderan 6 adalah **wujud nyata** tahap awal — peta + UI + form isian.
* Orderan 4 dan 5 hampir seluruhnya berupa konfigurasi, bukan kode baru.

Total perkiraan waktu orderan 1–6: **±4,5–6,5 jam**, dikerjakan bertahap satu per satu.

### Total perkiraan waktu

| Kelompok | Orderan | Estimasi |
|---|---|---|
| Peta (aplikasi) | 1–6 | ±4,5–6,5 jam |
| Setelan database | 7 | ±1–1,5 jam |
| Setelan GitHub | 8 | ±0,5 jam |
| Dokumen proyek | 9–12 | ±1–1,25 jam |
| Pemeriksaan GitHub | 13 | ±0,5 jam |
| **Jumlah** | **1–13** | **±7,5–10 jam** |

---

## Status Berkas Dokumen Proyek

Berdasarkan orderan 9–12. **Seluruh berkas sudah ada** (2026-10-17):

| Berkas | Untuk siapa | Isi | Status |
|---|---|---|---|
| **`Docs/agents.md`** | asisten (AI) | Aturan main + catatan agar diingatkan setiap mulai | ✅ Ada — nama & isi sudah diperbarui |
| **`Docs/rencanakerja.md`** | asisten + manusia | Daftar orderan: belum selesai & sudah selesai | ✅ Ada |
| **`Docs/prompt.md`** | manusia / AI lain | Konsep proyek — supaya dapat dibuat ulang **persis sama** | ✅ Ada — 13 bagian |
| **`Docs/CHANGELOG.md`** | manusia | Catatan semua perkembangan, perbaikan, hal baru | ✅ Ada — 72 commit tercatat |

### Isi `Docs/prompt.md` (13 bagian)

| Bagian | Isi |
|---|---|
| 1 | Proyek ini apa — prinsip yang dipegang |
| 2 | Fondasi teknologi (dikunci) + yang ditolak beserta alasannya |
| 3 | Susunan berkas |
| 4 | **Struktur data** — poligon, angka agama, sumber data |
| 5 | Jembatan antar modul (`window.PD_*`) |
| 6 | Tampilan — ambang responsif, keputusan yang dikunci, bilah atas, jangkar & label |
| 7 | Fitur — daftar lengkap + detail yang mudah terlewat |
| 8 | Penyimpanan data anggota (Worker + Neon + IndexedDB) |
| 9 | **Jebakan teknis yang sudah pernah terjadi** (29 butir) |
| 10 | Alur kerja yang wajib diikuti |
| 11 | Cara membangun ulang dari nol |
| 12 | Ukuran proyek |
| 13 | Rujukan |

### Isi `Docs/CHANGELOG.md`

Riwayat **72 commit** dikelompokkan per tanggal (terbaru di atas), masing-masing
menyebut **berkas yang berubah** dan **hash commit** supaya bisa ditelusuri.

| Tanggal | Isi |
|---|---|
| 2026-10-22 | Orderan 24, 25, 26, 27 · pemulihan data (orderan 1–3) |
| 2026-10-18 | Orderan 23 — data anggota dari tokomedia.org |
| 2026-10-17 | Panduan interaktif · panduan pemakaian · revisi panel Suku · orderan 20, 21, 22, 18, 19 · 3 perbaikan |
| 2026-10-16 | Orderan 7, 16, 15, 17, 14 · GitHub Pages aktif · kelola kategori · perbaikan penanda & tampilan |
| 2026-10-12 | Fondasi teknologi dikunci · aturan kerja 1–9 · berkas `.md` ke `Docs/` · repo GitHub dibuat |

---

## Temuan Verifikasi Orderan 5 (citra satelit terbaru)

Sudah diuji 2026-10-12. Orderan 5 **sudah terpenuhi oleh konfigurasi petadunia**,
jadi tidak perlu dikerjakan dari nol.

### Hasil uji

| Uji | Hasil |
|---|---|
| Rilis citra terbaru Esri (dari `waybackconfig.json`) | **World Imagery 2026-09-24** (rl `63116`), total **197 rilis** |
| Tile Jakarta z18: citra terkini vs rilis 2026-09-24 | **Identik** — 21.280 byte, isi sama |
| Tile Medan z18 | Identik — 15.619 byte |
| Tile Surabaya z18 | Identik — 18.983 byte |

Kesimpulan: URL yang dipakai petadunia
(`server.arcgisonline.com/.../World_Imagery/MapServer/tile/{z}/{y}/{x}`)
**sudah menunjuk citra terbaru 2026-09-24**. Tidak ada versi yang lebih baru.

### Rilis 2024–2026 yang tersedia (rujukan)

| Tanggal rilis | rl |
|---|---|
| 2026-09-24 | 63116 |
| 2026-08-05 | 26334 |
| 2026-06-30 | 32246 |
| 2026-05-28 | 10842 |
| 2026-04-30 | 49059 |
| 2026-03-26 | 22869 |
| 2026-02-26 | 64001 |
| 2026-01-29 | 22252 |
| 2025-12-18 | 13192 |

Catatan: rilis tertentu dapat dikunci lewat `wayback.maptiles.arcgis.com` bila
nanti diperlukan citra yang tidak berubah-ubah.

---

## Penghambat (menunggu dari pemilik proyek)

### ✅ SUDAH DIPUTUSKAN 2026-10-16 — pilihan C dipakai

Pemilik proyek memilih **opsi C**: pakai `agents.md` + tambahkan bagian
"Catatan untuk Asisten". Sudah dikerjakan dan di-commit.

| Hal | Keadaan |
|---|---|
| `Docs/aturan.md` | Sudah tidak ada (rename dikenali git sebagai `R`) |
| `Docs/agents.md` | Ada — aturan + bagian "Catatan untuk Asisten" |
| Commit titik pulih | `9d027e4` — rename disimpan apa adanya |
| Commit hasil | `agents.md` + `rencanakerja.md` diperbarui (commit sesudah titik pulih) |

<details>
<summary>Catatan temuan lama (2026-10-12 22:25) — sudah selesai</summary>

Ditemukan 2026-10-12 22:25 saat pemeriksaan akhir sebelum berhenti.

| Hal | Keadaan |
|---|---|
| `Docs/aturan.md` | **Sudah tidak ada** di lokal (dihapus) |
| `Docs/agents.md` | **Ada** di lokal — 5.252 byte |
| Isi `agents.md` vs `aturan.md` | **Identik** — 120 baris, **0 perbedaan** (baru ganti nama, isi belum diubah) |
| Di GitHub | masih `Docs/aturan.md` — **31 commit? tidak**, masih 13 commit lama |
| Status git | `D Docs/aturan.md` + `?? Docs/agents.md` — **belum di-commit** |

**Sebab:** penggantian nama ini dilakukan dari luar sesi (oleh pemilik proyek),
bukan oleh asisten. Sesuai aturan 1 (backup) dan aturan 2 (jangan menambah
tanpa perintah), asisten **belum menyimpan perubahan ini**.

**Tiga pilihan untuk besok:**

| Pilihan | Cara | Akibat |
|---|---|---|
| A — Pakai `agents.md` | `git mv Docs/aturan.md Docs/agents.md` lalu commit | Riwayat terjaga (git mengenali sebagai *rename*, bukan hapus+buat) |
| B — Kembalikan ke `aturan.md` | `git checkout -- Docs/aturan.md` | Repo kembali seperti semula |
| C — Pakai `agents.md` + tambah isi | Opsi A, lalu tambahkan bagian "catatan AI" seperti di orderan 9 | Sesuai rencana orderan 9 dan 11 |

Catatan: opsi **C** sesuai dengan maksud orderan 9 yang sudah tercatat —
`agents.md` bukan sekadar ganti nama, tetapi juga memuat catatan agar asisten
diingatkan setiap mulai proyek.

</details>

---

### Penghambat lain

| No | Yang dibutuhkan | Untuk orderan | Status |
|----|-----------------|---------------|--------|
| 1 | **Kredensial Neon** — connection string, atau URL Data API + JWT | 1, 6, 7 | ⛔ Belum ada |
| 2 | **Tujuan push GitHub** — repo baru atau repo yang sudah ada? | 1 | ✅ Terjawab: repo `Pemetaan` |
| 3 | **Pemisahan penyimpanan** — kode ke GitHub (repo publik), data ke Neon (database) | 1, 6, 7 | ⛔ Belum diputuskan |
| 4 | **Password/kunci database** — cara penyerahan | 1, 6, 7 | ⛔ Belum diputuskan |
| 5 | **Aktifkan Data API Neon** atau putuskan memakai driver langsung | 1, 6, 7 | ⛔ Belum diputuskan |
| 6 | **Buat tabel di Neon** — saat ini 0 tabel, belum ada skema | 1, 6, 7 | ⛔ Belum diputuskan |
| 7 | **Aturan RLS** — wajib dibuat sebelum data masuk | 1, 6, 7 | ⛔ Belum diputuskan |

Catatan penting soal Neon: **Neon Data API tidak punya lapisan izin sendiri.**
Setiap permintaan diotorisasi sepenuhnya oleh `GRANT` dan kebijakan
**Row-Level Security (RLS)** di PostgreSQL. Kebijakan yang salah membuat tabel
terbuka bagi siapa pun yang memiliki URL endpoint. RLS wajib disiapkan.

Catatan soal Neon Console: Data API saat ini **belum diaktifkan** (masih ada
tombol `Enable Data API`), dan skema `public` berisi **0 tabel**. Konfigurasi
bawaan yang terlihat saat pengaktifan: `Use Neon Auth` = **aktif**,
`Grant public schema access` = **aktif**. Bawaan `Grant public schema access`
memberi hak baca **dan tulis** ke skema `public` bagi pengguna terautentikasi —
perlu ditinjau, jangan diterima apa adanya.

---

## Catatan Akses (diverifikasi)

Semua akses diuji 2026-10-12. Bukan asumsi.

| Layanan | Alamat | Status uji | Keterangan |
|---|---|---|---|
| Neon Console | `console.neon.tech` | ✅ Masuk (sebagai `suwandhi`) | Punya akses baca |
| Neon — proyek | `pemetaan` (`lucky-lake-42845210`) | ✅ Terbaca | — |
| Neon — branch | `br-summer-fire-azexd37m` (`production`) | ✅ Terbaca | Branch default |
| Neon — region | AWS Asia Pacific 1 (**Singapura**) | ✅ Terbaca | Dekat Indonesia — latensi baik |
| Neon — Postgres | Versi **18** | ✅ Terbaca | — |
| Neon — plan | **Free plan** | ✅ Terbaca | — |
| Neon — compute | 0.25 ↔ 2 CU, scale-to-zero 5 menit | ✅ Terbaca | — |
| Neon — Data API | **BELUM aktif** — masih ada tombol `Enable Data API` | ✅ Terbaca | Belum pernah diaktifkan |
| Neon — tabel | **0 tabel** di skema `public` | ✅ Terbaca | Masih kosong |
| Neon — fungsional | Compute 0 CU-hrs · Storage 0 kB · Transfer 0 kB | ✅ Terbaca | Belum dipakai sama sekali |
| Neon — IP restrictions | `None set` | ✅ Terbaca | — |
| Neon — dibuat | 2026-10-12 21:16:29 | ✅ Terbaca | — |
| GitHub | Akun `suwandhih` | ✅ API jalan | — |
| GitHub repo | `petadunia` (publik) | ✅ Terbaca | Branch: `main`, `gh-pages` |
| GitHub repo | **`DataPeta` (publik)** | ✅ Terbaca | Branch: `main` saja |
| GitHub repo | `alkitab-projek` (publik) | ✅ Terbaca | Tidak terkait |
| GitHub Pages | `suwandhih.github.io/DataPeta/` | ✅ **HTTP 200** | Aktif |
| GitHub Pages | `suwandhih.github.io/petadunia/` | ✅ **HTTP 200** | Aktif |
| GitHub Pages (petadunia) | Berkas di branch `gh-pages` | ✅ Terbaca | Isinya sama dengan `app/` |

---

## Catatan Waktu (2026-10-12)

| Pukul | Kegiatan | Lama |
|---|---|---|
| 20:59 | Mulai permintaan: pelajari Neon lalu GitHub | — |
| 21:00–21:06 | Unduh dokumentasi Neon + GitHub | ~6 mnt |
| 21:06–21:09 | Percobaan berbagi halaman peramban (gagal) | ~3 mnt |
| 21:40–21:42 | Berhasil masuk Neon Console, baca proyek & branch | ~2 mnt |
| 21:42–21:45 | Periksa Data API, tabel, role Neon | ~3 mnt |
| 21:45–21:48 | Periksa GitHub repo, branch, Pages | ~3 mnt |
| 21:48–21:53 | Temuan proyek `DataPeta` — baca dokumen & struktur | ~5 mnt |
| 21:53–21:56 | Tulis catatan & commit | ~3 mnt |
| | **Total** | **±25 mnt** |

---

## ⚙️ Kesiapan GitHub untuk Proyek Pemetaan

Diperiksa 2026-10-12 22:11 · **Diperbarui 2026-10-12 22:21** (orderan 13).

### Jawaban singkat

> **Repo GitHub `Pemetaan` SUDAH DIBUAT dan SUDAH TERSAMBUNG.**
> Sisa satu pekerjaan: **GitHub Pages** (untuk menayangkan aplikasi lewat web).

### Hasil (22:21)

| Item | Keadaan |
|---|---|
| Repo | ✅ `https://github.com/suwandhih/Pemetaan` |
| Sifat | ✅ **Publik** |
| Cabang default | ✅ **`main`** |
| Remote lokal | ✅ `origin` → `https://github.com/suwandhih/Pemetaan.git` |
| Cabang lokal | ✅ `main` (diseragamkan dari `master`) |
| Push | ✅ **12 commit terunggah** |
| Berkas di GitHub | ✅ `.gitignore`, `Docs/aturan.md`, `Docs/rencanakerja.md` |
| Sinkron | ✅ `## main...origin/main` — tidak ada selisih |
| Ukuran | 0 KB (sangat kecil, hanya dokumen) |

### ✅ GitHub Pages SUDAH AKTIF (2026-10-16)

| Hal | Keadaan |
|---|---|
| Alamat situs | **https://suwandhih.github.io/Pemetaan/** |
| Cara aktif | `gh api -X POST repos/suwandhih/Pemetaan/pages` — cabang `main`, jalur `/` |
| Status build | ✅ `built` (2026-10-16 16:07 WIB) |
| HTTPS | ✅ dipaksa aktif (`https_enforced: true`) |
| Uji berkas | ✅ 6 dari 6 → HTTP 200 (`/`, `index.html`, `css/gaya.css`, `js/inti.js`, `js/lib/maplibre-gl.js`, `js/lib/maplibre-gl.css`) |
| Uji tampilan | ✅ peta tampil, 1 kanvas, **0 galat** halaman, 0 galat konsol |
| Lebar di PC | ✅ 430 px (sama dengan HP) |

⚠️ **Koreksi catatan lama:** `gh` CLI **ternyata sudah terpasang** (versi 2.102.0,
login sebagai `suwandhih`). Catatan "gh tidak terpasang" di bagian bawah sudah
tidak berlaku.

### ⚠️ Yang masih perlu dikerjakan

| # | Pekerjaan | Alasan |
|---|---|---|
| 1 | **Nama resmi repo = `Pemetaan`** (huruf besar P) | Sudah dipakai; jangan diubah supaya alamat tidak berubah |

### ✅ Yang sudah siap (lama)

| Item | Keadaan | Bukti |
|---|---|---|
| Git terpasang | ✅ | `git version 2.54.0.windows.1` |
| Git repo lokal | ✅ Aktif | `C:\data\Pemetaan\.git` |
| Identitas git | ✅ Terisi | `suwandhih@gmail.com` |
| Akun GitHub | ✅ Ada & aktif | `suwandhih` |
| GitHub Pages berfungsi | ✅ Terbukti | 2 situs lain sudah live |
| Alat pendukung | ✅ Ada | `curl`, `node`, `npm`, `python` |

### ⛔ Tidak tersedia (tercatat)

| Alat | Keadaan | Akibat |
|---|---|---|
| ~~`gh` CLI~~ | ✅ **Sudah terpasang** — versi 2.102.0, login `suwandhih` (diperiksa 2026-10-16) | Bisa mengurus repo & Pages dari sini |
| GitHub MCP | Hanya baca | Tidak ada alat buat repo dari sini |

### ⚠️ Peringatan penting

| Hal | Sebab |
|---|---|
| **Jangan pakai repo `DataPeta` atau `petadunia`** | Aturan 8 — setiap folder diperuntukkan berbeda |
| **Repo publik = kode terlihat semua orang** | Jangan pernah menaruh kunci API, password, atau connection string Neon di dalam kode |
| **Data → Neon, kode → GitHub** | Pemisahan ini wajib, bukan pilihan |
| **GitHub Pages dilarang untuk situs komersial** | Batas resmi GitHub |

### Yang dibutuhkan dari pemilik proyek (untuk orderan 8 & 13)

| # | Pertanyaan | Pilihan |
|---|---|---|
| 1 | Nama repo | belum ditentukan (nama masih bebas) |
| 2 | Publik atau privat? | publik = bisa pakai GitHub Pages gratis · privat = perlu cara lain untuk menayangkan |
| 3 | Perlu GitHub Pages? | kalau ya, repo harus publik (kecuali akun berbayar) |
| 4 | Buat repo lewat mana? | web GitHub sendiri, atau saya bantu kalau `gh` dipasang |

---

## 🚨 TEMUAN BESAR: proyek `DataPeta` sudah ada dan tumpang tindih

Ini ditemukan saat memeriksa GitHub. **Wajib diputuskan sebelum kode apa pun
ditulis di `C:\data\Pemetaan`.**

### Bukti keberadaan

| Uji | Hasil |
|---|---|
| Folder lokal | ✅ **`C:\data\DataPeta` ADA** |
| Git lokal | ✅ Aktif, branch `main`, working tree **bersih** |
| Commit terakhir | `fa27bff` — *"Papan order: catat lanjutan 11 Okt 2026 (lab UI belum diperiksa Bapak)"* |
| Repo GitHub | ✅ `suwandhih/DataPeta` (publik), branch `main` |
| Situs aktif | ✅ **`https://suwandhih.github.io/DataPeta/` → 200** |
| Isi data | **8,62 MB**, 568 berkas |
| Batas wilayah | **514 berkas desa** + **38 berkas kecamatan** dalam `data/wilayah/` |
| Data tematik | `penduduk.js` · `agama.js` · `suku.js` · `pulau.js` · `gunung.js` · `danau.js` · `sungai.js` |
| Alat bantu | `alat/` berisi 12 skrip: `buat-penduduk.js`, `buat-agama.js`, `buat-pulau.js`, `buat-wilayah.js`, `unduh-citra-satelit.py`, dll |
| Berkas data mentah | `bps-agama-mentah.txt`, `bps-penduduk-2026.json`, `agama-dalam-angka.json` |

### DataPeta SUDAH mengerjakan orderan 1–6

| Orderan di `C:\data\Pemetaan` | Sudah di DataPeta? | Bukti |
|---|---|---|
| 1 — Chrome + GitHub + cloud DB + PC/HP | ✅ Sudah | GitHub Pages aktif; Cloudflare Worker + backend cloud; `js/penyimpanan.js` (IndexedDB) |
| 2 — UI HP tegak, peta Sumatera–Jawa | ✅ Sudah diputuskan | Keputusan Bapak 11 Okt 2026: *"HP dipilih TEGAK"*, deteksi layar otomatis |
| 3 — Peta freeze + panel hide/unhide | ⏳ Sedang ditangani | `lab-UI.html` + ruang bawah 3 keadaan (tutup · separuh · penuh) |
| 4 — Citra satelit (gunung, danau, sungai, jalan) | ✅ Sudah | K17 — Esri World Imagery, tanpa kunci API |
| 5 — Detail setara petadunia + citra terbaru | ✅ Sudah | K17 |
| 6 — Tahap awal peta + UI + form isian | ✅ Sudah jauh lebih maju | `index.html` 11,9 KB · `js/app.js` 114,8 KB |

### Data yang sudah ada di DataPeta

| Data | Sudah ada |
|---|---|
| Penduduk | ✅ `data/penduduk.js` |
| Agama | ✅ `data/agama.js` (41,4 KB) |
| Suku | ✅ `data/suku.js` — 28 suku, titik di ibu kota provinsi, ditandai **"perkiraan"** |
| Batas wilayah kecamatan | ✅ 38 berkas |
| Batas wilayah desa | ✅ 514 berkas |
| Negara dunia | ✅ `data/negara-dunia.js` (819 KB) |
| Kapulauan Seribu | ✅ `data/kepulauan-seribu.js` |

### Pekerjaan yang sudah direncanakan di DataPeta (belum selesai)

| Kode | Pekerjaan | Status |
|---|---|---|
| K30 | Tahap 1 (catatan sumber per baris), Tahap 3 (klaim wilayah & kerja tim), Tahap 4 (uji & dokumen), Tahap 5 (pengamanan & login SHA-256) | ⏳ |
| K31 | Pilih titik di peta detail + alamat lengkap (±3 hari) | ⏳ |
| K32 | Tabel daftar wilayah — penduduk + agama (±8 jam) | Disetujui Bapak 11 Okt 2026 |
| — | `lab-UI.html` belum diperiksa Bapak dari HP | Menunggu |

### Kendala yang sudah tercatat di DataPeta

| Kendala | Catatan |
|---|---|
| 8 provinsi data agama tidak bisa dilengkapi | Riau · Bengkulu · Jatim · NTB · Sulteng · Papua · Papua Selatan · Papua Barat Daya — 11 jalur sudah habis |
| Pindai BPS Pusat / Dukcapil pusat | **Sudah habis** — jangan diulang (aturan B14) |
| Kode provinsi berganda di `data/peta-indonesia.js` | 4 provinsi Papua berkode `"91"`, 2 berkode `"92"` — aplikasi tidak terpengaruh, tapi **jangan pakai `KODE_PROV`** |
| Peta di HP tegak masih kecil | 21–38% tinggi bidang — masalah bentuk peta, belum dibahas |

### ⚠️ Dampak pada proyek ini

Tiga kemungkinan, dan **hanya pemilik proyek yang bisa memutuskan**:

| Pilihan | Akibat |
|---|---|
| A — Lanjutkan di `DataPeta` | Orderan 1–6 hampir selesai; tinggal lanjut K30/K31/K32. Proyek `C:\data\Pemetaan` dibatalkan atau jadi catatan saja |
| B — Tetap di `C:\data\Pemetaan` | Risiko: pekerjaan **duplikat besar**, dua aplikasi mirip, dan mengulang pemindaian sumber yang sudah dinyatakan habis |
| C — Batasi `C:\data\Pemetaan` | Hanya untuk hal yang **benar-benar baru** dan tidak ada di DataPeta |

Catatan penting: memilih B berarti melanggar semangat aturan pemilik proyek
sendiri (*"jangan dikerjakan dua kali"*, seperti tertulis di papan order DataPeta).

---

## Catatan Kebutuhan (belum menjadi orderan)

Bukan orderan. Hanya rekaman kebutuhan yang disampaikan pemilik proyek, supaya
tidak hilang saat sesi panjang. Pengerjaan menunggu orderan resmi.

| Tanggal | Kebutuhan |
|---|---|
| 2026-10-12 | Data statistik yang ditampilkan: jumlah penduduk, sebaran suku, dan jumlah pemeluk agama (Kristen, Muslim, dan lainnya). |
| 2026-10-12 | Cakupan wilayah administratif yang diinginkan: provinsi, kabupaten/kota, kecamatan, desa. |
| 2026-10-12 | Data awal **tidak lengkap** — pemilik proyek akan menyuplai data seadanya. Syarat: **cukup menggambarkan** kondisi, tidak harus utuh. |
| 2026-10-12 | Data akan **dilengkapi oleh pengguna aplikasi** (kontribusi pengguna). Artinya aplikasi perlu jalur tulis (input data oleh pengguna), bukan hanya baca. |

## Usulan (belum diperintahkan)

Bagian ini hanya memuat ide/opsi. Tidak ada satu pun yang dikerjakan sampai
pemilik proyek memerintahkan secara eksplisit.

**Proyek dinyatakan selesai 2026-10-17.** Setelah itu pemilik proyek menambah
orderan 23–27 (2026-10-18 dan 2026-10-22) — semuanya sudah selesai.

| No | Usulan | Perkiraan Waktu | Catatan |
|----|--------|-----------------|---------|
| U1 | ~~**Tarik ulang data media dari tokomedia.org**~~ **SELESAI lewat orderan 27** | — | Orderan 27 sudah mengisi 300 anggota media dari API TokoMedia di Rumahweb. Fitur jangkar & label media (orderan 26) kini menampilkan 35 provinsi. |
| U2 | ~~**Rotasi kunci aplikasi (`KUNCI`)**~~ **DIBATALKAN 2026-10-22** | — | Pemilik proyek menyatakan ini **hanya demo dan tidak dipublikasikan**, jadi kunci tidak perlu diganti. |

---

## Keputusan yang sudah dikunci

Catatan arah proyek yang sudah disetujui pemilik proyek.

| Tanggal | Keputusan |
|---|---|
| 2026-10-12 | Arah aplikasi: peta Indonesia + negara tetangga, detail sampai level rumah/jalan, memakai citra satelit, pengalaman mirip Google Maps. |
| 2026-10-12 | ~~Fondasi teknologi: **Google Maps JavaScript API tipe hybrid**, `maxZoom` ~19–20, AdvancedMarkerElement, wilayah Indonesia + Asia Tenggara.~~ **DIBATALKAN** — lihat baris "Google Maps DITOLAK" di bawah. |
| 2026-10-12 | Backup: **git init + commit setiap perubahan**. |
| 2026-10-12 | Aturan kerja 1–7 ditetapkan dan dicatat di `aturan.md`. |
| 2026-10-12 | ~~Sistem CHNGMKR **tidak dipakai**. Fondasi tetap Google Maps JS API murni.~~ **DIBATALKAN** — bertentangan dengan baris "Google Maps DITOLAK" dan "Fondasi teknologi FINAL" di bawah. |
| 2026-10-12 | Data boleh tidak lengkap. Kontribusi pengguna diperlukan untuk melengkapi. |
| 2026-10-12 | **Google Maps DITOLAK.** Alasan: aturan/harga bisa berubah sepihak, data statistik tidak berada di infrastruktur sendiri, dan bukan peruntukan untuk data tematik. |
| 2026-10-12 | **CHNGMKR DITOLAK.** Alasan terbukti: (a) CHNGMKR sendiri memakai Google Maps JS API — jadi tidak melepaskan diri dari Google; (b) tidak ada repo terbuka (`github.com/chngmkr` = 404, pencarian GitHub tanpa hasil); (c) kebutuhan mereka beda (`maxZoom: 14`, roadmap, tanpa layer data) sehingga meniru mereka justru menambah pekerjaan bongkar pasang. |
| 2026-10-12 | **Fondasi teknologi FINAL: MapLibre GL JS + Esri World Imagery + OpenFreeMap/OSM.** Tanpa vendor lock, tanpa biaya, dapat dipakai offline. |
| 2026-10-12 | Proyek baru dibangun di `C:\data\Pemetaan`. Proyek **`petadunia`** (`C:\data\Peta dunia`) menjadi **contoh/referensi SAJA** dan tidak diubah. |
| 2026-10-12 | **Aturan 8 ditetapkan:** dilarang copy-paste seluruh konsep dari folder lain. Hanya boleh mengambil **ide** dan **cara**, lalu ditulis sendiri. Proyek pemetaan harus dibuat sendiri. Setiap folder diperuntukkan berbeda. |
| 2026-10-12 | **Aturan 9 ditetapkan:** tanda kehidupan saat bekerja. Asisten tidak boleh diam di layar; wajib melaporkan langkah ke berapa, nama pekerjaan, waktu mulai/selesai, hasil perintah, posisi keseluruhan, langkah lama, jalan buntu, dan ringkasan akhir. |
| 2026-10-12 | **Setelan database & GitHub dijadikan orderan tersendiri** — orderan 7 (database Neon) dan orderan 8 (GitHub), karena keduanya perlu dikerjakan, bukan sekadar syarat. |
| 2026-10-12 | **Seluruh berkas `.md` dipindahkan ke folder `Docs/`.** Akar proyek bersih dari dokumen. Dicatat sebagai bagian aturan 3b di `Docs/aturan.md`. |
| 2026-10-12 | **Nama repo GitHub ditetapkan: `Pemetaan`, publik** (`https://github.com/suwandhih/Pemetaan`). Alasan publik: supaya dapat memakai **GitHub Pages gratis**. Struktur dokumen proyek: `agents.md` (aturan + catatan untuk AI), `rencanakerja.md` (orderan), `prompt.md` (konsep agar bisa dibangun ulang persis sama), `CHANGELOG.md` (semua perkembangan). |
| 2026-10-12 | **Repo GitHub `Pemetaan` DIBUAT dan TERSAMBUNG.** Cabang lokal diseragamkan `master` → `main` mengikuti bawaan GitHub. 12 commit terunggah. Sisa: GitHub Pages belum diaktifkan. |

---

## Temuan Riset (fakta terverifikasi, bukan orderan)

Rekaman hasil riset agar tidak perlu diulang. Semua sudah diuji pada 2026-10-12.

### Batas wilayah administratif (gratis, terverifikasi ada)

| Sumber | Level | Ukuran / jumlah | Status uji |
|---|---|---|---|
| GADM 4.1 Indonesia | Provinsi (ADM1) | 845 KB | 200 OK |
| GADM 4.1 Indonesia | Kab/Kota (ADM2) | 1,3 MB | 200 OK |
| GADM 4.1 Indonesia | Kecamatan (ADM3) | 2,8 MB | 200 OK |
| GADM 4.1 Indonesia | Desa (ADM4) | 8,1 MB | 200 OK |
| geoBoundaries | ADM1 | 34 unit | Ada |
| geoBoundaries | ADM2 | 519 unit | Ada |
| geoBoundaries | ADM3/ADM4 | — | Tidak tersedia |

Catatan: kode wilayah GADM berbeda dari kode BPS, jadi perlu tabel pemetaan
untuk menyambungkan angka statistik ke poligon.

### Ketersediaan data statistik

| Data | Provinsi | Kab/Kota | Kecamatan | Desa |
|---|---|---|---|---|
| Jumlah penduduk | Ada | Ada | Ada | Terbatas |
| Jumlah pemeluk agama | Ada (SP2010) | Ada (SP2010) | Sebagian | **Tidak ada** |
| Sebaran suku | Ada (SP2010) | Ada (SP2010) | Tidak | **Tidak ada** |
| Jumlah rumah ibadah | Ada | Ada | Ada | **Ada (PODES)** |

Temuan kunci: SP2020 tidak lagi mengumpulkan data suku. Sensus terakhir yang
memuat suku adalah SP2010, dan publikasinya hanya sampai kabupaten/kota.
Pengganti yang tersedia di level desa adalah **jumlah rumah ibadah dari
PODES**, bukan jumlah pemeluk.

### Kendala akses BPS

Portal `webapi.bps.go.id` menolak akses otomatis (WAF). API key BPS perlu
didaftarkan sendiri oleh pemilik proyek lewat browser.

### Kemampuan Google Maps (terverifikasi dari dokumen resmi)

| Kemampuan | Perangkat | Status |
|---|---|---|
| Citra satelit sampai rumah | `mapTypeId: HYBRID` | Ada |
| Zoom sampai z22 (Map Tiles API) | Tema satellite | Ada |
| Marker performa tinggi | AdvancedMarkerElement | Ada |
| Choropleth dari GeoJSON | Data Layer + declarative style | Ada |
| Statistik saat wilayah diklik | Data Layer click event | Ada |
| Choropleth 83.000 poligon desa | Data Layer | **Tidak memadai** |

Solusi level desa: skala bertingkat (provinsi saat zoom jauh, desa saat zoom
dekat) + penyederhanaan geometri.

### Biaya Google Maps (per 1.000 panggilan, harga global)

| SKU | Kategori | Gratis/bulan | Tier 1 | Catatan |
|---|---|---|---|---|
| Dynamic Maps | Essentials | 10.000 | $7,00 | roadmap **dan** hybrid sama |
| Map Tiles API: 2D Map Tiles | Essentials | 100.000 | $0,60 | hanya bila ambil tile mentah |
| Geocoding | Essentials | 10.000 | $5,00 | |
| Autocomplete Requests | Essentials | 10.000 | $2,83 | |
| Places API Text Search Essentials | Essentials | 10.000 | — | |
| Places API Nearby Search Pro | Pro | 5.000 | $32,00 | |
| Photorealistic 3D Tiles | Enterprise | 1.000 | $6,00 | cakupan Indonesia belum ada |
| Immersive Maps (3D di JS) | Pro | — | per load | |

Fakta penting:
* Yang dihitung adalah **successful map load**, bukan jumlah tile citra.
* Geser, zoom, dan ganti layer (roadmap ke satelit) **tidak dihitung ulang**.
* Marker data sendiri **tidak punya SKU** — tidak berbiaya.
* Kredit bulanan $200 sudah dihapus, diganti jatah gratis per-SKU 10.000/bulan.
* Pemain baru dapat trial credit $300.

### Batasan hukum (Terms of Service Google Maps Platform)

* Dilarang menyimpan, menyalin, atau me-rehost **konten Google** (nama/alamat
  bisnis dari Places, tile, geocode).
* Dilarang cache konten Google kecuali diizinkan secara eksplisit.
* Fitur **Place Add dan Place Delete sudah dimatikan** sejak 30 Juni 2018 —
  tidak ada cara program menambahkan tempat ke database Google.
* Menyimpan **data milik sendiri** (nama cabang, klinik, yayasan) diperbolehkan.

### Ketersediaan program gratis

| Program | Syarat | Manfaat |
|---|---|---|
| Jatah gratis per-SKU | Otomatis | 10.000 map load/bulan |
| Google for Nonprofits | Nirlaba terverifikasi | Kredit mulai $250/bulan |
| Google Cloud Startup Program | Startup terdaftar | Kredit |
| Google News Initiative | Media terverifikasi | Kredit mulai $250/bulan |
| Innovators Credits | **Tidak bisa mendaftar sendiri** — hanya bila dipilih Google | Kredit |
| Trial credit | Pelanggan baru | $300 sekali |

Starter $100/bln · Essentials $275/bln · Pro $1.200/bln (paket langganan).

### Stack CHNGMKR (hasil bedah, sebagai pembanding)

Netlify + React/Vite + Google Maps JS API (`maxZoom: 14`, roadmap) + Supabase +
Cloudflare Turnstile + GA4 + three-globe. Status gratis: semua komponen gratis
kecuali Google Maps (berbatas).

---

## Referensi: Proyek petadunia

Proyek `suwandhih/petadunia` (`C:\data\Peta dunia`) dipakai sebagai **contoh
saja**. Tidak diubah dan tidak disentuh.

Peran: sumber acuan pola yang sudah terbukti berjalan pada pemilik proyek.

| Aspek | Isi petadunia | Dipakai sebagai acuan? |
|---|---|---|
| Renderer peta | MapLibre GL (`js/lib/maplibre-gl.js`) | Ya |
| Citra satelit | Esri World Imagery, `maxzoom: 19` | Ya |
| Lapisan label | `World_Boundaries_and_Places` | Ya |
| Peta vektor | OpenFreeMap style `liberty` | Ya |
| Atribusi | `Citra: Esri, Maxar, Earthstar Geographics` | Ya — wajib ditiru |
| Struktur | `js/inti.js` + `js/lapisan/*.js` per kategori | Ya |
| Gaya bahasa | Seluruh UI berbahasa Indonesia | Ya |
| Berkas aturan | Sudah punya `agents.md` (mirip 7 aturan di sini) | Ya |

Kesimpulan pemeriksaan: fondasi yang dipakai petadunia **sudah tepat** dan
memenuhi seluruh syarat proyek ini (tanpa Google, biaya Rp0, citra sampai level
rumah, tanpa vendor lock).

### Belum dibaca

`prompt.md` dan `rencanakerja.md` milik petadunia belum ditinjau. Perlu ditinjau
agar tidak mengulang pekerjaan yang sudah selesai dan tidak melanggar aturan
yang sudah ditetapkan di sana.

### Kebutuhan yang belum ada di petadunia

| Kebutuhan | Status di petadunia |
|---|---|
| 8 kategori keadaan dunia (gempa, kebakaran, gunung, angin, hujan, penerbangan, suhu, awan) | Sudah ada |
| Kapal laut, kereta | Belum dibuat |
| Data penduduk / agama / suku per wilayah | Belum ada |
| Marker cabang / klinik / yayasan | Belum ada |
| Kontribusi data dari pengguna | Belum ada |

---

## Pertanyaan Terbuka (menunggu keputusan pemilik proyek)

| No | Pertanyaan | Dampak |
|----|-----------|--------|
| 1 | Sedalam apa cakupan wilayah yang dipakai? | Menentukan perlunya skala bertingkat untuk level desa |
| 2 | Sumber data resmi mana yang dipakai (BPS manual / BPS API / PODES)? | Menentukan perlu-tidaknya tabel pemetaan kode wilayah |
| 3 | Siapa yang boleh mengirim data, dan perlukah moderasi? | Menentukan rancangan jalur tulis & keamanan |
| 4 | Bagaimana membedakan data resmi vs data kontribusi pengguna? | Menentukan tingkat kepercayaan tampilan |

---

## Rincian Orderan 7 — Database Neon: data sama di PC dan HP (perintah 2026-10-16)

### Keadaan sebelum dikerjakan

Data anggota (orderan 17) hanya tersimpan di peramban masing-masing.
Akibatnya anggota yang diisi dari PC **tidak muncul** di HP, dan sebaliknya.

### Yang dikerjakan

| Butir | Isi | Status |
|---|---|---|
| 7a | Tabel database: `anggota`, `kategori`, `pengaturan` | ✅ |
| 7b | Peran database khusus `pemetaan_api` (hanya baca/tulis data, **tidak bisa** menghapus tabel) | ✅ |
| 7c | Worker Cloudflare `pemetaan-api` sebagai perantara — sandi database tidak pernah dikirim ke peramban | ✅ |
| 7d | Aplikasi disambungkan ke Worker (`js/simpanan.js`) **tanpa mengubah nama fungsi** | ✅ |
| 7e | Cadangan luring (IndexedDB) + antrean kirim ulang otomatis | ✅ |
| 7f | Penanda keadaan sambungan di panel anggota | ✅ |
| 7g | **Kode database** dimasukkan sekali per perangkat (PC & HP) — tidak ditanam di berkas publik | ✅ |
| 7h | Uji: tulis dari PC → baca dari peramban lain (mewakili HP) | ✅ |

### Catatan penting: Data API Neon TIDAK dipakai

Rencana semula memakai **Neon Data API**. Setelah ditelusuri, Data API
memerlukan **Neon Auth** (pendaftaran akun lewat web) sehingga
"**Anyone on the web can sign up for your app**" — tidak cocok untuk
data anggota yang bersifat internal.

Jalur yang dipakai: **Worker Cloudflare** (`pemetaan-api`) yang menyimpan
connection string Neon sebagai *secret*. Sandi tidak ada di berkas situs.

### Berkas yang dibuat (orderan 7)

| Berkas | Isi |
|---|---|
| `cloudflare/worker.js` | Worker perantara ke Neon. Aksi: `cek`, `ambilSemua`, `simpanAnggota`, `hapusAnggota`, `kosongkan`, `simpanKategori`, `hapusKategori`, `simpanAtur` |
| `cloudflare/wrangler.toml` | Konfigurasi Worker (`name = pemetaan-api`) |
| `cloudflare/package.json` | Pendaftaran pustaka `@neondatabase/serverless` |
| `alat/neon-siapkan.js` | Pembuat tabel + peran `pemetaan_api` (sekali pakai) |
| `js/simpanan.js` | **DIUBAH** — dari IndexedDB saja menjadi: Neon (utama) + IndexedDB (cadangan luring) + antrean |
| `js/member.js` | **DIUBAH** — penanda keadaan sambungan + isian kode database |
| `index.html` | **DIUBAH** — `#anggota-sambung`, `#anggota-kunci` |
| `css/gaya.css` | **DIUBAH** — gaya penanda sambungan + isian kode |

### Susunan tabel di Neon

| Tabel | Isi |
|---|---|
| `anggota` | 16 kolom: `id` (kunci), `nama`, `kategori`, `inisial`, `rincian` (jsonb), `lon`, `lat`, `kode_provinsi`, `kode_kabkota`, `kode_kecamatan`, `kode_desa`, `provinsi`, `kabkota`, `kecamatan`, `desa`, `dibuat`, `diubah` |
| `kategori` | `nama` (kunci) |
| `pengaturan` | `nama` (kunci), `nilai` |

Alamat Worker: `https://pemetaan-api.suwandhih.workers.dev`
Database: Neon `pemetaan` · cabang `production` · PostgreSQL 18.6 · region Singapura.

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Sambungan ke Neon | ✅ PostgreSQL 18.6 · pengguna `neondb_owner` · basis data `neondb` |
| Pembuatan tabel | ✅ `anggota, kategori, pengaturan` + 6 kategori awal |
| Pembuatan peran | ✅ `pemetaan_api` ada |
| Worker — baca (`cek`) | ✅ `{"ok":true,"pesan":"tersambung","jumlah":0}` |
| Worker — asal tidak dikenal | ✅ ditolak **403** (`Asal tidak diizinkan`) |
| Worker — tulis tanpa kunci | ✅ ditolak **401** (`Kunci aplikasi salah`) |
| Worker — tulis kunci salah | ✅ ditolak **401** |
| Worker — tulis kunci benar | ✅ **200** + data tersimpan |
| Worker — keterangan (`rincian`) | ✅ tersimpan sebagai daftar objek `{label, nilai}`, tidak jadi teks |
| Peran `pemetaan_api` — hapus tabel | ✅ **ditolak** — `must be owner of table kategori` |
| Peran `pemetaan_api` — buat tabel | ✅ **ditolak** — `permission denied for schema public` |
| Aplikasi — pemuatan pertama | ✅ tampil `Tersambung — data sama di HP dan PC` |
| Aplikasi — simpan anggota lewat form | ✅ masuk database (dicek lewat Worker terpisah) |
| Aplikasi — ubah anggota | ✅ perubahan tersimpan, `diubah` bertambah |
| Aplikasi — hapus anggota | ✅ hilang dari database (`jumlah` 0) |
| Aplikasi — ganti tingkat pengelompokan | ✅ tersimpan di tabel `pengaturan` (`anggota_tingkat = provinsi`) |
| Aplikasi — penyimpanan peramban dikosongkan | ✅ data **tetap muncul** (berarti diambil dari Neon, bukan peramban) |
| Aplikasi — kunci belum diisi | ✅ tulisan `Belum tersambung — kode database belum diisi` + isian kunci tampil |
| Aplikasi — kunci diisi | ✅ `Tersambung. 1 anggota di database.` + isian kunci tersembunyi |
| Penanda peta | ✅ sumber `anggota` berisi 2 fitur, lapisan `anggota-lingkaran` & `anggota-huruf` |
| Galat konsol | ✅ 0 |

### Bug yang ditemukan & diperbaiki

| No | Bug | Sebab | Perbaikan |
|---|---|---|---|
| 1 | Keterangan anggota tampil `[object Object]` | Worker mengubah keterangan jadi teks; aslinya daftar `{label, nilai}` | `senarai()` di Worker menyimpan bentuk aslinya |
| 2 | Panel anggota kosong tanpa galat | `indexedDB.open` tertahan (ada tab lain memegang database), tidak pernah dipanggil `selesai()` | Batas waktu 4 detik + tangani `onblocked` |
| 3 | Tingkat pengelompokan tidak kembali saat pindah perangkat | `ambilAtur()` membaca penyimpanan peramban sebelum data database selesai dimuat | `ambilAtur()` menunggu `ambilSemua()` selesai |
| 4 | Kunci aplikasi tadinya ada di berkas publik | — | Kunci dipindah ke isian sekali-pakai per perangkat |

### Hal yang perlu diketahui pemilik proyek

- **Kode database** (diperlukan di PC dan HP):
  `PMA-f2b1dd4810764520bce0a413`
  Masukkan satu kali lewat panel **☰ Anggota** → isian "Kode database".
  Setelah itu tidak perlu diisi lagi di perangkat tersebut.
- Sandi database Neon **tidak dapat dibaca** dari konsol (tersimpan di
  secure vault). Untuk keperluan pemeliharaan, sandi dapat direset dari
  Neon Console → **Roles → Reset password**, lalu secret `DATABASE_URL`
  Worker diganti dengan `npx wrangler secret put DATABASE_URL`.
- Data yang sudah ada di HP/PC **tidak otomatis pindah**. Setelah kode
  dimasukkan, data lama di peramban akan terlihat sampai data dari
  database dimuat, lalu yang tampil adalah isi database.

### Uji tambahan di situs live GitHub Pages (2026-10-16)

| Uji | Hasil |
|---|---|
| Halaman live memuat berkas versi `?v=20261016-06` | ✅ 9 penanda versi, semua `200` |
| Panel anggota di situs live | ✅ isian kode tampil, tulisan `Belum tersambung — kode database belum diisi` |
| Kode dimasukkan di situs live | ✅ `Tersambung — data sama di HP dan PC` |
| Tulis dari peramban lain (mewakili HP) | ✅ `Anggota dari HP` (KOTA SURABAYA) & `Anggota dari PC` (KOTA JAKARTA PUSAT) |
| Baca di peramban ini | ✅ **kedua anggota tampil**, pengelompokan per provinsi benar |
| Penanda di peta | ✅ 2 penanda terpasang |
| Data uji dibersihkan | ✅ `jumlah: 0` |

---

## Perbaikan Orderan 7 — penjelasan "data lama tidak otomatis pindah" (perintah 2026-10-16)

### Pertanyaan pemilik proyek

"Setiap data disimpan pasti otomatis ke Neon, dan tampil di PC dan HP
pasti sama isi datanya — benar?"

### Jawaban

**Benar, sejak sekarang.** Setiap kali tombol **Simpan** ditekan, data
langsung dikirim ke Neon. Tidak ada lagi data yang hanya tersimpan di
satu perangkat.

Yang dimaksud kalimat "data lama tidak otomatis pindah" hanya berlaku
untuk data yang **sudah tersimpan SEBELUM kunci dimasukkan** di
perangkat itu. Contoh: anggota yang pernah diisi dari HP pada orderan 17.
Data itu ada di peramban HP, belum pernah dikirim ke Neon, jadi tidak
muncul di PC.

Setelah kunci dimasukkan (sekali per perangkat), seluruh data baru
otomatis masuk Neon. Data baru dari HP langsung tampil di PC.

### Perbaikan yang dikerjakan

| No | Masalah | Perbaikan |
|---|---|---|
| 1 | Isi peramban lama ikut ditampilkan sebelum kunci diisi, sehingga pemakai mengira data sudah sama padahal belum | Sebelum kunci diisi, daftar **sengaja dikosongkan** + diberi keterangan "Setelah kode database diisi di atas, daftar anggota akan dimuat dari database" |
| 2 | Worker masih mengizinkan **membaca** tanpa kunci — siapa pun yang tahu alamatnya bisa melihat data anggota | Kunci aplikasi kini **wajib untuk semua permintaan**, termasuk membaca |

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Sebelum kunci diisi | ✅ daftar kosong + keterangan "akan dimuat dari database", tidak menampilkan sisa data peramban |
| Sesudah kunci diisi | ✅ dimuat dari database, `0 anggota` (database memang kosong) |
| Simpan lewat form aplikasi | ✅ langsung muncul di database (dicek terpisah: `Uji Sinkron` \\| BADUNG) |
| Muat ulang halaman | ✅ data tetap tampil dari database |
| Worker tanpa kunci | ✅ ditolak **401** |
| Worker kunci salah | ✅ ditolak **401** |
| Worker kunci benar | ✅ **200**, 1 anggota |
| Data uji dibersihkan | ✅ `sisa: 0` |

### Kunci database (diperlukan sekali per perangkat)

`PMA-f2b1dd4810764520bce0a413`

---

## Perbaikan tampilan — daftar pilihan wilayah tidak terbaca (perintah 2026-10-16)

### Keluhan pemilik proyek

"Daftar pilihan provinsi, kab/kota, kecamatan, desa tidak bisa dilihat.
Kalau latar daftar putih, teksnya jangan warna cerah — habis tenggelam."

### Sebab

Daftar pilihan (`<select>`) digambar oleh peramban, bukan oleh halaman.
Chrome memakai **latar putih** untuk daftarnya, sedangkan warna teks
diambil dari aturan `.fa-pilih` yaitu **terang** (`#e8eef5`) — jadi nama
wilayah putih di atas latar putih, tidak terbaca.

Bukti dari gambar yang dikirim: tulisan "KEPULAUAN RIAU", "MALUKU",
"SULAWESI BARAT" dan seterusnya tampak samar.

### Perbaikan

| Berkas | Perubahan |
|---|---|
| `css/gaya.css` | `.fa-pilih` dan `select.fa-input` diberi `color-scheme: dark`; `option`/`optgroup` dipatok latar `#182029` teks `#e8eef5`; opsi terpilih `#1f6feb` teks putih |
| `index.html` | Penanda versi naik ke `?v=20261016-08` |

`color-scheme: dark` memberi tahu peramban bahwa kendali ini bertema
gelap, sehingga daftarnya digambar gelap. Aturan `option` dipasang
sebagai jaring pengaman untuk peramban yang mengabaikannya.

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| `color-scheme` pada 4 pemilih wilayah | ✅ `dark` |
| Warna `option` wilayah | ✅ teks `rgb(232,238,245)` di atas latar `rgb(24,32,41)` |
| `color-scheme` pada pemilih Kategori | ✅ `dark`, opsi terpilih `rgb(31,111,235)` |
| Pilihan bertingkat masih bekerja | ✅ pilih BALI → 9 kabupaten; pilih BANGKALAN → penduduk 1.042.031 jiwa |
| Tangkapan layar form | ✅ nama wilayah terbaca jelas |

---

## Perbaikan — pilihan kecamatan & desa/kelurahan kosong (perintah 2026-10-16)

### Keluhan pemilik proyek

"Kecamatan dan desa/kelurahan kosong, belum diisi."

### Sebab

Berkas data kecamatan (38 berkas) dan desa (514 berkas, 71 MB) tidak
dimuat saat aplikasi dibuka — terlalu berat. Sebelumnya berkas ini hanya
dimuat oleh **peta tematik** saat pemakai membuka tingkat itu. Form
anggota membaca daftar yang sudah dimuat itu, jadi selama peta tematik
belum pernah dibuka di tingkat tersebut, pilihannya kosong.

### Perbaikan

| Berkas | Perubahan |
|---|---|
| `js/member.js` | Form anggota kini **memuat sendiri** berkas kecamatan & desa saat wilayah dipilih |
| `index.html` | Penanda versi naik ke `?v=20261016-09` |

Cara kerjanya:

| Pilihan | Berkas yang dimuat | Ukuran |
|---|---|---|
| Provinsi dipilih | `kec-<provinsi>.js` | ±100–200 KB |
| Kabupaten/kota dipilih | (kecamatan sudah dimuat di langkah sebelumnya) | — |
| Kecamatan dipilih | `desa-<kabupaten tanpa titik>.js` | ±70–250 KB |

Tambahan:
- Pemilih menampilkan tulisan "**— memuat daftar kecamatan… —**" selama
  berkas diunduh, supaya tidak terlihat seperti kerusakan.
- Bagian yang sudah diunduh disimpan di kunci `window` sendiri
  (`WARNA_KEC_51`, `WARNA_DESA_5103`) sehingga tidak saling menimpa bila
  pemakai berpindah-pindah wilayah.
- Berkas yang gagal dimuat ditandai kosong supaya tidak dicoba berulang.

### Bug ditemukan & diperbaiki

| No | Bug | Sebab | Perbaikan |
|---|---|---|---|
| 1 | Permintaan `kecamatan-51.js` → **404** | Nama berkas sebenarnya `kec-51.js` dan `desa-5103.js` (singkatan, tanpa titik) | Tabel nama berkas disesuaikan |

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Pilih BALI | ✅ kecamatan dimuat sendiri dari `kec-51.js` |
| Pilih BADUNG | ✅ 7 kecamatan: ABIANSEMAL, KUTA, KUTA SELATAN, KUTA UTARA, MENGWI, PETANG |
| Pilih ABIANSEMAL | ✅ 19 desa: ABIANSEMAL, ABIANSEMAL DAUH YEH CANI, ANGANTAKA, AYUNAN, BLAHKIUH, … |
| Keterangan penduduk | ✅ "Kecamatan ini berpenduduk 100.001 jiwa · KK 28.229 · luas 67 km² · kepadatan 1.493 jiwa/km²" |
| Simpan anggota 4 tingkat | ✅ tersimpan lengkap di Neon: `51` / `51.03` / `51.03.03` / `51.03.03.2005` — BALI / BADUNG / ABIANSEMAL / ANGANTAKA |
| Pengelompokan tingkat desa | ✅ grup **ANGANTAKA · ABIANSEMAL** |
| Data uji dibersihkan | ✅ `jumlah: 0` |

---

## Perbaikan tata letak bilah (perintah 2026-10-16)

### Pertanyaan & permintaan pemilik proyek

1. "Di gambar, saya lingkar merah — tulisan `Perairan / negara tetangga` itu apa?"
2. "Menu anggota dipindahkan ke atas, karena judulnya terpotong jadi `☰ Ang`."
3. "Di atas masih ada ruang bila tulisan atas kanan dihilangkan."

### Jawaban pertanyaan 1

Itu **nama wilayah yang sedang dilihat**, bukan cacat. Peta mencari nama
wilayah menurut titik tengah layar; karena Indonesia dan negara tetangga
saja belum mencakup seluruh dunia, titik tengah yang jatuh di luar
wilayah yang dikenal ditulis "Perairan / negara tetangga".

Buktinya ada di `js/inti.js` fungsi `namaWilayah()` — daftar wilayah
mencakup Indonesia + negara tetangga saja, sisanya dianggap perairan.

### Perubahan

| No | Permintaan | Yang dikerjakan |
|---|---|---|
| 1 | Tulisan panjang di atas kanan | Nama wilayah **dihilangkan** dari bilah atas. Fungsi masih ada (dipakai peta tematik), jadi tidak ada yang rusak |
| 2 | Menu Anggota dipindahkan ke atas | Tombol **☰ Anggota** dipindah dari ujung **kanan** bilah bawah ke ujung **kiri** — tutupnya (✕) ada di kiri, jadi konsisten |
| 3 | Tulisan `☰ Ang` terpotong | Sebabnya lebar tetap 44 px dari aturan umum `#bilah-bawah button`. Dipakai `width: auto` khusus tombol ini → kini **81 px**, tulisan utuh |

Tambahan: nama wilayah yang panjang (mis. "Kalimantan Barat") kini
dipotong dengan "…" bila tidak muat, tidak lagi menekan tombol peta.

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Tulisan `Perairan / negara tetangga` | ✅ hilang dari bilah atas (unsur `#wilayah` sudah tidak ada) |
| Bilah atas | ✅ hanya 2 tombol: `Citra Satelit` (117 px) + `Tanpa warna` (122 px) — ada ruang sisa |
| Posisi tombol Anggota | ✅ ujung **kiri** bilah bawah |
| Tulisan tombol | ✅ `☰ Anggota` utuh, lebar **81 px**, `potong: false` |
| Galat halaman | ✅ **0** (sempat muncul galat `elWilayah` null, sudah diperbaiki dengan pemeriksaan) |

---

## Perbaikan tampilan penanda anggota (perintah 2026-10-16)

### Keluhan pemilik proyek

"Hasil input member yang tampil di peta sebaiknya tidak menutupi nama
lokasi. Saya pikir tulisan `OB` dibuat dot-garis dan kolom `OB` atau
bulat — hindari menimpa nama lokasi."

### Keadaan sebelum

Penanda anggota berupa **satu bulatan berwarna** yang menempel tepat di
titik lokasi. Karena peta dasar Esri sudah memuat nama tempat
("Bandung", "Surabaya") sebagai bagian dari gambarnya, bulatan itu
menutupi nama tempat.

### Perbaikan

Bentuk penanda diganti mengikuti usulan pemilik proyek:

```
   ( OB )    ← bulatan putih, cincin warna kategori, berisi kode anggota
     •       ← garis putus-putus (dua titik)
     •       ←    "
     ●       ← titik kecil tepat di lokasi
```

| Butir | Keterangan |
|---|---|
| Titik lokasi | radius 3 px, warna kategori — lokasi tetap tepat |
| Garis putus-putus | dua titik 1,6 px pada 10 px dan 18 px di atas lokasi |
| Bulatan | radius 9,5 px, **latar putih** + cincin warna kategori 2,5 px, naik 27 px di atas lokasi |
| Kode anggota | 10 px, warna gelap di dalam bulatan |

Latar bulatan diubah jadi **putih dengan cincin warna**, bukan bulatan
berwarna penuh — supaya tetap terbaca di atas citra satelit gelap maupun
peta terang.

### Usaha yang dicoba lalu dibatalkan

Sempat dicoba menambahkan lapisan label dari sumber ubin vektor
OpenFreeMap supaya nama tempat bisa dikendalikan. **Dibatalkan** karena
dua sebab:

1. Lapisannya kosong — nama lapisan pada sumber itu bukan `place`,
   sehingga tidak ada tulisan yang muncul.
2. Kalau berhasil pun akan membuat **tulisan ganda** dengan label yang
   menyatu di citra Esri.

### Yang dipakai sebagai gantinya

Pengaturan tumpang-tindih MapLibre. Lapisan `anggota-huruf` dibuat
**paling akhir** sehingga diproses lebih dulu; tempat yang dipakai
penanda ditandai `hasOffscreen` dan label peta dasar yang datang
kemudian **tidak digambar di situ**. Hasilnya nama tempat tetap terbaca
dan kode anggota tetap terlihat.

### Catatan MapLibre

`circle-translate` dan `text-offset` **tidak bisa berbeda per anggota**
(bukan *paint* yang boleh memakai data). Jadi jarak bulatan ke titik
lokasi sama untuk semua anggota. `text-offset` memakai satuan em =
ukuran huruf, sehingga -2,7 em × 10 px = 27 px, sama dengan pergeseran
bulatannya.

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Lapisan terpasang | ✅ `anggota-titik`, `anggota-putus-1`, `anggota-putus-2`, `anggota-lingkaran`, `anggota-huruf` |
| Data penanda | ✅ 3 fitur (OB, BD, SB) |
| `text-allow-overlap` | ✅ `false` — penanda mengalah pada label peta dasar |
| Tampilan di Bandung (z8,6) | ✅ bulatan **BD** di atas, titik lokasi tepat di bawahnya, nama "**Bandung**" tetap terbaca |
| Tampilan di Jepara (z8) | ✅ titik lokasi di pantai, bulatan **OB** di atasnya, nama tempat sekitar tetap terbaca |
| Galat halaman | ✅ 0 |
| Data uji dibersihkan | ✅ tinggal 1 anggota milik pemilik proyek |

### Temuan sampingan (bukan cacat)

Saat menguji, citra di sekitar Bandung tampak **berwarna merah**. Ternyata
itu **lapisan tematik kepadatan penduduk** (merah = kepadatan tinggi),
bukan kerusakan. Setelah pilihan warna dikembalikan ke "Tanpa warna",
citra tampil normal.

---

## Anti-tumpuk penanda + garis penghubung lebih jelas (perintah 2026-10-16)

### Permintaan pemilik proyek

1. "Sekarang saja dibuat anti tumpuk — karena masalah ini akan terjadi
   pada saat data banyak masuk."
2. "Garis terlalu kecil — perlu terlihat dan dimengerti user."

### 1. Anti-tumpuk (klaster)

Sumber data penanda diberi `cluster: true`:

| Pengaturan | Nilai | Arti |
|---|---|---|
| `cluster` | `true` | titik berdekatan digabung otomatis |
| `clusterRadius` | 62 px | jarak maksimum untuk dianggap berdekatan |
| `clusterMaxZoom` | 16 | di atas zoom ini tidak ada penggabungan lagi |

Tampilan klaster dibuat **sama bentuknya** dengan penanda tunggal —
titik kecil di lokasi, garis putus-putus, lalu bulatan biru berisi jumlah
anggota. Dengan begitu pemakai melihat satu bentuk yang konsisten.

Ukuran bulatan klaster mengikuti jumlah: 13 px (< 10 anggota), 16 px
(≥ 10), 20 px (≥ 50).

**Ketukan pada bulatan klaster** → peta mendekat sendiri sampai anggotanya
terpisah satu per satu (`getClusterExpansionZoom`).

### 2. Garis penghubung

| Sebelum | Sesudah |
|---|---|
| 2 titik, radius 1,6 px | **4 titik**, radius **2,2 px** |
| isi warna kategori (samar) | **inti putih + cincin warna 1,6 px** |
| jarak 10 & 18 px, bulatan 27 px | jarak 5, 11, 17, 23 px, bulatan **34 px** |
| bulatan radius 9,5 px, cincin 2,5 px | bulatan radius **10 px**, cincin **3 px** |

Alasan diganti inti putih + cincin: garis berwarna tipis di atas citra
satelit yang ramai jadi tenggelam. Putih membuatnya menonjol di peta
gelap maupun terang.

Seluruh pergeseran memakai satuan **pixel** (`circle-translate`,
`text-offset`), jadi ukurannya **tetap sama di semua tingkat zoom** —
tidak mengecil saat peta diperbesar.

### Bukti uji (2026-10-16, dijalankan sendiri)

Diuji dengan 15 anggota buatan: 12 buah berdesakan dalam 0,012° di
Bandung, 3 buah berdesakan di Surabaya.

| Uji | Hasil |
|---|---|
| Lapisan terpasang | ✅ `anggota-titik`, `anggota-tumpuk`, `anggota-tumpuk-titik`, `anggota-tumpuk-putus-1`, `anggota-tumpuk-putus-2`, `anggota-tumpuk-angka`, `anggota-putus-1..4`, `anggota-lingkaran`, `anggota-huruf` |
| z5 (jauh) | ✅ 12 anggota → **1 klaster "12"**; 3 anggota → **1 klaster "3"** |
| z13 (dekat) | ✅ klaster pecah jadi beberapa klaster kecil (2, 2, 3, 2, 2, 2) — tidak ada yang bertumpuk |
| Bentuk klaster | ✅ titik + garis putus-putus + bulatan biru "12", sama seperti penanda tunggal |
| Penanda tunggal | ✅ bentuk tetap: titik, 4 titik garis, bulatan **OB** |
| Nama tempat | ✅ "Bandung", "Semarang", "Surabaya", "Cirebon" tetap terbaca |
| Galat halaman | ✅ 0 |
| Data uji dibersihkan | ✅ tinggal 1 anggota milik pemilik proyek |

### Catatan

Jumlah anggota tidak dibatasi — klaster inilah yang menjaga tampilan tetap
terbaca walau anggotanya ribuan. Yang perlu diperhatikan hanya kecepatan
unduh data awalnya (satu permintaan `ambilSemua`); bila nanti jumlah
anggota sudah sangat besar, data bisa diambil bertahap menurut wilayah
yang sedang terlihat.

---

## Tombol tampil / sembunyi penanda anggota (perintah 2026-10-16)

### Permintaan pemilik proyek

"Kalau saya mau hide/unhide data member pada peta belum ada — perlu ada
tombol on/off untuk member."

### Yang dibuat

Tombol **👁** di kepala panel **☰ Anggota**, di antara `+ Anggota` dan
tombol tutup (✕).

| Keadaan | Tampilan tombol | Arti |
|---|---|---|
| Penanda tampil | biru terang, `aria-pressed="true"` | penanda digambar di peta |
| Penanda sembunyi | redup, `aria-pressed="false"` | penanda disembunyikan |

Tooltip tombol ikut berganti: "Sembunyikan penanda anggota di peta" /
"Tampilkan penanda anggota di peta".

### Cara kerjanya

Seluruh 12 lapisan penanda (`anggota-titik`, `anggota-tumpuk`,
`anggota-lingkaran`, `anggota-huruf`, dan garis-garis penghubung)
digilir dan diberi `visibility: visible/none` memakai
`setLayoutProperty`.

**Yang disembunyikan hanya penandanya di peta.** Daftar anggota di panel
tetap lengkap — `3 anggota` tetap tampil dan semuanya masih bisa
diubah. Jadi tombol ini mengatur tampilan peta, bukan menghapus data.

Pilihan **diingat** di tabel `pengaturan` database (kunci
`anggota_tampil`), jadi keadaan terakhir bertahan walau halaman ditutup
atau dibuka dari perangkat lain.

### Satu hal yang perlu dijaga

Mengganti jenis peta (orderan 15) membuang **seluruh** lapisan lalu
membuatnya kembali. Tanpa penanganan khusus, penanda yang sedang
disembunyikan akan muncul lagi. Karena itu keadaan tampil/sembunyi
dipasang ulang setiap kali `gambarPenanda()` selesai.

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Tombol ada | ✅ `#anggota-tampil` muncul di kepala panel |
| Keadaan awal | ✅ `aria-pressed="true"`, `anggota-lingkaran: visible` |
| Ditekan → sembunyi | ✅ `aria-pressed="false"`, `anggota-lingkaran/titik/huruf/tumpuk: none` |
| Daftar tetap utuh | ✅ tetap `3 anggota`, anggota masih bisa diubah |
| Ditekan lagi → tampil | ✅ ketiga lapisan kembali `visible` |
| Muat ulang halaman | ✅ tetap tersembunyi (diingat dari database `anggota_tampil = 0`) |
| Ganti jenis peta ke Peta Jalan | ✅ lapisan dibuat ulang dan **tetap tersembunyi** |
| Tampilan di peta | ✅ penanda **ON** terlihat di Bandung saat menyala |
| Galat halaman | ✅ 0 |
| Data uji | ✅ dibersihkan, pengaturan dikembalikan ke `anggota_tampil = 1` |

---

## Pindahkan tombol tampil/sembunyi anggota ke bilah atas halaman peta (perintah 2026-10-16)

### Permintaan pemilik proyek

"Sebenarnya tadinya bermaksud tombol hide/unhide mudah dijangkau —
artinya ada di home atau page peta. Saya kurang setuju harus klik 2x
untuk on/off, kurang standar."

### Perubahan

| Berkas | Perubahan |
|---|---|
| `index.html` | Tombol `#anggota-tampil` (`👁 Anggota`) dipindahkan dari dalam `#panel-anggota` langsung ke `#bilah-atas` (kanan atas halaman peta). Penanda versi naik ke `?v=20261016-14` |
| `css/gaya.css` | `#anggota-tampil` diberi `margin-left: auto`, tinggi 28 px seragam dengan tombol bilah atas lainnya, biru terang saat aktif dan redup + teks dicoret saat nonaktif |

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Letak tombol | ✅ langsung di `#bilah-atas` sebelah kanan (`👁 Anggota`, lebar 84 px, `potong: false`) |
| Lebar 3 tombol di bilah atas | ✅ 108 px + 122 px + 84 px = 314 px dari 428 px (masih ada ruang kosong, tidak berhimpitan) |
| Klik 1x dari halaman peta → OFF | ✅ `aria-pressed="false"`, penanda `OB` langsung hilang (`visibility: none`), tombol redup & dicoret |
| Klik 1x lagi → ON | ✅ `aria-pressed="true"`, penanda `OB` langsung muncul kembali (`visibility: visible`) |
| Galat halaman | ✅ 0 |

---

## Pembenahan menu di atas peta (perintah 2026-10-16)

### Permintaan pemilik proyek

1. `[Citra Satelit]` diubah menjadi `[Satelit]`
2. `[Peta Jalan]` diubah menjadi `[Map]`
3. `Peta Gelap` dan `Peta Medan` dihapus
4. `[Tanpa warna]` diganti `[Populasi 👁]` — klik pilih ON, klik lagi OFF
5. Tombol `[Anggota][👁]` di bilah atas

### Perubahan

| Berkas | Perubahan |
|---|---|
| `js/inti.js` | Daftar `JENIS` diringkas jadi 2 opsi: `Satelit` (`id: 'satelit'`) dan `Map` (`id: 'jalan'`); `Peta Gelap` & `Peta Medan` dihapus |
| `js/warna.js` | Tombol `#tombol-warna` menampilkan `Populasi 👁`. Saat OFF (`aktif === 'tanpa'`), klik membuka daftar 4 tingkat (`Provinsi`, `Kabupaten/Kota`, `Kecamatan`, `Desa/Kelurahan`) → pilih tingkat → ON (`aria-pressed="true"`). Saat ON, klik lagi langsung OFF (`ganti('tanpa')`) |
| `index.html` | Bilah atas memuat `[Satelit ▾]`, `[Populasi 👁]`, dan `#grup-anggota` (`[Anggota][👁]`). Bilah bawah kembali berisi `◀`, `#posisi`, `▶`. Penanda versi naik ke `?v=20261016-15` |
| `css/gaya.css` | Gaya `#tombol-warna[aria-pressed="true"]`, `#grup-anggota`, `#tombol-anggota`, dan `#anggota-tampil` di bilah atas |

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Pilihan jenis peta | ✅ hanya 2: `["Satelit", "Map"]` |
| Tampilan tombol Populasi saat OFF | ✅ `Populasi 👁`, `aria-pressed="false"` |
| Klik `Populasi 👁` → pilih `Provinsi` | ✅ `aria-pressed="true"`, 38 fitur provinsi tergambar (ON) |
| Klik lagi `Populasi 👁` | ✅ langsung OFF (`aria-pressed="false"`, `dropdownTerbuka: false`, `fiturWilayah: 0`) |
| Ukuran bilah atas | ✅ `Satelit` (88 px) + `Populasi 👁` (82 px) + `Anggota` (67 px) + `👁` (30 px) = 267 px dari 428 px, `potong: false` |
| Galat halaman | ✅ 0 |

---

## Fitur Tambah / Ubah / Hapus Kategori Anggota (perintah 2026-10-16)

### Pertanyaan & permintaan pemilik proyek

"Kategori member (Kesehatan, Sekolah) diinput di mana atau add, edit,
delete?"

### Yang dibuat

Pengelola kategori (`#anggota-kategori-panel`) yang bisa dibuka dari
**dua tempat**:

1. **Dari Daftar Anggota (`#panel-anggota`):** klik tombol **`Kategori`**
   di kepala panel (sebelah `+ Anggota`).
2. **Dari Form Tambah/Ubah Anggota (`#form-anggota`):** klik tombol
   **`Kelola`** tepat di sebelah label `Kategori`.

### Fungsi lengkap (tersinkron ke database Neon)

| Fungsi | Cara pakai | Perilaku |
|---|---|---|
| **Tambah (Add)** | Ketik nama di kotak `Nama kategori baru…` → klik **`+ Tambah`** (atau tekan Enter) | Disimpan ke tabel `kategori` di Neon, langsung muncul di daftar dan terpilih di dropdown `#fa-kategori` |
| **Ubah (Edit)** | Klik langsung pada **nama kategori** (mis. `Sekolah`) | Muncul isian nama baru; seluruh anggota yang memakai kategori lama otomatis diperbarui kategorinya di Neon |
| **Hapus (Delete)** | Klik tombol **`✕`** di sebelah kanan nama kategori | Jika masih dipakai oleh anggota, penghapusan ditolak dengan peringatan jumlah anggota yang memakainya; jika kosong, dihapus dari Neon |

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Buka panel kategori | ✅ menampilkan 6 kategori: `Kesehatan, Lainnya, Pemerintahan, Sekolah, Sosial, Yayasan` |
| Tambah kategori `Olahraga` | ✅ masuk daftar & dropdown `#fa-kategori` (7 kategori) |
| Ubah `Olahraga` → `Koperasi` | ✅ berubah menjadi `Koperasi` di daftar & Neon |
| Coba hapus `Yayasan` (sedang dipakai 1 anggota) | ✅ ditolak: `"Tidak bisa dihapus — masih dipakai 1 anggota. Ubah dulu kategori anggotanya."` |
| Hapus `Koperasi` (tidak dipakai) | ✅ terhapus dari daftar & Neon, kembali 6 kategori |
| Buka dari dalam Form (`Kelola`) | ✅ kotak kelola muncul langsung di bawah pilihan Kategori di dalam form |

---

## Perbaikan Kelola Kategori — tanpa popup & layar kerja bersih (perintah 2026-10-16)

### Permintaan pemilik proyek

1. "Jangan sistem popup untuk edit — misal klik Kesehatan: kolom `Nama kategori baru… [+ Tambah]` jika menambah kategori baru, di tempat yang sama di kolom tersebut muncul `Kesehatan [Edit][Del]`."
2. "Kalau pilih Kategori, di background masih ada form + Anggota itu sangat mengganggu; di bawah `Nama kategori baru… [+ Tambah]` ada daftar data yang diinput — disangka ada hubungan dengan kategori padahal tidak. Jadi pilih Kategori layar kerja dibersihkan."

### Perubahan

| Berkas | Perubahan |
|---|---|
| `index.html` | Baris input kategori memiliki `#kat-baru` beserta 3 tombol di tempat yang sama: `#kat-tambah` (`+ Tambah`), `#kat-ubah` (`Edit`), dan `#kat-hapus` (`Del`). Penanda versi naik ke `?v=20261016-20` |
| `js/member.js` | Seluruh popup `prompt()`/`confirm()` pada kategori dihapus. Saat belum ada kategori dipilih: tampil `Nama kategori baru… [+ Tambah]`. Saat kategori diklik (mis. `Kesehatan`): kotak yang sama terisi `Kesehatan` dengan tombol `[Edit][Del]`. Saat `Kategori` dibuka (`bukaModeKategori(true)`): form `+ Anggota` ditutup dan layar kerja dibersihkan |
| `css/gaya.css` | `#panel-anggota.mode-kategori` menyembunyikan `#anggota-tambah`, `#anggota-jumlah`, `#anggota-tingkat`, dan `#anggota-daftar` sehingga di bawah kotak kategori benar-benar bersih |

### Bukti uji (2026-10-16, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Buka `Kategori` | ✅ layar kerja bersih (`tombolTambahAnggotaTampil: false`, `daftarAnggotaTampil: false`) |
| Mode awal (tambah) | ✅ kotak kosong + tombol `[+ Tambah]` (`btnTambahTampil: true`, `btnEditTampil: false`, `btnDelTampil: false`) |
| Klik `Kesehatan` | ✅ kotak yang sama terisi `"Kesehatan"` + tombol berganti `[Edit][Del]` (`btnTambahTampil: false`, `btnEditTampil: true`, `btnDelTampil: true`) |
| Tambah `Olahraga` → klik `Olahraga` → ubah jadi `Koperasi` → klik `[Edit]` | ✅ berubah tanpa popup |
| Klik `Koperasi` → klik `[Del]` | ✅ terhapus tanpa popup |

---

## Catatan Rencana Kerja Berikutnya (dicatat 2026-10-16 malam untuk dilanjutkan besok)
1. **Orderan 18 — Form Tambah Anggota + Peta di bawah form isian:**
   - Saat mengisi form `Tambah Anggota`, peta ditempatkan/terlihat di bawah form isian agar berfungsi aktif.
   - Saat pilih **Provinsi** → peta otomatis bergerak & tampil fokus pada provinsi tersebut.
   - Saat pilih **Kabupaten/Kota** → peta otomatis masuk lebih dalam ke bagian kabupaten/kota tersebut.
   - Saat pilih **Kecamatan** → peta otomatis fokus pada kecamatannya.
   - Saat pilih **Desa/Kelurahan** → peta otomatis fokus pada desa/kelurahannya.

2. **Orderan 19 — Fitur Cari `[⌕]`:**
   - Menambahkan fitur pencarian `[⌕]` untuk mencari lokasi/wilayah maupun mencari anggota/yayasan yang sudah diinput.

---

## Orderan 22 — Tampilan PC lebar / responsive (perintah 2026-10-17)

### Ralat dari pemilik proyek

> "Tampilan PC dan HP sama … dalam permintaan ditolak. PC harus lebar dan HP
> sama seperti sekarang. Jadi katanya dimasukkan sistem responsive. Di PC lebar
> tidak perlu scroll kiri kanan. HP sama seperti sekarang — hanya jika HP
> memiliki layar lebih lebar tampilkan lebih lebar, tapi jangan tampil peta jadi
> kecil; sama atau mirip sekarang ini, kalau tidak muat cara dengan scroll kiri
> dan kanan."

Keputusan tambahan (2026-10-17): di PC peta **memenuhi tinggi layar** —
tanpa ruang kosong di atas/bawah. Alasan pemilik proyek: kalau seluruh
Indonesia dipaksa masuk layar, petanya jadi terlalu kecil dan pengguna tetap
akan memperbesar; lebih baik peta selalu terlihat penuh.

### Yang berubah

| Berkas | Perubahan |
|---|---|
| `css/gaya.css` | Blok `@media (min-width: 900px)` di **akhir berkas** (supaya menang atas aturan dasar): bingkai selebar layar tanpa batas; `#panel-anggota` & `#form-anggota` jadi kolom 380 px di sisi kiri (`--lebar-panel`); peta, bilah atas/bawah, dan keterangan digeser ke kanan selama kolom terbuka memakai `:has()` |
| `js/member.js` | Catatan kepala berkas disesuaikan (form bukan lagi selalu lembar bawah) |
| `index.html` | Penanda versi naik ke `?v=20261017-01`; komentar jenis peta disesuaikan (gelap & medan sudah dihapus) |

### Cara kerjanya

| Lebar layar | Yang berlaku |
|---|---|
| < 900 px (HP) | **Tidak berubah sama sekali.** Bingkai `min(100%, 430px)`; kalau layar HP lebih lebar dari 430 px, peta tetap 430 px dan sisanya di-scroll kiri-kanan |
| ≥ 900 px (PC) | Bingkai selebar layar; peta memenuhi tinggi layar; kolom anggota/form di kiri 380 px; peta menyusut ke sisa lebar sehingga **tidak tertutup** kolom |

Peta **tidak** digeser memakai `transform` — lebar `#peta` benar-benar
menyusut, jadi MapLibre menghitung ulang ukurannya sendiri (ada
`ResizeObserver` di dalam MapLibre 5.9.0). Akibatnya tidak ada bagian peta
yang tersembunyi di balik kolom.

### Bukti uji (2026-10-17, dijalankan sendiri)

Diuji lewat server lokal `python -m http.server` di `127.0.0.1:8777`.

| Uji | Hasil |
|---|---|
| PC 1152×720, kolom tertutup | ✅ bingkai 1152×720 · peta 1152×720 · kanvas 1152×720 (penuh, tanpa ruang kosong) |
| PC, panel Anggota dibuka | ✅ panel `[0, 380]` · peta `[380, 772]` · kanvas **772×720** (menyusut, tidak tertutup) |
| PC, form Tambah Anggota dibuka | ✅ form `[0,0,380,720]` · `max-height: none` · peta `[380, 772]` · kanvas 772×720 |
| PC, kolom ditutup lagi | ✅ peta kembali `[0, 1152]` · kanvas 1152×720 |
| Menu `Populasi 👁` saat kolom terbuka | ✅ kiri 388 px (tidak tertutup kolom) |
| Menu `Satelit ▾` saat kolom terbuka | ✅ kiri 388 px |
| Bilah atas & bawah saat kolom terbuka | ✅ kiri 380 px (selebar peta) |
| HP 390×844 | ✅ bingkai 312×675 · kanvas 312×675 (sama seperti sebelumnya) |
| HP lebar 800×600 | ✅ bingkai 428×480 (tetap dibatasi 430 px, tidak mengecil) |
| HP, panel Anggota | ✅ menutupi penuh 312×675 (seperti sebelumnya) |
| HP, form Tambah Anggota | ✅ lembar bawah `[0,122,312,554]` · `max-height: 82%` (seperti sebelumnya) |
| Galat halaman & konsol | ✅ **0 galat**, 0 peringatan |

### Catatan

Ambang 900 px dipilih karena tablet tegak (768 px) masih terasa sempit untuk
kolom 380 px + peta. Kalau nanti pemilik proyek ingin tablet juga memakai
tampilan PC, angkanya tinggal diubah di satu tempat (`@media (min-width: 900px)`).

---

## Orderan 18 — Peta interaktif mengikuti isian form (perintah 2026-10-17)

### Perintah pemilik proyek

> "PC form sama seperti + anggota full. Jika provinsi di isi peta besar geser
> ke point provinsi yg di isi, sama juga kab/kota, kecamatan, desa/kelurahan —
> peta otomatis geser ke lokasi sesuai lokasi di geser. Sedang di HP peta di
> atas 45%, dan sisa dibawah adalah form isian. Sama cara kerjanya: peta diatas
> mengarahkan lokasi sesuai isian dari form dibawah."

### Yang dibuat

| Berkas | Perubahan |
|---|---|
| `css/gaya.css` | `#form-anggota` di HP: `height: 55%` (dulu `max-height: 82%`). Blok `@media (max-width: 899px)`: saat form terbuka, `#peta` diberi `bottom: 55%` sehingga menyusut ke 45% atas; bilah bawah, atribusi, derajat, dan kartu ikut naik. Blok PC diberi `height: auto` supaya form tetap kolom penuh |
| `js/member.js` | Fungsi baru `terbangKe()`, `terbangKeWilayah()`, `terbangKeTerdalam()`; dipanggil dari `bacaWilayah()`, dari `pastikanTingkat()` (setelah berkas kecamatan/desa selesai dimuat), dan saat form dibuka/ditutup |
| `js/inti.js` | `peta.on('load')` tidak lagi menarik kamera ke titik awal bila kamera sudah diarahkan modul lain |
| `index.html` | Penanda versi naik ke `?v=20261017-06` |

### Cara kerjanya

| Keadaan | HP (< 900 px) | PC (≥ 900 px) |
|---|---|---|
| Form tertutup | Peta penuh 100% | Peta penuh (kolom tertutup) |
| Form terbuka | **Peta 45% atas · form 55% bawah** | Form kolom 380 px kiri · peta 772 px kanan |
| Pilih provinsi | Peta terbang ke seluruh provinsi | idem |
| Pilih kab/kota | Peta masuk lebih dalam | idem |
| Pilih kecamatan | Lebih dalam lagi | idem |
| Pilih desa/kelurahan | Paling dalam | idem |
| Form ditutup | Peta kembali penuh | Peta kembali penuh |

Peta **benar-benar menyusut** (lebarnya tidak diubah, tingginya yang dipangkas),
jadi MapLibre menghitung ulang ukurannya dan titik tengah peta = titik tengah
area yang terlihat. Wilayah yang dipilih tidak tersembunyi di balik form.

Batas wilayah diambil dari **poligon resmi Dukcapil yang sudah ada** di proyek
(`data/wilayah-warna/*.js`) — tidak ada data baru, tidak ada unduhan tambahan.

### Bug yang ditemukan & diperbaiki

| # | Bug | Sebab | Perbaikan |
|---|---|---|---|
| 1 | Peta terbang lalu **ditarik kembali** ke titik awal | `peta.on('load')` di `js/inti.js` selalu menjalankan `jumpTo(PUSAT)` — dan `load` menyala **setelah** form memilih provinsi | `jumpTo` hanya dijalankan bila kamera masih di titik awal |
| 2 | Peta **tidak bergerak sama sekali** | `peta.resize()` dipanggil di tengah animasi `fitBounds` → animasinya dibatalkan | `resize()` dipanggil **sekali** sebelum `fitBounds` |
| 3 | Peta tetap tidak bergerak saat diuji | `requestAnimationFrame` tidak menyala di tab yang tidak terlihat (`visibilityState: hidden`) | Diganti `setTimeout(…, 0)` |
| 4 | Form memilih provinsi **KEPULAUAN BANGKA BELITUNG** terus | `isiDariPeta()` memilih provinsi **pertama** yang bersentuhan layar; pada zoom awal hampir semua provinsi bersentuhan | Dipilih provinsi yang **titik tengahnya paling dekat** dengan titik tengah peta |

### Bukti uji (2026-10-17, dijalankan sendiri)

Diuji lewat server lokal `python -m http.server` di `127.0.0.1:8777`.

| Uji | Hasil |
|---|---|
| HP 390×844, form terbuka | ✅ form `[0,304,312,371]` (55%) · peta `[0,0,312,304]` (45%) · kanvas **312×304** |
| HP, form ditutup | ✅ peta kembali `[0,0,312,675]` · kanvas 312×675 |
| HP, pilih BALI | ✅ peta → `115,072° · -8,455° · z7,26` |
| HP, pilih BADUNG | ✅ peta → `115,168° · -8,544° · z8,28` (lebih dalam) |
| HP, pilih ABIANSEMAL | ✅ peta → `115,221° · -8,529° · z10,32` |
| HP, pilih ANGANTAKA | ✅ peta → `115,243° · -8,583° · z12,84` (paling dalam) |
| HP, provinsi terpilih otomatis | ✅ **SULAWESI BARAT** (terdekat dari titik tengah peta, bukan lagi Bangka Belitung) |
| PC 1152×720, form terbuka | ✅ form `[0,0,380,720]` · peta `[380,0,772,720]` · kanvas 772×720 |
| PC, form ditutup | ✅ peta `[0,0,1152,720]` · kanvas 1152×720 |
| PC, pilih JAWA TENGAH | ✅ peta → `110,125° · -6,971° · z7,27` |
| PC, provinsi terpilih otomatis | ✅ **BALI** (terdekat dari titik tengah peta) |
| Tangkapan layar HP | ✅ peta 45% atas menampilkan Denpasar/Badung, form 55% bawah |
| Galat halaman | ✅ 0 galat |

### Catatan

Tinggi 45% / 55% dipatok di CSS (`bottom: 55%` pada `#peta`). Kalau nanti
pemilik proyek ingin peta lebih tinggi (mis. 50/50), angkanya tinggal diubah
di satu tempat: blok `@media (max-width: 899px)` di `css/gaya.css`.

---

## Orderan 18 lanjutan — pin lokasi, garis merah, tombol peta bergantian (perintah 2026-10-17)

### Perintah pemilik proyek

> "1. Lokasi member bisa di posisi lebih akurat oleh user — jadi setelah user
> isi provinsi dll sampai pada lokasi member, user bisa pointing 📌 letak
> yayasan / rumah sakit / sekolah lebih akurat. User tinggal klik di peta
> lokasi member atau alamat member. Icon 📌 tampil, user sesuaikan tempat yg
> tepat.
> 2. Peta otomatis terbang sesuai perintah dari isian wilayah, sambil peta fly
> area provinsi dll diberi garis merah ikuti / keliling area provinsi, garis
> jangan terlalu tebal, diberi blinking."

Revisi tambahan: *"Tombol satelit dan map hanya ada 2 pilihan, jadi lebih baik
satu tombol untuk satelit atau map — klik 1x satelit, klik lagi map."*

### 1. Pin lokasi yang bisa ditentukan user

| Hal | Keadaan |
|---|---|
| Muncul | Setelah wilayah dipilih — pin di titik tengah wilayah |
| Pindah | **Ketuk peta** di tempat yang tepat, atau **tahan & tarik** pin-nya |
| Keterangan di form | `Titik lokasi: 115,24310° BT · -8,58285° — ketuk peta untuk memindahkan pin` |
| Tombol `↺ Titik tengah wilayah` | Mengembalikan pin ke titik tengah wilayah |
| Yang disimpan | **Koordinat pin**, bukan lagi titik tengah wilayah |
| Saat mengubah anggota lama | Pin mulai dari lokasi anggota itu, tetap bisa digeser |
| Kalau user tidak menyentuh peta | Pin tetap di titik tengah wilayah (perilaku lama tidak hilang) |

Bentuk pin: bulatan putih radius 7 px + cincin merah 3 px — menonjol di citra
satelit gelap maupun di peta jalan yang terang.

**Satu hal yang dijaga:** selama form anggota terbuka, klik peta **hanya**
menaruh pin — kartu keterangan wilayah (orderan 16) tidak dibuka, supaya tidak
ada dua aksi sekaligus. Setelah form ditutup, klik peta kembali membuka kartu.

### 2. Garis merah keliling wilayah + blinking

| Hal | Nilai |
|---|---|
| Bentuk | Garis mengelilingi batas wilayah, mengikuti poligon resmi Dukcapil |
| Warna | `#ff3b30` (merah) |
| Tebal | **1,8 px** — tipis, tidak menutupi peta |
| Blinking | Opacity **1,0 ↔ 0,35** tiap **700 ms** |
| Muncul | Bersamaan dengan peta terbang |
| Hilang | Saat form ditutup, atau diganti saat pindah tingkat wilayah |
| Lapisan | `anggota-sorot-wilayah` — terpisah dari peta tematik penduduk, jadi tetap muncul walau peta tematik mati |

### 3. Revisi tombol jenis peta

| Sebelum | Sesudah |
|---|---|
| Tombol `Satelit ▾` membuka daftar 2 pilihan | **Satu tombol bergantian** — 1× klik `Satelit` → `Map`, klik lagi → `Satelit` |
| Ada panah `▾` dan daftar melayang | Panah & daftar dihapus |
| Pintasan papan tuts `1`–`4` | Pintasan `1` atau `2` — keduanya mengganti ke jenis lain |

Keterangan tombol (tooltip) menyebut jenis yang **akan muncul** bila ditekan:
`Ganti ke Map (sekarang: Satelit)`.

### 4. Revisi susunan bilah atas (perintah 2026-10-17)

> "Tombol [anggota][👁] dipindah ke [anggota][👁][🛰️Satelit][Populasi 👁] —
> karena form anggota ada di sebelah kiri, jadi lebih enak langsung di bawahnya."

| Sebelum | Sesudah |
|---|---|
| `[Satelit] [Populasi 👁]` … `[Anggota][👁]` (di kanan) | `[Anggota][👁] [Satelit] [Populasi 👁]` (dari kiri) |

`#grup-anggota` tidak lagi memakai `margin-left: auto`, sehingga letaknya di
paling kiri — **sejajar dengan kolom form anggota** di bawahnya saat kolom itu
terbuka di PC.

### Bukti uji (2026-10-17, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Urutan tombol di HP 390 px | ✅ `Anggota` (kiri 10) · `👁` (81) · `Satelit` (119) · `Populasi 👁` (202) |
| Urutan tombol di PC 1152 px | ✅ sama — `Anggota` (10) · `👁` (81) · `Satelit` (119) · `Populasi 👁` (202) |
| Muat satu baris tanpa terpotong | ✅ `potong: false` di HP maupun PC |
| Sejajar dengan kolom anggota (PC) | ✅ bilah kiri 380 px · grup anggota kiri 390 px |
| Tombol `👁` masih bekerja | ✅ OFF → `aria-pressed="false"` + penanda `none` · ON → `true` + `visible` |
| Tombol `Satelit` masih bekerja | ✅ klik → `Map` · klik lagi → `Satelit` |
| Menu `Populasi 👁` | ✅ terbuka di kiri 8 px, 4 tingkat lengkap |
| Galat halaman | ✅ 0 galat |

### Bug yang ditemukan & diperbaiki

| # | Bug | Sebab | Perbaikan |
|---|---|---|---|
| 1 | Pin **tertinggal di peta** setelah form ditutup | `pasangPin(false)` menggambar ulang pin, sedangkan `titikPin` belum dikosongkan | `titikPin = null` dipindah ke **sebelum** `pasangPin(false)` |

### Bukti uji (2026-10-17, dijalankan sendiri)

Diuji lewat server lokal `python -m http.server` di `127.0.0.1:8777`.

| Uji | Hasil |
|---|---|
| Tombol jenis peta | ✅ teks `🛰️ Satelit` · title `Ganti ke Map (sekarang: Satelit)` · **tidak ada panah** · tidak ada daftar melayang |
| Klik 1× | ✅ jadi `Map` · atribusi `Peta: © OpenStreetMap contributors` · title `Ganti ke Satelit (sekarang: Map)` |
| Klik 2× | ✅ kembali `Satelit` · atribusi `Citra: Esri, Maxar, Earthstar Geographics` |
| Lapisan garis merah | ✅ `anggota-sorot-wilayah` ada · warna `#ff3b30` · lebar **1,8** |
| Isi garis | ✅ 1 fitur `MultiPolygon` (batas wilayah terpilih) |
| Blinking | ✅ opacity bergantian **0,35 → 1** (diukur 2 kali) |
| Lapisan pin | ✅ `anggota-pin` ada |
| Keterangan pin di form | ✅ `Titik lokasi: 115,16800° BT · -8,54400°` |
| Ketuk peta → pin pindah | ✅ `115,16800° · -8,54400°` → `115,16800° · -8,54191°` |
| Tombol `↺ Titik tengah wilayah` | ✅ kembali ke `115,16800° · -8,54400°` |
| Pin di tingkat desa | ✅ `115,24310° BT · -8,58285°` (titik tengah Desa ANGANTAKA) |
| Simpan dengan pin digeser | ✅ tersimpan di koordinat pin (`115,24002° · -8,58428°`) |
| Setelah Simpan | ✅ form tertutup · pin **0 fitur** · garis sorot **0 fitur** · peta kembali `[0,0,312,675]` |
| PC 1152×720 | ✅ form `[0,0,380,720]` · peta `[380,0,772,720]` · garis sorot 1 fitur · pin tampil |
| PC, pilih KOTA SEMARANG | ✅ peta → `110,386° · -7,0245°` · garis merah keliling terlihat di tangkapan layar |
| Galat halaman & konsol | ✅ **0 galat** |

### Catatan

Kedipan dijalankan hanya selama ada wilayah yang disorot (`mulaiKedip` /
`hentikanKedip`), supaya tidak membebani peramban tanpa guna.

---

## Orderan 19 — Fitur Cari (perintah 2026-10-17)

### Perintah pemilik proyek

> "Fitur Cari `[⌕]` — pencarian lokasi/wilayah atau nama anggota/yayasan."

Tambahan saat paparan: *"Apakah bisa nama jalan, karena ada di peta?"* ·
*"Tombol `⌕` ditempatkan di sisi kanan."* · *"Desa perlu, sangat perlu."*

### Yang bisa dicari

| Jenis | Sumber | Butuh internet? |
|---|---|---|
| **Wilayah** — provinsi → desa/kelurahan | Indeks Dukcapil di proyek | ❌ Tidak |
| **Anggota / yayasan** | Database Neon (lewat `PD_ANGGOTA`) | ❌ Tidak |
| **Nama jalan / tempat** | OpenStreetMap (Nominatim) | ✅ Ya |

### Berkas baru

| Berkas | Isi | Ukuran | Kapan dimuat |
|---|---|---|---|
| `alat/buat-indeks-cari.js` | Alat pembuat indeks | — | Sekali, saat pembuatan |
| `data/cari-wilayah.js` | provinsi + kab/kota + kecamatan · **7.798 entri** | **253 KB** | Begitu kotak cari dibuka |
| `data/cari-desa.js` | desa/kelurahan · **83.411 entri** | **3,3 MB** | Latar belakang |
| `js/cari.js` | Modul pencarian | — | Bersama halaman |

Indeks hanya memuat **kode + nama + kode induk** — tanpa poligon, sehingga
jauh lebih kecil daripada berkas batas wilayah. Dibuat ulang kapan saja dengan
`node alat/buat-indeks-cari.js`.

### Cara pakai

1. Tombol **`⌕`** di **paling kanan** bilah atas.
2. Ketuk → kotak cari terbuka; pencarian wilayah langsung bisa dipakai.
3. Ketik minimal **2 huruf** → hasil muncul sambil mengetik.
4. Hasil dikelompokkan: **Anggota** · **Wilayah** · **Jalan / Tempat**.
5. Ketuk hasil **wilayah** → peta terbang + garis merah berkedip mengelilinginya.
6. Ketuk hasil **anggota** → peta terbang ke titik anggota + kartu terbuka.
7. Ketuk hasil **jalan** → peta terbang + penanda kuning sementara (hilang 12 detik).

### Batas sopan OpenStreetMap

Nominatim membatasi **1 permintaan/detik**. Karena itu:

| Pengaturan | Nilai |
|---|---|
| Jeda setelah ketikan berhenti | **220 ms** |
| Jeda sebelum memanggil OSM | **400 ms** |
| Huruf minimal untuk mencari jalan | **3** |
| Hasil per permintaan | 8 |
| Batas negara | `countrycodes=id` |

Kalau OSM tidak bisa dihubungi, ditulis apa adanya: *"Nama jalan tidak bisa
dicari (butuh internet)."* — pencarian wilayah & anggota tetap jalan.

### Perbaikan tata letak bilah atas

Setelah tombol cari ditambahkan, bilah atas **meluber** di HP sempit. Diukur
17 Okt 2026: 322 px isi vs 312 px layar.

| Lebar layar | Yang berlaku |
|---|---|
| > 400 px | Semua tombol memakai tulisan penuh |
| ≤ 400 px | Jarak & padding dirapatkan; tombol `Anggota` menjadi ikon `☰` saja |
| ≤ 340 px | Tulisan `Populasi` disembunyikan, tinggal ikon 👁 |

### Bukti uji (2026-10-17, dijalankan sendiri)

Diuji lewat server lokal `python -m http.server` di `127.0.0.1:8777`.

| Uji | Hasil |
|---|---|
| Tombol `⌕` di paling kanan | ✅ kiri 292 px dari 312 px (HP) · 30 px lebar |
| Bilah atas muat di 320 px | ✅ `potong: false` |
| Bilah atas muat di 340 / 360 / 390 / 430 px | ✅ `potong: false` di keempatnya |
| Bilah atas di PC 1152 px | ✅ `potong: false` |
| Kotak cari terbuka | ✅ `[0,40,312,124]` (HP) · `[0,40,1152,640]` (PC) |
| Kotak cari saat panel anggota terbuka (PC) | ✅ `[380,40,772,107]` — tidak menutupi kolom |
| Cari `badung` | ✅ Wilayah (4): BADUNG · Kabupaten/Kota · BALI · BADUNG · Desa/Kelurahan · PROPPO · CIBADUNG · LARANGAN BADUNG |
| Cari `semarang` | ✅ Wilayah (12) — termasuk SEMARANG UTARA/BARAT/TIMUR/TENGAH/SELATAN (Kecamatan) |
| Cari `angantaka` (desa) | ✅ ANGANTAKA · Desa/Kelurahan · ABIANSEMAL |
| Cari `malioboro` (jalan) | ✅ Jalan/Tempat (4) — termasuk *Malioboro, Jalan Malioboro, Suryatmajan, Danurejan, Yogyakarta* |
| Klik hasil wilayah BADUNG | ✅ peta → `115,168° · -8,544° · z9,43` · garis sorot **1 fitur** · kotak cari tertutup |
| Klik hasil jalan Malioboro | ✅ peta → `110,3657° · -7,7953° · z16` · penanda tunjuk **1 fitur** di `[110,36573, -7,79529]` |
| Keterangan anggota belum tersambung | ✅ *"Anggota belum dimuat — isi kode database dulu."* |
| Galat halaman | ✅ 0 galat |

### Catatan

Pencarian nama jalan **tidak menambah ukuran repo** — ditanyakan langsung ke
OpenStreetMap saat dipakai. Kelengkapan nama jalan bergantung pada data OSM:
lengkap di kota besar, bisa kosong di desa terpencil. Itu keadaan datanya,
bukan kerusakan.

### Perbaikan setelah uji pemilik proyek (2026-10-17)

**Laporan:** *"test ke 2 .. cari meruya selatan .. peta tidak 'terbang'."*

**Sebabnya:** hasil desa memang **ditemukan** dari indeks, tetapi **poligon
desa itu belum dimuat** ke peta. Berkas batas wilayah dimuat bertahap
(kecamatan per provinsi, desa per kab/kota), jadi desa mana pun yang belum
pernah dibuka belum punya poligon. Kode lama keluar lebih awal saat poligon
tidak ditemukan → tidak ada aksi apa pun: peta diam, kotak cari tidak tertutup.

**Perbaikan:** `keWilayah()` di `js/cari.js` sekarang memuat berkas bagian
poligon lebih dulu lewat `PD_MUAT_BAGIAN()`, menampilkan pesan
*"Memuat batas wilayah…"*, lalu terbang setelah berkas selesai dimuat.
Kalau gagal (tanpa internet) ditulis apa adanya: *"Batas wilayah ini gagal
dimuat (butuh internet)."*

**Bukti uji ulang (2026-10-17, dijalankan sendiri):**

| Uji | Hasil |
|---|---|
| Cari `meruya selatan` (desa, poligon belum dimuat) | ✅ peta → `106,733° · -6,207° · z12,61` · sorot **1 fitur** · kotak cari tertutup · `WARNA_DESA_3173` termuat |
| Cari `semarang utara` (kecamatan, poligon belum dimuat) | ✅ peta → `110,420° · -6,958° · z11,89` · sorot **1 fitur** · kotak tertutup |
| Cari `bogor` → pilih Kabupaten/Kota | ✅ peta → `106,814° · -6,545° · z7,89` · sorot **1 fitur** · kotak tertutup |
| Cari `papua` → pilih Provinsi PAPUA BARAT | ✅ peta → `133,450° · -2,524° · z5,71` · sorot **1 fitur** · kotak tertutup |
| Galat halaman | ✅ 0 galat |

---

## Bahan Orderan 20 & 21 — hasil pelajaran `c:\data\datapeta` (2026-10-17)

### Yang ada di DataPeta

| Hal | Keadaan |
|---|---|
| Suku | `data/suku.js` — **28 suku** dari BPS Sensus 2010: nama · jumlah jiwa · kode provinsi asal · "kawasan utama" (daftar provinsi/pulau dalam bentuk tulisan) |
| Titik suku | Ditaruh di **ibu kota provinsi asal** saja. Di berkasnya sendiri tertulis: *"Sumber mana pun TIDAK menyediakan koordinat suku"* — jadi titiknya perkiraan |
| Cara saji suku | Titik + label nama + jumlah; tombol 3 tingkat (Sembunyi → Sedang → Penuh) |
| Agama | `data/agama.js` — hanya **30 provinsi**, hanya sampai **kabupaten/kota** (412 baris). Diambil dari **PDF BPS provinsi** (60 berkas, ±800 MB di `catat/pdf-agama`). Provinsi 14, 17, 35, 52, 72, 91, 96 **tidak ada**; kecamatan & desa **tidak ada sama sekali** |

### ⭐ Temuan: sumber agama yang jauh lebih baik

Sumber data yang **sudah dipakai Pemetaan** (Dukcapil Kemendagri) ternyata
**sudah memuat kolom agama**, lengkap sampai desa:

| Tingkat | Jumlah wilayah | Kolom agama |
|---|---|---|
| Provinsi | 38 | Islam · Kristen · Katolik · Hindu · Budha · Konghucu · Kepercayaan |
| Kabupaten/Kota | 514 | idem |
| Kecamatan | 7.285 | idem |
| Desa/Kelurahan | 83.489 | idem |

Diuji 2026-10-17 dengan menjumlahkan sendiri seluruh wilayah tiap tingkat:

| Tingkat | Jumlah penduduk | Jumlah 7 agama | Selisih |
|---|---|---|---|
| Provinsi | 284.973.643 | 284.915.499 | 58.144 |
| Kabupaten/Kota | 284.973.643 | 284.915.499 | 58.144 |
| Kecamatan | 284.856.007 | 284.856.720 | −713 |
| Desa/Kelurahan | 283.526.641 | 283.526.793 | −152 |

Selisih ≤ 0,02% → kolom agama memang terisi, bukan kosong. Angka provinsi &
kab/kota **sama persis**, jadi bisa saling membuktikan.

**Akibatnya:** orderan 21 **tidak perlu** memakai PDF BPS seperti DataPeta.
Cukup satu sumber, empat tingkat, tanpa berkas PDF 800 MB.

### Rencana penyajian (menunggu perintah)

**Orderan 20 — titik lokasi suku.** Titik DataPeta hanya di ibu kota provinsi
asal, sehingga suku Jawa jatuh di Semarang padahal tersebar di 8 provinsi.
Rencana: tombol `Suku` di bilah atas → daftar 28 suku diurutkan dari
terbanyak → ketuk satu suku → peta menyorot **seluruh provinsi** yang disebut
BPS sebagai kawasan utama suku itu, dan titik penanda ditaruh di **titik
tengah seluruh kawasan** (bukan ibu kota provinsi asal). Ditulis jelas di
layar bahwa titik & wilayah = perkiraan dari kawasan utama BPS 2010.
Sebagian "kawasan utama" bukan nama provinsi (mis. *"Pulau Madura"*,
*"Sulawesi"*, *"Perkotaan di DKI Jakarta"*) — bagian itu ditangani satu per
satu, dan yang tidak bisa dipetakan **ditulis apa adanya, tidak dikarang**.

**Orderan 21 — jumlah beragama 4 tingkat.** Tombol `Populasi 👁` menjadi
`Data 👁` → pilih `Jumlah Penduduk` atau `Agama` → pilih salah satu dari 7
agama → peta diwarnai menurut **persentase** agama itu (bukan jumlah jiwa,
supaya tidak sekadar mengulang peta penduduk). Ketuk wilayah → kartu
menampilkan rincian 7 agama: jumlah jiwa **dan** persentase. Berlaku di 4
tingkat. Angka agama diambil **tanpa** gambar batas wilayah, jadi tidak perlu
mengunduh ulang 73 MB batas yang sudah ada; perkiraan tambahan berkas 4–5 MB.

---

## Orderan 21 — Jumlah penduduk menurut agama, 4 tingkat (perintah 2026-10-17)

### Perintah pemilik proyek

1. Warna peta berdasarkan **persentase** (per 100 orang).
2. Klik warna agama utama → tampil jumlah per agama (Islam jumlah, Kristen
   jumlah, dst.). Konghucu & Kepercayaan tetap disajikan dalam angka jumlah.
3. **Terpisah dulu** dari menu Populasi.
4. Ingin daftar agama juga tampil di bawah form `+ Anggota`.
5. Konghucu & Kepercayaan ikut jadi pilihan warna peta.

### Keputusan yang diambil

| Pertanyaan | Jawaban pemilik proyek |
|---|---|
| Letak tombol | Tombol baru tersendiri di bilah atas, di sebelah tombol Populasi → `[Populasi][Agama]` |
| Sifat blok di form | Bisa diklik untuk mewarnai peta |
| Konghucu & Kepercayaan | Ikut jadi pilihan warna peta |

### Berkas baru

- `js/agama.js` — modul peta tematik agama. Meniru pola `js/warna.js` tetapi
  mewarnai menurut **persentase** dan memakai **tangga warna per agama**
  (bukan 9 warna tetap). Lapisan peta (`wilayah`, `wilayah-isi`,
  `wilayah-garis`) **dipakai bersama** dengan peta Populasi, jadi keduanya
  saling mematikan.
- `data/agama/` — 554 berkas, 4,56 MB (sudah di-commit lebih dulu sebagai
  titik pulih `19e8ada`):
  `prop-nasional.js` (38), `kab-nasional.js` (514),
  `kec-<2 angka provinsi>.js` (38), `desa-<4 angka kab/kota>.js` (514).
  Kolom: `[kode…, nama, jumlah_penduduk, islam, kristen, katholik, hindu,
  budha, konghucu, kepercayaan]`.
- `alat/ambil-agama.js` — pengambil data dari ArcGIS Dukcapil.

### Berkas yang diubah

- `index.html` — tombol `#tombol-agama`, daftar `#pemilih-agama`, blok
  `#fa-agama` di form anggota, `<script src="js/agama.js">`, penanda versi
  `?v=20261017-13` → `?v=20261017-14` (11 tempat).
- `css/gaya.css` — gaya `#tombol-agama`, `.agama-*`, `.fa-agama-*`,
  `.agama-mati`; `#pemilih-agama` ikut digeser di PC; bilah atas dirapatkan
  lagi di `@media (max-width: 400px)`.
- `js/warna.js` — `siapkanLapisan(paksa)` supaya lapisan bisa dibuat ulang
  setelah peta dasar diganti; `ganti()` mematikan peta Agama lebih dulu;
  klik wilayah tidak membuka kartu Populasi saat peta Agama menyala.
- `js/member.js` — `tampilkanAgama()` mengisi `#fa-agama` lewat
  `PD_AGAMA.untukWilayah()` + `ringkas()`; klik baris agama mewarnai peta.

### Cara pakai

1. Ketuk `[Agama 🙏]` di bilah atas → muncul 7 pilihan agama + 4 tingkat.
2. Ketuk satu agama → peta langsung diwarnai tingkat provinsi.
3. Ketuk tingkat lain (Kab/Kota, Kecamatan, Desa) untuk berpindah tingkat.
   Kecamatan butuh z≥5, desa butuh z≥8 — sama seperti peta Populasi.
4. Ketuk satu wilayah di peta → kartu rincian 7 agama + mayoritas.
5. Di form `+ Anggota`, blok "Jumlah penduduk menurut agama" muncul di bawah
   keterangan penduduk; tiap baris bisa diketuk untuk mewarnai peta.
6. Tombol `Matikan peta agama` di dalam daftar untuk mematikan.

### Bukti uji (2026-10-17, dijalankan sendiri)

Diuji di peramban pada `http://127.0.0.1:8899` (server lokal) dan
`https://suwandhih.github.io/Pemetaan/`.

| Uji | Hasil |
|---|---|
| Tombol Agama muncul di sebelah Populasi | ✅ |
| Islam tingkat provinsi | ✅ 38 wilayah, kelas 0%–32% … ≥97% |
| Kristen tingkat provinsi | ✅ 38 wilayah, kelas 0%–1,5% … ≥39,6% |
| Kristen tingkat kab/kota | ✅ 514 wilayah |
| Kecamatan (z6,2) | ✅ 1.356 wilayah, kode `16.01.07` benar |
| Desa (z9,5) | ✅ 1.884 wilayah, kode `36.71.07.1002` benar |
| Angka cocok data mentah | ✅ SOSOH BUAY RAYAP 36/14.655 = 0,25%; BOJONG JAYA 558/9.056 = 6,16% |
| Kartu rincian 7 agama | ✅ KALIMANTAN UTARA, JATIMULYA, JEPARA |
| Blok agama di form anggota | ✅ KOTA BOGOR 1.144.108 jiwa, Islam 93% |
| Klik baris agama di form | ✅ peta ikut berwarna |
| Populasi ↔ Agama saling mematikan | ✅ |
| Ganti peta dasar (Satelit ↔ Map) | ✅ lapisan dipasang ulang, warna tetap |
| Bilah atas HP 390 px | ✅ 312 px isi = 312 px layar, tidak meluber |
| Bilah atas HP 320 px | ✅ 256 px isi = 256 px layar |
| Daftar melayang vs keterangan warna di HP | ✅ tidak tumpang-tindih |
| Galat konsol | ✅ 0 |

### Bug yang ditemukan & diperbaiki saat uji

1. **Indeks kolom salah (off-by-one).** Berkas agama menyimpan barisnya
   sebagai array langsung `[kode…, nama, penduduk, islam, …]`, bukan objek
   `{a,g}` seperti berkas batas wilayah. Awalnya dibaca `r[kolom+1]` untuk
   penduduk → seluruh persentase meleset (Papua Pegunungan tertulis 5.082%).
   Diperbaiki jadi `r[kolom]`.
2. **Jumlah kolom kode tertukar dengan indeks kolom penduduk.** Kecamatan
   punya 3 kolom kode, bukan 4 → kode jadi `16.01.07.SOSOH BUAY RAYAP`.
   Ditambahkan `kolomKode(tingkat) = banyakKolom(tingkat) - 1`.
3. **Nama wilayah salah kolom** → `a[kolom]` seharusnya `a[kolom - 1]`.
4. **Batas kelas tertulis kembar.** Konghucu tingkat kab/kota berbatas
   0,00009%–3,5% → dengan 3 desimal semua kelas bawah tertulis "0,001%".
   Kristen tingkat provinsi berbatas 2,0%–2,4% → dengan 0 desimal tertulis
   "2% – 2%". Diperbaiki dengan `desimalKelas()` yang menghitung desimal dari
   **nilai batas terkecil dan jarak terkecil antar batas**, diambil yang
   paling banyak.
5. **Tombol Agama langsung mematikan saat menyala** → pemakai tidak bisa
   berganti agama/tingkat tanpa mematikan dulu. Diperbaiki: tombol hanya
   membuka/menutup daftar, dan ditambahkan tombol `Matikan peta agama` di
   dalam daftar.
6. **Daftar melayang menutupi keterangan warna** di HP sempit dengan form
   terbuka (daftar 44–273 px, keterangan 55–237 px). Diperbaiki: keterangan
   disembunyikan selama daftar terbuka, lalu dikembalikan.
7. **Klik wilayah membuka kartu Populasi** saat peta Agama menyala (dua
   pendengar pada lapisan yang sama). Diperbaiki dengan penjagaan di
   `js/warna.js`.

### Catatan

- Persentase dihitung dari **jumlah penduduk**, bukan dari jumlah 7 agama.
  Diukur 17 Okt 2026: jumlah 7 agama 284.915.499 vs jumlah penduduk
  284.973.643 (selisih 0,02%) pada tingkat provinsi & kab/kota — selisih itu
  penduduk yang agamanya belum tercatat Dukcapil. Kalau dihitung dari jumlah
  7 agama, angkanya jadi dilebih-lebihkan.
- Nama kolom Dukcapil `katholik`, yang ditulis di layar "Katolik".
- 18 berkas desa punya jumlah agama nol dan 518 desa berpenduduk 0 — wilayah
  seperti itu diwarnai abu-abu (`#39434e`), bukan dikarang.
- Konghucu & Kepercayaan tetap disajikan dalam **angka jumlah** di kartu dan
  di blok form, sesuai permintaan; keduanya juga bisa dipakai mewarnai peta.
- Perbandingan dengan tingkat atas dan catatan desa berpenduduk sedikit
  **belum** dikerjakan (ide tambahan yang belum diputuskan pemilik proyek).


---

## Orderan 20 — Titik lokasi suku bangsa (perintah 2026-10-17)

### Perintah pemilik proyek

1. Titik-titik lokasi suku dari `c:\data\datapeta` — **cara penyajiannya
   kurang bagus**, supaya diolah dan disajikan menurut konsep Pemetaan,
   **jangan meniru cara DataPeta**.
2. Jumlah beragama per provinsi/kab-kota/kecamatan/desa — sudah dikerjakan
   sebagai orderan 21.

### Keputusan yang diambil (ditanyakan lebih dulu)

| Pertanyaan | Jawaban pemilik proyek |
|---|---|
| Cara menggambar sebaran | **Garis + titik tengah** — garis merah keliling semua provinsi kawasan, satu titik penanda di tengah kawasan |
| Kawasan yang bukan nama provinsi | **Tulis apa adanya** di kartu |
| Warna wilayah | **Tanpa warna** — cukup garis merah berkedip + titik penanda |

### Kenapa tidak meniru DataPeta

Di DataPeta tiap suku ditaruh di **ibu kota provinsi asalnya**, sehingga suku
Jawa jatuh di Semarang padahal BPS sendiri mencatat Jawa tersebar di 8
provinsi. Di Pemetaan yang digambar adalah **kawasan utama yang disebut BPS**:
seluruh provinsi di dalamnya diberi garis merah berkedip, dan satu titik
penanda ditaruh di titik tengah kawasan itu.

### Berkas baru

- `js/suku.js` — modul peta suku. Berisi data 28 suku BPS SP2010, peta
  kawasan → kode provinsi, lapisan `suku-sorot` (garis merah berkedip),
  `suku-titik` (bulatan putih + cincin merah), `suku-nama` (label nama suku),
  kartu rincian, daftar melayang, simpanan `peta_suku`, ekspor `window.PD_SUKU`.

### Berkas yang diubah

- `index.html` — tombol `#tombol-suku` (teks "Suku", ikon 🧬) setelah tombol
  Agama; daftar `#pemilih-suku` setelah `#pemilih-agama`;
  `<script src="js/suku.js">` setelah `js/agama.js`; penanda versi
  `?v=20261017-14` → `?v=20261017-15` (11 tempat).
- `css/gaya.css` — gaya `#tombol-suku`, `#pemilih-suku`, `.suku-*`;
  `#pemilih-suku` ikut digeser di PC & dibatasi tingginya di HP; bilah atas
  dirapatkan lagi di `@media (max-width: 400px)` (tombol Suku jadi ikon saja);
  kartu rincian di HP dengan form terbuka dibatasi tingginya.
- `js/warna.js` — `ganti()` mematikan peta Suku lebih dulu; `bukaTutup()`
  menutup `#pemilih-suku`; ekspor ditambah `aktif()`.
- `js/agama.js` — `ganti()` mematikan peta Suku lebih dulu; `bukaTutup()`
  menutup `#pemilih-suku`.

### Cara pakai

1. Ketuk `[Suku 🧬]` di bilah atas → muncul daftar 28 suku BPS SP2010,
   diurutkan dari yang terbanyak, lengkap dengan jumlah jiwa, persentase
   terhadap penduduk Indonesia, dan bar proporsi.
2. Ketuk satu suku → peta terbang ke kawasan utamanya, seluruh provinsi di
   dalamnya diberi **garis merah berkedip**, dan **satu titik penanda**
   ditaruh di titik tengah kawasan.
3. Kartu rincian muncul: jumlah jiwa, persentase, jumlah provinsi disorot,
   dan daftar kawasan utama apa adanya seperti BPS menuliskannya.
4. Tombol `Matikan peta suku` di dalam daftar untuk mematikan.
5. Pilihan terakhir diingat (localStorage `peta_suku`).

### Bukti uji (2026-10-17, dijalankan sendiri)

Diuji di peramban (Chrome) pada `http://127.0.0.1:8899` (server lokal).

| Uji | Hasil |
|---|---|
| Tombol Suku muncul di sebelah Agama | ✅ |
| Daftar 28 suku, urut dari terbanyak | ✅ Jawa 97.094.536 · 41% |
| Jawa → 8 provinsi disorot | ✅ `12,18,31,32,33,34,35,36` |
| Garis merah berkedip | ✅ opacity 1 ↔ 0,35 tiap 700 ms |
| Titik penanda di tengah kawasan | ✅ 106,6625 · −2,2410 |
| Label nama suku di peta | ✅ font `Open Sans Bold` tersedia |
| Kartu rincian Jawa | ✅ 97.094.536 jiwa · 41% · 8 provinsi · 8 baris kawasan |
| Suku gabungan (Asal Sulawesi) | ✅ 6 provinsi + catatan "kelompok gabungan" |
| Kawasan non-provinsi (Tionghoa) | ✅ "Pulau Sumatra · digambar sebagai 10 provinsi" |
| **Seluruh 28 suku diuji satu per satu** | ✅ semua punya garis, titik, kartu, baris kawasan |
| Matikan peta suku | ✅ garis & titik kosong, kartu tertutup |
| Populasi ↔ Suku saling mematikan | ✅ |
| Agama ↔ Suku saling mematikan | ✅ |
| Ganti peta dasar (Satelit ↔ Map) | ✅ lapisan & titik dipasang ulang |
| Simpanan & muat ulang | ✅ suku terakhir kembali menyala |
| Bilah atas PC 1280 px | ✅ tidak meluber |
| Bilah atas HP 390 px | ✅ tidak meluber, tombol Suku jadi ikon 30 px |
| Kartu di HP 390 px | ✅ tidak meluber keluar layar |
| Kartu di HP 360 px + form terbuka | ✅ tidak menutupi bilah atas, bisa digeser |
| Keterangan warna Populasi kembali setelah daftar ditutup | ✅ |
| Galat konsol | ✅ 0 (hanya favicon 404 dari server uji lokal) |

### Bug yang ditemukan & diperbaiki saat uji

1. **Kotak batas (bounding box) salah hitung.** Pada `kotakDari()`, batas
   atas `k[3]` ditulis `k[1]` sehingga titik tengah kawasan meleset jauh
   (Jawa jatuh di 106,66 · −2,24 = perairan Kalimantan, bukan Jawa).
   Diperbaiki jadi `k[3]`.
2. **Kartu rincian menutupi bilah tombol** di HP sempit dengan form terbuka.
   Diukur 17 Okt 2026 pada layar 360×640: kartu 377 px sedangkan ruang di
   atasnya hanya 208 px, sehingga kartu meluber ke atas dan tombol Suku tidak
   bisa diklik. Diperbaiki: tinggi kartu dibatasi setinggi area peta yang
   tersisa (`max-height`), sisanya bisa digeser.
3. **Titik penanda hilang setelah peta dasar diganti.** Garis merahnya
   kembali tetapi titiknya tidak, karena hanya `suku-sorot` yang dipasang
   ulang. Diperbaiki: `suku-titik` juga dipasang ulang.
4. **Keterangan warna Populasi tidak kembali** setelah daftar suku ditutup
   (di `js/suku.js` keterangan disembunyikan tanpa dicatat). Diperbaiki
   dengan penanda `derajatDitutupSementara` seperti di `js/agama.js`.

### Catatan

- **Titik & wilayah adalah perkiraan.** BPS tidak menerbitkan koordinat suku;
  yang diterbitkan hanya daftar kawasan utama. Titik di sini = titik tengah
  kotak batas seluruh kawasan, bukan lokasi persis. Hal ini ditulis di kartu
  supaya tidak menyesatkan.
- Persentase dihitung dari **penduduk Indonesia SP2010 (237.641.326)**, bukan
  dari jumlah 28 suku (236.565.607 = 99,55%), supaya tidak dilebih-lebihkan.
- Beberapa nama kawasan memakai **wilayah tahun 2010**, karena itulah yang
  dicatat BPS: "Kalimantan Timur" 2010 = hari ini 64 + 65 (Kaltara memisah
  2012); "Papua" 2010 = 91 + 93 + 94 + 95 (memisah 2022); "Papua Barat" 2010
  = 92 + 96 (Papua Barat Daya memisah 2022).
- 9 kawasan yang bukan nama provinsi (mis. "Sulawesi", "Pulau Madura",
  "Perkotaan di DKI Jakarta") **tetap digambar** sebagai provinsi yang
  memuatnya — bukan dikarang, karena "Sulawesi" memang berisi 6 provinsi dan
  "Pulau Madura" memang bagian Jawa Timur. Di kartu tiap baris diberi catatan
  `kawasan · digambar sebagai N provinsi` supaya jelas. **Perlu dikonfirmasi
  ke pemilik proyek** apakah cara ini diterima, atau kawasan seperti itu
  harus benar-benar tidak digambar.
- 9 suku bertanda **gabungan** (mis. "Asal Sulawesi", "Asal NTT") — BPS
  mencatatnya sebagai kelompok gabungan, bukan satu suku tunggal. Tanda
  "gabungan" ditampilkan di daftar dan dijelaskan di kartu.

---

### Revisi kartu rincian di PC (2026-10-17)

Pemilik proyek: *"blok data terlalu besar bisa dibuat lebih bagus? kalau di
versi HP mau tidak mau seperti itu karena lebar, kalau versi PC terlalu
besar"*.

Yang diubah — **hanya di PC** (`@media (min-width: 900px)`):

- Lebar kartu dibatasi **560 px** (sebelumnya selebar layar).
- Tabel rincian disusun **dua pasang per baris** (`display: grid` +
  `display: contents` pada `tbody` dan `tr`).
- Daftar kawasan utama suku & daftar 7 agama disusun **dua kolom**.

Hasil ukur (layar 1440x800):

| Kartu | Sebelum | Sesudah |
|---|---|---|
| Suku Jawa (8 kawasan) | 1440x345 | 560x256 |
| Populasi (7 baris) | 1440x189 | 560x129 |
| Agama (7 baris) | 1440x376 | 560x268 |

HP 390 px **tidak diubah**: kartu Jawa tetap 374x377.

Bug: `display: contents` pada `tr` saja tidak cukup — peramban menyisipkan
`<tbody>` sendiri, sehingga seluruh tabel menjadi satu sel kisi dan label
menempel pada angkanya. Diperbaiki dengan menembuskan `tbody` juga.

---

### Revisi panel Suku seperti panel Anggota (2026-10-17)

Pemilik proyek: *"suku > di tempatkan seperti anggota.. jadi peta masih mudah
dilihat pada saat fly.. tidak terganggu dengan box hitam"*.

**Yang diubah:**

- Daftar suku yang tadinya **daftar melayang** (`#pemilih-suku`) menjadi
  **panel** (`#panel-suku`) dengan susunan meniru `#panel-anggota`:
  kepala (judul + jumlah + tombol tutup ✕), baris sumber, blok rincian,
  daftar yang bisa digeser, dan kaki (petunjuk + tombol `Matikan peta suku`).
- **Rincian suku dipindah dari `#kartu` ke dalam panel** (`#suku-rincian`).
  Inilah yang menghilangkan "box hitam" di atas peta saat peta terbang.
- Di PC panel menjadi **kolom kiri 380 px** — peta menyusut ke sisa lebar
  (1060 px pada layar 1440 px) dan **tetap terlihat penuh** saat terbang.
- Di PC panel **tetap terbuka** setelah suku diketuk, jadi pemakai bisa
  mengetuk suku satu per satu sambil melihat peta terbang. Di HP panel
  menutupi seluruh layar, jadi **ditutup otomatis** supaya peta terlihat.
- Panel Suku, panel Anggota, dan form isian **saling mematikan** — ketiganya
  memakai kolom kiri yang sama di PC.
- Kartu Populasi & Agama di PC tetap ringkas (560 px, tabel 2 pasang per
  baris, daftar 2 kolom) — aturan tabel kisi kini dibatasi `#kartu` saja
  supaya tabel di panel suku (380 px) tetap satu kolom.

**Bukti uji (2026-10-17, dijalankan sendiri, Chrome):**

| Uji | Hasil |
|---|---|
| Panel terbuka, peta terlihat penuh | ✅ peta 1060 px di layar 1440 px |
| Ketuk suku → panel tetap terbuka (PC) | ✅ |
| Ketuk suku → panel tertutup (HP) | ✅ |
| **Kartu hitam di atas peta** | ✅ tidak ada lagi |
| Rincian tampil di panel | ✅ Jawa 8 baris kawasan |
| Ganti suku tanpa menutup panel | ✅ Jawa → Tionghoa |
| **Seluruh 28 suku diuji** | ✅ semua: garis, titik, rincian, kawasan, tanpa kartu hitam |
| Titik penanda di dalam area peta | ✅ 28/28, di kanan panel |
| Panel Anggota ↔ panel Suku | ✅ saling mematikan |
| Form isian ↔ panel Suku | ✅ saling mematikan |
| Populasi & Agama tetap jalan | ✅ |
| Simpanan & muat ulang | ✅ |
| Ukuran panel 360/390/1024/1440 px | ✅ tidak ada yang meluber |
| Galat konsol | ✅ 0 |

**Bug yang ditemukan & diperbaiki saat uji:**

1. **Panel Anggota & panel Suku terbuka bersamaan** dan saling menutupi —
   daftar suku tidak bisa diklik (tertutup panel Anggota). Diperbaiki:
   keduanya saling mematikan, begitu juga dengan form isian.
2. **Tabel rincian di panel berdesakan** karena aturan kisi `#kartu` ikut
   berlaku di panel 380 px. Diperbaiki: aturan kisi dibatasi `#kartu`,
   tabel di panel suku dikembalikan satu kolom.


---

## Panduan pemakaian di dalam aplikasi (perintah 2026-10-17)

Pemilik proyek: *"saya mau minta km buatkan panduan user .. tentu bukan untuk
saya saja.. jadi jangan pakai kata 'bapak'. panduan ini bukan 1 file tapi
setiap fitur jika tombol '?' di klik .. mengeluarkan panduan fokus pada fitur
di masing2 .. penjelasan penggunaan harus klik apa .. tapi tujuan fitur apa
dijelaskan terlebih dahulu.. lalu bagaimana cara mengunakan.. tombol '?'
otomatis mengetahui user sedang diposisikan mana.. jika di klik keluar panduan
ditampilkan pada tambah anggota.. dan dijelaskan pada panduan ada bisa
dijalankan misalkan peta fly, dll"*.

### Keputusan pemilik proyek (ditanyakan sebelum dikerjakan)

| Pertanyaan | Jawaban |
|---|---|
| Letak panduan di PC | **Kolom kanan** — form/daftar di kiri tetap terlihat dan bisa langsung dicoba |
| Isi panduan | **Fokus + daftar** — fokus pada fitur yang sedang dibuka, plus daftar fitur lain supaya bisa pindah panduan tanpa menutup |

### Cara kerja

Satu tombol `?` di ujung kanan bilah atas. Saat diketuk, aplikasi memeriksa
dulu **pemakai sedang berada di mana**, lalu menampilkan panduan yang cocok
dengan tempat itu — bukan panduan umum yang panjang.

**Sembilan keadaan yang dikenali** (diperiksa dari yang paling dalam):

| Keadaan | Penanda yang diperiksa | Judul panduan |
|---|---|---|
| Form isian | `#form-anggota` tidak `hidden` | Tambah / ubah anggota |
| Kelola kategori | `#anggota-kategori-panel` tidak `hidden` | Kelola kategori |
| Daftar anggota | `#panel-anggota` tidak `hidden` | Daftar anggota |
| Panel suku | `#panel-suku` tidak `hidden` | Peta suku bangsa |
| Daftar Populasi | `#pemilih-warna` tidak `hidden` | Peta penduduk |
| Daftar Agama | `#pemilih-agama` tidak `hidden` | Peta agama |
| Kotak cari | `#cari` tidak `hidden` | Cari |
| Kartu rincian | `#kartu` tidak `hidden` | Rincian wilayah |
| Peta biasa | (bawaan) | Peta & navigasi |

Urutan pemeriksaan penting: `#anggota-kategori-panel` berada **di dalam**
`#panel-anggota`, jadi harus diperiksa lebih dulu — kalau tidak, panduan
kategori tidak pernah muncul.

**Urutan isi setiap panduan** (sama untuk kesembilan fitur):

1. **Untuk apa** — tujuan fitur, ditulis lebih dulu.
2. **Cara pakai** — langkah bernomor, jelas harus klik apa.
3. **Yang akan terjadi** — akibat dari langkah itu (mis. peta terbang, pin
   muncul, garis merah berkedip).
4. **Catatan** — hal yang perlu diketahui.

Di bawah panduan ada **daftar fitur lain** yang bisa diketuk, supaya pemakai
bisa berpindah panduan tanpa menutup. Fitur yang sedang dibuka ditandai
(garis biru).

**Panduan ikut menyesuaikan sendiri**: kalau pemakai membuka atau menutup
fitur lain sementara panduan terbuka, panduan langsung berganti ke fitur itu.

### Berkas

| Berkas | Perubahan |
|---|---|
| `js/panduan.js` | **Baru** (17.413 byte) — 9 panduan, pengenal keadaan, penggambar, daftar fitur |
| `index.html` | Tombol `#tombol-panduan` (`?`) di bilah atas; `<aside id="panduan">` dengan `#panduan-kepala`, `#panduan-judul`, `#panduan-tutup`, `#panduan-isi`, `#panduan-kaki`, `#panduan-daftar`; `<script src="js/panduan.js">`; versi `?v=20261017-18` |
| `css/gaya.css` | Gaya `#tombol-panduan`, `#panduan`, `#panduan-*`, `.panduan-*`; di PC `#panduan` jadi kolom kanan 380 px dan peta/bilah/kartu/keterangan menyusut dari kanan; **bilah atas dirapatkan di seluruh mode HP** (lihat bug di bawah) |

### Tampilan

- **PC (≥ 900 px)**: panduan menjadi **kolom kanan 380 px**. Peta menyusut
  dari kanan (dan dari kiri juga kalau panel/form terbuka), jadi peta tetap
  terlihat penuh dan form di kiri tetap bisa dicoba sambil membaca panduan.
- **HP (< 900 px)**: panduan **menutupi layar** karena layarnya sempit.
  Pemakai berpindah fitur lewat daftar "Panduan fitur lain" di bawah.

### Bukti uji (2026-10-17, dijalankan sendiri, Chrome + Playwright)

**Rangkaian 1 — pengenalan keadaan & tata letak (29 uji):**

| Uji | Hasil |
|---|---|
| Tombol `?` ada di bilah atas | ✅ |
| Panduan tertutup di awal | ✅ |
| Klik `?` → panduan terbuka, keadaan awal "Peta & navigasi" | ✅ |
| Isi panduan 4 blok (untuk/cara/hasil/catatan) | ✅ |
| Langkah bernomor terisi | ✅ 4 langkah |
| Daftar fitur lain terisi 9 | ✅ |
| Fitur aktif ditandai | ✅ |
| Pindah panduan lewat daftar | ✅ |
| PC: panduan di sisi kanan (x=1060, w=380) | ✅ |
| PC: peta menyusut dari kanan, tetap memenuhi tinggi (800 px) | ✅ |
| PC: panel anggota kiri + panduan kanan, peta di tengah (x=380, w=680) | ✅ |
| Panduan menyesuaikan ke Daftar anggota | ✅ |
| Panduan menyesuaikan ke Tambah / ubah anggota | ✅ |
| Panduan menyesuaikan ke Kelola kategori | ✅ |
| Panduan menyesuaikan ke Peta suku bangsa | ✅ |
| Panduan menyesuaikan ke Peta penduduk | ✅ |
| Panduan menyesuaikan ke Peta agama | ✅ |
| Panduan menyesuaikan ke Cari | ✅ |
| `Escape` menutup panduan | ✅ |
| Tombol `?` menutup panduan | ✅ |
| HP: panduan menutupi layar (390x844) | ✅ |
| HP: tombol `?` masih di dalam layar | ✅ |
| HP 360: bilah atas tidak meluber | ✅ |
| Galat konsol | ✅ 0 |

**Rangkaian 2 — tata letak PC & kartu (11 uji):**

| Uji | Hasil |
|---|---|
| PC: form kiri + panduan kanan, peta di tengah | ✅ peta x=380 w=680 |
| PC: peta masih memenuhi tinggi | ✅ 800 px |
| PC: daftar Populasi tidak masuk ke bawah panduan | ✅ kanan=208, panduan kiri=1060 |
| Panduan menyesuaikan ke Rincian wilayah saat kartu muncul | ✅ |
| PC: kartu rincian tidak masuk ke bawah panduan | ✅ kanan=568 |
| PC: keterangan warna tidak masuk ke bawah panduan | ✅ kanan=172 |
| PC: kartu tetap muat saat panel kiri + panduan kanan terbuka | ✅ lebar=560 |
| Klik di dalam panduan tidak menutup panel anggota | ✅ |
| Panduan pindah ke fitur yang dipilih | ✅ |
| Membuka daftar Populasi saat panduan terbuka tetap jalan | ✅ |
| Galat konsol | ✅ 0 |

**Rangkaian 3 — HP (10 uji):**

| Uji | Hasil |
|---|---|
| HP: panduan menutupi layar saat form terbuka | ✅ 390x844 |
| HP: panduan menyesuaikan ke Tambah / ubah anggota | ✅ |
| Panduan form menyebut peta terbang | ✅ |
| Panduan form menyebut pin lokasi | ✅ |
| Panduan form menyebut titik tengah wilayah | ✅ |
| Menutup panduan tidak menutup form | ✅ |
| HP: tombol bilah atas memang di belakang panduan (bukan bug) | ✅ |
| HP: bisa pindah panduan lewat daftar fitur | ✅ |
| HP: setelah panduan ditutup, daftar Populasi bisa dibuka | ✅ |
| Galat konsol | ✅ 0 |

**Rangkaian 4 — lebar layar (12 lebar):** 320, 340, 360, 390, 400, 412, 430,
480, 600, 899, 900, 1440 px — semuanya ✅ bilah atas muat, tombol `?` tidak
terpotong.

**Isi kesembilan panduan** — semuanya lengkap 4 blok:

| Panduan | Cara pakai | Yang akan terjadi | Catatan |
|---|---|---|---|
| Peta & navigasi | 4 langkah | 3 | 2 |
| Daftar anggota | 6 langkah | 2 | 3 |
| Tambah / ubah anggota | 7 langkah | 4 | 3 |
| Kelola kategori | 5 langkah | 2 | 2 |
| Peta suku bangsa | 5 langkah | 4 | 3 |
| Peta penduduk | 5 langkah | 3 | 2 |
| Peta agama | 6 langkah | 2 | 3 |
| Cari | 4 langkah | 2 | 2 |
| Rincian wilayah | 4 langkah | 1 | 2 |

### Bug yang ditemukan & diperbaiki saat uji

**Bilah atas meluber di lebar 401-430 px — tombol Cari & Panduan terpotong.**

Ini bug **lama** yang sudah ada sebelum orderan panduan, tetapi tombol `?`
yang baru memperburuknya (jadi 7 tombol). Diukur 17 Okt 2026 pada lebar
430 px: bilah butuh **536 px** sedangkan bingkai HP hanya **430 px**
(`--lebar-hp: 430px`), sehingga tombol paling kanan terpotong dan tidak bisa
diklik. Diperparah lagi karena aturan perapatannya hanya berlaku di
`@media (max-width: 400px)`, padahal bingkai HP **selalu** 430 px berapa pun
lebar layarnya.

Diperbaiki: aturan perapatan bilah atas (gap 5 px, padding 7 px, tombol
Anggota/Agama/Suku jadi ikon saja) dipindah dari `max-width: 400px` ke
`max-width: 899px` — jadi berlaku di **seluruh mode HP**. Setelah dirapatkan
bilah butuh **387 px**, muat dengan sisa ruang. Tampilan di bawah 400 px
**tidak berubah** karena aturannya sama, hanya cakupannya diperluas.

Bukti: pada 430 px, tombol Cari kanan = 388 px dan tombol `?` kanan = 423 px
(keduanya di dalam bingkai 430 px). Diuji ulang pada 12 lebar layar — semua
muat.

### Catatan

- Bahasa panduan memakai **"Anda"**, bukan "Bapak", supaya bisa dipakai
  siapa saja.
- Panduan **tidak** memakai berkas terpisah per fitur; seluruh isi ada di
  dalam `js/panduan.js` sebagai satu larik `PANDUAN`, supaya tidak ada
  permintaan berkas tambahan saat tombol `?` diketuk.
- `e.stopPropagation()` pada tombol `?` diperlukan agar pendengar klik di
  `document` (yang menutup daftar melayang) tidak ikut menyala — kalau tidak,
  membuka panduan akan menutup daftar Populasi/Agama yang sedang terbuka.
- Pendengar klik di `document` memakai **fase tangkap** (`true`) supaya
  berjalan sebelum pengubah keadaan, lalu ditunda `setTimeout(…, 0)` agar
  keadaannya sudah menetap saat diperiksa.
- Di HP panduan menutupi bilah atas, jadi tombol bilah atas tidak bisa
  diklik selama panduan terbuka. Ini **disengaja** — pemakai berpindah fitur
  lewat daftar "Panduan fitur lain" di bawah panduan.


## Panduan pemakaian interaktif — tautan di dalam kalimat (perintah 2026-10-17)

Pemilik proyek: *"saya mau revisi cara menyajikan .. dibawah ini dari sisi
kalimat ok tapi interatif membuat lebih jelas saya memberikan tanda <abcd>
kurung ini artinya link jika di klik akan bereaksi pada peta atau sesuatu..
apakah konsep panduan interatif akan membebani aplikasi? jika tidak terlalu ..
saya ingin panduan seperti ini.. user lebih mudah mengerti cara kerja"*.

### Jawaban atas pertanyaan "apakah membebani aplikasi?"

**Tidak.** Ukuran `js/panduan.js` bertambah dari 17,4 KB menjadi 25,9 KB
(+8,5 KB), dimuat **sekali** saat aplikasi dibuka. Saat aplikasi berjalan
biasa: **nol** kerja tambahan — tidak ada animasi berjalan terus, tidak ada
pemeriksaan berkala, tidak ada permintaan jaringan, tidak ada pustaka baru.
Kerja hanya muncul saat tautan diketuk, dan selesai dalam 1-2 detik. Yang
bertambah hanya beberapa pendengar klik (satu per tautan) dan 80 baris CSS.

### Keputusan pemilik proyek (ditanyakan sebelum dikerjakan)

| Pertanyaan | Jawaban |
|---|---|
| Di HP, saat tautan gerak peta diketuk | **Panduan menyingkir sebentar** lalu kembali sendiri |
| Tombol Simpan / Hapus | **Disorot berkedip saja**, tidak diklik (aman) |

### Cara kerja

Kata kunci di dalam kalimat panduan ditulis dengan tanda `[[kata|aksi]]`.
Saat digambar, tanda itu menjadi **tautan** berwarna biru bergaris bawah
putus-putus. Saat diketuk, tautan **benar-benar menjalankan** yang dimaksud —
peta bergerak, tombol ditekan. Jadi pemakai tidak hanya membaca, tapi melihat
sendiri caranya.

**Tiga jenis aksi:**

| Jenis | Yang terjadi | Contoh |
|---|---|---|
| **Gerak peta** | Peta diperagakan bergerak / membesar, lalu kembali | `seret`, `cubit` |
| **Tekan tombol** | Tombol itu benar-benar ditekan | `tekan:#tombol-jenis`, `tekan:#geser-kanan`, `tingkat:kecamatan`, `populasi:provinsi`, `agama:islam` |
| **Sorot saja** | Tombol / kolom dikedipkan, **tidak** ditekan | `sorot:#fa-simpan`, `wilayah:provinsi` |

**Daftar aksi lengkap:**

| Aksi | Yang dijalankan |
|---|---|
| `seret` | Peta digeser kiri lalu kembali — seperti diseret satu jari / mouse |
| `cubit` | Peta diperbesar 1 tingkat lalu kembali — seperti dicubit / digulir roda |
| `tekan:#id` | Tombol `#id` benar-benar diklik |
| `sorot:#id` | Tombol / kolom `#id` dikedipkan 1,75 detik, tidak diklik |
| `tingkat:provinsi` | Tombol tingkat di daftar anggota diklik (mengelompokkan daftar) |
| `wilayah:provinsi` | Kolom pilihan wilayah di form dikedipkan |
| `populasi:provinsi` | Daftar Populasi dibuka, lalu tingkat itu dipilih |
| `agama:islam` | Daftar Agama dibuka, lalu agama itu dipilih |
| `agama-tingkat:kabkota` | Daftar Agama dibuka, lalu tingkat itu dipilih |

**Jumlah tautan per panduan** (diukur 17 Okt 2026):

| Panduan | Tautan |
|---|---|
| Peta & navigasi | 8 |
| Daftar anggota | 8 |
| Tambah / ubah anggota | 12 |
| Kelola kategori | 5 |
| Peta suku bangsa | 3 |
| Peta penduduk | 6 |
| Peta agama | 13 |
| Cari | 2 |
| Rincian wilayah | 3 |

### Perilaku di PC dan di HP

| Keadaan | PC (>= 900 px) | HP (< 900 px) |
|---|---|---|
| Panduan terbuka | Kolom kanan 380 px, peta tetap terlihat | Menutupi seluruh layar |
| Tautan gerak peta diketuk | Peta langsung terlihat bergerak, panduan tetap terbuka | Panduan **turun ke bawah** 1,8 detik supaya peta terlihat, lalu naik lagi sendiri |
| Tautan tekan tombol | Panduan tetap terbuka, hasilnya terlihat di sebelah kiri | Panduan **ditutup** supaya hasilnya terlihat |
| Tautan sorot | Tombol dikedipkan, panduan tetap terbuka | Sama |

### Berkas yang diubah

| Berkas | Perubahan |
|---|---|
| `js/panduan.js` | **Ditulis ulang.** `langkah[]` kini memuat tanda `[[kata\|aksi]]`; fungsi baru `urai()`, `tulis()`, `jalankan()`, `gerakPeta()`, `tekan()`, `sorot()`, `bukaDaftar()`, `singkir()`, `kilat()`, `periksaUlang()`; `blok()` memakai `tulis()` bukan `textContent` |
| `css/gaya.css` | Gaya `.panduan-tautan`, `.panduan-tautan-mati`, `#panduan.panduan-singkir`, `.panduan-sorot` + 2 `@keyframes` |
| `index.html` | Penanda versi `?v=20261017-18` -> `?v=20261017-19` (13 tempat) |

### Hal yang perlu diperhatikan

- **Tombol yang mengubah data sengaja hanya dikedipkan.** Kalau `Simpan`
  benar-benar diklik dari panduan, data anggota bisa tersimpan tanpa sengaja.
  Jadi `Simpan`, `Hapus`, `Batal`, `+ Tambah`, `Edit`, `Del` memakai `sorot:`,
  bukan `tekan:`.
- **Daftar Populasi punya perilaku klik-pilih/klik-mati.** Kalau peta Populasi
  sedang menyala, klik tombol = mematikan, bukan membuka daftar. Karena itu
  `bukaDaftar()` memeriksa dulu apakah daftarnya sudah terbuka; kalau belum,
  tombol diklik dan diperiksa lagi setelah 90 ms, lalu diklik sekali lagi bila
  perlu.
- **`jamKunci` (1,6 detik)** mencegah panduan berpindah sendiri selama
  `bukaDaftar()` berjalan — daftar terbuka lalu tertutup lagi, dan tanpa kunci
  itu panduan akan melompat ke panduan lain.
- **`periksaUlang()`** dipanggil 140 ms setelah tautan `tekan:` dijalankan,
  supaya panduan ikut menyesuaikan bila tombol itu mengubah keadaan
  (mis. `+ Anggota` membuka form -> panduan berganti ke "Tambah / ubah
  anggota").
- **Tautan yang tombolnya sedang tidak tampil** (mis. `Matikan peta agama`
  saat daftar Agama tertutup) berkedip sebentar lewat `.panduan-tautan-mati`,
  jadi pemakai tahu tautannya memang bekerja — bukan diam saja.
- **`#panduan` diberi `transition: transform 260ms`** untuk gerak menyingkir.
  Saat menyingkir, `pointer-events: none` dipasang supaya klik jatuh ke peta.

### Bukti uji (Playwright, 17 Okt 2026)

**54 uji lulus, 0 gagal, 0 galat konsol.**

| Rangkaian | Jumlah | Isi |
|---|---|---|
| PC 1440x900 | 26 | Panduan jadi kolom kanan 380 px; 8 tautan tergambar; tidak ada sisa tanda `[[ ]]`; tautan Satelit benar-benar mengganti jenis peta; tautan geser-kanan benar-benar menggeser peta; tautan seret membuat peta bergerak; tautan cubit memperbesar peta; di PC panduan **tidak** menyingkir; pindah panduan lewat daftar; panduan otomatis jadi panduan form saat form dibuka; tautan Simpan **hanya dikedipkan** dan form tetap terbuka; tautan Provinsi menyorot kolom pilihan; tautan + Anggota membuka form; tautan Kecamatan mengelompokkan daftar; tautan Provinsi menyalakan peta penduduk; tautan Islam menyalakan peta agama; tautan Kabupaten/Kota mengganti tingkat agama; tautan Suku membuka panel suku; tautan Cari membuka kotak pencarian; tautan X menutup pencarian; setiap panduan punya tautan |
| HP 390x844 | 11 | Panduan menutupi layar; tautan seret membuat panduan **turun ke bawah** (top > 700 px) lalu **naik lagi sendiri**; tautan tekan menutup panduan; tautan Provinsi menyalakan peta penduduk; tautan Kristen menyalakan peta agama; tautan Simpan hanya dikedipkan dan form tetap terbuka |
| 8 lebar layar (320-1280 px) | 16 | Panduan selalu muat di dalam bingkai, 0 galat |
| Kasus tepi | 3 | Tautan `Matikan peta agama` benar-benar mematikan (agama aktif -> false) dan panduan berganti ke "Peta & navigasi"; tautan `Matikan peta suku` benar-benar mematikan; tautan X pada kartu menutup kartu dan panduan berganti |

### Catatan

- Tanda `[[ ]]` dipilih karena **tidak bentrok** dengan tanda lain di dalam
  kalimat panduan (tanda kurung biasa, tanda kutip, tanda pisah).
- Penguraian memakai satu pola regex `POLA` yang di-`lastIndex = 0` setiap
  kali dipakai, supaya tidak ada keadaan tersisa antar pemanggilan.
- Tautan dibuat sebagai `<button>` (bukan `<a>`), jadi bisa difokus dengan
  Tab dan ditekan dengan Enter — tetap bisa dipakai tanpa mouse.

---

## Orderan 23 — data anggota dari tokomedia.org (perintah 2026-10-18)

Pemilik proyek: *"data member / anggota .. mau minta km input data.. sumber data
https://tokomedia.org/ kategori: film isa, film ikatan ilahi, video kitab suci,
clip kitab suci, dan aplikasi alkitab .. masing2 kategori berisi berbagai bahasa
daerah.. jadi semua data tsb mau dimasuk dalam keanggota .. 2 digit di ganti icon
.. data yg ada dihapus termasuk kategori .. di input dengan kategori baru ini ..
input semua data per kategori dan daerahnya"*

Lalu ditambah: *"data bekerja berdasarkan API dari website TokoMedia .. jika data
dimasuk di TokoMedia.. di Pemetaan otomatis muncul bendera kategori ditempatkan
sesuai lokasi diinput.. otomatis tidak harus real time .. bisa lewat tombol
[update]"*

### Keputusan pemilik proyek (ditanyakan sebelum dikerjakan)

| Pertanyaan | Jawaban |
|---|---|
| Satu bahasa jadi berapa data? | **3 data terpisah** bila muncul di 3 kategori (total 699) |
| Titik di peta dari mana? | **Perkiraan provinsi asal bahasa**, dipetakan satu per satu |
| Data lama? | **Dihapus semua** (anggota + kategori), di-backup dulu |
| Kunci aplikasi? | Dikirim lewat chat |
| Icon kategori? | Seperti gambar acuan (orang, rantai, kamera, putar, ponsel) **+ beberapa pilihan lain** |
| Nama di daftar | **Nama bahasa + kategori** — "Aceh - Film Isa Al-Masih" |
| Cara ambil data | **A. Worker + tombol [Update]** |

### Temuan penting sebelum mengerjakan

| Yang diperiksa | Hasil |
|---|---|
| API `tokomedia.org/api/index.php/api/...` | ❌ **Belum terpasang** — 5 variasi alamat semuanya mengembalikan halaman login HTML (5.070 byte), bukan JSON |
| CORS tokomedia.org | ❌ **Tidak ada** `Access-Control-Allow-Origin` — peramban dilarang mengambil langsung |
| Kolom lokasi di database TokoMedia | ❌ **Tidak ada** `lat`/`lng`/`koordinat` di 15 tabel mana pun |
| Endpoint tulis TokoMedia | ❌ Tidak ada — data masuk lewat admin `/manage/*` |
| Ambil halaman dari server | ✅ **Bisa** — 5 halaman kategori, ±3,8 detik |

**Kesimpulan:** "otomatis muncul" bisa, tapi lewat **Worker** (server), bukan
peramban. "Sesuai lokasi diinput" **tidak bisa persis** — TokoMedia tidak
menyimpan lokasi. Yang dipakai: nama bahasa → provinsi (perkiraan).

### Cara kerja

1. Tombol **[↻ Update]** di kepala panel Anggota.
2. Worker `pemetaan-api` mengambil 5 halaman kategori tokomedia.org.
3. Worker mengurai tabel bahasa per gugus pulau dari HTML.
4. Worker menghitung **koordinat** tiap bahasa: nama → provinsi → titik tengah
   kotak batas provinsi. Bila belum terpetakan → titik tengah gugus pulau.
5. Titik digeser dalam lingkaran kecil per provinsi **dan** per kategori,
   supaya 699 penanda tidak bertumpuk (terbukti **699 titik unik**).
6. Worker menyimpan ke Neon lewat `simpanAnggotaBanyak` (100 baris perintah).
7. Aplikasi memuat ulang daftar + penanda.

**Tidak ada penarikan otomatis.** Hanya saat tombol ditekan — supaya
tokomedia.org tidak dibebani.

### Berkas yang dibuat / diubah

| Berkas | Isi |
|---|---|
| `cloudflare/worker.js` | Aksi baru `tarikTokomedia` + `simpanAnggotaBanyak`; pengurai HTML; penghitung koordinat |
| `cloudflare/peta-bahasa.js` | **Baru** — 430 bahasa → kode provinsi, 38 titik provinsi, 5 titik gugus (12 KB) |
| `alat/buat-peta-bahasa.js` | **Baru** — pembangkit `peta-bahasa.js` dari data Dukcapil |
| `alat/sumber-tokomedia/peta-provinsi.json` | **Baru** — pemetaan 430 bahasa → provinsi (diedit manual, satu per satu) |
| `js/ikon.js` | **Baru** — 14 icon SVG (5 kategori + 9 pilihan lain) |
| `js/tokomedia.js` | **Baru** — tombol [Update], pesan kemajuan, pemuatan ulang |
| `js/simpanan.js` | `tarikTokomedia()`, `simpanAnggotaBanyak()` |
| `js/member.js` | Penanda memakai `icon-image`; `kodeUntukTingkat`/`namaWilayah` memakai tingkat di atasnya bila kosong |
| `index.html` | Tombol `[↻ Update]`, skrip `ikon.js` + `tokomedia.js`, penanda versi `?v=20261018-01` |
| `css/gaya.css` | Gaya `#anggota-update` |

### Icon kategori

| Kategori | Icon |
|---|---|
| Film Isa Al-Masih | 👤 orang |
| Film Ikatan Ilahi | 🔗 rantai |
| Video Kitab Suci | 📹 kamera |
| Clip Kitab Suci | ▶ tombol putar |
| Aplikasi Kitab Suci | 📱 ponsel |

Pilihan tambahan: buku, audio, globe, bintang, pin, rumah, sekolah, kesehatan,
sosial. Icon digambar 64×64 lalu ditampilkan 15 px, jadi tetap tajam di HP.

### Bukti uji (2026-10-18, dijalankan sendiri)

| Uji | Hasil |
|---|---|
| Penarikan dari Worker sungguhan | ✅ **699 bahasa, 0 gagal, 3,8 detik** |
| Per kategori | ✅ Film Isa 177 · Ikatan Ilahi 8 · Video 107 · Clip 177 · Aplikasi 230 |
| Bahasa belum terpetakan | ✅ **0** — semua 430 nama punya provinsi |
| Titik unik | ✅ **699 dari 699** — tidak ada yang bertumpuk |
| Tanpa koordinat | ✅ **0** |
| Hapus data lama | ✅ 3 anggota + 6 kategori lama terhapus (backup tersimpan) |
| Kategori baru | ✅ 5 kategori masuk |
| Simpan 699 anggota | ✅ **4,4 detik**, 100 baris per perintah |
| Verifikasi database | ✅ 699 anggota · 5 kategori · 699 titik unik · 0 tanpa koordinat |
| Tombol [Update] dari aplikasi | ✅ "699 anggota tersimpan dari tokomedia.org." · 0 antrean |
| Icon terpasang di peta | ✅ 5 icon unik tampil (`ikon-orang`, `ikon-rantai`, `ikon-kamera`, `ikon-putar`, `ikon-ponsel`) |
| Icon tetap ada setelah ganti jenis peta | ✅ Satelit → Map, 5 icon masih terpasang |
| Semua 14 icon SVG valid | ✅ termuat, piksel terisi 873–1653 |
| Daftar dikelompokkan per provinsi | ✅ ACEH · JAWA BARAT · JAWA TENGAH · KEPULAUAN BANGKA BELITUNG · SULAWESI SELATAN |
| Tombol muat di HP 320/390/430 px | ✅ semua muat, tidak terpotong |
| Galat konsol | ✅ **0** (selain 401 dari uji kunci salah yang disengaja) |

### Catatan

- **Kunci aplikasi sempat dikirim lewat chat** atas permintaan pemilik proyek.
  Pemilik proyek menyatakan ini **hanya demo dan tidak dipublikasikan**, jadi
  kunci **tidak perlu diganti** (keputusan 2026-10-22).
- Backup data lama: `files/backup-anggota-20261018.json` di folder sesi
  (3 anggota: yayasan obi, Rsud mata, paud + 6 kategori lama).
- Anggota tokomedia hanya diketahui **provinsinya**, bukan kabupaten/kecamatan/
  desa. Karena itu `kodeUntukTingkat()` dan `namaWilayah()` memakai tingkat di
  atasnya bila tingkat yang dipilih kosong — supaya tetap tampil di semua
  tingkat pengelompokan.
- Bila tokomedia.org menambah bahasa baru yang belum ada di
  `peta-provinsi.json`, Worker memakai titik tengah gugus pulau sebagai
  cadangan (tidak gagal).

### Revisi 2026-10-18 (lanjutan) — penggabungan dihapus, icon diperbaiki

Pemilik proyek menolak penggabungan penanda (cluster):

> *"jumlah anggota yg di gabung agak sulit tau yg mana di maksud gabung.. sulit
> mengetahui.. kurang efektif"* dan *"km harusnya ikuti arahan saya.. ini agak
> beda.. km membuat kesimpulan sendiri"*

**Keputusan:** penggabungan **dihapus seluruhnya**. Seluruh 699 penanda tampil
satu per satu sebagai icon kategori.

| Yang diubah | Sebelum | Sesudah |
|---|---|---|
| Sumber `anggota` | `cluster: true`, radius 62, maxZoom 16 | tanpa cluster |
| Lapisan penanda | 12 lapisan (termasuk 5 lapisan tumpukan) | **7 lapisan** |
| Klik tumpukan | memperbesar peta | dihapus |
| `LAPISAN_PENANDA` | 12 id | 7 id |
| Posisi icon | di titik lokasi, bukan di bulatan | tepat di pusat bulatan |

**Bug `icon-offset` (ditemukan & diperbaiki 18 Okt 2026).** Nilai `icon-offset`
**dikalikan `icon-size`** — bukan piksel, bukan em. Dengan `icon-size: 0.24`,
offset `-34` hanya menggeser **8 px**, sehingga icon tampak di titik lokasi.
Perbaikannya: `icon-offset = JARAK / UKURAN_IKON` = `-34 / 0.24` = **-141,67**.

Bukti pengukuran langsung dari peta (jarak piksel dari titik lokasi):

| `icon-size` | `icon-offset` | Geser sebenarnya |
|---|---|---|
| 0,24 | 0 | 0 px |
| 0,24 | −34 | **−8 px** |
| 0,24 | −100 | −24 px |
| 0,24 | −142 | **−34 px** ✅ |
| 0,5 | −34 | −16,5 px |
| 1 | −34 | −33,5 px |

**Bukti uji setelah perbaikan:**

| Uji | Hasil |
|---|---|
| Posisi icon vs bulatan (z12, z15, z18) | ✅ pusat icon −34 px, pusat bulatan −33,5…−34,5 px → sejajar |
| Kelima kategori | ✅ semua icon sejajar di dalam bulatan |
| Zoom 6 / 9 / 12 / 15 / 18 | ✅ icon tetap di dalam bulatan di semua tingkat |
| Jumlah fitur | ✅ 699 |
| Lapisan penanda | ✅ 7 (tidak ada lapisan tumpukan) |
| Icon setelah ganti ke Satelit | ✅ tetap terpasang & sejajar |
| Tombol sembunyikan penanda | ✅ `visibility` → `none` lalu `visible` |
| Galat konsol | ✅ **0** |

---

## Orderan 24 — menu "Media on/off" (perintah 2026-10-22)

Pemilik proyek: *"ada tokomedia.. di petakan dengan menu 'Media on/off' di
bawahnya media Isa Al Masih, Kitab Suci, Clip Kitab Suci dan Aplikasi Kitab
Suci .. sudah ada di kab/desa/kota mana saja .. masing diberi pin menurut icon"*

Lalu ditambah: *"jadi peranan menu media on/off artinya semua kategori dihide
atau unhide pada pilihan user.. user bisa pilih kategori mana untuk dilihat atau
di hide"* dan *"hanya 4 kelompok .. tapi jika hidup hanya tombol user yg pilih
mana yg hidup user yg atur mana yg mau di hidupkan dan matikan secara serempak"*
dan *"mau diganti menu baru tapi syarat konsep harus tetap sama"*.

### Keputusan pemilik proyek (ditanyakan sebelum dikerjakan)

| Pertanyaan | Jawaban |
|---|---|
| Berapa kelompok media? | **5** — Ikatan Ilahi ikut (semula terlupa) |
| Sumber lokasi | **Data yang ada** (provinsi). Bila perlu, dicari dulu provinsi asal bahasanya |
| Tombol bilah atas | **Diganti ikon saja** supaya semuanya muat; arti ikon masuk panduan |
| Tombol mata (👁) | **Diganti** menu baru, konsep tetap sama |
| "Rumah Sakit" | Sama dengan **Kesehatan** |

### Yang dikerjakan

| Berkas | Perubahan |
|---|---|
| `js/media.js` | **Berkas baru.** Menu Media on/off: daftar kelompok, tombol hidup/mati per baris, tombol serempak, simpan keadaan |
| `js/member.js` | Properti `kategori` ikut ke GeoJSON penanda; `terapkanTampil()` menyaring 7 lapisan penanda. Tombol mata & `pasangTampil()` dihapus |
| `js/ikon.js` | `PD_IKON.gambar(id, warna)` — data URI SVG berwarna terang untuk dipakai di HTML |
| `index.html` | Tombol `#tombol-media` + wadah `#pemilih-media`; tombol mata dihapus; versi naik ke `?v=20261022-01` |
| `css/gaya.css` | Gaya menu Media on/off; bilah atas menjadi ikon saja |
| `js/panduan.js` | Dua bagian baru: "Media on/off" dan "Arti ikon di bilah atas"; aksi `media:hidup` / `media:mati` |

### Ukuran bilah atas (diukur 22 Okt 2026)

Delapan tombol bertulisan penuh butuh **536 px**, sedangkan bingkai HP selalu
hanya **430 px** — tombol paling kanan terpotong. Setelah menjadi ikon saja:

| Lebar layar | Lebar bilah | Butuh | Muat? |
|---|---|---|---|
| 320 px | 256 px | 282 px | ✅ (jaring pengaman < 300 px: 253 px) |
| 360 px | 288 px | 288 px | ✅ |
| 430 px | 344 px | 344 px | ✅ |
| 900 px | 428 px | 428 px | ✅ |
| 1400 px | 1120 px | 1120 px | ✅ |

### Bukti uji

| Uji | Hasil |
|---|---|
| Penyaringan penanda (hanya Kesehatan hidup) | ✅ hanya "Rsud mata" tampil |
| Bertahan setelah ganti jenis peta | ✅ filter tetap terpasang |
| Bertahan setelah halaman dimuat ulang | ✅ pilihan tersimpan di database |
| Tombol Semua hidup / Semua mati | ✅ bekerja pada seluruh daftar |
| Menu di layar pendek (320 px) | ✅ bisa digulir, tidak terpotong |
| Galat konsol | ✅ **0** |

---

## Orderan 25 — seluruh kategori bisa dihidupkan / dimatikan (perintah 2026-10-22)

Pemilik proyek: *"hanya 4 kelompok .. tapi jika hidup hanya tombol user yg pilih
mana yg hidup user yg atur mana yg mau di hidupkan dan matikan secara serempak"*

Menu Media on/off awalnya hanya menampilkan kategori yang sedang dipakai anggota.
Orderan 25 meminta **semua** kategori bisa diatur.

### Yang dikerjakan

| Berkas | Perubahan |
|---|---|
| `js/media.js` | Daftar kelompok digabung dari dua sumber: kategori yang dipakai anggota **dan** daftar kategori resmi (`Simpanan.semuaKategori`). Dibaca ulang setiap kali menu dibuka |
| `js/panduan.js` | Catatan bagian "Media on/off" disesuaikan |

Kategori yang belum dipakai anggota tetap muncul supaya bisa diatur lebih dulu.
Kategori yang baru ditambah atau dihapus langsung ikut terlihat tanpa perlu
memuat ulang halaman.

### Bukti uji

| Uji | Hasil |
|---|---|
| Jumlah baris | ✅ 12 (5 media + 7 kategori) |
| Kategori baru "Panti Asuhan" | ✅ langsung muncul setelah ditambah |
| Kategori dihapus | ✅ langsung hilang dari menu |
| Tombol serempak pada daftar penuh | ✅ Semua hidup → `null`, Semua mati → `[]` |
| Galat konsol | ✅ **0** |

---

## Orderan 1–3 (pemulihan data, perintah 2026-10-22)

Pemilik proyek: *"saya mau data yg sudah dimasukkan dalam kategori di hapus ..
tentu di backup terlebih dahulu.. tapi kalau masih ada backup kategori yayasan
sekolah rumah sakit dsb kalau masih ada di restore ke data member"*

### Yang dikerjakan

| Langkah | Hasil |
|---|---|
| Backup data tokomedia | ✅ `backup-tokomedia-20261022.json` (699 anggota, 430.964 byte) |
| Hapus 699 anggota + 5 kategori | ✅ `jumlah: 0` |
| Pulihkan 6 kategori lama | ✅ Kesehatan, Lainnya, Pemerintahan, Sekolah, Sosial, Yayasan |
| Pulihkan 3 anggota lama | ✅ yayasan obi, Rsud mata, paud |
| Pulihkan pengaturan | ✅ `anggota_tingkat=kabkota`, `anggota_tampil=1` |

**Catatan:** kunci aplikasi sempat dikirim lewat chat atas permintaan pemilik
proyek. Pemilik proyek menyatakan ini **hanya demo dan tidak dipublikasikan**,
jadi kunci **tidak perlu diganti** (keputusan 2026-10-22).

---

## Orderan 26 — jangkar & label media per provinsi (perintah 2026-10-22)

Pemilik proyek: *"setiap provinsi yg punya data media harus jelas apa video isa,
clip atau ... usulan ada di pasted image / pakai jangkar dan label .. lebih
menolong user untuk mengetahui apa / bisa dibuatkan .. ??"*

### Masalah

Sebelum orderan ini, peta hanya bisa menjawab **"di mana ada anggota"**. Untuk
tahu **"provinsi ini punya media apa saja"**, pemakai harus membuka daftar
anggota satu per satu. Penanda anggota juga terlalu kecil untuk dibaca dari
jauh, dan jumlahnya bisa ratusan.

### Yang dikerjakan

**Modul baru `js/label.js`.** Setiap provinsi yang punya data media diberi
**satu jangkar** (bulatan putih dengan cincin berwarna) dan **satu label**
berisi nama pendek kelompok medianya.

| Bagian | Keterangan |
|---|---|
| Jangkar | Lapisan `circle`, `minzoom` 3,5 — radius 5,5 px, isi `#f2f7fc`, cincin warna kelompok pertama |
| Label | Lapisan `symbol`, `minzoom` 4 — `Open Sans Bold` 11 px, halo `#0b0f14` 1,8 px |
| Isi label | Nama pendek kelompok, digabung ` · ` — mis. `Film Isa · Clip` |
| Ketuk | Jangkar atau label → provinsinya diberi garis merah berkedip (`PD_ANGGOTA.sorotWilayah`) |
| Keterangan | Pil warna di kiri bawah peta, hanya muncul kalau ada datanya |

**Nama pendek** dipakai supaya label muat:

| Nama panjang | Nama di label |
|---|---|
| Film Isa Al-Masih | Film Isa |
| Film Ikatan Ilahi | Film Ilahi |
| Video Kitab Suci | Video |
| Clip Kitab Suci | Clip |
| Aplikasi Kitab Suci | Ap Kitab |

**Titik jangkar dihitung dari poligon provinsi**, bukan dari kotak pembatasnya.
Cincin terluas dipilih lebih dulu (daratan utama), lalu dihitung titik beratnya
dengan rumus titik berat poligon. Cara ini penting untuk provinsi kepulauan —
kalau memakai titik tengah kotak pembatas, jangkarnya jatuh di laut.

**Label mengikuti menu Media on/off.** `inventaris()` hanya menghitung kelompok
yang sedang hidup (`PD_MEDIA.hidup`), jadi label tidak pernah menyebut kelompok
yang penandanya sedang disembunyikan. `PD_LABEL.segarkan()` dipanggil dari
`js/media.js` (`terapkan`), `js/member.js` (`terapkanTampil`), dan di akhir
`gambarPenanda()` supaya lapisan ikut dibuat ulang setiap kali gaya peta diganti.

### Berkas yang berubah

| Berkas | Perubahan |
|---|---|
| `js/label.js` | **Baru** — 10,7 KB, seluruh logika jangkar & label |
| `index.html` | `<script src="js/label.js">` setelah `media.js`; markup `#keterangan-media`; versi aset naik ke `20261022-04` |
| `css/gaya.css` | Gaya `#keterangan-media` + `.km-pil`; pergeseran di PC saat kolom kiri terbuka |
| `js/member.js` | `PD_LABEL.segarkan()` di `terapkanTampil()` dan di akhir `gambarPenanda()` |
| `js/media.js` | `PD_LABEL.segarkan()` di `terapkan()` |
| `js/panduan.js` | Bagian baru "Label media di peta" (12 bagian) |

### Bukti uji

Diuji dengan 6 anggota sementara di 5 provinsi (Aceh, Bali, NTB, Sulawesi
Selatan, Papua Tengah), lalu seluruhnya dihapus kembali.

| Uji | Hasil |
|---|---|
| 5 provinsi berdata → 5 jangkar + 5 label | ✅ `Film Isa · Clip`, `Video`, `Ap Kitab`, `Clip`, `Film Ilahi` |
| Warna cincin sesuai kelompok | ✅ 5 warna berbeda, sama dengan `warnaKategori` |
| Ketuk jangkar → garis merah provinsi | ✅ Bali disorot, kelilingnya tepat |
| Matikan "Video Kitab Suci" di menu | ✅ label Bali hilang, keterangan ikut berubah |
| Semua mati | ✅ 0 jangkar, 0 label, keterangan disembunyikan |
| Semua hidup | ✅ 5 jangkar kembali |
| Ganti jenis peta (Satelit ⇄ Map) | ✅ lapisan dibuat ulang, label tetap ada |
| Layar 256 px — keterangan vs atribusi | ✅ tidak bertumpuk |
| PC 1440 px, kolom kiri terbuka | ✅ keterangan bergeser ke kanan kolom |
| Tanpa data media | ✅ jangkar, label, dan keterangan tidak ditampilkan |
| Galat konsol | ✅ **0** |

### Catatan

- Data media **belum ada** di database saat orderan ini selesai (hanya 3 anggota
  lama: Yayasan, Kesehatan, Sekolah). Fitur ini akan langsung bekerja begitu
  data media dimasukkan — tidak perlu perubahan kode lagi.
- Nama pendek hanya ada di `PENDEK` (`js/label.js`). Kalau pemilik proyek ingin
  nama lain, cukup ubah satu tempat itu.

---

## Orderan 27 — Pemetaan memakai 2 server (perintah 2026-10-22)

Pemilik proyek: *"maksud saya rumahweb di gunakan pada pemetaan hanya ambil atau
baca bukan update data karena rumahweb yg terhubung langsung ke API client /
sedang pemetaan adalah aplikasi dashboard untuk management .. pemetaan
menggunakan 2 server 1 neon untuk data member dll sedang data tokomedia (media)
ini hanya baca tidak ada update >> apakah bisa guna 2 server"*

lalu: *"set cPanel jangan mengubah untuk TokoMedia ini jangan di utak utik ..
karena sudah terhubung / yg di set cPanel tambahan untuk hub ke pemetaan / jika
aman lanjut proses sampai terhubung pemetaan dengan rumahweb"*

### Masalah

Sebelum orderan ini, Pemetaan mengambil data media dengan **membaca halaman
tokomedia.org** lalu menebak isinya dari HTML. Cara itu rapuh: begitu susunan
halaman berubah, pembacanya rusak. Padahal TokoMedia sudah punya **API
terstruktur** di Rumahweb yang mengembalikan JSON.

Yang menghalangi pemakaian langsung dari peramban: **token API**. Kalau token
ditaruh di JavaScript, siapa pun bisa membacanya lewat "View Source".

### Jawaban: bisa, dan aman

Pemetaan memang bisa memakai **dua server** sekaligus:

| Server | Dipakai untuk | Sifat |
|---|---|---|
| **Neon** (lewat Worker `pemetaan-api`) | data anggota, kategori, pengaturan | baca **dan** tulis |
| **Rumahweb** (lewat `pemetaan-bridge.php`) | data media TokoMedia | **baca saja** |

Pemisahannya rapi karena keduanya tidak pernah menulis ke tempat yang sama.

### Yang dikerjakan

**1. Jembatan baru `pemetaan-bridge.php` di cPanel.**

Berkas baru di `/home/suwj4466/public_html/pemetaan-bridge.php`. **Terpisah
sama sekali** dari `tm-bridge.php` milik aplikasi TokoMedia — berkas itu tidak
disentuh, tidak diubah satu baris pun.

| Pengamanan | Keterangan |
|---|---|
| Hanya POST | `GET` dijawab 405 |
| Kunci jembatan | Wajib di header `X-Pemetaan-Kunci`, dibandingkan `hash_equals` → 401 bila salah |
| Daftar izin | 25 endpoint, **semuanya baca** — tidak ada satu pun endpoint tulis |
| CORS | Hanya `https://suwandhih.github.io` |
| Token API | Disimpan di sisi server, tidak pernah dikirim ke peramban |

**2. Aksi baru `tarikRumahweb` di Worker.**

Worker memanggil jembatan 9 kali (3 kelompok berbahasa + 5 wilayah aplikasi +
1 daftar clip), lalu menghitung koordinat memakai `cloudflare/peta-bahasa.js`
yang sudah ada. Kunci jembatan disimpan sebagai **secret Worker**
(`RUMAHWEB_KUNCI`), bukan di dalam kode.

| Kelompok media | Sumber | Jumlah |
|---|---|---|
| Film Isa Al-Masih | `category/languages` id 1 | 177 bahasa |
| Film Ikatan Ilahi | `category/languages` id 304 | 10 bahasa |
| Video Kitab Suci | `category/languages` id 126 | 107 bahasa |
| Clip Kitab Suci | `ckitab/index` | 1 titik (39 video) |
| Aplikasi Kitab Suci | `aplikasi/area` × 5 gugus | 5 titik |
| | **Jumlah** | **300 anggota** |

**3. Tombol [↻ Update] beralih ke API.**

`js/tokomedia.js` sekarang memanggil `Simpanan.tarikRumahweb()`, bukan lagi
`tarikTokomedia()`. Fungsi lama tetap ada di Worker supaya tidak ada yang
hilang, tetapi tidak dipakai lagi oleh tombol.

**4. Bagian panduan baru** "Perbarui data media" (13 bagian).

### Berkas yang berubah

| Berkas | Perubahan |
|---|---|
| `pemetaan-bridge.php` | **Baru** — di cPanel, 4,4 KB, 25 endpoint baca |
| `cloudflare/worker.js` | Aksi `tarikRumahweb`, `panggilRumahweb()`, `GRUP_RUMAHWEB`, `AREA_APLIKASI`, `KODE_CLIP` |
| `js/simpanan.js` | `tarikRumahweb()` + diekspor |
| `js/tokomedia.js` | Tombol [↻ Update] memakai `tarikRumahweb()` |
| `js/label.js` | Ukuran label mengikuti pembesaran (`interpolate` z4→z7), `text-padding` 8 |
| `js/panduan.js` | Bagian baru "Perbarui data media" (13 bagian) |
| `index.html` | Keterangan tombol Update; versi aset naik ke `20261022-05` |

### Bukti uji

| Uji | Hasil |
|---|---|
| Jembatan + kunci benar | ✅ HTTP 200, JSON kategori lengkap |
| Jembatan tanpa kunci | ✅ **HTTP 401** |
| Jembatan kunci salah | ✅ **HTTP 401** |
| Endpoint tulis lewat jembatan | ✅ `{"status":404,"message":"Endpoint tidak diizinkan"}` |
| `tm-bridge.php` masih hidup | ✅ HTTP 200, 68.819 byte — **tidak tersentuh** |
| Worker `tarikRumahweb` | ✅ `ok:true`, **300 anggota**, **0 gagal** |
| Tombol [↻ Update] di situs | ✅ "300 anggota tersimpan dari API TokoMedia." |
| Anggota di database | ✅ 303 (300 media + 3 lama) |
| Provinsi berlabel | ✅ **35 provinsi** |
| Contoh label | ✅ `ACEH = Film Isa · Film Ilahi · Video · Ap Kitab` |
| Jangkar & label tampil di peta | ✅ 24 jangkar + 24 label pada z4,6 |
| Ketuk jangkar → garis merah provinsi | ✅ Maluku Utara disorot |
| Matikan "Video Kitab Suci" | ✅ label Maluku Utara berubah `Film Isa · Video` → `Film Isa` |
| Semua hidup kembali | ✅ 35 fitur, keterangan 5 pil |
| Bagian panduan baru | ✅ "Perbarui data media" tampil lengkap |
| Galat konsol | ✅ **0** |

### Catatan

- **`tm-bridge.php` tidak disentuh.** Jembatan Pemetaan adalah berkas terpisah
  dengan kunci terpisah, jadi aplikasi TokoMedia tidak terpengaruh sama sekali.
- **Tidak ada endpoint tulis** di daftar izin jembatan. Data TokoMedia tidak
  mungkin berubah lewat jalur ini — sesuai permintaan pemilik proyek.
- Kunci jembatan dan token API **sempat dikirim lewat chat** selama pengerjaan.
  Pemilik proyek menyatakan ini **hanya demo dan tidak dipublikasikan**, jadi
  kunci **tidak perlu diganti** (keputusan 2026-10-22).
- Aksi lama `tarikTokomedia` (pembaca HTML) masih ada di Worker sebagai cadangan,
  tetapi tombol [↻ Update] sudah tidak memakainya.
