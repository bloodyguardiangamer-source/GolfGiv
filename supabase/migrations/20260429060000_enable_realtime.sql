-- Enable Supabase Realtime on all core tables
-- This allows the dashboard to receive live updates via postgres_changes

-- Add tables to the supabase_realtime publication
-- (Supabase creates this publication automatically)
alter publication supabase_realtime add table public.scores;
alter publication supabase_realtime add table public.draws;
alter publication supabase_realtime add table public.draw_entries;
alter publication supabase_realtime add table public.winners;
alter publication supabase_realtime add table public.subscriptions;
alter publication supabase_realtime add table public.charities;
alter publication supabase_realtime add table public.users;
