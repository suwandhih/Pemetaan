/* Pemetaan — anggota / user input data (orderan 17)
   ------------------------------------------------------------------
   Konsep diambil dari `DataPeta` (panel "Member"), lalu disesuaikan:

   · Anggota menempel pada KODE WILAYAH resmi Dukcapil (2.2.2.4 angka),
     bukan pada nama yang diketik bebas. Nama bisa salah tulis atau
     berubah; kode wilayah tidak.
   · Daftar anggota bisa dikelompokkan menurut tingkat pilihan:
     Desa/Kelurahan · Kecamatan · Kabupaten/Kota · Provinsi.
   · Form berupa LEMBAR BAWAH di HP. Di PC (layar ≥ 900 px) form dan
     daftar anggota menjadi kolom di sisi kiri, peta menyusut ke sisa
     lebar sehingga tetap terlihat penuh (orderan 22).
   · Saat wilayah dipilih, jumlah penduduk wilayah itu langsung tampil
     — memakai data Dukcapil dari orderan 16.

   Susunan kolom data wilayah (data/wilayah-warna/*.js):
     a = [no_prop, no_kab, no_kec, no_kel, nama, penduduk, kk, luas, padat]
         0        1        2        3        4      5        6   7     8
   Jumlah kolom kode: provinsi 1 · kabkota 2 · kecamatan 3 · desa 4.
   Jadi nama ada di a[jumlahKolom] dan penduduk di a[jumlahKolom + 1].

   Penyimpanan: js/simpanan.js (IndexedDB). Jalan tanpa internet. */

(function () {
  'use strict';

  var TINGKAT = [
    { id: 'desa', nama: 'Desa/Kelurahan', ikon: '\uD83C\uDFE1', kolom: 4 },
    { id: 'kecamatan', nama: 'Kecamatan', ikon: '\uD83D\uDCCD', kolom: 3 },
    { id: 'kabkota', nama: 'Kabupaten/Kota', ikon: '\uD83C\uDFD9\uFE0F', kolom: 2 },
    { id: 'provinsi', nama: 'Provinsi', ikon: '\uD83D\uDDFA\uFE0F', kolom: 1 }
  ];

  var KUNCI_TINGKAT = 'anggota_tingkat';

  var peta = null;
  var terpasang = false;
  var anggota = [];
  var kategori = [];
  var tingkat = 'kabkota';
  var sedangUbah = null;
  var wilayah = { provinsi: '', kabkota: '', kecamatan: '', desa: '' };
  var lebarKode = [2, 2, 2, 4];

  var elPanel = document.getElementById('panel-anggota');
  var elDaftar = document.getElementById('anggota-daftar');
  var elTingkat = document.getElementById('anggota-tingkat');
  var elForm = document.getElementById('form-anggota');
  var elJumlah = document.getElementById('anggota-jumlah');
  var elSambung = document.getElementById('anggota-sambung');
  var elKunci = document.getElementById('anggota-kunci');
  var elKunciIsian = document.getElementById('anggota-kunci-isian');
  var elKunciSimpan = document.getElementById('anggota-kunci-simpan');
  var elKunciPesan = document.getElementById('anggota-kunci-pesan');
  var elTampil = document.getElementById('anggota-tampil');

  /* Semua lapisan penanda anggota. Dipakai untuk menyembunyikan /
     menampilkan penanda tanpa perlu membuang datanya (orderan lanjutan
     16 Okt 2026). */
  var LAPISAN_PENANDA = [
    'anggota-titik', 'anggota-tumpuk-titik', 'anggota-tumpuk-putus-1',
    'anggota-tumpuk-putus-2', 'anggota-tumpuk', 'anggota-tumpuk-angka',
    'anggota-putus-1', 'anggota-putus-2', 'anggota-putus-3', 'anggota-putus-4',
    'anggota-lingkaran', 'anggota-huruf'
  ];

  var KUNCI_TAMPIL = 'anggota_tampil';
  var penandaTampil = true;

  /* ---------- bantu ---------- */

  function angka(n) {
    return Number(n).toLocaleString('id-ID');
  }

  function kodeDari(d, kolom) {
    var bagian = [];
    for (var i = 0; i < kolom; i++) {
      bagian.push(String(d.a[i]).padStart(lebarKode[i], '0'));
    }
    return bagian.join('.');
  }

  function namaDari(d, kolom) {
    return d.a[kolom];
  }

  function pendudukDari(d, kolom) {
    return {
      jiwa: d.a[kolom + 1],
      kk: d.a[kolom + 2],
      luas: d.a[kolom + 3],
      padat: d.a[kolom + 4]
    };
  }

  /* Daftar data untuk satu tingkat. Kecamatan & desa hanya dimuat sebagian
       (per provinsi / per kabupaten), jadi daftarnya bisa kosong sampai
       berkasnya selesai dimuat — lihat pastikanTingkat(). */
    function daftarTingkat(id) {
      if (id === 'provinsi') { return window.WARNA_PROP || []; }
      if (id === 'kabkota') { return window.WARNA_KAB || []; }
      if (id === 'kecamatan') { return bagianKecamatan(); }
      return bagianDesa();
    }

    /* ---------- pemuatan berkas kecamatan & desa ---------- */

    /* Nama berkas data memakai singkatan: kec-<provinsi>.js dan
       desa-<kabupaten tanpa titik>.js. */
    var AWALAN_BERKAS = { kecamatan: 'kec', desa: 'desa' };
    var KUNCI_DATA = { kecamatan: 'KEC', desa: 'DESA' };

    function kunciTingkat(tingkat, bagian) {
      return 'WARNA_' + KUNCI_DATA[tingkat] + '_' + bagian;
    }

    function sudahDimuat(tingkat, bagian) {
      return !!window[kunciTingkat(tingkat, bagian)];
    }

    function muatTingkat(tingkat, bagian) {
      var kunci = kunciTingkat(tingkat, bagian);
      if (window[kunci]) { return Promise.resolve(window[kunci]); }
      return new Promise(function (selesai, gagal) {
        var s = document.createElement('script');
        s.src = 'data/wilayah-warna/' + AWALAN_BERKAS[tingkat] + '-' + bagian + '.js';
        s.onload = function () {
          /* Berkas menulis ke window.WARNA_<TINGKAT> (nama yang sama untuk
             seluruh bagian). Dipindahkan ke kunci sendiri supaya bagian
             wilayah lain tidak saling menimpa. */
          var d = window['WARNA_' + KUNCI_DATA[tingkat]];
          window[kunci] = d || [];
          selesai(window[kunci]);
        };
        s.onerror = function () {
          window[kunci] = [];
          gagal(new Error('tidak termuat: ' + tingkat + ' ' + bagian));
        };
        document.head.appendChild(s);
      });
    }

    /* Menggabungkan seluruh bagian yang sudah dimuat (bisa lebih dari satu
       bila pemakai berpindah-pindah wilayah). */
    function gabungBagian(tingkat) {
      var awalan = 'WARNA_' + KUNCI_DATA[tingkat] + '_';
      var gabung = [];
      for (var k in window) {
        if (k.indexOf(awalan) !== 0) { continue; }
        if (!Array.isArray(window[k])) { continue; }
        gabung = gabung.concat(window[k]);
      }
      return gabung;
    }

    function bagianKecamatan() { return gabungBagian('kecamatan'); }
    function bagianDesa() { return gabungBagian('desa'); }

    /* Menyiapkan berkas yang diperlukan untuk mengisi tingkat tertentu,
       lalu mengisi pemilihnya. Dipakai saat pemakai memilih wilayah. */
    var SEDANG_MUAT = {};

    function pastikanTingkat(tingkat) {
      if (tingkat !== 'kecamatan' && tingkat !== 'desa') { return Promise.resolve(); }

      var prov = pilihEl('provinsi') ? pilihEl('provinsi').value : '';
      var kab = pilihEl('kabkota') ? pilihEl('kabkota').value : '';
      if (!prov) { return Promise.resolve(); }

      var bagian = tingkat === 'kecamatan'
        ? prov
        : (kab ? kab.replace(/\./g, '') : '');
      if (!bagian) { return Promise.resolve(); }

      var kunci = tingkat + ':' + bagian;
      if (sudahDimuat(tingkat, bagian)) { return Promise.resolve(); }
      if (SEDANG_MUAT[kunci]) { return SEDANG_MUAT[kunci]; }

      SEDANG_MUAT[kunci] = muatTingkat(tingkat, bagian)
        .catch(function () { return null; })
        .then(function () {
          delete SEDANG_MUAT[kunci];
          /* Isi lagi setelah berkas siap — kalau tidak, daftar tetap kosong. */
          isiTurunan(tingkat === 'kecamatan' ? 'kabkota' : 'kecamatan');
          bacaWilayah();
          /* Orderan 18: berkas kecamatan/desa baru selesai dimuat — peta
             baru sekarang bisa terbang ke wilayah itu & menggambar garisnya. */
          terbangKeTerdalam();
          sorotWilayahTerdalam();
        });
      return SEDANG_MUAT[kunci];
    }

    /* Memberi tahu pemakai bahwa daftar sedang dimuat / tidak tersedia.
       Tanpa ini pemilih kosong terlihat seperti kerusakan. */
    function catatPemuatan(tingkat, pesan) {
      var p = pilihEl(tingkat);
      if (!p || !pesan) { return; }
      p.innerHTML = '<option value="">' + pesan + '</option>';
    }

  function kolomTingkat(id) {
    for (var i = 0; i < TINGKAT.length; i++) {
      if (TINGKAT[i].id === id) { return TINGKAT[i].kolom; }
    }
    return 1;
  }

  function kodeUntukTingkat(a, id) {
    var kolom = kolomTingkat(id);
    if (id === 'provinsi') { return a.kodeProvinsi || ''; }
    if (id === 'kabkota') { return a.kodeKabkota || ''; }
    if (id === 'kecamatan') { return a.kodeKecamatan || ''; }
    return a.kodeDesa || '';
  }

  function namaWilayah(a, id) {
    if (id === 'provinsi') { return a.provinsi || 'Provinsi belum tercatat'; }
    if (id === 'kabkota') { return a.kabkota || 'Kabupaten/kota belum tercatat'; }
    if (id === 'kecamatan') {
      return (a.kecamatan || 'Kecamatan belum tercatat') +
        (a.kabkota ? ' \u00B7 ' + a.kabkota : '');
    }
    return (a.desa || 'Desa belum tercatat') +
      (a.kecamatan ? ' \u00B7 ' + a.kecamatan : '');
  }

  /* ---------- memuat data ---------- */

  function muat() {
    return Promise.all([
      Simpanan.semuaAnggota(),
      Simpanan.semuaKategori()
    ]).then(function (hasil) {
      anggota = hasil[0] || [];
      kategori = hasil[1] || [];
      gambarTingkat();
      gambarDaftar();
      isiPilihKategori();
        gambarSambung('tersambung');
      }).catch(function (e) {
        gambarSambung('luring', e && e.message);
        throw e;
      });
    }

    /* Penanda keadaan sambungan (orderan 7). Dipakai supaya pemakai tahu
       datanya sudah masuk database bersama atau masih ditahan di HP. */
    function gambarSambung(keadaan, pesan) {
      if (!elSambung) { return; }
      elSambung.className = keadaan;
      var k = (Simpanan.keadaan ? Simpanan.keadaan() : { menunggu: 0, punyaKunci: true });

      if (keadaan !== 'mati' && !k.punyaKunci) {
        elSambung.textContent = 'Belum tersambung \u2014 kode database belum diisi';
        elSambung.className = 'luring';
        if (elKunci) { elKunci.hidden = false; }
        return;
      }
      if (elKunci) { elKunci.hidden = true; }

      if (keadaan === 'mati') {
        elSambung.textContent = 'Penyimpanan hanya di perangkat ini';
        return;
      }
      if (keadaan === 'tersambung') {
        elSambung.textContent = k.menunggu
          ? 'Tersambung \u00B7 ' + k.menunggu + ' perubahan belum terkirim'
          : 'Tersambung \u2014 data sama di HP dan PC';
        if (k.menunggu) { elSambung.className = 'penyambung'; }
        return;
      }
      elSambung.textContent = 'Sedang luring \u2014 data ditahan di perangkat ini' +
        (pesan ? ' (' + pesan + ')' : '');
    }

    /* ---------- kode database (sekali per perangkat) ---------- */

    function siapkanKunci() {
      if (!elKunciSimpan) { return; }
      elKunciSimpan.addEventListener('click', function () {
        var isi = (elKunciIsian.value || '').trim();
        if (isi.length < 6) {
          elKunciPesan.hidden = false;
          elKunciPesan.textContent = 'Kode terlalu pendek. Periksa lagi.';
          return;
        }
        elKunciSimpan.disabled = true;
        elKunciPesan.hidden = false;
        elKunciPesan.textContent = 'Sedang menyambung\u2026';
        Simpanan.simpanKunci(isi).then(function (h) {
          elKunciPesan.textContent = 'Tersambung. ' + h.jumlah + ' anggota di database.';
          elKunciIsian.value = '';
          return muat();
        }).then(function () {
          return Simpanan.cobaSambungUlang();
        }).then(function () {
          gambarPenanda();
          elKunciSimpan.disabled = false;
        }).catch(function (e) {
          elKunciPesan.textContent = 'Gagal: ' + (e && e.message ? e.message : e);
          elKunciSimpan.disabled = false;
          Simpanan.lupakanKunci();
        });
      });
    }

  /* ---------- panel ---------- */

  function gambarTingkat() {
    if (!elTingkat) { return; }
    elTingkat.innerHTML = '';
    TINGKAT.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'anggota-tingkat-tombol' + (t.id === tingkat ? ' nyala' : '');
            b.dataset.kelompok = t.id;
      b.textContent = t.ikon + ' ' + t.nama;
      b.addEventListener('click', function () {
        tingkat = t.id;
        Simpanan.simpanAtur(KUNCI_TINGKAT, tingkat);
        gambarTingkat();
        gambarDaftar();
      });
      elTingkat.appendChild(b);
    });
  }

  function gambarDaftar() {
    if (!elDaftar) { return; }
    elDaftar.innerHTML = '';

      var kunci = Simpanan.keadaan ? Simpanan.keadaan() : { punyaKunci: true, menyala: false };
      if (kunci.menyala && !kunci.punyaKunci) {
        if (elJumlah) { elJumlah.textContent = ''; }
        elDaftar.innerHTML = '<p class="anggota-kosong">Setelah <b>kode database</b> ' +
          'diisi di atas, daftar anggota akan dimuat dari database \u2014 isinya ' +
          'sama dengan yang di PC atau HP lain.</p>';
        return;
      }

    var punya = anggota.filter(function (a) { return kodeUntukTingkat(a, tingkat); }).length;
    if (elJumlah) {
      elJumlah.textContent = punya === anggota.length
        ? anggota.length + ' anggota'
        : punya + ' dari ' + anggota.length + ' anggota';
    }

    if (!anggota.length) {
      elDaftar.innerHTML = '<p class="anggota-kosong">Belum ada anggota. ' +
        'Ketuk <b>+ Anggota</b> untuk menambah.</p>';
      return;
    }

    var grup = new Map();
    anggota.forEach(function (a) {
      var k = kodeUntukTingkat(a, tingkat) || '__tanpa__';
      if (!grup.has(k)) { grup.set(k, []); }
      grup.get(k).push(a);
    });

    Array.from(grup.keys())
      .sort(function (x, y) {
        var n1 = x === '__tanpa__' ? '\uFFFF' : namaWilayah(grup.get(x)[0], tingkat);
        var n2 = y === '__tanpa__' ? '\uFFFF' : namaWilayah(grup.get(y)[0], tingkat);
        return n1.localeCompare(n2, 'id');
      })
      .forEach(function (k) {
        var isi = grup.get(k).slice().sort(function (a, b) {
          return (a.nama || '').localeCompare(b.nama || '', 'id');
        });

        var kotak = document.createElement('div');
        kotak.className = 'anggota-grup';

        var judul = document.createElement('div');
        judul.className = 'anggota-grup-judul';
        judul.innerHTML =
          '<span class="anggota-grup-pin">\u25CF</span>' +
          '<span class="anggota-grup-nama"></span>' +
          '<span class="anggota-grup-jumlah">' + isi.length + '</span>';
        judul.querySelector('.anggota-grup-nama').textContent =
          k === '__tanpa__' ? 'Wilayah belum tercatat' : namaWilayah(isi[0], tingkat);

        /* Tombol [+][✎][−] di tingkat wilayah — satu wilayah boleh punya
           banyak anggota. Ini pola yang sama dengan DataPeta. */
        var aksi = document.createElement('div');
        aksi.className = 'anggota-aksi';
        aksi.appendChild(tombolKecil('+', 'Tambah anggota di wilayah ini', function () {
          bukaForm(null, isi[0]);
        }));
        aksi.appendChild(tombolKecil('\u270E', 'Ubah anggota di wilayah ini', function () {
          pilihDulu(isi, 'ubah');
        }));
        aksi.appendChild(tombolKecil('\u2212', 'Hapus anggota di wilayah ini', function () {
          pilihDulu(isi, 'hapus');
        }));
        judul.appendChild(aksi);
        kotak.appendChild(judul);

        var isiKotak = document.createElement('div');
        isiKotak.className = 'anggota-grup-isi';
        isi.forEach(function (a) {
          var baris = document.createElement('div');
          baris.className = 'anggota-baris';
          baris.title = 'Pindah peta ke ' + a.nama;
          baris.innerHTML =
            '<span class="anggota-warna"></span>' +
            '<div class="anggota-isi">' +
              '<div class="anggota-nama"></div>' +
              '<div class="anggota-ket"></div>' +
            '</div>';
          baris.querySelector('.anggota-warna').style.background = warnaKategori(a.kategori);
          baris.querySelector('.anggota-nama').textContent = '- ' + (a.nama || '(tanpa nama)');
          baris.querySelector('.anggota-ket').textContent =
            (a.kategori || '\u2014') + (a.inisial ? ' \u00B7 ' + a.inisial : '');
          baris.addEventListener('click', function () { keAnggota(a); });
          isiKotak.appendChild(baris);
        });
        kotak.appendChild(isiKotak);
        elDaftar.appendChild(kotak);
      });
  }

  function tombolKecil(teks, judul, kerja) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'anggota-aksi-tombol';
    b.textContent = teks;
    b.title = judul;
    b.setAttribute('aria-label', judul);
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      kerja();
    });
    return b;
  }

  var WARNA_KATEGORI = ['#58a6ff', '#f2a65a', '#63c2de', '#e8563f',
    '#c9e8b0', '#a78bfa', '#ffe08a', '#34d399'];

  function warnaKategori(nama) {
    if (!nama) { return '#8b949e'; }
    var n = 0;
    for (var i = 0; i < nama.length; i++) { n = (n * 31 + nama.charCodeAt(i)) % 9973; }
    return WARNA_KATEGORI[n % WARNA_KATEGORI.length];
  }

  function pilihDulu(isi, cara) {
    if (isi.length === 1) {
      if (cara === 'ubah') { bukaForm(isi[0].id); }
      else { hapusAnggota(isi[0].id); }
      return;
    }
    var teks = isi.map(function (a, i) { return (i + 1) + '. ' + a.nama; }).join('\n');
    var jawab = prompt('Pilih nomor anggota yang mau di' +
      (cara === 'ubah' ? 'ubah' : 'hapus') + ':\n\n' + teks);
    var no = parseInt(jawab, 10);
    if (!(no >= 1 && no <= isi.length)) { return; }
    if (cara === 'ubah') { bukaForm(isi[no - 1].id); }
    else { hapusAnggota(isi[no - 1].id); }
  }

  function keAnggota(a) {
    if (peta && typeof a.lon === 'number' && typeof a.lat === 'number') {
      peta.flyTo({
        center: [a.lon, a.lat],
        zoom: Math.max(peta.getZoom(), 12),
        duration: 900
      });
    }
    tutupPanel();
  }

  /* ---------- pemilih wilayah ---------- */

  var elFNama, elFInisial, elFKategori, elFRincian, elFWilayah;
  var elFJudul, elFTingkat, elFPratinjau, elFHapus, elFPenduduk;
  var elFPin = null, elFPinTengah = null;
  var elPendudukForm = null;

  function siapkanForm() {
    elFNama = document.getElementById('fa-nama');
      elFInisial = document.getElementById('fa-inisial');
      elFKategori = document.getElementById('fa-kategori');
      elFRincian = document.getElementById('fa-rincian');
      elFWilayah = document.getElementById('fa-wilayah');
      elFJudul = document.getElementById('fa-judul');
      elFTingkat = document.getElementById('fa-tingkat-wilayah');
      elFPratinjau = document.getElementById('fa-pratinjau');
      elFHapus = document.getElementById('fa-hapus');
      elPendudukForm = document.getElementById('fa-penduduk');
      elFPenduduk = elPendudukForm;
      elFPin = document.getElementById('fa-pin');
      elFPinTengah = document.getElementById('fa-pin-tengah');
      if (elFPinTengah) {
        elFPinTengah.addEventListener('click', pinKeTitikTengah);
      }

      document.getElementById('fa-tutup').addEventListener('click', tutupForm);
    document.getElementById('fa-batal').addEventListener('click', tutupForm);
    document.getElementById('fa-simpan').addEventListener('click', simpanForm);
    elFHapus.addEventListener('click', function () {
      if (sedangUbah) { hapusAnggota(sedangUbah); }
    });
  }

  function isiPilihKategori() {
    if (!elFKategori) { return; }
    var lama = elFKategori.value;
    elFKategori.innerHTML = '';
    kategori.slice().sort(function (a, b) {
      return a.localeCompare(b, 'id');
    }).forEach(function (k) {
      var o = document.createElement('option');
      o.value = k;
      o.textContent = k;
      elFKategori.appendChild(o);
    });
    if (lama && kategori.indexOf(lama) >= 0) { elFKategori.value = lama; }
    gambarKategoriAtur();
  }

  /* ---------- kelola kategori (tambah / edit / del tanpa popup) ---------- */

  var elKatPanel = null;
  var elKatDaftar = null;
  var elKatBaru = null;
  var elKatPesan = null;
  var elKatTombol = null;
  var elKatTambah = null;
  var elKatUbah = null;
  var elKatHapus = null;
  var katTerpilih = null;

  function siapkanKategori() {
    elKatPanel = document.getElementById('anggota-kategori-panel');
    elKatDaftar = document.getElementById('kat-daftar');
    elKatBaru = document.getElementById('kat-baru');
    elKatPesan = document.getElementById('kat-pesan');
    elKatTombol = document.getElementById('anggota-kat-tombol');
    elKatTambah = document.getElementById('kat-tambah');
    elKatUbah = document.getElementById('kat-ubah');
    elKatHapus = document.getElementById('kat-hapus');
    var elKatTutup = document.getElementById('anggota-kat-tutup');
    var elFaKelola = document.getElementById('fa-kat-kelola');

    if (!elKatPanel) { return; }

    if (elKatTombol) {
      elKatTombol.addEventListener('click', function () {
        bukaModeKategori(elKatPanel.hidden);
      });
    }

    if (elFaKelola) {
      elFaKelola.addEventListener('click', function () {
        /* Tutup form + Anggota agar tidak mengganggu di latar belakang,
           lalu buka layar kerja Kategori yang bersih. */
        tutupForm();
        bukaPanel();
        bukaModeKategori(true);
      });
    }

    if (elKatTutup) {
      elKatTutup.addEventListener('click', function () {
        bukaModeKategori(false);
      });
    }

    if (elKatTambah) {
      elKatTambah.addEventListener('click', tambahKategori);
    }
    if (elKatUbah) {
      elKatUbah.addEventListener('click', ubahKategori);
    }
    if (elKatHapus) {
      elKatHapus.addEventListener('click', hapusKategori);
    }
    if (elKatBaru) {
      elKatBaru.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (katTerpilih) { ubahKategori(); } else { tambahKategori(); }
        } else if (e.key === 'Escape') {
          pilihKategori(null);
        }
      });
      elKatBaru.addEventListener('input', function () {
        /* Jika kotak dikosongkan manual saat mode edit, kembalikan ke + Tambah. */
        if (katTerpilih && elKatBaru.value.trim() === '') {
          pilihKategori(null);
        }
      });
    }
  }

  function bukaModeKategori(nyala) {
    if (!elKatPanel || !elPanel) { return; }
    var elJudul = document.getElementById('anggota-judul');
    elKatPanel.hidden = !nyala;
    elPanel.classList.toggle('mode-kategori', nyala);
    if (elKatTombol) {
      elKatTombol.classList.toggle('nyala', nyala);
      elKatTombol.textContent = nyala ? '\u2190 Anggota' : 'Kategori';
    }
    if (elJudul) { elJudul.textContent = nyala ? 'Kategori' : 'Anggota'; }
    pilihKategori(null);
    pesanKategori('');
    gambarKategoriAtur();
  }

  function pilihKategori(kat) {
    katTerpilih = kat || null;
    if (elKatBaru) {
      elKatBaru.value = katTerpilih ? katTerpilih : '';
      elKatBaru.placeholder = katTerpilih ? 'Ubah nama kategori…' : 'Nama kategori baru…';
    }
    if (elKatTambah) { elKatTambah.hidden = !!katTerpilih; }
    if (elKatUbah) { elKatUbah.hidden = !katTerpilih; }
    if (elKatHapus) { elKatHapus.hidden = !katTerpilih; }
    pesanKategori('');
    gambarKategoriAtur();
  }

  function pesanKategori(teks) {
    if (!elKatPesan) { return; }
    elKatPesan.textContent = teks || '';
    elKatPesan.hidden = !teks;
  }

  function gambarKategoriAtur() {
    if (!elKatDaftar) { return; }
    elKatDaftar.innerHTML = '';
    kategori.slice().sort(function (a, b) {
      return a.localeCompare(b, 'id');
    }).forEach(function (kat) {
      var tombol = document.createElement('button');
      tombol.type = 'button';
      tombol.className = 'kat-baris' + (kat === katTerpilih ? ' dipilih' : '');
      tombol.title = 'Klik untuk memilih "' + kat + '" (Edit / Del)';

      var titik = document.createElement('span');
      titik.className = 'kat-warna';
      titik.style.background = warnaKategori(kat);

      var teks = document.createElement('span');
      teks.className = 'kat-nama-teks';
      teks.textContent = kat;

      tombol.appendChild(titik);
      tombol.appendChild(teks);
      tombol.addEventListener('click', function () {
        if (katTerpilih === kat) {
          pilihKategori(null);
        } else {
          pilihKategori(kat);
          if (elKatBaru) { elKatBaru.focus(); }
        }
      });
      elKatDaftar.appendChild(tombol);
    });
  }

  function tambahKategori() {
    if (!elKatBaru) { return; }
    var nama = elKatBaru.value.trim();
    if (!nama) {
      pesanKategori('Nama kategori belum diisi.');
      elKatBaru.focus();
      return;
    }
    var sudahAda = kategori.some(function (k) {
      return k.toLowerCase() === nama.toLowerCase();
    });
    if (sudahAda) {
      pesanKategori('Kategori "' + nama + '" sudah ada.');
      return;
    }
    pilihKategori(null);
    Simpanan.simpanKategori(nama).then(function () {
      return muat();
    }).then(function () {
      if (elFKategori) { elFKategori.value = nama; }
    });
  }

  function ubahKategori() {
    if (!katTerpilih || !elKatBaru) { return; }
    var lama = katTerpilih;
    var baru = elKatBaru.value.trim();
    if (!baru) {
      pesanKategori('Nama kategori tidak boleh kosong.');
      elKatBaru.focus();
      return;
    }
    if (baru === lama) {
      pilihKategori(null);
      return;
    }
    var bentrok = kategori.some(function (k) {
      return k !== lama && k.toLowerCase() === baru.toLowerCase();
    });
    if (bentrok) {
      pesanKategori('Kategori "' + baru + '" sudah ada.');
      return;
    }
    pilihKategori(null);
    var pakai = anggota.filter(function (a) { return a.kategori === lama; });
    Simpanan.simpanKategori(baru).then(function () {
      return Promise.all(pakai.map(function (a) {
        var salin = {};
        for (var k in a) { if (Object.prototype.hasOwnProperty.call(a, k)) { salin[k] = a[k]; } }
        salin.kategori = baru;
        salin.diubah = new Date().toISOString();
        return Simpanan.simpanAnggota(salin);
      }));
    }).then(function () {
      return Simpanan.hapusKategori(lama);
    }).then(function () {
      return muat();
    }).then(function () {
      if (elFKategori && elFKategori.value === lama) { elFKategori.value = baru; }
      gambarPenanda();
    });
  }

  function hapusKategori() {
    if (!katTerpilih) { return; }
    var kat = katTerpilih;
    var jumlahPakai = anggota.filter(function (a) { return a.kategori === kat; }).length;
    if (jumlahPakai > 0) {
      pesanKategori('Tidak bisa dihapus \u2014 masih dipakai ' + jumlahPakai +
        ' anggota. Ubah dulu kategori anggotanya.');
      return;
    }
    pilihKategori(null);
    Simpanan.hapusKategori(kat).then(function () {
      return muat();
    });
  }

  var LABEL = {
    provinsi: 'Provinsi',
    kabkota: 'Kabupaten/Kota',
    kecamatan: 'Kecamatan',
    desa: 'Desa/Kelurahan'
  };

  /* Pemilih 4 tingkat. Pilihan tingkat bawah disaring oleh tingkat atasnya,
     jadi tidak perlu menelusuri seluruh Indonesia. */
  function bangunPemilih() {
    if (!elFTingkat) { return; }
    elFTingkat.innerHTML = '';

    ['provinsi', 'kabkota', 'kecamatan', 'desa'].forEach(function (t) {
      var baris = document.createElement('div');
      baris.className = 'fa-wilayah-baris';
      var lab = document.createElement('label');
      lab.className = 'fa-label';
      lab.textContent = LABEL[t];
      var pilih = document.createElement('select');
      pilih.className = 'fa-pilih';
      pilih.dataset.tingkat = t;
      pilih.addEventListener('change', function () {
        isiTurunan(t);
        bacaWilayah();
      });
      baris.appendChild(lab);
      baris.appendChild(pilih);
      elFTingkat.appendChild(baris);
    });

    var p = elFTingkat.querySelector('[data-tingkat="provinsi"]');
    isiPilih(p, daftarTingkat('provinsi'), 1);
  }

  function pilihEl(t) {
    return elFTingkat.querySelector('[data-tingkat="' + t + '"]');
  }

  function isiPilih(pilih, daftar, kolom) {
    if (!pilih) { return; }
    var lama = pilih.value;
    pilih.innerHTML = '<option value="">\u2014 pilih \u2014</option>';
      /* Diurutkan menurut nama supaya mudah dicari — urutan asli data Dukcapil
         tidak beraturan (ACEH, SUMATERA UTARA, RIAU, …). */
      var urut = daftar.slice().sort(function (a, b) {
        return String(namaDari(a, kolom)).localeCompare(String(namaDari(b, kolom)), 'id');
      });
      urut.forEach(function (d) {
        var o = document.createElement('option');
        o.value = kodeDari(d, kolom);
        o.textContent = namaDari(d, kolom);
        pilih.appendChild(o);
      });
      if (lama) { pilih.value = lama; }
    }

  /* Mengisi tingkat di bawah tingkat yang baru diubah. */
  function isiTurunan(t) {
    var nilaiProv = pilihEl('provinsi') ? pilihEl('provinsi').value : '';
    var nilaiKab = pilihEl('kabkota') ? pilihEl('kabkota').value : '';

    if (t === 'provinsi') {
      isiPilih(pilihEl('kabkota'), daftarTingkat('kabkota').filter(function (d) {
        return kodeDari(d, 1) === nilaiProv;
      }), 2);
      isiPilih(pilihEl('kecamatan'), [], 3);
      isiPilih(pilihEl('desa'), [], 4);
        /* Daftar kecamatan belum ada di perangkat ini — ambil berkasnya. */
        if (nilaiProv) {
          catatPemuatan('kecamatan', '\u2014 memuat daftar kecamatan\u2026 \u2014');
          pastikanTingkat('kecamatan');
        }
        return;
      }

      if (t === 'kabkota') {
        /* Kecamatan dipecah per provinsi. Bila berkasnya belum dimuat,
           pemilih diberi keterangan lalu diisi sendiri begitu selesai. */
        if (!sudahDimuat('kecamatan', nilaiProv)) {
          catatPemuatan('kecamatan', '\u2014 memuat daftar kecamatan\u2026 \u2014');
          isiPilih(pilihEl('desa'), [], 4);
          pastikanTingkat('kecamatan');
          return;
        }
        isiPilih(pilihEl('kecamatan'), daftarTingkat('kecamatan').filter(function (d) {
          return kodeDari(d, 2) === nilaiKab;
        }), 3);
        isiPilih(pilihEl('desa'), [], 4);
        return;
      }

      if (t === 'kecamatan') {
        var nilaiKec = pilihEl('kecamatan') ? pilihEl('kecamatan').value : '';
        /* Desa dipecah per kabupaten/kota — bagiannya kode kabupaten tanpa titik. */
        var kab = nilaiKab ? nilaiKab.replace(/\./g, '') : '';
        if (kab && !sudahDimuat('desa', kab)) {
          catatPemuatan('desa', '\u2014 memuat daftar desa\u2026 \u2014');
          pastikanTingkat('desa');
          return;
        }
        isiPilih(pilihEl('desa'), daftarTingkat('desa').filter(function (d) {
          return kodeDari(d, 3) === nilaiKec;
        }), 4);
      }
    }

  function bacaWilayah() {
    wilayah = {
      provinsi: pilihEl('provinsi') ? pilihEl('provinsi').value : '',
      kabkota: pilihEl('kabkota') ? pilihEl('kabkota').value : '',
      kecamatan: pilihEl('kecamatan') ? pilihEl('kecamatan').value : '',
      desa: pilihEl('desa') ? pilihEl('desa').value : ''
    };
    var nama = [];
    ['provinsi', 'kabkota', 'kecamatan', 'desa'].forEach(function (t) {
      if (!wilayah[t]) { return; }
      var opt = pilihEl(t).options[pilihEl(t).selectedIndex];
      nama.push(opt ? opt.textContent : wilayah[t]);
    });
    elFWilayah.value = nama.join(' \u203A ');
    tampilkanPenduduk();
    /* Orderan 18: peta mengikuti wilayah yang dipilih + garis kelilingnya.
       Pin dikembalikan ke titik tengah wilayah baru — kecuali saat mengubah
       anggota lama, yang titiknya sudah ditentukan sendiri oleh user. */
    terbangKeTerdalam();
    sorotWilayahTerdalam();
    if (!sedangUbah) { pinKeTitikTengah(); }
  }

  /* Jumlah penduduk wilayah terpilih — data Dukcapil (orderan 16).
     Sumbernya selalu ditulis, tidak dikarang. */
  function tampilkanPenduduk() {
    if (!elPendudukForm) { return; }
    var dipakai = null;
    ['desa', 'kecamatan', 'kabkota', 'provinsi'].forEach(function (t) {
      if (!dipakai && wilayah[t]) { dipakai = t; }
    });
    if (!dipakai) { elPendudukForm.hidden = true; return; }

    var kolom = kolomTingkat(dipakai);
    var d = cariDariKode(daftarTingkat(dipakai), wilayah[dipakai], kolom);
    elPendudukForm.hidden = false;
    if (!d) {
      elPendudukForm.textContent = 'Jumlah penduduk wilayah ini belum dimuat ' +
        'di peramban. Buka peta tematik tingkat ini dulu, lalu coba lagi. ' +
        '(Sumber: Dukcapil Kemendagri)';
      return;
    }
    var p = pendudukDari(d, kolom);
    var padat = p.padat;
    var luas = luasWilayah(d);
    /* Sebagian wilayah tidak diisi kolom kepadatan oleh Dukcapil. Dihitung
       sendiri dari jiwa ÷ luas, dan itu dinyatakan sebagai hitungan sendiri
       (aturan: jangan mengarang angka). */
    if (!(padat > 0) && p.jiwa > 0 && luas > 0) { padat = p.jiwa / luas; }
    elPendudukForm.innerHTML =
      LABEL[dipakai] + ' ini berpenduduk <strong>' + angka(p.jiwa) + ' jiwa</strong>' +
      ' \u00B7 KK ' + angka(p.kk) +
      ' \u00B7 luas ' + (luas > 0 ? angka(Math.round(luas)) + ' km\u00B2' : '\u2014') +
      ' \u00B7 kepadatan ' + (padat ? angka(Math.round(padat)) : '\u2014') +
      ' jiwa/km\u00B2 <span style="opacity:.7">(Dukcapil Kemendagri)</span>';
      }

  function cariDariKode(daftar, kode, kolom) {
    if (!daftar || !kode) { return null; }
    for (var i = 0; i < daftar.length; i++) {
      if (kodeDari(daftar[i], kolom) === kode) { return daftar[i]; }
    }
    return null;
  }

  /* Luas dihitung dari batas poligon, bukan dari kolom Dukcapil — kolom itu
     salah satuan pada 33 dari 514 kabupaten/kota (diukur 16 Okt 2026). */
  function luasWilayah(d) {
    if (typeof PD !== 'undefined' && PD.luasKm2) { return PD.luasKm2(d.g); }
    return 0;
  }

  /* Mengisi pilihan dari titik tengah peta — supaya tidak perlu menelusuri
     seluruh Indonesia hanya untuk menambah satu anggota.
     Diukur 17 Okt 2026: pada zoom awal seluruh Indonesia terlihat, sehingga
     hampir semua provinsi bersentuhan dengan layar dan yang terpilih adalah
     provinsi pertama dalam daftar (KEPULAUAN BANGKA BELITUNG) — bukan yang
     sedang dilihat pemakai. Karena itu sekarang dipilih provinsi yang
     TITIK TENGAHNYA paling dekat dengan titik tengah peta. */
  function isiDariPeta() {
    if (!peta || typeof PD === 'undefined') { return; }
    var daftar = daftarTingkat('provinsi');
    var c = peta.getCenter();
    var kodeProv = null;
    var jarakTerdekat = Infinity;
    for (var i = 0; i < daftar.length; i++) {
      var k = kotakDari(daftar[i].g);
      if (!k) { continue; }
      var dx = (k[0] + k[2]) / 2 - c.lng;
      var dy = (k[1] + k[3]) / 2 - c.lat;
      var j = dx * dx + dy * dy;
      if (j < jarakTerdekat) { jarakTerdekat = j; kodeProv = kodeDari(daftar[i], 1); }
    }
    if (!kodeProv) { return; }
    var p = pilihEl('provinsi');
    if (!p) { return; }
    p.value = kodeProv;
    isiTurunan('provinsi');
    bacaWilayah();
  }

  function kotakDari(g) {
    var k = [Infinity, Infinity, -Infinity, -Infinity];
    (function telusur(x) {
      if (!x || !x.length) { return; }
      if (typeof x[0] === 'number') {
        if (x[0] < k[0]) { k[0] = x[0]; }
        if (x[1] < k[1]) { k[1] = x[1]; }
        if (x[0] > k[2]) { k[2] = x[0]; }
        if (x[1] > k[3]) { k[3] = x[1]; }
        return;
      }
      for (var i = 0; i < x.length; i++) { telusur(x[i]); }
    })(g);
    return k[0] === Infinity ? null : k;
  }

  /* ---------- Orderan 18: peta mengikuti pilihan wilayah ---------- */

  /* Lapisan garis merah berkeliling wilayah terpilih + kedipan (blinking).
     Lapisan ini milik modul anggota, terpisah dari peta tematik penduduk,
     jadi tetap muncul walau peta tematik sedang mati. */
  var LAPISAN_SOROT = 'anggota-sorot-wilayah';
  var SUMBER_SOROT = 'anggota-sorot';
  var kedipJalan = false;

  function siapkanLapisanSorot() {
    if (!peta || peta.getSource(SUMBER_SOROT)) { return; }
    peta.addSource(SUMBER_SOROT, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    });
    peta.addLayer({
      id: LAPISAN_SOROT,
      type: 'line',
      source: SUMBER_SOROT,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#ff3b30',
        'line-width': 1.8,
        'line-opacity': 1
      }
    });
  }

  /* Kedipan: opacity 1,0 ↔ 0,35 tiap 700 ms. Dijalankan hanya selama ada
     wilayah yang disorot, supaya tidak membebani peramban tanpa guna. */
  function mulaiKedip() {
    if (kedipJalan) { return; }
    kedipJalan = true;
    var nyala = true;
    (function langkah() {
      if (!kedipJalan) { return; }
      if (peta && peta.getLayer(LAPISAN_SOROT)) {
        peta.setPaintProperty(LAPISAN_SOROT, 'line-opacity', nyala ? 1 : 0.35);
      }
      nyala = !nyala;
      setTimeout(langkah, 700);
    })();
  }

  function hentikanKedip() {
    kedipJalan = false;
    if (peta && peta.getLayer(LAPISAN_SOROT)) {
      peta.setPaintProperty(LAPISAN_SOROT, 'line-opacity', 1);
    }
  }

  /* Menggambar garis keliling wilayah terpilih. `daftar` & `kode` menentukan
     wilayah mana; `null` menghapus garisnya. */
  function gambarSorot(daftar, kode, kolom) {
    if (!peta) { return; }
    siapkanLapisanSorot();
    if (!peta.getSource(SUMBER_SOROT)) { return; }

    var fitur = [];
    if (daftar && kode) {
      for (var i = 0; i < daftar.length; i++) {
        if (kodeDari(daftar[i], kolom) !== kode) { continue; }
        fitur.push({
          type: 'Feature',
          properties: {},
          geometry: { type: 'MultiPolygon', coordinates: jadiMulti(daftar[i].g) }
        });
        break;
      }
    }
    peta.getSource(SUMBER_SOROT).setData({ type: 'FeatureCollection', features: fitur });
    if (fitur.length) { mulaiKedip(); } else { hentikanKedip(); }
  }

  /* Bentuk koordinat Dukcapil ada dua: Polygon (satu cincin) dan MultiPolygon.
     Keduanya dijadikan MultiPolygon supaya seragam. */
  function jadiMulti(g) {
    if (!g || !g.length) { return []; }
    var pertama = g[0];
    if (pertama && pertama.length && typeof pertama[0][0] === 'number') {
      return [g];
    }
    return g;
  }

  /* Garis keliling untuk tingkat terdalam yang sudah dipilih. */
  function sorotWilayahTerdalam() {
    var urut = ['desa', 'kecamatan', 'kabkota', 'provinsi'];
    for (var i = 0; i < urut.length; i++) {
      var t = urut[i];
      if (!wilayah[t]) { continue; }
      var daftar = daftarTingkat(t);
      var kolom = kolomTingkat(t);
      for (var j = 0; j < daftar.length; j++) {
        if (kodeDari(daftar[j], kolom) === wilayah[t]) {
          gambarSorot(daftar, wilayah[t], kolom);
          return true;
        }
      }
    }
    gambarSorot(null, null, 0);
    return false;
  }

  /* Peta terbang ke batas wilayah yang baru dipilih. Batasnya diambil dari
     poligon resmi Dukcapil yang sudah ada di proyek — tidak ada data baru. */
  function terbangKe(daftar, kode, kolom) {
    if (!peta || !daftar || !kode) { return false; }
    var d = null;
    for (var i = 0; i < daftar.length; i++) {
      if (kodeDari(daftar[i], kolom) === kode) { d = daftar[i]; break; }
    }
    if (!d || !d.g) { return false; }
    var k = kotakDari(d.g);
    if (!k) { return false; }

    /* Kotak batas wilayah bisa sangat sempit (desa) atau sangat lebar
       (provinsi kepulauan). Diberi sedikit ruang supaya tidak mepet. */
    var lngTepi = Math.max((k[2] - k[0]) * 0.06, 0.004);
    var latTepi = Math.max((k[3] - k[1]) * 0.06, 0.004);

    peta.fitBounds(
      [[k[0] - lngTepi, k[1] - latTepi], [k[2] + lngTepi, k[3] + latTepi]],
      { padding: 0, duration: 700, maxZoom: 15 }
    );
    return true;
  }

  /* Batas wilayah untuk satu tingkat, memakai daftar yang sudah dimuat.
     Kecamatan & desa hanya tersedia setelah berkasnya selesai dimuat —
     kalau belum, kembalikan false supaya pemanggil bisa mencoba lagi. */
  function terbangKeWilayah(tingkat) {
    var kode = wilayah[tingkat];
    if (!kode) { return false; }
    return terbangKe(daftarTingkat(tingkat), kode, kolomTingkat(tingkat));
  }

  /* Tingkat terdalam yang sudah dipilih — itulah yang dipakai sebagai
     sasaran peta. Kalau desa sudah dipilih, peta tidak perlu kembali ke
     provinsi. */
  function terbangKeTerdalam() {
    var urut = ['desa', 'kecamatan', 'kabkota', 'provinsi'];
    for (var i = 0; i < urut.length; i++) {
      if (wilayah[urut[i]] && terbangKeWilayah(urut[i])) { return true; }
    }
    return false;
  }

  /* ---------- buka / tutup form ---------- */

  function bukaForm(id, contohDariWilayah) {
    sedangUbah = id || null;
    var a = null;
    for (var i = 0; i < anggota.length; i++) {
      if (anggota[i].id === id) { a = anggota[i]; }
    }

    elFJudul.textContent = a ? 'Ubah Anggota' : 'Tambah Anggota';
    elFNama.value = a ? (a.nama || '') : '';
    elFInisial.value = a ? (a.inisial || '') : '';
    elFRincian.value = a && a.rincian
      ? a.rincian.map(function (r) { return r.label + ' = ' + r.nilai; }).join('\n')
      : '';
    isiPilihKategori();
    if (a && a.kategori && kategori.indexOf(a.kategori) >= 0) {
      elFKategori.value = a.kategori;
    }
    elFHapus.hidden = !a;

    /* Wilayah & titik dikunci bila mengubah anggota lama atau menambah dari
       baris wilayah — sama seperti DataPeta. Yang bisa diubah: nama,
       kategori, inisial, keterangan. */
    var kunci = !!a || !!contohDariWilayah;
    ['provinsi', 'kabkota', 'kecamatan', 'desa'].forEach(function (t) {
      var p = pilihEl(t);
      if (p) { p.disabled = kunci; }
    });

    if (a) {
      wilayah = {
        provinsi: a.kodeProvinsi || '',
        kabkota: a.kodeKabkota || '',
        kecamatan: a.kodeKecamatan || '',
        desa: a.kodeDesa || ''
      };
      elFWilayah.value = [a.provinsi, a.kabkota, a.kecamatan, a.desa]
        .filter(function (x) { return !!x; }).join(' \u203A ');
      tampilkanPenduduk();
    } else if (contohDariWilayah) {
      wilayah = {
        provinsi: contohDariWilayah.kodeProvinsi || '',
        kabkota: contohDariWilayah.kodeKabkota || '',
        kecamatan: contohDariWilayah.kodeKecamatan || '',
        desa: contohDariWilayah.kodeDesa || ''
      };
      elFWilayah.value = [contohDariWilayah.provinsi, contohDariWilayah.kabkota,
        contohDariWilayah.kecamatan, contohDariWilayah.desa]
        .filter(function (x) { return !!x; }).join(' \u203A ');
      tampilkanPenduduk();
    } else {
      wilayah = { provinsi: '', kabkota: '', kecamatan: '', desa: '' };
      elFWilayah.value = '';
      setPilih('provinsi', '');
      setPilih('kabkota', '');
      setPilih('kecamatan', '');
      setPilih('desa', '');
      isiDariPeta();
    }

    elFPratinjau.hidden = !kunci;
    elFPratinjau.textContent = kunci
      ? 'Wilayah dikunci. Yang bisa diubah: nama, kategori, inisial, keterangan.'
      : '';

    /* Orderan 18: pin mulai dari lokasi anggota lama (saat mengubah) atau
       titik tengah wilayah (saat menambah). */
    titikPin = (a && typeof a.lon === 'number' && typeof a.lat === 'number')
      ? { lng: a.lon, lat: a.lat }
      : null;

    elForm.hidden = false;
    tutupPanel();
    elFNama.focus();
    pasangPin(true);
    if (elFPinTengah) { elFPinTengah.hidden = false; }
    if (titikPin) { gambarPin(); perbaruiKeteranganPin(); }
    /* Orderan 18: peta menyusut ke 45% atas (HP) — MapLibre perlu diberi tahu
       ukuran barunya, lalu peta terbang ke wilayah anggota yang sedang dibuka.
       Dipakai setTimeout, BUKAN requestAnimationFrame: diukur 17 Okt 2026,
       rAF tidak menyala bila halaman sedang tidak terlihat (tab di belakang),
       sehingga peta tidak pernah bergerak. resize() juga hanya sekali —
       memanggilnya di tengah animasi fitBounds membatalkan animasinya. */
    if (peta) {
      setTimeout(function () {
        peta.resize();
        terbangKeTerdalam();
      }, 0);
    }
  }

  function setPilih(t, nilai) {
    var p = pilihEl(t);
    if (p) { p.value = nilai; }
  }

  function tutupForm() {
    elForm.hidden = true;
    sedangUbah = null;
    /* Orderan 18: pin & garis keliling dimatikan, peta kembali memenuhi layar.
       titikPin dikosongkan LEBIH DULU — pasangPin(false) menggambar ulang
       pin, jadi kalau urutannya terbalik pin tetap tertinggal di peta. */
    titikPin = null;
    pasangPin(false);
    hentikanKedip();
    gambarSorot(null, null, 0);
    if (elFPin) { elFPin.hidden = true; }
    if (elFPinTengah) { elFPinTengah.hidden = true; }
    if (peta) {
      setTimeout(function () { peta.resize(); }, 0);
    }
  }

  function bacaRincian(teks) {
    return (teks || '').split('\n')
      .map(function (b) { return b.trim(); })
      .filter(function (b) { return b.indexOf('=') > 0; })
      .map(function (b) {
        var i = b.indexOf('=');
        return { label: b.slice(0, i).trim(), nilai: b.slice(i + 1).trim() };
      });
  }

  function namaDariKode(kode, t) {
    if (!kode) { return ''; }
    var d = cariDariKode(daftarTingkat(t), kode, kolomTingkat(t));
    return d ? namaDari(d, kolomTingkat(t)) : '';
  }

  function titikWilayah() {
    var dipakai = null;
    ['desa', 'kecamatan', 'kabkota', 'provinsi'].forEach(function (t) {
      if (!dipakai && wilayah[t]) { dipakai = t; }
    });
    if (!dipakai) { return null; }
    var d = cariDariKode(daftarTingkat(dipakai), wilayah[dipakai], kolomTingkat(dipakai));
    if (!d) { return null; }
    var k = kotakDari(d.g);
    if (!k) { return null; }
    return { lng: (k[0] + k[2]) / 2, lat: (k[1] + k[3]) / 2 };
  }

  /* ---------- Orderan 18: pin lokasi yang bisa ditentukan user ----------
     Titik tengah wilayah hanya perkiraan. User bisa menaruh pin 📌 tepat di
     lokasi yayasan / sekolah / rumah sakit dengan mengetuk peta, atau
     menggeser pin-nya. Koordinat pin inilah yang disimpan. */

  var LAPISAN_PIN = 'anggota-pin';
  var SUMBER_PIN = 'anggota-pin';
  var titikPin = null;      /* { lng, lat } — null = pakai titik tengah wilayah */
  var pinSiap = false;

  function siapkanPin() {
    if (!peta || pinSiap) { return; }
    if (!peta.getSource(SUMBER_PIN)) {
      peta.addSource(SUMBER_PIN, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
    }
    if (!peta.getLayer(LAPISAN_PIN)) {
      /* Bulatan putih + cincin merah: menonjol di citra satelit gelap maupun
         di peta jalan yang terang. */
      peta.addLayer({
        id: LAPISAN_PIN,
        type: 'circle',
        source: SUMBER_PIN,
        paint: {
          'circle-radius': 7,
          'circle-color': '#ffffff',
          'circle-stroke-color': '#ff3b30',
          'circle-stroke-width': 3
        }
      });
    }
    pinSiap = true;
  }

  function gambarPin() {
    if (!peta) { return; }
    siapkanPin();
    var s = peta.getSource(SUMBER_PIN);
    if (!s) { return; }
    s.setData({
      type: 'FeatureCollection',
      features: titikPin ? [{
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [titikPin.lng, titikPin.lat] }
      }] : []
    });
  }

  /* Menaruh pin di titik tengah wilayah terpilih (dipakai saat wilayah
     berubah atau saat user menekan tombol "Titik tengah wilayah"). */
  function pinKeTitikTengah() {
    titikPin = titikWilayah();
    gambarPin();
    perbaruiKeteranganPin();
  }

  function perbaruiKeteranganPin() {
    if (!elFPin) { return; }
    if (!titikPin) {
      elFPin.hidden = true;
      elFPin.textContent = '';
      return;
    }
    elFPin.hidden = false;
    elFPin.innerHTML = 'Titik lokasi: <strong>' +
      titikPin.lng.toFixed(5).replace('.', ',') + '\u00B0 BT \u00B7 ' +
      titikPin.lat.toFixed(5).replace('.', ',') + '\u00B0</strong>' +
      ' <span style="opacity:.7">\u2014 ketuk peta untuk memindahkan pin</span>';
  }

  /* Menyalakan / mematikan penaruhan pin. Hanya menyala selama form anggota
     terbuka, supaya klik peta di luar form tetap membuka kartu wilayah. */
  function pasangPin(nyala) {
    if (!peta) { return; }
    if (!nyala) {
      peta.off('click', klikPetaPin);
      peta.off('mousedown', seretPin);
      peta.off('touchstart', seretPin);
      peta.getCanvas().style.cursor = '';
      gambarPin();
      return;
    }
    siapkanPin();
    peta.on('click', klikPetaPin);
    peta.on('mousedown', LAPISAN_PIN, seretPin);
    peta.on('touchstart', LAPISAN_PIN, seretPin);
    peta.getCanvas().style.cursor = 'crosshair';
    gambarPin();
  }

  function klikPetaPin(e) {
    if (!e || !e.lngLat) { return; }
    titikPin = { lng: e.lngLat.lng, lat: e.lngLat.lat };
    gambarPin();
    perbaruiKeteranganPin();
  }

  /* Geser pin: tahan pin lalu tarik. Peta tidak ikut bergeser selama menarik. */
  function seretPin(e) {
    if (!e || !e.lngLat) { return; }
    if (e.preventDefault) { e.preventDefault(); }
    peta.dragPan.disable();
    peta.getCanvas().style.cursor = 'grabbing';

    function gerak(ev) {
      titikPin = { lng: ev.lngLat.lng, lat: ev.lngLat.lat };
      gambarPin();
      perbaruiKeteranganPin();
    }
    function lepas() {
      peta.off('mousemove', gerak);
      peta.off('touchmove', gerak);
      peta.off('mouseup', lepas);
      peta.off('touchend', lepas);
      peta.dragPan.enable();
      peta.getCanvas().style.cursor = 'crosshair';
    }
    peta.on('mousemove', gerak);
    peta.on('touchmove', gerak);
    peta.on('mouseup', lepas);
    peta.on('touchend', lepas);
  }

  function simpanForm() {
    var nama = elFNama.value.trim();
    if (!nama) {
      alert('Nama anggota belum diisi.');
      elFNama.focus();
      return;
    }
    if (sedangUbah) {
      /* Wilayah dari data lama — tidak boleh berubah saat mengubah. */
      var lama = null;
      for (var i = 0; i < anggota.length; i++) {
        if (anggota[i].id === sedangUbah) { lama = anggota[i]; }
      }
      if (lama) {
        wilayah = {
          provinsi: lama.kodeProvinsi || '',
          kabkota: lama.kodeKabkota || '',
          kecamatan: lama.kodeKecamatan || '',
          desa: lama.kodeDesa || ''
        };
      }
    }
    if (!wilayah.provinsi) {
      alert('Wilayah belum dipilih. Pilih provinsi dulu.');
      return;
    }

    var titik = titikPin || titikWilayah() || (peta ? peta.getCenter() : { lng: 118, lat: -2.5 });
    var lama2 = null;
    for (var j = 0; j < anggota.length; j++) {
      if (anggota[j].id === sedangUbah) { lama2 = anggota[j]; }
    }

    var data = {
      id: sedangUbah || Simpanan.idBaru(),
      nama: nama,
      kategori: elFKategori.value,
      inisial: elFInisial.value.trim().slice(0, 3).toUpperCase(),
      rincian: bacaRincian(elFRincian.value),
      lon: titik.lng,
      lat: titik.lat,
      kodeProvinsi: wilayah.provinsi,
      kodeKabkota: wilayah.kabkota,
      kodeKecamatan: wilayah.kecamatan,
      kodeDesa: wilayah.desa,
      provinsi: namaDariKode(wilayah.provinsi, 'provinsi'),
      kabkota: namaDariKode(wilayah.kabkota, 'kabkota'),
      kecamatan: namaDariKode(wilayah.kecamatan, 'kecamatan'),
      desa: namaDariKode(wilayah.desa, 'desa'),
      dibuat: lama2 ? lama2.dibuat : new Date().toISOString(),
      diubah: new Date().toISOString()
    };

    Simpanan.simpanAnggota(data).then(function () {
      tutupForm();
      return muat();
    }).then(gambarPenanda);
  }

  function hapusAnggota(id) {
    var a = null;
    for (var i = 0; i < anggota.length; i++) {
      if (anggota[i].id === id) { a = anggota[i]; }
    }
    if (!confirm('Hapus anggota "' + (a ? a.nama : '') + '"? Data akan hilang.')) { return; }
    Simpanan.hapusAnggota(id).then(function () {
      tutupForm();
      return muat();
    }).then(gambarPenanda);
  }

  /* ---------- penanda di peta ---------- */

  /* Orderan 19: penanda sementara untuk hasil pencarian nama jalan.
     Berbeda dari penanda anggota — hanya satu titik, tidak ikut diklaster,
     dan hilang sendiri saat peta digeser atau pencarian ditutup. */
  var LAPISAN_TUNJUK = 'cari-tunjuk';
  var SUMBER_TUNJUK = 'cari-tunjuk';
  var jamTunjuk = null;

  function tunjukTitik(lng, lat, nama) {
    if (!peta) { return; }
    if (!peta.getSource(SUMBER_TUNJUK)) {
      peta.addSource(SUMBER_TUNJUK, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      peta.addLayer({
        id: LAPISAN_TUNJUK,
        type: 'circle',
        source: SUMBER_TUNJUK,
        paint: {
          'circle-radius': 8,
          'circle-color': '#ffd166',
          'circle-stroke-color': '#7a4b00',
          'circle-stroke-width': 2
        }
      });
    }
    peta.getSource(SUMBER_TUNJUK).setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { nama: nama || '' },
        geometry: { type: 'Point', coordinates: [lng, lat] }
      }]
    });
    if (jamTunjuk) { clearTimeout(jamTunjuk); }
    jamTunjuk = setTimeout(function () {
      if (peta && peta.getSource(SUMBER_TUNJUK)) {
        peta.getSource(SUMBER_TUNJUK).setData({ type: 'FeatureCollection', features: [] });
      }
    }, 12000);
  }

  function gambarPenanda() {
    if (!peta) { return; }
    var fc = {
      type: 'FeatureCollection',
      features: anggota.filter(function (a) {
        return typeof a.lon === 'number' && typeof a.lat === 'number';
      }).map(function (a) {
        return {
          type: 'Feature',
          properties: {
            id: a.id,
            nama: a.nama,
            inisial: a.inisial || (a.nama || '?').slice(0, 2).toUpperCase(),
            warna: warnaKategori(a.kategori)
          },
          geometry: { type: 'Point', coordinates: [a.lon, a.lat] }
        };
      })
    };

    if (!peta.getSource('anggota')) {
          /* `cluster` = anti-tumpuk dari MapLibre. Titik-titik yang berdekatan
             pada satu tingkat zoom digabung menjadi satu bulatan berisi jumlah
             anggota, lalu pecah sendiri saat peta diperbesar. Ini yang menjaga
             tampilan tetap terbaca walau anggotanya ribuan. */
          peta.addSource('anggota', {
            type: 'geojson',
            data: fc,
            cluster: true,
            clusterRadius: 62,
            clusterMaxZoom: 16
          });

          /* ---------- bentuk penanda ----------
             Titik lokasi → garis putus-putus → bulatan berisi kode anggota.
             Bulatan dinaikkan supaya tidak menutupi nama tempat dari peta dasar.
             Seluruh pergeseran memakai satuan PIXEL (circle-translate dan
             text-offset), jadi besarnya tetap sama di semua tingkat zoom —
             tidak mengecil saat peta diperbesar. */
          var JARAK = -34;                 /* pusat bulatan, 34 px di atas lokasi */
          var PUTUS = [-5, -11, -17, -23]; /* titik-titik garis putus-putus */
          var TANPA_TUMPUK = ['!', ['has', 'point_count']];

          /* 1. Titik kecil tepat di lokasi. Diberi cincin terang supaya terlihat
                di atas citra gelap maupun peta terang. */
          peta.addLayer({
            id: 'anggota-titik',
            type: 'circle',
            source: 'anggota',
            filter: TANPA_TUMPUK,
            paint: {
              'circle-radius': 3.5,
              'circle-color': ['get', 'warna'],
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1.5
            }
          });

          /* 2. Klaster (anti-tumpuk) — jumlah anggota di satu wilayah.
                Diberi perlakuan sama seperti penanda tunggal: titik kecil di
                lokasi, bulatan angka diangkat ke atas. Dengan begitu nama
                tempat tidak tertutup dan bentuknya konsisten. */
          peta.addLayer({
            id: 'anggota-tumpuk-titik',
            type: 'circle',
            source: 'anggota',
            filter: ['has', 'point_count'],
            paint: {
              'circle-radius': 3.5,
              'circle-color': '#1f6feb',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1.5
            }
          });

          [-11, -21].forEach(function (j, i) {
            peta.addLayer({
              id: 'anggota-tumpuk-putus-' + (i + 1),
              type: 'circle',
              source: 'anggota',
              filter: ['has', 'point_count'],
              paint: {
                'circle-radius': 2.2,
                'circle-color': '#ffffff',
                'circle-stroke-color': '#1f6feb',
                'circle-stroke-width': 1.6,
                'circle-translate': [0, j]
              }
            });
          });

          peta.addLayer({
            id: 'anggota-tumpuk',
            type: 'circle',
            source: 'anggota',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': '#1f6feb',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2.5,
              'circle-radius': ['step', ['get', 'point_count'], 13, 10, 16, 50, 20],
              'circle-translate': [0, JARAK]
            }
          });

          peta.addLayer({
            id: 'anggota-tumpuk-angka',
            type: 'symbol',
            source: 'anggota',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': ['get', 'point_count_abbreviated'],
              'text-size': 11,
              'text-font': ['Open Sans Bold'],
              'text-offset': [0, JARAK / 10],
              'text-allow-overlap': true,
              'text-ignore-placement': true
            },
            paint: { 'text-color': '#ffffff' }
          });

          /* 3. Garis putus-putus penghubung. Dibuat beberapa titik supaya
                bentuknya jelas dan langsung dimengerti. */
          PUTUS.forEach(function (j, i) {
            peta.addLayer({
              id: 'anggota-putus-' + (i + 1),
              type: 'circle',
              source: 'anggota',
              filter: TANPA_TUMPUK,
              paint: {
                'circle-radius': 2.2,
                'circle-color': '#ffffff',
                'circle-stroke-color': ['get', 'warna'],
                'circle-stroke-width': 1.6,
                'circle-translate': [0, j]
              }
            });
          });

          /* 4. Bulatan kode: latar terang, cincin warna kategori. */
          peta.addLayer({
            id: 'anggota-lingkaran',
            type: 'circle',
            source: 'anggota',
            filter: TANPA_TUMPUK,
            paint: {
              'circle-radius': 10,
              'circle-color': '#f2f7fc',
              'circle-stroke-color': ['get', 'warna'],
              'circle-stroke-width': 3,
              'circle-translate': [0, JARAK]
            }
          });

          /* 5. Kode anggota di dalam bulatan. Butuh `glyphs` di gaya peta —
                sudah ditambahkan di js/inti.js (diuji 16 Okt 2026).
                `text-allow-overlap` dibiarkan `true` supaya kode tidak pernah
                hilang, dan `text-ignore-placement` supaya label peta dasar
                tetap boleh digambar (bulatannya sudah naik, jadi tidak
                bertabrakan dengan nama tempat). */
          peta.addLayer({
            id: 'anggota-huruf',
            type: 'symbol',
            source: 'anggota',
            filter: TANPA_TUMPUK,
            layout: {
              'text-field': ['get', 'inisial'],
              'text-size': 10,
              'text-font': ['Open Sans Bold'],
              'text-offset': [0, JARAK / 10],
              'text-allow-overlap': true,
              'text-ignore-placement': true
            },
            paint: { 'text-color': '#0b0f14' }
          });

          /* ---------- sentuhan ---------- */

          /* Bulatan tumpukan: sekali ketuk → peta mendekat sampai anggotanya
             terpisah satu per satu. */
          peta.on('click', 'anggota-tumpuk', function (e) {
            var f = peta.queryRenderedFeatures(e.point, { layers: ['anggota-tumpuk'] })[0];
            if (!f) { return; }
            var sumber = peta.getSource('anggota');
            var id = f.properties.cluster_id;
            var titik = f.geometry.coordinates;
            Promise.resolve(sumber.getClusterExpansionZoom(id)).then(function (z) {
              peta.easeTo({ center: titik, zoom: z + 0.3 });
            }).catch(function () {
              peta.easeTo({ center: titik, zoom: peta.getZoom() + 2 });
            });
          });

          ['anggota-titik', 'anggota-lingkaran', 'anggota-huruf'].forEach(function (id) {
            peta.on('click', id, function (e) {
              if (e.features && e.features.length) { kartuAnggota(e.features[0].properties.id); }
            });
          });

          ['anggota-tumpuk', 'anggota-tumpuk-titik', 'anggota-titik', 'anggota-lingkaran', 'anggota-huruf']
            .forEach(function (id) {
              peta.on('mouseenter', id, function () {
                peta.getCanvas().style.cursor = 'pointer';
              });
              peta.on('mouseleave', id, function () {
                peta.getCanvas().style.cursor = '';
              });
            });
        } else {
          peta.getSource('anggota').setData(fc);
        }

        /* Gaya peta diganti (orderan 15) → seluruh lapisan dibuang lalu dibuat
           ulang. Keadaan tampil/sembunyi harus dipasang lagi, kalau tidak
           penandanya muncul kembali walau sedang disembunyikan. */
        terapkanTampil();
      }

  /* ---------- pindah peta ke satu anggota ---------- */

    function kartuAnggota(id) {
      var a = null;
      for (var i = 0; i < anggota.length; i++) {
        if (anggota[i].id === id) { a = anggota[i]; }
      }
    if (!a) { return; }
    var baris = [
      ['Wilayah', [a.desa, a.kecamatan, a.kabkota, a.provinsi]
        .filter(function (x) { return !!x; }).join(' \u203A ') || '\u2014'],
      ['Kategori', a.kategori || '\u2014']
    ];
    (a.rincian || []).forEach(function (r) { baris.push([r.label, r.nilai]); });
    var isi = '<p class="kartu-judul">' + a.nama + '</p><table class="kartu-tabel">';
    baris.forEach(function (b) {
      isi += '<tr><td>' + b[0] + '</td><td>' + b[1] + '</td></tr>';
    });
    isi += '</table>';
    document.getElementById('kartu-isian').innerHTML = isi;
    document.getElementById('kartu').hidden = false;
  }

  /* ---------- panel buka/tutup ---------- */

  function bukaPanel() {
    bukaModeKategori(false);
    elPanel.hidden = false;
    elPanel.setAttribute('aria-hidden', 'false');
  }

  function tutupPanel() {
    bukaModeKategori(false);
    elPanel.hidden = true;
    elPanel.setAttribute('aria-hidden', 'true');
  }

    /* ---------- tombol tampil / sembunyi penanda ---------- */

    function pasangTampil() {
      if (!elTampil) { return; }
      elTampil.addEventListener('click', function () {
        penandaTampil = !penandaTampil;
        terapkanTampil();
        Simpanan.simpanAtur(KUNCI_TAMPIL, penandaTampil ? '1' : '0');
      });
      /* Keadaan terakhir diingat, jadi tidak perlu diatur ulang tiap dibuka. */
      Simpanan.ambilAtur(KUNCI_TAMPIL).then(function (v) {
        if (v === '0') { penandaTampil = false; }
        terapkanTampil();
      });
    }

    function terapkanTampil() {
      if (!peta) { return; }
      if (elTampil) {
        elTampil.setAttribute('aria-pressed', penandaTampil ? 'true' : 'false');
        elTampil.title = penandaTampil
          ? 'Sembunyikan penanda anggota di peta'
          : 'Tampilkan penanda anggota di peta';
      }
      LAPISAN_PENANDA.forEach(function (id) {
        if (peta.getLayer(id)) {
          peta.setLayoutProperty(id, 'visibility', penandaTampil ? 'visible' : 'none');
        }
      });
    }

  /* ---------- mulai ---------- */

  function mulai() {
    if (terpasang) { return; }
    peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : null;
    if (!peta || !elPanel) { return; }
    terpasang = true;

    siapkanForm();
        siapkanKategori();
        bangunPemilih();
        siapkanKunci();
        pasangTampil();

    document.getElementById('tombol-anggota').addEventListener('click', function () {
      if (elPanel.hidden) { bukaPanel(); } else { tutupPanel(); }
    });
    document.getElementById('anggota-tutup').addEventListener('click', tutupPanel);
    document.getElementById('anggota-tambah').addEventListener('click', function () {
      bukaForm(null);
    });

    Simpanan.ambilAtur(KUNCI_TINGKAT).then(function (t) {
      if (t) {
        for (var i = 0; i < TINGKAT.length; i++) {
          if (TINGKAT[i].id === t) { tingkat = t; }
        }
      }
      return muat();
    }).then(gambarPenanda);

    /* Peta dasar diganti (orderan 15) → penanda dipasang ulang. */
    peta.on('styledata', function () {
      if (anggota.length) { setTimeout(gambarPenanda, 0); }
    });

    window.PD_ANGGOTA = {
      muat: muat,
      gambarPenanda: gambarPenanda,
      bukaPanel: bukaPanel,
          bukaForm: bukaForm,
          gambarSambung: gambarSambung,
          terapkanTampil: terapkanTampil,
          /* Dipakai modul pencarian (js/cari.js) — orderan 19. */
          ambilAnggota: function () { return anggota; },
          warnaKategori: warnaKategori,
          daftarPoligon: daftarTingkat,
          sorotWilayah: function (tingkat, kode) {
            var daftar = daftarTingkat(tingkat);
            gambarSorot(daftar, kode, kolomTingkat(tingkat));
          },
          bukaKartuAnggota: kartuAnggota,
          tunjukTitik: tunjukTitik
        };
  }

  var coba = 0;
  (function ulang() {
    if (typeof PD !== 'undefined' && PD.peta) { mulai(); return; }
    if (coba++ < 60) { setTimeout(ulang, 100); }
  })();
})();