-- Tabla de códigos de invitación
CREATE TABLE public.invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  festival_role_id UUID REFERENCES public.festival_roles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  max_uses INTEGER DEFAULT NULL, -- NULL = ilimitado
  current_uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_invitation_codes_code ON public.invitation_codes(code);
CREATE INDEX idx_invitation_codes_event_id ON public.invitation_codes(event_id);

-- Trigger para updated_at
CREATE TRIGGER update_invitation_codes_updated_at
  BEFORE UPDATE ON public.invitation_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Admins globales pueden ver y gestionar todos los códigos
CREATE POLICY "Admins can manage all invitation codes"
  ON public.invitation_codes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Owners del evento pueden gestionar códigos de su evento
CREATE POLICY "Event owners can manage their invitation codes"
  ON public.invitation_codes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = invitation_codes.event_id 
      AND e.owner_id = auth.uid()
    )
  );

-- Miembros del equipo con acceso completo pueden crear códigos para su evento
CREATE POLICY "Team members with full access can create codes"
  ON public.invitation_codes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.event_id = invitation_codes.event_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

-- Miembros del equipo pueden ver códigos de su evento
CREATE POLICY "Team members can view their event codes"
  ON public.invitation_codes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.event_id = invitation_codes.event_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

-- Tabla para registrar el uso de códigos (historial)
CREATE TABLE public.invitation_code_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id UUID NOT NULL REFERENCES public.invitation_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(code_id, user_id)
);

ALTER TABLE public.invitation_code_uses ENABLE ROW LEVEL SECURITY;

-- Solo admins y owners pueden ver el historial de uso
CREATE POLICY "Admins can view code usage"
  ON public.invitation_code_uses
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Event owners can view their code usage"
  ON public.invitation_code_uses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invitation_codes ic
      JOIN events e ON e.id = ic.event_id
      WHERE ic.id = invitation_code_uses.code_id
      AND e.owner_id = auth.uid()
    )
  );

-- Cualquier usuario autenticado puede registrar uso (durante registro)
CREATE POLICY "Users can register code usage"
  ON public.invitation_code_uses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Añadir columna is_owner a team_members para distinguir acceso completo
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS is_owner BOOLEAN NOT NULL DEFAULT false;