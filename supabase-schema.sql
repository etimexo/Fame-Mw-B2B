-- ================================================================
-- FameMe B2B Partner Hub — Supabase Database Schema
-- ================================================================
-- Run this SQL in your Supabase project:
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ================================================================
-- TABLE: partner_profiles
-- Linked 1:1 to Supabase auth.users via id
-- ================================================================
create table if not exists public.partner_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  type text not null check (type in ('company', 'seller')),
  business_name text not null,
  tagline text,
  email text not null,
  phone text,
  address text,
  city text,
  state text,
  country text,
  cac_number text,
  tin_number text,
  nin_number text,
  logo text,
  banner text,
  bio text,
  commission_rate numeric not null default 0.10,
  kyc_status text not null default 'pending' check (kyc_status in ('verified', 'pending', 'action_required')),
  agreement_signed boolean not null default false,
  tier_name text,
  verified_badge text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.partner_profiles enable row level security;
create policy "Partners can view own profile" on public.partner_profiles for select using (auth.uid() = id);
create policy "Partners can insert own profile" on public.partner_profiles for insert with check (auth.uid() = id);
create policy "Partners can update own profile" on public.partner_profiles for update using (auth.uid() = id);

-- ================================================================
-- TABLE: products
-- ================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  title text not null,
  description text,
  category text,
  subcategory text,
  type text not null check (type in ('physical', 'digital')),
  sku text,
  barcode text,
  price numeric not null default 0,
  sale_price numeric,
  stock integer not null default 0,
  low_stock_threshold integer not null default 5,
  approval_status text not null default 'under_review' check (approval_status in ('approved', 'under_review', 'rejected')),
  status text not null default 'draft' check (status in ('active', 'draft', 'archived')),
  image_url text,
  tags text[],
  weight_kg numeric,
  dimensions_cm jsonb,
  branch_location_id text,
  digital_file_format text,
  digital_file_size text,
  digital_download_limit integer,
  digital_sample_url text,
  license_type text check (license_type in ('standard', 'extended_commercial', 'exclusive_rights')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "Partners can manage own products" on public.products for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: product_variants
-- ================================================================
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products on delete cascade not null,
  name text not null,
  sku text,
  price numeric not null default 0,
  stock integer not null default 0,
  attributes jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.product_variants enable row level security;
create policy "Partners can manage own product variants" on public.product_variants
  for all using (
    exists (select 1 from public.products p where p.id = product_id and p.partner_id = auth.uid())
  );

-- ================================================================
-- TABLE: orders
-- ================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  order_number text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null default '{}',
  items jsonb not null default '[]',
  subtotal numeric not null default 0,
  shipping_fee numeric not null default 0,
  commission_fee numeric not null default 0,
  net_payout numeric not null default 0,
  status text not null default 'new' check (status in ('new','processing','awaiting_fulfillment','ready_for_dispatch','shipped','delivered','cancelled','returned','disputed')),
  payment_method text,
  courier text,
  tracking_number text,
  dispatched_at timestamptz,
  delivered_at timestamptz,
  sla_deadline timestamptz,
  dispatch_branch text,
  has_dispute boolean not null default false,
  dispute_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Partners can manage own orders" on public.orders for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: disputes
-- ================================================================
create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  case_number text not null,
  order_id uuid references public.orders on delete set null,
  order_number text not null,
  customer_name text not null,
  customer_email text not null,
  category text not null check (category in ('defective_item','wrong_size','digital_file_corrupted','undelivered','not_as_described')),
  reason text not null,
  status text not null default 'open' check (status in ('open','under_review','resolved','escalated')),
  amount numeric not null default 0,
  customer_evidence jsonb not null default '{}',
  merchant_response jsonb,
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.disputes enable row level security;
create policy "Partners can manage own disputes" on public.disputes for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: payouts
-- ================================================================
create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  batch_id text not null,
  amount numeric not null,
  requested_at timestamptz not null default now(),
  settled_at timestamptz,
  status text not null default 'queued' check (status in ('settled','processing','queued')),
  bank_name text not null,
  account_number text not null,
  account_name text not null,
  reference text not null,
  fee numeric not null default 100,
  net_amount numeric not null,
  created_at timestamptz not null default now()
);
alter table public.payouts enable row level security;
create policy "Partners can manage own payouts" on public.payouts for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: reviews
-- ================================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  product_id uuid references public.products on delete set null,
  product_title text not null,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text,
  verified_purchase boolean not null default false,
  reply jsonb,
  reported boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "Partners can manage own reviews" on public.reviews for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: staff
-- ================================================================
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  role text not null check (role in ('owner','manager','fulfillment','accountant')),
  status text not null default 'invited' check (status in ('active','invited','suspended')),
  avatar text,
  last_active text,
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;
create policy "Partners can manage own staff" on public.staff for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: branches
-- ================================================================
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  name text not null,
  code text,
  address text,
  city text,
  state text,
  manager_name text,
  phone text,
  is_hq boolean not null default false,
  active_stock_units integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.branches enable row level security;
create policy "Partners can manage own branches" on public.branches for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: inventory_logs
-- ================================================================
create table if not exists public.inventory_logs (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  product_id uuid references public.products on delete set null,
  product_title text not null,
  previous_stock integer not null,
  new_stock integer not null,
  change integer not null,
  reason text,
  changed_by text,
  created_at timestamptz not null default now()
);
alter table public.inventory_logs enable row level security;
create policy "Partners can manage own inventory logs" on public.inventory_logs for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: notifications
-- ================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  title text not null,
  message text not null,
  type text not null check (type in ('order','product','inventory','platform','dispute')),
  read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy "Partners can manage own notifications" on public.notifications for all using (auth.uid() = partner_id);

-- ================================================================
-- TABLE: support_tickets
-- ================================================================
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles on delete cascade not null,
  ticket_number text not null,
  subject text not null,
  category text not null check (category in ('orders_shipping','payouts_finance','kyc_account','technical','disputes')),
  status text not null default 'open' check (status in ('open','awaiting_merchant','closed')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.support_tickets enable row level security;
create policy "Partners can manage own tickets" on public.support_tickets for all using (auth.uid() = partner_id);

-- ================================================================
-- ENABLE REALTIME for live updates
-- ================================================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.disputes;
alter publication supabase_realtime add table public.notifications;

-- ================================================================
-- FUNCTION: auto-create partner_profile row when user signs up
-- This fires when an admin invites a user and they confirm their email
-- ================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as \$\$
begin
  insert into public.partner_profiles (id, email, type, business_name, commission_rate, kyc_status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'partner_type', 'seller'),
    coalesce(new.raw_user_meta_data->>'business_name', 'New Partner'),
    coalesce((new.raw_user_meta_data->>'commission_rate')::numeric, 0.10),
    'pending'
  )
  on conflict (id) do nothing;
  return new;
end;
\$\$;

-- Trigger: fires after a new user is inserted into auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ================================================================
-- Done! Refresh your Supabase dashboard to see the tables.
-- ================================================================
