-- Create table for configurable festival areas
CREATE TABLE IF NOT EXISTS public.pre_festival_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT, -- Hex code or tailwind class reference
    icon TEXT, -- Lucide icon name
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.pre_festival_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.pre_festival_areas
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.pre_festival_areas
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.pre_festival_areas
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.pre_festival_areas
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add area_id to tasks to link them to dynamic areas
-- We keep the 'area' text column for backwards compatibility or as a fallback/denormalized field if needed, 
-- but ideally we should migrate to `area_id`. For now, we add the column nullable.
ALTER TABLE public.pre_festival_tasks 
ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES public.pre_festival_areas(id) ON DELETE SET NULL;
