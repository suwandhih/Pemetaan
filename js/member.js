/* Pemetaan — anggota / user input data (orderan 17)
   ------------------------------------------------------------------
   Konsep diambil dari `DataPeta` (panel "Member"), lalu disesuaikan:

   · Anggota menempel pada KODE WILAYAH resmi Dukcapil (2.2.2.4 angka),
     bukan pada nama yang diketik bebas. Nama bisa salah tulis atau
     berubah; kode wilayah tidak.
   · Daftar anggota bisa dikelompokkan menurut tingkat pilihan:
     Desa/Kelurahan · Kecamatan · Kabupaten/Kota · Provinsi.
   · Form berupa LEMBAR BAWAH, bukan panel samping. Bingkai Pemetaan
     hanya selebar HP (430 px) sehingga panel samping tidak muat.
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
    kategori.forEach(function (k) {
      var o = document.createElement('option');
      o.value = k;
      o.textContent = k;
      elFKategori.appendChild(o);
    });
    if (lama && kategori.indexOf(lama) >= 0) { elFKategori.value = lama; }
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
     seluruh Indonesia hanya untuk menambah satu anggota. */
  function isiDariPeta() {
    if (!peta || typeof PD === 'undefined') { return; }
    var kodeProv = null;
    var daftar = daftarTingkat('provinsi');
    var batas = peta.getBounds();
    for (var i = 0; i < daftar.length; i++) {
      var k = kotakDari(daftar[i].g);
      if (!k) { continue; }
      if (k[2] < batas.getWest() || k[0] > batas.getEast()) { continue; }
      if (k[3] < batas.getSouth() || k[1] > batas.getNorth()) { continue; }
      kodeProv = kodeDari(daftar[i], 1);
      break;
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

    elForm.hidden = false;
    tutupPanel();
    elFNama.focus();
  }

  function setPilih(t, nilai) {
    var p = pilihEl(t);
    if (p) { p.value = nilai; }
  }

  function tutupForm() {
    elForm.hidden = true;
    sedangUbah = null;
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

    var titik = titikWilayah() || (peta ? peta.getCenter() : { lng: 118, lat: -2.5 });
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
      peta.addSource('anggota', { type: 'geojson', data: fc });

          /* Bentuk penanda: titik kecil di lokasi, garis putus-putus ke atas,
             lalu bulatan berisi kode anggota.
             Alasannya (perintah 16 Okt 2026): bulatan yang menempel langsung di
             titik lokasi menutupi nama tempat dari peta dasar ("Bandung",
             "Surabaya"). Dengan naik ke atas dan hanya titik kecil di bawahnya,
             lokasi tetap terbaca sedangkan anggota tetap kelihatan.

             Catatan MapLibre: `circle-translate` dan `text-offset` tidak bisa
             berbeda per anggota (bukan paint data-driven), jadi dipakai satu
             jarak tetap untuk semua. `text-offset` memakai satuan em = ukuran
             huruf, jadi -2,7 em x 10 px = 27 px, sama dengan bulatannya. */
          var JARAK = -27;

          peta.addLayer({
            id: 'anggota-titik',
            type: 'circle',
            source: 'anggota',
            paint: {
              'circle-radius': 3,
              'circle-color': ['get', 'warna'],
              'circle-stroke-color': '#0b0f14',
              'circle-stroke-width': 1.5
            }
          });

          /* Garis putus-putus: dua titik kecil sebagai penyambung. */
          peta.addLayer({
            id: 'anggota-putus-1',
            type: 'circle',
            source: 'anggota',
            paint: {
              'circle-radius': 1.6,
              'circle-color': ['get', 'warna'],
              'circle-translate': [0, -10],
              'circle-opacity': 0.85
            }
          });

          peta.addLayer({
            id: 'anggota-putus-2',
            type: 'circle',
            source: 'anggota',
            paint: {
              'circle-radius': 1.6,
              'circle-color': ['get', 'warna'],
              'circle-translate': [0, -18],
              'circle-opacity': 0.85
            }
          });

          /* Bulatan kode: latar terang, cincin warna kategori — supaya terbaca
             di atas citra satelit gelap maupun peta terang. */
          peta.addLayer({
            id: 'anggota-lingkaran',
            type: 'circle',
            source: 'anggota',
            paint: {
              'circle-radius': 9.5,
              'circle-color': '#f2f7fc',
              'circle-stroke-color': ['get', 'warna'],
              'circle-stroke-width': 2.5,
              'circle-translate': [0, JARAK]
            }
          });

          /* Huruf/kode di dalam bulatan. Butuh `glyphs` di gaya peta — sudah
             ditambahkan di js/inti.js (diuji 16 Okt 2026). */
          peta.addLayer({
            id: 'anggota-huruf',
            type: 'symbol',
            source: 'anggota',
            layout: {
              'text-field': ['get', 'inisial'],
              'text-size': 10,
              'text-font': ['Open Sans Bold'],
              'text-offset': [0, JARAK / 10]
            },
            paint: { 'text-color': '#0b0f14' }
          });

          /* Nama tempat dari peta dasar digambar menyatu dengan ubin, jadi tidak
           bisa dipindahkan. Supaya bulatan anggota tidak menimpa nama tempat,
           dipakai pengaturan tumpang-tindih MapLibre: tempat yang sudah dipakai
           penanda ditandai `hasOffscreen`, sehingga label peta dasar tidak
           digambar di situ — yang paling penting nama tempat tetap terbaca. */

          var LAPISAN_ANGGOTA = ['anggota-titik', 'anggota-putus-1', 'anggota-putus-2',
            'anggota-lingkaran', 'anggota-huruf'];

                /* Lapisan `anggota-huruf` dibiarkan mengikuti aturan tumpang-tindih
             MapLibre. Karena dibuat paling akhir, ia diproses lebih dulu —
             tempat yang dipakai penanda ditandai `hasOffscreen`, sehingga label
             peta dasar yang datang kemudian tidak ikut digambar di tempat itu.

             Tanpa `text-allow-overlap`, nama tempat (mis. "Bandung") tetap
             terbaca dan penandanya bergeser. */
                peta.setLayoutProperty('anggota-huruf', 'text-allow-overlap', false);
                peta.setLayoutProperty('anggota-huruf', 'text-ignore-placement', false);

          LAPISAN_ANGGOTA.forEach(function (id) {
            peta.on('click', id, function (e) {
              if (e.features && e.features.length) { kartuAnggota(e.features[0].properties.id); }
            });
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
      }

  /* ---------- label peta dasar ---------- */

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
    elPanel.hidden = false;
    elPanel.setAttribute('aria-hidden', 'false');
  }

  function tutupPanel() {
    elPanel.hidden = true;
    elPanel.setAttribute('aria-hidden', 'true');
  }

  /* ---------- mulai ---------- */

  function mulai() {
    if (terpasang) { return; }
    peta = (typeof PD !== 'undefined' && PD.peta) ? PD.peta : null;
    if (!peta || !elPanel) { return; }
    terpasang = true;

    siapkanForm();
    bangunPemilih();
        siapkanKunci();

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
          gambarSambung: gambarSambung
        };
  }

  var coba = 0;
  (function ulang() {
    if (typeof PD !== 'undefined' && PD.peta) { mulai(); return; }
    if (coba++ < 60) { setTimeout(ulang, 100); }
  })();
})();