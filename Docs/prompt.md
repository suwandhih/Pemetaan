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
├── index.html                  kerangka halaman (~230 baris)
├── css\
│   └── gaya.css                seluruh tampilan (~2.400 baris)
├── js\
│   ├── lib\
│   │   ├── maplibre-gl.js      MapLibre GL JS 5.9.0 (954 KB, lokal)
│   │   └── maplibre-gl.css     gaya bawaan MapLibre (69 KB)
│   ├── inti.js                 peta, jenis peta, batas geser, bilah bawah
│   ├── warna.js                peta tematik jumlah penduduk (orderan 16)
│   ├── agama.js                peta tematik penduduk menurut agama (orderan 21)
│   ├── suku.js                 titik lokasi suku bangsa (orderan 20)
│   ├── simpanan.js             penyimpanan: Neon → IndexedDB → antrean
│   ├── member.js               daftar anggota, form, kategori, penanda (1.860 baris)
│   ├── cari.js                 pencarian wilayah / anggota / nama jalan (orderan 19)
│   └── panduan.js              panduan pemakaian interaktif (tombol ?)
├── data\
│   ├── wilayah-warna\          554 berkas poligon + angka penduduk
│   │   ├── prop-nasional.js        38 provinsi
│   │   ├── kab-nasional.js         514 kabupaten/kota
│   │   ├── kec-<kode2>.js          38 berkas, dipecah per provinsi
│   │   └── desa-<kode4>.js         514 berkas, dipecah per kabupaten/kota│   └── agama\                  554 berkas angka agama (susunan sama)
├── alat\                       skrip pengambil data (dijalankan manual)
│   ├── ambil-dukcapil.js       poligon + penduduk dari Dukcapil
│   ├── ambil-agama.js          angka agama dari Dukcapil
│   ├── buat-indeks-cari.js     indeks pencarian wilayah
│   └── neon-siapkan.js         menyiapkan tabel di Neon
├── cloudflare\
│   ├── worker.js               perantara situs ↔ Neon (9,7 KB)
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

### 4.3 Sumber data

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
| `PD_ANGGOTA` | `member.js` | `muat()`, `gambarPenanda()`, `bukaPanel()`, `bukaForm()`, `tutupPanel()`, `tutupForm()`, `ambilAnggota()`, `sorotWilayah()`, `tunjukTitik()` |
| `PD_CARI` | `cari.js` | `buka()`, `tutup()`, `setAnggotaSiap()` |
| `PD_PANDUAN` | `panduan.js` | `buka()`, `tutup()`, `aktif()`, `keadaan()`, `PANDUAN` |

**Urutan pemuatan skrip di `index.html` penting** — `inti.js` harus lebih dulu
karena modul lain menunggu `PD.peta` siap:

```html
maplibre-gl.js → prop-nasional.js → kab-nasional.js → inti.js → warna.js
→ agama.js → suku.js → simpanan.js → member.js → cari.js → panduan.js
```

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
| **Susunan bilah atas** | `[Anggota][👁]` di paling kiri, lalu `[Satelit]`, `[Populasi 👁]`, `[Agama]`, `[Suku]`, `[⌕]`, `[?]` |

### Bilah atas — 8 tombol

```
[Anggota][👁]  [🛰️Satelit]  [Populasi 👁]  [Agama 🙏]  [Suku 🧬]  [⌕]  [?]
```

⚠️ **Jebakan yang sudah pernah terjadi:** bingkai HP **selalu** 430 px
(`--lebar-hp`), sedangkan 7 tombol bertulisan penuh butuh **536 px**. Tombol
paling kanan jadi terpotong dan tidak bisa diklik. Karena itu aturan perapatan
bilah (gap 5 px, padding 7 px, tombol jadi ikon) berlaku di **seluruh
`@media (max-width: 899px)`**, bukan hanya di bawah 400 px. Setelah dirapatkan
bilah butuh **387 px**.

---

## 7. Fitur — daftar lengkap

| # | Fitur | Berkas | Inti |
|---|---|---|---|
| 14 | Peta Indonesia + negara tetangga | `inti.js` | batas geser 92°–148° BT; tetangga tetap tampil supaya pulau berbatasan tidak terpotong |
| 15 | Jenis peta: Satelit ⇄ Map | `inti.js` | satu tombol bergantian; ganti jenis tidak menggeser kamera |
| 16 | Peta tematik jumlah penduduk 4 tingkat | `warna.js` | 9 kelas warna; wilayah tanpa data diwarnai abu-abu |
| 17 | Data anggota (tambah/ubah/hapus) | `member.js` | dikelompokkan per provinsi/kab/kec/desa; penanda berwarna menurut kategori |
| 18 | Peta interaktif mengikuti isian form | `member.js` | pilih wilayah → peta terbang + garis merah berkedip keliling area; pin 📌 bisa digeser dengan mengetuk peta |
| 19 | Cari wilayah / anggota / nama jalan | `cari.js` | wilayah dari data lokal; nama jalan dari Nominatim (jeda 400 ms, minimal 3 huruf, `countrycodes=id`) |
| 20 | Titik lokasi suku bangsa | `suku.js` | 28 suku BPS SP2010; panel seperti panel Anggota; garis merah berkedip + satu titik di tengah kawasan |
| 21 | Peta agama 4 tingkat | `agama.js` | disajikan dalam **persentase** supaya tidak mengulang peta penduduk; Konghucu & Kepercayaan tetap dalam angka jumlah |
| 22 | Tampilan PC lebar (responsive) | `gaya.css` | PC lebar penuh, HP seperti semula |
| — | Panduan pemakaian interaktif | `panduan.js` | tombol `?` mengenali posisi pemakai; kata kunci jadi tautan yang benar-benar menjalankan aksinya |

### Detail yang mudah terlewat

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
| `hapusAnggota` | `{ id }` |
| `simpanKategori` / `hapusKategori` | `{ nama }` |
| `simpanAtur` | `{ nama, nilai }` |
| `kosongkan` | hapus semua anggota |
| `cek` | uji sambungan |

---

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
   `simpanan.js` → `member.js` → `cari.js` → `panduan.js`.
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

## 12. Ukuran proyek (diukur 2026-10-17)

| Bagian | Jumlah | Ukuran |
|---|---|---|
| Berkas data | 1.110 | 85,3 MB |
| Modul JavaScript | 8 | 236 KB |
| Pustaka peta (lokal) | 2 | 1,0 MB |
| Tampilan (`gaya.css`) | 1 | 55 KB |
| Halaman (`index.html`) | 1 | 12 KB |
| Worker Cloudflare | 1 | 9,7 KB |
| Skrip alat | 4 | 27 KB |
| Dokumen | 4 | — |
| Commit | 60 | — |

---

## 13. Rujukan

| Berkas | Isi |
|---|---|
| [`agents.md`](./agents.md) | aturan kerja (untuk AI) |
| [`rencanakerja.md`](./rencanakerja.md) | daftar orderan + bukti uji tiap orderan |
| [`CHANGELOG.md`](./CHANGELOG.md) | riwayat seluruh perkembangan |
| Situs live | https://suwandhih.github.io/Pemetaan/ |
| Repo | https://github.com/suwandhih/Pemetaan |
