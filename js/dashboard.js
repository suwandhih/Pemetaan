/* Dashboard laporan cakupan layanan (orderan 29). */
(function () {
  'use strict';

  var MEDIA = [
    'Film Isa Al-Masih', 'Film Ikatan Ilahi', 'Video Kitab Suci',
    'Clip Kitab Suci', 'Aplikasi Kitab Suci'
  ];
  var MEDIA_BAHASA = ['Film Isa Al-Masih', 'Film Ikatan Ilahi', 'Video Kitab Suci'];
  var PULAU = [
    { id: 'sumatera', nama: 'Sumatera', provinsi: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21'] },
    { id: 'jawa', nama: 'Jawa, Bali & Nusa Tenggara', provinsi: ['31', '32', '33', '34', '35', '36', '51', '52', '53'] },
    { id: 'kalimantan', nama: 'Kalimantan', provinsi: ['61', '62', '63', '64', '65'] },
    { id: 'sulawesi', nama: 'Sulawesi', provinsi: ['71', '72', '73', '74', '75', '76'] },
    { id: 'maluku', nama: 'Maluku & Papua', provinsi: ['81', '82', '91', '92', '93', '94', '95', '96'] }
  ];
  var SIMBOL = {
    'Film Isa Al-Masih': 'FI',
    'Film Ikatan Ilahi': 'II',
    'Video Kitab Suci': 'VK',
    'Clip Kitab Suci': 'CL',
    'Aplikasi Kitab Suci': 'AP'
  };
  var elPanel = document.getElementById('panel-dashboard');
  var elTombol = document.getElementById('tombol-dashboard');
  var elIsi = document.getElementById('dashboard-isi');
  var elStatus = document.getElementById('dashboard-status');
  var elPulau = document.getElementById('dashboard-pulau');
  var siap = false;
  var sumberPromise = null;

  function kodeProvinsi(d) {
    return String(d.a[0]).padStart(2, '0');
  }

  function daftarProvinsi() {
    return (window.WARNA_PROP || []).map(function (d) {
      return { kode: kodeProvinsi(d), nama: d.a[1], data: d };
    });
  }

  function provinsiAnggota(a) {
    var kode = a.kodeProvinsi;
    if (!kode) { return ''; }
    return String(kode).padStart(2, '0');
  }

  function terjemahGugus(v) {
    if (v === 'Jawa - Bali - Nusa Tenggara') { return 'Jawa, Bali, Nusa Tenggara'; }
    if (v === 'Maluku - Papua') { return 'Maluku, Papua'; }
    return v;
  }

  function diketahuiGugus(a) {
    var d = (a.rincian || []).find(function (r) { return r.label === 'Gugus'; });
    return terjemahGugus(d ? d.nilai : '');
  }

  function anggotaProvinsi(daftar) {
    var hasil = {};
    daftar.forEach(function (a) {
      var kode = provinsiAnggota(a);
      if (!kode) { return; }
      if (!hasil[kode]) { hasil[kode] = []; }
      hasil[kode].push(a);
    });
    return hasil;
  }

  function formatAngka(n) {
    return Number(n || 0).toLocaleString('id-ID');
  }

  function gugusUntukProvinsi(kode) {
    for (var i = 0; i < PULAU.length; i++) {
      if (PULAU[i].provinsi.indexOf(kode) >= 0) { return PULAU[i]; }
    }
    return null;
  }

  function terpilih() {
    return elPulau.value === 'semua'
      ? null
      : PULAU.find(function (p) { return p.id === elPulau.value; });
  }

  function padaWilayah(prov, pilihan) {
    return !pilihan || pilihan.provinsi.indexOf(prov.kode) >= 0;
  }

  function seksyen(judul, subjudul) {
    var section = document.createElement('section');
    section.className = 'dashboard-seksi';
    var h = document.createElement('h3');
    h.textContent = judul;
    section.appendChild(h);
    if (subjudul) {
      var p = document.createElement('p');
      p.className = 'dashboard-keterangan';
      p.textContent = subjudul;
      section.appendChild(p);
    }
    return section;
  }

  function kartuAngka(judul, nilai, keterangan, simbol) {
    var el = document.createElement('article');
    el.className = 'dashboard-angka';
    var i = document.createElement('span');
    i.className = 'dashboard-angka-simbol';
    i.textContent = simbol || '•';
    var label = document.createElement('span');
    label.className = 'dashboard-angka-label';
    label.textContent = judul;
    var angka = document.createElement('strong');
    angka.className = 'dashboard-angka-nilai';
    angka.textContent = formatAngka(nilai);
    var note = document.createElement('small');
    note.textContent = keterangan;
    el.append(i, label, angka, note);
    return el;
  }

  function barisProvinsi(prov, anggota) {
    var semua = anggota[prov.kode] || [];
    var bahasa = semua.filter(function (a) { return MEDIA.indexOf(a.kategori) >= 0; });
    var layanan = semua.filter(function (a) { return MEDIA.indexOf(a.kategori) < 0; });
    var kategori = {};
    bahasa.forEach(function (a) { kategori[a.kategori] = (kategori[a.kategori] || 0) + 1; });
    var kategoriLayanan = {};
    layanan.forEach(function (a) { kategoriLayanan[a.kategori || 'Tanpa kategori'] = (kategoriLayanan[a.kategori || 'Tanpa kategori'] || 0) + 1; });
    return { jumlah: bahasa.length, anggota: layanan.length, kategori: kategori, kategoriLayanan: kategoriLayanan };
  }

  function tabelProvinsi(provinsi, anggota) {
    var wrap = document.createElement('div');
    wrap.className = 'dashboard-tabel-bungkus';
    var table = document.createElement('table');
    table.className = 'dashboard-tabel';
    var thead = document.createElement('thead');
    var trh = document.createElement('tr');
    ['Provinsi', 'Media', 'Yayasan & layanan'].forEach(function (t) {
      var th = document.createElement('th');
      th.textContent = t;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    provinsi.forEach(function (p) {
      var data = barisProvinsi(p, anggota);
      var tr = document.createElement('tr');
      var nama = document.createElement('th');
      nama.scope = 'row';
      nama.textContent = p.nama;
      var media = document.createElement('td');
      var badge = document.createElement('span');
      badge.className = 'dashboard-badge' + (data.jumlah ? ' ada' : ' kosong');
      badge.textContent = formatAngka(data.jumlah) + (data.jumlah ? ' bahasa' : '');
      media.appendChild(badge);
      if (data.jumlah) {
        var rincian = document.createElement('small');
        rincian.className = 'dashboard-media-rincian';
        rincian.textContent = MEDIA.filter(function (m) { return data.kategori[m]; })
          .map(function (m) { return SIMBOL[m] + ' ' + formatAngka(data.kategori[m]); })
          .join(' · ');
        media.appendChild(rincian);
      }
      var user = document.createElement('td');
      user.textContent = formatAngka(data.anggota);
      if (data.anggota) {
        var rincianUser = document.createElement('small');
        rincianUser.className = 'dashboard-media-rincian';
        rincianUser.textContent = Object.keys(data.kategoriLayanan)
          .map(function (k) { return k + ' ' + formatAngka(data.kategoriLayanan[k]); })
          .join(' · ');
        user.appendChild(rincianUser);
      }
      tr.append(nama, media, user);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function kumpulanKosong(teks) {
    var el = document.createElement('p');
    el.className = 'dashboard-kosong';
    el.textContent = teks;
    return el;
  }

  function kartuBahasa(item, provinsi) {
    var el = document.createElement('article');
    el.className = 'dashboard-bahasa-item';
    var top = document.createElement('div');
    top.className = 'dashboard-bahasa-atas';
    var nama = document.createElement('strong');
    nama.textContent = item.nama;
    var cat = document.createElement('span');
    cat.textContent = SIMBOL[item.kategori] || item.kategori;
    top.append(nama, cat);
    var detail = document.createElement('p');
    var p = provinsi.find(function (x) { return x.kode === item.kodeProvinsi; });
    detail.textContent = (p ? p.nama : 'Provinsi tidak diketahui') +
      (item.gugus ? ' · ' + item.gugus : '');
    el.append(top, detail);
    return el;
  }

  function bangunSuku(provinsiBerdata, wilayah) {
    var suku = window.PD_SUKU && window.PD_SUKU.SUKU || [];
    var out = [];
    suku.forEach(function (s) {
      var ada = {};
      s.kawasan.forEach(function (kawasan) {
        var kode = window.PD_SUKU && window.PD_SUKU.kodeUntukKawasan
          ? window.PD_SUKU.kodeUntukKawasan(kawasan) : null;
        (kode || []).forEach(function (k) {
          if (provinsiBerdata[k] && (!wilayah || wilayah.provinsi.indexOf(k) >= 0)) { ada[k] = true; }
        });
      });
      var tertutup = Object.keys(ada);
      out.push({ nama: s.nama, gabungan: s.gabungan, jumlah: tertutup.length,
        total: s.kawasan.reduce(function (n, kawasan) {
          var kode = window.PD_SUKU && window.PD_SUKU.kodeUntukKawasan
            ? window.PD_SUKU.kodeUntukKawasan(kawasan) : null;
          return n + (kode || []).filter(function (k) {
            return !wilayah || wilayah.provinsi.indexOf(k) >= 0;
          }).length;
        }, 0), provinsi: tertutup });
    });
    return out;
  }

  function bahasaReferensi() {
    return window.PETA_BAHASA || {};
  }

  function ambilKatalog(kategori) {
    if (sumberPromise) { return sumberPromise; }
    if (typeof Simpanan === 'undefined' || !Simpanan.tarikRumahweb) { return Promise.resolve(null); }
    var batas = new Promise(function (resolve) {
      setTimeout(function () { resolve(null); }, 20000);
    });
    var baca = Simpanan.tarikRumahweb(kategori)
      .then(function (h) { return h && h.ok ? h.anggota || [] : null; })
      .catch(function () { return null; });
    sumberPromise = Promise.race([baca, batas]);
    return sumberPromise;
  }

  function bahasaPerKategori(katalog, tersimpan, kategori, kode) {
    var tersedia = {};
    tersimpan.forEach(function (a) {
      if (a.kategori !== kategori || provinsiAnggota(a) !== kode) { return; }
      var r = (a.rincian || []).find(function (x) { return x.label === 'Bahasa'; });
      if (r && r.nilai) { tersedia[r.nilai.toLocaleLowerCase('id-ID')] = true; }
    });
    var referensi = {};
    katalog.forEach(function (a) {
      if (a.kategori !== kategori || provinsiAnggota(a) !== kode) { return; }
      var r = (a.rincian || []).find(function (x) { return x.label === 'Bahasa'; });
      if (r && r.nilai) { referensi[r.nilai.toLocaleLowerCase('id-ID')] = r.nilai; }
    });
    return Object.keys(referensi).filter(function (nama) { return !tersedia[nama]; })
      .map(function (nama) { return referensi[nama]; })
      .sort(function (a, b) { return a.localeCompare(b, 'id'); });
  }

  function belumDiperinciPerProvinsi(kategori, gugus, katalogGugus, tersimpan) {
    var namaTersimpan = {};
    (tersimpan || []).forEach(function (a) {
      if (a.kategori !== kategori) { return; }
      var r = (a.rincian || []).find(function (x) { return x.label === 'Bahasa'; });
      if (r && r.nilai) { namaTersimpan[r.nilai.toLocaleLowerCase('id-ID')] = true; }
    });
    return (katalogGugus || []).filter(function (a) {
      return a.kategori === kategori && diketahuiGugus(a) === gugus &&
        !!((a.rincian || []).find(function (r) { return r.label === 'Bahasa'; }) || {}).nilai &&
        !a.kodeProvinsi;
    }).map(function (a) {
      return (a.rincian || []).find(function (r) { return r.label === 'Bahasa'; }).nilai;
    }).filter(function (n, i, all) {
      return all.indexOf(n) === i && !namaTersimpan[n.toLocaleLowerCase('id-ID')];
    }).sort(function (a, b) { return a.localeCompare(b, 'id'); });
  }

  function cakupanBahasa(katalogProvinsi, katalogGugus, tersimpan, provinsi) {
    if (!Array.isArray(katalogProvinsi)) { return null; }
    var hasil = [];
    provinsi.forEach(function (p) {
      var mediaKosong = MEDIA.map(function (m) {
        return { nama: m, bahasa: bahasaPerKategori(katalogProvinsi, katalogProvinsi, m, p.kode) };
      }).filter(function (m) { return m.bahasa.length; });
      if (mediaKosong.length) { hasil.push({ provinsi: p.nama, kategori: mediaKosong }); }
    });
    PULAU.forEach(function (g) {
      var pilihanAktif = terpilih();
      var dipilih = !pilihanAktif || pilihanAktif.id === g.id;
      if (!dipilih) { return; }
      var wilayahBahasa = MEDIA.map(function (m) {
        return { nama: m, bahasa: belumDiperinciPerProvinsi(m, g.nama, katalogGugus || [], tersimpan) };
      }).filter(function (m) { return m.bahasa.length; });
      if (wilayahBahasa.length) {
        hasil.push({ provinsi: g.nama + ' · gugus (belum dirinci per provinsi)', kategori: wilayahBahasa });
      }
    });
    return hasil;
  }

  function muatDanGambar() {
    return Promise.all([
      Simpanan.semuaAnggota(),
      ambilKatalog(MEDIA_BAHASA)
    ]).then(function (hasil) {
      var daftar = hasil[1];
      var katalogProvinsi = daftar && daftar.filter(function (a) { return !!a.kodeProvinsi; });
      var katalogGugus = daftar && daftar.filter(function (a) { return !a.kodeProvinsi; });
      if (!elPanel.hidden) { gambar(katalogProvinsi, katalogGugus); }
    });
  }

  function gambar(katalogProvinsi, katalogGugus) {
    if (!elIsi || !window.PD_ANGGOTA || !window.PD_ANGGOTA.ambilAnggota) { return; }
    elIsi.innerHTML = '';
    var pilihan = terpilih();
    var semua = window.PD_ANGGOTA.ambilAnggota() || [];
    var semuaMedia = semua.filter(function (a) { return MEDIA.indexOf(a.kategori) >= 0; });
    var bahasa = semuaMedia.filter(function (a) {
      return (a.rincian || []).some(function (r) { return r.label === 'Bahasa'; });
    });
    var prov = daftarProvinsi().filter(function (p) { return padaWilayah(p, pilihan); });
    var map = anggotaProvinsi(bahasa);
    var wilTerlayani = prov.filter(function (p) { return (map[p.kode] || []).length > 0; });
    var wilKosong = prov.filter(function (p) { return !(map[p.kode] || []).length; });
    var totalBahasa = bahasa.filter(function (a) {
      var kode = provinsiAnggota(a);
      return !pilihan || pilihan.provinsi.indexOf(kode) >= 0 ||
        (!kode && PULAU.some(function (g) { return g.id === pilihan.id && diketahuiGugus(a) === g.nama; }));
    }).length;
    var tanpaLokasi = bahasa.filter(function (a) { return !provinsiAnggota(a); }).length;
    var user = semua.filter(function (a) {
      if (MEDIA.indexOf(a.kategori) >= 0) { return false; }
      if (!pilihan) { return true; }
      var kode = provinsiAnggota(a);
      return (kode && pilihan.provinsi.indexOf(kode) >= 0) ||
        (!kode && diketahuiGugus(a) === pilihan.nama);
    });
    var userTanpaProvinsi = user.filter(function (a) { return !provinsiAnggota(a); });
    var jumlahTanpaProvinsi = userTanpaProvinsi.length;
    var anggotaMedia = anggotaProvinsi(bahasa);
    var media = seksyen('Ringkasan', 'Data anggota tersimpan saat laporan dibuat.');
    var grid = document.createElement('div');
    grid.className = 'dashboard-kartu-grid';
    grid.append(
      kartuAngka('Record media berbahasa', totalBahasa, tanpaLokasi + ' record sumber tidak memiliki provinsi', '◈'),
      kartuAngka('Provinsi dengan media', wilTerlayani.length, 'Dari ' + prov.length + ' provinsi pada wilayah terpilih', '⌖'),
      kartuAngka('Provinsi belum tercatat', wilKosong.length, 'Tidak ada record media dengan provinsi ini', '○'),
      kartuAngka('Data non-media', user.length, formatAngka(jumlahTanpaProvinsi) + ' record tanpa provinsi', '＋')
    );
    media.appendChild(grid);
    elIsi.appendChild(media);

    var perKategori = seksyen('Media per kategori', 'Jumlah record bahasa per kategori pada wilayah terpilih.');
    var catGrid = document.createElement('div');
    catGrid.className = 'dashboard-kategori-grid';
    MEDIA.forEach(function (m) {
      var n = bahasa.filter(function (a) {
        if (a.kategori !== m) { return false; }
        var kode = provinsiAnggota(a);
        return !pilihan || pilihan.provinsi.indexOf(kode) >= 0 ||
          (!kode && PULAU.some(function (g) { return g.id === pilihan.id && diketahuiGugus(a) === g.nama; }));
      }).length;
      catGrid.appendChild(kartuAngka(m, n, 'bahasa tercatat', SIMBOL[m]));
    });
    perKategori.appendChild(catGrid);
    elIsi.appendChild(perKategori);

    var provGroup = pilihan ? prov.slice() : prov.slice().sort(function (a, b) {
      var ga = gugusUntukProvinsi(a.kode), gb = gugusUntukProvinsi(b.kode);
      return (ga ? ga.id : '').localeCompare(gb ? gb.id : '') || a.nama.localeCompare(b.nama);
    });
    var tabel = seksyen('Rincian provinsi', 'Jumlah bahasa media dan data non-media yang memiliki kode provinsi.');
    tabel.appendChild(tabelProvinsi(provGroup, anggotaMedia));
    elIsi.appendChild(tabel);
    if (userTanpaProvinsi.length) {
      var nonMediaTanpaProvinsi = seksyen('Data non-media tanpa provinsi',
        'Record pengguna ini belum dapat dimasukkan ke rincian provinsi karena wilayahnya belum diisi.');
      var daftarNonMedia = document.createElement('div');
      daftarNonMedia.className = 'dashboard-daftar-bahasa';
      userTanpaProvinsi.forEach(function (a) {
        var card = document.createElement('article');
        card.className = 'dashboard-bahasa-item';
        var title = document.createElement('strong');
        title.textContent = a.nama || '(tanpa nama)';
        var detail = document.createElement('p');
        detail.textContent = a.kategori || 'Tanpa kategori';
        card.append(title, detail);
        daftarNonMedia.appendChild(card);
      });
      nonMediaTanpaProvinsi.appendChild(daftarNonMedia);
      elIsi.appendChild(nonMediaTanpaProvinsi);
    }

    var belum = bahasa.filter(function (a) {
      return !provinsiAnggota(a) && (!pilihan || PULAU.some(function (g) {
        return g.id === pilihan.id && diketahuiGugus(a) === g.nama;
      }));
    }).map(function (a) {
      return { nama: (a.rincian || []).find(function (r) { return r.label === 'Bahasa'; })?.nilai || a.nama,
        kategori: a.kategori, gugus: diketahuiGugus(a), kodeProvinsi: '' };
    });
    if (!pilihan && belum.length) {
      var belumBagian = seksyen('Sumber belum menunjuk provinsi',
        'Record ini tidak memiliki provinsi sehingga tidak dapat dipakai untuk menghitung provinsi yang kosong.');
      var ul = document.createElement('div');
      ul.className = 'dashboard-daftar-bahasa';
      belum.forEach(function (x) { ul.appendChild(kartuBahasa(x, prov)); });
      belumBagian.appendChild(ul);
      elIsi.appendChild(belumBagian);
    }

    var referensiKosong = cakupanBahasa(katalogProvinsi, katalogGugus, bahasa, prov);
    var bahasaBagian = seksyen('Bahasa referensi belum tercatat',
      'Perbandingan katalog API TokoMedia dengan kategori media, dicocokkan menurut nama dan provinsi. Nama tak tercatat bukan bukti layanan sama sekali tidak tersedia.');
    if (referensiKosong === null) {
      bahasaBagian.appendChild(kumpulanKosong('Daftar pembanding dari API tidak tersedia; ringkasan bahasa belum dapat dihitung.'));
    } else if (!referensiKosong.length) {
      bahasaBagian.appendChild(kumpulanKosong('Semua bahasa referensi pada wilayah ini sudah memiliki record media.'));
    } else {
      var daftarKurang = document.createElement('div');
      daftarKurang.className = 'dashboard-provinsi-kosong';
      referensiKosong.forEach(function (item) {
        var grup = document.createElement('article');
        grup.className = 'dashboard-provinsi-kosong-item';
        var h = document.createElement('h4');
        h.textContent = item.provinsi;
        grup.appendChild(h);
        item.kategori.forEach(function (m) {
          var p = document.createElement('p');
          p.textContent = m.nama + ' · ' + m.bahasa.length + ' bahasa: ' + m.bahasa.join(', ');
          grup.appendChild(p);
        });
        daftarKurang.appendChild(grup);
      });
      bahasaBagian.appendChild(daftarKurang);
    }
    elIsi.appendChild(bahasaBagian);

    var suku = bangunSuku(Object.keys(map).reduce(function (o, k) { o[k] = true; return o; }, {}), pilihan);
    var sukuBagian = seksyen('Indikasi cakupan suku',
      'Perbandingan provinsi media dengan kawasan utama BPS, Sensus Penduduk 2010. Indikasi wilayah saja—bukan bukti suku/individu telah menerima layanan.');
    var sukuGrid = document.createElement('div');
    sukuGrid.className = 'dashboard-suku-grid';
    suku.forEach(function (s) {
      var card = document.createElement('article');
      card.className = 'dashboard-suku-item';
      var heading = document.createElement('strong');
      heading.textContent = s.nama + (s.gabungan ? ' · kelompok gabungan' : '');
      var value = document.createElement('span');
      value.textContent = formatAngka(s.jumlah) + ' / ' + formatAngka(s.total) + ' provinsi berkawasan';
      var tags = document.createElement('small');
      var names = s.provinsi.map(function (k) {
        var p = prov.find(function (x) { return x.kode === k; });
        return p ? p.nama : k;
      });
      tags.textContent = names.length ? names.join(' · ') : 'Belum ada provinsi media pada kawasan utama tercatat';
      card.append(heading, value, tags);
      sukuGrid.appendChild(card);
    });
    sukuBagian.appendChild(sukuGrid);
    elIsi.appendChild(sukuBagian);

    var note = document.createElement('p');
    note.className = 'dashboard-catatan-metode';
    note.textContent = 'Cakupan provinsi berarti ada record media yang dipetakan ke provinsi tersebut. Bahasa belum tercatat tidak otomatis berarti layanan tidak tersedia. Data suku adalah kawasan utama BPS SP2010; tidak dapat menunjukkan apakah suku atau orang tertentu telah menerima media.';
    elIsi.appendChild(note);
  }

  function sambung() {
    if (!elStatus) { return; }
    var keadaan = (typeof Simpanan !== 'undefined' && Simpanan.keadaan) ? Simpanan.keadaan() : null;
    if (!keadaan || !keadaan.punyaKunci || !keadaan.menyala || !keadaan.daring) {
      elStatus.textContent = 'Tidak tersambung. Laporan tidak dapat memuat data bersama terbaru.';
      return;
    }
    elStatus.textContent = 'Database tersambung · data bersama terbaru dimuat';
  }

  function buka() {
    if (!elPanel || !elPanel.hidden) { return; }
    if (window.PD_ANGGOTA && PD_ANGGOTA.tutupPanel) { PD_ANGGOTA.tutupPanel(); }
    if (window.PD_SUKU && PD_SUKU.tutupPanel) { PD_SUKU.tutupPanel(); }
    ['pemilih-warna', 'pemilih-agama', 'pemilih-media'].forEach(function (id) {
      var e = document.getElementById(id);
      if (e) { e.hidden = true; }
    });
    var styleSebelum = (typeof PD !== 'undefined' && PD.peta && PD.peta.getStyle) ? PD.peta.getStyle() : null;
    elPanel.dataset.jenisPeta = styleSebelum && styleSebelum.name === 'Satelit' ? 'satelit' : 'map';
    elPanel.hidden = false;
    elPanel.setAttribute('aria-hidden', 'false');
    elTombol.setAttribute('aria-expanded', 'true');
    setTimeout(function () { if (typeof PD !== 'undefined' && PD.peta) { PD.peta.resize(); } }, 0);
    sambung();
    muatDanGambar();
  }

  function tutup() {
    if (!elPanel) { return; }
    if (elPanel.contains(document.activeElement)) { elTombol.focus(); }
    elPanel.hidden = true;
    elPanel.setAttribute('aria-hidden', 'true');
    elTombol.setAttribute('aria-expanded', 'false');
    setTimeout(function () { if (typeof PD !== 'undefined' && PD.peta) { PD.peta.resize(); } }, 0);
  }

  function mulai() {
    if (siap || !elPanel || !elTombol) { return; }
    siap = true;
    elTombol.addEventListener('click', function () { elPanel.hidden ? buka() : tutup(); });
    document.getElementById('dashboard-tutup').addEventListener('click', tutup);
    elPulau.addEventListener('change', function () {
      sumberPromise = null;
      muatDanGambar();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !elPanel.hidden) { tutup(); }
    });
    document.addEventListener('click', function (e) {
      if (elPanel.hidden || elPanel.contains(e.target) || elTombol.contains(e.target)) { return; }
      if (e.target.closest('#panel-anggota, #panel-suku, #pemilih-media, #pemilih-warna, #pemilih-agama')) { return; }
      tutup();
    });
    window.addEventListener('storage', function () { if (!elPanel.hidden) { muatDanGambar(); } });
  }

  window.PD_DASHBOARD = { buka: buka, tutup: tutup, gambar: gambar, siap: function () { return siap; } };
  mulai();
})();
