-- Trip pages — core schema (MVP)

create extension if not exists "pgcrypto";

-- profiles ------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- pages -------------------------------------------------------------------
create table public.pages (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null default auth.uid() references auth.users on delete cascade,
  slug         text unique,
  occasion     text not null default 'romantic',
  locale       text not null default 'en',
  config       jsonb not null default '{}'::jsonb,
  status       text not null default 'draft'
               check (status in ('draft', 'published', 'expired')),
  plan         text not null default 'free'
               check (plan in ('free', 'paid')),
  target_at    timestamptz,
  published_at timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index pages_owner_idx on public.pages (owner_id);
create index pages_status_idx on public.pages (status);

-- orders ----------------------------------------------------------------
create table public.orders (
  id           uuid primary key default gen_random_uuid(),
  page_id      uuid not null references public.pages on delete cascade,
  provider     text not null default 'lemonsqueezy',
  provider_ref text,
  amount_cents integer,
  currency     text default 'usd',
  status       text not null default 'pending',
  created_at   timestamptz not null default now()
);

-- RLS -----------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.pages    enable row level security;
alter table public.orders   enable row level security;

create policy "own profile"
  on public.profiles for select using (id = auth.uid());

create policy "owner reads own pages"
  on public.pages for select using (owner_id = auth.uid());

create policy "anon reads published, unexpired pages"
  on public.pages for select
  to anon
  using (
    status = 'published'
    and (expires_at is null or expires_at > now())
  );

create policy "owner writes own pages"
  on public.pages for insert with check (owner_id = auth.uid());
create policy "owner updates own pages"
  on public.pages for update using (owner_id = auth.uid());
create policy "owner deletes own pages"
  on public.pages for delete using (owner_id = auth.uid());

create policy "owner reads own orders"
  on public.orders for select
  using (exists (
    select 1 from public.pages p
    where p.id = orders.page_id and p.owner_id = auth.uid()
  ));

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pages_touch
  before update on public.pages
  for each row execute function public.touch_updated_at();

-- storage bucket for page media --------------------------------------
insert into storage.buckets (id, name, public)
values ('page-media', 'page-media', true)
on conflict (id) do nothing;

create policy "public read page media"
  on storage.objects for select
  using (bucket_id = 'page-media');

create policy "owner writes page media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'page-media' and owner = auth.uid());
