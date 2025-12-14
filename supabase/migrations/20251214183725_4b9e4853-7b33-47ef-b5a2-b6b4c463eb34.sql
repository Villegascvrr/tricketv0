-- Create festival_roles table
CREATE TABLE public.festival_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  bg_color TEXT,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.festival_roles ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can view roles
CREATE POLICY "Authenticated users can view roles"
ON public.festival_roles FOR SELECT
USING (true);

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.festival_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  festival_role_id UUID REFERENCES public.festival_roles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'invited',
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ DEFAULT now(),
  joined_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view team members
CREATE POLICY "Authenticated users can view team members"
ON public.team_members FOR SELECT
USING (true);

-- Admins can manage team members
CREATE POLICY "Admins can manage team members"
ON public.team_members FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the 7 predefined festival roles
INSERT INTO public.festival_roles (name, description, icon, color, bg_color, permissions) VALUES
('Director del Festival', 'Control total sobre todas las áreas del festival', 'Crown', 'text-amber-500', 'bg-amber-500/10', ARRAY['ventas', 'marketing', 'operaciones_pre', 'operaciones_dia', 'proveedores', 'equipo', 'integraciones', 'config']),
('Ticketing Manager', 'Gestión de venta de entradas y previsiones', 'Ticket', 'text-blue-500', 'bg-blue-500/10', ARRAY['ventas', 'integraciones']),
('Marketing Lead', 'Campañas, audiencia y comunicación', 'Megaphone', 'text-purple-500', 'bg-purple-500/10', ARRAY['marketing', 'ventas']),
('Coordinador de Operaciones', 'Logística pre-festival y día del evento', 'ClipboardList', 'text-green-500', 'bg-green-500/10', ARRAY['operaciones_pre', 'operaciones_dia', 'proveedores']),
('Responsable de Seguridad', 'Control de accesos, incidencias y emergencias', 'Shield', 'text-red-500', 'bg-red-500/10', ARRAY['operaciones_dia']),
('RRHH / Staff Manager', 'Gestión de personal y voluntarios', 'Users', 'text-orange-500', 'bg-orange-500/10', ARRAY['equipo', 'operaciones_pre']),
('Analista de Datos', 'Solo lectura de dashboards y reportes', 'BarChart3', 'text-cyan-500', 'bg-cyan-500/10', ARRAY['ventas', 'marketing']);