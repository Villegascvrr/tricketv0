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
    ocupacion: 0.7425, // 74.25%
    objetivoVentas: 18000, // 90% del aforo como objetivo realista
    ventasAyer: 342,
    mediaVentasDiaria: 285,
    diasParaEvento: 74 // Calculado desde 15 enero a 29 marzo
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
  },
  // Análisis de problemas históricos y estrategias
  problematicaOperativa: {
    accesos: {
      problema: 'Colapso sistemático de accesos',
      detalle: 'Tiempos de espera de 90-180 minutos en horas punta. Validación de entradas, seguridad y canje de pulseras en único cuello de botella.',
      causas: ['Fallo tecnológico en PDAs', 'Registro intrusivo unidireccional', 'Canje de pulseras manual'],
      riesgo: 'Acumulación estática de masas, lipotimias, deshidratación antes de acceder'
    },
    agua: {
      problema: 'Crisis hidráulica y escasez artificial',
      detalle: 'Denuncias de FACUA por prácticas de escasez artificial para maximizar venta de bebidas.',
      incidentes: ['Grifos de baños inhabilitados', 'Roturas de stock de agua en horas pico', 'Riesgo de golpes de calor']
    },
    sanitarios: {
      problema: 'Saturación de infraestructuras sanitarias',
      detalle: 'Ratio asistentes/inodoro en límite legal mínimo. Falta de equipos de limpieza itinerantes.',
      consecuencia: 'Inodoros inutilizables a mitad del evento, focos de infección'
    },
    acustica: {
      problema: 'Deficiencias acústicas y zonificación',
      detalle: 'Solapamiento de frecuencias entre escenarios (sound bleed), zonas muertas y zonas calientes de presión sonora'
    }
  },
  estrategiaComercial: {
    yieldManagement: {
      descripcion: 'Sistema de precios escalonados basado en urgencia y percepción de escasez',
      fases: [
        { nombre: 'Early Bird / Blind Tickets', precio: '15-20€', proposito: 'Generar hype y liquidez temprana' },
        { nombre: 'Fase 1-2', precio: '19-24€', proposito: 'Escalada por anclaje cognitivo' },
        { nombre: 'Fase Final / Taquilla', precio: 'Hasta 300% del inicial', proposito: 'Penalización por indecisión' }
      ]
    },
    costesOcultos: {
      descripcion: 'Drip Pricing - cargos revelados al final del proceso',
      tipos: ['Gastos de gestión (10-15%)', 'Re-nominación (10-20€)', 'Seguro de no asistencia con exclusiones estrictas']
    },
    cashless: {
      descripcion: 'Sistema de pulseras RFID con retención de capital',
      problemas: ['Flotante financiero a coste cero', 'Breakage (saldo no reclamado)', 'Ventanas de devolución restrictivas (3-5 días)', 'Comisiones de reembolso']
    }
  },
  incidentesHistoricos: [
    { año: 2019, problema: 'Colapso en accesos (>2h espera)', respuesta: 'Ninguna comunicación oficial', resultado: 'Cientos de reclamaciones' },
    { año: 2022, problema: 'Fallo sistema Cashless / Falta de agua', respuesta: 'Incidencia técnica puntual', resultado: 'Usuarios sin poder comprar bebida durante horas' },
    { año: 2023, problema: 'Cancelación artista principal', respuesta: 'Sustituto de menor caché, negativa a devoluciones', resultado: 'Denuncias ante Consumo, daño reputacional severo' }
  ],
  recomendacionesMejora: {
    paraOrganizacion: [
      'Dimensionar accesos, barras y baños para aforo real, no mínimo legal',
      'Eliminar tasas ocultas y simplificar estructura de precios',
      'Formar personal en atención al cliente y desescalada de conflictos',
      'Implementar múltiples perímetros de seguridad escalonados',
      'Garantizar acceso a agua potable gratuita'
    ],
    paraConsumidor: [
      'Evitar fases de precios inflados',
      'Leer letra pequeña de condiciones de devolución',
      'Documentar incidencias in situ para reclamaciones',
      'Conocer derechos según Ley de Espectáculos Públicos'
    ]
  },
  contextoMercado: {
    burbuja: 'Forma parte de la "burbuja de festivales" del sur de España de la última década',
    perfil: 'Población universitaria con demanda inelástica impulsada por FOMO y socialización post-pandémica',
    churnRate: 'Alta rotación de clientes; depende de captar nuevas cohortes universitarias cada año',
    riesgoRegulatorio: 'Expedientes sancionadores acumulados por Ayuntamiento de Sevilla y Junta de Andalucía'
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
  const { overview, ticketingProviders, zones, audiencia, artistas2025, generos, precios, historico, problematicaOperativa, estrategiaComercial, incidentesHistoricos, recomendacionesMejora, contextoMercado } = festivalData;
  
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

---

## ANÁLISIS DE PROBLEMÁTICA Y ESTRATEGIAS

### Problemática Operativa Identificada

**1. Colapso de Accesos (Punto Crítico Cero)**
- ${problematicaOperativa.accesos.detalle}
- Causas: ${problematicaOperativa.accesos.causas.join(', ')}
- Riesgo: ${problematicaOperativa.accesos.riesgo}

**2. Crisis Hidráulica**
- ${problematicaOperativa.agua.detalle}
- Incidentes documentados: ${problematicaOperativa.agua.incidentes.join('; ')}

**3. Infraestructuras Sanitarias**
- ${problematicaOperativa.sanitarios.detalle}
- Consecuencia: ${problematicaOperativa.sanitarios.consecuencia}

**4. Deficiencias Acústicas**
- ${problematicaOperativa.acustica.detalle}

### Estrategia Comercial (Yield Management)

**Sistema de Precios Escalonados:**
${estrategiaComercial.yieldManagement.fases.map(f => `- ${f.nombre}: ${f.precio} (${f.proposito})`).join('\n')}

**Costes Ocultos (Drip Pricing):**
${estrategiaComercial.costesOcultos.tipos.map(t => `- ${t}`).join('\n')}

**Sistema Cashless:**
- ${estrategiaComercial.cashless.descripcion}
- Problemas: ${estrategiaComercial.cashless.problemas.join('; ')}

### Historial de Incidentes
${incidentesHistoricos.map(i => `- **${i.año}:** ${i.problema} → Respuesta: "${i.respuesta}" → Resultado: ${i.resultado}`).join('\n')}

### Contexto de Mercado
- ${contextoMercado.burbuja}
- Perfil consumidor: ${contextoMercado.perfil}
- Retención: ${contextoMercado.churnRate}
- Riesgo: ${contextoMercado.riesgoRegulatorio}

### Recomendaciones de Mejora para la Organización
${recomendacionesMejora.paraOrganizacion.map((r, i) => `${i + 1}. ${r}`).join('\n')}

### Puntos de Atención para Consumidores
${recomendacionesMejora.paraConsumidor.map(r => `- ${r}`).join('\n')}
`.trim();
};
