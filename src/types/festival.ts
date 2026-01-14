export interface FestivalData {
    nombre: string;
    aforoTotal: number;
    fecha: string;
    ubicacion: string;
    horario: string;
    organizador: string;
    overview: {
        entradasVendidas: number;
        ingresosTotales: number;
        ocupacion: number;
        objetivoVentas: number;
        ventasAyer: number;
        mediaVentasDiaria: number;
        diasParaEvento: number;
    };
    ticketingProviders: {
        nombre: string;
        capacidad: number;
        vendidas: number;
        ingresos: number;
    }[];
    zones: {
        zona: string;
        aforo: number;
        vendidas: number;
        ingresos: number;
    }[];
    audiencia: {
        totalAsistentes: number;
        contactStats: {
            conEmail: number;
            conTelefono: number;
            consentimientoMarketing: number;
        };
        provincias: {
            nombre: string;
            asistentes: number;
        }[];
        ciudades: {
            nombre: string;
            asistentes: number;
        }[];
        edades: {
            rango: string;
            asistentes: number;
        }[];
    };
    artistas2025: string[];
    generos: string[];
    precios: {
        anticipada: number;
        general: number;
        vip: number;
    };
    historico: {
        edicion: string;
        anioInicio: number;
        asistentesAnuales: string;
        posicionamiento: string;
    };
    problematicaOperativa: {
        accesos: {
            problema: string;
            detalle: string;
            causas: string[];
            riesgo: string;
        };
        agua: {
            problema: string;
            detalle: string;
            incidentes: string[];
        };
        sanitarios: {
            problema: string;
            detalle: string;
            consecuencia: string;
        };
        acustica: {
            problema: string;
            detalle: string;
        };
    };
    estrategiaComercial: {
        yieldManagement: {
            descripcion: string;
            fases: {
                nombre: string;
                precio: string;
                proposito: string;
            }[];
        };
        costesOcultos: {
            descripcion: string;
            tipos: string[];
        };
        cashless: {
            descripcion: string;
            problemas: string[];
        };
    };
    incidentesHistoricos: {
        año: number;
        problema: string;
        respuesta: string;
        resultado: string;
    }[];
    recomendacionesMejora: {
        paraOrganizacion: string[];
        paraConsumidor: string[];
    };
    contextoMercado: {
        burbuja: string;
        perfil: string;
        churnRate: string;
        riesgoRegulatorio: string;
    };
}
