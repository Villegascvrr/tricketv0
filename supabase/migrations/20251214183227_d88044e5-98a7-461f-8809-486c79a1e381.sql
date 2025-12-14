-- Create marketing_campaigns table
CREATE TABLE public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'paid',
  platform TEXT NOT NULL DEFAULT 'instagram',
  status TEXT NOT NULL DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  budget NUMERIC DEFAULT 0,
  spent NUMERIC DEFAULT 0,
  reach INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  tickets_sold INTEGER DEFAULT 0,
  estimated_revenue NUMERIC DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  observation TEXT,
  team_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies - public read for demo mode (auth disabled)
CREATE POLICY "Anyone can view campaigns" 
  ON public.marketing_campaigns 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert campaigns" 
  ON public.marketing_campaigns 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update campaigns" 
  ON public.marketing_campaigns 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete campaigns" 
  ON public.marketing_campaigns 
  FOR DELETE 
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON public.marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();