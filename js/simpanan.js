/* Pemetaan — penyimpanan data (orderan 17, disambung ke Neon — orderan 7)
   ------------------------------------------------------------------
   Data anggota disimpan di database Neon lewat Worker Cloudflare,
   supaya isinya SAMA di HP dan PC.

   KENAPA LEWAT WORKER
     Situs Pemetaan hanya berkas statis. Kalau sandi database ditanam
     di JavaScript, siapa pun bisa membacanya lewat "View Source" lalu
     menghapus seluruh data. Sandi disimpan di Worker sebagai secret.

   TIGA CARA SIMPAN (bertingkat, otomatis)
     1. DARING   — data ditulis ke Neon lewat Worker.
     2. LURING   — bila internet mati / Worker tidak menjawab, data
                   ditulis ke IndexedDB peramban dan dimasukkan ke
                   antrean "belum terkirim".
     3. SINKRON  — begitu daring lagi, antrean dikirim otomatis.

   Dengan begitu aplikasi tetap bisa dipakai walaupun sedang luring.
   Bila KUNCI belum diisi, seluruh pemakaian jatuh ke IndexedDB
   seperti semula (orderan 17).

   Nama fungsi tidak berubah dari versi IndexedDB, jadi js/member.js
   tidak perlu disesuaikan. */

const Simpanan = (function () {
  'use strict';

  /* ---------- setelan sambungan ---------- */
  var ALAMAT = 'https://pemetaan-api.suwandhih.workers.dev';

    /* Kunci untuk MENULIS ke database. Sengaja TIDAK ditanam di berkas ini,
       sebab situs Pemetaan bisa dibaca siapa saja lewat "View Source".
       Kunci cukup dimasukkan satu kali di tiap perangkat (PC dan HP), lalu
       diingat peramban. Membaca data tidak perlu kunci. */
    var KUNCI_LOKAL = 'pemetaan_kunci';
    var KUNCI = '';

    try { KUNCI = localStorage.getItem(KUNCI_LOKAL) || ''; } catch (e) { KUNCI = ''; }

    var MENYALA = ALAMAT.indexOf('http') === 0;

  var BATAS_TUNGGU = 15000;

  /* ---------- IndexedDB (cadangan luring) ---------- */
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

  var anggota = [];      /* salinan di memori — sumber tampilan */
  var kategori = [];
  var pengaturan = {};
  var antrean = [];      /* aksi yang belum terkirim ke Neon */
  var siap = null;       /* hasil buka() pertama */
  var daring = MENYALA;

  var KUNCI_ANTREAN = 'antrean';

  function buka() {
    if (siap) { return siap; }
    siap = new Promise(function (selesai) {
            var sudah = false;
            function tutup(ada) {
              if (sudah) { return; }
              sudah = true;
              selesai(ada);
            }

            /* Penyimpanan lokasi HP/PC terpisah — tidak dipakai bersama. */
            if (!window.indexedDB) { tutup(false); return; }
            var permintaan = indexedDB.open(NAMA_DB, VERSI);

            permintaan.onupgradeneeded = function (e) {
              var d = e.target.result;
              if (!d.objectStoreNames.contains(T_ANGGOTA)) {
                var s = d.createObjectStore(T_ANGGOTA, { keyPath: 'id' });
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

            permintaan.onsuccess = function (e) { db = e.target.result; tutup(true); };
            permintaan.onerror = function () { tutup(false); };
            /* Bila ada tab Pemetaan lain yang masih memegang database, permintaan
               ini bisa tertahan tanpa batas dan panel anggota jadi kosong.
               Lebih baik langsung menyerah daripada macet. */
            permintaan.onblocked = function () { tutup(false); };

            /* Jaring pengaman kedua: penyimpanan peramban tidak boleh sampai
               membuat peta tidak bisa dipakai. */
            setTimeout(function () { if (!db) { tutup(false); } }, 4000);
      });
      return siap;
    }

  function toko(nama, cara, kerja) {
    return buka().then(function (ada) {
      if (!ada || !db) { return null; }
      return new Promise(function (selesai, gagal) {
        var tx = db.transaction(nama, cara);
        var req = kerja(tx.objectStore(nama));
        req.onsuccess = function () { selesai(req.result); };
        req.onerror = function () { gagal(req.error); };
      });
    });
  }

  function simpanLokalAnggota(a) {
    return toko(T_ANGGOTA, 'readwrite', function (s) { return s.put(a); });
  }
  function hapusLokalAnggota(id) {
    return toko(T_ANGGOTA, 'readwrite', function (s) { return s.delete(id); });
  }
  function bacaLokalAtur(nama) {
    return toko(T_ATUR, 'readonly', function (s) { return s.get(nama); })
      .then(function (r) { return r ? r.nilai : null; });
  }
  function tulisLokalAtur(nama, nilai) {
    return toko(T_ATUR, 'readwrite', function (s) { return s.put({ nama: nama, nilai: nilai }); });
  }

  /* ---------- panggilan ke Worker ---------- */

    function teks(v) {
      return v === null || v === undefined ? '' : String(v);
    }

    function panggil(isi) {
    var paket = {};
    for (var k in isi) { if (Object.prototype.hasOwnProperty.call(isi, k)) { paket[k] = isi[k]; } }
      /* Seluruh permintaan memakai kunci — termasuk membaca. Data anggota
         bersifat internal, jadi tidak boleh terbuka untuk umum. */
      paket.kunci = KUNCI;

    var pembatal = null;
    var batas = new Promise(function (_, gagal) {
      pembatal = setTimeout(function () { gagal(new Error('waktu habis')); }, BATAS_TUNGGU);
    });

    var minta = fetch(ALAMAT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paket)
    }).then(function (r) { return r.json(); });

    return Promise.race([minta, batas]).then(function (hasil) {
      clearTimeout(pembatal);
      if (!hasil || !hasil.ok) {
        throw new Error((hasil && hasil.pesan) || 'Worker menolak permintaan');
      }
      return hasil;
    }).catch(function (e) {
      clearTimeout(pembatal);
      daring = false;
      throw e;
    });
  }

  /* Antrean: aksi tulis yang gagal terkirim disimpan dulu supaya tidak
     ada data yang hilang saat internet mati. Dikirim ulang sendiri
     begitu daring lagi (lihat kirimAntrean). */
  function catatAntrean(aksi, isi) {
    antrean.push({ aksi: aksi, isi: isi });
    return tulisLokalAtur(KUNCI_ANTREAN, JSON.stringify(antrean));
  }

  function kirimAntrean() {
    if (!MENYALA || !antrean.length || !daring) { return Promise.resolve(false); }
    var salinan = antrean.slice();
    antrean = [];
    return tulisLokalAtur(KUNCI_ANTREAN, '[]').then(function () {
      var jalan = salinan.reduce(function (rantai, a) {
        return rantai.then(function () {
          var isi = { aksi: a.aksi };
          for (var k in a.isi) { isi[k] = a.isi[k]; }
          return panggil(isi);
        });
      }, Promise.resolve());
      return jalan.then(function () { return true; })
        .catch(function () {
          /* Gagal lagi — kembalikan sisa ke antrean. */
          antrean = salinan.concat(antrean);
          return tulisLokalAtur(KUNCI_ANTREAN, JSON.stringify(antrean))
            .then(function () { return false; });
        });
    });
  }

  /* ---------- anggota ---------- */

  function semuaAnggota() {
      /* Selalu ambil dari salinan di memori supaya perubahan terbaru
         (termasuk yang masih mengantre saat luring) ikut terbaca. */
      return ambilSemua().then(function () { return anggota.slice(); });
    }

  function ambilAnggota(id) {
    for (var i = 0; i < anggota.length; i++) {
      if (anggota[i].id === id) { return Promise.resolve(anggota[i]); }
    }
    return Promise.resolve(null);
  }

  function simpanAnggota(a) {
    /* Simpan ke memori + peramban dulu supaya tampilan langsung berubah,
       lalu kirim ke Neon. Cara ini membuat aplikasi tetap enak dipakai
       walau sambungan lambat. */
    var ketemu = false;
    for (var i = 0; i < anggota.length; i++) {
      if (anggota[i].id === a.id) { anggota[i] = a; ketemu = true; }
    }
    if (!ketemu) { anggota.push(a); }

    var lokal = simpanLokalAnggota(a);
        if (!MENYALA || !adaKunci()) {
          /* Belum ada kunci di perangkat ini — simpan di peramban dulu dan
             masukkan ke antrean supaya tidak hilang saat kunci dimasukkan. */
          if (MENYALA) {
            return catatAntrean('simpanAnggota', { anggota: a }).then(function () { return a; });
          }
          return lokal.then(function () { return a; });
        }

    return panggil({ aksi: 'simpanAnggota', anggota: a })
      .then(function (h) {
        daring = true;
        var jadi = h.anggota || a;
        /* Ganti dengan jawaban database — kolom dibuat/diubah ikut pas. */
        for (var j = 0; j < anggota.length; j++) {
          if (anggota[j].id === a.id) { anggota[j] = jadi; }
        }
        return simpanLokalAnggota(jadi).then(function () { return jadi; });
      })
      .catch(function () {
        return catatAntrean('simpanAnggota', { anggota: a }).then(function () { return a; });
      });
  }

  function hapusAnggota(id) {
    anggota = anggota.filter(function (a) { return a.id !== id; });
    var lokal = hapusLokalAnggota(id);
      if (!MENYALA || !adaKunci()) {
        if (MENYALA) {
          return catatAntrean('hapusAnggota', { id: id }).then(function () { return true; });
        }
        return lokal.then(function () { return true; });
      }

    return panggil({ aksi: 'hapusAnggota', id: id })
      .then(function () { daring = true; return true; })
      .catch(function () {
        return catatAntrean('hapusAnggota', { id: id }).then(function () { return true; });
      });
  }

  function hitungAnggota() {
    return Promise.resolve(anggota.length);
  }

  /* ---------- tarik data tokomedia.org (tombol [Update]) ---------- */

  /* Penarikan dilakukan Worker (bukan peramban) karena tokomedia.org tidak
     mengirim header CORS. Worker juga yang menghitung koordinat. */
  function tarikTokomedia() {
    if (!MENYALA || !adaKunci()) {
      return Promise.resolve({ ok: false, pesan: 'Kode database belum diisi.' });
    }
    return panggil({ aksi: 'tarikTokomedia' });
  }

  /* Simpan banyak anggota sekaligus. Dipakai setelah penarikan supaya
     tidak mengirim 699 permintaan satu per satu. */
  function simpanAnggotaBanyak(daftar) {
    if (!Array.isArray(daftar) || !daftar.length) {
      return Promise.resolve(0);
    }

    /* Salinan di memori + peramban diperbarui dulu, jadi daftar langsung
       berubah walau pengiriman ke database masih berjalan. */
    var peta = {};
    anggota.forEach(function (a) { peta[a.id] = a; });
    daftar.forEach(function (a) { peta[a.id] = a; });
    anggota = Object.keys(peta).map(function (k) { return peta[k]; });

    var lokal = Promise.all(daftar.map(simpanLokalAnggota));

    if (!MENYALA || !adaKunci()) {
      return lokal.then(function () { return daftar.length; });
    }

    return panggil({ aksi: 'simpanAnggotaBanyak', anggota: daftar })
      .then(function (h) {
        daring = true;
        return h.jumlah || daftar.length;
      })
      .catch(function () {
        /* Gagal terkirim — simpan di peramban saja. Data tidak hilang;
           pengiriman ulang dilakukan saat tombol [Update] ditekan lagi. */
        return lokal.then(function () { return daftar.length; });
      });
  }

  function kosongkanAnggota() {
    anggota = [];
    return toko(T_ANGGOTA, 'readwrite', function (s) { return s.clear(); })
      .then(function () {
              if (!MENYALA || !adaKunci()) {
                return MENYALA ? catatAntrean('kosongkan', {}).then(function () { return true; }) : true;
              }
              return panggil({ aksi: 'kosongkan' })
          .then(function () { return true; })
          .catch(function () { return catatAntrean('kosongkan', {}).then(function () { return true; }); });
      });
  }

  /* ---------- memuat seluruh data ---------- */

  function dariLokal() {
    return Promise.all([
      toko(T_ANGGOTA, 'readonly', function (s) { return s.getAll(); }),
      toko(T_KATEGORI, 'readonly', function (s) { return s.getAll(); }),
      bacaLokalAtur(KUNCI_ANTREAN)
    ]).then(function (h) {
      antrean = h[2] ? JSON.parse(h[2]) : [];
      return {
        anggota: h[0] || [],
        kategori: (h[1] || []).map(function (x) { return x.nama; }),
        pengaturan: {}
      };
    });
  }

  var muatSekali = null;

  function ambilSemua() {
    if (muatSekali) { return muatSekali; }
    muatSekali = dariLokal().then(function (lokal) {
        /* Bila kunci belum diisi di perangkat ini, jangan pakai isi peramban:
           bisa jadi itu sisa data perangkat ini saja, bukan isi database.
           Menampilkannya membuat pemakai mengira data sudah sama padahal belum. */
        if (!MENYALA || !adaKunci()) {
          anggota = MENYALA ? [] : lokal.anggota;
          kategori = MENYALA ? [] : lokal.kategori;
          return { anggota: anggota, kategori: kategori, pengaturan: {} };
        }
        return panggil({ aksi: 'ambilSemua' }).then(function (h) {
        daring = true;
        anggota = h.anggota || [];
        kategori = h.kategori || [];
        pengaturan = h.pengaturan || {};
        /* Segerakan cermin luring supaya pemakaian berikutnya cepat. */
        var simpan = anggota.map(simpanLokalAnggota);
        if (kategori.length) {
          simpan.push(toko(T_KATEGORI, 'readwrite', function (s) {
            s.clear();
            kategori.forEach(function (n) { s.put({ nama: n }); });
            return s.count();
          }));
        }
        return Promise.all(simpan).then(function () {
          return kirimAntrean();
        }).then(function () {
          return { anggota: anggota, kategori: kategori, pengaturan: pengaturan };
        });
      }).catch(function () {
        /* Luring — pakai isi peramban + antrean yang belum terkirim. */
        anggota = lokal.anggota;
        kategori = lokal.kategori;
        return lokal;
      });
    });
    return muatSekali;
  }

  /* ---------- kategori ---------- */

  function semuaKategori() {
    return ambilSemua().then(function () {
      if (kategori.length) { return kategori.slice(); }
      if (!MENYALA) {
        return Promise.all(KATEGORI_AWAL.map(function (n) {
          return toko(T_KATEGORI, 'readwrite', function (s) { return s.put({ nama: n }); });
        })).then(function () { kategori = KATEGORI_AWAL.slice(); return kategori.slice(); });
      }
      /* Database baru — isi kategori awal. */
            if (!adaKunci()) {
              return Promise.all(KATEGORI_AWAL.map(function (n) {
                return toko(T_KATEGORI, 'readwrite', function (s) { return s.put({ nama: n }); });
              })).then(function () { kategori = KATEGORI_AWAL.slice(); return kategori.slice(); });
            }
            var kerja = KATEGORI_AWAL.map(function (n) {
              return panggil({ aksi: 'simpanKategori', nama: n }).catch(function () { return null; });
            });
            return Promise.all(kerja).then(function () {
              kategori = KATEGORI_AWAL.slice();
              return kategori.slice();
            });
          });
        }

        function simpanKategori(nama) {
          if (kategori.indexOf(nama) < 0) { kategori.push(nama); }
          return toko(T_KATEGORI, 'readwrite', function (s) { return s.put({ nama: nama }); })
            .then(function () {
              if (!MENYALA || !adaKunci()) { return nama; }
              return panggil({ aksi: 'simpanKategori', nama: nama })
                .then(function () { return nama; })
                .catch(function () { return catatAntrean('simpanKategori', { nama: nama }).then(function () { return nama; }); });
            });
        }

        function hapusKategori(nama) {
          kategori = kategori.filter(function (n) { return n !== nama; });
          return toko(T_KATEGORI, 'readwrite', function (s) { return s.delete(nama); })
            .then(function () {
              if (!MENYALA || !adaKunci()) { return true; }
              return panggil({ aksi: 'hapusKategori', nama: nama })
                .then(function () { return true; })
                .catch(function () { return catatAntrean('hapusKategori', { nama: nama }).then(function () { return true; }); });
            });
        }

  /* ---------- pengaturan ---------- */

  function ambilAtur(nama) {
      /* Tunggu pemuatan selesai dulu; kalau tidak, nilai dari database
         bisa terlewat dan yang dipakai nilai lama di peramban. */
      return ambilSemua().then(function () {
        if (Object.prototype.hasOwnProperty.call(pengaturan, nama)) {
          return pengaturan[nama];
        }
        return bacaLokalAtur(nama);
      });
    }

  function simpanAtur(nama, nilai) {
    pengaturan[nama] = nilai;
    return tulisLokalAtur(nama, nilai).then(function () {
        if (!MENYALA || !adaKunci()) { return nilai; }
      return panggil({ aksi: 'simpanAtur', nama: nama, nilai: nilai })
        .then(function () { return nilai; })
        .catch(function () { return catatAntrean('simpanAtur', { nama: nama, nilai: nilai }).then(function () { return nilai; }); });
    });
  }

  /* ---------- mengisi kunci (sekali per perangkat) ---------- */

    function adaKunci() {
      return KUNCI.length > 5;
  }

    function simpanKunci(baru) {
      KUNCI = teks(baru);
      try { localStorage.setItem(KUNCI_LOKAL, KUNCI); } catch (e) { /* diabaikan */ }
      daring = true;
      return panggil({ aksi: 'cek' }).then(function (h) {
        return { ok: true, jumlah: h.jumlah };
      });
    }

    function lupakanKunci() {
      KUNCI = '';
      try { localStorage.removeItem(KUNCI_LOKAL); } catch (e) { /* diabaikan */ }
    }

    /* ---------- bantu ---------- */

    function idBaru() {
      return 'A' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  }

    /* ---------- keadaan sambungan (untuk pemberitahuan di layar) ---------- */

    function keadaan() {
      return {
        menyala: MENYALA,
        punyaKunci: adaKunci(),
        daring: daring && MENYALA && adaKunci(),
        menunggu: antrean.length,
        jumlah: anggota.length
      };
    }

    /* Dipanggil saat peramban tahu internet hidup lagi. */
    function cobaSambungUlang() {
      if (!MENYALA || !adaKunci()) { return Promise.resolve(false); }
      return panggil({ aksi: 'cek' }).then(function () {
        daring = true;
        return kirimAntrean();
      }).catch(function () { return false; });
    }

  window.addEventListener('online', function () { cobaSambungUlang(); });

  return {
    buka: buka,
    semuaAnggota: semuaAnggota,
    ambilAnggota: ambilAnggota,
    simpanAnggota: simpanAnggota,
    simpanAnggotaBanyak: simpanAnggotaBanyak,
    tarikTokomedia: tarikTokomedia,
    hapusAnggota: hapusAnggota,
    hitungAnggota: hitungAnggota,
    semuaKategori: semuaKategori,
    simpanKategori: simpanKategori,
    hapusKategori: hapusKategori,
    ambilAtur: ambilAtur,
    simpanAtur: simpanAtur,
    idBaru: idBaru,
    kosongkanAnggota: kosongkanAnggota,
    keadaan: keadaan,
        cobaSambungUlang: cobaSambungUlang,
        adaKunci: adaKunci,
        simpanKunci: simpanKunci,
        lupakanKunci: lupakanKunci
      };
})();