-- ================================================================
-- FameMe B2B Partner Hub — Neon PostgreSQL Database Schema
-- ================================================================
-- Run this in your Neon SQL Editor:
-- Neon Console (https://console.neon.tech) → SQL Editor → Paste & Run
-- ================================================================

-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- ================================================================
-- TABLE: users (Authentication credentials)
-- ================================================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  salt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_users_email on users (lower(email));

-- ================================================================
-- TABLE: partner_profiles (B2B Partner Business Details)
-- ================================================================
create table if not exists partner_profiles (
  id uuid primary key references users(id) on delete cascade,
  type text not null check (type in ('company', 'seller')),
  business_name text not null,
  tagline text,
  email text not null,
  phone text,
  address text,
  city text,
  state text,
  country text default 'Nigeria',
  cac_number text,
  tin_number text,
  nin_number text,
  logo text,
  banner text,
  bio text,
  commission_rate numeric not null default 0.10,
  kyc_status text not null default 'pending' check (kyc_status in ('verified', 'pending', 'action_required')),
  agreement_signed boolean not null default false,
  tier_name text default 'Bronze Seller',
  verified_badge text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ================================================================
-- TABLE: products (Physical merchandise & digital audio stems)
-- ================================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
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
create index if not exists idx_products_partner on products (partner_id);

-- ================================================================
-- TABLE: product_variants
-- ================================================================
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  sku text,
  price numeric not null default 0,
  stock integer not null default 0,
  attributes jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists idx_variants_product on product_variants (product_id);

-- ================================================================
-- TABLE: orders
-- ================================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null default '{}',
  items jsonb not null default '[]',
  subtotal numeric not null default 0,
  shipping_fee numeric not null default 0,
  commission_fee numeric not null default 0,
  net_payout numeric not null default 0,
  status text not null default 'new' check (status in ('new', 'processing', 'awaiting_fulfillment', 'ready_for_dispatch', 'shipped', 'delivered', 'cancelled', 'returned', 'disputed')),
  payment_method text,
  courier text,
  tracking_number text,
  dispatched_at timestamptz,
  delivered_at timestamptz,
  sla_deadline timestamptz,
  dispatch_branch text,
  has_dispute boolean not null default false,
  dispute_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orders_partner on orders (partner_id);
create index if not exists idx_orders_status on orders (status);

-- ================================================================
-- TABLE: disputes
-- ================================================================
create table if not exists disputes (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
  case_number text not null unique,
  order_id text not null,
  order_number text not null,
  customer_name text not null,
  customer_email text not null,
  category text not null check (category in ('defective_item', 'wrong_size', 'digital_file_corrupted', 'undelivered', 'not_as_described')),
  reason text not null,
  status text not null default 'open' check (status in ('open', 'under_review', 'resolved', 'escalated')),
  amount numeric not null default 0,
  customer_evidence jsonb not null default '{}',
  merchant_response jsonb,
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_disputes_partner on disputes (partner_id);

-- ================================================================
-- TABLE: payouts
-- ================================================================
create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
  batch_id text not null,
  amount numeric not null,
  requested_at timestamptz not null default now(),
  settled_at timestamptz,
  status text not null default 'processing' check (status in ('settled', 'processing', 'queued')),
  bank_name text not null,
  account_number text not null,
  account_name text not null,
  reference text not null unique,
  fee numeric not null default 0,
  net_amount numeric not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_payouts_partner on payouts (partner_id);

-- ================================================================
-- TABLE: reviews
-- ================================================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
  product_id text not null,
  product_title text not null,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text,
  verified_purchase boolean not null default true,
  reply jsonb,
  reported boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_reviews_partner on reviews (partner_id);

-- ================================================================
-- TABLE: staff
-- ================================================================
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role text not null check (role in ('owner', 'manager', 'fulfillment', 'accountant')),
  status text not null default 'active' check (status in ('active', 'invited', 'suspended')),
  avatar text,
  last_active timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_staff_partner on staff (partner_id);

-- ================================================================
-- TABLE: branches
-- ================================================================
create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
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
create index if not exists idx_branches_partner on branches (partner_id);

-- ================================================================
-- TABLE: inventory_logs
-- ================================================================
create table if not exists inventory_logs (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
  product_id text not null,
  product_title text not null,
  previous_stock integer not null,
  new_stock integer not null,
  change integer not null,
  reason text,
  changed_by text,
  created_at timestamptz not null default now()
);
create index if not exists idx_inventory_logs_partner on inventory_logs (partner_id);

-- ================================================================
-- TABLE: notifications
-- ================================================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('order', 'product', 'inventory', 'platform', 'dispute')),
  read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_partner on notifications (partner_id);

-- ================================================================
-- TABLE: support_tickets
-- ================================================================
create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partner_profiles(id) on delete cascade,
  ticket_number text not null unique,
  subject text not null,
  category text not null check (category in ('orders_shipping', 'payouts_finance', 'kyc_account', 'technical', 'disputes')),
  status text not null default 'open' check (status in ('open', 'awaiting_merchant', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tickets_partner on support_tickets (partner_id);
