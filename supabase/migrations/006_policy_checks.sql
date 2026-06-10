-- EverestBazar — authorization hardening (review findings: UPDATE WITH CHECK + conversation seller binding).
-- Run after 005.

-- #1: UPDATE policies need WITH CHECK so the NEW row can't reassign ownership
-- (e.g. a seller moving seller_id to another user, or changing a conversation's parties).
alter policy "Users can update own profile" on public.profiles
  using (auth.uid() = id) with check (auth.uid() = id);

alter policy "Sellers can update own listings" on public.listings
  using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

alter policy "Participants can update conversations" on public.conversations
  using (auth.uid() = buyer_id or auth.uid() = seller_id)
  with check (auth.uid() = buyer_id or auth.uid() = seller_id);

-- #2: conversations are created only via a validated RPC that binds the seller
-- to the listing (client can't supply an arbitrary seller_id, and no self-DMs).
drop policy if exists "Authenticated users can create conversations" on public.conversations;
revoke insert on public.conversations from anon, authenticated;

create or replace function public.open_conversation(p_listing_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_me uuid := auth.uid(); v_seller uuid; v_id uuid;
begin
  if v_me is null then raise exception 'auth required'; end if;
  select seller_id into v_seller from public.listings where id = p_listing_id;
  if v_seller is null then raise exception 'listing not found'; end if;
  if v_seller = v_me then raise exception 'cannot message yourself'; end if;
  select id into v_id from public.conversations
    where listing_id = p_listing_id and buyer_id = v_me and seller_id = v_seller;
  if v_id is not null then return v_id; end if;
  insert into public.conversations (listing_id, buyer_id, seller_id)
    values (p_listing_id, v_me, v_seller)
    returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.open_conversation(uuid) to authenticated;
