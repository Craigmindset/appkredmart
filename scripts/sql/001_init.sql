-- Initial database schema for KredMart
-- Run this on your Neon Postgres.

create table if not exists users (
  id bigserial primary key,
  first_name text not null,
  last_name text,
  email text not null unique,
  phone text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists wallets (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  balance numeric(14,2) not null default 0,
  currency text not null default 'NGN',
  created_at timestamptz not null default now()
);

create type txn_type as enum ('AIRTIME','DATA','ORDER','REFUND','ADJUST');

create table if not exists transactions (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  type txn_type not null,
  amount numeric(14,2) not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists loan_providers (
  id bigserial primary key,
  name text not null unique,
  apply_url text not null,
  meta jsonb
);

create table if not exists loan_applications (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  provider_id bigint not null references loan_providers(id) on delete restrict,
  status text not null default 'PENDING',
  payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subs (
  email text primary key,
  created_at timestamptz not null default now()
);
