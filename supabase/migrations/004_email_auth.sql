-- EverestBazar — support email-based auth (chosen instead of phone OTP, which
-- requires an external SMS provider). Email users have no phone, so phone must
-- become nullable and we add a unique email column. Postgres unique allows many
-- NULLs, so multiple email-only users won't collide on phone.

alter table public.profiles add column if not exists email text unique;
alter table public.profiles alter column phone drop not null;

-- Recreate the signup trigger fn to copy email (and phone when present).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone, email)
  values (new.id, new.phone, new.email);
  return new;
end;
$$ language plpgsql security definer;
