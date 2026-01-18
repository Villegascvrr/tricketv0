// Mock data for Pre-Festival Operations
// This data simulates realistic tasks for Primaverando Festival 2025 (29 Mar 2025)

export type TaskArea = string;
export type TaskStatus = 'solicitado' | 'pendiente' | 'completado';
export type TaskPriority = 'baja' | 'media' | 'alta';

export interface PreFestivalTask {
  id: string;
  title: string;
  description?: string;
  area: TaskArea;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_name: string;
  due_date: string;
  tags: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  comments?: { id: string; author_name: string; content: string; created_at: string }[];
  attachments?: { id: string; name: string; url: string }[];
  history?: { id: string; action: string; old_value?: string; new_value?: string; changed_by: string; created_at: string }[];
}

export interface PreFestivalMilestone {
  id: string;
  title: string;
  description?: string;
  target_date: string;
  tasks: string[]; // task IDs
}

import {
  Clapperboard,
  Truck,
  FileCheck,
  Users,
  Music,
  Briefcase,
  Megaphone,
  Ticket
} from "lucide-react";

export interface PreFestivalAreaDefinition {
  id: string;
  label: string;
  icon: any;
  color: string;
  description: string;
  stats?: {
    solicitado: number;
    pendiente: number;
    completado: number;
  };
}

export const PRE_FESTIVAL_AREAS: PreFestivalAreaDefinition[] = [
  {
    id: 'produccion',
    label: 'Producción',
    icon: Clapperboard,
    color: 'blue',
    description: 'Montaje, técnica, riders y logística escénica'
  },
  {
    id: 'proveedores',
    label: 'Proveedores',
    icon: Truck,
    color: 'orange',
    description: 'Gestión de contratos, suministros y servicios externos'
  },
  {
    id: 'licencias',
    label: 'Permisos y licencias',
    icon: FileCheck,
    color: 'red',
    description: 'Trámites legales, autorizaciones y seguros'
  },
  {
    id: 'rrhh',
    label: 'RRHH',
    icon: Users,
    color: 'green',
    description: 'Contratación de personal, staff y coordinación'
  },
  {
    id: 'artistas',
    label: 'Artistas',
    icon: Music,
    color: 'purple',
    description: 'Booking, hospitalidad y logística de artistas'
  },
];

// Keep for backward compatibility with existing components
export const areaLabels: Record<string, string> = PRE_FESTIVAL_AREAS.reduce((acc, area) => {
  acc[area.id] = area.label;
  return acc;
}, {} as Record<string, string>);

export const statusLabels: Record<TaskStatus, string> = {
  solicitado: 'Solicitado',
  pendiente: 'Pendiente',
  completado: 'Completado'
};

export const priorityLabels: Record<TaskPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta'
};

export const teamMembers = [
  { id: '1', name: 'María García', role: 'Director del Festival' },
  { id: '2', name: 'Juan Pérez', role: 'Ticketing Manager' },
  { id: '3', name: 'Ana Martínez', role: 'Marketing Manager' },
  { id: '4', name: 'Carlos López', role: 'Jefe de Producción' },
  { id: '5', name: 'Laura Sánchez', role: 'Coordinador de Accesos' },
  { id: '6', name: 'Pedro Ruiz', role: 'Staff de Operaciones' },
  { id: '7', name: 'Elena Torres', role: 'Equipo de Barras' },
  { id: '8', name: 'Miguel Rodríguez', role: 'Jefe de Seguridad' },
  { id: '9', name: 'Sara Fernández', role: 'RRHH' },
  { id: '10', name: 'David Moreno', role: 'Logística' },
];

export const mockMilestones: PreFestivalMilestone[] = [
  {
    id: 'm1',
    title: 'Permisos y licencias aprobados',
    description: 'Obtención de todos los permisos municipales y licencias necesarias',
    target_date: '2025-01-31',
    tasks: ['t1', 't2', 't3', 't4']
  },
  {
    id: 'm2',
    title: 'Cierre contratos principales',
    description: 'Todos los proveedores clave contratados',
    target_date: '2025-02-15',
    tasks: ['t5', 't6', 't7', 't8', 't9']
  },
  {
    id: 'm3',
    title: 'Staff completo confirmado',
    description: 'Todo el personal contratado y documentación lista',
    target_date: '2025-03-01',
    tasks: ['t10', 't11', 't12', 't13']
  },
  {
    id: 'm4',
    title: 'Producción lista',
    description: 'Escenarios, sonido e iluminación preparados',
    target_date: '2025-03-20',
    tasks: ['t14', 't15', 't16', 't17', 't18']
  },
  {
    id: 'm5',
    title: 'Operativo accesos preparado',
    description: 'Sistema de ticketing configurado y accesos listos',
    target_date: '2025-03-25',
    tasks: ['t19', 't20', 't21', 't22']
  },
  {
    id: 'm6',
    title: 'Pruebas finales',
    description: 'Pruebas técnicas generales y ensayo de operaciones',
    target_date: '2025-03-28',
    tasks: ['t23', 't24', 't25']
  }
];

export const mockTasks: PreFestivalTask[] = [
  // Licencias/Permisos
  {
    id: 't1',
    title: 'Permiso Ayuntamiento Sevilla',
    description: 'Obtener la autorización del Ayuntamiento para celebrar el evento en La Cartuja',
    area: 'licencias',
    status: 'completado',
    priority: 'alta',
    assignee_name: 'María García',
    due_date: '2025-01-15',
    tags: ['legal', 'crítico'],
    subtasks: [
      { id: 's1', title: 'Preparar documentación', completed: true },
      { id: 's2', title: 'Entregar solicitud', completed: true },
      { id: 's3', title: 'Reunión con Urbanismo', completed: true },
    ],
    history: [
      { id: 'h1', action: 'Estado cambiado', old_value: 'pendiente', new_value: 'completado', changed_by: 'María García', created_at: '2025-01-15T10:00:00Z' }
    ]
  },
  {
    id: 't2',
    title: 'Licencia Espectáculos Públicos',
    description: 'Tramitar la licencia de espectáculos públicos con la Junta de Andalucía',
    area: 'licencias',
    status: 'completado',
    priority: 'alta',
    assignee_name: 'María García',
    due_date: '2025-01-28',
    tags: ['legal', 'crítico'],
    subtasks: [
      { id: 's4', title: 'Solicitar formularios', completed: true },
      { id: 's5', title: 'Adjuntar planos de evacuación', completed: true },
    ]
  },
  {
    id: 't3',
    title: 'Plan de Evacuación',
    description: 'Elaborar y aprobar el plan de evacuación del recinto',
    area: 'licencias',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Miguel Rodríguez',
    due_date: '2025-02-10',
    tags: ['seguridad', 'crítico'],
    subtasks: [
      { id: 's6', title: 'Diseñar rutas de evacuación', completed: true },
      { id: 's7', title: 'Calcular tiempos de evacuación', completed: true },
      { id: 's8', title: 'Aprobar con bomberos', completed: false },
    ]
  },
  {
    id: 't4',
    title: 'Seguro Responsabilidad Civil',
    description: 'Contratar seguro de RC para el evento (mínimo 3M€)',
    area: 'licencias',
    status: 'completado',
    priority: 'alta',
    assignee_name: 'María García',
    due_date: '2025-01-20',
    tags: ['legal', 'financiero']
  },

  // Proveedores
  {
    id: 't5',
    title: 'Contrato SoundPro Audio',
    description: 'Firmar contrato con SoundPro para sistema de sonido principal',
    area: 'proveedores',
    status: 'completado',
    priority: 'alta',
    assignee_name: 'Carlos López',
    due_date: '2025-01-25',
    tags: ['producción', 'sonido'],
    comments: [
      { id: 'c1', author_name: 'Carlos López', content: 'Negociado 5% de descuento por pago anticipado', created_at: '2025-01-20T14:30:00Z' }
    ]
  },
  {
    id: 't6',
    title: 'Contrato LightStage Productions',
    description: 'Cerrar contrato de iluminación para todos los escenarios',
    area: 'proveedores',
    status: 'completado',
    priority: 'alta',
    assignee_name: 'Carlos López',
    due_date: '2025-01-30',
    tags: ['producción', 'iluminación']
  },
  {
    id: 't7',
    title: 'Contrato SecurEvent Andalucía',
    description: 'Contratación empresa de seguridad privada',
    area: 'proveedores',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Miguel Rodríguez',
    due_date: '2025-02-05',
    tags: ['seguridad'],
    subtasks: [
      { id: 's9', title: 'Revisar propuesta', completed: true },
      { id: 's10', title: 'Negociar número de efectivos', completed: true },
      { id: 's11', title: 'Firmar contrato', completed: false },
    ]
  },
  {
    id: 't8',
    title: 'Selección Food Trucks',
    description: 'Seleccionar y contratar los food trucks para el evento',
    area: 'proveedores',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'Elena Torres',
    due_date: '2025-02-15',
    tags: ['catering'],
    subtasks: [
      { id: 's12', title: 'Publicar convocatoria', completed: true },
      { id: 's13', title: 'Revisar propuestas', completed: true },
      { id: 's14', title: 'Seleccionar finalistas', completed: false },
      { id: 's15', title: 'Firmar contratos', completed: false },
    ]
  },
  {
    id: 't9',
    title: 'Contrato limpieza CleanMax',
    description: 'Cerrar contrato de servicios de limpieza',
    area: 'proveedores',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'David Moreno',
    due_date: '2025-02-20',
    tags: ['logística']
  },

  // RRHH
  {
    id: 't10',
    title: 'Contratación personal seguridad',
    description: 'Confirmar los 85 efectivos de seguridad necesarios',
    area: 'rrhh',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Sara Fernández',
    due_date: '2025-02-28',
    tags: ['seguridad', 'staff'],
    subtasks: [
      { id: 's16', title: 'Publicar ofertas', completed: true },
      { id: 's17', title: 'Entrevistas grupo 1', completed: true },
      { id: 's18', title: 'Entrevistas grupo 2', completed: false },
      { id: 's19', title: 'Verificar documentación', completed: false },
    ]
  },
  {
    id: 't11',
    title: 'Contratación personal accesos',
    description: 'Confirmar los 45 controladores de acceso',
    area: 'rrhh',
    status: 'solicitado',
    priority: 'alta',
    assignee_name: 'Sara Fernández',
    due_date: '2025-02-25',
    tags: ['accesos', 'staff'],
    comments: [
      { id: 'c2', author_name: 'Sara Fernández', content: 'Bloqueado: esperando confirmación de presupuesto final', created_at: '2025-01-18T09:00:00Z' }
    ]
  },
  {
    id: 't12',
    title: 'Formación staff seguridad',
    description: 'Organizar jornadas de formación para todo el personal de seguridad',
    area: 'rrhh',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'Miguel Rodríguez',
    due_date: '2025-03-15',
    tags: ['formación', 'seguridad']
  },
  {
    id: 't13',
    title: 'Contratación personal barras',
    description: 'Confirmar los 65 camareros y personal de barras',
    area: 'rrhh',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'Sara Fernández',
    due_date: '2025-03-01',
    tags: ['barras', 'staff']
  },

  // Producción
  {
    id: 't14',
    title: 'Montaje escenario principal',
    description: 'Coordinar el montaje del escenario principal con SoundPro',
    area: 'produccion',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Carlos López',
    due_date: '2025-03-25',
    tags: ['escenarios', 'montaje']
  },
  {
    id: 't15',
    title: 'Rider técnico Villalobos',
    description: 'Completar y validar el rider técnico de Villalobos',
    area: 'produccion',
    status: 'solicitado',
    priority: 'alta',
    assignee_name: 'Carlos López',
    due_date: '2025-02-20',
    tags: ['artistas', 'rider'],
    comments: [
      { id: 'c3', author_name: 'Carlos López', content: 'Pendiente confirmación de mánager sobre equipos específicos', created_at: '2025-01-17T16:00:00Z' }
    ]
  },
  {
    id: 't16',
    title: 'Rider técnico Henry Méndez',
    description: 'Completar y validar el rider de Henry Méndez',
    area: 'produccion',
    status: 'completado',
    priority: 'alta',
    assignee_name: 'Carlos López',
    due_date: '2025-02-10',
    tags: ['artistas', 'rider']
  },
  {
    id: 't17',
    title: 'Sistema PA zona Pista',
    description: 'Instalar y configurar el sistema de PA para la zona Pista',
    area: 'produccion',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Carlos López',
    due_date: '2025-03-26',
    tags: ['sonido', 'montaje']
  },
  {
    id: 't18',
    title: 'Iluminación zona VIP',
    description: 'Instalar iluminación especial para la zona VIP',
    area: 'produccion',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'Carlos López',
    due_date: '2025-03-24',
    tags: ['iluminación', 'VIP']
  },

  // Ticketing/Accesos
  {
    id: 't19',
    title: 'Configurar sistema ticketing',
    description: 'Configurar See Tickets y Fever para la venta del evento',
    area: 'ticketing',
    status: 'completado',
    priority: 'alta',
    assignee_name: 'Juan Pérez',
    due_date: '2025-01-10',
    tags: ['ticketing', 'integración']
  },
  {
    id: 't20',
    title: 'Diseñar flujo de accesos',
    description: 'Diseñar el flujo de entrada y salida del recinto',
    area: 'ticketing',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Laura Sánchez',
    due_date: '2025-02-28',
    tags: ['accesos', 'planificación'],
    subtasks: [
      { id: 's20', title: 'Mapear puntos de entrada', completed: true },
      { id: 's21', title: 'Calcular capacidad por puerta', completed: true },
      { id: 's22', title: 'Diseñar señalización', completed: false },
    ]
  },
  {
    id: 't21',
    title: 'Imprimir acreditaciones',
    description: 'Diseñar e imprimir acreditaciones para staff y artistas',
    area: 'ticketing',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'Juan Pérez',
    due_date: '2025-03-20',
    tags: ['acreditaciones']
  },
  {
    id: 't22',
    title: 'Configurar lectores QR',
    description: 'Instalar y configurar los lectores QR en todos los accesos',
    area: 'ticketing',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Juan Pérez',
    due_date: '2025-03-25',
    tags: ['ticketing', 'hardware']
  },

  // Logística
  {
    id: 't23',
    title: 'Plan de tráfico',
    description: 'Coordinar el plan de tráfico con Policía Local',
    area: 'logistica',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'David Moreno',
    due_date: '2025-03-10',
    tags: ['tráfico', 'policía']
  },
  {
    id: 't24',
    title: 'Señalización recinto',
    description: 'Instalar toda la señalización interior del recinto',
    area: 'logistica',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'David Moreno',
    due_date: '2025-03-27',
    tags: ['señalización']
  },
  {
    id: 't25',
    title: 'Prueba técnica general',
    description: 'Realizar prueba técnica completa de sonido, luz y sistemas',
    area: 'produccion',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Carlos López',
    due_date: '2025-03-28',
    tags: ['pruebas', 'técnico']
  },

  // Seguridad
  {
    id: 't26',
    title: 'Coordinación Policía Local',
    description: 'Reuniones de coordinación con Policía Local de Sevilla',
    area: 'seguridad',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Miguel Rodríguez',
    due_date: '2025-03-15',
    tags: ['policía', 'coordinación']
  },
  {
    id: 't27',
    title: 'Plan de emergencias',
    description: 'Elaborar plan de emergencias y protocolo de actuación',
    area: 'seguridad',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Miguel Rodríguez',
    due_date: '2025-02-28',
    tags: ['emergencias', 'protocolos'],
    subtasks: [
      { id: 's23', title: 'Identificar riesgos', completed: true },
      { id: 's24', title: 'Definir protocolos', completed: true },
      { id: 's25', title: 'Validar con bomberos', completed: false },
      { id: 's26', title: 'Formar al equipo', completed: false },
    ]
  },
  {
    id: 't28',
    title: 'Coordinación sanitarios',
    description: 'Coordinar servicio de ambulancias y punto médico',
    area: 'seguridad',
    status: 'completado',
    priority: 'alta',
    assignee_name: 'Miguel Rodríguez',
    due_date: '2025-02-01',
    tags: ['sanitarios', 'emergencias']
  },

  // Comunicación interna
  {
    id: 't29',
    title: 'Protocolo comunicación staff',
    description: 'Definir canales y protocolos de comunicación entre equipos',
    area: 'comunicacion',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'María García',
    due_date: '2025-03-01',
    tags: ['comunicación', 'protocolos']
  },
  {
    id: 't30',
    title: 'Configurar radios',
    description: 'Configurar y asignar equipos de radio a todos los responsables',
    area: 'comunicacion',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'Pedro Ruiz',
    due_date: '2025-03-20',
    tags: ['radios', 'equipamiento']
  },
  {
    id: 't31',
    title: 'Manual operativo staff',
    description: 'Crear manual operativo para todo el personal',
    area: 'comunicacion',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'María García',
    due_date: '2025-03-15',
    tags: ['documentación', 'formación']
  },

  // Más tareas de logística
  {
    id: 't32',
    title: 'Reservar parking VIP',
    description: 'Gestionar zona de parking exclusiva para VIP y artistas',
    area: 'logistica',
    status: 'pendiente',
    priority: 'baja',
    assignee_name: 'David Moreno',
    due_date: '2025-03-20',
    tags: ['parking', 'VIP']
  },
  {
    id: 't33',
    title: 'Contrato generadores',
    description: 'Contratar generadores de respaldo para todo el recinto',
    area: 'logistica',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'David Moreno',
    due_date: '2025-02-15',
    tags: ['electricidad', 'backup']
  },
  {
    id: 't34',
    title: 'WC químicos',
    description: 'Contratar y ubicar WC químicos en todo el recinto',
    area: 'logistica',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'David Moreno',
    due_date: '2025-03-10',
    tags: ['servicios']
  },

  // RRHH adicional
  {
    id: 't35',
    title: 'Briefing coordinadores',
    description: 'Organizar reunión de briefing con todos los coordinadores de área',
    area: 'rrhh',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'Sara Fernández',
    due_date: '2025-03-25',
    tags: ['formación', 'coordinación']
  },
  {
    id: 't36',
    title: 'Uniformes staff',
    description: 'Encargar y distribuir uniformes para todo el personal',
    area: 'rrhh',
    status: 'pendiente',
    priority: 'media',
    assignee_name: 'Sara Fernández',
    due_date: '2025-03-18',
    tags: ['uniformes', 'staff']
  },

  // Proveedores adicional
  {
    id: 't37',
    title: 'Contrato bebidas sponsor',
    description: 'Cerrar acuerdo con Heineken como proveedor exclusivo de cerveza',
    area: 'proveedores',
    status: 'pendiente',
    priority: 'alta',
    assignee_name: 'María García',
    due_date: '2025-02-10',
    tags: ['sponsor', 'bebidas']
  },
  {
    id: 't38',
    title: 'Alquiler vallas',
    description: 'Contratar empresa de alquiler de vallas y vallado',
    area: 'proveedores',
    status: 'completado',
    priority: 'media',
    assignee_name: 'David Moreno',
    due_date: '2025-02-01',
    tags: ['vallado', 'seguridad']
  }
];

// Function to calculate task statistics
export const calculateTaskStats = (tasks: PreFestivalTask[]) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completado').length;
  const critical = tasks.filter(t => t.priority === 'alta' && t.status !== 'completado').length;
  const solicited = tasks.filter(t => t.status === 'solicitado').length;

  const today = new Date();
  const overdue = tasks.filter(t => {
    const dueDate = new Date(t.due_date);
    return dueDate < today && t.status !== 'completado';
  }).length;

  const next7Days = tasks.filter(t => {
    const dueDate = new Date(t.due_date);
    const diff = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7 && t.status !== 'completado';
  }).length;

  // Risk calculation
  let riskLevel: 'bajo' | 'medio' | 'alto' = 'bajo';
  if (overdue > 3 || (critical > 5 && completed / total < 0.5)) {
    riskLevel = 'alto';
  } else if (overdue > 0 || critical > 3) {
    riskLevel = 'medio';
  }

  return {
    total,
    completed,
    completedPercent: total === 0 ? 0 : Math.round((completed / total) * 100),
    critical,
    blocked: solicited, // Reusing blocked field for solicited or just removing it? UI expects 'blocked'? I should check types.
    // If UI uses 'blocked', I should probably return 'solicited' as 'blocked' or update UI types. 
    // The previous return type had 'blocked'. I'll check if I can change the return type.
    // PreFestivalOps uses 'stats'. I'll update the return object to match new reality.
    solicitado: solicited,
    overdue,
    next7Days,
    riskLevel
  };
};

// Generate alerts based on tasks
export interface TaskAlert {
  id: string;
  type: 'overdue' | 'urgent';
  task: PreFestivalTask;
  message: string;
}

export const generateTaskAlerts = (tasks: PreFestivalTask[]): TaskAlert[] => {
  const alerts: TaskAlert[] = [];
  const today = new Date();

  tasks.forEach(task => {
    const dueDate = new Date(task.due_date);
    const daysUntilDue = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    // Overdue tasks
    if (dueDate < today && task.status !== 'completado') {
      alerts.push({
        id: `alert-overdue-${task.id}`,
        type: 'overdue',
        task,
        message: `Vencida hace ${Math.abs(Math.floor(daysUntilDue))} días`
      });
    }

    // Urgent tasks (High priority AND incomplete)
    // Note: We avoid duplicating if it's already caught as overdue, or maybe we want both?
    // User said "Requires attention if: Overdue OR High Priority & Incomplete".
    // Usually overdue is worse. So if overdue, it's overdue. If not overdue but high priority, it's urgent.
    else if (task.priority === 'alta' && task.status !== 'completado') {
      const daysLabel = daysUntilDue < 0 ? 'Vencida' : `Vence en ${Math.ceil(daysUntilDue)} días`;
      alerts.push({
        id: `alert-urgent-${task.id}`,
        type: 'urgent',
        task,
        message: `Alta prioridad - ${daysLabel}`
      });
    }
  });

  return alerts.sort((a, b) => {
    const priority = { overdue: 0, urgent: 1 };
    return priority[a.type] - priority[b.type];
  });
};
