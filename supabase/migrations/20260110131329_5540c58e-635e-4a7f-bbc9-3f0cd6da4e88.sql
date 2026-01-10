-- Add event_id column to team_members to link users to specific events
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES public.events(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_team_members_event_id ON public.team_members(event_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);