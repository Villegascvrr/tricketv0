
export type ContentType = 'story' | 'reel' | 'post' | 'tiktok' | 'youtube' | 'video';
export type CampaignStatus = 'active' | 'completed' | 'planned';
export type PostStatus = 'Pendiente' | 'Publicada';

// User specified categories
export type InfluencerCategory = 'local' | 'nacional' | 'nicho' | 'lifestyle' | 'musica' | 'otros';
// User specified platforms
export type InfluencerPlatform = 'Instagram' | 'TikTok' | 'YouTube' | 'Otros';
// User specified statuses
export type InfluencerStatus = 'Pendiente' | 'Activo' | 'Finalizado';

export interface SocialStats {
    platform: 'instagram' | 'tiktok' | 'youtube';
    handle: string;
    followers: number;
    engagementRate: number; // Percentage
}

export interface PostDeliverable {
    id: string;
    campaignId?: string; // Optional if nested, but good for flat lists
    platform: InfluencerPlatform;
    type: ContentType;
    concept: string;
    committedDate: string; // Fecha comprometida (formerly dueDate)
    status: PostStatus;
    link?: string;
    notes?: string;
    views?: number; // legacy/optional
}

export type AdminDeliverableType = 'post' | 'story' | 'asistencia' | 'mención' | 'otro';

export interface AdminDeliverable {
    id: string;
    campaignId: string;
    name: string;
    type: AdminDeliverableType;
    deadline: string;
    status: 'Pendiente' | 'Entregado';
    responsible: string;
    notes?: string;
}

export interface InfluencerCampaign {
    id: string;
    name: string;
    description?: string;
    role: 'Ambassador' | 'One-off' | 'VIP Guest';
    deliverables: PostDeliverable[]; // Social media posts
    adminDeliverables: AdminDeliverable[]; // Admin tasks
    fee?: number;
    status: 'Planificada' | 'Activa' | 'Cerrada';
    startDate?: string;
    endDate?: string;
    notes?: string;
}

export interface Influencer {
    id: string;
    name: string;
    primaryPlatform: InfluencerPlatform;
    category: InfluencerCategory;
    contact: {
        email?: string;
        phone?: string;
        socialHandle?: string; // General handle for primary platform
    };
    assignedTo: string; // responsible_interno
    status: InfluencerStatus;
    notes?: string;
    internalNotes?: string;

    // Detailed data (kept for future steps/compatibility)
    socials: SocialStats[];
    campaigns: InfluencerCampaign[];
    totalReach: number; // Can be derived or manual

    createdAt: string;
    updatedAt: string;
}

export const demoInfluencers: Influencer[] = [
    {
        id: 'inf-1',
        name: 'Sofia Lifestyle',
        primaryPlatform: 'Instagram',
        category: 'lifestyle',
        contact: {
            email: 'sofia@agency.com',
            phone: '+34 600 111 222',
            socialHandle: '@sofia.style'
        },
        status: 'Activo',
        assignedTo: 'Marta (Community Manager)',
        totalReach: 450000,
        socials: [
            { platform: 'instagram', handle: '@sofia.style', followers: 320000, engagementRate: 4.5 },
            { platform: 'tiktok', handle: '@sofia.vibes', followers: 130000, engagementRate: 8.2 }
        ],
        campaigns: [
            {
                id: 'cmp-1',
                name: 'Lanzamiento Cartel',
                description: 'Campaña inicial para generar hype sobre el lineup.',
                role: 'Ambassador',
                status: 'Activa',
                fee: 1500,
                startDate: '2025-02-01',
                endDate: '2025-02-28',
                deliverables: [
                    { id: 'p1', type: 'reel', platform: 'Instagram', concept: 'Reacción al cartel', committedDate: '2025-02-15', status: 'Publicada', views: 85000 },
                    { id: 'p2', type: 'story', platform: 'Instagram', concept: 'Cuenta atrás', committedDate: '2025-03-20', status: 'Pendiente' }
                ],
                adminDeliverables: []
            }
        ],
        createdAt: '2025-10-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
    },
    {
        id: 'inf-2',
        name: 'Carlos Tech',
        primaryPlatform: 'YouTube',
        category: 'nicho',
        contact: {
            email: 'carlos@tech.com',
            socialHandle: 'CarlosTechReviews'
        },
        status: 'Pendiente', // Was negotiating
        assignedTo: 'Javi (Marketing)',
        totalReach: 800000,
        socials: [
            { platform: 'youtube', handle: 'CarlosTechReviews', followers: 750000, engagementRate: 12.1 },
            { platform: 'instagram', handle: '@carlostech', followers: 50000, engagementRate: 2.3 }
        ],
        campaigns: [
            {
                id: 'cmp-2',
                name: 'Experiencia Cashless',
                description: 'Explicación del funcionamiento del sistema cashless.',
                role: 'One-off',
                status: 'Planificada',
                startDate: '2025-03-15',
                endDate: '2025-04-01',
                deliverables: [
                    { id: 'p3', type: 'reel', platform: 'Instagram', concept: 'Cómo funciona la pulsera', committedDate: '2025-03-28', status: 'Pendiente' }
                ],
                adminDeliverables: []
            }
        ],
        createdAt: '2025-11-01T09:30:00Z',
        updatedAt: '2025-01-10T14:20:00Z'
    },
    {
        id: 'inf-3',
        name: 'Maria Music',
        primaryPlatform: 'TikTok',
        category: 'musica',
        contact: {
            socialHandle: '@mariamusicfest'
        },
        status: 'Activo',
        assignedTo: 'Marta (Community Manager)',
        totalReach: 120000,
        socials: [
            { platform: 'tiktok', handle: '@mariamusicfest', followers: 120000, engagementRate: 15.5 }
        ],
        campaigns: [
            {
                id: 'cmp-3',
                name: 'Sorteo Entradas',
                role: 'Ambassador',
                status: 'Cerrada',
                fee: 500,
                startDate: '2025-01-01',
                endDate: '2025-01-15',
                deliverables: [
                    { id: 'p4', type: 'reel', platform: 'TikTok', concept: 'Sorteo 2 abonos', committedDate: '2025-01-10', status: 'Publicada', views: 240000, link: 'instagram.com/p/xyz' }
                ],
                adminDeliverables: []
            }
        ],
        createdAt: '2025-09-20T11:00:00Z',
        updatedAt: '2025-12-05T16:45:00Z'
    },
    {
        id: 'inf-4',
        name: 'Alex Foodie',
        primaryPlatform: 'Instagram',
        category: 'nicho',
        contact: {
            email: 'alex@foodie.com',
            socialHandle: '@alexnamnam'
        },
        status: 'Pendiente', // Was contacted
        assignedTo: 'Laura (Producción)',
        totalReach: 60000,
        socials: [
            { platform: 'instagram', handle: '@alexnamnam', followers: 60000, engagementRate: 3.8 }
        ],
        campaigns: [],
        createdAt: '2025-12-10T08:15:00Z',
        updatedAt: '2025-12-10T08:15:00Z'
    },
    {
        id: 'inf-5',
        name: 'Lucia Fitness',
        primaryPlatform: 'Instagram',
        category: 'lifestyle',
        contact: {
            socialHandle: '@luciafit'
        },
        status: 'Activo',
        assignedTo: 'Marta (Community Manager)',
        totalReach: 210000,
        socials: [
            { platform: 'instagram', handle: '@luciafit', followers: 210000, engagementRate: 5.1 }
        ],
        campaigns: [
            {
                id: 'cmp-4',
                name: 'Promo Yoga Matinal',
                description: 'Promoción de actividades saludables en el festival',
                role: 'VIP Guest',
                status: 'Planificada',
                startDate: '2025-03-25',
                endDate: '2025-03-30',
                deliverables: [
                    { id: 'p5', type: 'story', platform: 'Instagram', concept: 'Clase de yoga en el festival', committedDate: '2025-03-29', status: 'Pendiente' }
                ],
                adminDeliverables: []
            }
        ],
        createdAt: '2025-10-05T13:20:00Z',
        updatedAt: '2026-01-02T09:10:00Z'
    },
    {
        id: 'inf-6',
        name: 'The Festival Hunters',
        primaryPlatform: 'YouTube',
        category: 'musica',
        contact: {
            email: 'contact@festhunters.com',
            socialHandle: 'FestEvents'
        },
        status: 'Activo',
        assignedTo: 'Javi (Marketing)',
        totalReach: 95000,
        socials: [
            { platform: 'youtube', handle: 'FestEvents', followers: 45000, engagementRate: 8.0 },
            { platform: 'instagram', handle: '@festhunters', followers: 50000, engagementRate: 6.5 }
        ],
        campaigns: [
            {
                id: 'cmp-5',
                name: 'Vlog Completo',
                role: 'Ambassador',
                status: 'Activa',
                fee: 2000,
                deliverables: [
                    { id: 'p6', type: 'youtube', platform: 'YouTube', concept: 'Guía de supervivencia', committedDate: '2025-03-25', status: 'Pendiente' }
                ],
                adminDeliverables: []
            }
        ],
        createdAt: '2025-08-15T15:00:00Z',
        updatedAt: '2025-11-20T10:30:00Z'
    },
    {
        id: 'inf-7',
        name: 'DJ Amateur Local',
        primaryPlatform: 'Instagram',
        category: 'local',
        contact: {
            socialHandle: '@djamateur_sevilla'
        },
        status: 'Finalizado', // Was rejected
        assignedTo: 'N/A',
        totalReach: 15000,
        socials: [],
        campaigns: [],
        createdAt: '2025-01-05T11:00:00Z',
        updatedAt: '2025-01-06T09:00:00Z'
    },
    {
        id: 'inf-8',
        name: 'Paula Vlogs',
        primaryPlatform: 'TikTok',
        category: 'lifestyle',
        contact: {
            email: 'paula@mgmt.com',
            socialHandle: '@paulavlogs_tk'
        },
        status: 'Activo',
        assignedTo: 'Marta',
        totalReach: 330000,
        socials: [
            { platform: 'instagram', handle: '@paulavlogs', followers: 150000, engagementRate: 4.2 },
            { platform: 'tiktok', handle: '@paulavlogs_tk', followers: 180000, engagementRate: 9.1 }
        ],
        campaigns: [
            {
                id: 'cmp-6',
                name: 'Outfit Check',
                role: 'VIP Guest',
                status: 'Planificada',
                deliverables: [
                    { id: 'p7', type: 'reel', platform: 'TikTok', concept: 'Mi look para el festi', committedDate: '2025-03-29', status: 'Pendiente' }
                ],
                adminDeliverables: []
            }
        ],
        createdAt: '2025-09-01T10:00:00Z',
        updatedAt: '2025-12-15T14:00:00Z'
    },
    {
        id: 'inf-9',
        name: 'Gamer Pro 99',
        primaryPlatform: 'YouTube',
        category: 'otros',
        contact: {
            email: 'business@gamerpro.com',
            socialHandle: 'GamerPro99'
        },
        status: 'Pendiente', // Negotiating
        assignedTo: 'Director Mkt',
        totalReach: 1200000,
        socials: [
            { platform: 'youtube', handle: 'GamerPro99', followers: 1200000, engagementRate: 15.0 }
        ],
        campaigns: [
            {
                id: 'cmp-7',
                name: 'Torneo en vivo',
                role: 'One-off',
                status: 'Planificada',
                fee: 5000,
                deliverables: [],
                adminDeliverables: []
            }
        ],
        createdAt: '2025-11-20T16:00:00Z',
        updatedAt: '2026-01-10T11:00:00Z'
    },
    {
        id: 'inf-10',
        name: 'Sara Makeup',
        primaryPlatform: 'Instagram',
        category: 'nicho',
        contact: {
            socialHandle: '@saramakeup'
        },
        status: 'Finalizado', // Contacted -> maybe finished/rejected? or Pendiente? Let's say Finalizado to show variety or Pendiente. User: Contacted. Let's map to Pendiente.
        assignedTo: 'Marta',
        totalReach: 88000,
        socials: [{ platform: 'instagram', handle: '@saramakeup', followers: 88000, engagementRate: 3.5 }],
        campaigns: [],
        createdAt: '2025-12-05T09:00:00Z',
        updatedAt: '2025-12-05T09:00:00Z'
    }
];
