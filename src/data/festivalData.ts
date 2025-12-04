// ÚNICA FUENTE DE DATOS - Primaverando Festival 2025
// Todos los componentes deben importar y usar esta estructura

export const festivalData = {
  nombre: 'Primaverando Festival 2025',
  aforoTotal: 20000,
  fecha: '29 de marzo de 2025',
  ubicacion: 'Live Sur Stadium, Estadio La Cartuja, Sevilla',
  horario: '19:00 - 02:00',
  organizador: 'Festivales Ocio Joven S.L.',
  overview: {
    entradasVendidas: 14850,
    ingresosTotales: 371250, // euros
    ocupacion: 0.7425 // 74.25%
  },
  ticketingProviders: [
    {
      nombre: 'Fever',
      capacidad: 6000,
      vendidas: 5340,
      ingresos: 138840 // promedio 26€
    },
    {
      nombre: 'El Corte Inglés',
      capacidad: 5000,
      vendidas: 3950,
      ingresos: 98750 // promedio 25€
    },
    {
      nombre: 'Bclever',
      capacidad: 4500,
      vendidas: 3420,
      ingresos: 78660 // promedio 23€
    },
    {
      nombre: 'Tiqets',
      capacidad: 3000,
      vendidas: 1580,
      ingresos: 37920 // promedio 24€
    },
    {
      nombre: 'Web Oficial',
      capacidad: 1500,
      vendidas: 560,
      ingresos: 17080 // promedio 30.5€ (más VIP)
    }
  ],
  zones: [
    { zona: 'Pista General',     aforo: 10000, vendidas: 7420, ingresos: 170660 },
    { zona: 'Grada Lateral',     aforo: 4000,  vendidas: 2980, ingresos: 68540 },
    { zona: 'Zona VIP',          aforo: 2000,  vendidas: 1850, ingresos: 66600 },
    { zona: 'Grada Superior',    aforo: 2500,  vendidas: 1720, ingresos: 39560 },
    { zona: 'Acceso Preferente', aforo: 1500,  vendidas: 880,  ingresos: 25890 }
  ],
  // Datos de audiencia (base: 1.000 asistentes encuestados)
  audiencia: {
    totalAsistentes: 1000,
    contactStats: {
      conEmail: 1000,        // 100%
      conTelefono: 720,      // 72%
      consentimientoMarketing: 580  // 58%
    },
    provincias: [
      { nombre: 'Sevilla', asistentes: 420 },
      { nombre: 'Cádiz', asistentes: 145 },
      { nombre: 'Málaga', asistentes: 130 },
      { nombre: 'Córdoba', asistentes: 95 },
      { nombre: 'Huelva', asistentes: 85 },
      { nombre: 'Granada', asistentes: 70 },
      { nombre: 'Otras', asistentes: 55 }
    ],
    ciudades: [
      { nombre: 'Sevilla', asistentes: 380 },
      { nombre: 'Dos Hermanas', asistentes: 85 },
      { nombre: 'Cádiz', asistentes: 75 },
      { nombre: 'Málaga', asistentes: 72 },
      { nombre: 'Jerez', asistentes: 68 },
      { nombre: 'Córdoba', asistentes: 62 },
      { nombre: 'Otras', asistentes: 258 }
    ],
    edades: [
      { rango: '18-21', asistentes: 340 },
      { rango: '22-25', asistentes: 380 },
      { rango: '26-30', asistentes: 195 },
      { rango: '31+', asistentes: 85 }
    ]
  },
  // Información adicional del festival
  artistas2025: [
    'Villalobos', 'Henry Méndez', 'Q2', 'Alvama Ice', 
    'Danny Romero', 'Lucho RK', 'Barce'
  ],
  generos: ['Música Urbana/Trap', 'Reggaetón', 'Pop Comercial', 'Electrónica', 'Flamenquito'],
  precios: {
    anticipada: 19,
    general: 24,
    vip: 36.30
  },
  historico: {
    edicion: '5ª edición',
    anioInicio: 2019,
    asistentesAnuales: '30.000-40.000 (Primaverando + Bienvenida)',
    posicionamiento: 'Festival universitario más grande de Andalucía'
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

// Contexto completo para IA
export const getAIContext = () => {
  const { overview, ticketingProviders, zones, audiencia, artistas2025, generos, precios, historico } = festivalData;
  
  return `
## CONTEXTO DEL EVENTO: ${festivalData.nombre}

### Información General
- **Fecha:** ${festivalData.fecha}
- **Ubicación:** ${festivalData.ubicacion}
- **Horario:** ${festivalData.horario}
- **Organizador:** ${festivalData.organizador}
- **Edición:** ${historico.edicion} (desde ${historico.anioInicio})
- **Posicionamiento:** ${historico.posicionamiento}

### Métricas Principales
- **Aforo Total:** ${festivalData.aforoTotal.toLocaleString('es-ES')} personas
- **Entradas Vendidas:** ${overview.entradasVendidas.toLocaleString('es-ES')}
- **Ocupación:** ${(overview.ocupacion * 100).toFixed(1)}%
- **Ingresos Totales:** €${overview.ingresosTotales.toLocaleString('es-ES')}
- **Ticket Promedio:** €${(overview.ingresosTotales / overview.entradasVendidas).toFixed(2)}

### Ventas por Proveedor de Ticketing
${ticketingProviders.map(p => `- **${p.nombre}:** ${p.vendidas.toLocaleString('es-ES')}/${p.capacidad.toLocaleString('es-ES')} vendidas (${((p.vendidas/p.capacidad)*100).toFixed(1)}%) - €${p.ingresos.toLocaleString('es-ES')}`).join('\n')}

### Ocupación por Zona
${zones.map(z => `- **${z.zona}:** ${z.vendidas.toLocaleString('es-ES')}/${z.aforo.toLocaleString('es-ES')} (${((z.vendidas/z.aforo)*100).toFixed(1)}%) - €${z.ingresos.toLocaleString('es-ES')}`).join('\n')}

### Perfil de Audiencia
- **Público objetivo:** Estudiantes universitarios (20-30 años)
- **Procedencia principal:** Sevilla y Andalucía
- **Con email:** ${audiencia.contactStats.conEmail} (100%)
- **Con teléfono:** ${audiencia.contactStats.conTelefono} (${((audiencia.contactStats.conTelefono/audiencia.totalAsistentes)*100).toFixed(0)}%)
- **Consentimiento marketing:** ${audiencia.contactStats.consentimientoMarketing} (${((audiencia.contactStats.consentimientoMarketing/audiencia.totalAsistentes)*100).toFixed(0)}%)

**Distribución por edad:**
${audiencia.edades.map(e => `- ${e.rango} años: ${e.asistentes} (${((e.asistentes/audiencia.totalAsistentes)*100).toFixed(1)}%)`).join('\n')}

**Top provincias:**
${audiencia.provincias.slice(0, 5).map(p => `- ${p.nombre}: ${p.asistentes} (${((p.asistentes/audiencia.totalAsistentes)*100).toFixed(1)}%)`).join('\n')}

### Cartel 2025
${artistas2025.join(', ')}

### Géneros Musicales
${generos.join(', ')}

### Precios de Entradas
- Anticipada: €${precios.anticipada}
- General: €${precios.general}
- VIP: €${precios.vip}

### Contexto Histórico
- Fundado en 2019 por empresarios del sector hostelería sevillano
- Nació como alternativa legal a las fiestas universitarias ilegales
- Track record de descubrir artistas emergentes (Ana Mena, Rels B actuaron antes de ser famosos)
- Dos festivales anuales: Primaverando (marzo) y Bienvenida (octubre)
- Asistencia anual combinada: ${historico.asistentesAnuales}
`.trim();
};
