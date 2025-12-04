-- Create ticket_provider_allocations table
CREATE TABLE public.ticket_provider_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  allocated_capacity INTEGER NOT NULL CHECK (allocated_capacity >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, provider_name)
);

-- Create index for better query performance
CREATE INDEX idx_ticket_provider_allocations_event_id ON public.ticket_provider_allocations(event_id);

-- Enable Row Level Security
ALTER TABLE public.ticket_provider_allocations ENABLE ROW LEVEL SECURITY;

-- Create policy (public access since there's no authentication)
CREATE POLICY "Allow public access to ticket_provider_allocations" 
ON public.ticket_provider_allocations FOR ALL USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_ticket_provider_allocations_updated_at 
BEFORE UPDATE ON public.ticket_provider_allocations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();