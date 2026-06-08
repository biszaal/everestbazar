-- EverestBazar — security hardening (addresses RLS review findings #1, #2, #3).
-- Run after 001–004.

-- ── #1: users must NOT be able to self-verify or inflate their own stats ──
-- Owner can still update name / city / payout numbers; everything trust/KYC
-- related is mutable only by the service role (admin) or SECURITY DEFINER fns.
revoke update (
  kyc_status, kyc_rejected_reason, nid_hash,
  nid_front_path, nid_back_path, selfie_path,
  trust_score, completed_sales, completed_purchases, avg_rating
) on public.profiles from authenticated;

-- ── #2: never expose KYC documents / identity columns to clients ──
-- (Public reads already select only safe columns; this is defense in depth.)
revoke select (
  nid_hash, nid_front_path, nid_back_path, selfie_path, phone, email
) on public.profiles from anon, authenticated;

-- ── #3: transactions are created / transitioned only via validated RPCs ──
drop policy if exists "Verified buyers can create transactions" on public.transactions;
drop policy if exists "Parties can update own transactions" on public.transactions;
revoke insert, update on public.transactions from anon, authenticated;

-- create a transaction: server computes the fees from the listing price, so the
-- client cannot spoof price_npr / total_npr.
create or replace function public.create_transaction(p_listing_id uuid, p_payment text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_buyer uuid := auth.uid();
  v_listing public.listings%rowtype;
  v_txn_id uuid;
begin
  if v_buyer is null then raise exception 'auth required'; end if;
  if not exists (select 1 from public.profiles where id = v_buyer and kyc_status = 'VERIFIED') then
    raise exception 'buyer not verified';
  end if;
  select * into v_listing from public.listings where id = p_listing_id;
  if not found or v_listing.status <> 'ACTIVE' then raise exception 'listing not available'; end if;
  if v_listing.seller_id = v_buyer then raise exception 'cannot buy own listing'; end if;

  -- DEMO: no real gateway, so fund escrow immediately. Production flow is
  -- PENDING_PAYMENT here, then the eSewa/Khalti webhook flips it to ESCROW_HELD.
  insert into public.transactions (
    buyer_id, seller_id, listing_id, price_npr,
    platform_fee_npr, escrow_fee_npr, total_npr, status, payment_method, escrow_deadline
  ) values (
    v_buyer, v_listing.seller_id, p_listing_id, v_listing.price_npr,
    round(v_listing.price_npr * 0.05), 100, v_listing.price_npr + 100,
    'ESCROW_HELD', p_payment, now() + interval '72 hours'
  ) returning id into v_txn_id;

  update public.listings set status = 'RESERVED' where id = p_listing_id;
  return v_txn_id;
end;
$$;

-- buyer confirms delivery → release escrow, mark sold, bump seller stats/trust
create or replace function public.confirm_delivery(p_txn_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_txn public.transactions%rowtype;
begin
  select * into v_txn from public.transactions where id = p_txn_id;
  if not found then raise exception 'not found'; end if;
  if v_txn.buyer_id <> auth.uid() then raise exception 'not your transaction'; end if;
  if v_txn.status <> 'ESCROW_HELD' then raise exception 'invalid state'; end if;
  update public.transactions set status = 'COMPLETED' where id = p_txn_id;
  update public.listings set status = 'SOLD' where id = v_txn.listing_id;
  update public.profiles set completed_sales = completed_sales + 1 where id = v_txn.seller_id;
  update public.profiles set completed_purchases = completed_purchases + 1 where id = v_txn.buyer_id;
  perform public.recalculate_trust_score(v_txn.seller_id);
end;
$$;

-- buyer opens a dispute on a held transaction
create or replace function public.open_dispute(p_txn_id uuid, p_reason text, p_evidence text[] default '{}')
returns void language plpgsql security definer set search_path = public as $$
declare v_txn public.transactions%rowtype;
begin
  select * into v_txn from public.transactions where id = p_txn_id;
  if not found then raise exception 'not found'; end if;
  if v_txn.buyer_id <> auth.uid() then raise exception 'not your transaction'; end if;
  if v_txn.status <> 'ESCROW_HELD' then raise exception 'invalid state'; end if;
  update public.transactions
    set status = 'DISPUTED', dispute_reason = p_reason, dispute_evidence = p_evidence
    where id = p_txn_id;
end;
$$;

-- seller submits KYC for review (can't set kyc_status directly after the revoke)
create or replace function public.submit_kyc(p_front text, p_back text, p_selfie text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'auth required'; end if;
  update public.profiles
    set kyc_status = 'PENDING',
        nid_front_path = p_front,
        nid_back_path = p_back,
        selfie_path = p_selfie
    where id = auth.uid();
end;
$$;

grant execute on function public.create_transaction(uuid, text) to authenticated;
grant execute on function public.confirm_delivery(uuid) to authenticated;
grant execute on function public.open_dispute(uuid, text, text[]) to authenticated;
grant execute on function public.submit_kyc(text, text, text) to authenticated;

-- enable Realtime on messages so chat threads update live (respects RLS)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
