import { FestivalData } from '@/types/festival';

export const realFestivalData: FestivalData = {
    nombre: 'Primaverando Festival 2025',
    aforoTotal: 25000,
    fecha: '29 de marzo de 2025',
    ubicacion: 'Live Sur Stadium, Estadio La Cartuja, Sevilla',
    horario: '19:00 - 02:00',
    organizador: 'Festivales Ocio Joven S.L.',
    overview: {
        entradasVendidas: 0,
        ingresosTotales: 0, // euros
        ocupacion: 0,
        objetivoVentas: 0,
        ventasAyer: 0,
        mediaVentasDiaria: 0,
        diasParaEvento: 0
    },
    ticketingProviders: [],
    zones: [],
    audiencia: {
        totalAsistentes: 0,
        contactStats: {
            conEmail: 0,
            conTelefono: 0,
            consentimientoMarketing: 0
        },
        provincias: [],
        ciudades: [],
        edades: []
    },
    artistas2025: [],
    generos: [],
    precios: {
        anticipada: 0,
        general: 0,
        vip: 0
    },
    historico: {
        edicion: '',
        anioInicio: new Date().getFullYear(),
        asistentesAnuales: '',
        posicionamiento: ''
    },
    problematicaOperativa: {
        accesos: {
            problema: '',
            detalle: '',
            causas: [],
            riesgo: ''
        },
        agua: {
            problema: '',
            detalle: '',
            incidentes: []
        },
        sanitarios: {
            problema: '',
            detalle: '',
            consecuencia: ''
        },
        acustica: {
            problema: '',
            detalle: ''
        }
    },
    estrategiaComercial: {
        yieldManagement: {
            descripcion: '',
            fases: []
        },
        costesOcultos: {
            descripcion: '',
            tipos: []
        },
        cashless: {
            descripcion: '',
            problemas: []
        }
    },
    incidentesHistoricos: [],
    recomendacionesMejora: {
        paraOrganizacion: [],
        paraConsumidor: []
    },
    contextoMercado: {
        burbuja: '',
        perfil: '',
        churnRate: '',
        riesgoRegulatorio: ''
    }
};
