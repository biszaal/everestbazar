-- EverestBazar — initial schema
-- Run in the Supabase dashboard SQL editor (or via `supabase db push`).

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends auth.users — one row per user)
create table public.profiles (
  id           uuid references auth.users on delete cascade primary key,
  phone        text unique not null,
  name         text not null default '',
  kyc_status   text not null default 'NONE'
               check (kyc_status in ('NONE','PENDING','VERIFIED','REJECTED')),
  kyc_rejected_reason text,
  nid_hash     text unique,           -- SHA-256 of NID number, never store plain
  nid_front_path text,                -- Supabase Storage path
  nid_back_path  text,
  selfie_path    text,
  esewa_number   text,
  khalti_number  text,
  trust_score    integer not null default 0 check (trust_score between 0 and 100),
  completed_sales     integer not null default 0,
  completed_purchases integer not null default 0,
  avg_rating          numeric(3,2) not null default 0,
  city         text not null default 'Kathmandu',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- LISTINGS
create table public.listings (
  id           uuid primary key default uuid_generate_v4(),
  seller_id    uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text not null default '',
  category     text not null check (category in ('ELECTRONICS','FASHION','FURNITURE','VEHICLES','OTHER')),
  subcategory  text not null default '',
  condition    text not null check (condition in ('LIKE_NEW','GOOD','FAIR','FOR_PARTS')),
  price_npr    integer not null check (price_npr > 0),  -- integer NPR, never floats
  photo_paths  text[] not null default '{}',            -- Supabase Storage paths, min 3
  status       text not null default 'ACTIVE'
               check (status in ('ACTIVE','RESERVED','SOLD','DELETED')),
  city         text not null default 'Kathmandu',
  views        integer not null default 0,
  accepts_offers boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index listings_category_created_at on public.listings(category, created_at desc);
create index listings_seller_id on public.listings(seller_id);
create index listings_status on public.listings(status);

-- TRANSACTIONS (escrow)
create table public.transactions (
  id               uuid primary key default uuid_generate_v4(),
  buyer_id         uuid not null references public.profiles(id),
  seller_id        uuid not null references public.profiles(id),
  listing_id       uuid not null references public.listings(id),
  price_npr        integer not null,
  platform_fee_npr integer not null,   -- 5% of price
  escrow_fee_npr   integer not null default 100,
  total_npr        integer not null,   -- price + escrow_fee (platform fee from seller)
  status           text not null default 'PENDING_PAYMENT'
                   check (status in (
                     'PENDING_PAYMENT','ESCROW_HELD','DELIVERY_CONFIRMED',
                     'COMPLETED','DISPUTED','REFUNDED','CANCELLED'
                   )),
  payment_method   text check (payment_method in ('ESEWA','KHALTI')),
  payment_ref      text,               -- Gateway transaction ID
  escrow_deadline  timestamptz,        -- 72h after ESCROW_HELD
  delivery_method  text default 'PICKUP' check (delivery_method in ('PICKUP','PATHAO')),
  dispute_reason   text,
  dispute_evidence text[],
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index transactions_buyer_id on public.transactions(buyer_id, created_at desc);
create index transactions_seller_id on public.transactions(seller_id, created_at desc);
create index transactions_status on public.transactions(status);

-- CONVERSATIONS
create table public.conversations (
  id           uuid primary key default uuid_generate_v4(),
  listing_id   uuid references public.listings(id) on delete set null,
  buyer_id     uuid not null references public.profiles(id),
  seller_id    uuid not null references public.profiles(id),
  last_message text,
  last_message_at timestamptz,
  buyer_unread  integer not null default 0,
  seller_unread integer not null default 0,
  created_at   timestamptz not null default now(),
  constraint unique_conversation unique (listing_id, buyer_id, seller_id)
);

create index conversations_buyer_id on public.conversations(buyer_id, last_message_at desc);
create index conversations_seller_id on public.conversations(seller_id, last_message_at desc);

-- MESSAGES
create table public.messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id),
  content         text not null,
  type            text not null default 'TEXT' check (type in ('TEXT','OFFER','SYSTEM')),
  offer_amount_npr integer,
  offer_status    text check (offer_status in ('PENDING','ACCEPTED','DECLINED')),
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

create index messages_conversation_id on public.messages(conversation_id, created_at asc);

-- REVIEWS
create table public.reviews (
  id             uuid primary key default uuid_generate_v4(),
  transaction_id uuid not null references public.transactions(id),
  reviewer_id    uuid not null references public.profiles(id),
  reviewed_id    uuid not null references public.profiles(id),
  rating         integer not null check (rating between 1 and 5),
  comment        text,
  created_at     timestamptz not null default now(),
  constraint one_review_per_transaction unique (transaction_id, reviewer_id)
);

-- FUNCTION: auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at   before update on public.profiles   for each row execute function update_updated_at();
create trigger listings_updated_at   before update on public.listings   for each row execute function update_updated_at();
create trigger transactions_updated_at before update on public.transactions for each row execute function update_updated_at();

-- FUNCTION: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, coalesce(new.phone, ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- FUNCTION: recalculate trust score
create or replace function public.recalculate_trust_score(user_id uuid)
returns void as $$
declare
  p public.profiles%rowtype;
  score integer;
begin
  select * into p from public.profiles where id = user_id;
  score := least(100,
    (p.completed_sales * 8) +
    (p.completed_purchases * 4) +
    (p.avg_rating * 12)::integer +
    case when p.kyc_status = 'VERIFIED' then 30 else 0 end
  );
  update public.profiles set trust_score = score where id = user_id;
end;
$$ language plpgsql security definer;

-- FUNCTION: atomic listing view increment
create or replace function public.increment_views(listing_id uuid)
returns void as $$
  update public.listings set views = views + 1 where id = listing_id;
$$ language sql security definer;
