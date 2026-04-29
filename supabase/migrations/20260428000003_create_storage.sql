-- Create a bucket for winner proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('winner-proofs', 'winner-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
CREATE POLICY "Users can upload their own proofs" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK ( bucket_id = 'winner-proofs' AND auth.uid() = owner );

CREATE POLICY "Users can update their own proofs" 
ON storage.objects FOR UPDATE 
TO authenticated
WITH CHECK ( bucket_id = 'winner-proofs' AND auth.uid() = owner );

CREATE POLICY "Users can view their own proofs" 
ON storage.objects FOR SELECT 
TO authenticated
USING ( bucket_id = 'winner-proofs' AND auth.uid() = owner );
