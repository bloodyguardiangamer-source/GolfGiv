CREATE TABLE IF NOT EXISTS public.draws (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_date date NOT NULL,
    numbers int[] NOT NULL, -- The 5 winning numbers
    total_prize_pool numeric NOT NULL,
    charity_total numeric NOT NULL,
    is_published boolean DEFAULT false,
    jackpot_rollover numeric DEFAULT 0, -- Amount carried over from previous draw if no 5-match
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for draws
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Draws are visible to everyone" ON public.draws FOR SELECT TO public USING (true);

CREATE TABLE IF NOT EXISTS public.draw_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id uuid REFERENCES public.draws(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    scores int[] NOT NULL, -- User's 5 scores for this draw
    matches int NOT NULL DEFAULT 0, -- How many matched (0-5)
    prize_won numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for draw_entries
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own draw entries" ON public.draw_entries FOR SELECT USING (auth.uid() = user_id);
-- Note: Insert/Update on draw_entries should be done via service role in API, so no public INSERT policy is needed.
