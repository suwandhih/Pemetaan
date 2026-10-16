/* Pemetaan — menyiapkan database Neon (orderan 7)
   ------------------------------------------------------------------
   Membuat tabel + peran khusus untuk aplikasi.

   Tabel:
     anggota     — data anggota (sama dengan objek di js/member.js)
     kategori    — daftar kategori anggota
     pengaturan  — setelan aplikasi

   Peran:
     pemetaan_api — dipakai HANYA oleh Worker Cloudflare. Bukan
     neondb_owner, supaya kalau kuncinya bocor tidak bisa
     menghapus tabel atau mengubah struktur database.

   Jalankan: node alat/neon-siapkan.js <password-neondb_owner> <password-pemetaan_api>
*/
const { Client } = require('../cloudflare/node_modules/pg');

const HOST = process.env.NEON_HOST || 'ep-floral-fog-azhi1lbp-pooler.c-3.ap-southeast-1.aws.neon.tech';

const PEMILIK = process.argv[2];
const SANDI_API = process.argv[3];

const SQL = [
  `do $$ begin
     if not exists (select 1 from pg_roles where rolname = 'pemetaan_api') then
       create role pemetaan_api with login password '${SANDI_API}';
     else
       alter role pemetaan_api with login password '${SANDI_API}';
     end if;
   end $$;`,

  `create table if not exists anggota (
     id            text primary key,
     nama          text not null,
     kategori      text default '',
     inisial       text default '',
     rincian       text[] default '{}',
     lon           double precision,
     lat           double precision,
     kode_provinsi text default '',
     kode_kabkota  text default '',
     kode_kecamatan text default '',
     kode_desa     text default '',
     provinsi      text default '',
     kabkota       text default '',
     kecamatan     text default '',
     desa          text default '',
     dibuat        timestamptz default now(),
     diubah        timestamptz default now()
   );`,

  `create table if not exists kategori (
     nama text primary key
   );`,

  `create table if not exists pengaturan (
     nama  text primary key,
     nilai text default ''
   );`,

  `create index if not exists anggota_kode_provinsi_idx on anggota (kode_provinsi);
   create index if not exists anggota_kode_kabkota_idx  on anggota (kode_kabkota);
   create index if not exists anggota_kode_kecamatan_idx on anggota (kode_kecamatan);
   create index if not exists anggota_kode_desa_idx     on anggota (kode_desa);
   create index if not exists anggota_kategori_idx      on anggota (kategori);`,

  `grant usage on schema public to pemetaan_api;
   grant select, insert, update, delete on anggota    to pemetaan_api;
   grant select, insert, update, delete on kategori   to pemetaan_api;
   grant select, insert, update, delete on pengaturan to pemetaan_api;`,

  `insert into kategori (nama) values
     ('Yayasan'), ('Sekolah'), ('Kesehatan'), ('Sosial'),
     ('Pemerintahan'), ('Lainnya')
   on conflict (nama) do nothing;`
];

async function main() {
  if (!PEMILIK || !SANDI_API) {
    console.log('PEMAKAIAN: node alat/neon-siapkan.js <password-neondb_owner> <password-pemetaan_api>');
    process.exit(1);
  }
  const c = new Client({
    host: HOST,
    port: 5432,
    user: 'neondb_owner',
    password: PEMILIK,
    database: 'neondb',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000
  });
  await c.connect();
  for (const s of SQL) {
    await c.query(s);
  }
  const t = await c.query(
    "select table_name from information_schema.tables where table_schema='public' order by table_name"
  );
  console.log('TABEL:', t.rows.map((r) => r.table_name).join(', '));
  const n = await c.query('select count(*)::int as n from kategori');
  console.log('KATEGORI:', n.rows[0].n);
  const r = await c.query("select rolname from pg_roles where rolname='pemetaan_api'");
  console.log('PERAN pemetaan_api:', r.rowCount ? 'ada' : 'TIDAK ADA');
  await c.end();
  console.log('SELESAI');
}

main().catch((e) => {
  console.log('GAGAL:', e.message);
  process.exit(1);
});