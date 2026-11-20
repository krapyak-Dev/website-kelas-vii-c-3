# Website Kelas VII C

Website kelas dengan desain editorial/institusional terinspirasi dari struktur website kampus: hero besar, navigasi, informasi utama, akademik, berita, galeri, kontak, dan footer. Ini bukan salinan aset atau identitas ITB.

## Isi proyek
- `index.html`, `styles.css`, `app.js`: website publik.
- `admin.html`, `admin.css`, `admin.js`: dashboard administrator.
- `config.js`: konfigurasi Project URL dan publishable/anon key Supabase.
- `supabase/schema.sql`: tabel, RLS, bucket Storage, dan kebijakan akses.
- `supabase/functions/send-message/index.ts`: Edge Function notifikasi email melalui Resend.

## A. Buat Supabase baru
1. Buka https://supabase.com/dashboard lalu buat project baru.
2. Buka **SQL Editor > New query**.
3. Salin seluruh isi `supabase/schema.sql`, lalu klik **Run**.
4. Buka **Project Settings > API**. Salin **Project URL** dan **Publishable key** (atau anon public key).
5. Tempel kedua nilai itu ke `config.js`. Jangan pernah memakai `secret` atau `service_role` key di frontend.
6. Buka **Authentication > Users > Add user**. Buat akun admin dengan email dan password.
7. Salin UUID akun itu. Di SQL Editor jalankan:
   ```sql
   insert into public.site_admins (user_id)
   values ('UUID_ADMIN_DI_SINI');
   ```
   Ulangi untuk admin lain bila diperlukan.

## B. Aktifkan notifikasi email
Form pesan mengirim email lewat Supabase Edge Function dan Resend.
1. Buat akun di https://resend.com dan verifikasi domain pengirim untuk penggunaan produksi. Untuk pengujian, Resend dapat membatasi penerima ke alamat akun yang terverifikasi.
2. Install Supabase CLI dan login:
   ```bash
   npm install -g supabase
   supabase login
   ```
3. Dari folder proyek, hubungkan project:
   ```bash
   supabase link --project-ref PROJECT_REF
   ```
   Project ref ada di URL dashboard Supabase.
4. Set secrets (ganti nilainya sendiri; jangan commit API key ke GitHub):
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxx
   supabase secrets set ADMIN_NOTIFICATION_EMAIL=admin@email.com
   ```
5. Deploy function:
   ```bash
   supabase functions deploy send-message
   ```
6. Setelah deploy, uji formulir di website. Periksa inbox dan folder spam email admin.

> Catatan: alamat pengirim `onboarding@resend.dev` cocok untuk uji coba terbatas. Untuk produksi, verifikasi domain sendiri di Resend lalu ganti alamat `from` di `supabase/functions/send-message/index.ts`.

## C. Upload ke GitHub
1. Buat repository GitHub baru, misalnya `website-kelas-vii-c`.
2. Upload seluruh file dan folder proyek ini ke root repository (jangan hanya upload file ZIP).
3. Pastikan `config.js` sudah berisi URL dan publishable key Supabase.
4. Buka **Settings > Pages**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu Save.
5. Tunggu GitHub Pages selesai menerbitkan website.

## D. Menggunakan website
- Website publik: `https://USERNAME.github.io/NAMA-REPOSITORY/`
- Dashboard admin: `https://USERNAME.github.io/NAMA-REPOSITORY/admin.html`
- Login menggunakan akun yang sudah dibuat di Supabase Authentication dan didaftarkan pada tabel `site_admins`.
- Admin bisa mengubah konten, mengatur call center/email, menambah jadwal, agenda, berita, serta mengunggah gambar dari komputer.

## Keamanan
- Publishable/anon key memang digunakan di browser dan dibatasi oleh Row Level Security.
- Jangan pernah menaruh Supabase `service_role`/secret key atau Resend API key di `config.js` atau file frontend.
- Tabel `site_admins` menentukan siapa yang boleh mengubah konten. Buat admin pertama melalui SQL bootstrap di atas.
- Pesan pengunjung dikirim ke Edge Function; kunci Resend hanya disimpan sebagai Supabase Function Secret.
