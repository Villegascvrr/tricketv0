-- Pre-Festival Tasks Table
CREATE TABLE public.pre_festival_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    area TEXT NOT NULL CHECK (area IN ('produccion', 'logistica', 'proveedores', 'rrhh', 'seguridad', 'licencias', 'ticketing', 'comunicacion')),
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_curso', 'bloqueada', 'hecha')),
    priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta')),
    assignee_id UUID,
    assignee_name TEXT,
    due_date DATE NOT NULL,
    milestone_id UUID,
    tags TEXT[] DEFAULT '{}',
    dependencies UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pre-Festival Milestones Table
CREATE TABLE public.pre_festival_milestones (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for milestone
ALTER TABLE public.pre_festival_tasks 
ADD CONSTRAINT fk_milestone 
FOREIGN KEY (milestone_id) 
REFERENCES public.pre_festival_milestones(id) 
ON DELETE SET NULL;

-- Task Subtasks (Checklist items)
CREATE TABLE public.pre_festival_subtasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.pre_festival_tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Task Comments
CREATE TABLE public.pre_festival_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.pre_festival_tasks(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Task Attachments
CREATE TABLE public.pre_festival_attachments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.pre_festival_tasks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Task History
CREATE TABLE public.pre_festival_task_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.pre_festival_tasks(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pre_festival_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_festival_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_festival_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_festival_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_festival_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_festival_task_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pre_festival_tasks
CREATE POLICY "Authenticated users can view tasks"
ON public.pre_festival_tasks
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage tasks"
ON public.pre_festival_tasks
FOR ALL
USING (true);

-- RLS Policies for pre_festival_milestones
CREATE POLICY "Authenticated users can view milestones"
ON public.pre_festival_milestones
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage milestones"
ON public.pre_festival_milestones
FOR ALL
USING (true);

-- RLS Policies for pre_festival_subtasks
CREATE POLICY "Authenticated users can view subtasks"
ON public.pre_festival_subtasks
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage subtasks"
ON public.pre_festival_subtasks
FOR ALL
USING (true);

-- RLS Policies for pre_festival_comments
CREATE POLICY "Authenticated users can view comments"
ON public.pre_festival_comments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage comments"
ON public.pre_festival_comments
FOR ALL
USING (true);

-- RLS Policies for pre_festival_attachments
CREATE POLICY "Authenticated users can view attachments"
ON public.pre_festival_attachments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage attachments"
ON public.pre_festival_attachments
FOR ALL
USING (true);

-- RLS Policies for pre_festival_task_history
CREATE POLICY "Authenticated users can view history"
ON public.pre_festival_task_history
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert history"
ON public.pre_festival_task_history
FOR INSERT
WITH CHECK (true);

-- Updated at trigger
CREATE TRIGGER update_pre_festival_tasks_updated_at
BEFORE UPDATE ON public.pre_festival_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pre_festival_milestones_updated_at
BEFORE UPDATE ON public.pre_festival_milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();