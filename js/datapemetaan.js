/* Data Pemetaan — laporan interaktif wilayah, bahasa, agama, suku, dan media.
   Rincian dimuat saat dibuka; katalog API tidak disamakan dengan data tersimpan. */
(function () {
  'use strict';

  var MEDIA = ['Film Isa Al-Masih', 'Film Ikatan Ilahi', 'Video Kitab Suci', 'Clip Kitab Suci', 'Aplikasi Kitab Suci'];
  var AGAMA = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu', 'Kepercayaan'];
  var URL_WORKER = 'https://pemetaan-api.suwandhih.workers.dev';
  var KUNCI = 'pemetaan_kunci';
  var dasar = new URL('.', location.href).href;
  var indeks = null, tersimpan = [], katalog = null, gagalMedia = [];
  var cache = {}, bahasaSuku = {}, tab = 'wilayah', fokusSebelum = null, bahasaTerbuka = {};
  var elStatus = document.getElementById('status');
  var elDetail = document.getElementById('detail');
  var elIsiDetail = document.getElementById('isi-detail');

  function el(tag, kelas, teks) {
    var e = document.createElement(tag);
    if (kelas) { e.className = kelas; }
    if (teks !== undefined) { e.textContent = teks; }
    return e;
  }
  function angka(n) { return n === null || n === undefined ? '—' : Number(n).toLocaleString('id-ID'); }
  function persen(n, pembagi) { return pembagi > 0 ? (n / pembagi * 100).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + '%' : '—'; }
  function normal(n) { return String(n || '').toLocaleLowerCase('id-ID').replace(/^bahasa\s+/i, '').trim(); }
  function kode(a) { return String(a.kodeProvinsi || '').padStart(2, '0'); }
  function rincian(a, label) { var r = (a.rincian || []).find(function (x) { return x.label === label; }); return r ? r.nilai : ''; }
  function bahasa(a) { return rincian(a, 'Bahasa') || a.nama.replace(/\s+-\s+(Film|Video|Clip|Aplikasi)[\s\S]*$/, ''); }
  function sumber(a) { return rincian(a, 'Sumber'); }
  function bersihkanDaftar(daftar) { return (daftar || []).filter(function (a) { return MEDIA.indexOf(a.kategori) >= 0; }); }
  function status(teks, salah) {
    elStatus.hidden = !teks;
    elStatus.textContent = teks;
    elStatus.style.color = salah ? '#9a3e30' : '';
  }
  function pesanMedia(teks, salah) {
    var e = document.getElementById('status-media');
    e.textContent = teks;
    e.style.color = salah ? '#9a3e30' : '';
  }
  function ambil(nama) {
    if (cache[nama]) { return cache[nama]; }
    status('Memuat rincian ' + nama.replace(/\.json$/, '') + '…');
    cache[nama] = fetch(dasar + 'data/datapemetaan/' + nama + '?v=20261024-data', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) { throw new Error('Berkas ' + nama + ' tidak ditemukan (' + r.status + ').'); }
      return r.json();
    }).then(function (d) { status(''); return d; }).catch(function (e) {
      delete cache[nama]; status(e.message, true); throw e;
    });
    return cache[nama];
  }
  function kartu(judul, nilai, keterangan, aksi) {
    var c = el('article', 'kartu');
    c.appendChild(el('h3', '', judul));
    if (aksi) {
      var b = el('button'); b.type = 'button'; b.appendChild(el('strong', '', nilai)); b.setAttribute('aria-label', judul + ': ' + nilai + '. Buka rincian'); b.addEventListener('click', aksi); c.appendChild(b);
    } else { c.appendChild(el('strong', '', nilai)); }
    if (keterangan) { c.appendChild(el('small', '', keterangan)); }
    return c;
  }
  function kotakJudul(judul, keterangan) {
    var d = el('div', 'baris-judul');
    var x = el('div'); x.appendChild(el('h2', '', judul)); d.appendChild(x);
    if (keterangan) { x.appendChild(el('p', 'kecil', keterangan)); }
    return d;
  }
  function tabel(kepala) {
    var w = el('div', 'tabel-bungkus'), t = el('table', 'tabel'), h = el('thead'), tr = el('tr');
    kepala.forEach(function (n) { var th = el('th', '', n); th.scope = 'col'; tr.appendChild(th); });
    h.appendChild(tr); t.appendChild(h); var b = el('tbody'); t.appendChild(b); w.appendChild(t);
    return { bungkus: w, isi: b };
  }
  function baris(t, nama, nilai, aksi, kodeWilayah) {
    var tr = el('tr'), th = el('th'); th.scope = 'row';
    var b = el('button', 'tombol-nama', nama); b.type = 'button'; b.addEventListener('click', aksi); th.appendChild(b); tr.appendChild(th);
    nilai.forEach(function (n, i) { var td = el('td');
      if (n && typeof n === 'object' && n.aksi) {
        var x = el('button', 'tombol-angka', angka(n.nilai)); x.type = 'button'; x.addEventListener('click', n.aksi); td.appendChild(x);
      } else { td.textContent = angka(n); }
      tr.appendChild(td);
    });
    if (kodeWilayah) { var td = el('td', 'kecil', kodeWilayah); tr.appendChild(td); }
    t.appendChild(tr);
  }
  function agama(a, ringkas) {
    var d = el('div', ringkas ? 'agama-mini' : '');
    if (!a) { d.appendChild(el('p', 'catatan', 'Rincian agama tingkat ini tidak tersedia pada sumber. Jumlah desa tetap ditampilkan.')); return d; }
    var penduduk = a[0];
    d.appendChild(el('p', 'kecil', 'Penduduk: ' + angka(penduduk) + ' jiwa · tujuh kategori agama/kepercayaan'));
    AGAMA.forEach(function (nama, i) {
      var r = el('div', 'agama-baris'); r.appendChild(el('span', '', nama));
      var b = el('div', 'agama-batang'), fill = el('span'); fill.style.width = (penduduk > 0 ? a[i + 1] / penduduk * 100 : 0) + '%'; b.appendChild(fill); r.appendChild(b);
      r.appendChild(el('span', 'agama-angka', angka(a[i + 1]))); r.appendChild(el('span', 'agama-persen', persen(a[i + 1], penduduk))); d.appendChild(r);
    });
    if (!(penduduk > 0)) { d.appendChild(el('p', 'catatan', 'Total penduduk tidak tersedia/nol pada sumber. Persentase tidak dihitung; angka agama dipertahankan apa adanya.')); }
    return d;
  }
  function tutupDetail() {
    elDetail.hidden = true; elDetail.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    if (fokusSebelum) { fokusSebelum.focus(); }
  }
  function bukaDetail(judul, jalur, subjudul) {
    fokusSebelum = document.activeElement;
    document.getElementById('judul-detail').textContent = judul;
    document.getElementById('jalur-detail').textContent = jalur;
    document.getElementById('subjudul-detail').textContent = subjudul || '';
    elIsiDetail.replaceChildren(el('p', 'status', 'Memuat rincian…'));
    elDetail.hidden = false; elDetail.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    document.getElementById('tutup-detail').focus();
  }
  function detailSiap(konten) { elIsiDetail.replaceChildren(konten); elIsiDetail.scrollTop = 0; }
  function bukaProvinsi(pk) {
    var p = indeks.provinsi[pk];
    bukaDetail(p.nama, 'INDONESIA / PROVINSI ' + pk, 'Wilayah, bahasa, suku, agama, dan media dalam satu rincian.');
    ambil('provinsi-' + pk + '.json').then(function (d) {
      var w = el('div'), ringkas = el('div', 'ringkas-detail');
      [['Kab/Kota', d.kabupaten.length], ['Kecamatan', d.provinsi.kec], ['Desa/Kelurahan', d.provinsi.desa], ['Bahasa', d.provinsi.bahasa.length]].forEach(function (x) {
        var a = el('div'); a.appendChild(el('strong', '', angka(x[1]))); a.appendChild(el('small', '', x[0])); ringkas.appendChild(a);
      }); w.appendChild(ringkas);
      var h = el('section', 'kelompok'); h.appendChild(el('h3', '', 'Penduduk & agama')); h.appendChild(agama(d.provinsi.agama)); w.appendChild(h);
      var b = el('section', 'kelompok'); b.appendChild(el('h3', '', 'Bahasa & media')); b.appendChild(el('p', '', d.provinsi.bahasa.length + ' bahasa dalam katalog Pemetaan.'));
      var tombol = el('button', 'tombol utama', 'Bandingkan ' + d.provinsi.bahasa.length + ' bahasa'); tombol.type = 'button'; tombol.addEventListener('click', function () { tutupDetail(); gantiTab('bahasa'); bahasaTerbuka[pk] = true; gambarBahasa(); document.getElementById('bahasa-' + pk).scrollIntoView(); }); b.appendChild(tombol); w.appendChild(b);
      var s = el('section', 'kelompok'); s.appendChild(el('h3', '', 'Kawasan suku BPS SP2010'));
      d.provinsi.suku.forEach(function (x) { s.appendChild(el('p', '', x.nama + ' — ' + x.kawasan.join(', '))); });
      s.appendChild(el('p', 'catatan', 'Kawasan utama bukan batas sebaran pasti atau tempat tinggal setiap anggota suku. Tidak ada jumlah penduduk suku per provinsi pada sumber ini.')); w.appendChild(s);
      var k = el('section', 'kelompok'); k.appendChild(el('h3', '', 'Kabupaten / kota'));
      var t = tabel(['Nama', 'Kecamatan', 'Desa/Kelurahan']);
      d.kabupaten.forEach(function (q) { baris(t.isi, q.nama, [{ nilai: q.kec, aksi: function () { bukaKabupaten(q.kode); } }, { nilai: q.desa, aksi: function () { bukaKabupaten(q.kode); } }], function () { bukaKabupaten(q.kode); }); });
      k.appendChild(t.bungkus); w.appendChild(k); detailSiap(w);
    }).catch(function (e) { detailSiap(el('p', 'catatan', e.message)); });
  }
  function bukaKabupaten(kk) {
    bukaDetail('Kabupaten / kota ' + kk, 'PROVINSI ' + kk.slice(0, 2) + ' / KABUPATEN / KOTA', 'Rincian dimuat hanya untuk kabupaten/kota ini.');
    ambil('kabupaten-' + kk + '.json').then(function (d) {
      var w = el('div'); document.getElementById('judul-detail').textContent = d.kabupaten.nama;
      w.appendChild(agama(d.kabupaten.agama));
      if (d.kabupaten.tanpaInduk) { w.appendChild(el('p', 'catatan', 'Kelompok ini tidak memiliki induk kabupaten/kota pada data nasional. Ditampilkan sesuai kode desa, bukan dipindahkan.')); }
      var t = tabel(['Kecamatan', 'Desa/Kelurahan']);
      d.kecamatan.forEach(function (q) { baris(t.isi, q.nama, [{ nilai: q.desa, aksi: function () { bukaKecamatan(q.kode); } }], function () { bukaKecamatan(q.kode); }); });
      w.appendChild(t.bungkus); detailSiap(w);
    }).catch(function (e) { detailSiap(el('p', 'catatan', e.message)); });
  }
  function bukaKecamatan(kc) {
    bukaDetail('Kecamatan ' + kc, 'KABUPATEN ' + kc.slice(0, 4) + ' / KECAMATAN', 'Nama desa/kelurahan, penduduk, dan agama.');
    ambil('kecamatan-' + kc + '.json').then(function (d) {
      var w = el('div'); document.getElementById('judul-detail').textContent = d.kecamatan.nama;
      w.appendChild(agama(d.kecamatan.agama));
      if (d.kecamatan.tanpaInduk) { w.appendChild(el('p', 'catatan', 'Kode kecamatan ini tidak tercatat pada tingkat kecamatan. Nama diambil dari desa bila dapat dikenali; desa tetap ditampilkan sesuai kode sumber.')); }
      var cari = el('input'); cari.type = 'search'; cari.placeholder = 'Cari desa/kelurahan…'; cari.setAttribute('aria-label', 'Cari desa/kelurahan'); cari.style.width = '100%'; cari.style.margin = '12px 0'; cari.style.padding = '10px';
      var daftar = el('div'); var halaman = 0, perHalaman = 100;
      function gambar() {
        var kata = cari.value.toLocaleLowerCase('id-ID').trim();
        var semua = d.desa.filter(function (q) { return !kata || q.nama.toLocaleLowerCase('id-ID').includes(kata); });
        var totalHalaman = Math.max(1, Math.ceil(semua.length / perHalaman)); halaman = Math.min(halaman, totalHalaman - 1);
        var t = tabel(['Desa/Kelurahan', 'Penduduk']);
        semua.slice(halaman * perHalaman, (halaman + 1) * perHalaman).forEach(function (q) {
          var tr = el('tr'), th = el('th'); th.scope = 'row'; th.textContent = q.nama;
          var td = el('td', '', angka(q.agama[0]));
          var b = el('button', 'tombol-angka', 'Agama'); b.type = 'button'; b.addEventListener('click', function () { detailDesa(q); }); tr.append(th, td, el('td')); tr.lastChild.appendChild(b); t.isi.appendChild(tr);
        });
        daftar.replaceChildren(t.bungkus);
        if (totalHalaman > 1) {
          var nav = el('div', 'paginasi'), sebelum = el('button', 'tombol kecil', '← Sebelumnya'), sesudah = el('button', 'tombol kecil', 'Berikutnya →');
          sebelum.type = sesudah.type = 'button'; sebelum.disabled = halaman === 0; sesudah.disabled = halaman >= totalHalaman - 1;
          sebelum.addEventListener('click', function () { halaman--; gambar(); }); sesudah.addEventListener('click', function () { halaman++; gambar(); });
          nav.append(sebelum, el('span', '', 'Halaman ' + (halaman + 1) + ' / ' + totalHalaman + ' · ' + semua.length + ' desa'), sesudah); daftar.appendChild(nav);
        }
      }
      cari.addEventListener('input', function () { halaman = 0; gambar(); }); w.append(cari, daftar); gambar(); detailSiap(w);
    }).catch(function (e) { detailSiap(el('p', 'catatan', e.message)); });
  }
  function detailDesa(q) {
    var d = el('div', 'kelompok'); d.id = 'desa-' + q.kode;
    d.appendChild(el('h3', '', q.nama)); d.appendChild(el('p', 'kecil', 'Kode ' + q.kode));
    d.appendChild(agama(q.agama));
    if (q.agamaTanpaTotal) { d.appendChild(el('p', 'catatan', 'Berkas peta memuat null untuk penduduk; berkas agama memuat total 0. Nilai tidak diubah menjadi perkiraan.')); }
    var lama = document.getElementById(d.id); if (lama) { lama.replaceWith(d); } else { elIsiDetail.prepend(d); }
    d.scrollIntoView({ block: 'start' });
  }
  function bukaDaftarNasional() {
    bukaDetail('Indonesia', 'WILAYAH ADMINISTRATIF', 'Pilih provinsi untuk membuka kabupaten/kota, kecamatan, dan desa/kelurahan.');
    var w = el('div'), t = tabel(['Provinsi', 'Kab/Kota', 'Kecamatan', 'Desa/Kelurahan']);
    Object.entries(indeks.provinsi).forEach(function (x) {
      var pk = x[0], p = x[1], aksi = function () { bukaProvinsi(pk); };
      baris(t.isi, p.nama, [{ nilai: p.kab, aksi: aksi }, { nilai: p.kec, aksi: aksi }, { nilai: p.desa, aksi: aksi }], aksi);
    });
    w.appendChild(t.bungkus); detailSiap(w);
  }
  function daftarProvinsi() {
    var p = indeks.provinsi, totalAgama = Array(8).fill(0);
    Object.values(p).forEach(function (q) { q.agama.forEach(function (n, i) { totalAgama[i] += n; }); });
    var r = document.getElementById('ringkasan-indonesia'); r.classList.add('enam');
    r.append(
      kartu('Provinsi', indeks.total.provinsi, 'Seluruh Indonesia', function () { document.getElementById('daftar-provinsi').scrollIntoView(); }),
      kartu('Kabupaten / kota', indeks.total.kabupaten, 'Klik untuk membuka daftar', bukaDaftarNasional),
      kartu('Kecamatan', indeks.total.kecamatan, indeks.kecamatanTanpaIdentitas + ' entri sumber tanpa identitas', bukaDaftarNasional),
      kartu('Desa / kelurahan', indeks.total.desa, indeks.entriSumberTanpaIdentitas + ' entri sumber tanpa identitas', bukaDaftarNasional),
      kartu('Bahasa', indeks.total.bahasa, 'Dalam katalog Pemetaan', function () { gantiTab('bahasa'); }),
      kartu('Penduduk', totalAgama[0], 'Dukcapil · bukan total agama', function () { gantiTab('agama'); })
    );
    var cari = document.getElementById('cari-provinsi'), t = document.getElementById('daftar-provinsi');
    function gambar() {
      t.replaceChildren(); var kata = cari.value.toLocaleLowerCase('id-ID').trim();
      Object.entries(p).filter(function (x) { return !kata || x[1].nama.toLocaleLowerCase('id-ID').includes(kata) || x[0].includes(kata); }).forEach(function (x) {
        var pk = x[0], q = x[1], tr = el('tr'), th = el('th'); th.scope = 'row';
        var b = el('button', 'tombol-nama', q.nama); b.type = 'button'; b.addEventListener('click', function () { bukaProvinsi(pk); }); th.appendChild(b); tr.appendChild(th);
        [q.kab, q.kec, q.desa].forEach(function (n) { var td = el('td'), a = el('button', 'tombol-angka', angka(n)); a.type = 'button'; a.addEventListener('click', function () { bukaProvinsi(pk); }); td.appendChild(a); tr.appendChild(td); });
        tr.appendChild(el('td', '', angka(q.agama[0]))); var aksi = el('td'), buka = el('button', 'tombol kecil', 'Buka'); buka.type = 'button'; buka.addEventListener('click', function () { bukaProvinsi(pk); }); aksi.appendChild(buka); tr.appendChild(aksi); t.appendChild(tr);
      });
      if (!t.children.length) { var tr = el('tr'), td = el('td', 'tanpa-hasil', 'Provinsi tidak ditemukan.'); td.colSpan = 6; tr.appendChild(td); t.appendChild(tr); }
    }
    cari.addEventListener('input', gambar); gambar();
  }
  function dapatKunci() { try { return localStorage.getItem(KUNCI) || ''; } catch (e) { return ''; } }
  function mintaKunci() {
    if (dapatKunci()) { return Promise.resolve(true); }
    var k = window.prompt('Masukkan kode database Pemetaan untuk membaca data tersimpan dan katalog media.\nKode disimpan hanya di peramban ini.');
    if (!k) { return Promise.resolve(false); }
    try { localStorage.setItem(KUNCI, k.trim()); } catch (e) { /* peramban dapat membatasi penyimpanan */ }
    return panggilWorker('cek', 15000).then(function () { return true; }).catch(function () {
      try { localStorage.removeItem(KUNCI); } catch (e) { /* abaikan */ }
      pesanMedia('Kode database ditolak. Coba Ganti kode database.', true); return false;
    });
  }
  function panggilWorker(aksi, batas) {
    var pengatur = new AbortController(), timer = setTimeout(function () { pengatur.abort(); }, batas || 90000);
    return fetch(URL_WORKER, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ aksi: aksi, kunci: dapatKunci() }), signal: pengatur.signal }).then(function (r) { return r.json(); }).then(function (h) {
      if (!h.ok) { throw new Error(h.pesan || 'Worker menolak permintaan.'); } return h;
    }).finally(function () { clearTimeout(timer); });
  }
  function muatMedia(manual) {
    return mintaKunci().then(function (ok) {
      if (!ok) { pesanMedia('Kode database diperlukan untuk membaca media.'); return null; }
      pesanMedia('Membaca data tersimpan…'); document.getElementById('muat-media').disabled = true;
      var janjiTersimpan = panggilWorker('ambilSemua').then(function (h) { tersimpan = bersihkanDaftar(h.anggota); }).catch(function (e) { tersimpan = []; pesanMedia(e.message, true); });
      var janjiKatalog = panggilWorker('tarikRumahweb').then(function (h) { katalog = h.anggota; gagalMedia = h.gagal || []; }).catch(function (e) { katalog = null; gagalMedia = []; pesanMedia('Katalog API tidak dapat dibaca: ' + e.message, true); });
      return Promise.all([janjiTersimpan, janjiKatalog]).then(function () {
        gambarMedia(); gambarBahasa(); pesanMedia((katalog ? 'Katalog API diperbarui. ' : 'Katalog API belum tersedia; data tersimpan dimuat. ') + tersimpan.length + ' record media; tidak ada data yang ditulis ke TokoMedia.');
      }).finally(function () { document.getElementById('muat-media').disabled = false; });
    });
  }
  function mediaPerKategori(daftar, kategori, bahasaNama, pk) {
    return daftar.filter(function (a) {
      return a.kategori === kategori && (!bahasaNama || normal(bahasa(a)) === normal(bahasaNama)) &&
        (!bahasaNama || ['Film Isa Al-Masih', 'Film Ikatan Ilahi', 'Video Kitab Suci'].indexOf(kategori) < 0 || kode(a) === pk);
    });
  }
  function daftarMedia(daftar, judul) {
    var d = el('div', 'kelompok'); d.appendChild(el('h3', '', judul + ' · ' + daftar.length + ' record'));
    if (!daftar.length) { d.appendChild(el('p', 'kecil', 'Tidak ada record pada kategori ini.')); return d; }
    var u = el('ul', 'daftar-media'); daftar.forEach(function (a) {
      var li = el('li'), nama = el('strong', '', a.nama); li.appendChild(nama);
      li.appendChild(el('small', '', (bahasa(a) || 'Bukan record per bahasa') + ' · ' + (rincian(a, 'Provinsi') || rincian(a, 'Gugus') || rincian(a, 'Wilayah') || a.provinsi || 'Provinsi tidak tersedia')));
      var url = sumber(a); if (/^https:\/\//.test(url)) { var link = el('a', 'tautan', 'Buka sumber ↗'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; li.appendChild(link); }
      var r = (a.rincian || []).filter(function (x) { return ['Jumlah video', 'Jumlah aplikasi'].indexOf(x.label) >= 0; });
      r.forEach(function (x) { li.appendChild(el('small', '', x.label + ': ' + x.nilai)); }); u.appendChild(li);
    }); d.appendChild(u); return d;
  }
  function bukaJenisMedia(m) {
    bukaDetail(m, 'KATALOG API TOKOMEDIA', 'Judul/nama bahasa dan jumlah record; bukan perubahan pada sumber.');
    var w = el('div');
    if (!katalog) { w.appendChild(el('p', 'catatan', 'Katalog API belum berhasil dibaca. Gunakan tombol Baca katalog media terbaru untuk mencoba kembali.')); detailSiap(w); return; }
    var daftar = katalog.filter(function (a) { return a.kategori === m; });
    var jumlahIsi = daftar.reduce(function (n, a) {
      var r = (a.rincian || []).find(function (x) { return x.label === 'Jumlah video' || x.label === 'Jumlah aplikasi'; });
      return n + (r ? Number(r.nilai) || 0 : 0);
    }, 0);
    if (m === 'Clip Kitab Suci' || m === 'Aplikasi Kitab Suci') {
      w.appendChild(el('p', 'catatan', 'Jumlah isi yang dilaporkan API: ' + angka(jumlahIsi) + (m === 'Clip Kitab Suci' ? ' video' : ' aplikasi') + '. Jumlah ini berbeda dari jumlah record pada katalog.'));
    }
    w.appendChild(daftarMedia(daftar, m)); detailSiap(w);
  }
  function gambarMedia() {
    var r = document.getElementById('ringkasan-media'); r.replaceChildren();
    var jumlahKatalog = katalog ? katalog.length : null;
    r.append(kartu('Record tersimpan', tersimpan.length, 'Neon · data yang ada di Pemetaan'), kartu('Record katalog API', jumlahKatalog === null ? '—' : jumlahKatalog, katalog ? 'Rumahweb · baca saja' : 'Baca katalog untuk membandingkan'), kartu('Bahasa terpetakan', indeks.total.bahasa, '35 provinsi tercatat; 3 tanpa entri'), kartu('Media tanpa provinsi', katalog ? katalog.filter(function (a) { return !kode(a); }).length : '—', 'Tidak ditebak lokasinya'));
    var k = document.getElementById('media-kategori'); k.replaceChildren();
    var d = el('div', 'kategori-grid'); MEDIA.forEach(function (m) {
      var c = el('article', 'kategori'), n = tersimpan.filter(function (a) { return a.kategori === m; }).length;
      c.appendChild(el('h3', '', m)); var b = el('button', 'tombol-nama'); b.type = 'button'; b.appendChild(el('strong', '', katalog ? katalog.filter(function (a) { return a.kategori === m; }).length : n)); b.addEventListener('click', function () { bukaJenisMedia(m); }); c.appendChild(b);
      c.appendChild(el('small', '', (katalog ? 'record katalog API' : 'record tersimpan') + ' · klik untuk judul/nama')); if (katalog) { c.appendChild(el('small', '', n + ' record tersimpan')); } d.appendChild(c);
    }); k.appendChild(d);
    var tanpa = document.getElementById('media-tanpa-provinsi'); tanpa.replaceChildren();
    if (katalog) {
      var dTanpa = katalog.filter(function (a) { return !kode(a); }); tanpa.appendChild(kotakJudul('Media tanpa provinsi', 'Tetap ditampilkan sebagai sumber/gugus, bukan dipetakan secara perkiraan.')); tanpa.appendChild(daftarMedia(dTanpa, 'Tidak terpetakan per provinsi'));
      if (gagalMedia.length) { tanpa.appendChild(el('p', 'catatan', 'Peringatan pembacaan API: ' + gagalMedia.join(' · '))); }
    }
  }
  function gambarBahasaProvinsi(pk) {
    var d = document.getElementById('daftar-bahasa'), p = indeks.provinsi[pk];
    var kata = document.getElementById('cari-bahasa').value.toLocaleLowerCase('id-ID').trim();
    var namaBahasa = (bahasaSuku[pk].bahasa || []).filter(function (n) { return !kata || normal(n).includes(kata) || p.nama.toLocaleLowerCase('id-ID').includes(kata); });
    if (kata && !namaBahasa.length && !p.nama.toLocaleLowerCase('id-ID').includes(kata)) { return; }
    var c = el('article', 'bahasa-kartu'); c.id = 'bahasa-' + pk;
    var b = el('button', 'bahasa-kepala'); b.type = 'button'; b.setAttribute('aria-expanded', bahasaTerbuka[pk] ? 'true' : 'false');
    b.append(el('strong', '', p.nama), el('span', 'jumlah', namaBahasa.length + ' bahasa'));
    var panah = el('span', 'panah', bahasaTerbuka[pk] ? '−' : '+'); b.appendChild(panah);
    var isi = el('div', 'bahasa-isi'); isi.hidden = !bahasaTerbuka[pk];
    if (!namaBahasa.length) { isi.appendChild(el('p', 'catatan', 'Belum ada bahasa pada katalog 430 bahasa untuk provinsi ini. Ini bukan bukti tidak ada bahasa daerah.')); }
    if (!katalog) { isi.appendChild(el('p', 'catatan', 'Baca katalog API untuk membandingkan bahasa yang sudah/belum tercatat. Daftar bahasa tetap dapat dilihat.')); }
    namaBahasa.forEach(function (nama) {
      var r = el('div', 'bahasa-baris'), kiri = el('div'); kiri.appendChild(el('strong', '', nama));
      var kanan = el('div'), film = ['Film Isa Al-Masih', 'Film Ikatan Ilahi', 'Video Kitab Suci'];
      isi.appendChild(el('p', 'kecil', 'Clip/Aplikasi bersifat nasional/gugus; tidak dihitung sebagai media spesifik bahasa di bawah.'));
      film.forEach(function (m) {
        var dalamKatalog = katalog && mediaPerKategori(katalog, m, nama, pk);
        var dalamSimpan = mediaPerKategori(tersimpan, m, nama, pk);
        var chip = el('span', 'chip ' + (dalamKatalog && dalamKatalog.length ? 'ada' : 'kosong'), m.replace(' Kitab Suci', '') + (dalamKatalog ? ': ' + (dalamKatalog.length ? 'ada di API (' + dalamKatalog.length + ')' : 'belum tercatat di API') : ': belum dibandingkan'));
        kanan.appendChild(chip);
        if (dalamSimpan.length) { kanan.appendChild(el('span', 'chip media', 'tersimpan ' + dalamSimpan.length)); }
      });
      var khusus = katalog ? katalog.filter(function (a) {
        return ['Clip Kitab Suci', 'Aplikasi Kitab Suci'].indexOf(a.kategori) >= 0 && (rincian(a, 'Bahasa') || rincian(a, 'Gugus') || rincian(a, 'Wilayah'));
      }) : [];
      r.append(kiri, kanan); isi.appendChild(r);
    });
    b.addEventListener('click', function () { bahasaTerbuka[pk] = isi.hidden; isi.hidden = !isi.hidden; b.setAttribute('aria-expanded', isi.hidden ? 'false' : 'true'); panah.textContent = isi.hidden ? '+' : '−'; });
    c.append(b, isi); d.appendChild(c);
  }
  function gambarBahasa() {
    var d = document.getElementById('daftar-bahasa'); if (!d) { return; }
    d.replaceChildren();
    Object.keys(indeks.provinsi).forEach(gambarBahasaProvinsi);
    if (!d.children.length) { d.appendChild(el('p', 'tanpa-hasil', 'Bahasa atau provinsi tidak ditemukan dalam katalog.')); }
  }
  function gantiTab(nama) {
    tab = nama; document.querySelectorAll('.tab').forEach(function (b) { var aktif = b.dataset.tab === nama; b.classList.toggle('aktif', aktif); b.setAttribute('aria-selected', aktif ? 'true' : 'false'); b.tabIndex = aktif ? 0 : -1; });
    document.querySelectorAll('.panel').forEach(function (p) { p.hidden = p.id !== 'panel-' + nama; });
    if (nama === 'bahasa') { gambarMedia(); gambarBahasa(); }
  }
  function gambarAgama() {
    var total = Array(8).fill(0), prov = Object.values(indeks.provinsi); prov.forEach(function (p) { p.agama.forEach(function (n, i) { total[i] += n; }); });
    var r = document.getElementById('ringkasan-agama'); r.appendChild(el('h2', '', 'Penduduk Indonesia: ' + angka(total[0]) + ' jiwa')); r.appendChild(agama(total));
    r.appendChild(el('p', 'catatan', 'Tujuh kategori agama/kepercayaan dilaporkan terpisah. Jumlah antar kategori tidak dijumlahkan sebagai satu “total agama”. Perubahan administrasi dapat membuat jumlah rincian tingkat bawah berbeda dari total provinsi.'));
    var d = document.getElementById('agama-provinsi'); prov = Object.entries(indeks.provinsi);
    prov.forEach(function (x) {
      var pk = x[0], p = x[1], c = el('article', 'agama-kartu'); c.appendChild(el('h3', '', p.nama)); c.appendChild(agama(p.agama, true));
      var b = el('button', 'tombol kecil', 'Lihat bahasa & kawasan suku'); b.type = 'button'; b.addEventListener('click', function () { bukaProvinsi(pk); }); c.appendChild(b); d.appendChild(c);
    });
    ambilSuku();
  }
  function ambilSuku() {
    var semua = {};
    Object.entries(bahasaSuku).forEach(function (x) { x[1].suku.forEach(function (s) {
      if (!semua[s.nama]) { semua[s.nama] = {}; }
      semua[s.nama][x[0]] = s.kawasan;
    }); });
    var d = document.getElementById('daftar-suku'); Object.entries(semua).forEach(function (x) {
        var c = el('article', 'suku-kartu'), b = el('button', 'suku-kepala'), isi = el('div', 'suku-isi'); b.type = 'button'; isi.hidden = true;
        b.append(el('strong', '', x[0]), el('span', 'jumlah', Object.keys(x[1]).length + ' provinsi'), el('span', 'panah', '+'));
        Object.entries(x[1]).forEach(function (y) { isi.appendChild(el('p', '', indeks.provinsi[y[0]].nama + ' — ' + y[1].join(', '))); });
        isi.appendChild(el('p', 'catatan', 'Kawasan utama BPS SP2010; bukan daftar seluruh suku atau tempat tinggal individu.'));
        b.addEventListener('click', function () { isi.hidden = !isi.hidden; b.lastChild.textContent = isi.hidden ? '+' : '−'; }); c.append(b, isi); d.appendChild(c);
    });
  }
  function gambarSumber() {
    var d = document.getElementById('info-sumber');
    var a = el('article', 'kotak'); a.appendChild(el('h3', '', 'Dukcapil Kemendagri'));
    a.appendChild(el('p', '', 'Penduduk, agama, dan wilayah administratif. Data lokal diambil ' + indeks.sumber.wilayah + ' (wilayah) dan ' + indeks.sumber.agama + ' (agama).'));
    a.appendChild(el('p', '', '38 provinsi · 514 kabupaten/kota · ' + angka(indeks.total.kecamatan) + ' kecamatan bernama · ' + angka(indeks.total.desa) + ' desa/kelurahan bernama.'));
    a.appendChild(el('p', 'catatan', 'Layanan sumber melaporkan ' + angka(indeks.kecamatanSumber) + ' record kecamatan dan ' + angka(indeks.desaSumber) + ' record desa. Setelah duplikat identik disajikan satu kali, terdapat ' + angka(indeks.total.kecamatan) + ' kecamatan unik dan ' + angka(indeks.total.desa) + ' desa unik yang dapat dirinci. Sebanyak ' + indeks.kecamatanTanpaIdentitas + ' kecamatan dan ' + indeks.entriSumberTanpaIdentitas + ' desa tidak memiliki nama/kode/geometri, sehingga ditampilkan sebagai jumlah entri kosong, bukan diberi identitas rekaan.'));
    var b = el('article', 'kotak'); b.appendChild(el('h3', '', 'Bahasa, media & suku'));
    b.appendChild(el('p', '', '430 nama bahasa dari katalog Pemetaan. Tiga provinsi tidak memiliki entri pada katalog ini: Riau, Kepulauan Riau, dan DI Yogyakarta. Ini bukan klaim bahwa bahasa daerah tidak ada.'));
    b.appendChild(el('p', '', 'Media dibaca dari API TokoMedia melalui Rumahweb/Worker, baca saja. Data tersimpan berasal dari Neon. Nama media ditampilkan apa adanya; entri tanpa provinsi tidak ditebak.'));
    b.appendChild(el('p', '', 'Suku: 28 kelompok BPS Sensus Penduduk 2010 dan kawasan utamanya. Bukan daftar seluruh suku Indonesia, bukan tempat tinggal individu.'));
    var c = el('article', 'kotak'); c.appendChild(el('h3', '', 'Pembaruan data'));
    c.appendChild(el('p', '', 'Media: klik Baca katalog media terbaru pada tab Bahasa & media. Hanya membaca API; tidak menulis ke TokoMedia. Gunakan Update di panel Anggota bila katalog baru juga ingin disimpan ke Pemetaan.'));
    var pre = el('pre'); pre.style.whiteSpace = 'pre-wrap'; pre.style.fontSize = '11px'; pre.textContent = 'node alat/perbarui-datapemetaan.js';
    c.appendChild(el('p', '', 'Dukcapil: jalankan alat pembaruan manual berikut dari folder proyek. Alat mencadangkan sumber lama, mengambil atribut baru, memvalidasi hierarki, dan membangkitkan ulang indeks laporan:')); c.appendChild(pre);
    c.appendChild(el('p', '', 'Tidak ada pengunduhan seluruh Dukcapil setiap halaman dibuka. Rincian dimuat per provinsi/kabupaten/kecamatan saat diklik.'));
    var e = el('article', 'kotak'); e.appendChild(el('h3', '', 'Batas sumber'));
    e.appendChild(el('p', '', indeks.desaTanpaIndukKecamatan + ' desa memiliki kode kecamatan yang tidak tercatat pada tingkat kecamatan; kelompoknya ditandai sebagai induk tidak tercatat. Tidak ada pemindahan wilayah berdasarkan tebakan.'));
    e.appendChild(el('p', '', indeks.desaTanpaPenduduk + ' desa memiliki null pada penduduk peta dan total 0 pada agama. Persentase tidak dihitung bila pembaginya nol.'));
    e.appendChild(el('p', '', 'Terdapat ' + (indeks.kecamatanDuplikatIdentik || 0) + ' kecamatan dan ' + (indeks.desaDuplikatIdentik || 0) + ' desa dengan baris sumber yang identik. Baris yang benar-benar sama disajikan satu kali; rekaman mentah tetap dijelaskan di atas.'));
    e.appendChild(el('p', '', 'Angka Dukcapil berbasis administrasi kependudukan; tidak disamakan dengan proyeksi BPS. Data tidak tersedia ditandai —, bukan diisi angka perkiraan.')); d.append(a, b, c, e);
  }
  function pasang() {
    document.querySelectorAll('.tab').forEach(function (b) {
      b.addEventListener('click', function () { gantiTab(b.dataset.tab); });
      b.addEventListener('keydown', function (e) {
        if (['ArrowLeft', 'ArrowRight'].indexOf(e.key) < 0) { return; }
        var tombol = Array.from(document.querySelectorAll('.tab')), i = tombol.indexOf(b), arah = e.key === 'ArrowRight' ? 1 : -1;
        e.preventDefault(); var tujuan = tombol[(i + arah + tombol.length) % tombol.length]; gantiTab(tujuan.dataset.tab); tujuan.focus();
      });
    });
    document.getElementById('tutup-detail').addEventListener('click', tutupDetail);
    document.querySelector('.latar-detail').addEventListener('click', tutupDetail);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !elDetail.hidden) { tutupDetail(); }
      if (e.key === 'Tab' && !elDetail.hidden) {
        var fokus = Array.from(elDetail.querySelectorAll('button, a[href], input, select, [tabindex="0"]')).filter(function (x) { return !x.disabled && x.getClientRects().length; });
        if (!fokus.length) { return; }
        var pertama = fokus[0], terakhir = fokus[fokus.length - 1];
        if (e.shiftKey && document.activeElement === pertama) { e.preventDefault(); terakhir.focus(); }
        else if (!e.shiftKey && document.activeElement === terakhir) { e.preventDefault(); pertama.focus(); }
      }
    });
    document.getElementById('muat-media').addEventListener('click', function () { muatMedia(true); });
    document.getElementById('cari-bahasa').addEventListener('input', function () {
      var kata = document.getElementById('cari-bahasa').value.toLocaleLowerCase('id-ID').trim();
      Object.keys(indeks.provinsi).forEach(function (pk) {
        bahasaTerbuka[pk] = !!kata && (bahasaSuku[pk].bahasa.some(function (n) { return normal(n).includes(kata); }) || indeks.provinsi[pk].nama.toLocaleLowerCase('id-ID').includes(kata));
      });
      gambarBahasa();
    });
    document.getElementById('ganti-kunci').addEventListener('click', function () {
      if (!window.confirm('Ganti kode database pada peramban ini? Kode lama akan dihapus.')) { return; }
      try { localStorage.removeItem(KUNCI); } catch (e) { /* penyimpanan peramban tidak tersedia */ }
      katalog = null; tersimpan = []; gambarMedia(); muatMedia(true);
    });
  }
  function mulai() {
    pasang(); Promise.all([ambil('indeks.json'), ambil('bahasa-suku.json')]).then(function (d) {
      indeks = d[0]; bahasaSuku = d[1]; status('');
      document.getElementById('status-sumber').textContent = 'Dukcapil ' + indeks.sumber.wilayah + ' · rincian dimuat saat diklik';
      daftarProvinsi(); gambarAgama(); gambarSumber(); gantiTab('wilayah');
      if (dapatKunci()) { muatMedia(false); }
    }).catch(function (e) { status('Laporan tidak dapat dimuat: ' + e.message, true); });
  }
  mulai();
})();
