CREATE TABLE IF NOT EXISTS public.charities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    image_url text,
    website text,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for charities
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- Charities are readable by everyone
CREATE POLICY "Charities are visible to everyone"
ON public.charities FOR SELECT TO public USING (true);

-- Create users table extending auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    subscription_id text,
    subscription_status text,
    subscription_plan text,
    charity_id uuid REFERENCES public.charities(id) ON DELETE SET NULL,
    charity_percentage int DEFAULT 10 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trigger to create a public.users row on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Seed some charities
INSERT INTO public.charities (name, description, is_featured, website, image_url) VALUES 
('First Tee', 'Impacting the lives of young people by providing educational programs that build character, instill life-enhancing values and promote healthy choices through the game of golf.', true, 'https://firsttee.org', 'https://images.unsplash.com/photo-1535139262971-c51845709a48?q=80&w=2000&auto=format&fit=crop'),
('Youth on Course', 'Providing youth with access to life-changing opportunities through golf.', true, 'https://youthoncourse.org', 'https://images.unsplash.com/photo-1593111774240-d529f12eb4d6?q=80&w=2000&auto=format&fit=crop'),
('Golfers Against Cancer', 'Raising money for cancer research through the golfing community.', false, 'https://golfersagainstcancer.org', 'https://images.unsplash.com/photo-1587334274328-64186a80aee6?q=80&w=2000&auto=format&fit=crop'),
('The First Swing Foundation', 'Providing camps, clinics, and instruction for individuals with physical and mental challenges.', false, 'https://firstswing.org', 'https://images.unsplash.com/photo-1535139262971-c51845709a48?q=80&w=2000&auto=format&fit=crop'),
('Audubon International', 'Environmental education and conservation through golf course partnerships.', false, 'https://auduboninternational.org', 'https://images.unsplash.com/photo-1587334274328-64186a80aee6?q=80&w=2000&auto=format&fit=crop')
ON CONFLICT DO NOTHING;
