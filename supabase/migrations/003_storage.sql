-- EverestBazar — Storage buckets + policies

-- Public bucket for listing photos (CDN-accessible)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  true,
  5242880,  -- 5MB max per photo
  array['image/jpeg','image/jpg','image/png','image/webp']
)
on conflict (id) do nothing;

-- Private bucket for KYC documents (never public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kyc-documents',
  'kyc-documents',
  false,
  10485760,  -- 10MB max
  array['image/jpeg','image/jpg','image/png','application/pdf']
)
on conflict (id) do nothing;

-- Storage RLS: listing photos
create policy "Anyone can view listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "Verified users can upload listing photos"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-photos' and
    auth.uid() is not null and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and kyc_status = 'VERIFIED'
    )
  );

create policy "Users can delete own listing photos"
  on storage.objects for delete
  using (bucket_id = 'listing-photos' and owner = auth.uid());

-- Storage RLS: KYC documents (user can upload + read own; admin via service role)
create policy "Users can upload own KYC documents"
  on storage.objects for insert
  with check (
    bucket_id = 'kyc-documents' and
    auth.uid() is not null and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view own KYC documents"
  on storage.objects for select
  using (
    bucket_id = 'kyc-documents' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
