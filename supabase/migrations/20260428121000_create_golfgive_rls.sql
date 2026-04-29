alter table public.charities enable row level security;
alter table public.users enable row level security;
alter table public.charity_events enable row level security;
alter table public.scores enable row level security;
alter table public.draws enable row level security;
alter table public.draw_entries enable row level security;
alter table public.winners enable row level security;
alter table public.subscriptions enable row level security;

create policy "charities are publicly readable when active"
on public.charities
for select
to anon, authenticated
using (is_active = true);

create policy "charities are fully manageable by admins"
on public.charities
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "charity events are publicly readable when active"
on public.charity_events
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.charities
    where charities.id = charity_events.charity_id
      and charities.is_active = true
  )
);

create policy "charity events are fully manageable by admins"
on public.charity_events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users can read their own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "admins can read all user profiles"
on public.users
for select
to authenticated
using (public.is_admin());

create policy "users can update their own profile"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "admins can manage all user profiles"
on public.users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users can manage their own scores"
on public.scores
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "admins can manage all scores"
on public.scores
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "published draws are publicly readable"
on public.draws
for select
to anon, authenticated
using (status = 'published');

create policy "admins can manage all draws"
on public.draws
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users can read their own draw entries"
on public.draw_entries
for select
to authenticated
using (auth.uid() = user_id);

create policy "admins can manage all draw entries"
on public.draw_entries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users can read their own winner records"
on public.winners
for select
to authenticated
using (auth.uid() = user_id);

create policy "admins can manage all winner records"
on public.winners
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "users can read their own subscription history"
on public.subscriptions
for select
to authenticated
using (auth.uid() = user_id);

create policy "admins can manage all subscription history"
on public.subscriptions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
