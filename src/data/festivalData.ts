// ÚNICA FUENTE DE DATOS - Primaverando Festival 2025
// El festival universitario más grande de Andalucía
// Todos los componentes deben importar y usar esta estructura

export const festivalData = {
  nombre: 'Primaverando Festival 2025',
  aforoTotal: 20000,
  fecha: '29 de marzo de 2025',
  ubicacion: 'Estadio de La Cartuja, Sevilla',
  edicion: 6,
  overview: {
    entradasVendidas: 15600,
    ingresosTotales: 358800, // euros (estimado: 15600 * 23€ promedio)
    ocupacion: 0.78 // 78%
  },
  ticketingProviders: [
    {
      nombre: 'Tiqets',
      capacidad: 8000,
      vendidas: 6800,
      ingresos: 156400
    },
    {
      nombre: 'Fever',
      capacidad: 5000,
      vendidas: 3900,
      ingresos: 89700
    },
    {
      nombre: 'El Corte Inglés',
      capacidad: 4000,
      vendidas: 3200,
      ingresos: 73600
    },
    {
      nombre: 'Bclever',
      capacidad: 3000,
      vendidas: 1700,
      ingresos: 39100
    }
  ],
  zones: [
    { zona: 'Pista General',    aforo: 12000, vendidas: 9600,  ingresos: 182400 },
    { zona: 'Zona VIP',         aforo: 2000,  vendidas: 1700,  ingresos: 61200  },
    { zona: 'Lateral Derecho',  aforo: 3000,  vendidas: 2200,  ingresos: 41800  },
    { zona: 'Lateral Izquierdo',aforo: 3000,  vendidas: 2100,  ingresos: 39900  }
  ],
  // Datos de audiencia (base: 1.000 asistentes)
  audiencia: {
    totalAsistentes: 1000,
    contactStats: {
      conEmail: 950,           // 95%
      conTelefono: 820,        // 82%
      consentimientoMarketing: 680  // 68%
    },
    provincias: [
      { nombre: 'Sevilla', asistentes: 420 },
      { nombre: 'Cádiz', asistentes: 180 },
      { nombre: 'Málaga', asistentes: 140 },
      { nombre: 'Córdoba', asistentes: 90 },
      { nombre: 'Huelva', asistentes: 70 },
      { nombre: 'Granada', asistentes: 60 },
      { nombre: 'Madrid', asistentes: 40 }
    ],
    ciudades: [
      { nombre: 'Sevilla', asistentes: 380 },
      { nombre: 'Dos Hermanas', asistentes: 95 },
      { nombre: 'Cádiz', asistentes: 85 },
      { nombre: 'Jerez', asistentes: 80 },
      { nombre: 'Málaga', asistentes: 75 },
      { nombre: 'Córdoba', asistentes: 70 },
      { nombre: 'Alcalá de Guadaíra', asistentes: 55 }
    ],
    edades: [
      { rango: '18-24', asistentes: 520 },
      { rango: '25-34', asistentes: 340 },
      { rango: '35-44', asistentes: 100 },
      { rango: '45+', asistentes: 40 }
    ]
  },
  // Artistas confirmados 2025
  artistas: [
    'Villalobos',
    'Henry Méndez',
    'Q2',
    'Alvama Ice',
    'Danny Romero',
    'Lucho RK',
    'Barce'
  ],
  // Info operacional
  operacional: {
    apertura: '19:00',
    cierre: '02:00',
    duracion: '7 horas',
    equipoCore: 10,
    equipoEvento: 400
  }
};

// Funciones de cálculo derivadas
export const calculateProviderOccupancy = (vendidas: number, capacidad: number) => {
  return (vendidas / capacidad) * 100;
};

export const calculateProviderRemaining = (capacidad: number, vendidas: number) => {
  return capacidad - vendidas;
};

export const calculateZoneOccupancy = (vendidas: number, aforo: number) => {
  return (vendidas / aforo) * 100;
};
