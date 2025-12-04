-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Add owner_id column to events table
ALTER TABLE public.events ADD COLUMN owner_id UUID REFERENCES auth.users(id);

-- 6. Create trigger for automatic profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Grant user role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Create trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 9. RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 10. Drop old permissive policies and create new secure ones

-- Events table
DROP POLICY IF EXISTS "Allow public access to events" ON public.events;

CREATE POLICY "Authenticated users can view events"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Event owners and admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Event owners and admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Tickets table
DROP POLICY IF EXISTS "Allow public access to tickets" ON public.tickets;

CREATE POLICY "Authenticated users can view tickets for their events"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = tickets.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Event owners can insert tickets"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Event owners can update tickets"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = tickets.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Event owners can delete tickets"
  ON public.tickets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = tickets.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- Zones table
DROP POLICY IF EXISTS "Allow public access to zones" ON public.zones;

CREATE POLICY "Authenticated users can view zones"
  ON public.zones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = zones.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Event owners can manage zones"
  ON public.zones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = zones.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- Ticket imports table
DROP POLICY IF EXISTS "Allow public access to ticket_imports" ON public.ticket_imports;

CREATE POLICY "Authenticated users can view ticket imports"
  ON public.ticket_imports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = ticket_imports.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Event owners can manage ticket imports"
  ON public.ticket_imports FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = ticket_imports.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- Ticket provider allocations table
DROP POLICY IF EXISTS "Allow public access to ticket_provider_allocations" ON public.ticket_provider_allocations;

CREATE POLICY "Authenticated users can view allocations"
  ON public.ticket_provider_allocations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = ticket_provider_allocations.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Event owners can manage allocations"
  ON public.ticket_provider_allocations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = ticket_provider_allocations.event_id
      AND (e.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- Ticket templates table (global templates, admin only for write)
DROP POLICY IF EXISTS "Allow public access to ticket_templates" ON public.ticket_templates;

CREATE POLICY "Authenticated users can view templates"
  ON public.ticket_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage templates"
  ON public.ticket_templates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Interested users table (keep public insert for lead gen, but restrict read)
DROP POLICY IF EXISTS "Allow public insert to interested_users" ON public.interested_users;
DROP POLICY IF EXISTS "Allow authenticated users to view interested_users" ON public.interested_users;

CREATE POLICY "Anyone can submit interest"
  ON public.interested_users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can view interested users"
  ON public.interested_users FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));