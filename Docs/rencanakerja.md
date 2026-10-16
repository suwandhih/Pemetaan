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
| 7 | Setelan database: aktifkan Neon Data API, buat tabel, pasang RLS, sambungkan aplikasi ke database | BARU | 60–90 mnt | — |
| 8 | Setelan GitHub: siapkan repo, cabang, GitHub Pages, dan cara unggah perubahan | MENUNGGU KONFIRMASI — repo + remote + push ✅ · **GitHub Pages ✅ aktif** | 30–45 mnt | — |
| 9 | `aturan.md` diganti nama menjadi **`agents.md`** — berisi aturan + catatan agar asisten diingatkan setiap mulai proyek | MENUNGGU KONFIRMASI | 5 mnt | — |
| 10 | Pastikan `rencanakerja.md` berfungsi sebagai **daftar orderan**: yang belum selesai dan yang sudah selesai | BARU | 5 mnt | — |
| 11 | Buat **`prompt.md`** — konsep proyek, supaya AI lain dapat membuat ulang **persis sama** | BARU | 30–45 mnt | — |
| 12 | Buat **`CHANGELOG.md`** — catatan semua perkembangan, perbaikan, dan hal baru | BARU | 15–20 mnt | — |
| 13 | Jawab & siapkan: apakah GitHub sudah siap kerja untuk proyek pemetaan | MENUNGGU KONFIRMASI | 20–30 mnt | — |
| 14 | **Peta Indonesia + negara tetangga** — fokus Indonesia, tetangga tetap tampil supaya tidak kosong; beberapa pulau Indonesia berbatasan langsung dengan negara lain | MENUNGGU KONFIRMASI | 45–60 mnt | — |
| 15 | **Fitur citra satelit atau peta** — peta memakai citra satelit, tetapi bisa juga dalam bentuk peta (contoh acuan: `petadunia`) | MENUNGGU KONFIRMASI | 30–45 mnt | — |

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
