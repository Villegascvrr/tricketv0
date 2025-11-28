// ÚNICA FUENTE DE DATOS - Festival Primavera Sound 2024
// Todos los componentes deben importar y usar esta estructura

export const festivalData = {
  nombre: 'Festival Primavera Sound 2024',
  aforoTotal: 62000,
  overview: {
    entradasVendidas: 39350,
    ingresosTotales: 4099092, // euros
    ocupacion: 0.635 // 63.5%
  },
  ticketingProviders: [
    {
      nombre: 'Ticketmaster',
      capacidad: 30000,
      vendidas: 23800,
      ingresos: 2973592
    },
    {
      nombre: 'Entradas.com',
      capacidad: 12000,
      vendidas: 4900,
      ingresos: 367054
    },
    {
      nombre: 'Bclever',
      capacidad: 10000,
      vendidas: 8800,
      ingresos: 633226
    },
    {
      nombre: 'Forvenues',
      capacidad: 5000,
      vendidas: 1850,
      ingresos: 125220
    }
  ],
  zones: [
    { zona: 'Pista',        aforo: 25000, vendidas: 16200, ingresos: 1782000 },
    { zona: 'Grada Alta',   aforo: 15000, vendidas: 7300,  ingresos: 657000  },
    { zona: 'Lateral Este', aforo: 10000, vendidas: 5900,  ingresos: 590000  },
    { zona: 'Lateral Oeste',aforo: 7000,  vendidas: 5600,  ingresos: 532000  },
    { zona: 'VIP',          aforo: 5000,  vendidas: 4350,  ingresos: 783092  }
  ],
  // Datos de audiencia (base: 1.000 asistentes)
  audiencia: {
    totalAsistentes: 1000,
    contactStats: {
      conEmail: 1000,        // 100%
      conTelefono: 780,      // 78%
      consentimientoMarketing: 610  // 61%
    },
    provincias: [
      { nombre: 'Madrid', asistentes: 230 },
      { nombre: 'Barcelona', asistentes: 210 },
      { nombre: 'Valencia', asistentes: 170 },
      { nombre: 'Sevilla', asistentes: 140 },
      { nombre: 'Zaragoza', asistentes: 120 },
      { nombre: 'Bizkaia', asistentes: 90 },
      { nombre: 'Girona', asistentes: 40 }
    ],
    ciudades: [
      { nombre: 'Madrid', asistentes: 230 },
      { nombre: 'Barcelona', asistentes: 210 },
      { nombre: 'Valencia', asistentes: 170 },
      { nombre: 'Sevilla', asistentes: 140 },
      { nombre: 'Zaragoza', asistentes: 120 },
      { nombre: 'Bilbao', asistentes: 90 },
      { nombre: 'Girona', asistentes: 40 }
    ],
    edades: [
      { rango: '18-24', asistentes: 220 },
      { rango: '25-34', asistentes: 380 },
      { rango: '35-44', asistentes: 260 },
      { rango: '45+', asistentes: 140 }
    ]
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
