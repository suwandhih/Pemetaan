# agents.md — Aturan Kerja Proyek Pemetaan

> Lokasi: `C:\data\Pemetaan` · berkas ini = **aturan main asisten (AI)**.
> 📌 **Baca ulang berkas ini setiap kali sesi dimulai** — bukan asumsi, bukan
> "mungkin sudah ingat".
> 🔴 **Isi berkas ini HANYA ATURAN.** Riwayat panjang ❌ tidak boleh di sini →
> taruh di `CHANGELOG.md`.

Aturan tetap yang ditetapkan pemilik proyek. Berlaku untuk seluruh sesi kerja,
termasuk sesi lanjutan. Tidak boleh diubah tanpa perintah pemilik proyek.

Ditetapkan: 2026-10-12

## 1. Backup wajib pada setiap revisi / penambahan

* Setiap revisi atau penambahan sistem maupun data harus didahului backup.
* **Seluruh berkas `.md` proyek berada di folder `Docs/`.** Tidak ada berkas
  `.md` di akar proyek.
* Mekanisme backup yang disetujui: **Git** (`git init` + commit setiap perubahan).
* Commit dibuat sebelum pekerjaan dimulai (titik pulih) dan sesudah pekerjaan
  selesai terverifikasi.
* Jenis backup menyesuaikan objeknya: perubahan pada data diperlakukan berbeda
  dari perubahan pada sistem/kode. Untuk data, backup harus menjaga nilai lama
  agar bisa dipulihkan.

## 2. Scope tidak boleh ditambah atau dikurangi

* Orderan dijalankan persis seperti yang diperintahkan. Tidak dikurangi, tidak
  ditambah.
* Ide atau usulan di luar perintah **boleh disampaikan**, tetapi **tidak
  diproses**.
* Ide ditulis di `rencanakerja.md` pada bagian "Usulan (belum diperintahkan)"
  dan menunggu persetujuan eksplisit.
* Dilarang berinisiatif menambahkan fitur ke dalam aplikasi tanpa memberi tahu
  pemilik proyek.

## 3. Debug wajib sebelum menyerahkan hasil

* Sebelum melaporkan hasil, asisten wajib melakukan debugging/verifikasi sendiri.
* Pemilik proyek tidak boleh diminta mengetes sebelum asisten memastikan
  pekerjaan benar-benar berjalan.
* Laporan hasil harus menyertakan bukti pengujian yang sudah dilakukan.

* Setiap pekerjaan disertai **perkiraan waktu** sebelum dimulai.
* Selama bekerja, asisten wajib memberi **tanda kehidupan** di layar (aturan 9).

## 3b. Lokasi berkas dokumen

* **Seluruh berkas `.md` wajib berada di folder `Docs/`.**
* Akar proyek hanya berisi berkas aplikasi & konfigurasi, bukan dokumen.
* Rujukan antar dokumen di dalam `Docs/` memakai jalur relatif (`./nama.md`).

Ditetapkan: 2026-10-12 (perintah pemilik proyek)

## 4. Setiap pekerjaan disertai estimasi waktu

* Setiap pembuatan sistem baru, fitur baru, atau revisi harus menyertakan
  perkiraan waktu yang dibutuhkan.
* Estimasi disampaikan sebelum pekerjaan dimulai.

## 5. Batas penanganan looping

* Jika terjadi proses berulang tanpa berhenti, **hentikan** — jangan diulang.
* Jangan mengulang cara yang sama yang sudah gagal.
* Kegagalan dilaporkan beserta penyebab yang diketahui, agar waktu tunggu
  pemilik proyek tidak terbuang tanpa hasil.

## 6. Orderan banyak dikerjakan satu per satu

* Jika pemilik proyek memberikan orderan bernomor (1, 2, 3, 4, 5, ...), semua
  orderan **dicatat lebih dulu** di `rencanakerja.md`.
* Pengerjaan dilakukan **satu per satu**, tidak sekaligus.
* Orderan berikutnya dikerjakan setelah orderan sebelumnya mendapat keputusan.

## 7. rencanakerja.md sebagai daftar induk orderan

* `rencanakerja.md` (di folder `Docs/`) memuat seluruh orderan dari pemilik proyek.
* Orderan yang selesai diberi tanda selesai **beserta tanggal penyelesaian**.
* Status "selesai" hanya sah bila dinyatakan oleh pemilik proyek.
* Sebelum mengerjakan orderan berikutnya, selalu konfirmasi terlebih dahulu.

## 8. Dilarang menyalin isi dari folder lain

* **Dilarang melakukan copy-paste seluruh konsep** dari folder/proyek lain.
* Yang **diperbolehkan**: mengambil **ide** dan **cara** — lalu dipahami dan
  ditulis sendiri.
* Di proyek pemetaan, pekerjaan harus **dibuat sendiri**.
* Alasan: kalau di-copy paste, bila ada masalah menjadi rumit. **Setiap folder
  diperuntukkan berbeda** — jangan disamakan tanpa dipahami.

Ditetapkan: 2026-10-12

## 9. Tanda kehidupan saat bekerja

* Selama mengerjakan pekerjaan — **revisi maupun pembuatan baru** — asisten
  **tidak boleh diam** di layar.
* Asisten wajib memberi kabar kemajuan **sambil bekerja**, supaya pemilik
  proyek tahu komputer sedang bekerja dan bukan hang.
* Yang wajib disampaikan:

| # | Informasi | Contoh |
|---|---|---|
| 1 | Langkah ke berapa dari berapa | `[3 dari 7] Menulis index.html` |
| 2 | Nama pekerjaan yang sedang dilakukan | `Periksa akses Neon` |
| 3 | Waktu mulai & selesai tiap langkah | `mulai 21:55 · selesai 21:57 — 2 mnt` |
| 4 | Perintah dijalankan + hasilnya | `✓ baca berkas (12 KB)` · `✗ gagal: berkas tidak ada` |
| 5 | Posisi keseluruhan | `sudah 4 dari 7 · sisa 3 · perkiraan 40 mnt` |
| 6 | Langkah yang berjalan lama (>2 mnt) | `⏳ langkah 4 masih jalan, 3 mnt berjalan…` |
| 7 | Jalan buntu + cara yang diganti | `⚠️ X gagal 2×, ganti cara Y` (aturan 5) |
| 8 | Ringkasan akhir | `🏁 7 dari 7 selesai · total 62 mnt · 5 berkas berubah` |

* Bentuknya **ringkas**: satu baris per kejadian, bukan paragraf.
* **Dilarang menghilang dalam waktu lama tanpa kabar.**

Ditetapkan: 2026-10-12

## Konvensi status pada rencanakerja.md

| Status | Arti |
|---|---|
| `BARU` | Baru dicatat, belum dikerjakan |
| `DIKERJAKAN` | Sedang dikerjakan |
| `MENUNGGU KONFIRMASI` | Pekerjaan + verifikasi selesai, menunggu keputusan pemilik proyek |
| `SELESAI` | Dinyatakan selesai oleh pemilik proyek (wajib berisi tanggal) |
| `DITUNDA` | Dihentikan atas permintaan pemilik proyek |

---

## Catatan untuk Asisten (dibaca setiap mulai proyek)

Bagian ini yang membuat asisten **teringat** — bukan sekadar punya aturan.

### 🔴 Lima hal paling penting (ingat ini dulu, selalu)

| # | Hal |
|---|---|
| 1 | **Jangan mulai apa pun tanpa aba-aba pemilik proyek.** |
| 2 | **Baca ulang `agents.md` ini setiap sesi dimulai.** |
| 3 | **Backup dulu** (git commit) sebelum dan sesudah setiap revisi. |
| 4 | **Orderan dikerjakan satu per satu** — selesai → uji → lapor → lanjut. |
| 5 | **Jangan mengarang data.** Sumber tidak memberi angka → katakan tidak ada. |

### 📚 Daftar berkas dokumen proyek

| Berkas | Untuk siapa | Isi |
|---|---|---|
| **`Docs/agents.md`** | asisten (AI) | **Hanya aturan** + catatan pengingat sesi |
| **`Docs/rencanakerja.md`** | asisten + manusia | **Daftar orderan**: belum selesai & sudah selesai |
| **`Docs/prompt.md`** | manusia / AI lain | **Konsep** — supaya dapat dibangun ulang persis sama |
| **`Docs/CHANGELOG.md`** | manusia | **Semua perkembangan**, perbaikan, dan hal baru |

⚠️ Seluruh berkas `.md` wajib di `Docs/` (aturan 3b). Akar proyek hanya berisi
berkas aplikasi & konfigurasi.

### 🏁 Status proyek

**Proyek Pemetaan dinyatakan SELESAI oleh pemilik proyek pada 2026-10-17.**
Seluruh **22 orderan** berstatus `SELESAI`. Situs live:
https://suwandhih.github.io/Pemetaan/

**2026-10-18 — orderan 23** (data anggota dari tokomedia.org + tombol
`[↻ Update]` + icon kategori) berstatus `MENUNGGU KONFIRMASI`. 699 anggota
sudah masuk database, 5 kategori baru, 699 titik unik.

Kalau ada pekerjaan baru, perlakukan sebagai **orderan baru** — catat dulu di
`rencanakerja.md`, sebut perkiraan waktu, lalu tunggu aba-aba (aturan 2, 4, 6).

### ✅ Urutan kerja baku setiap sesi

1. Baca `agents.md` ini utuh.
2. Baca `rencanakerja.md` — lihat orderan mana yang sedang berjalan.
3. Sebut **perkiraan waktu** sebelum mulai (aturan 4).
4. Beri **tanda kehidupan** sambil bekerja (aturan 9).
5. Uji sendiri bagian yang berubah, sertakan bukti (aturan 3).
6. Lapor hasil, tunggu keputusan pemilik proyek (aturan 6 & 7).
7. Update dokumen **sekali di akhir**, bukan di tengah pekerjaan.

### ⚠️ Jebakan yang sudah pernah terjadi di proyek ini

| Hal | Sebab | Pelajaran |
|---|---|---|
| Perubahan nama `aturan.md` → `agents.md` sempat tidak tersimpan | Dilakukan dari luar sesi, asisten tidak menyimpan | Periksa `git status` **setiap awal sesi** — jangan asumsikan repo bersih |
| Orderan 5 sempat dikira perlu dikerjakan dari nol | Belum diperiksa dulu | **Periksa dulu** sebelum menyatakan sesuatu perlu dibuat |
| Proyek `DataPeta` ternyata sudah mengerjakan orderan 1–6 | Tidak diperiksa di awal | Periksa folder/proyek lain sebelum menulis kode baru (aturan 8) |
| Bilah atas meluber di lebar 401–430 px — tombol Cari & Panduan terpotong | Bingkai HP **selalu** 430 px, sedangkan 7 tombol bertulisan penuh butuh 536 px; aturan perapatan hanya berlaku di bawah 400 px | Ukur lebar sebenarnya, jangan mengira-ngira. Aturan perapatan kini berlaku di seluruh `< 900 px` |
| `peta.resize()` di tengah animasi `fitBounds` membatalkan animasinya | Perilaku MapLibre | Panggil `resize()` **sebelum** `fitBounds`, atau tunda dengan `setTimeout(…, 0)` |
| `requestAnimationFrame` tidak menyala di tab tersembunyi | Peramban menghentikan rAF di tab latar | Pakai `setTimeout(…, 0)` |
| Chrome mengabaikan `autocomplete="off"` pada `input[type="password"]` | Kebijakan Chrome | Pakai `type="text"` + `-webkit-text-security: disc` |
| CSS `@media` kalah dari aturan dasar | Urutan di berkas | Seluruh `@media` **wajib di akhir** `gaya.css` |
| Perubahan tidak terlihat setelah push | Singgahan Chrome + GitHub Pages perlu ±75–85 detik | Naikkan penanda versi `?v=YYYYMMDD-nn`; minta `Ctrl + Shift + R` |
| Gambar icon penanda hilang setelah ganti jenis peta | MapLibre membuang gambar bersama gaya lama | pasang ulang di `gambarPenanda()` dengan pemeriksaan `hasImage()` |
| Anggota yang hanya punya provinsi tidak muncul di tingkat bawah | `kodeUntukTingkat()` mengembalikan kosong | pakai kode tingkat di atasnya bila kosong |
| API TokoMedia mengembalikan halaman login, bukan JSON | API belum terpasang di produksi | ambil lewat Worker (server), bukan peramban |

Daftar jebakan teknis yang lebih lengkap ada di
[`prompt.md`](./prompt.md) bagian 9.

### 📌 Pesan untuk asisten berikutnya

1. **Baca berkas ini utuh** sebelum kerja apa pun.
2. **Jangan mulai tanpa aba-aba** pemilik proyek.
3. **Backup → kerjakan → uji bagian yang berubah → lapor → update dokumen sekali di akhir.**
4. Kalau ragu → **tanya**, jangan menebak. Jangan karang data.
5. Riwayat yang sudah selesai ❌ jangan ditulis di sini → tulis di `CHANGELOG.md`.
6. **Wajib sebut perkiraan waktu** sebelum mengerjakan sesuatu (aturan 4).
7. **Jangan pernah menulis kunci API / password / connection string** di dalam
   kode atau dokumen — repo ini **publik**.
8. **Proyek sudah selesai 2026-10-17.** Untuk melanjutkan, baca dulu
   [`prompt.md`](./prompt.md) (konsep) dan [`CHANGELOG.md`](./CHANGELOG.md)
   (riwayat) supaya tidak mengulang pekerjaan yang sudah ada.
