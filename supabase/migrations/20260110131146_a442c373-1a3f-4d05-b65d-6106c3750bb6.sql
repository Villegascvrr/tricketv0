-- Drop the restrictive SELECT policy and create a permissive one
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;

-- Create a permissive policy that allows anyone to view events
CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);