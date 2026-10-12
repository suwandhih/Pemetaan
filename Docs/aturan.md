# Aturan Kerja

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
