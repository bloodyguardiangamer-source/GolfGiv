CREATE TABLE IF NOT EXISTS public.scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    score int CHECK (score >= 1 AND score <= 45) NOT NULL,
    score_date date NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, score_date)
);

-- Enable RLS
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own scores
CREATE POLICY "Users can manage their own scores"
ON public.scores
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger function for 5-score rolling limit
CREATE OR REPLACE FUNCTION public.enforce_score_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete oldest scores if the user has more than 5
    DELETE FROM public.scores
    WHERE id IN (
        SELECT id FROM public.scores
        WHERE user_id = NEW.user_id
        ORDER BY score_date DESC, created_at DESC
        OFFSET 4
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS check_score_limit ON public.scores;
CREATE TRIGGER check_score_limit
AFTER INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION public.enforce_score_limit();
