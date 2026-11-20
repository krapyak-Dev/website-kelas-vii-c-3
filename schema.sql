-- 1) Jalankan seluruh SQL ini di Supabase > SQL Editor > New query.
-- 2) Buat akun admin melalui Authentication > Users > Add user.
-- 3) Setelah akun dibuat, masukkan UUID user ke bagian BOOTSTRAP ADMIN di bawah.

create table if not exists public.site_content (
  id integer primary key check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.site_content (id, content) values (1, '{}'::jsonb)
on conflict (id) do nothing;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.site_admins enable row level security;

-- Konten website boleh dibaca publik.
drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content" on public.site_content
for select to anon, authenticated using (true);

-- Hanya user yang terdaftar di site_admins boleh mengubah konten.
drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content" on public.site_content
for insert to authenticated with check (
  exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);
drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content" on public.site_content
for update to authenticated using (
  exists (select 1 from public.site_admins a where a.user_id = auth.uid())
) with check (
  exists (select 1 from public.site_admins a where a.user_id = auth.uid())
);

-- User hanya boleh melihat status admin miliknya sendiri.
drop policy if exists "Admins can read own admin record" on public.site_admins;
create policy "Admins can read own admin record" on public.site_admins
for select to authenticated using (user_id = auth.uid());

-- Storage bucket untuk foto website.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('class-media', 'class-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880;

drop policy if exists "Public can view class media" on storage.objects;
create policy "Public can view class media" on storage.objects
for select to anon, authenticated using (bucket_id = 'class-media');

drop policy if exists "Admins can upload class media" on storage.objects;
create policy "Admins can upload class media" on storage.objects
for insert to authenticated with check (
  bucket_id = 'class-media' and exists (
    select 1 from public.site_admins a where a.user_id = auth.uid()
  )
);
drop policy if exists "Admins can update class media" on storage.objects;
create policy "Admins can update class media" on storage.objects
for update to authenticated using (
  bucket_id = 'class-media' and exists (
    select 1 from public.site_admins a where a.user_id = auth.uid()
  )
) with check (
  bucket_id = 'class-media' and exists (
    select 1 from public.site_admins a where a.user_id = auth.uid()
  )
);
drop policy if exists "Admins can delete class media" on storage.objects;
create policy "Admins can delete class media" on storage.objects
for delete to authenticated using (
  bucket_id = 'class-media' and exists (
    select 1 from public.site_admins a where a.user_id = auth.uid()
  )
);

-- BOOTSTRAP ADMIN:
-- Setelah membuat akun melalui Authentication > Users, jalankan:
-- insert into public.site_admins (user_id)
-- values ('GANTI_DENGAN_UUID_USER_ADMIN');
-- Tambahkan UUID admin kedua dengan perintah yang sama.
