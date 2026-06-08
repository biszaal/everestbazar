-- EverestBazar — Row Level Security policies

-- Enable RLS on all tables
alter table public.profiles     enable row level security;
alter table public.listings     enable row level security;
alter table public.transactions enable row level security;
alter table public.conversations enable row level security;
alter table public.messages     enable row level security;
alter table public.reviews      enable row level security;

-- PROFILES policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- LISTINGS policies
create policy "Active listings viewable by everyone"
  on public.listings for select
  using (status != 'DELETED');

create policy "Verified users can create listings"
  on public.listings for insert
  with check (
    auth.uid() = seller_id and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and kyc_status = 'VERIFIED'
    )
  );

create policy "Sellers can update own listings"
  on public.listings for update
  using (auth.uid() = seller_id);

-- TRANSACTIONS policies
create policy "Parties can view own transactions"
  on public.transactions for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Verified buyers can create transactions"
  on public.transactions for insert
  with check (
    auth.uid() = buyer_id and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and kyc_status = 'VERIFIED'
    )
  );

create policy "Parties can update own transactions"
  on public.transactions for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- CONVERSATIONS policies
create policy "Participants can view own conversations"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Authenticated users can create conversations"
  on public.conversations for insert
  with check (auth.uid() = buyer_id);

create policy "Participants can update conversations"
  on public.conversations for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- MESSAGES policies
create policy "Participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

-- REVIEWS policies
create policy "Reviews are public"
  on public.reviews for select using (true);

create policy "Transaction parties can leave reviews"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from public.transactions t
      where t.id = transaction_id
      and t.status = 'COMPLETED'
      and (t.buyer_id = auth.uid() or t.seller_id = auth.uid())
    )
  );
