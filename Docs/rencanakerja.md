# Rencana Kerja

Daftar induk seluruh orderan. Lihat aturan mainnya di [aturan.md](./aturan.md).
Aturan pengelolaan:
* Orderan dikerjakan satu per satu (aturan 6).
* Status `SELESAI` hanya sah bila dinyatakan pemilik proyek, disertai tanggal
  penyelesaian (aturan 7).
* Usulan dari asisten ditulis di bagian bawah dan **tidak diproses** tanpa izin
  (aturan 2).

---

## Daftar Orderan

Dicatat 2026-10-12. Dikerjakan **satu per satu** (aturan 6), tidak sekaligus.

| No | Orderan | Status | Estimasi | Tanggal Selesai |
|----|---------|--------|----------|-----------------|
| 1 | Konsep aplikasi: berjalan di Chrome Android; kode di-push ke GitHub; data memakai database Neon; berjalan juga di Chrome PC dengan lebar 50% (simulasi ukuran HP) | BARU | 30–45 mnt | — |
| 2 | UI HP berdiri (portrait); penampakan peta bisa di-scroll kiri-kanan; peta Sumatera–Jawa muat dari atas ke bawah | BARU | 30–45 mnt | — |
| 3 | Peta menjadi utama sehingga harus tetap/freeze; input data tambahan dan panel lain memakai hide/unhide | BARU | 40–60 mnt | — |
| 4 | UI peta memakai citra satelit; harus terlihat gunung, danau, sungai, rumah, jalan, dan nama jalan | BARU | 45–60 mnt | — |
| 5 | Detail peta setara `suwandhih.github.io/petadunia/app/index.html`; citra satelit memakai versi terbaru (data lama sudah banyak berubah, hampir tidak bisa dipakai) | **SUDAH TERPENUHI** — perlu verifikasi ulang | 10 mnt | — |
| 6 | Tahap awal: peta dan tampilan sudah bisa diakses di PC maupun HP; konsep dasar UI, penempatan data, dan isian data | BARU | 90–150 mnt | — |
| 7 | Setelan database: aktifkan Neon Data API, buat tabel, pasang RLS, sambungkan aplikasi ke database | **TERPASANG & TERUJI** ✅ — data sama di PC dan HP lewat Worker `pemetaan-api` (bukan Data API, sebab Data API mewajibkan pendaftaran akun publik) · rincian di bawah | 60–90 mnt | 2026-10-16 |
| 8 | Setelan GitHub: siapkan repo, cabang, GitHub Pages, dan cara unggah perubahan | MENUNGGU KONFIRMASI — repo + remote + push ✅ · **GitHub Pages ✅ aktif** | 30–45 mnt | — |
| 9 | `aturan.md` diganti nama menjadi **`agents.md`** — berisi aturan + catatan agar asisten diingatkan setiap mulai proyek | MENUNGGU KONFIRMASI | 5 mnt | — |
| 10 | Pastikan `rencanakerja.md` berfungsi sebagai **daftar orderan**: yang belum selesai dan yang sudah selesai | BARU | 5 mnt | — |
| 11 | Buat **`prompt.md`** — konsep proyek, supaya AI lain dapat membuat ulang **persis sama** | BARU | 30–45 mnt | — |
| 12 | Buat **`CHANGELOG.md`** — catatan semua perkembangan, perbaikan, dan hal baru | BARU | 15–20 mnt | — |
| 13 | Jawab & siapkan: apakah GitHub sudah siap kerja untuk proyek pemetaan | MENUNGGU KONFIRMASI | 20–30 mnt | — |
| 14 | **Peta Indonesia + negara tetangga** — fokus Indonesia, tetangga tetap tampil supaya tidak kosong; beberapa pulau Indonesia berbatasan langsung dengan negara lain | MENUNGGU KONFIRMASI | 45–60 mnt | — |
| 15 | **Fitur citra satelit atau peta** — peta memakai citra satelit, tetapi bisa juga dalam bentuk peta (contoh acuan: `petadunia`) | MENUNGGU KONFIRMASI | 30–45 mnt | — |
| 16 | **Data jumlah penduduk berjenjang** — provinsi → kabupaten/kota → kecamatan → desa/kelurahan, disajikan seperti `DataPeta`; sumber Dukcapil Kemendagri | MENUNGGU KONFIRMASI | 90–150 mnt | — |
| 17 | **User input data anggota** — tambah/ubah/hapus data per lokasi; pengelompokan bisa per desa, kecamatan, kabupaten, atau provinsi; konsep diambil dari `DataPeta` lalu disesuaikan | MENUNGGU KONFIRMASI | 90–120 mnt | — |

### Rincian Orderan 14 (perintah 2026-10-16)

| Butir | Isi | Status |
|---|---|---|
| 14a | Peta Indonesia sebagai **fokus utama**; negara tetangga **tetap tampil** supaya terlihat nyata, bukan kosong | ✅ |
| 14b | Pulau Indonesia yang **berbatasan langsung** dengan negara lain (Kalimantan–Malaysia, Papua–PNG, Timor, dll.) harus tampak menyatu, tidak terpotong | ✅ |
| 14c | **Letak peta di HP tegak (portrait)** | ✅ |
| 14d | **Di PC lebarnya sama dengan lebar HP** — supaya tampilan di 2 perangkat **sama** | ✅ |
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

## Status Berkas Dokumen Proyek (rencana)

Berdasarkan orderan 9–12. Struktur yang dituju:

| Berkas | Untuk siapa | Isi | Status |
|---|---|---|---|
| **`Docs/agents.md`** | asisten (AI) | Aturan main + catatan agar diingatkan setiap mulai | ✅ Ada — nama & isi sudah diperbarui |
| **`Docs/rencanakerja.md`** | asisten + manusia | Daftar orderan: belum selesai & sudah selesai | ✅ Ada |
| **`Docs/prompt.md`** | manusia / AI lain | Konsep proyek — supaya dapat dibuat ulang **persis sama** | ⛔ Belum ada |
| **`Docs/CHANGELOG.md`** | manusia | Catatan semua perkembangan, perbaikan, hal baru | ⛔ Belum ada |

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

| No | Usulan | Perkiraan Waktu | Catatan |
|----|--------|-----------------|---------|
| —  | —      | —               | —       |

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
