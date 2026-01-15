export type ContentType = 'story' | 'reel' | 'post' | 'tiktok' | 'youtube';
export type CampaignStatus = 'active' | 'completed' | 'planned';
export type PostStatus = 'pending' | 'draft_uploaded' | 'approved' | 'posted';

export interface SocialStats {
    platform: 'instagram' | 'tiktok' | 'youtube';
    handle: string;
    followers: number;
    engagementRate: number; // Percentage
}

export interface PostDeliverable {
    id: string;
    type: ContentType;
    concept: string;
    dueDate: string;
    status: PostStatus;
    link?: string;
    views?: number;
}

export interface InfluencerCampaign {
    id: string;
    name: string;
    role: 'Ambassador' | 'One-off' | 'VIP Guest';
    deliverables: PostDeliverable[];
    fee?: number;
    status: CampaignStatus;
}

export interface Influencer {
    id: string;
    name: string;
    niche: string[]; // e.g., ["Music", "Lifestyle"]
    socials: SocialStats[];
    assignedTo: string; // Internal staff member
    campaigns: InfluencerCampaign[];
    totalReach: number;
    status: 'active' | 'contacted' | 'negotiating' | 'rejected';
}

export const demoInfluencers: Influencer[] = [
    {
        id: 'inf-1',
        name: 'Sofia Lifestyle',
        niche: ['Moda', 'Lifestyle'],
        totalReach: 450000,
        status: 'active',
        assignedTo: 'Marta (Community Manager)',
        socials: [
            { platform: 'instagram', handle: '@sofia.style', followers: 320000, engagementRate: 4.5 },
            { platform: 'tiktok', handle: '@sofia.vibes', followers: 130000, engagementRate: 8.2 }
        ],
        campaigns: [
            {
                id: 'cmp-1',
                name: 'Lanzamiento Cartel',
                role: 'Ambassador',
                status: 'active',
                fee: 1500,
                deliverables: [
                    { id: 'p1', type: 'reel', concept: 'Reacción al cartel', dueDate: '2025-02-15', status: 'posted', views: 85000 },
                    { id: 'p2', type: 'story', concept: 'Cuenta atrás', dueDate: '2025-03-20', status: 'pending' }
                ]
            }
        ]
    },
    {
        id: 'inf-2',
        name: 'Carlos Tech',
        niche: ['Tecnología', 'Gadgets'],
        totalReach: 800000,
        status: 'negotiating',
        assignedTo: 'Javi (Marketing)',
        socials: [
            { platform: 'youtube', handle: 'CarlosTechReviews', followers: 750000, engagementRate: 12.1 },
            { platform: 'instagram', handle: '@carlostech', followers: 50000, engagementRate: 2.3 }
        ],
        campaigns: [
            {
                id: 'cmp-2',
                name: 'Experiencia Cashless',
                role: 'One-off',
                status: 'planned',
                deliverables: [
                    { id: 'p3', type: 'reel', concept: 'Cómo funciona la pulsera', dueDate: '2025-03-28', status: 'pending' }
                ]
            }
        ]
    },
    {
        id: 'inf-3',
        name: 'Maria Music',
        niche: ['Música', 'Festivales'],
        totalReach: 120000,
        status: 'active',
        assignedTo: 'Marta (Community Manager)',
        socials: [
            { platform: 'tiktok', handle: '@mariamusicfest', followers: 120000, engagementRate: 15.5 }
        ],
        campaigns: [
            {
                id: 'cmp-3',
                name: 'Sorteo Entradas',
                role: 'Ambassador',
                status: 'completed',
                fee: 500,
                deliverables: [
                    { id: 'p4', type: 'reel', concept: 'Sorteo 2 abonos', dueDate: '2025-01-10', status: 'posted', views: 240000, link: 'instagram.com/p/xyz' }
                ]
            }
        ]
    },
    {
        id: 'inf-4',
        name: 'Alex Foodie',
        niche: ['Gastronomía'],
        totalReach: 60000,
        status: 'contacted',
        assignedTo: 'Laura (Producción)',
        socials: [
            { platform: 'instagram', handle: '@alexnamnam', followers: 60000, engagementRate: 3.8 }
        ],
        campaigns: []
    },
    {
        id: 'inf-5',
        name: 'Lucia Fitness',
        niche: ['Deporte', 'Salud'],
        totalReach: 210000,
        status: 'active',
        assignedTo: 'Marta (Community Manager)',
        socials: [
            { platform: 'instagram', handle: '@luciafit', followers: 210000, engagementRate: 5.1 }
        ],
        campaigns: [
            {
                id: 'cmp-4',
                name: 'Promo Yoga Matinal',
                role: 'VIP Guest',
                status: 'planned',
                deliverables: [
                    { id: 'p5', type: 'story', concept: 'Clase de yoga en el festival', dueDate: '2025-03-29', status: 'pending' }
                ]
            }
        ]
    },
    {
        id: 'inf-6',
        name: 'The Festival Hunters',
        niche: ['Viajes', 'Música'],
        totalReach: 95000,
        status: 'active',
        assignedTo: 'Javi (Marketing)',
        socials: [
            { platform: 'youtube', handle: 'FestEvents', followers: 45000, engagementRate: 8.0 },
            { platform: 'instagram', handle: '@festhunters', followers: 50000, engagementRate: 6.5 }
        ],
        campaigns: [
            {
                id: 'cmp-5',
                name: 'Vlog Completo',
                role: 'Ambassador',
                status: 'active',
                fee: 2000,
                deliverables: [
                    { id: 'p6', type: 'youtube', concept: 'Guía de supervivencia', dueDate: '2025-03-25', status: 'draft_uploaded' }
                ]
            }
        ]
    },
    {
        id: 'inf-7',
        name: 'DJ Amateur',
        niche: ['Música Electrónica'],
        totalReach: 15000,
        status: 'rejected',
        assignedTo: 'N/A',
        socials: [],
        campaigns: []
    },
    {
        id: 'inf-8',
        name: 'Paula Vlogs',
        niche: ['Lifestyle', 'Vlogs'],
        totalReach: 330000,
        status: 'active',
        assignedTo: 'Marta',
        socials: [
            { platform: 'instagram', handle: '@paulavlogs', followers: 150000, engagementRate: 4.2 },
            { platform: 'tiktok', handle: '@paulavlogs_tk', followers: 180000, engagementRate: 9.1 }
        ],
        campaigns: [
            {
                id: 'cmp-6',
                name: 'Outfit Check',
                role: 'VIP Guest',
                status: 'planned',
                deliverables: [
                    { id: 'p7', type: 'reel', concept: 'Mi look para el festi', dueDate: '2025-03-29', status: 'pending' }
                ]
            }
        ]
    },
    {
        id: 'inf-9',
        name: 'Gamer Pro 99',
        niche: ['Gaming'],
        totalReach: 1200000,
        status: 'negotiating',
        assignedTo: 'Director Mkt',
        socials: [
            { platform: 'youtube', handle: 'GamerPro99', followers: 1200000, engagementRate: 15.0 }
        ],
        campaigns: [
            {
                id: 'cmp-7',
                name: 'Torneo en vivo',
                role: 'One-off',
                status: 'planned',
                fee: 5000,
                deliverables: []
            }
        ]
    },
    {
        id: 'inf-10',
        name: 'Sara Makeup',
        niche: ['Belleza'],
        totalReach: 88000,
        status: 'contacted',
        assignedTo: 'Marta',
        socials: [{ platform: 'instagram', handle: '@saramakeup', followers: 88000, engagementRate: 3.5 }],
        campaigns: []
    }
];
