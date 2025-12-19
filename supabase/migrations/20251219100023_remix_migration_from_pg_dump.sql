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
-- Name: festival_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.festival_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    icon text,
    color text,
    bg_color text,
    permissions text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL
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
-- Name: marketing_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marketing_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text DEFAULT 'paid'::text NOT NULL,
    platform text DEFAULT 'instagram'::text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    budget numeric DEFAULT 0,
    spent numeric DEFAULT 0,
    reach integer DEFAULT 0,
    clicks integer DEFAULT 0,
    tickets_sold integer DEFAULT 0,
    estimated_revenue numeric DEFAULT 0,
    ctr numeric DEFAULT 0,
    observation text,
    team_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pre_festival_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pre_festival_attachments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pre_festival_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pre_festival_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid NOT NULL,
    author_name text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pre_festival_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pre_festival_milestones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid,
    title text NOT NULL,
    description text,
    target_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pre_festival_subtasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pre_festival_subtasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid NOT NULL,
    title text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pre_festival_task_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pre_festival_task_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id uuid NOT NULL,
    action text NOT NULL,
    old_value text,
    new_value text,
    changed_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pre_festival_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pre_festival_tasks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid,
    title text NOT NULL,
    description text,
    area text NOT NULL,
    status text DEFAULT 'pendiente'::text NOT NULL,
    priority text DEFAULT 'media'::text NOT NULL,
    assignee_id uuid,
    assignee_name text,
    due_date date NOT NULL,
    milestone_id uuid,
    tags text[] DEFAULT '{}'::text[],
    dependencies uuid[] DEFAULT '{}'::uuid[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT pre_festival_tasks_area_check CHECK ((area = ANY (ARRAY['produccion'::text, 'logistica'::text, 'proveedores'::text, 'rrhh'::text, 'seguridad'::text, 'licencias'::text, 'ticketing'::text, 'comunicacion'::text]))),
    CONSTRAINT pre_festival_tasks_priority_check CHECK ((priority = ANY (ARRAY['baja'::text, 'media'::text, 'alta'::text]))),
    CONSTRAINT pre_festival_tasks_status_check CHECK ((status = ANY (ARRAY['pendiente'::text, 'en_curso'::text, 'bloqueada'::text, 'hecha'::text])))
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
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email text NOT NULL,
    name text,
    phone text,
    festival_role_id uuid,
    status text DEFAULT 'invited'::text NOT NULL,
    invited_by uuid,
    invited_at timestamp with time zone DEFAULT now(),
    joined_at timestamp with time zone,
    last_activity timestamp with time zone,
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
-- Name: festival_roles festival_roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.festival_roles
    ADD CONSTRAINT festival_roles_name_key UNIQUE (name);


--
-- Name: festival_roles festival_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.festival_roles
    ADD CONSTRAINT festival_roles_pkey PRIMARY KEY (id);


--
-- Name: interested_users interested_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interested_users
    ADD CONSTRAINT interested_users_pkey PRIMARY KEY (id);


--
-- Name: marketing_campaigns marketing_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marketing_campaigns
    ADD CONSTRAINT marketing_campaigns_pkey PRIMARY KEY (id);


--
-- Name: pre_festival_attachments pre_festival_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_attachments
    ADD CONSTRAINT pre_festival_attachments_pkey PRIMARY KEY (id);


--
-- Name: pre_festival_comments pre_festival_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_comments
    ADD CONSTRAINT pre_festival_comments_pkey PRIMARY KEY (id);


--
-- Name: pre_festival_milestones pre_festival_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_milestones
    ADD CONSTRAINT pre_festival_milestones_pkey PRIMARY KEY (id);


--
-- Name: pre_festival_subtasks pre_festival_subtasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_subtasks
    ADD CONSTRAINT pre_festival_subtasks_pkey PRIMARY KEY (id);


--
-- Name: pre_festival_task_history pre_festival_task_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_task_history
    ADD CONSTRAINT pre_festival_task_history_pkey PRIMARY KEY (id);


--
-- Name: pre_festival_tasks pre_festival_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_tasks
    ADD CONSTRAINT pre_festival_tasks_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


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
-- Name: marketing_campaigns update_marketing_campaigns_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pre_festival_milestones update_pre_festival_milestones_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_pre_festival_milestones_updated_at BEFORE UPDATE ON public.pre_festival_milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pre_festival_tasks update_pre_festival_tasks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_pre_festival_tasks_updated_at BEFORE UPDATE ON public.pre_festival_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: team_members update_team_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


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
-- Name: pre_festival_tasks fk_milestone; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_tasks
    ADD CONSTRAINT fk_milestone FOREIGN KEY (milestone_id) REFERENCES public.pre_festival_milestones(id) ON DELETE SET NULL;


--
-- Name: pre_festival_attachments pre_festival_attachments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_attachments
    ADD CONSTRAINT pre_festival_attachments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.pre_festival_tasks(id) ON DELETE CASCADE;


--
-- Name: pre_festival_comments pre_festival_comments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_comments
    ADD CONSTRAINT pre_festival_comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.pre_festival_tasks(id) ON DELETE CASCADE;


--
-- Name: pre_festival_milestones pre_festival_milestones_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_milestones
    ADD CONSTRAINT pre_festival_milestones_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: pre_festival_subtasks pre_festival_subtasks_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_subtasks
    ADD CONSTRAINT pre_festival_subtasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.pre_festival_tasks(id) ON DELETE CASCADE;


--
-- Name: pre_festival_task_history pre_festival_task_history_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_task_history
    ADD CONSTRAINT pre_festival_task_history_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.pre_festival_tasks(id) ON DELETE CASCADE;


--
-- Name: pre_festival_tasks pre_festival_tasks_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_festival_tasks
    ADD CONSTRAINT pre_festival_tasks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_festival_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_festival_role_id_fkey FOREIGN KEY (festival_role_id) REFERENCES public.festival_roles(id) ON DELETE SET NULL;


--
-- Name: team_members team_members_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: team_members team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


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
-- Name: festival_roles Admins can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage roles" ON public.festival_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: team_members Admins can manage team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage team members" ON public.team_members USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ticket_templates Admins can manage templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage templates" ON public.ticket_templates TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: marketing_campaigns Anyone can delete campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete campaigns" ON public.marketing_campaigns FOR DELETE USING (true);


--
-- Name: marketing_campaigns Anyone can insert campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert campaigns" ON public.marketing_campaigns FOR INSERT WITH CHECK (true);


--
-- Name: interested_users Anyone can submit interest; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit interest" ON public.interested_users FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: marketing_campaigns Anyone can update campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update campaigns" ON public.marketing_campaigns FOR UPDATE USING (true);


--
-- Name: marketing_campaigns Anyone can view campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view campaigns" ON public.marketing_campaigns FOR SELECT USING (true);


--
-- Name: pre_festival_task_history Authenticated users can insert history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert history" ON public.pre_festival_task_history FOR INSERT WITH CHECK (true);


--
-- Name: pre_festival_attachments Authenticated users can manage attachments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage attachments" ON public.pre_festival_attachments USING (true);


--
-- Name: pre_festival_comments Authenticated users can manage comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage comments" ON public.pre_festival_comments USING (true);


--
-- Name: pre_festival_milestones Authenticated users can manage milestones; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage milestones" ON public.pre_festival_milestones USING (true);


--
-- Name: pre_festival_subtasks Authenticated users can manage subtasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage subtasks" ON public.pre_festival_subtasks USING (true);


--
-- Name: pre_festival_tasks Authenticated users can manage tasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage tasks" ON public.pre_festival_tasks USING (true);


--
-- Name: ticket_provider_allocations Authenticated users can view allocations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view allocations" ON public.ticket_provider_allocations FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = ticket_provider_allocations.event_id) AND ((e.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: pre_festival_attachments Authenticated users can view attachments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view attachments" ON public.pre_festival_attachments FOR SELECT USING (true);


--
-- Name: pre_festival_comments Authenticated users can view comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view comments" ON public.pre_festival_comments FOR SELECT USING (true);


--
-- Name: events Authenticated users can view events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT TO authenticated USING (true);


--
-- Name: pre_festival_task_history Authenticated users can view history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view history" ON public.pre_festival_task_history FOR SELECT USING (true);


--
-- Name: pre_festival_milestones Authenticated users can view milestones; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view milestones" ON public.pre_festival_milestones FOR SELECT USING (true);


--
-- Name: festival_roles Authenticated users can view roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view roles" ON public.festival_roles FOR SELECT USING (true);


--
-- Name: pre_festival_subtasks Authenticated users can view subtasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view subtasks" ON public.pre_festival_subtasks FOR SELECT USING (true);


--
-- Name: pre_festival_tasks Authenticated users can view tasks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view tasks" ON public.pre_festival_tasks FOR SELECT USING (true);


--
-- Name: team_members Authenticated users can view team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view team members" ON public.team_members FOR SELECT USING (true);


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
-- Name: festival_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.festival_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: interested_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.interested_users ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: pre_festival_attachments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pre_festival_attachments ENABLE ROW LEVEL SECURITY;

--
-- Name: pre_festival_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pre_festival_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: pre_festival_milestones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pre_festival_milestones ENABLE ROW LEVEL SECURITY;

--
-- Name: pre_festival_subtasks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pre_festival_subtasks ENABLE ROW LEVEL SECURITY;

--
-- Name: pre_festival_task_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pre_festival_task_history ENABLE ROW LEVEL SECURITY;

--
-- Name: pre_festival_tasks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pre_festival_tasks ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: team_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

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


