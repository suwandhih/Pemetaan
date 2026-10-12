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

Catatan hubungan antar-orderan:

* Orderan 1–5 berisi **syarat** dari aplikasi yang akan dibangun.
* Orderan 6 adalah **wujud nyata** tahap awal — peta + UI + form isian.
* Orderan 4 dan 5 hampir seluruhnya berupa konfigurasi, bukan kode baru.

Total perkiraan waktu orderan 1–6: **±4,5–6,5 jam**, dikerjakan bertahap.

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

| No | Yang dibutuhkan | Untuk orderan |
|----|-----------------|---------------|
| 1 | Kredensial Neon (connection string, atau URL Data API + JWT) | 1 dan 6 |
| 2 | Tujuan push GitHub: repo baru atau repo yang sudah ada? | 1 |
| 3 | Keputusan: kode ke GitHub, data ke Neon — perlu dipastikan | 1 |

Catatan penting soal Neon: **Neon Data API tidak punya lapisan izin sendiri.**
Setiap permintaan diotorisasi sepenuhnya oleh `GRANT` dan kebijakan
**Row-Level Security (RLS)** di PostgreSQL. Kebijakan yang salah membuat tabel
terbuka bagi siapa pun yang memiliki URL endpoint. RLS wajib disiapkan.

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
| 2026-10-12 | Fondasi teknologi: **Google Maps JavaScript API tipe hybrid** (citra satelit + label), `maxZoom` ~19–20, marker bertipe AdvancedMarkerElement, difokuskan ke wilayah Indonesia + Asia Tenggara. |
| 2026-10-12 | Backup: **git init + commit setiap perubahan**. |
| 2026-10-12 | Aturan kerja 1–7 ditetapkan dan dicatat di `aturan.md`. |
| 2026-10-12 | Sistem CHNGMKR **tidak dipakai**. Fondasi tetap Google Maps JS API murni. |
| 2026-10-12 | Data boleh tidak lengkap. Kontribusi pengguna diperlukan untuk melengkapi. |
| 2026-10-12 | **Google Maps DITOLAK.** Alasan: aturan/harga bisa berubah sepihak, data statistik tidak berada di infrastruktur sendiri, dan bukan peruntukan untuk data tematik. |
| 2026-10-12 | **CHNGMKR DITOLAK.** Alasan terbukti: (a) CHNGMKR sendiri memakai Google Maps JS API — jadi tidak melepaskan diri dari Google; (b) tidak ada repo terbuka (`github.com/chngmkr` = 404, pencarian GitHub tanpa hasil); (c) kebutuhan mereka beda (`maxZoom: 14`, roadmap, tanpa layer data) sehingga meniru mereka justru menambah pekerjaan bongkar pasang. |
| 2026-10-12 | **Fondasi teknologi FINAL: MapLibre GL JS + Esri World Imagery + OpenFreeMap/OSM.** Tanpa vendor lock, tanpa biaya, dapat dipakai offline. |
| 2026-10-12 | Proyek baru dibangun di `C:\data\Pemetaan`. Proyek **`petadunia`** (`C:\data\Peta dunia`) menjadi **contoh/referensi SAJA** dan tidak diubah. |

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
