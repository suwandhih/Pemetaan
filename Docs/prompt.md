# prompt.md — Konsep Proyek Pemetaan

> **Untuk siapa berkas ini:** manusia atau AI lain yang ingin **membangun ulang
> proyek ini persis sama**, atau melanjutkannya tanpa kehilangan arah.
>
> **Cara pakai:** berikan berkas ini sebagai konteks awal, lalu baca juga
> [`agents.md`](./agents.md) (aturan kerja) dan [`rencanakerja.md`](./rencanakerja.md)
> (daftar orderan).
>
> ⚠️ Berkas ini memuat **konsep dan keputusan**, bukan riwayat pengerjaan.
> Riwayat ada di [`CHANGELOG.md`](./CHANGELOG.md).

Ditetapkan: 2026-10-17 · Lokasi proyek: `C:\data\Pemetaan`

---

## 1. Proyek ini apa

**Pemetaan** adalah aplikasi peta Indonesia berbasis peramban (browser) yang
menyajikan **data statistik berjenjang** di atas citra satelit, dan
memungkinkan pengguna **menyimpan lokasi** (yayasan, sekolah, rumah sakit, dan
sejenisnya) ke dalam database bersama.

Situs live: **https://suwandhih.github.io/Pemetaan/**

### Yang membedakannya dari peta biasa

| Hal | Pemetaan | Peta biasa |
|---|---|---|
| Fokus | Indonesia, memanjang barat–timur | seluruh dunia |
| Data | statistik berjenjang 4 tingkat di atas peta | tidak ada |
| Simpan lokasi | pengguna menyimpan sendiri, tersimpan di database | tidak ada |
| Biaya | nol — tanpa kunci API, tanpa langganan | biasanya berlangganan |
| Kepemilikan data | di infrastruktur sendiri | di vendor |

### Prinsip yang dipegang

1. **Tanpa vendor lock.** Tidak memakai Google Maps. Peta memakai MapLibre GL JS
   (terbuka) + ubin raster Esri/OSM yang bisa diakses tanpa kunci.
2. **Tanpa biaya.** Tidak ada layanan berbayar di jalur mana pun.
3. **Data tidak dikarang.** Sumber tidak memberi angka → wilayah diwarnai
   abu-abu dan dikatakan datanya kosong. Tidak ada angka perkiraan yang
   disajikan seolah-olah data resmi.
4. **Dibuat sendiri.** Dilarang menyalin seluruh konsep dari folder/proyek lain
   (aturan 8). Yang boleh: mengambil **ide** dan **cara**, lalu ditulis sendiri.
5. **Satu perangkat, satu pengalaman.** Data anggota sama di HP dan PC karena
   disimpan di database, bukan di peramban.

---

## 2. Fondasi teknologi (sudah dikunci)

| Lapis | Dipakai | Alasan |
|---|---|---|
| Pustaka peta | **MapLibre GL JS 5.9.0** — disimpan lokal di `js/lib/` | terbuka, tanpa kunci, bisa jalan luring |
| Citra satelit | **Esri World Imagery** (`server.arcgisonline.com`) | tanpa kunci, CORS `*`, citra terbaru |
| Garis batas & nama tempat | **Esri World Boundaries and Places** | tanpa kunci, menyatu dengan citra |
| Peta jalan | **OpenStreetMap** (`tile.openstreetmap.org`) | tanpa kunci, CORS `*` |
| Pencarian nama jalan | **Nominatim (OSM)** | tanpa kunci, `countrycodes=id` |
| Penyimpanan | **Neon Postgres** lewat **Cloudflare Worker** | gratis, data sama di semua perangkat |
| Cadangan luring | **IndexedDB** di peramban | aplikasi tetap jalan saat internet mati |
| Hosting | **GitHub Pages** | gratis, repo publik |
| Font label peta | **Open Sans Bold** lewat glyphs `fonts.openmaptiles.org` | label nama suku & wilayah |

### Yang DITOLAK dan alasannya

| Ditolak | Alasan |
|---|---|
| **Google Maps JavaScript API** | aturan & harga bisa berubah sepihak; data statistik tidak di infrastruktur sendiri; bukan peruntukan data tematik |
| **CHNGMKR** | ternyata sendiri memakai Google Maps JS API (tidak melepaskan diri dari Google); tidak ada repo terbuka; kebutuhannya beda (`maxZoom: 14`, tanpa layer data) |
| **Neon Data API** | mewajibkan pendaftaran akun publik → diganti Worker Cloudflare |

---

## 3. Susunan berkas

```
C:\data\Pemetaan\
├── index.html                  kerangka halaman peta (~230 baris)
├── datapemetaan.html           laporan data interaktif (orderan 31–32)
├── dashboard.html              dashboard cakupan layanan lama (orderan 29; arsip, bukan tombol utama)
├── css\
│   ├── gaya.css                seluruh tampilan peta (~2.400 baris)
│   └── datapemetaan.css        tampilan laporan data interaktif
├── js\
│   ├── lib\
│   │   ├── maplibre-gl.js      MapLibre GL JS 5.9.0 (954 KB, lokal)
│   │   └── maplibre-gl.css     gaya bawaan MapLibre (69 KB)
│   ├── inti.js                 peta, jenis peta, batas geser, bilah bawah
│   ├── warna.js                peta tematik jumlah penduduk (orderan 16)
│   ├── agama.js                peta tematik penduduk menurut agama (orderan 21)
│   ├── suku.js                 titik lokasi suku bangsa (orderan 20)
│   ├── simpanan.js             penyimpanan: Neon → IndexedDB → antrean
│   ├── ikon.js                 icon penanda kategori (14 icon SVG)
│   ├── member.js               daftar anggota, form, kategori, penanda (1.860 baris)
│   ├── media.js                menu "Media on/off" — pilih kelompok yang tampil (orderan 24)
│   ├── label.js                jangkar & label media per provinsi (orderan 26)
│   ├── tokomedia.js            tombol [Update] — tarik data media dari API TokoMedia (orderan 27)
│   ├── cari.js                 pencarian wilayah / anggota / nama jalan (orderan 19)
│   ├── datapemetaan.js         navigasi laporan dan pembacaan media read-only
│   ├── analisis-media.js       hitungan target/produk, grafik, prioritas, matriks
│   ├── laporan-manajemen.js    tombol ▣ pada peta memuat Data Pemetaan
│   └── panduan.js              panduan pemakaian interaktif (tombol ?)
├── backup\
│   ├── laporan-manajemen-20261024\  index, dashboard, dan gaya lama sebelum diganti
│   ├── popup-wilayah-20261024\      kartu Populasi/Agama dan gaya sebelum orderan 33
│   └── media-akurasi-20261024\      pembaca media lama, snapshot, dan backup database ZIP
├── data\
│   ├── datapemetaan\          indeks, rincian, dan snapshot media; dimuat saat diperlukan
│   ├── wilayah-warna\          554 berkas poligon + angka penduduk
│   │   ├── prop-nasional.js        38 provinsi
│   │   ├── kab-nasional.js         514 kabupaten/kota
│   │   ├── kec-<kode2>.js          38 berkas, dipecah per provinsi
│   │   └── desa-<kode4>.js         514 berkas, dipecah per kabupaten/kota│   └── agama\                  554 berkas angka agama (susunan sama)
├── alat\                       skrip pengambil data (dijalankan manual)
│   ├── ambil-dukcapil.js       poligon + penduduk dari Dukcapil
│   ├── ambil-agama.js          angka agama dari Dukcapil
│   ├── buat-indeks-cari.js     indeks pencarian wilayah
│   ├── buat-peta-bahasa.js     peta bahasa → koordinat untuk Worker
│   ├── buat-datapemetaan.js    membangkitkan indeks laporan berjenjang
│   ├── perbarui-datapemetaan.js pembaruan atribut Dukcapil yang tervalidasi
│   ├── audit-datapemetaan.js   audit seluruh hierarki laporan
│   ├── sumber-tokomedia\       peta-provinsi.json (430 bahasa → provinsi)
│   └── neon-siapkan.js         menyiapkan tabel di Neon
├── cloudflare\
│   ├── worker.js               perantara situs ↔ Neon + penarik data media (orderan 27)
│   ├── peta-bahasa.js          hasil buat-peta-bahasa.js (12 KB)
│   ├── wrangler.toml           setelan Worker
│   └── package.json
└── Docs\
    ├── agents.md               aturan kerja (untuk AI)
    ├── rencanakerja.md         daftar orderan
    ├── prompt.md               berkas ini — konsep
    └── CHANGELOG.md            riwayat perkembangan
```

**Aturan lokasi berkas:** seluruh berkas `.md` **wajib** di `Docs/`. Akar
proyek hanya berisi berkas aplikasi & konfigurasi.

---

## 4. Struktur data — bagian paling penting

### 4.1 Poligon wilayah + angka penduduk (`data/wilayah-warna/`)

Setiap berkas menulis satu variabel global berisi **larik objek**:

```js
window.WARNA_PROP = [
  {
    "k": "11.ACEH",                    // kunci: kode bertitik + nama
    "a": [11, "ACEH", 5623479, 1691370, 56835, null],
    //   ↑no_prop ↑nama  ↑penduduk ↑kk      ↑luas  ↑kepadatan
    "g": [ [ [ [95.434,5.657], ... ] ] ]   // cincin koordinat [bujur, lintang]
  },
  ...
];
```

| Variabel | Berkas | Isi kolom `a` |
|---|---|---|
| `WARNA_PROP` | `prop-nasional.js` | `[no_prop, nama, penduduk, kk, luas, padat]` |
| `WARNA_KAB` | `kab-nasional.js` | `[no_prop, no_kab, nama, penduduk, kk, luas, padat]` |
| `WARNA_KEC` | `kec-<kode2>.js` | `[no_prop, no_kab, no_kec, nama, penduduk, kk, luas, padat]` |
| `WARNA_DESA` | `desa-<kode4>.js` | `[no_prop, no_kab, no_kec, no_kel, nama, penduduk, kk, luas, padat]` |

**Lebar kode bertingkat:** `[2, 2, 2, 4]` — provinsi 2 digit, kabupaten 2,
kecamatan 2, desa/kelurahan 4. Dipakai di `js/member.js` sebagai `lebarKode`.

**Pemecahan berkas:** kecamatan dipecah per provinsi (38 berkas), desa dipecah
per kabupaten/kota (514 berkas). Alasannya: satu berkas nasional untuk desa
akan berukuran puluhan MB dan tidak mungkin dimuat peramban.

**Penyederhana poligon** (diukur dari kepala berkas, bukan dikira):

| Tingkat | Toleransi | Alasan |
|---|---|---|
| Provinsi | 0,02° | tampil di zoom rendah, harus halus |
| Kabupaten/kota | 0,01° | tampil di zoom sedang |
| Kecamatan | 0,01° | tampil di zoom sedang–dekat |
| Desa/kelurahan | 0,0005° | tampil di zoom dekat, detail penting |

### 4.2 Angka agama (`data/agama/`)

Susunan berkas **sama** dengan poligon, tetapi barisnya **larik langsung**
(bukan objek) dan **tanpa geometri** — geometri diambil dari `data/wilayah-warna/`:

```js
window.AGAMA_PROP = [
  [11, "ACEH", 5623479, 5544917, 65593, 6018, 83, 6591, 4, 248],
  // ↑no_prop ↑nama ↑penduduk ↑islam ↑kristen ↑katholik ↑hindu ↑budha ↑konghucu ↑kepercayaan
];
```

| Variabel | Berkas | Isi |
|---|---|---|
| `AGAMA_PROP` | `prop-nasional.js` | `[no_prop, nama, penduduk, islam, kristen, katholik, hindu, budha, konghucu, kepercayaan]` |
| `AGAMA_KAB` | `kab-nasional.js` | `[no_prop, no_kab, nama, penduduk, islam, …]` |
| `AGAMA_KEC` | `kec-<kode2>.js` | `[no_prop, no_kab, no_kec, nama, penduduk, islam, …]` |
| `AGAMA_DESA` | `desa-<kode4>.js` | `[no_prop, no_kab, no_kec, no_kel, nama, penduduk, islam, …]` |

**Tujuh agama yang disajikan:** Islam, Kristen, Katolik, Hindu, Budha,
Konghucu, Kepercayaan.

### 4.2a Satu kartu angka untuk wilayah yang diklik (orderan 33)

Pada peta Populasi maupun Agama, warna poligon hanya memberi gambaran umum.
Angka tidak ditulis pada seluruh poligon. Klik provinsi, kabupaten/kota,
kecamatan, atau desa/kelurahan membuka **satu kartu bersama** (`#kartu`);
klik wilayah lain mengganti isi kartu tersebut, bukan menumpuk popup baru.
Tombol ✕ menutupnya tanpa mematikan lapisan peta.

- **Populasi:** jumlah penduduk dan kepadatan ditonjolkan. Kepala keluarga,
  luas, kode wilayah lengkap, dan sumber tersedia pada rincian yang dibuka
  saat diperlukan.
- **Agama:** jumlah penduduk dan agama mayoritas ditonjolkan; ketujuh
  agama/kepercayaan ditulis sebagai jumlah jiwa dan persentase. Persentase
  dihitung dari jumlah penduduk, bukan dari jumlah tujuh kategori.
- **Kepadatan:** $kepadatan = penduduk / luas\_km^2$. Luas dihitung dari
  poligon resmi Dukcapil melalui `PD.luasKm2()`; kolom `luas_wilayah` mentah
  tidak digunakan karena sebagian tidak konsisten satuannya. Kepadatan dapat
  ditampilkan pada keempat tingkat bila luas poligon tersedia. Bila tidak
  tersedia, tulis **Belum tersedia**, bukan perkiraan.
- Warna provinsi/kabupaten pada peta Populasi tetap berdasarkan kepadatan;
  kecamatan/desa berdasarkan jumlah penduduk. Pilihan warna tersebut tidak
  membatasi angka yang dapat ditampilkan pada kartu.
- Angka tetap berasal dari data Dukcapil lokal dan dimuat bertahap; klik
  wilayah tidak memanggil API TokoMedia dan tidak mengubah snapshot media.

### 4.3 Laporan Data Pemetaan (`datapemetaan.html`, orderan 31)

Laporan interaktif adalah cermin data wilayah, penduduk, agama, bahasa, suku,
dan media—bukan salinan satu halaman besar yang memuat semuanya sekaligus.
Empat tab tersedia: **Wilayah**, **Bahasa & media**, **Suku & agama**, dan
**Sumber**. Navigasi wilayah: Indonesia → 38 provinsi → kabupaten/kota →
kecamatan → desa/kelurahan; rincian JSON dimuat saat diklik.

| Komponen | Peran |
|---|---|
| `datapemetaan.html`, `css/datapemetaan.css`, `js/datapemetaan.js` | laporan responsif, pencarian, paginasi desa, dialog rincian dengan fokus keyboard |
| `data/datapemetaan/indeks.json` | total nasional, ringkasan provinsi, sumber dan batas data |
| `data/datapemetaan/bahasa-suku.json` | indeks ringkas 430 bahasa dan 28 kelompok BPS SP2010 |
| `provinsi-<kode2>.json`, `kabupaten-<kode4>.json`, `kecamatan-<kode6>.json` | rincian bertahap; desa berada dalam berkas kecamatan |
| `alat/buat-datapemetaan.js` | menggabungkan geometri/atribut lokal, atribut Dukcapil terbaru, katalog bahasa dan suku |
| `alat/perbarui-datapemetaan.js` | pembaruan manual atribut Dukcapil melalui folder kerja sementara |
| `alat/audit-datapemetaan.js` | audit semua tautan, kode unik, jumlah, nilai agama, dan berkas rincian |

**Total yang disajikan:** 38 provinsi, 514 kabupaten/kota, 7.275 kecamatan unik,
83.379 desa/kelurahan unik, 430 nama bahasa dalam katalog Pemetaan, dan 28
kelompok suku BPS SP2010. Total penduduk/agama menggunakan atribut Dukcapil,
bukan proyeksi BPS. Nilai `null` tidak diubah menjadi nol; persentase tidak
dihitung bila total penduduk tidak tersedia/nol.

**Batas sumber harus tetap dijelaskan:** 39 kecamatan dan 78 desa pada respons
sumber tidak memiliki identitas; 6 kecamatan dan 32 desa duplikat identik
disajikan sekali. Sebanyak 35 kode kecamatan hanya muncul dari 246 desa,
ditandai induk tidak tercatat, tetap dalam kabupaten resmi, tanpa membuat
kabupaten rekaan. Nama kelompok tidak ditebak bila sumber tidak menyediakannya.

**Media:** hanya aksi `ambilSemua` dan `tarikRumahweb` yang dikirim laporan.
Kode aplikasi tetap diperlukan sesuai kontrak Worker; tidak ditanam pada kode.
Data tersimpan Neon dipisahkan dari katalog API terbaru. Film Isa, Film Ikatan
Ilahi, dan Video Kitab Suci dibandingkan berdasarkan normalisasi bahasa dan
provinsi. Aplikasi juga dibandingkan bila bahasa serta provinsinya tersedia;
jumlah rekaman aplikasi tidak disamakan dengan jumlah bahasa. Clip Indonesia
dan entri tanpa provinsi ditampilkan terpisah, bukan ditempatkan di Jakarta. Tombol laporan tidak menyimpan API
ke Neon; penyimpanan media hanya melalui Update pada aplikasi peta utama.

**Pembaruan manual Dukcapil** (jalankan dari akar proyek):

```powershell
node alat/perbarui-datapemetaan.js --dry-run
node alat/perbarui-datapemetaan.js
node alat/perbarui-datapemetaan.js --tingkat=kecamatan,desa --hanya=33
node alat/perbarui-datapemetaan.js --tingkat=desa --hanya=3301
```

Dry-run tidak mengubah sumber atau laporan aktif. Pembaruan normal membuat
backup Git, mengambil atribut dengan `objectid ASC`, menjaga `null`, membagi
desa provinsi per kabupaten, memvalidasi kode unik, membangun dan mengaudit
laporan sementara, baru menukar sumber/laporan aktif setelah semuanya lulus.
Poligon `data/wilayah-warna/` tidak diubah. `--tanpa-backup` hanya untuk uji
terisolasi; `--luring` memerlukan cache sumber eksplisit melalui
`PEMETAAN_CACHE_SUMBER` bila dipakai alat pembaruan. Cache tidak dipublikasikan.
Audit terpisah dapat dijalankan dengan `node alat/audit-datapemetaan.js`.

### 4.4 Dasbor Target vs Produk (`js/analisis-media.js`, orderan 32)

Tab **Target & produk** pada `datapemetaan.html` mengukur apakah produk media
sudah memenuhi target bahasa, bukan mengukur target satu produk per desa.
Kabupaten/kecamatan/desa tetap menjadi kerangka rincian wilayah.

- **430 entri katalog** adalah inventaris nama pada `data/peta-bahasa.js`.
- **341 target bahasa unik** adalah dasar persentase dan kekurangan produk.
  Awalan `Bahasa ` dihapus untuk pencocokan; variasi nama disatukan **hanya
  dalam provinsi yang sama**. Nama alternatif tetap tampil pada rincian dan
  matriks mode **Entri katalog**. Nama yang sama pada provinsi berbeda tidak
  digabung bila muncul pada pembaruan mendatang.
- **Cakupan isi:** minimal satu dari Film Isa Al-Masih, Film Ikatan Ilahi,
  atau Video Kitab Suci tersedia untuk target bahasa tersebut.
- **Lengkap:** ketiga jenis film/video tersedia. Beberapa rekaman pada satu
  bahasa tetap dihitung satu bahasa, bukan menambah jumlah bahasa terpenuhi.
- **Kekurangan produk:** jumlah pasangan target bahasa × tiga film/video yang
  belum tersedia; bukan jumlah judul atau jumlah desa.
- **Clip/Aplikasi:** dibandingkan bila atribut bahasa tersedia; kode provinsi
  dicocokkan bila ada. Rekaman nasional/gugus atau tanpa bahasa ditampilkan
  terpisah dan tidak dihitung sebagai kekurangan wajib untuk setiap bahasa.
- Film/video dengan provinsi yang tidak cocok tidak memenuhi target. Media
  dengan nama bahasa yang tidak ada dalam target juga ditampilkan terpisah.
- Clip/Aplikasi tanpa provinsi hanya cocok bila nama bahasa memiliki satu
  target. Nama sama pada beberapa provinsi dipisahkan sebagai ambigu.
- Jika API gagal, tampilkan **belum dibandingkan**, bukan “belum ada produk”.
  Kegagalan sebagian kategori ditampilkan sebagai peringatan; hasil dan
  prioritas disebut sementara dan “belum” berarti belum ditemukan pada data
  yang berhasil dibaca.

Komponen: kartu ringkasan; grafik donat cakupan isi + tiga produk inti;
grafik batang cakupan 38 provinsi; daftar prioritas; matriks bahasa × produk
dengan pencarian, filter provinsi/status, paginasi, dan mode target/entri.
Klik bahasa/provinsi membuka rincian produk, media yang sudah ada, dan produk
yang masih kurang. Grafik menggunakan SVG lokal tanpa pustaka tambahan dan
selalu disertai angka tekstual. Modul `hitung()` murni dapat diuji di Node;
modul tidak mengambil API sendiri dan hanya menerima hasil read-only dari
`js/datapemetaan.js`.

**Laporan manajemen (2026-10-24):** tombol laporan pada `index.html` memuat
`datapemetaan.html?di=manajemen` melalui `js/laporan-manajemen.js`. Report yang
sama tampil dalam panel peta dengan tab awal Target & produk; tidak ada model
perhitungan kedua. Dashboard lama disimpan pada
`backup/laporan-manajemen-20261024/` dan dapat dipulihkan dari situ. Halaman
`datapemetaan.html` mandiri tetap tersedia.

**Snapshot live (2026-10-24, audit akurasi media):**
`data/datapemetaan/snapshot-media.json` berisi **568 rekaman** katalog
bahasa/produk yang dibaca read-only melalui koneksi Pemetaan → Worker →
Rumahweb → API TokoMedia: 178 bahasa Film Isa, 11 Film Ikatan Ilahi, 109 Video
Kitab Suci, satu kategori Clip Indonesia (39 video), dan **269 aplikasi**.
Aplikasi dibaca lengkap melalui `aplikasi/list`, tiga halaman × maksimum 100,
bukan lima ringkasan `aplikasi/area`. Sebanyak 232 rekaman aplikasi memiliki
provinsi terverifikasi, mencakup 217 target bahasa di 28 provinsi; 37 belum
memiliki pemetaan provinsi. Total 44 rekaman tanpa provinsi termasuk Clip dan
entri nasional/gugus tetap ditampilkan terpisah tanpa titik yang dikarang. Report memuat snapshot bersama indeks/bahasa; tidak memanggil API secara
otomatis setiap halaman dibuka. Tombol pembaruan manual tetap membaca katalog
terbaru dan mengganti tampilan selama sesi tersebut. Snapshot pada GitHub
diperbarui melalui proses pembuatan/commit snapshot; perubahan manual di browser
tidak otomatis menimpa berkas tersebut. Enam catatan lokasi
nasional/gugus dan bahasa tanpa provinsi sudah termasuk dalam 568 rekaman;
itu bukan kegagalan membaca kategori. Kegagalan API dikembalikan terpisah
melalui `gagalBaca`, dan sinkronisasi tidak menghapus data kategori yang gagal
dibaca. Setiap aplikasi memakai ID sumber stabil; anggota pribadi dipertahankan.
Hasil: 212/341 target ada isi (62,2%), 129 belum, 6 lengkap, 206 sebagian,
731 pasangan produk inti kurang. Ini bukan inventaris seluruh judul video.

### 4.5 Sumber data

| Data | Sumber | Cara ambil |
|---|---|---|
| Poligon + jumlah penduduk + KK + luas | **Dukcapil Kemendagri** — `gis.dukcapil.kemendagri.go.id`, ArcGIS FeatureServer | `alat/ambil-dukcapil.js` |
| Angka agama 4 tingkat | **Dukcapil Kemendagri** — sumber sama | `alat/ambil-agama.js` |
| Titik lokasi suku bangsa | **BPS Sensus Penduduk 2010** — 28 kelompok, 237.641.326 jiwa | disalin manual ke `js/suku.js` |
| Nama jalan | **OpenStreetMap** lewat Nominatim | dipanggil saat pencarian |

⚠️ **Angka Dukcapil BEDA dengan BPS — bukan salah, memang beda dasar.**
Dukcapil menghitung penduduk terdaftar (administratif), BPS menghitung lewat
sensus. Jangan menyamakan keduanya, dan jangan mencampur dalam satu tampilan
tanpa keterangan.

---

## 5. Jembatan antar modul

Setiap modul menulis satu variabel global di `window`. Modul lain memanggilnya
lewat variabel itu — **tidak ada `import`/`export`**, karena semuanya dimuat
sebagai skrip biasa supaya bisa jalan dari GitHub Pages tanpa build.

| Variabel | Berkas | Isi |
|---|---|---|
| `PD` | `inti.js` | `peta`, `kodeProvinsiSekarang()`, `bagianSekarang(tingkat)` |
| `PD_WARNA` | `warna.js` | `ganti(id)`, `matikan()`, `aktif()`, `PETA`, `siapkanLapisan()` |
| `PD_AGAMA` | `agama.js` | `ganti(tingkat, agama)`, `matikan()`, `aktif()`, `untukWilayah()`, `ringkas()`, `AGAMA`, `TINGKAT` |
| `PD_SUKU` | `suku.js` | `ganti(i)`, `matikan()`, `aktif()`, `tutupPanel()`, `SUKU` |
| `PD_ANGGOTA` | `member.js` | `muat()`, `gambarPenanda()`, `bukaPanel()`, `bukaForm()`, `tutupPanel()`, `tutupForm()`, `terapkanTampil()`, `ambilAnggota()`, `sorotWilayah()`, `tunjukTitik()` |
| `PD_IKON` | `ikon.js` | `DAFTAR`, `KATEGORI`, `untukKategori()`, `gambar()`, `pasang()`, `lengkap()` |
| `PD_MEDIA` | `media.js` | `MEDIA`, `siap()`, `hidup(nama)`, `utama()`, `saring()`, `semua(nyalaUtama?)`, `terapkan()`, `bukaTutup(buka)`, `segarkan()` |
| `PD_LABEL` | `label.js` | `siap()`, `segarkan()`, `gambar()`, `data()`, `inventaris()` |
| `PD_TOKOMEDIA` | `tokomedia.js` | `tarik()`, `siap()` |
| `PD_CARI` | `cari.js` | `buka()`, `tutup()`, `setAnggotaSiap()` |
| `PD_PANDUAN` | `panduan.js` | `buka()`, `tutup()`, `aktif()`, `keadaan()`, `PANDUAN` |

**Urutan pemuatan skrip di `index.html` penting** — `inti.js` harus lebih dulu
karena modul lain menunggu `PD.peta` siap:

```html
maplibre-gl.js → prop-nasional.js → kab-nasional.js → inti.js → warna.js
→ agama.js → suku.js → simpanan.js → ikon.js → member.js → media.js
→ label.js → tokomedia.js → cari.js → panduan.js
```

`label.js` **wajib** dimuat setelah `media.js` — ia membaca `PD_MEDIA.hidup()`
untuk tahu kelompok mana yang sedang menyala.

Modul yang butuh peta memakai pola tunggu:

```js
var coba = 0;
(function ulang() {
  if (typeof PD !== 'undefined' && PD.peta) { mulai(); return; }
  if (coba++ < 60) { setTimeout(ulang, 100); }
})();
```

---

## 6. Tampilan — dua wajah, satu aplikasi

### Ambang responsif

| Lebar | Sebutan | Perilaku |
|---|---|---|
| **≥ 900 px** | PC | bingkai selebar layar; panel jadi **kolom kiri 380 px**; panduan jadi **kolom kanan 380 px**; peta memenuhi tinggi layar |
| **< 900 px** | HP | bingkai `min(100%, 430px)`; panel & panduan **menutupi layar**; form anggota **peta 45% atas + form 55% bawah** |
| ≤ 400 px | HP sempit | tombol Anggota jadi `☰`, Agama jadi 🙏, Suku jadi 🧬 |
| ≤ 340 px | HP sangat sempit | tulisan "Populasi" disembunyikan |

### Keputusan tampilan yang sudah dikunci

| Keputusan | Alasan |
|---|---|
| **PC lebar penuh, peta memenuhi tinggi layar** | Indonesia memanjang ke samping. Kalau seluruh Indonesia dipaksa masuk layar, petanya jadi terlalu kecil untuk melihat detail — pengguna toh akan memperbesarnya sendiri. Lebih baik penuh dan digeser kiri-kanan. |
| **HP: lebar peta dibatasi 430 px** | supaya peta tidak mengecil di layar lebar. Sisa lebar layar bisa digeser kiri-kanan. |
| **Panel jadi kolom kiri di PC** | peta tetap terlihat penuh saat panel terbuka — tidak tertutup kotak melayang |
| **Panduan jadi kolom kanan di PC** | form/daftar di kiri tetap terlihat dan bisa langsung dicoba sambil membaca |
| **Form anggota: peta 45% atas, form 55% bawah (HP)** | peta tetap terlihat saat mengisi; peta benar-benar menyusut (tingginya dipangkas) sehingga MapLibre menghitung ulang ukurannya |
| **Tombol Satelit/Map bergantian** | hanya ada 2 pilihan, jadi satu tombol lebih enak daripada daftar melayang |
| **Bilah atas ikon saja** | 8 tombol bertulisan penuh butuh 536 px, bingkai HP hanya 430 px. Arti tiap ikon dijelaskan di panduan (bagian "Arti ikon di bilah atas") |
| **Jangkar + label media di peta** | satu provinsi = satu jangkar + satu label. Jangkar menunjukkan **tempat**, label menunjukkan **isi**. Dipisah supaya MapLibre bisa menyembunyikan label yang bertumpuk tanpa ikut menghilangkan jangkarnya |
| **Klik satu wilayah → satu kartu angka** | pengguna membaca angka wilayah yang dipilih tanpa memenuhi peta dengan label. Populasi menampilkan penduduk/kepadatan; Agama menampilkan penduduk, mayoritas, dan tujuh kategori. Rincian tambahan bersifat lipat dan kartu dibatasi tinggi di HP |

### Bilah atas — 8 tombol, ikon saja (orderan 24)

```
[☰]  [📺]  [🛰️]  [👁]  [🙏]  [🧬]  [⌕]  [?]
```

| Ikon | Arti |
|---|---|
| `☰` | daftar anggota |
| `📺` | menu **Media on/off** — pilih kelompok data yang tampil di peta |
| `🛰️` | ganti jenis peta (Satelit ⇄ Map) |
| `👁` | peta tematik jumlah penduduk |
| `🙏` | peta tematik penduduk menurut agama |
| `🧬` | titik lokasi suku bangsa |
| `⌕` | cari wilayah / anggota / nama jalan |
| `?` | panduan pemakaian |

⚠️ **Jebakan yang sudah pernah terjadi:** bingkai HP **selalu** 430 px
(`--lebar-hp`), sedangkan tombol bertulisan penuh butuh **536 px**. Tombol paling
kanan jadi terpotong dan tidak bisa diklik. Orderan 24 menambah tombol kedelapan,
sehingga tulisan penuh tidak mungkin lagi muat — **seluruh tombol menjadi ikon
saja**. Diukur 22 Okt 2026: 8 tombol × 30 px + 7 jarak × 5 px = **275 px**, muat
di 320 px sekalipun. Jaring pengaman `@media (max-width: 299px)` mengecilkan
tombol ke 28 px (butuh 253 px).

⚠️ **Jebakan CSS:** aturan `#tombol-anggota { font-size: 0 }` (untuk menyembunyikan
tulisan) **kalah** dari aturan `#tombol-anggota { font-size: 12px }` yang ada di
bagian bawah berkas. Karena itu penulisannya harus `#bilah-atas #tombol-anggota`.

### Jangkar & label media (orderan 26)

```
        ● Film Isa · Clip        ← jangkar + label, di titik berat daratan utama
```

| Bagian | Nilai |
|---|---|
| Lapisan jangkar | `media-jangkar` — `circle`, `minzoom` 3,5, radius 5,5 px, isi `#f2f7fc`, cincin warna kelompok |
| Lapisan label | `media-label` — `symbol`, `minzoom` 4, `Open Sans Bold`, ukuran `interpolate` z4 → 10 px, z7 → 12,5 px, halo `#0b0f14` 1,8 px, `text-padding` 8 |
| Sumber | `media-provinsi` — GeoJSON, satu titik per provinsi berdata media |
| Keterangan | `#keterangan-media` + pil `.km-pil`, kiri bawah, `bottom: calc(var(--tinggi-bilah) + 18px)` |

Nama di label dipendekkan supaya muat: `Film Isa Al-Masih` → **Film Isa**,
`Film Ikatan Ilahi` → **Film Ilahi**, `Video Kitab Suci` → **Video**,
`Clip Kitab Suci` → **Clip**, `Aplikasi Kitab Suci` → **Ap Kitab**. Peta
singkatnya ada di `PENDEK` (`js/label.js`) — satu tempat saja.

**Akurasi media (orderan 34):** label hanya memakai anggota yang sudah selesai
dimuat. Setiap aplikasi adalah rekaman produk tersendiri, bukan bahasa baru.
Bahasa yang memiliki beberapa aplikasi tetap satu target bahasa; provinsi
hanya berasal dari katalog bahasa yang sudah disusun, bukan dari gugus atau
provinsi wakil. Rekaman tanpa provinsi tetap tersedia pada laporan tetapi tidak
menghasilkan titik/label lokasi. Update media memvalidasi ID dan jumlah,
mempertahankan anggota pribadi serta kategori yang gagal dibaca, dan baru
menghapus rekaman TokoMedia kedaluwarsa setelah penyimpanan berhasil.

⚠️ **Jebakan:** titik tengah **kotak pembatas** provinsi jatuh di laut untuk
provinsi kepulauan. Jangkar harus dihitung dari **titik berat cincin terluas**
poligonnya.

⚠️ **Jebakan:** `#keterangan-media` bertumpuk dengan `#atribusi` di layar sempit
kalau keduanya diletakkan di `bottom: calc(var(--tinggi-bilah) + 6px)`. Atribusi
tingginya ±11 px + 4 px jarak, jadi keterangan perlu diangkat ke **+18 px**.

---

## 7. Fitur — daftar lengkap

| # | Fitur | Berkas | Inti |
|---|---|---|---|
| 14 | Peta Indonesia + negara tetangga | `inti.js` | batas geser 92°–148° BT; tetangga tetap tampil supaya pulau berbatasan tidak terpotong |
| 15 | Jenis peta: Satelit ⇄ Map | `inti.js` | satu tombol bergantian; ganti jenis tidak menggeser kamera |
| 16 | Peta tematik jumlah penduduk 4 tingkat | `warna.js` | 9 kelas warna; wilayah tanpa data diwarnai abu-abu |
| 17 | Data anggota (tambah/ubah/hapus) | `member.js` | dikelompokkan per provinsi/kab/kec/desa; penanda = titik lokasi → garis putus-putus → bulatan berisi icon kategori |
| 18 | Peta interaktif mengikuti isian form | `member.js` | pilih wilayah → peta terbang + garis merah berkedip keliling area; pin 📌 bisa digeser dengan mengetuk peta |
| 19 | Cari wilayah / anggota / nama jalan | `cari.js` | wilayah dari data lokal; nama jalan dari Nominatim (jeda 400 ms, minimal 3 huruf, `countrycodes=id`) |
| 20 | Titik lokasi suku bangsa | `suku.js` | 28 suku BPS SP2010; panel seperti panel Anggota; garis merah berkedip + satu titik di tengah kawasan |
| 21 | Peta agama 4 tingkat | `agama.js` | disajikan dalam **persentase** supaya tidak mengulang peta penduduk; Konghucu & Kepercayaan tetap dalam angka jumlah |
| 22 | Tampilan PC lebar (responsive) | `gaya.css` | PC lebar penuh, HP seperti semula |
| 23 | Data anggota dari tokomedia.org + tombol [Update] | `tokomedia.js`, `worker.js` | 699 anggota · 5 kategori · koordinat otomatis · icon kategori |
| 24 | Menu "Media on/off" | `media.js` | pilih kelompok data yang tampil di peta; pilihan disimpan di database; satu tombol utama On/Off menyembunyikan atau memulihkan hanya pilihan tersebut; bilah atas menjadi ikon saja |
| 25 | Seluruh kategori bisa dihidupkan / dimatikan | `media.js` | daftar digabung dari kategori yang dipakai anggota + daftar kategori resmi |
| 33 | Kartu angka Populasi & Agama | `warna.js`, `agama.js`, `gaya.css` | satu wilayah diklik → satu kartu; penduduk/kepadatan dari poligon; tujuh agama; rincian lipat dan responsif |
| 34 | Akurasi katalog & pemetaan media | `worker.js`, `tokomedia.js`, `datapemetaan.js`, `analisis-media.js` | 269 aplikasi lengkap; 232 terpetakan / 217 bahasa / 28 provinsi; data tanpa lokasi tidak ditebak; 568 media + 3 anggota pribadi |
| 26 | Jangkar & label media per provinsi | `label.js` | satu jangkar + satu label per provinsi berdata media; label menyebut nama pendek kelompok yang sedang hidup; ketuk → garis merah provinsi |
| 27 | Pemetaan memakai 2 server (Neon + Rumahweb) | `worker.js`, `simpanan.js`, `tokomedia.js` | Neon = data anggota (baca/tulis); Rumahweb = data media TokoMedia (**baca saja**) lewat `pemetaan-bridge.php`; saat orderan 27: 300 anggota · 35 provinsi berlabel |
| 31 | Laporan Data Pemetaan | `datapemetaan.html`, `js/datapemetaan.js`, `alat/*datapemetaan.js` | rincian Indonesia → desa saat diklik; 430 bahasa, 28 kelompok suku, tujuh agama, perbandingan lima media read-only; pembaruan Dukcapil manual tervalidasi |
| 32 | Dasbor Target vs Produk | `js/analisis-media.js`, `datapemetaan.html` | 341 target unik dari 430 entri; cakupan isi/kelengkapan, grafik donat/batang, prioritas, matriks, dan rincian kekurangan |
| — | Panduan pemakaian interaktif | `panduan.js` | tombol `?` mengenali posisi pemakai; kata kunci jadi tautan yang benar-benar menjalankan aksinya |

### Detail yang mudah terlewat

**Media on/off — pilihan dan tampilan terpisah (orderan 30).** `media_nyala`
menyimpan pilihan per kategori; `media_utama` menyimpan `1` untuk On atau `0`
untuk Off. Off menghasilkan saringan kosong tanpa menimpa pilihan kategori.
Pengguna tetap bisa mengubah pilihan saat Off; On memulihkan hanya kategori
yang dipilih, bukan seluruh kategori. Label media mengikuti keadaan utama dan
pilihan tersebut melalui `PD_MEDIA.hidup()`.

**Peta tematik (16 & 21) — perilaku tombol.** Tombol Populasi memakai
**klik-pilih / klik-mati**: bila peta Populasi sedang menyala, klik tombol =
**mematikan**, bukan membuka daftar. Ini disengaja supaya satu klik bisa
mematikan tanpa membuka daftar.

**Tiga peta tematik tidak boleh menyala bersamaan.** Populasi, Agama, dan Suku
memakai lapisan peta yang sama (`wilayah`) dan kartu rincian yang sama
(`#kartu`). Karena itu setiap `ganti()` mematikan dua yang lain lebih dulu.

**Tingkat kecamatan & desa butuh peta cukup dekat.** Berkasnya dipecah per
provinsi/kabupaten, jadi baru dimuat saat kotaknya bersentuhan dengan layar.
Wilayah yang berkasnya belum dimuat diberi keterangan "Perbesar dulu".

**Panduan interaktif — tanda `[[kata|aksi]]`.** Di dalam kalimat panduan, kata
kunci ditulis `[[kata|aksi]]` dan menjadi tautan yang bisa diketuk. Tiga jenis
aksi: **gerak peta** (`seret`, `cubit`), **tekan tombol** (`tekan:#id`,
`tingkat:`, `populasi:`, `agama:`), dan **sorot saja** (`sorot:#id`,
`wilayah:`). Tombol yang mengubah data (`Simpan`, `Hapus`, `Batal`, `+ Tambah`,
`Edit`, `Del`) **sengaja hanya dikedipkan** — supaya data tidak tersimpan atau
terhapus tanpa sengaja.

---

## 8. Penyimpanan data anggota

### Kenapa harus lewat Worker

Situs Pemetaan hanya berkas statis. Kalau alamat + sandi database ditanam di
JavaScript, siapa pun bisa membacanya lewat "View Source" lalu menghapus
seluruh data. Sandi disimpan di Worker Cloudflare sebagai **secret**, jadi tidak
pernah ikut terkirim ke peramban.

### Tiga cara simpan (bertingkat, otomatis)

| Urutan | Cara | Kapan dipakai |
|---|---|---|
| 1 | **Daring** — tulis ke Neon lewat Worker | internet hidup & Worker menjawab |
| 2 | **Luring** — tulis ke IndexedDB peramban + masuk antrean | internet mati / Worker tidak menjawab |
| 3 | **Sinkron** — antrean dikirim otomatis | begitu daring lagi |

### Pengamanan

1. Sandi database hanya ada di secret Worker (`DATABASE_URL`).
2. Peran database `pemetaan_api` — **hanya** boleh SELECT/INSERT/UPDATE/DELETE.
   Tidak bisa menghapus tabel atau mengubah struktur.
3. Permintaan hanya diterima dari asal (Origin) yang terdaftar di `DAFTAR_ASAL`.
4. **Setiap** permintaan — termasuk membaca — wajib menyertakan kunci aplikasi.
   Kunci tidak tersimpan di kode situs, jadi hanya orang yang tahu kuncinya
   bisa membuka data.

### Kunci aplikasi

Kunci dimasukkan **sekali per perangkat** (PC dan HP), lalu diingat peramban
lewat `localStorage`. Setelah itu data anggota sama di kedua perangkat.

⚠️ **Jangan pernah menulis kunci API / password / connection string di dalam
kode atau dokumen — repo ini publik.**

### Aksi Worker

| Aksi | Isi |
|---|---|
| `ambilSemua` | `{ anggota, kategori, pengaturan }` |
| `simpanAnggota` | `{ anggota }` |
| `simpanAnggotaBanyak` | `{ anggota[] }` → `{ jumlah }` (100 baris per perintah) |
| `hapusAnggota` | `{ id }` |
| `simpanKategori` / `hapusKategori` | `{ nama }` |
| `simpanAtur` | `{ nama, nilai }` |
| `kosongkan` | hapus semua anggota |
| `tarikTokomedia` | `{ kategori? }` → `{ anggota[], jumlah, gagal[] }` — cara lama, membaca halaman tokomedia.org (cadangan) |
| `tarikRumahweb` | `{ kategori? }` → `{ anggota[], jumlah, gagal[] }` — cara sekarang, lewat API TokoMedia di Rumahweb |
| `cek` | uji sambungan |

### Penarikan data media (orderan 23 → 27)

**Cara lama (orderan 23):** Worker membaca 5 halaman tokomedia.org lalu menebak
isinya dari HTML. Rapuh — begitu susunan halaman berubah, pembacanya rusak.

**Cara sekarang (orderan 27):** Worker memanggil **API TokoMedia** di Rumahweb
lewat jembatan `pemetaan-bridge.php`. Hasilnya JSON terstruktur: nama bahasa +
gugus pulau datang langsung dari database.

**Alur:** tombol `[↻ Update]` → Worker → `pemetaan-bridge.php` → API TokoMedia →
hitung koordinat → simpan ke Neon.

**Kenapa harus lewat jembatan:** token API TokoMedia harus disimpan di sisi
server. Kalau ditaruh di JavaScript, siapa pun bisa membacanya lewat
"View Source".

**Sifatnya baca saja.** Daftar izin jembatan memuat 25 endpoint, **tidak ada
satu pun endpoint tulis**. Data TokoMedia tidak mungkin berubah lewat jalur ini.

**Koordinat:** API TokoMedia **tidak menyimpan lokasi**. Titik bahasa dihitung
dari nama bahasa → provinsi (`cloudflare/peta-bahasa.js`, 430 bahasa). Setiap
provinsi memiliki kandidat titik yang diverifikasi berada **di dalam poligon
daratan**; penanda tiap bahasa memilih salah satu kandidat, tanpa menggeser
titik ke laut. Bahasa yang belum terpetakan tidak ditampilkan sebagai titik dan
muncul dalam daftar gagal, bukan diberi lokasi perkiraan gugus. Catatan kategori
wilayah seperti `Indonesia`, `Kalimantan` atau `Maluku - Papua` yang bukan bahasa
provinsi disimpan tanpa koordinat sehingga tidak menghasilkan penanda laut.

**Kelompok yang tidak menyediakan provinsi per bahasa** tidak dipaksakan
mendapat titik. Clip berbahasa Indonesia tidak diberi provinsi/titik yang
dikarang. Aplikasi dibaca per produk; hanya nama bahasa yang ada di katalog
Pemetaan yang mendapat provinsi/titik. Ringkasan gugus tidak dijadikan bahasa.

**Tidak ada penarikan otomatis** — hanya saat tombol ditekan.

### Dua server (orderan 27)

| Server | Dipakai untuk | Sifat | Jalur |
|---|---|---|---|
| **Neon** | data anggota, kategori, pengaturan | baca **dan** tulis | Worker `pemetaan-api` |
| **Rumahweb** | data media TokoMedia | **baca saja** | `pemetaan-bridge.php` |

Keduanya tidak pernah menulis ke tempat yang sama, jadi pemisahannya rapi.

**`tm-bridge.php` milik aplikasi TokoMedia TIDAK BOLEH disentuh** — berkas itu
sudah terhubung ke aplikasi klien. Jembatan Pemetaan adalah berkas **terpisah**
dengan kunci terpisah.

**Kunci jembatan** disimpan sebagai secret Worker (`RUMAHWEB_KUNCI`), dikirim di
header `X-Pemetaan-Kunci`, dan dibandingkan dengan `hash_equals` di sisi PHP.
Tanpa kunci yang benar → **401**.

---

### Validasi titik media (perbaikan 2026-10-23)

Titik anggota media dan label jangkar wajib berada di daratan provinsi yang
sesuai. Worker memakai kandidat koordinat dari `cloudflare/peta-bahasa.js`
yang dibangkitkan dengan menguji poligon di `data/wilayah-warna/prop-nasional.js`.
Jangan menggeser titik memakai offset yang tidak diperiksa terhadap poligon.
Jika nama bahasa tidak punya pemetaan provinsi, jangan memakai titik gugus/laut;
lewati titik dan laporkan kegagalan secara eksplisit.

## 9. Jebakan teknis yang sudah pernah terjadi

Bagian ini **paling berharga** untuk pembangun ulang — semuanya sudah memakan
waktu di proyek ini.

| Jebakan | Sebab | Cara mengatasi |
|---|---|---|
| `peta.resize()` di tengah animasi `fitBounds` **membatalkan animasinya** | MapLibre membatalkan animasi saat ukuran berubah | panggil `resize()` **sebelum** `fitBounds`, atau tunda dengan `setTimeout(…, 0)` |
| `requestAnimationFrame` **tidak menyala di tab tersembunyi** | peramban menghentikan rAF di tab latar | pakai `setTimeout(…, 0)` untuk pekerjaan yang harus jalan |
| Chrome **mengabaikan `autocomplete="off"`** pada `input[type="password"]` | kebijakan Chrome | pakai `type="text"` + `-webkit-text-security: disc` |
| `peta.on('load')` menyala **setelah** kode lain berjalan | urutan pemuatan MapLibre | jangan `jumpTo` tanpa memeriksa apakah kamera sudah diarahkan |
| CSS `@media` **kalah** dari aturan dasar | urutan di berkas | seluruh `@media` **wajib di akhir** `gaya.css` |
| Singgahan Chrome menyimpan berkas lama | GitHub Pages + singgahan | penanda versi `?v=YYYYMMDD-nn` di **setiap** `<link>` dan `<script>`; naikkan setiap kali berkas berubah |
| GitHub Pages perlu **±75–85 detik** sebelum perubahan terlihat | proses build Pages | tunggu sebelum menyatakan live |
| Nominatim membatasi **1 permintaan/detik** | kesopanan layanan publik | jeda 400 ms, minimal 3 huruf, `countrycodes=id` |
| `#anggota-kategori-panel` ada **di dalam** `#panel-anggota` | susunan HTML | periksa yang paling dalam lebih dulu saat mengenali keadaan |
| Tombol Populasi **klik-pilih/klik-mati** | disengaja | matikan dulu sebelum mengharapkan daftar terbuka |
| Playwright: `page.click()` **gagal bila elemen `hidden`** | perilaku Playwright | periksa `isVisible()` dulu |
| Playwright: `setViewportSize` di Windows menghasilkan lebar efektif lebih kecil | scrollbar | bandingkan dengan **tepi kanan bingkai**, bukan lebarnya |
| Playwright: `page.on('pageerror')` harus dipasang **sebelum** `goto()` | urutan | pasang pendengar lebih dulu |
| Playwright headless: font tampak bertumpuk | artefak rendering | bukan bug — ukuran sebenarnya normal |
| `const Simpanan = ...` **tidak** menjadi `window.Simpanan` | `const` di lingkup atas tidak menempel ke `window` | periksa dengan `typeof Simpanan`, bukan `window.Simpanan` |
| Gambar `addImage` **hilang** setiap kali gaya peta diganti | MapLibre membuang gambar bersama gaya lama | pasang ulang di `gambarPenanda()` dengan pemeriksaan `hasImage()` |
| Anggota yang hanya punya provinsi **tidak muncul** di tingkat kabupaten/kecamatan/desa | `kodeUntukTingkat()` mengembalikan string kosong | pakai kode tingkat di atasnya bila kode tingkat itu kosong |
| 699 anggota dari provinsi sama **bertumpuk** di satu titik | titik tengah provinsi sama untuk semua | geser dalam lingkaran kecil; jari-jari berbeda per kategori |
| `icon-offset` **dikalikan `icon-size`** — bukan piksel, bukan em | perilaku MapLibre GL JS | offset = jarak_px / icon-size; dengan `icon-size: 0.24`, `-34` hanya menggeser 8 px, jadi perlu `-141.67` |
| `icon-translate` **tidak ada** di MapLibre GL JS | hanya `circle-translate` yang punya padanan translate | pakai `icon-offset` untuk `symbol`, `circle-translate` untuk `circle` |
| `addSource`/`addLayer` melempar **"Style is not done loading"** | dipanggil sebelum gaya selesai dimuat (mis. sesudah ganti jenis peta) | periksa `peta.isStyleLoaded()` lalu tunda dengan `setTimeout` |
| Penggabungan (cluster) **dihapus** 18 Okt 2026 | pemilik proyek menilai angka tumpukan sulit dipahami | jangan pasang `cluster: true` lagi; tampilkan semua penanda satu per satu |
| Titik tengah **kotak pembatas** provinsi jatuh di laut | provinsi kepulauan (Maluku, Papua, Kep. Riau) | hitung titik berat **cincin terluas** poligonnya, bukan titik tengah bbox |
| `#keterangan-media` **bertumpuk** dengan `#atribusi` di layar sempit | keduanya di kiri/kanan bawah | angkat keterangan ke `bottom: calc(var(--tinggi-bilah) + 18px)` — atribusi tingginya ±11 px + 4 px jarak |
| `idBaru()` bisa **mengembalikan id yang sama** bila dipanggil beruntun dalam satu milidetik | berbasis waktu | untuk data uji, pakai id berurutan sendiri; jangan mengandalkan `idBaru()` dalam gelung rapat |
| Token API **tidak boleh** ditanam di JavaScript | repo publik, "View Source" | simpan di sisi server (PHP) atau secret Worker; peramban hanya memanggil perantara |
| `category/languages` **tidak ada** untuk sebagian kategori TokoMedia | kategori 127 (Clip) dan 129 (Aplikasi) isinya daftar video/aplikasi, bukan bahasa | Clip → `ckitab/index`; Aplikasi → `aplikasi/list` dengan pagination lengkap, jangan `aplikasi/area` sebagai bahasa |
| `region` dari API memakai **tanda hubung** (`Jawa - Bali - Nusa Tenggara`) sedangkan `GUGUS` memakai koma | dua sumber berbeda | `GUGUS_ALIAS` memetakan kedua bentuk ke satu nama |
| Label media **berdesakan** saat peta dilihat dari jauh | 35 provinsi berlabel pada z4 | `text-size` dibuat `interpolate` (z4 → 10 px, z7 → 12,5 px) dan `text-padding` dinaikkan ke 8 |

---

## 10. Alur kerja yang wajib diikuti

Ditetapkan di [`agents.md`](./agents.md). Ringkasnya:

1. **Baca `agents.md` utuh** setiap sesi dimulai.
2. **Periksa `git status`** — jangan asumsikan repo bersih.
3. **Sebut perkiraan waktu** sebelum mulai (aturan 4).
4. **Beri tanda kehidupan** sambil bekerja (aturan 9) — satu baris per kejadian.
5. **Backup dulu** (git commit) sebelum dan sesudah setiap revisi.
6. **Uji sendiri** bagian yang berubah, sertakan bukti (aturan 3).
7. **Lapor hasil**, tunggu keputusan pemilik proyek (aturan 6 & 7).
8. **Update dokumen sekali di akhir**, bukan di tengah pekerjaan.
9. **Jangan mulai apa pun tanpa aba-aba pemilik proyek.**

### Konvensi status di `rencanakerja.md`

| Status | Arti |
|---|---|
| `BARU` | baru dicatat, belum dikerjakan |
| `DIKERJAKAN` | sedang dikerjakan |
| `MENUNGGU KONFIRMASI` | pekerjaan + verifikasi selesai, menunggu keputusan pemilik proyek |
| `SELESAI` | dinyatakan selesai oleh pemilik proyek (wajib berisi tanggal) |
| `DITUNDA` | dihentikan atas permintaan pemilik proyek |

---

## 11. Cara membangun ulang dari nol

Kalau proyek ini harus dibangun ulang di tempat lain:

1. **Siapkan repo** `Pemetaan` (publik, supaya GitHub Pages gratis), cabang `main`.
2. **Unduh MapLibre GL JS 5.9.0** + CSS-nya, simpan di `js/lib/`.
3. **Ambil data** dengan `alat/ambil-dukcapil.js` dan `alat/ambil-agama.js` —
   keduanya mengambil dari ArcGIS FeatureServer Dukcapil tanpa kunci.
   Hasilnya 554 berkas poligon + 554 berkas agama.
4. **Tulis `index.html`** dengan urutan skrip seperti di bagian 5.
5. **Tulis `js/inti.js`** — peta, batas geser, jenis peta, bilah bawah.
6. **Tulis modul fitur** satu per satu: `warna.js` → `agama.js` → `suku.js` →
   `simpanan.js` → `member.js` → `media.js` → `label.js` → `cari.js` → `panduan.js`.
7. **Siapkan Worker Cloudflare** (`cloudflare/worker.js`) + database Neon.
   Isi secret `DATABASE_URL` dan `KUNCI` lewat `wrangler secret put`.
8. **Aktifkan GitHub Pages** dari cabang `main`.
9. **Uji** dengan Playwright pada beberapa lebar layar (320–1440 px), pastikan
   0 galat konsol.

### Yang tidak boleh dilakukan saat membangun ulang

- ❌ Menyalin seluruh konsep dari folder/proyek lain (aturan 8).
- ❌ Menanam kunci API / password / connection string di kode atau dokumen.
- ❌ Mengarang angka statistik. Sumber tidak memberi → katakan tidak ada.
- ❌ Memakai Google Maps.
- ❌ Menaruh berkas `.md` di luar `Docs/`.

---

## 12. Ukuran proyek (diukur 2026-10-22)

| Bagian | Jumlah | Ukuran |
|---|---|---|
| Berkas data | 1.110 | 81,4 MB |
| Modul JavaScript | 12 | 270 KB |
| Pustaka peta (lokal) | 2 | 1,0 MB |
| Tampilan (`gaya.css`) | 1 | 2.673 baris |
| Halaman (`index.html`) | 1 | 13 KB |
| Worker Cloudflare | 2 | 41 KB |
| Skrip alat | 5 | 32 KB |
| Dokumen | 4 | — |
| Commit | 72 | — |

---

## 13. Rujukan

| Berkas | Isi |
|---|---|
| [`agents.md`](./agents.md) | aturan kerja (untuk AI) |
| [`rencanakerja.md`](./rencanakerja.md) | daftar orderan + bukti uji tiap orderan |
| [`CHANGELOG.md`](./CHANGELOG.md) | riwayat seluruh perkembangan |
| Situs live | https://suwandhih.github.io/Pemetaan/ |
| Repo | https://github.com/suwandhih/Pemetaan |
