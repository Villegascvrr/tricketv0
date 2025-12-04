-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('festival', 'concierto', 'ciclo', 'sala', 'otro')),
  venue TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_capacity INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create zones table
CREATE TABLE public.zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ticket_templates table (for CSV mapping templates)
CREATE TABLE public.ticket_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  name TEXT NOT NULL,
  mappings JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ticket_imports table (import logs)
CREATE TABLE public.ticket_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  imported_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  raw_mapping_used JSONB
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  external_ticket_id TEXT,
  sale_date TIMESTAMPTZ NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  zone_name TEXT,
  channel TEXT,
  ticket_type TEXT,
  status TEXT DEFAULT 'confirmed',
  buyer_city TEXT,
  buyer_province TEXT,
  buyer_country TEXT,
  buyer_postal_code TEXT,
  buyer_age INTEGER,
  buyer_birth_year INTEGER,
  has_email BOOLEAN DEFAULT false,
  has_phone BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_sale_date ON public.tickets(sale_date);
CREATE INDEX idx_tickets_channel ON public.tickets(channel);
CREATE INDEX idx_tickets_zone_name ON public.tickets(zone_name);
CREATE INDEX idx_zones_event_id ON public.zones(event_id);
CREATE INDEX idx_ticket_imports_event_id ON public.ticket_imports(event_id);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policies (public access since there's no authentication)
CREATE POLICY "Allow public access to events" ON public.events FOR ALL USING (true);
CREATE POLICY "Allow public access to zones" ON public.zones FOR ALL USING (true);
CREATE POLICY "Allow public access to ticket_templates" ON public.ticket_templates FOR ALL USING (true);
CREATE POLICY "Allow public access to ticket_imports" ON public.ticket_imports FOR ALL USING (true);
CREATE POLICY "Allow public access to tickets" ON public.tickets FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON public.zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ticket_templates_updated_at BEFORE UPDATE ON public.ticket_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();