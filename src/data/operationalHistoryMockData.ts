
export type LogType = 'artist' | 'supplier' | 'permit' | 'infrastructure' | 'staff';
export type LogStatus = 'on_time' | 'delayed' | 'incident';

export interface OperationalLog {
    id: string;
    date: string; // YYYY-MM-DD
    type: LogType;
    title: string;
    description: string;
    status: LogStatus;
    responsible: string;
}

export interface DeviationItem {
    id: string;
    item: string;
    category: LogType;
    plannedDate: string;
    realDate: string;
    delayDays: number;
    impact: 'low' | 'medium' | 'high' | 'critical';
    reason: string;
}

export const demoOperationalHistory: OperationalLog[] = [
    {
        id: 'log-1',
        date: '2024-09-15',
        type: 'permit',
        title: 'Solicitud Licencia Actividad',
        description: 'Presentación del proyecto técnico al ayuntamiento.',
        status: 'on_time',
        responsible: 'Legal'
    },
    {
        id: 'log-2',
        date: '2024-10-01',
        type: 'artist',
        title: 'Cierre Headliner 1',
        description: 'Firma de contrato con "The Giants".',
        status: 'delayed',
        responsible: 'Booking'
    },
    {
        id: 'log-3',
        date: '2024-11-20',
        type: 'supplier',
        title: 'Contratación Seguridad',
        description: 'Cierre acuerdo con ProSeguritas.',
        status: 'on_time',
        responsible: 'Producción'
    },
    {
        id: 'log-4',
        date: '2025-01-10',
        type: 'infrastructure',
        title: 'Diseño Escenario Principal',
        description: 'Aprobación final de renders y riders.',
        status: 'on_time',
        responsible: 'Técnica'
    },
    {
        id: 'log-5',
        date: '2025-02-05',
        type: 'permit',
        title: 'Retraso Licencia Acústica',
        description: 'Ayuntamiento solicita nueva medición de impacto.',
        status: 'incident',
        responsible: 'Legal'
    },
    {
        id: 'log-6',
        date: '2025-03-01',
        type: 'supplier',
        title: 'Reserva Generadores',
        description: 'Pago señal para generadores de backup.',
        status: 'on_time',
        responsible: 'Producción'
    }
];

export const demoDeviations: DeviationItem[] = [
    {
        id: 'dev-1',
        item: 'Firma Headliner Principal',
        category: 'artist',
        plannedDate: '2024-09-01',
        realDate: '2024-10-01',
        delayDays: 30,
        impact: 'high',
        reason: 'Discrepancias en rider técnico'
    },
    {
        id: 'dev-2',
        item: 'Permiso Ocupación Vía Pública',
        category: 'permit',
        plannedDate: '2025-01-15',
        realDate: '2025-01-20',
        delayDays: 5,
        impact: 'low',
        reason: 'Festivo local retrasó trámite'
    },
    {
        id: 'dev-3',
        item: 'Cierre Catering VIP',
        category: 'supplier',
        plannedDate: '2025-02-01',
        realDate: '2025-02-28',
        delayDays: 27,
        impact: 'medium',
        reason: 'Proveedor inicial canceló'
    }
];
