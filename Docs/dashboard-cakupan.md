# Dashboard Cakupan Layanan

## Tujuan

Dashboard ini membantu pengelola melihat catatan media per pulau dan provinsi, data anggota non-media, bahasa sumber yang belum memiliki record media, serta indikasi cakupan wilayah suku. Angka menggunakan data yang tercatat, tidak mengisi kekosongan dengan perkiraan.

## Arti angka

- **Provinsi dengan media**: ada setidaknya satu record media yang mempunyai kode provinsi.
- **Provinsi belum tercatat**: belum ditemukan record media berbahasa dengan kode provinsi tersebut. Ini tidak membuktikan bahwa layanan sama sekali tidak tersedia.
- **Bahasa referensi belum tercatat**: nama bahasa dalam katalog API Rumahweb yang belum ditemukan pada kategori media bersangkutan. Untuk bahasa pada katalog tetapi tanpa provinsi, laporan hanya menampilkan gugus dan menandai bahwa rincian provinsi tidak tersedia.
- **Data non-media**: kategori anggota selain lima kategori media, misalnya Yayasan, Sekolah, Kesehatan, Sosial atau Pemerintahan. Rincian per provinsi memakai data yang memiliki kode provinsi; record tanpa provinsi ditampilkan terpisah.
- **Indikasi cakupan suku**: irisan provinsi bermedia dengan kawasan utama kelompok suku menurut BPS, Sensus Penduduk 2010. Ini hanya indikasi wilayah, bukan bukti anggota suku atau individu tertentu menerima media.

## Catatan sumber

- Media dan bahasa: API Rumahweb, baca saja; kode provinsi dari katalog bahasa Pemetaan.
- Data anggota lain: Neon melalui Worker Pemetaan.
- Kawasan suku: pemetaan 28 kelompok BPS SP2010 yang sudah dipakai panel Suku.

Dashboard tidak menyimpulkan media belum tersedia hanya karena record tidak ada; dashboard melaporkan apa yang tercatat pada sumber dan batas ketepatan sumber tersebut.
