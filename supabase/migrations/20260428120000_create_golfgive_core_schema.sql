create extension if not exists pgcrypto with schema extensions;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'app_role'
      and n.nspname = 'public'
  ) then
    create type public.app_role as enum ('subscriber', 'admin');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'subscription_status'
      and n.nspname = 'public'
  ) then
    create type public.subscription_status as enum ('active', 'inactive', 'cancelled', 'lapsed');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'subscription_plan'
      and n.nspname = 'public'
  ) then
    create type public.subscription_plan as enum ('monthly', 'yearly');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'draw_mode'
      and n.nspname = 'public'
  ) then
    create type public.draw_mode as enum ('random', 'algorithmic');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'draw_status'
      and n.nspname = 'public'
  ) then
    create type public.draw_status as enum ('scheduled', 'simulation', 'published');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'prize_tier'
      and n.nspname = 'public'
  ) then
    create type public.prize_tier as enum ('three_match', 'four_match', 'five_match');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'verification_status'
      and n.nspname = 'public'
  ) then
    create type public.verification_status as enum ('pending', 'approved', 'rejected');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'payment_status'
      and n.nspname = 'public'
  ) then
    create type public.payment_status as enum ('pending', 'paid');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_valid_draw_numbers(numbers integer[])
returns boolean
language sql
immutable
as $$
  select
    cardinality(numbers) = 5
    and (
      select count(*) = 5
         and count(distinct n) = 5
         and min(n) >= 1
         and max(n) <= 45
      from unnest(numbers) as n
    );
$$;

create or replace function public.is_valid_score_snapshot(numbers integer[])
returns boolean
language sql
immutable
as $$
  select
    cardinality(numbers) = 5
    and (
      select count(*) = 5
         and min(n) >= 1
         and max(n) <= 45
      from unnest(numbers) as n
    );
$$;

create table public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  website text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint charities_name_not_blank check (length(trim(name)) > 0)
);

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  subscription_id text,
  subscription_status public.subscription_status not null default 'inactive',
  subscription_plan public.subscription_plan,
  charity_id uuid references public.charities (id) on delete set null,
  charity_percentage integer not null default 10,
  role public.app_role not null default 'subscriber',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint users_full_name_not_blank check (length(trim(full_name)) > 0),
  constraint users_email_not_blank check (length(trim(email)) > 0),
  constraint users_charity_percentage_range check (charity_percentage between 10 and 100)
);

create table public.charity_events (
  id uuid primary key default gen_random_uuid(),
  charity_id uuid not null references public.charities (id) on delete cascade,
  title text not null,
  description text,
  event_date date not null,
  location text,
  registration_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint charity_events_title_not_blank check (length(trim(title)) > 0)
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  score integer not null,
  score_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint scores_score_range check (score between 1 and 45),
  constraint scores_user_date_unique unique (user_id, score_date)
);

create table public.draws (
  id uuid primary key default gen_random_uuid(),
  draw_month date not null unique,
  draw_mode public.draw_mode not null,
  favor_least_common boolean not null default false,
  drawn_numbers integer[],
  status public.draw_status not null default 'scheduled',
  jackpot_rollover numeric(12, 2) not null default 0,
  prize_pool_total numeric(12, 2) not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint draws_draw_month_first_day check (draw_month = date_trunc('month', draw_month)::date),
  constraint draws_numbers_valid check (drawn_numbers is null or public.is_valid_draw_numbers(drawn_numbers)),
  constraint draws_published_requires_numbers check (
    status <> 'published'
    or (drawn_numbers is not null and published_at is not null)
  ),
  constraint draws_non_negative_amounts check (
    jackpot_rollover >= 0
    and prize_pool_total >= 0
  )
);

create table public.draw_entries (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  user_scores integer[] not null,
  match_count integer not null default 0,
  is_winner boolean not null default false,
  prize_tier public.prize_tier,
  created_at timestamptz not null default timezone('utc', now()),
  constraint draw_entries_draw_user_unique unique (draw_id, user_id),
  constraint draw_entries_scores_valid check (public.is_valid_score_snapshot(user_scores)),
  constraint draw_entries_match_count_valid check (match_count between 0 and 5),
  constraint draw_entries_prize_tier_consistency check (
    (prize_tier is null and is_winner = false and match_count between 0 and 2)
    or (prize_tier = 'three_match' and is_winner = true and match_count = 3)
    or (prize_tier = 'four_match' and is_winner = true and match_count = 4)
    or (prize_tier = 'five_match' and is_winner = true and match_count = 5)
  )
);

create table public.winners (
  id uuid primary key default gen_random_uuid(),
  draw_entry_id uuid not null unique references public.draw_entries (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  prize_amount numeric(12, 2) not null,
  proof_url text,
  verification_status public.verification_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  verified_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint winners_non_negative_prize check (prize_amount >= 0),
  constraint winners_approved_requires_proof check (
    verification_status <> 'approved' or proof_url is not null
  ),
  constraint winners_paid_requires_approval check (
    payment_status <> 'paid' or verification_status = 'approved'
  )
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  stripe_subscription_id text,
  stripe_customer_id text,
  plan public.subscription_plan not null,
  amount numeric(12, 2) not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  constraint subscriptions_non_negative_amount check (amount >= 0),
  constraint subscriptions_status_not_blank check (length(trim(status)) > 0)
);

create index charities_featured_idx on public.charities (is_featured, is_active);
create index charity_events_charity_date_idx on public.charity_events (charity_id, event_date);
create index scores_user_date_idx on public.scores (user_id, score_date desc);
create index draws_status_month_idx on public.draws (status, draw_month desc);
create index draw_entries_draw_idx on public.draw_entries (draw_id);
create index draw_entries_user_idx on public.draw_entries (user_id);
create index winners_user_idx on public.winners (user_id);
create index winners_verification_idx on public.winners (verification_status, payment_status);
create index subscriptions_user_created_idx on public.subscriptions (user_id, created_at desc);
create index subscriptions_stripe_subscription_idx on public.subscriptions (stripe_subscription_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id,
    full_name,
    email
  )
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Member'
    ),
    coalesce(new.email, new.id::text || '@local.invalid')
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

create or replace function public.sync_user_email_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set email = coalesce(new.email, old.email),
      updated_at = timezone('utc', now())
  where id = new.id;

  return new;
end;
$$;

create or replace function public.enforce_score_limit()
returns trigger
language plpgsql
as $$
begin
  delete from public.scores
  where user_id = new.user_id
    and id not in (
      select id
      from public.scores
      where user_id = new.user_id
      order by score_date desc, created_at desc
      limit 5
    );

  return new;
end;
$$;

create or replace function public.guard_user_profile_update()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null
     and auth.uid() = old.id
     and not public.is_admin() then
    if new.id is distinct from old.id then
      raise exception 'User id cannot be changed.';
    end if;

    if new.email is distinct from old.email then
      raise exception 'Email must be updated through Supabase Auth.';
    end if;

    if new.role is distinct from old.role then
      raise exception 'Role cannot be changed by the account owner.';
    end if;

    if new.subscription_id is distinct from old.subscription_id
       or new.subscription_status is distinct from old.subscription_status
       or new.subscription_plan is distinct from old.subscription_plan then
      raise exception 'Subscription fields cannot be changed by the account owner.';
    end if;

    if new.created_at is distinct from old.created_at then
      raise exception 'created_at cannot be changed.';
    end if;
  end if;

  return new;
end;
$$;

create trigger set_charities_updated_at
before update on public.charities
for each row
execute function public.set_updated_at();

create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create trigger guard_users_before_update
before update on public.users
for each row
execute function public.guard_user_profile_update();

create trigger set_charity_events_updated_at
before update on public.charity_events
for each row
execute function public.set_updated_at();

create trigger set_scores_updated_at
before update on public.scores
for each row
execute function public.set_updated_at();

create trigger set_draws_updated_at
before update on public.draws
for each row
execute function public.set_updated_at();

create trigger set_winners_updated_at
before update on public.winners
for each row
execute function public.set_updated_at();

create trigger enforce_score_limit_after_insert
after insert on public.scores
for each row
execute function public.enforce_score_limit();

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create trigger on_auth_user_email_updated
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.sync_user_email_from_auth();
