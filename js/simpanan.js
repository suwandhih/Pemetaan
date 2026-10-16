/* Pemetaan — penyimpanan data (orderan 17)
   ------------------------------------------------------------------
   Data anggota disimpan di peramban (PC/HP) memakai IndexedDB. Tidak
   hilang saat halaman ditutup, dan jalan tanpa internet.

   Konsep ini diambil dari `DataPeta` (js/penyimpanan.js) — store
   `lokasi` + `pengaturan`. Yang disesuaikan: anggota menempel pada
   KODE WILAYAH resmi (2.2.2.4 angka dari Dukcapil), bukan pada nama
   yang diketik bebas. Sebabnya: nama bisa salah tulis atau berubah,
   sedangkan kode wilayah tidak.

   Nama database : pemetaan
   Tabel         : anggota     (kunci: id)     — data anggota
                   kategori    (kunci: nama)   — daftar kategori
                   pengaturan  (kunci: nama)   — setelan aplikasi

   Kalau nanti database Neon (orderan 7) sudah siap, isi berkas ini
   bisa diganti dengan pemanggilan jaringan. Seluruh pemakaian di
   js/member.js memakai nama fungsi yang sama, jadi tidak perlu diubah. */

const Simpanan = (function () {
  'use strict';

  var NAMA_DB = 'pemetaan';
  var VERSI = 1;
  var T_ANGGOTA = 'anggota';
  var T_KATEGORI = 'kategori';
  var T_ATUR = 'pengaturan';
  var db = null;

  var KATEGORI_AWAL = [
    'Yayasan',
    'Sekolah',
    'Kesehatan',
    'Sosial',
    'Pemerintahan',
    'Lainnya'
  ];

  function buka() {
    return new Promise(function (selesai, gagal) {
      if (db) { selesai(db); return; }
      var permintaan = indexedDB.open(NAMA_DB, VERSI);

      permintaan.onupgradeneeded = function (e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains(T_ANGGOTA)) {
          var s = d.createObjectStore(T_ANGGOTA, { keyPath: 'id' });
          /* Indeks supaya daftar bisa disaring menurut wilayah dengan cepat
             tanpa membaca seluruh isi tabel. */
          s.createIndex('kodeProvinsi', 'kodeProvinsi', { unique: false });
          s.createIndex('kodeKabkota', 'kodeKabkota', { unique: false });
          s.createIndex('kodeKecamatan', 'kodeKecamatan', { unique: false });
          s.createIndex('kodeDesa', 'kodeDesa', { unique: false });
          s.createIndex('kategori', 'kategori', { unique: false });
        }
        if (!d.objectStoreNames.contains(T_KATEGORI)) {
          d.createObjectStore(T_KATEGORI, { keyPath: 'nama' });
        }
        if (!d.objectStoreNames.contains(T_ATUR)) {
          d.createObjectStore(T_ATUR, { keyPath: 'nama' });
        }
      };

      permintaan.onsuccess = function (e) { db = e.target.result; selesai(db); };
      permintaan.onerror = function () { gagal(permintaan.error); };
    });
  }

  function toko(nama, cara, kerja) {
    return buka().then(function (d) {
      return new Promise(function (selesai, gagal) {
        var tx = d.transaction(nama, cara);
        var req = kerja(tx.objectStore(nama));
        req.onsuccess = function () { selesai(req.result); };
        req.onerror = function () { gagal(req.error); };
      });
    });
  }

  /* ---------- anggota ---------- */

  function semuaAnggota() {
    return toko(T_ANGGOTA, 'readonly', function (s) { return s.getAll(); })
      .then(function (r) { return r || []; });
  }

  function ambilAnggota(id) {
    return toko(T_ANGGOTA, 'readonly', function (s) { return s.get(id); });
  }

  function simpanAnggota(a) {
    return toko(T_ANGGOTA, 'readwrite', function (s) { return s.put(a); })
      .then(function () { return a; });
  }

  function hapusAnggota(id) {
    return toko(T_ANGGOTA, 'readwrite', function (s) { return s.delete(id); })
      .then(function () { return true; });
  }

  function hitungAnggota() {
    return toko(T_ANGGOTA, 'readonly', function (s) { return s.count(); });
  }

  /* ---------- kategori ---------- */

  function semuaKategori() {
    return toko(T_KATEGORI, 'readonly', function (s) { return s.getAll(); })
      .then(function (r) {
        if (r && r.length) {
          return r.map(function (x) { return x.nama; })
            .sort(function (a, b) { return a.localeCompare(b, 'id'); });
        }
        /* Belum ada isinya — pakai daftar awal supaya form tidak kosong. */
        return Promise.all(KATEGORI_AWAL.map(function (n) {
          return toko(T_KATEGORI, 'readwrite', function (s) { return s.put({ nama: n }); });
        })).then(function () { return KATEGORI_AWAL.slice(); });
      });
  }

  function simpanKategori(nama) {
    return toko(T_KATEGORI, 'readwrite', function (s) { return s.put({ nama: nama }); })
      .then(function () { return nama; });
  }

  function hapusKategori(nama) {
    return toko(T_KATEGORI, 'readwrite', function (s) { return s.delete(nama); })
      .then(function () { return true; });
  }

  /* ---------- pengaturan ---------- */

  function ambilAtur(nama) {
    return toko(T_ATUR, 'readonly', function (s) { return s.get(nama); })
      .then(function (r) { return r ? r.nilai : null; });
  }

  function simpanAtur(nama, nilai) {
    return toko(T_ATUR, 'readwrite', function (s) { return s.put({ nama: nama, nilai: nilai }); })
      .then(function () { return nilai; });
  }

  /* ---------- bantu ---------- */

  function idBaru() {
    return 'A' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  }

  /* Membuang seluruh data anggota — dipakai untuk pemulihan bila ada
     data yang rusak. Kategori & pengaturan tidak ikut dihapus. */
  function kosongkanAnggota() {
    return toko(T_ANGGOTA, 'readwrite', function (s) { return s.clear(); })
      .then(function () { return true; });
  }

  return {
    buka: buka,
    semuaAnggota: semuaAnggota,
    ambilAnggota: ambilAnggota,
    simpanAnggota: simpanAnggota,
    hapusAnggota: hapusAnggota,
    hitungAnggota: hitungAnggota,
    semuaKategori: semuaKategori,
    simpanKategori: simpanKategori,
    hapusKategori: hapusKategori,
    ambilAtur: ambilAtur,
    simpanAtur: simpanAtur,
    idBaru: idBaru,
    kosongkanAnggota: kosongkanAnggota
  };
})();