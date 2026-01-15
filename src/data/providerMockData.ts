export type ProviderStatus = 'ok' | 'risk' | 'blocked';
export type ChecklistItemStatus = 'pending' | 'completed' | 'not_applicable';

export interface KeyDate {
    id: string;
    label: string;
    date: string;
    completed: boolean;
}

export interface ChecklistItem {
    id: string;
    label: string;
    status: ChecklistItemStatus;
}

export interface PaymentItem {
    id: string;
    concept: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
    dueDate: string;
}

export interface ContractItem {
    id: string;
    name: string;
    status: 'draft' | 'signed' | 'pending_signature';
    url?: string;
}

export interface Provider {
    id: string;
    name: string;
    category: string;
    description: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    status: ProviderStatus;

    // Checklist specific
    checklist: {
        contracts: ContractItem[];
        payments: PaymentItem[];
        deliverables: ChecklistItem[];
        dates: KeyDate[];
    };

    notes: string;
    relatedTaskIds: string[];
}

export const mockProviders: Provider[] = [
    {
        id: 'prov-1',
        name: 'SoundPro Audio',
        category: 'Sonido',
        description: 'Proveedor principal de sistemas de PA y microfonía.',
        contactName: 'Javier Sonido',
        contactEmail: 'javier@soundpro.com',
        contactPhone: '+34 600 111 222',
        status: 'ok',
        checklist: {
            contracts: [
                { id: 'c1', name: 'Contrato Marco 2025', status: 'signed', url: '#' }
            ],
            payments: [
                { id: 'p1', concept: 'Anticipo 30%', amount: 15000, status: 'paid', dueDate: '2025-01-15' },
                { id: 'p2', concept: 'Liquidación Final', amount: 35000, status: 'pending', dueDate: '2025-03-30' }
            ],
            deliverables: [
                { id: 'd1', label: 'Rider Técnico Final', status: 'completed' },
                { id: 'd2', label: 'Seguro RC', status: 'pending' },
                { id: 'd3', label: 'Listado de personal', status: 'pending' }
            ],
            dates: [
                { id: 'k1', label: 'Visita Técnica', date: '2025-02-10', completed: true },
                { id: 'k2', label: 'Inicio Montaje', date: '2025-03-27', completed: false }
            ]
        },
        notes: 'Recordar confirmar voltaje de generadores con ellos antes del 15 de Feb.',
        relatedTaskIds: ['t5', 't14']
    },
    {
        id: 'prov-2',
        name: 'LightStage Productions',
        category: 'Iluminación',
        description: 'Estructuras de trust, cabezas móviles y mesas de luces.',
        contactName: 'Elena Luces',
        contactEmail: 'elena@lightstage.com',
        contactPhone: '+34 600 333 444',
        status: 'risk',
        checklist: {
            contracts: [
                { id: 'c2', name: 'Anexo Rider Villalobos', status: 'pending_signature', url: '#' }
            ],
            payments: [
                { id: 'p3', concept: 'Reserva Equipos', amount: 8000, status: 'overdue', dueDate: '2025-02-01' }
            ],
            deliverables: [
                { id: 'd4', label: 'Plot de luces', status: 'completed' },
                { id: 'd5', label: 'Certificado Ignífugo', status: 'pending' }
            ],
            dates: [
                { id: 'k3', label: 'Entrega Render 3D', date: '2025-02-20', completed: false }
            ]
        },
        notes: 'Están reclamando el pago del anticipo. Prioridad.',
        relatedTaskIds: ['t6', 't18']
    },
    {
        id: 'prov-3',
        name: 'SecurEvent Andalucía',
        category: 'Seguridad',
        description: 'Vigilantes, auxiliares y control de accesos.',
        contactName: 'Mario Security',
        contactEmail: 'mario@securevent.com',
        contactPhone: '+34 600 555 666',
        status: 'blocked',
        checklist: {
            contracts: [
                { id: 'c3', name: 'Contrato de Servicios', status: 'draft', url: '#' }
            ],
            payments: [],
            deliverables: [
                { id: 'd6', label: 'Plan de Autoprotección', status: 'not_applicable' },
                { id: 'd7', label: 'Listado TIPs vigilantes', status: 'pending' }
            ],
            dates: [
                { id: 'k4', label: 'Reunión Policía', date: '2025-03-15', completed: false }
            ]
        },
        notes: 'Bloqueado hasta que no envíen la propuesta económica corregida.',
        relatedTaskIds: ['t7', 't26']
    }
];
