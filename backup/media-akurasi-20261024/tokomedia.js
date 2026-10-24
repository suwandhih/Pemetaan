/* Pemetaan — tarik data media dari API TokoMedia (tombol [Update])
   ------------------------------------------------------------------
   TUGAS
     Mengambil daftar bahasa media dari API TokoMedia yang ada di
     Rumahweb, lalu menyimpannya ke database Pemetaan — lengkap dengan
     KOORDINAT.

   KENAPA LEWAT WORKER
     Token API TokoMedia harus disimpan di sisi server. Kalau ditaruh di
     JavaScript, siapa pun bisa membacanya lewat "View Source" lalu
     memakainya sesuka hati. Jadi jalurnya:

       peramban -> Worker Cloudflare -> pemetaan-bridge.php -> API

     Worker juga yang menghitung koordinat, karena peta-bahasa.js ada di
     sisi Worker.

   SIFATNYA BACA SAJA
     pemetaan-bridge.php hanya memuat endpoint baca. Tidak ada satu pun
     endpoint tulis di daftar izinnya, jadi data TokoMedia tidak mungkin
     berubah lewat jalur ini. Berkas tm-bridge.php milik aplikasi
     TokoMedia tidak disentuh sama sekali.

   KAPAN JALAN
     Hanya saat tombol [Update] ditekan. Tidak ada penarikan otomatis dan
     tidak ada permintaan berulang — supaya server tidak dibebani.

   KOORDINAT
     API TokoMedia tidak menyimpan lokasi. Titik dihitung dari nama bahasa
     -> provinsi (cloudflare/peta-bahasa.js). Bila nama bahasanya belum
     terpetakan, dipakai titik tengah gugus pulaunya. Ini PERKIRAAN dan
     ditulis apa adanya di keterangan anggota.

   HASIL
     window.PD_TOKOMEDIA = { tarik(), siap() }
*/

(function () {
  'use strict';

  var elTombol = document.getElementById('anggota-update');
  var elPesan = null;
  var sedang = false;

  /* ---------- pesan di layar ---------- */

  function pesan(teks, jenis) {
    if (!elPesan) {
      elPesan = document.createElement('p');
      elPesan.id = 'anggota-update-pesan';
      elPesan.className = 'fa-catatan';
      var induk = document.getElementById('anggota-kepala');
      if (induk && induk.parentNode) {
        induk.parentNode.insertBefore(elPesan, induk.nextSibling);
      }
    }
    if (!elPesan) { return; }
    elPesan.textContent = teks || '';
    elPesan.hidden = !teks;
    elPesan.className = 'fa-catatan' + (jenis === 'salah' ? ' fa-peringatan' : '');
  }

  /* ---------- keadaan tombol ---------- */

  function kunciTombol(nyala) {
    sedang = nyala;
    if (!elTombol) { return; }
    elTombol.disabled = nyala;
    elTombol.textContent = nyala ? '\u21BB Mengambil\u2026' : '\u21BB Update';
  }

  /* ---------- tarik ---------- */

  function tarik() {
    if (sedang) { return Promise.resolve(null); }

    if (typeof Simpanan === 'undefined' || !Simpanan.adaKunci || !Simpanan.adaKunci()) {
      pesan('Kode database belum diisi. Isi dulu di panel Anggota.', 'salah');
      return Promise.resolve(null);
    }

    if (!window.confirm(
      'Ambil data media terbaru dari API TokoMedia (Rumahweb)?\n\n' +
      'Data anggota yang berasal dari TokoMedia akan diperbarui (ditambah ' +
      'bila baru, diubah bila berubah). Anggota yang Anda isi sendiri ' +
      'tidak disentuh.\n\n' +
      'Data diambil BACA SAJA — tidak ada yang diubah di server TokoMedia.'
    )) {
      return Promise.resolve(null);
    }

    kunciTombol(true);
    pesan('Mengambil data dari API TokoMedia\u2026');

    return Simpanan.tarikRumahweb()
      .then(function (hasil) {
        if (!hasil || !hasil.ok) {
          throw new Error((hasil && hasil.pesan) || 'Worker tidak menjawab.');
        }
        pesan('Menyimpan ' + hasil.jumlah + ' anggota ke database\u2026');
        return Simpanan.simpanAnggotaBanyak(hasil.anggota).then(function (n) {
          return { jumlah: hasil.jumlah, tersimpan: n, gagal: hasil.gagal || [] };
        });
      })
      .then(function (h) {
        var teks = h.tersimpan + ' anggota tersimpan dari API TokoMedia.';
        if (h.gagal.length) {
          teks += ' ' + h.gagal.length + ' kelompok gagal: ' + h.gagal.join('; ');
        }
        pesan(teks, h.gagal.length ? 'salah' : '');
        if (window.PD_ANGGOTA && PD_ANGGOTA.muat) {
          return PD_ANGGOTA.muat().then(function () {
            if (PD_ANGGOTA.gambarPenanda) { PD_ANGGOTA.gambarPenanda(); }
            return h;
          });
        }
        return h;
      })
      .catch(function (e) {
        pesan('Gagal: ' + (e && e.message ? e.message : e), 'salah');
        return null;
      })
      .then(function (h) {
        kunciTombol(false);
        return h;
      });
  }

  /* ---------- mulai ---------- */

  function mulai() {
    if (!elTombol) { return; }
    elTombol.addEventListener('click', tarik);
  }

  var coba = 0;
  (function ulang() {
    if (typeof Simpanan !== 'undefined' && Simpanan.tarikRumahweb) {
      mulai();
      return;
    }
    if (coba++ < 60) { setTimeout(ulang, 100); }
  })();

  window.PD_TOKOMEDIA = {
    tarik: tarik,
    siap: function () { return !sedang; }
  };
})();
