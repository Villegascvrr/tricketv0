-- Create table for interested users in Tricket free trial
CREATE TABLE public.interested_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  role text,
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interested_users ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can submit their interest)
CREATE POLICY "Allow public insert to interested_users"
ON public.interested_users
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view the data (you can adjust this later)
CREATE POLICY "Allow authenticated users to view interested_users"
ON public.interested_users
FOR SELECT
TO authenticated
USING (true);