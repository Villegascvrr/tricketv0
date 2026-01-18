
export type SponsorCategory = 'bebidas' | 'moda' | 'tech' | 'alimentacion' | 'otros';
export type SponsorStatus = 'pendiente' | 'en_curso' | 'cerrado';
export type AgreementType = 'economico' | 'intercambio' | 'visibilidad' | 'mixto';
export type AgreementStatus = 'propuesto' | 'aceptado' | 'cerrado';
export type DeliverableType = 'logo' | 'mencion' | 'stand' | 'post' | 'story' | 'activacion' | 'otro';
export type DeliverableStatus = 'pendiente' | 'en_proceso' | 'entregado';
export type ActivationStatus = 'pendiente' | 'en_curso' | 'completada';
export type PublicationPlatform = 'instagram' | 'tiktok' | 'x' | 'linkedin' | 'otro';
export type PublicationType = 'post' | 'story' | 'reel' | 'video' | 'tweet' | 'otro';
export type PublicationStatus = 'pendiente' | 'publicada';
export type SponsorFit = 'alto' | 'medio' | 'bajo';

export interface SponsorSegmentation {
    ageRange: string;
    targetAudience: string;
    fit: SponsorFit;
    notes?: string;
}

export interface Publication {
    id: string;
    platform: PublicationPlatform;
    type: PublicationType;
    account: string;
    status: PublicationStatus;
    date: string; // Committed date
    url?: string;
    notes?: string;
}

export interface Activation {
    id: string;
    name: string;
    description: string;
    status: ActivationStatus;
    expectedDate?: string;
    responsible?: string;
    notes?: string;
}

export interface Deliverable {
    id: string;
    name: string;
    type: DeliverableType;
    status: DeliverableStatus;
    deadline?: string;
    responsible?: string;
    notes?: string;
}

export interface Agreement {
    id: string;
    description: string;
    type: AgreementType;
    amount?: number;
    startDate: string; // ISO Date
    endDate: string; // ISO Date
    status: AgreementStatus;
    notes?: string;
}

export interface Sponsor {
    id: string;
    name: string;
    category: SponsorCategory;
    internal_responsible: string;
    status: SponsorStatus;
    agreement_type: AgreementType;
    notes?: string;
    agreements?: Agreement[];
    deliverables?: Deliverable[];
    activations?: Activation[];
    publications?: Publication[];
    segmentation?: SponsorSegmentation;
    created_at: string;
    updated_at: string;
}

export const initialSponsors: Sponsor[] = [
    {
        id: '1',
        name: 'Ron Brugal',
        category: 'bebidas',
        internal_responsible: 'Carlos M.',
        status: 'en_curso',
        agreement_type: 'economico',
        notes: 'Negociando exclusividad en barras VIP',
        segmentation: {
            ageRange: '25-45',
            targetAudience: 'General',
            fit: 'alto',
            notes: 'Encaje perfecto por ser patrocinador premium histórico.'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Red Bull',
        category: 'bebidas',
        internal_responsible: 'Carlos M.',
        status: 'cerrado',
        agreement_type: 'mixto',
        notes: 'Acuerdo cerrado. Incluye escenario propio.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Adidas Originals',
        category: 'moda',
        internal_responsible: 'Ana G.',
        status: 'pendiente',
        agreement_type: 'visibilidad',
        notes: 'Primer contacto realizado. Pendiente reunión.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '4',
        name: 'Uber',
        category: 'tech',
        internal_responsible: 'Lucía P.',
        status: 'en_curso',
        agreement_type: 'mixto',
        notes: 'Punto de recogida exclusivo confirmar ubicación',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Coca-Cola',
        category: 'bebidas',
        internal_responsible: 'Carlos M.',
        status: 'cerrado',
        agreement_type: 'economico',
        notes: 'Renovación del contrato 2024',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '6',
        name: 'Spotify',
        category: 'tech',
        internal_responsible: 'Ana G.',
        status: 'pendiente',
        agreement_type: 'visibilidad',
        notes: 'Propuesta enviada. Interés medio.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '7',
        name: 'Vicio',
        category: 'alimentacion',
        internal_responsible: 'Pedro S.',
        status: 'en_curso',
        agreement_type: 'intercambio',
        notes: 'Catering camerinos + foodtruck zona público',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '8',
        name: 'Heineken',
        category: 'bebidas',
        internal_responsible: 'Carlos M.',
        status: 'pendiente',
        agreement_type: 'economico',
        notes: 'Competencia directa con Estrella Galicia (pendiente)',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '9',
        name: 'Pull & Bear',
        category: 'moda',
        internal_responsible: 'Ana G.',
        status: 'cerrado',
        agreement_type: 'mixto',
        notes: 'Merchandising oficial del staff + activación',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '10',
        name: 'Sony Music',
        category: 'otros',
        internal_responsible: 'Lucía P.',
        status: 'en_curso',
        agreement_type: 'visibilidad',
        notes: 'Colaboración en promoción de artistas emergentes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '11',
        name: 'Glovo',
        category: 'tech',
        internal_responsible: 'Pedro S.',
        status: 'pendiente',
        agreement_type: 'intercambio',
        notes: 'Click & Collect en barras',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '12',
        name: 'Jägermeister',
        category: 'bebidas',
        internal_responsible: 'Carlos M.',
        status: 'en_curso',
        agreement_type: 'economico',
        notes: 'Comando Jäger confirmado',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

export const teamMembers = ['Carlos M.', 'Ana G.', 'Lucía P.', 'Pedro S.', 'María L.'];

export const categoryLabels: Record<SponsorCategory, string> = {
    bebidas: 'Bebidas',
    moda: 'Moda',
    tech: 'Tech',
    alimentacion: 'Alimentación',
    otros: 'Otros'
};

export const statusLabels: Record<SponsorStatus, string> = {
    pendiente: 'Pendiente',
    en_curso: 'En Curso',
    cerrado: 'Cerrado'
};

export const agreementLabels: Record<AgreementType, string> = {
    economico: 'Económico',
    intercambio: 'Intercambio',
    visibilidad: 'Visibilidad',
    mixto: 'Mixto'
};

export const agreementStatusLabels: Record<AgreementStatus, string> = {
    propuesto: 'Propuesto',
    aceptado: 'Aceptado',
    cerrado: 'Cerrado'
};

// Initial Mock Agreements for testing
export const initialAgreements: Agreement[] = [
    {
        id: '1',
        description: 'Exclusividad Barra VIP',
        type: 'economico',
        amount: 25000,
        startDate: '2025-06-01',
        endDate: '2025-06-05',
        status: 'aceptado',
        notes: 'Pago en 2 plazos. 50% a la firma.'
    },
    {
        id: '2',
        description: 'Activación de marca en zona de descanso',
        type: 'visibilidad',
        amount: 0,
        startDate: '2025-06-01',
        endDate: '2025-06-05',
        status: 'propuesto',
        notes: 'Pendiente de aprobación de diseño del stand.'
    }
];

export const deliverableTypeLabels: Record<DeliverableType, string> = {
    logo: 'Logo',
    mencion: 'Mención',
    stand: 'Stand',
    post: 'Post RRSS',
    story: 'Story RRSS',
    activacion: 'Activación',
    otro: 'Otro'
};

export const deliverableStatusLabels: Record<DeliverableStatus, string> = {
    pendiente: 'Pendiente',
    en_proceso: 'En Proceso',
    entregado: 'Entregado'
};

export const initialDeliverables: Deliverable[] = [
    {
        id: '1',
        name: 'Logo en cartel principal',
        type: 'logo',
        status: 'entregado',
        deadline: '2025-05-01',
        responsible: 'Equipo Diseño',
        notes: 'Enviado en vectorial el 15/04'
    },
    {
        id: '2',
        name: 'Post bienvenida Instagram',
        type: 'post',
        status: 'pendiente',
        deadline: '2025-05-15',
        responsible: 'Social Media',
        notes: 'Esperando copy aprobado por marca'
    },
    {
        id: '3',
        name: 'Montaje Stand Zona VIP',
        type: 'stand',
        status: 'en_proceso',
        deadline: '2025-06-10',
        responsible: 'Producción',
        notes: 'Planos recibidos. Pendiente validación técnica.'
    }
];

export const activationStatusLabels: Record<ActivationStatus, string> = {
    pendiente: 'Pendiente',
    en_curso: 'En Curso',
    completada: 'Completada'
};

export const initialActivations: Activation[] = [
    {
        id: '1',
        name: 'Meet & Greet Artista Principal',
        description: 'Sorteo de 5 pases dobles para conocer al cabeza de cartel',
        status: 'pendiente',
        expectedDate: '2025-06-03',
        responsible: 'Equipo Artistico',
        notes: 'Coordinar horario con tour manager'
    },
    {
        id: '2',
        name: 'Tu peso en cerveza',
        description: 'Concurso en escenario principal durante cambio de set',
        status: 'en_curso',
        expectedDate: '2025-06-04',
        responsible: 'Producción / Patrocinios',
        notes: 'Báscula y producto preparados. Falta presentador.'
    }
];

export const publicationPlatformLabels: Record<PublicationPlatform, string> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    x: 'X (Twitter)',
    linkedin: 'LinkedIn',
    otro: 'Otro'
};

export const publicationTypeLabels: Record<PublicationType, string> = {
    post: 'Post',
    story: 'Story',
    reel: 'Reel/Video',
    video: 'Video Largo',
    tweet: 'Tweet',
    otro: 'Otro'
};

export const publicationStatusLabels: Record<PublicationStatus, string> = {
    pendiente: 'Pendiente',
    publicada: 'Publicada'
};

export const initialPublications: Publication[] = [
    {
        id: '1',
        platform: 'instagram',
        type: 'story',
        account: 'Primaverando Oficial',
        status: 'publicada',
        date: '2025-05-20',
        url: 'https://instagram.com/stories/example',
        notes: 'Mención obligatoria a @sponsor'
    },
    {
        id: '2',
        platform: 'tiktok',
        type: 'reel',
        account: 'Influencer Invitado',
        status: 'pendiente',
        date: '2025-06-02',
        notes: 'Video resumen del stand de la marca'
    }
];
