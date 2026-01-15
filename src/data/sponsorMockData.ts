export type AgreementStatus = 'negotiation' | 'signed' | 'active' | 'closed';
export type DeliverableStatus = 'pending' | 'in_progress' | 'completed' | 'verified';

export interface SponsorAction {
    id: string;
    title: string;
    description: string;
    date?: string;
    status: 'planned' | 'executed' | 'cancelled';
}

export interface Deliverable {
    id: string;
    item: string;
    type: 'digital' | 'physical' | 'experience';
    dueDate: string;
    status: DeliverableStatus;
    proofUrl?: string;
}

export interface Segmentation {
    ageRange: string;
    genderFocus: string; // e.g., "60% Mujer / 40% Hombre"
    interests: string[];
    region?: string;
}

export interface Sponsor {
    id: string;
    name: string;
    sector: string;
    tier: 'Headline' | 'Platinum' | 'Gold' | 'Silver' | 'Partner';
    logoUrl?: string; // Placeholder

    // Agreement
    value: number; // Monetary
    kindValue?: number; // Valor en especie
    status: AgreementStatus;
    startDate: string;
    endDate: string;

    // Content
    description: string;
    segmentation: Segmentation;
    matchScore: number; // 0-100 "afinidad"

    // Management
    deliverables: Deliverable[];
    actions: SponsorAction[];
}

// 15 MARCAS DEMO
export const demoSponsors: Sponsor[] = [
    {
        id: 'sp-1',
        name: 'Red Bull',
        sector: 'Bebidas Energéticas',
        tier: 'Headline',
        value: 150000,
        status: 'active',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        description: 'Partner energético oficial. Activación en escenario principal.',
        matchScore: 95,
        segmentation: { ageRange: '18-30', genderFocus: '55% H / 45% M', interests: ['Música Electrónica', 'Deportes Extremos'] },
        deliverables: [
            { id: 'd1', item: 'Logo en Main Stage', type: 'physical', dueDate: '2025-03-20', status: 'pending' },
            { id: 'd2', item: 'Posts en Instagram (x5)', type: 'digital', dueDate: '2025-03-01', status: 'in_progress' }
        ],
        actions: [
            { id: 'a1', title: 'Red Bull VIP Area', description: 'Zona exclusiva con dj set propio', status: 'planned' }
        ]
    },
    {
        id: 'sp-2',
        name: 'Coca-Cola',
        sector: 'Bebidas',
        tier: 'Platinum',
        value: 120000,
        status: 'signed',
        startDate: '2025-02-01',
        endDate: '2025-12-31',
        description: 'Proveedor exclusivo de refrescos. Zona cero residuos.',
        matchScore: 90,
        segmentation: { ageRange: 'All Ages', genderFocus: '50% / 50%', interests: ['General', 'Sostenibilidad'] },
        deliverables: [
            { id: 'd3', item: 'Vasos reutilizables brandeados', type: 'physical', dueDate: '2025-03-15', status: 'completed' }
        ],
        actions: []
    },
    {
        id: 'sp-3',
        name: 'Heineken',
        sector: 'Cerveza',
        tier: 'Platinum',
        value: 100000,
        status: 'active',
        startDate: '2025-01-15',
        endDate: '2025-04-01',
        description: 'Cerveza oficial. Heineken Green Stage.',
        matchScore: 88,
        segmentation: { ageRange: '25-45', genderFocus: '60% H / 40% M', interests: ['Social', 'Live Music'] },
        deliverables: [],
        actions: [{ id: 'a2', title: 'Beer Garden', description: 'Instalación central de 200m2', status: 'planned' }]
    },
    {
        id: 'sp-4',
        name: 'Jägermeister',
        sector: 'Espirituosas',
        tier: 'Gold',
        value: 60000,
        status: 'active',
        startDate: '2025-03-01',
        endDate: '2025-03-31',
        description: 'Jäger comando y chupitos congelados.',
        matchScore: 85,
        segmentation: { ageRange: '20-35', genderFocus: '50% / 50%', interests: ['Nightlife', 'Party'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-5',
        name: 'Adidas',
        sector: 'Moda',
        tier: 'Gold',
        value: 50000,
        kindValue: 20000,
        status: 'negotiation',
        startDate: '2025-03-28',
        endDate: '2025-03-30',
        description: 'Merchandising oficial y equipación staff.',
        matchScore: 80,
        segmentation: { ageRange: '16-35', genderFocus: '40% H / 60% M', interests: ['Fashion', 'Streetwear'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-6',
        name: 'Uber',
        sector: 'Movilidad',
        tier: 'Gold',
        value: 45000,
        status: 'signed',
        startDate: '2025-03-25',
        endDate: '2025-03-31',
        description: 'Partner de movilidad. Punto de recogida exclusivo.',
        matchScore: 92,
        segmentation: { ageRange: '25+', genderFocus: '50% / 50%', interests: ['Convenience'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-7',
        name: 'Vueling',
        sector: 'Viajes',
        tier: 'Silver',
        value: 30000,
        status: 'negotiation',
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        description: 'Descuento oficial asistentes.',
        matchScore: 70,
        segmentation: { ageRange: '25-50', genderFocus: '50% / 50%', interests: ['Travel'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-8',
        name: 'Ray-Ban',
        sector: 'Moda/Accesorios',
        tier: 'Silver',
        value: 25000,
        status: 'active',
        startDate: '2025-03-29',
        endDate: '2025-03-30',
        description: 'Stand de personalización de gafas.',
        matchScore: 75,
        segmentation: { ageRange: '20-40', genderFocus: '50% / 50%', interests: ['Summer', 'Fashion'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-9',
        name: 'PlayStation',
        sector: 'Tecnología',
        tier: 'Silver',
        value: 30000,
        status: 'negotiation',
        startDate: '2025-03-20',
        endDate: '2025-03-30',
        description: 'Gaming corner en zona de descanso.',
        matchScore: 82,
        segmentation: { ageRange: '15-30', genderFocus: '70% H / 30% M', interests: ['Gaming', 'Tech'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-10',
        name: 'Sephora',
        sector: 'Belleza',
        tier: 'Partner',
        value: 15000,
        kindValue: 10000,
        status: 'signed',
        startDate: '2025-03-29',
        endDate: '2025-03-29',
        description: 'Glitter bar gratuito para asistentes.',
        matchScore: 88,
        segmentation: { ageRange: '16-30', genderFocus: '10% H / 90% M', interests: ['Beauty', 'Makeup'] },
        deliverables: [{ id: 'd10', item: 'Espacio físico 3x3m', type: 'physical', dueDate: '2025-03-20', status: 'verified' }],
        actions: []
    },
    {
        id: 'sp-11',
        name: 'Fnac',
        sector: 'Retail',
        tier: 'Partner',
        value: 10000,
        status: 'closed',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
        description: 'Venta de entradas física.',
        matchScore: 60,
        segmentation: { ageRange: 'All', genderFocus: '50%/50%', interests: ['Culture'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-12',
        name: 'Ayto. Local',
        sector: 'Institucional',
        tier: 'Headline',
        value: 0,
        kindValue: 100000,
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2028-01-01',
        description: 'Cesión de espacios y seguridad.',
        matchScore: 100,
        segmentation: { ageRange: 'All', genderFocus: 'All', interests: ['Local Community'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-13',
        name: 'Visa',
        sector: 'Finanzas',
        tier: 'Headline',
        value: 90000,
        status: 'negotiation',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        description: 'Método de pago preferente Cashless.',
        matchScore: 85,
        segmentation: { ageRange: '18+', genderFocus: '50%/50%', interests: ['Finance'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-14',
        name: 'GoPro',
        sector: 'Tecnología',
        tier: 'Partner',
        value: 15000,
        kindValue: 30000,
        status: 'active',
        startDate: '2025-03-29',
        endDate: '2025-03-30',
        description: 'Cámaras para aftermovie y streaming.',
        matchScore: 90,
        segmentation: { ageRange: '20-40', genderFocus: '60% H / 40% M', interests: ['Tech', 'Adventure'] },
        deliverables: [],
        actions: []
    },
    {
        id: 'sp-15',
        name: 'Pioneer DJ',
        sector: 'Música',
        tier: 'Partner',
        value: 0,
        kindValue: 50000,
        status: 'active',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        description: 'Equipamiento técnico oficial cabinas.',
        matchScore: 98,
        segmentation: { ageRange: '18-45', genderFocus: '50%/50%', interests: ['Music Production'] },
        deliverables: [],
        actions: []
    }
];
