CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    venue text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_capacity integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    owner_id uuid,
    CONSTRAINT events_type_check CHECK ((type = ANY (ARRAY['festival'::text, 'concierto'::text, 'ciclo'::text, 'sala'::text, 'otro'::text])))
);


--
-- Name: interested_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interested_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text NOT NULL,
    role text,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    full_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ticket_imports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_imports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    provider_name text NOT NULL,
    file_name text NOT NULL,
    imported_at timestamp with time zone DEFAULT now() NOT NULL,
    imported_count integer DEFAULT 0 NOT NULL,
    error_count integer DEFAULT 0 NOT NULL,
    raw_mapping_used jsonb
);


--
-- Name: ticket_provider_allocations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_provider_allocations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    provider_name text NOT NULL,
    allocated_capacity integer NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ticket_provider_allocations_allocated_capacity_check CHECK ((allocated_capacity >= 0))
);


--
-- Name: ticket_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_name text NOT NULL,
    name text NOT NULL,
    mappings jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    provider_name text NOT NULL,
    external_ticket_id text,
    sale_date timestamp with time zone NOT NULL,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'EUR'::text,
    zone_name text,
    channel text,
    ticket_type text,
    status text DEFAULT 'confirmed'::text,
    buyer_city text,
    buyer_province text,
    buyer_country text,
    buyer_postal_code text,
    buyer_age integer,
    buyer_birth_year integer,
    has_email boolean DEFAULT false,
    has_phone boolean DEFAULT false,
    marketing_consent boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: zones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.zones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    name text NOT NULL,
    capacity integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: interested_users interested_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interested_users
    ADD CONSTRAINT interested_users_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: ticket_imports ticket_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_imports
    ADD CONSTRAINT ticket_imports_pkey PRIMARY KEY (id);


--
-- Name: ticket_provider_allocations ticket_provider_allocations_event_id_provider_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_provider_allocations
    ADD CONSTRAINT ticket_provider_allocations_event_id_provider_name_key UNIQUE (event_id, provider_name);


--
-- Name: ticket_provider_allocations ticket_provider_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_provider_allocations
    ADD CONSTRAINT ticket_provider_allocations_pkey PRIMARY KEY (id);


--
-- Name: ticket_templates ticket_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_templates
    ADD CONSTRAINT ticket_templates_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: zones zones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_pkey PRIMARY KEY (id);


--
-- Name: idx_ticket_imports_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ticket_imports_event_id ON public.ticket_imports USING btree (event_id);


--
-- Name: idx_ticket_provider_allocations_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ticket_provider_allocations_event_id ON public.ticket_provider_allocations USING btree (event_id);


--
-- Name: idx_tickets_channel; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tickets_channel ON public.tickets USING btree (channel);


--
-- Name: idx_tickets_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tickets_event_id ON public.tickets USING btree (event_id);


--
-- Name: idx_tickets_sale_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tickets_sale_date ON public.tickets USING btree (sale_date);


--
-- Name: idx_tickets_zone_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tickets_zone_name ON public.tickets USING btree (zone_name);


--
-- Name: idx_zones_event_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_zones_event_id ON public.zones USING btree (event_id);


--
-- Name: events update_events_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ticket_provider_allocations update_ticket_provider_allocations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_ticket_provider_allocations_updated_at BEFORE UPDATE ON public.ticket_provider_allocations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ticket_templates update_ticket_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_ticket_templates_updated_at BEFORE UPDATE ON public.ticket_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tickets update_tickets_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: zones update_zones_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON public.zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: events events_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ticket_imports ticket_imports_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_imports
    ADD CONSTRAINT ticket_imports_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: ticket_provider_allocations ticket_provider_allocations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_provider_allocations
    ADD CONSTRAINT ticket_provider_allocations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: tickets tickets_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: zones zones_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ticket_templates Admins can manage templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage templates" ON public.ticket_templates TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: interested_users Anyone can submit interest; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit interest" ON public.interested_users FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: ticket_provider_allocations Authenticated users can view allocations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view allocations" ON public.ticket_provider_allocations FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = ticket_provider_allocations.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: events Authenticated users can view events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT TO authenticated USING (true);


--
-- Name: ticket_templates Authenticated users can view templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view templates" ON public.ticket_templates FOR SELECT TO authenticated USING (true);


--
-- Name: ticket_imports Authenticated users can view ticket imports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view ticket imports" ON public.ticket_imports FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = ticket_imports.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: tickets Authenticated users can view tickets for their events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view tickets for their events" ON public.tickets FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = tickets.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: zones Authenticated users can view zones; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view zones" ON public.zones FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = zones.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: events Event owners and admins can delete events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Event owners and admins can delete events" ON public.events FOR DELETE TO authenticated USING (((auth.uid() = owner_id) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: events Event owners and admins can update events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Event owners and admins can update events" ON public.events FOR UPDATE TO authenticated USING (((auth.uid() = owner_id) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: tickets Event owners can delete tickets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Event owners can delete tickets" ON public.tickets FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = tickets.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: tickets Event owners can insert tickets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Event owners can insert tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = tickets.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: ticket_provider_allocations Event owners can manage allocations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Event owners can manage allocations" ON public.ticket_provider_allocations TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = ticket_provider_allocations.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: ticket_imports Event owners can manage ticket imports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Event owners can manage ticket imports" ON public.ticket_imports TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = ticket_imports.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: zones Event owners can manage zones; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Event owners can manage zones" ON public.zones TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = zones.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: tickets Event owners can update tickets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Event owners can update tickets" ON public.tickets FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = tickets.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: interested_users Only admins can view interested users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can view interested users" ON public.interested_users FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: events Users can create events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK ((auth.uid() = owner_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: interested_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.interested_users ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: ticket_imports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ticket_imports ENABLE ROW LEVEL SECURITY;

--
-- Name: ticket_provider_allocations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ticket_provider_allocations ENABLE ROW LEVEL SECURITY;

--
-- Name: ticket_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ticket_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: tickets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: zones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


