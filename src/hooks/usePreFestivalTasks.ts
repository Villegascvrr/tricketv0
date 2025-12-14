import { useState, useMemo } from 'react';
import { 
  mockTasks, 
  mockMilestones, 
  PreFestivalTask, 
  PreFestivalMilestone,
  TaskArea,
  TaskStatus,
  TaskPriority,
  calculateTaskStats,
  generateTaskAlerts,
  teamMembers
} from '@/data/preFestivalMockData';

export type ViewMode = 'list' | 'kanban' | 'timeline';

export interface TaskFilters {
  area: TaskArea | 'all';
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

export function usePreFestivalTasks() {
  const [tasks, setTasks] = useState<PreFestivalTask[]>(mockTasks);
  const [milestones] = useState<PreFestivalMilestone[]>(mockMilestones);
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

  // Filter tasks
  const filteredTasks = useMemo(() => {
    const today = new Date();
    
    return tasks.filter(task => {
      // Area filter
      if (filters.area !== 'all' && task.area !== filters.area) return false;
      
      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      
      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      
      // Assignee filter
      if (filters.assignee !== 'all' && task.assignee_name !== filters.assignee) return false;
      
      // Overdue filter
      if (filters.showOverdue) {
        const dueDate = new Date(task.due_date);
        if (dueDate >= today || task.status === 'hecha') return false;
      }
      
      // Next 7 days filter
      if (filters.showNext7Days) {
        const dueDate = new Date(task.due_date);
        const diff = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diff < 0 || diff > 7 || task.status === 'hecha') return false;
      }
      
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(search);
        const matchesAssignee = task.assignee_name.toLowerCase().includes(search);
        const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(search));
        if (!matchesTitle && !matchesAssignee && !matchesTags) return false;
      }
      
      return true;
    });
  }, [tasks, filters]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const priorityOrder: Record<TaskPriority, number> = { alta: 0, media: 1, baja: 2 };
    const statusOrder: Record<TaskStatus, number> = { bloqueada: 0, pendiente: 1, en_curso: 2, hecha: 3 };
    
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
      pendiente: sortedTasks.filter(t => t.status === 'pendiente'),
      en_curso: sortedTasks.filter(t => t.status === 'en_curso'),
      bloqueada: sortedTasks.filter(t => t.status === 'bloqueada'),
      hecha: sortedTasks.filter(t => t.status === 'hecha')
    };
  }, [sortedTasks]);

  // Statistics
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);
  
  // Alerts
  const alerts = useMemo(() => generateTaskAlerts(tasks), [tasks]);

  // CRUD operations
  const addTask = (task: Omit<PreFestivalTask, 'id'>) => {
    const newTask: PreFestivalTask = {
      ...task,
      id: `t${Date.now()}`,
      subtasks: [],
      comments: [],
      attachments: [],
      history: [{
        id: `h${Date.now()}`,
        action: 'Tarea creada',
        changed_by: 'Usuario actual',
        created_at: new Date().toISOString()
      }]
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<PreFestivalTask>) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      
      const history = [...(task.history || [])];
      
      // Track status changes
      if (updates.status && updates.status !== task.status) {
        history.push({
          id: `h${Date.now()}`,
          action: 'Estado cambiado',
          old_value: task.status,
          new_value: updates.status,
          changed_by: 'Usuario actual',
          created_at: new Date().toISOString()
        });
      }
      
      // Track assignee changes
      if (updates.assignee_name && updates.assignee_name !== task.assignee_name) {
        history.push({
          id: `h${Date.now() + 1}`,
          action: 'Responsable cambiado',
          old_value: task.assignee_name,
          new_value: updates.assignee_name,
          changed_by: 'Usuario actual',
          created_at: new Date().toISOString()
        });
      }
      
      // Track priority changes
      if (updates.priority && updates.priority !== task.priority) {
        history.push({
          id: `h${Date.now() + 2}`,
          action: 'Prioridad cambiada',
          old_value: task.priority,
          new_value: updates.priority,
          changed_by: 'Usuario actual',
          created_at: new Date().toISOString()
        });
      }
      
      return { ...task, ...updates, history };
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addSubtask = (taskId: string, title: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        subtasks: [
          ...(task.subtasks || []),
          { id: `s${Date.now()}`, title, completed: false }
        ]
      };
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        subtasks: (task.subtasks || []).map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
      };
    }));
  };

  const addComment = (taskId: string, content: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        comments: [
          ...(task.comments || []),
          {
            id: `c${Date.now()}`,
            author_name: 'Usuario actual',
            content,
            created_at: new Date().toISOString()
          }
        ]
      };
    }));
  };

  const addAttachment = (taskId: string, name: string, url: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        attachments: [
          ...(task.attachments || []),
          { id: `a${Date.now()}`, name, url }
        ]
      };
    }));
  };

  return {
    tasks: sortedTasks,
    allTasks: tasks,
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
    addAttachment
  };
}
