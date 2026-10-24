/* Laporan manajemen: menampilkan report Data Pemetaan di dalam peta.
   Dashboard lama dibackup di backup/laporan-manajemen-20261024/. */
(function () {
  'use strict';
  var panel = document.getElementById('panel-dashboard');
  var tombol = document.getElementById('tombol-dashboard');
  var bingkai = document.getElementById('dashboard-laporan');
  var status = document.getElementById('dashboard-status');
  var siap = false;

  function buka() {
    if (!panel.hidden) { return; }
    if (window.PD_ANGGOTA && PD_ANGGOTA.tutupPanel) { PD_ANGGOTA.tutupPanel(); }
    if (window.PD_SUKU && PD_SUKU.tutupPanel) { PD_SUKU.tutupPanel(); }
    ['pemilih-warna', 'pemilih-agama', 'pemilih-media', 'cari'].forEach(function (id) {
      var e = document.getElementById(id); if (e) { e.hidden = true; }
    });
    if (!bingkai.dataset.dimuat) {
      status.textContent = 'Memuat Data Pemetaan…';
      bingkai.dataset.dimuat = 'true';
      bingkai.src = bingkai.dataset.sumber;
    }
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    tombol.setAttribute('aria-expanded', 'true');
    setTimeout(function () { if (window.PD && PD.peta) { PD.peta.resize(); } }, 0);
  }

  function tutup() {
    if (panel.hidden) { return; }
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    tombol.setAttribute('aria-expanded', 'false');
    tombol.focus();
    setTimeout(function () { if (window.PD && PD.peta) { PD.peta.resize(); } }, 0);
  }

  function mulai() {
    if (siap || !panel || !tombol || !bingkai) { return; }
    siap = true;
    tombol.setAttribute('aria-expanded', 'false');
    tombol.setAttribute('aria-label', 'Laporan manajemen Data Pemetaan');
    tombol.title = 'Laporan manajemen Data Pemetaan';
    tombol.addEventListener('click', function () { panel.hidden ? buka() : tutup(); });
    document.getElementById('dashboard-tutup').addEventListener('click', tutup);
    bingkai.addEventListener('load', function () {
      if (bingkai.dataset.dimuat) { status.textContent = 'Data Pemetaan · target, produk, wilayah, bahasa, suku, dan agama.'; }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { tutup(); } });
    document.addEventListener('click', function (e) {
      if (panel.hidden || panel.contains(e.target) || tombol.contains(e.target)) { return; }
      if (e.target.closest('#panel-anggota, #panel-suku, #pemilih-media, #pemilih-warna, #pemilih-agama, #cari')) { return; }
      tutup();
    });
  }

  window.PD_DASHBOARD = { buka: buka, tutup: tutup, gambar: buka, siap: function () { return siap; } };
  mulai();
})();
