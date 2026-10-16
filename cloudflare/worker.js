/* Pemetaan — Worker perantara ke database Neon (orderan 7)
   ------------------------------------------------------------------
   TUGAS
     Menjadi perantara antara situs (GitHub Pages) dan database Neon,
     supaya data anggota SAMA di HP dan PC.

   KENAPA HARUS LEWAT WORKER
     Situs Pemetaan hanya berkas statis — kalau alamat + sandi database
     ditanam di JavaScript, siapa pun bisa membacanya lewat "View Source"
     lalu menghapus seluruh data. Sandi disimpan di Worker sebagai
     *secret*, jadi tidak pernah ikut terkirim ke peramban.

   PENGAMANAN
     1. Sandi database hanya ada di secret Worker (DATABASE_URL).
     2. Peran database `pemetaan_api` — HANYA boleh SELECT/INSERT/
        UPDATE/DELETE. Tidak bisa menghapus tabel atau mengubah struktur.
     3. Permintaan hanya diterima dari asal (Origin) yang terdaftar
        di DAFTAR_ASAL.
        4. SETIAP permintaan — termasuk membaca — wajib menyertakan kunci
           aplikasi (secret KUNCI). Kunci tidak ikut tersimpan di kode
           situs, jadi hanya orang yang tahu kuncinya bisa membuka data.

   CARA PAKAI
     Permintaan: POST, isi JSON { aksi, kunci, ... }
     Jawaban   : JSON { ok: true, ... }  atau  { ok: false, pesan }

     aksi:
       ambilSemua                 -> { anggota, kategori, pengaturan }
       simpanAnggota  { anggota } -> { anggota }
       hapusAnggota   { id }
       simpanKategori { nama }
       hapusKategori  { nama }
       simpanAtur     { nama, nilai }
       kosongkan                                  (hapus semua anggota)
       cek                                        (uji sambungan)
*/

import { neon } from '@neondatabase/serverless';

/* Asal yang diizinkan memanggil Worker ini. Tambahkan alamat lain
   (misal alamat uji lokal) di sini, jangan di berkas situs. */
const DAFTAR_ASAL = [
  'https://suwandhih.github.io',
  'http://127.0.0.1:8777',
  'http://localhost:8777'
];

function kepala(asal) {
  return {
    'Access-Control-Allow-Origin': asal || DAFTAR_ASAL[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function balas(data, asal, kode) {
  return new Response(JSON.stringify(data), {
    status: kode || 200,
    headers: kepala(asal)
  });
}

function teks(v, maks) {
  if (v === null || v === undefined) { return ''; }
  return String(v).slice(0, maks || 500);
}

function angka(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function senarai(v) {
  /* Keterangan disimpan sebagai daftar { label, nilai } — sama dengan
     bentuk di js/member.js (bacaRincian). Jangan dijadikan teks, nanti
     tampilannya berubah jadi "[object Object]". */
  if (!Array.isArray(v)) { return []; }
  return v.slice(0, 40).map(function (x) {
    if (x && typeof x === 'object') {
      return { label: teks(x.label, 120), nilai: teks(x.nilai, 400) };
    }
    return { label: teks(x, 120), nilai: '' };
  }).filter(function (x) { return x.label !== '' || x.nilai !== ''; });
}

/* Ubah baris database (snake_case) menjadi objek yang dipakai situs
   (camelCase) — sama seperti objek di js/member.js. */
function keSitus(b) {
  return {
    id: b.id,
    nama: b.nama,
    kategori: b.kategori || '',
    inisial: b.inisial || '',
    rincian: Array.isArray(b.rincian) ? b.rincian : [],
    lon: b.lon === null ? null : Number(b.lon),
    lat: b.lat === null ? null : Number(b.lat),
    kodeProvinsi: b.kode_provinsi || '',
    kodeKabkota: b.kode_kabkota || '',
    kodeKecamatan: b.kode_kecamatan || '',
    kodeDesa: b.kode_desa || '',
    provinsi: b.provinsi || '',
    kabkota: b.kabkota || '',
    kecamatan: b.kecamatan || '',
    desa: b.desa || '',
    dibuat: b.dibuat instanceof Date ? b.dibuat.toISOString() : b.dibuat,
    diubah: b.diubah instanceof Date ? b.diubah.toISOString() : b.diubah
  };
}

export default {
  async fetch(permintaan, env) {
    const asal = permintaan.headers.get('Origin') || '';
    const asalDikenal = DAFTAR_ASAL.indexOf(asal) >= 0 ? asal : null;

    if (permintaan.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: kepala(asalDikenal) });
    }
    if (permintaan.method !== 'POST') {
      return balas({ ok: false, pesan: 'Hanya menerima POST.' }, asalDikenal, 405);
    }
    if (!asalDikenal) {
      return balas({ ok: false, pesan: 'Asal tidak diizinkan: ' + (asal || 'kosong') }, null, 403);
    }
    if (!env.DATABASE_URL) {
      return balas({ ok: false, pesan: 'DATABASE_URL belum diisi di Worker.' }, asalDikenal, 500);
    }

    let isi;
    try {
      isi = await permintaan.json();
    } catch (e) {
      return balas({ ok: false, pesan: 'Isi permintaan bukan JSON.' }, asalDikenal, 400);
    }

    const aksi = teks(isi.aksi, 40);
    const sql = neon(env.DATABASE_URL);

    /* Semua aksi wajib memakai kunci aplikasi. Data anggota bersifat internal,
       jadi tidak boleh bisa dibaca orang lain walau alamat Worker diketahui. */
        if (!env.KUNCI || teks(isi.kunci, 200) !== env.KUNCI) {
          return balas({ ok: false, pesan: 'Kunci aplikasi salah.' }, asalDikenal, 401);
        }

    try {
      if (aksi === 'cek') {
        const r = await sql`select count(*)::int as n from anggota`;
        return balas({ ok: true, pesan: 'tersambung', jumlah: r[0].n }, asalDikenal);
      }

      if (aksi === 'ambilSemua') {
        const a = await sql`select * from anggota order by dibuat`;
        const k = await sql`select nama from kategori order by nama`;
        const p = await sql`select nama, nilai from pengaturan`;
        return balas({
          ok: true,
          anggota: a.map(keSitus),
          kategori: k.map(function (r) { return r.nama; }),
          pengaturan: p.reduce(function (o, r) { o[r.nama] = r.nilai; return o; }, {})
        }, asalDikenal);
      }

      if (aksi === 'simpanAnggota') {
        const g = isi.anggota || {};
        const id = teks(g.id, 60);
        if (!id) { return balas({ ok: false, pesan: 'id anggota kosong.' }, asalDikenal, 400); }
        if (!teks(g.nama, 200)) { return balas({ ok: false, pesan: 'nama anggota kosong.' }, asalDikenal, 400); }

        const baris = await sql`
          insert into anggota (
            id, nama, kategori, inisial, rincian, lon, lat,
            kode_provinsi, kode_kabkota, kode_kecamatan, kode_desa,
            provinsi, kabkota, kecamatan, desa, dibuat, diubah
          ) values (
            ${id}, ${teks(g.nama, 200)}, ${teks(g.kategori, 100)}, ${teks(g.inisial, 3)},
            ${JSON.stringify(senarai(g.rincian))}::jsonb,
            ${angka(g.lon)}, ${angka(g.lat)},
            ${teks(g.kodeProvinsi, 20)}, ${teks(g.kodeKabkota, 20)},
            ${teks(g.kodeKecamatan, 20)}, ${teks(g.kodeDesa, 20)},
            ${teks(g.provinsi, 200)}, ${teks(g.kabkota, 200)},
            ${teks(g.kecamatan, 200)}, ${teks(g.desa, 200)},
            ${g.dibuat || new Date().toISOString()}::timestamptz,
            ${g.diubah || new Date().toISOString()}::timestamptz
          )
          on conflict (id) do update set
            nama = excluded.nama, kategori = excluded.kategori,
            inisial = excluded.inisial, rincian = excluded.rincian,
            lon = excluded.lon, lat = excluded.lat,
            kode_provinsi = excluded.kode_provinsi,
            kode_kabkota = excluded.kode_kabkota,
            kode_kecamatan = excluded.kode_kecamatan,
            kode_desa = excluded.kode_desa,
            provinsi = excluded.provinsi, kabkota = excluded.kabkota,
            kecamatan = excluded.kecamatan, desa = excluded.desa,
            diubah = excluded.diubah
          returning *`;
        return balas({ ok: true, anggota: keSitus(baris[0]) }, asalDikenal);
      }

      if (aksi === 'hapusAnggota') {
        const id = teks(isi.id, 60);
        if (!id) { return balas({ ok: false, pesan: 'id anggota kosong.' }, asalDikenal, 400); }
        await sql`delete from anggota where id = ${id}`;
        return balas({ ok: true, id: id }, asalDikenal);
      }

      if (aksi === 'kosongkan') {
        await sql`delete from anggota`;
        return balas({ ok: true }, asalDikenal);
      }

      if (aksi === 'simpanKategori') {
        const nama = teks(isi.nama, 100);
        if (!nama) { return balas({ ok: false, pesan: 'nama kategori kosong.' }, asalDikenal, 400); }
        await sql`insert into kategori (nama) values (${nama}) on conflict (nama) do nothing`;
        return balas({ ok: true, nama: nama }, asalDikenal);
      }

      if (aksi === 'hapusKategori') {
        const nama = teks(isi.nama, 100);
        await sql`delete from kategori where nama = ${nama}`;
        return balas({ ok: true, nama: nama }, asalDikenal);
      }

      if (aksi === 'simpanAtur') {
        const nama = teks(isi.nama, 100);
        const nilai = teks(isi.nilai, 2000);
        await sql`
          insert into pengaturan (nama, nilai) values (${nama}, ${nilai})
          on conflict (nama) do update set nilai = excluded.nilai`;
        return balas({ ok: true, nama: nama, nilai: nilai }, asalDikenal);
      }

      return balas({ ok: false, pesan: 'Aksi tidak dikenal: ' + aksi }, asalDikenal, 400);
    } catch (e) {
      return balas({ ok: false, pesan: 'Galat database: ' + e.message }, asalDikenal, 500);
    }
  }
};