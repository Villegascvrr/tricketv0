import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  TaskStatus,
  TaskPriority,
  teamMembers,
  TaskAlert
} from '@/data/preFestivalMockData';
import { toast } from 'sonner';

export type ViewMode = 'list' | 'kanban' | 'timeline';

export interface TaskFilters {
  area: string | 'all';
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  assignee: string | 'all';
  showOverdue: boolean;
  showNext7Days: boolean;
  search: string;
}

export interface SortConfig {
  field: 'due_date' | 'priority' | 'status';
  direction: 'asc' | 'desc';
}

export interface PreFestivalTask {
  id: string;
  title: string;
  description?: string | null;
  area: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_name: string;
  assignee_id?: string | null;
  due_date: string;
  tags: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  comments?: { id: string; author_name: string; content: string; created_at: string }[];
  attachments?: { id: string; name: string; url: string }[];
  history?: { id: string; action: string; old_value?: string | null; new_value?: string | null; changed_by: string; created_at: string }[];
}

export interface PreFestivalMilestone {
  id: string;
  title: string;
  description?: string | null;
  target_date: string;
}

export function usePreFestivalTasksSupabase(eventId?: string, isDemo: boolean = false) {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const [filters, setFilters] = useState<TaskFilters>({
    area: 'all',
    status: 'all',
    priority: 'all',
    assignee: 'all',
    showOverdue: false,
    showNext7Days: false,
    search: ''
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'due_date',
    direction: 'asc'
  });

  // Queries
  const { data: allTasks = [], isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['pre-festival-tasks', eventId, isDemo],
    queryFn: async () => {
      let query = supabase
        .from('pre_festival_tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (!isDemo && eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data: tasks, error } = await query;
      if (error) throw error;

      if (!tasks || tasks.length === 0) return [];

      // Fetch related data
      const taskIds = tasks.map(t => t.id);

      const [subtasksResult, commentsResult, attachmentsResult, historyResult] = await Promise.all([
        supabase.from('pre_festival_subtasks').select('*').in('task_id', taskIds),
        supabase.from('pre_festival_comments').select('*').in('task_id', taskIds).order('created_at', { ascending: false }),
        supabase.from('pre_festival_attachments').select('*').in('task_id', taskIds),
        supabase.from('pre_festival_task_history').select('*').in('task_id', taskIds).order('created_at', { ascending: false })
      ]);

      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        area: task.area,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        assignee_name: task.assignee_name || 'Sin asignar',
        assignee_id: task.assignee_id,
        due_date: task.due_date,
        tags: task.tags || [],
        subtasks: subtasksResult.data?.filter(s => s.task_id === task.id).map(s => ({
          id: s.id,
          title: s.title,
          completed: s.completed
        })) || [],
        comments: commentsResult.data?.filter(c => c.task_id === task.id).map(c => ({
          id: c.id,
          author_name: c.author_name,
          content: c.content,
          created_at: c.created_at
        })) || [],
        attachments: attachmentsResult.data?.filter(a => a.task_id === task.id).map(a => ({
          id: a.id,
          name: a.name,
          url: a.url
        })) || [],
        history: historyResult.data?.filter(h => h.task_id === task.id).map(h => ({
          id: h.id,
          action: h.action,
          old_value: h.old_value,
          new_value: h.new_value,
          changed_by: h.changed_by,
          created_at: h.created_at
        })) || []
      }));
    },
    enabled: !!eventId || isDemo
  });

  const { data: milestones = [] } = useQuery({
    queryKey: ['pre-festival-milestones', eventId, isDemo],
    queryFn: async () => {
      let query = supabase
        .from('pre_festival_milestones')
        .select('*')
        .order('target_date', { ascending: true });

      if (!isDemo && eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        target_date: m.target_date
      }));
    },
    enabled: !!eventId || isDemo
  });

  // Mutations
  const addTaskMutation = useMutation({
    mutationFn: async (task: Omit<PreFestivalTask, 'id' | 'subtasks' | 'comments' | 'attachments' | 'history'>) => {
      const { data, error } = await supabase
        .from('pre_festival_tasks')
        .insert({
          title: task.title,
          description: task.description,
          area: task.area,
          status: task.status || 'pendiente',
          priority: task.priority || 'media',
          assignee_name: task.assignee_name,
          assignee_id: task.assignee_id,
          due_date: task.due_date,
          tags: task.tags || [],
          event_id: !isDemo ? eventId : null
        })
        .select()
        .single();

      if (error) throw error;

      // Add history entry
      await supabase.from('pre_festival_task_history').insert({
        task_id: data.id,
        action: 'Tarea creada',
        changed_by: 'Usuario actual'
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-festival-tasks'] });
      toast.success('Tarea creada correctamente');
    },
    onError: (error) => {
      toast.error('Error al crear la tarea');
      console.error('Error creating task:', error);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<PreFestivalTask> }) => {
      // Get current task for history
      const currentTask = allTasks.find(t => t.id === taskId);

      const { error } = await supabase
        .from('pre_festival_tasks')
        .update({
          title: updates.title,
          description: updates.description,
          area: updates.area,
          status: updates.status,
          priority: updates.priority,
          assignee_name: updates.assignee_name,
          assignee_id: updates.assignee_id,
          due_date: updates.due_date,
          tags: updates.tags
        })
        .eq('id', taskId);

      if (error) throw error;

      // History tracking...
      const trackChange = async (action: string, oldVal: any, newVal: any) => {
        if (oldVal !== newVal) {
          await supabase.from('pre_festival_task_history').insert({
            task_id: taskId,
            action,
            old_value: String(oldVal || ''),
            new_value: String(newVal || ''),
            changed_by: 'Usuario actual'
          });
        }
      };

      if (currentTask) {
        if (updates.status) await trackChange('Estado cambiado', currentTask.status, updates.status);
        if (updates.assignee_name) await trackChange('Responsable cambiado', currentTask.assignee_name, updates.assignee_name);
        if (updates.priority) await trackChange('Prioridad cambiada', currentTask.priority, updates.priority);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-festival-tasks'] });
    },
    onError: (error) => {
      toast.error('Error al actualizar la tarea');
      console.error('Error updating task:', error);
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('pre_festival_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-festival-tasks'] });
      toast.success('Tarea eliminada');
    },
    onError: (error) => {
      toast.error('Error al eliminar la tarea');
      console.error('Error deleting task:', error);
    }
  });

  const addSubtaskMutation = useMutation({
    mutationFn: async ({ taskId, title }: { taskId: string; title: string }) => {
      const { error } = await supabase
        .from('pre_festival_subtasks')
        .insert({
          task_id: taskId,
          title,
          completed: false
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-festival-tasks'] });
    },
    onError: (error) => {
      toast.error('Error al añadir subtarea');
      console.error('Error adding subtask:', error);
    }
  });

  const toggleSubtaskMutation = useMutation({
    mutationFn: async ({ subtaskId, completed }: { subtaskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('pre_festival_subtasks')
        .update({ completed })
        .eq('id', subtaskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-festival-tasks'] });
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ taskId, content }: { taskId: string; content: string }) => {
      const { error } = await supabase
        .from('pre_festival_comments')
        .insert({
          task_id: taskId,
          author_name: 'Usuario actual',
          content
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-festival-tasks'] });
    },
    onError: (error) => {
      toast.error('Error al añadir comentario');
      console.error('Error adding comment:', error);
    }
  });

  const addAttachmentMutation = useMutation({
    mutationFn: async ({ taskId, name, url }: { taskId: string; name: string; url: string }) => {
      const { error } = await supabase
        .from('pre_festival_attachments')
        .insert({
          task_id: taskId,
          name,
          url
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-festival-tasks'] });
    },
    onError: (error) => {
      toast.error('Error al añadir adjunto');
      console.error('Error adding attachment:', error);
    }
  });

  // Filter tasks
  const filteredTasks = useMemo(() => {
    const today = new Date();

    return allTasks.filter(task => {
      // Dynamic area filter: check against area name (no more area_id)
      if (filters.area !== 'all' && task.area !== filters.area) return false;
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.assignee !== 'all' && task.assignee_name !== filters.assignee) return false;

      if (filters.showOverdue) {
        const dueDate = new Date(task.due_date);
        if (dueDate >= today || task.status === 'completado') return false;
      }

      if (filters.showNext7Days) {
        const dueDate = new Date(task.due_date);
        const diff = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diff < 0 || diff > 7 || task.status === 'completado') return false;
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(search);
        const matchesAssignee = task.assignee_name.toLowerCase().includes(search);
        const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(search));
        if (!matchesTitle && !matchesAssignee && !matchesTags) return false;
      }

      return true;
    });
  }, [allTasks, filters]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const priorityOrder: Record<TaskPriority, number> = { alta: 0, media: 1, baja: 2 };
    const statusOrder: Record<TaskStatus, number> = { solicitado: 0, pendiente: 1, completado: 2 };

    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case 'due_date':
          comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredTasks, sortConfig]);

  // Group tasks by status for Kanban view
  const tasksByStatus = useMemo(() => {
    return {
      solicitado: sortedTasks.filter(t => t.status === 'solicitado'),
      pendiente: sortedTasks.filter(t => t.status === 'pendiente'),
      completado: sortedTasks.filter(t => t.status === 'completado')
    };
  }, [sortedTasks]);

  // Statistics
  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === 'completado').length;
    const pending = allTasks.filter(t => t.status === 'pendiente').length;
    const solicited = allTasks.filter(t => t.status === 'solicitado').length;

    const today = new Date();
    const overdue = allTasks.filter(t => {
      const dueDate = new Date(t.due_date);
      return dueDate < today && t.status !== 'completado';
    });

    const highPriority = allTasks.filter(t => t.priority === 'alta' && t.status !== 'completado').length;

    return {
      total,
      completed,
      pending,
      solicited,
      overdue: overdue.length,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [allTasks]);

  // Alerts - based on logic
  const alerts = useMemo((): TaskAlert[] => {
    const result: TaskAlert[] = [];
    const today = new Date();

    allTasks.forEach(task => {
      const dueDate = new Date(task.due_date);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (task.status !== 'completado') {
        // Overdue tasks
        if (daysUntilDue < 0) {
          result.push({
            id: `alert-overdue-${task.id}`,
            type: 'overdue',
            task: task as any,
            message: `Vencida hace ${Math.abs(daysUntilDue)} días`
          });
        }

        // Urgent tasks (High Priority & Not Completed)
        // Note: Using else if to avoid double alert for same task if both overdue and high priority?
        // User request: "Una tarea se marca como 'requiere atención' si: Está vencida ... Tiene prioridad alta y no está completada"
        // If I make it else if, an overdue high priority task is just "Overdue". 
        // I will keep them separate or merge? 
        // If I use "else if", I prioritize "Overdue". 
        // If I use "if", I might get two alerts for same task.
        // Let's use "else if" logic similar to mock data to keep it clean.
        else if (task.priority === 'alta') {
          const daysLabel = daysUntilDue < 0 ? 'Vencida' : `Vence en ${Math.ceil(daysUntilDue)} días`;
          result.push({
            id: `alert-urgent-${task.id}`,
            type: 'urgent',
            task: task as any,
            message: `Alta prioridad - ${daysLabel}`
          });
        }
      }
    });

    return result.sort((a, b) => {
      const priority = { overdue: 0, urgent: 1 };
      return priority[a.type] - priority[b.type];
    });
  }, [allTasks]);

  // Wrapper functions for mutations
  const addTask = useCallback((task: Omit<PreFestivalTask, 'id' | 'subtasks' | 'comments' | 'attachments' | 'history'>) => {
    addTaskMutation.mutate(task);
  }, [addTaskMutation]);

  const updateTask = useCallback((taskId: string, updates: Partial<PreFestivalTask>) => {
    updateTaskMutation.mutate({ taskId, updates });
  }, [updateTaskMutation]);

  const deleteTask = useCallback((taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  }, [deleteTaskMutation]);

  const addSubtask = useCallback((taskId: string, title: string) => {
    addSubtaskMutation.mutate({ taskId, title });
  }, [addSubtaskMutation]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    const subtask = task?.subtasks?.find(s => s.id === subtaskId);
    if (subtask) {
      toggleSubtaskMutation.mutate({ subtaskId, completed: !subtask.completed });
    }
  }, [allTasks, toggleSubtaskMutation]);

  const addComment = useCallback((taskId: string, content: string) => {
    addCommentMutation.mutate({ taskId, content });
  }, [addCommentMutation]);

  const addAttachment = useCallback((taskId: string, name: string, url: string) => {
    addAttachmentMutation.mutate({ taskId, name, url });
  }, [addAttachmentMutation]);

  return {
    tasks: sortedTasks,
    allTasks,
    milestones,
    tasksByStatus,
    stats,
    alerts,
    teamMembers,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    addComment,
    addAttachment,
    isLoading: tasksLoading,
    error: tasksError
  };
}
