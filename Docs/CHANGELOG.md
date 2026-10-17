# CHANGELOG.md — Riwayat Perkembangan Proyek Pemetaan

> **Untuk siapa berkas ini:** manusia. Catatan **semua** perkembangan,
> perbaikan, dan hal baru — supaya bisa dilihat apa yang berubah dan kapan.
>
> **Bukan** aturan kerja (itu di [`agents.md`](./agents.md)), **bukan** daftar
> orderan (itu di [`rencanakerja.md`](./rencanakerja.md)), dan **bukan** konsep
> (itu di [`prompt.md`](./prompt.md)).
>
> Format tanggal: `YYYY-MM-DD` (waktu lokal WIB). Urutan: **terbaru di atas**.

Situs live: https://suwandhih.github.io/Pemetaan/
Repo: https://github.com/suwandhih/Pemetaan

---

## Ringkasan

| Hal | Jumlah |
|---|---|
| Commit | 60 |
| Orderan selesai | 22 |
| Berkas data | 1.110 (85,3 MB) |
| Modul JavaScript | 8 (236 KB) |
| Baris tampilan (`gaya.css`) | ~2.400 |
| Rentang waktu | 2026-10-12 → 2026-10-17 |

**Sebaran commit:** 2026-10-12 → 14 commit · 2026-10-16 → 25 commit ·
2026-10-17 → 21 commit.
---

## 2026-10-17

### Panduan pemakaian interaktif — tautan di dalam kalimat

**Baru.** Kata kunci di dalam kalimat panduan kini menjadi **tautan yang bisa
diketuk** dan langsung memperagakan yang dimaksud — peta benar-benar bergerak,
tombol benar-benar ditekan. Jadi pemakai tidak hanya membaca, tapi melihat
sendiri caranya.

- Tanda `[[kata|aksi]]` di dalam kalimat panduan diurai menjadi tautan biru
  bergaris bawah putus-putus.
- **Tiga jenis aksi:** gerak peta (`seret`, `cubit`), tekan tombol
  (`tekan:#id`, `tingkat:`, `populasi:`, `agama:`), dan sorot saja
  (`sorot:#id`, `wilayah:`).
- **Tombol yang mengubah data sengaja hanya dikedipkan** (`Simpan`, `Hapus`,
  `Batal`, `+ Tambah`, `Edit`, `Del`) — supaya data anggota tidak tersimpan
  atau terhapus tanpa sengaja.
- **Di PC** panduan tetap terbuka (kolom kanan, peta terlihat). **Di HP**
  panduan menyingkir ke bawah 1,8 detik saat tautan gerak peta diketuk, dan
  ditutup saat tautan menekan tombol — supaya hasilnya terlihat.
- Jumlah tautan per panduan: Peta 8 · Anggota 8 · Form 12 · Kategori 5 ·
  Suku 3 · Populasi 6 · Agama 13 · Cari 2 · Rincian 3.
- Beban aplikasi: **+8,5 KB** dimuat sekali, **nol** kerja saat aplikasi
  berjalan biasa, tidak ada pustaka baru, tidak ada permintaan jaringan.
- Uji Playwright: **54 lulus, 0 gagal, 0 galat konsol** (PC 1440×900, HP
  390×844, 8 lebar layar 320–1280 px, 3 kasus tepi). Lalu **12 uji live lulus**.

Berkas: `js/panduan.js` (ditulis ulang), `css/gaya.css`, `index.html`.
Commit: `c60266a`

### Panduan pemakaian di dalam aplikasi (tombol `?`)

**Baru.** Satu tombol `?` di ujung kanan bilah atas. Saat diketuk, aplikasi
memeriksa dulu **pemakai sedang berada di mana**, lalu menampilkan panduan yang
cocok dengan tempat itu — bukan panduan umum yang panjang.

- **9 panduan:** Peta & navigasi, Daftar anggota, Tambah/ubah anggota, Kelola
  kategori, Peta suku bangsa, Peta penduduk, Peta agama, Cari, Rincian wilayah.
- Setiap panduan disusun dengan urutan sama: **Untuk apa** → **Cara pakai** →
  **Yang akan terjadi** → **Catatan**.
- Di PC panduan menjadi **kolom kanan 380 px** sehingga form/daftar di kiri
  tetap terlihat dan bisa langsung dicoba. Di HP menutupi layar.
- Di bawah panduan ada daftar fitur lain supaya bisa berpindah panduan tanpa
  menutup.
- Bahasa memakai **"Anda"**, bukan "Bapak", supaya bisa dipakai siapa saja.

**Bug lama ditemukan & diperbaiki:** bilah atas meluber di lebar 401–430 px —
tombol Cari & Panduan terpotong dan tidak bisa diklik. Bingkai HP **selalu**
430 px sedangkan 7 tombol bertulisan penuh butuh **536 px**. Aturan perapatan
bilah dipindah dari `@media (max-width: 400px)` ke `@media (max-width: 899px)`.
Setelah dirapatkan bilah butuh **387 px**.

Uji: **50 lulus** (29 + 11 + 10), plus 12 lebar layar semua muat, 0 galat.

Berkas: `js/panduan.js` (baru), `index.html`, `css/gaya.css`.
Commit: `34823dc`

### Revisi orderan 20 — panel Suku seperti panel Anggota

**Perbaikan.** Daftar suku diubah dari kotak melayang menjadi **panel seperti
panel Anggota**, supaya peta tetap mudah dilihat saat terbang — tidak tertutup
kotak hitam.

- `#pemilih-suku` (daftar melayang) → `<aside id="panel-suku">` dengan kepala
  (judul + jumlah + tombol ✕), sumber, rincian, isi, dan kaki.
- Rincian suku pindah dari kartu melayang ke dalam panel.
- Di PC panel tetap terbuka saat berganti suku; di HP panel menutup supaya
  peta terlihat.
- **2 bug ditemukan & diperbaiki:** (a) panel Anggota & panel Suku terbuka
  bersamaan dan saling menutupi → dibuat saling mematikan; (b) tabel rincian
  di panel berdesakan karena aturan kisi `#kartu` ikut berlaku → dibatasi
  `#kartu`.

Uji: 28 suku satu per satu, semua lulus.

Berkas: `index.html`, `js/suku.js`, `js/member.js`, `js/warna.js`,
`js/agama.js`, `css/gaya.css`. Commit: `4da33d2`

### Orderan 20 — titik lokasi suku bangsa

**Baru.** Peta titik lokasi **28 kelompok suku bangsa** Indonesia menurut BPS
Sensus Penduduk 2010 (237.641.326 jiwa).

- Data dari `c:\data\datapeta` **dipelajari lalu diolah ulang** — disajikan
  menurut konsep Pemetaan, bukan meniru cara saji DataPeta (aturan 8).
- Setiap suku: peta terbang ke kawasan utamanya, seluruh provinsi di dalam
  kawasan diberi **garis merah berkedip**, dan **satu titik penanda** ditaruh
  di titik tengah kawasan.
- Rincian menampilkan jumlah jiwa, persentase terhadap penduduk Indonesia,
  jumlah provinsi yang disorot, dan daftar kawasan utama.
- 9 suku bertanda "gabungan" (kelompok gabungan menurut BPS, bukan suku
  tunggal). Total 28 suku = 99,55% penduduk Indonesia SP2010.
- Titik penanda & garis wilayah adalah **perkiraan** — BPS tidak menerbitkan
  koordinat suku.

Berkas: `js/suku.js` (baru), `index.html`, `css/gaya.css`. Commit: `df5bf97`

### Orderan 21 — peta penduduk menurut agama, 4 tingkat

**Baru.** Peta tematik sebaran penduduk menurut agama di empat tingkat wilayah
(provinsi → kabupaten/kota → kecamatan → desa/kelurahan).

- **Disajikan dalam persentase**, bukan angka mentah — supaya tidak sekadar
  mengulang peta penduduk.
- **Tujuh agama:** Islam, Kristen, Katolik, Hindu, Budha, Konghucu,
  Kepercayaan. Konghucu & Kepercayaan tetap disajikan dalam **angka jumlah**
  sesuai permintaan.
- Kartu rincian menampilkan jumlah jiwa dan persentase tiap agama, serta
  **agama mayoritas** wilayah itu.
- Terpisah dari menu Populasi.
- Data: **554 berkas** dari Dukcapil Kemendagri (4,8 MB), susunan sama dengan
  berkas poligon tetapi tanpa geometri — geometri diambil dari
  `data/wilayah-warna/`.
- Tiga peta tematik (Populasi, Agama, Suku) memakai lapisan & kartu yang sama,
  jadi setiap `ganti()` mematikan dua yang lain lebih dulu.

Berkas: `js/agama.js` (baru), `data/agama/` (554 berkas), `alat/ambil-agama.js`,
`index.html`, `css/gaya.css`. Commit: `19e8ada`, `f336e53`

### Perbaikan — cari desa/kecamatan yang poligonnya belum dimuat

**Perbaikan.** Pencarian desa/kecamatan kadang tidak "terbang" karena berkas
poligonnya belum dimuat. Diperbaiki: berkas dimuat dulu, baru peta terbang.

Commit: `c88d631`

### Perbaikan — hilangkan popup "Save password?" Chrome

**Perbaikan.** Chrome menawarkan "Save password?" setiap kali ada isian lain
diisi (mis. kotak cari). Sebab: kolom kode database memakai
`type="password"`, dan Chrome **mengabaikan** `autocomplete="off"` pada kolom
itu. Diperbaiki: `type="text"` + `-webkit-text-security: disc` — tulisan tetap
tersamar, tapi Chrome tidak lagi menawarkan simpan sandi.

Commit: `db91af9`

### Orderan 19 — fitur Cari

**Baru.** Pencarian **wilayah**, **anggota**, dan **nama jalan** dengan cepat,
tanpa harus menggeser peta sendiri.

- Tombol `⌕` di sisi kanan bilah atas.
- Wilayah & anggota dicari dari data lokal (instan). Nama jalan dari
  **Nominatim (OSM)** — jeda 400 ms, minimal 3 huruf, `countrycodes=id`.
- Peta terbang ke tempat yang dipilih. Bila hasilnya anggota, rincian anggota
  ikut terbuka.
- Indeks pencarian dibuat oleh `alat/buat-indeks-cari.js`.

Berkas: `js/cari.js` (baru), `alat/buat-indeks-cari.js`, `index.html`,
`css/gaya.css`. Commit: `6fcf469`

### Revisi bilah atas — `[Anggota][👁]` dipindah ke paling kiri

**Perbaikan.** Tombol `[Anggota][👁]` dipindah ke paling kiri bilah atas,
karena form anggota ada di sebelah kiri — jadi lebih enak langsung di bawahnya.

Susunan akhir: `[Anggota][👁]` · `[Satelit]` · `[Populasi 👁]` · `[Agama]` ·
`[Suku]` · `[⌕]` · `[?]`

Commit: `9285c79`

### Orderan 18 lanjutan — pin lokasi, garis merah, tombol peta bergantian

**Baru.** Tiga tambahan pada form Tambah Anggota:

1. **Pin lokasi bisa ditentukan pengguna.** Setelah wilayah diisi, pengguna
   bisa mengetuk peta tepat di lokasi anggota (yayasan/sekolah/rumah sakit)
   untuk menaruh pin 📌 lebih akurat. Pin bisa digeser dengan mengetuk peta di
   tempat lain.
2. **Peta terbang sambil wilayah diberi garis merah berkedip** keliling
   areanya (garis tipis, tidak terlalu tebal).
3. **Tombol Satelit/Map jadi satu tombol bergantian** — hanya ada 2 pilihan,
   jadi sekali tekan langsung ganti. Daftar melayang tidak dipakai lagi.

Berkas: `js/member.js`, `js/inti.js`, `index.html`, `css/gaya.css`.
Commit: `20dd43d`

### Orderan 18 — peta di atas 45%, form 55% bawah (HP)

**Baru.** Saat form Tambah/Ubah Anggota terbuka di HP, peta menyusut ke **45%
atas** dan form menempati **55% bawah**. Peta benar-benar menyusut (tingginya
dipangkas, lebarnya tidak diubah) sehingga MapLibre menghitung ulang ukurannya
dan titik tengah peta = titik tengah area yang terlihat.

Peta terbang otomatis ke wilayah yang dipilih, berjenjang: provinsi →
kabupaten/kota → kecamatan → desa/kelurahan.

Di PC aturan ini tidak berlaku — form tetap kolom penuh di sisi kiri.

Berkas: `js/member.js`, `css/gaya.css`. Commit: `80db38b`

### Orderan 22 — tampilan PC lebar (responsive)

**Baru.** Ralat orderan 14d. Sebelumnya PC dipaksa selebar HP supaya tampilan
2 perangkat sama — **dibatalkan**.

- **PC (≥ 900 px):** bingkai selebar layar, peta **memenuhi tinggi layar tanpa
  ruang kosong**. Panel anggota, panel suku, dan form anggota menjadi **kolom
  kiri 380 px** sehingga peta tetap terlihat penuh.
- **HP (< 900 px):** tetap seperti semula — bingkai `min(100%, 430px)`. Bila
  layar HP lebih lebar, peta ikut lebih lebar (tidak mengecil); bila tidak
  muat, digeser kiri-kanan.

**Alasan keputusan:** Indonesia memanjang ke samping. Kalau seluruh Indonesia
dipaksa masuk layar, petanya jadi terlalu kecil untuk melihat detail —
pengguna toh akan memperbesarnya sendiri. Lebih baik penuh dan digeser
kiri-kanan.

Berkas: `css/gaya.css`, `index.html`. Commit: `4258a55`

---

## 2026-10-16

### Orderan 7 — data anggota sama di PC dan HP lewat database Neon

**Baru.** Data anggota disimpan di **Neon Postgres** lewat **Cloudflare
Worker**, supaya isinya sama di HP dan PC.

- **Kenapa lewat Worker:** situs Pemetaan hanya berkas statis. Kalau sandi
  database ditanam di JavaScript, siapa pun bisa membacanya lewat "View Source"
  lalu menghapus seluruh data. Sandi disimpan di Worker sebagai **secret**.
- **Tiga cara simpan (bertingkat, otomatis):** daring → luring (IndexedDB +
  antrean) → sinkron otomatis begitu daring lagi. Aplikasi tetap bisa dipakai
  saat internet mati.
- **Pengamanan:** peran database `pemetaan_api` hanya boleh
  SELECT/INSERT/UPDATE/DELETE; permintaan hanya dari asal terdaftar; **setiap**
  permintaan wajib menyertakan kunci aplikasi.
- **Kunci aplikasi** dimasukkan sekali per perangkat, lalu diingat peramban.
- Neon Data API **ditolak** karena mewajibkan pendaftaran akun publik.

Berkas: `cloudflare/worker.js`, `js/simpanan.js`, `alat/neon-siapkan.js`.
Commit: `e924dc6`, `b2fa1f2`

### Orderan 17 — data anggota per wilayah

**Baru.** Pengguna bisa **menambah, mengubah, dan menghapus** data anggota per
lokasi. Pengelompokan bisa per desa, kecamatan, kabupaten/kota, atau provinsi.

- Form isian: nama, wilayah berjenjang 4 tingkat, kategori, inisial penanda,
  keterangan (format `Nama = Isi`).
- Penanda anggota di peta berwarna menurut kategorinya.
- Kategori awal: Yayasan, Sekolah, Kesehatan, Sosial, Pemerintahan, Lainnya.

Berkas: `js/member.js` (baru), `js/simpanan.js` (baru), `index.html`,
`css/gaya.css`. Commit: `c87e08f`

### Perbaikan penanda anggota

Beberapa perbaikan berturut-turut supaya penanda tidak saling menimpa dan
mudah dibaca:

- **Bentuk titik-garis-bulatan** — supaya tidak menimpa nama lokasi di peta.
- **Anti-tumpuk (klaster)** — penanda yang berdekatan digabung jadi satu
  lingkaran berisi angka, dengan garis penghubung yang lebih jelas.
- **Tombol tampil/sembunyi penanda** di bilah atas (1× klik).
- **Tombol on/off anggota dipindah langsung ke bilah atas** halaman peta.

Commit: `a038b5c`, `811ea6a`, `b4cfc87`, `dc187d3`

### Kelola kategori anggota

**Baru.** Tambah, ubah, dan hapus kategori anggota.

- **Tanpa popup** — kolom tunggal dengan tombol `+ Tambah`, `Edit`, `Del`.
- Selama mode Kategori terbuka, daftar anggota disembunyikan supaya layar
  kerja bersih.
- Kategori yang masih dipakai anggota tidak bisa dihapus.

Commit: `70730ec`, `0711a92`

### Perbaikan tampilan & form

- **Daftar pilihan wilayah jadi gelap** supaya terbaca (sebelumnya putih di
  atas peta gelap).
- **Pilihan kecamatan dan desa dimuat sendiri oleh form anggota** — sebelumnya
  kosong karena berkasnya belum dimuat.
- **Nama wilayah di bilah atas dihapus**, tombol Anggota dipindah ke kiri.

Commit: `8cf45c9`, `0375733`, `0dd6d9f`

### Orderan 16 — peta tematik jumlah penduduk 4 tingkat

**Baru.** Peta diwarnai menurut jumlah penduduk di empat tingkat wilayah.

- **Provinsi 38 · Kabupaten/kota 514 · Kecamatan 7.285 · Desa/kelurahan
  83.489.**
- Sumber: **Dukcapil Kemendagri** (`gis.dukcapil.kemendagri.go.id`, ArcGIS
  FeatureServer, tanpa kunci).
- **9 kelas warna** bertingkat.
- Wilayah yang datanya kosong diwarnai **abu-abu**, bukan dikarang.
- Tingkat kecamatan & desa baru bisa dibuka setelah peta cukup dekat —
  berkasnya dipecah per provinsi/kabupaten dan dimuat saat kotaknya
  bersentuhan dengan layar.
- **Penyederhana poligon** (diukur): provinsi 0,02° · kabupaten/kota 0,01° ·
  kecamatan 0,01° · desa/kelurahan 0,0005°.

⚠️ **Angka Dukcapil BEDA dengan BPS** — bukan salah, memang beda dasar.
Dukcapil menghitung penduduk terdaftar (administratif), BPS lewat sensus.

Berkas: `js/warna.js` (baru), `data/wilayah-warna/` (554 berkas),
`alat/ambil-dukcapil.js`, `index.html`, `css/gaya.css`.
Commit: `72556f0`, `1de058b`

### Orderan 15 — pemilih jenis peta

**Baru.** Peta bisa berganti antara **citra satelit** dan **peta jalan**.

- Awalnya 4 pilihan (satelit / jalan / gelap / medan), lalu disederhanakan
  menjadi **2 pilihan** dengan satu tombol bergantian (revisi 2026-10-17).
- Mengganti jenis peta **tidak menggeser** titik tengah maupun zoom — apa yang
  sedang dilihat tetap di tempat yang sama.

Berkas: `js/inti.js`, `index.html`. Commit: `3afd461`

### GitHub Pages aktif

**Baru.** Situs live: **https://suwandhih.github.io/Pemetaan/**

Repo dibuat **publik** supaya bisa memakai GitHub Pages gratis.

Commit: `13d9c6a`

### Orderan 14 — peta Indonesia + negara tetangga

**Baru.** Peta Indonesia dengan negara tetangga tetap tampil supaya tidak
kosong dan pulau yang berbatasan (Kalimantan–Malaysia, Papua–PNG, Timor)
tampak utuh.

- **Batas geser 92°–148° BT** — dirapatkan supaya ujung geser tidak
  menampilkan laut kosong.
- **HP tegak (portrait)**, konsep **scroll kiri–kanan**.
- Tinggi peta dikurangi 2 × 40 px bilah, supaya ujung Indonesia tidak tertutup
  bilah.
- Zoom dihitung supaya **seluruh tinggi Indonesia pas di tinggi layar**; lebar
  sengaja tidak dipakai — sisa lebar itulah yang di-scroll kiri-kanan.

Berkas: `index.html`, `css/gaya.css`, `js/inti.js`, `js/lib/maplibre-gl.js`,
`js/lib/maplibre-gl.css`. Commit: `48f547b`

### Orderan 9 — `aturan.md` menjadi `agents.md`

**Perubahan.** Berkas aturan diganti nama menjadi `agents.md`, dan ditambah
**catatan pengingat asisten** supaya aturan benar-benar terbaca setiap sesi
dimulai.

⚠️ Penggantian nama ini sempat **tidak tersimpan** karena dilakukan dari luar
sesi. Pelajaran: periksa `git status` **setiap awal sesi**.

Commit: `9d027e4`, `9edf0ff`

---

## 2026-10-12

### Fondasi teknologi dikunci

**Keputusan.** Setelah riset, fondasi ditetapkan:

**MapLibre GL JS + Esri World Imagery + OpenStreetMap** — tanpa vendor lock,
tanpa biaya, dapat dipakai offline.

**Yang ditolak:**

| Ditolak | Alasan |
|---|---|
| **Google Maps JavaScript API** | aturan & harga bisa berubah sepihak; data statistik tidak di infrastruktur sendiri; bukan peruntukan data tematik |
| **CHNGMKR** | ternyata sendiri memakai Google Maps JS API (tidak melepaskan diri dari Google); tidak ada repo terbuka (`github.com/chngmkr` = 404); kebutuhannya beda (`maxZoom: 14`, tanpa layer data) |

Commit: `6875177`

### Aturan kerja ditetapkan

**Baru.** Aturan kerja 1–7 ditetapkan, lalu bertambah:

- **Aturan 8** — dilarang copy-paste seluruh konsep dari folder/proyek lain.
  Yang boleh: mengambil **ide** dan **cara**, lalu ditulis sendiri.
- **Aturan 9** — tanda kehidupan saat bekerja. Asisten tidak boleh diam di
  layar; wajib melaporkan langkah ke berapa, nama pekerjaan, waktu
  mulai/selesai, hasil perintah, posisi keseluruhan, langkah lama, jalan buntu,
  dan ringkasan akhir.

Commit: `dfd4e52`, `dfece29`, `eb6b689`

### Berkas `.md` dipindahkan ke `Docs/`

**Perubahan.** Seluruh berkas `.md` dipindahkan ke folder `Docs/`. Akar proyek
bersih dari dokumen — hanya berisi berkas aplikasi & konfigurasi. Dicatat
sebagai **aturan 3b**.

Commit: `07288f3`

### Repo GitHub dibuat

**Baru.** Repo `Pemetaan` dibuat **publik** di
`https://github.com/suwandhih/Pemetaan`. Cabang lokal diseragamkan
`master` → `main` mengikuti bawaan GitHub.

Commit: `dc13637`, `2078fbf`

### Orderan 1–13 dicatat

**Baru.** Seluruh orderan dari pemilik proyek dicatat di `rencanakerja.md`
sebagai daftar induk, lalu dikerjakan **satu per satu** (aturan 6).

Commit: `0ee9725`, `b87bc03`, `695ce19`

### Inisialisasi repo

**Baru.** Repo diinisialisasi, aturan kerja 1–7 dicatat, dan kebutuhan data
statistik diriset.

Commit: `dfd4e52`, `8c060d4`

---

## Cara membaca riwayat ini

| Kalau Anda ingin tahu… | Lihat |
|---|---|
| **Apa** yang berubah dan **kapan** | berkas ini |
| **Mengapa** sesuatu diputuskan begitu | [`prompt.md`](./prompt.md) bagian keputusan |
| **Orderan mana** yang sudah selesai | [`rencanakerja.md`](./rencanakerja.md) |
| **Aturan kerja** yang wajib diikuti | [`agents.md`](./agents.md) |
| **Bukti uji** tiap orderan | [`rencanakerja.md`](./rencanakerja.md) bagian bukti uji |
| **Riwayat commit** mentah | `git log` |

### Sebaran commit

| Tanggal | Commit | Isi utama |
|---|---|---|
| 2026-10-12 | 14 | Inisialisasi repo · aturan kerja 1–9 · fondasi teknologi dikunci · berkas `.md` ke `Docs/` · repo GitHub dibuat |
| 2026-10-16 | 25 | Orderan 14, 15, 16, 17, 7 · GitHub Pages aktif · kelola kategori · perbaikan penanda & tampilan |
| 2026-10-17 | 21 | Orderan 22, 18, 19, 21, 20 · panduan pemakaian · panduan interaktif · 3 perbaikan · dokumen lengkap |
| **Total** | **60** | |

---

## Catatan pemeliharaan

- Berkas ini diperbarui **sekali di akhir** pekerjaan, bukan di tengah
  (aturan kerja baku langkah 7).
- Setiap entri menyebut **berkas yang berubah** dan **hash commit** supaya
  bisa ditelusuri.
- Riwayat yang sudah selesai **tidak** ditulis di `agents.md` — berkas itu
  hanya memuat aturan.
