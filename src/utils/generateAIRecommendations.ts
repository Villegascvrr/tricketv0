// Genera recomendaciones basadas en REGLAS VISIBLES con contexto específico de Primaverando
import { festivalData } from '@/data/festivalData';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert" | "operations";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
  rule: string; // Regla que dispara esta recomendación
  dataPoint: string; // Dato específico que la justifica
}

// Constantes de referencia Primaverando 2024
const PRIMAVERANDO_2024 = {
  ventasAFecha: 16200, // Entradas vendidas a esta misma fecha en 2024
  ocupacionFinal: 0.92, // 92% ocupación final
  ticketPromedio: 23.50, // € ticket promedio 2024
  ingresosTotales: 380000, // € ingresos totales 2024
  ventasFever: 5800, // Ventas Fever 2024
  ventasECI: 4200, // Ventas El Corte Inglés 2024
  ocupacionVIP: 0.95, // Ocupación VIP 2024
  segmento18_25: 0.78 // % segmento 18-25 en 2024
};

// Fecha actual simulada (12 semanas antes del evento)
const SEMANAS_RESTANTES = 12;
const FECHA_REFERENCIA = '15 de enero 2025';

export function generateAIRecommendations(): Recommendation[] {
  const recs: Recommendation[] = [];

  if (!festivalData.overview.entradasVendidas || festivalData.overview.entradasVendidas === 0) {
    return [];
  }

  const { overview, ticketingProviders, zones, audiencia } = festivalData;
  const ocupacionGlobal = overview.entradasVendidas / festivalData.aforoTotal;
  const ticketPromedio = overview.ingresosTotales / overview.entradasVendidas;

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 1: COMPARATIVA INTERANUAL
  // Dispara si: ventas actuales < ventas Primaverando 2024 en misma fecha
  // ═══════════════════════════════════════════════════════════════════
  const diferenciaVs2024 = overview.entradasVendidas - PRIMAVERANDO_2024.ventasAFecha;
  const pctVs2024 = (overview.entradasVendidas / PRIMAVERANDO_2024.ventasAFecha) * 100;

  if (diferenciaVs2024 < 0) {
    recs.push({
      id: 'interanual-ventas-inferior',
      title: 'Ritmo de ventas inferior a Primaverando 2024',
      description: `A ${FECHA_REFERENCIA}, Primaverando 2024 llevaba ${PRIMAVERANDO_2024.ventasAFecha.toLocaleString('es-ES')} entradas vendidas. Este año llevas ${overview.entradasVendidas.toLocaleString('es-ES')} (${Math.abs(diferenciaVs2024).toLocaleString('es-ES')} menos).

Para igualar el ritmo de 2024, necesitas vender ${Math.abs(diferenciaVs2024).toLocaleString('es-ES')} entradas adicionales en las próximas 2 semanas.

Acción: Activar campaña de retargeting sobre la base de datos de 2024 con mensaje "Últimas semanas de precio reducido".`,
      priority: 'high',
      category: 'alert',
      scope: 'global',
      rule: 'Ventas actuales < Ventas Primaverando 2024 en misma fecha',
      dataPoint: `${pctVs2024.toFixed(0)}% del ritmo de 2024`
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 2: TICKETERA FEVER - MOTOR PRINCIPAL
  // Dispara si: Fever < 85% de su rendimiento 2024
  // ═══════════════════════════════════════════════════════════════════
  const fever = ticketingProviders.find(p => p.nombre === 'Fever');
  if (fever) {
    const feverVs2024 = (fever.vendidas / PRIMAVERANDO_2024.ventasFever) * 100;
    if (feverVs2024 < 85) {
      recs.push({
        id: 'fever-bajo-rendimiento',
        title: 'Fever rinde por debajo de 2024',
        description: `Fever es históricamente el canal con mayor conversión para Primaverando (30% del total). En 2024 llevaba ${PRIMAVERANDO_2024.ventasFever.toLocaleString('es-ES')} a estas fechas; ahora lleva ${fever.vendidas.toLocaleString('es-ES')} (${feverVs2024.toFixed(0)}%).

Fever funciona mejor con urgencia y escasez. El algoritmo de Fever prioriza eventos con "Last tickets" y "Trending".

Acción: Contactar account manager de Fever para activar badge "Últimas entradas" y featured placement.`,
        priority: 'high',
        category: 'marketing',
        scope: 'provider',
        targetKey: 'Fever',
        rule: 'Ventas Fever < 85% de ventas Fever 2024 en misma fecha',
        dataPoint: `${fever.vendidas.toLocaleString('es-ES')} vs ${PRIMAVERANDO_2024.ventasFever.toLocaleString('es-ES')} (2024)`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 3: EL CORTE INGLÉS - CANAL FAMILIAR
  // Dispara si: ECI está por debajo del 75% de su capacidad asignada
  // ═══════════════════════════════════════════════════════════════════
  const eci = ticketingProviders.find(p => p.nombre === 'El Corte Inglés');
  if (eci) {
    const eciOcupacion = (eci.vendidas / eci.capacidad) * 100;
    if (eciOcupacion < 75) {
      recs.push({
        id: 'eci-capacidad-subutilizada',
        title: 'El Corte Inglés tiene margen de venta',
        description: `ECI tiene ${eci.capacidad - eci.vendidas} entradas sin vender de ${eci.capacidad} asignadas (${eciOcupacion.toFixed(0)}% ocupación).

El perfil ECI es diferente: compra con más antelación, busca seguridad y métodos de pago fraccionado. En 2024, ECI convirtió mejor en enero-febrero.

Acción: Activar opción "Pago en 3 cuotas sin intereses" exclusiva para ECI y comunicar en newsletter de Socio Club.`,
        priority: 'medium',
        category: 'marketing',
        scope: 'provider',
        targetKey: 'El Corte Inglés',
        rule: 'Ocupación ECI < 75% de capacidad asignada',
        dataPoint: `${eciOcupacion.toFixed(0)}% ocupación (${eci.vendidas}/${eci.capacidad})`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 4: WEB OFICIAL - CANAL PROPIO INFRAUTILIZADO
  // Dispara si: Web oficial < 50% de capacidad
  // ═══════════════════════════════════════════════════════════════════
  const webOficial = ticketingProviders.find(p => p.nombre === 'Web Oficial');
  if (webOficial) {
    const webOcupacion = (webOficial.vendidas / webOficial.capacidad) * 100;
    if (webOcupacion < 50) {
      recs.push({
        id: 'web-oficial-baja-conversion',
        title: 'Web oficial convierte menos que ticketeras externas',
        description: `La web oficial solo ha vendido ${webOficial.vendidas} de ${webOficial.capacidad} entradas asignadas (${webOcupacion.toFixed(0)}%).

Cada venta en web propia genera €0 de comisión vs 8-12% en plataformas externas. Con ${webOficial.capacidad - webOficial.vendidas} entradas por vender, estás dejando ~€${((webOficial.capacidad - webOficial.vendidas) * ticketPromedio * 0.10).toFixed(0)} en comisiones evitables.

Acción: Crear código "PRIMAVERANDO25" con 5% descuento exclusivo web + merchandising de regalo para primeras 200 compras.`,
        priority: 'medium',
        category: 'pricing',
        scope: 'provider',
        targetKey: 'Web Oficial',
        rule: 'Ocupación Web Oficial < 50%',
        dataPoint: `${webOcupacion.toFixed(0)}% ocupación (€${((webOficial.capacidad - webOficial.vendidas) * ticketPromedio * 0.10).toFixed(0)} en comisiones evitables)`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 5: ZONA VIP - MARGEN ALTO
  // Dispara si: VIP < 90% y quedan < 8 semanas
  // ═══════════════════════════════════════════════════════════════════
  const zonaVIP = zones.find(z => z.zona === 'Zona VIP');
  if (zonaVIP) {
    const vipOcupacion = (zonaVIP.vendidas / zonaVIP.aforo) * 100;
    if (vipOcupacion < 90 && SEMANAS_RESTANTES < 8) {
      const vipRestantes = zonaVIP.aforo - zonaVIP.vendidas;
      const precioVIP = festivalData.precios.vip;
      recs.push({
        id: 'vip-oportunidad-cierre',
        title: 'Zona VIP con margen de cierre',
        description: `Quedan ${vipRestantes} entradas VIP (${(100 - vipOcupacion).toFixed(0)}% disponible). En Primaverando 2024, VIP se agotó 3 semanas antes del evento.

Las VIP generan €${precioVIP}/entrada vs €${festivalData.precios.general} general (+51% margen). ${vipRestantes} VIP = €${(vipRestantes * precioVIP).toLocaleString('es-ES')} potenciales.

Acción: Lanzar campaña Instagram Stories con countdown "VIP casi agotadas" + beneficio exclusivo (meet & greet artista).`,
        priority: 'medium',
        category: 'pricing',
        scope: 'zone',
        targetKey: 'Zona VIP',
        rule: 'VIP < 90% ocupación con < 8 semanas restantes',
        dataPoint: `${vipOcupacion.toFixed(0)}% ocupación, ${vipRestantes} disponibles`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 6: ACCESO PREFERENTE - ZONA PROBLEMÁTICA
  // Dispara si: Acceso Preferente < 60%
  // ═══════════════════════════════════════════════════════════════════
  const accesoPreferente = zones.find(z => z.zona === 'Acceso Preferente');
  if (accesoPreferente) {
    const apOcupacion = (accesoPreferente.vendidas / accesoPreferente.aforo) * 100;
    if (apOcupacion < 60) {
      recs.push({
        id: 'acceso-preferente-baja-demanda',
        title: 'Acceso Preferente no está convenciendo',
        description: `Solo ${apOcupacion.toFixed(0)}% vendido (${accesoPreferente.vendidas}/${accesoPreferente.aforo}). Los comentarios en RRSS de 2024 criticaron que "Acceso Preferente" no garantizaba acceso rápido real.

El problema histórico de colas en Primaverando (90-180 min en 2022-2023) hace que "acceso rápido" sea un beneficio con poca credibilidad.

Acción: Renombrar a "Fast Track + Primer turno de barra" y comunicar beneficio tangible: "Acceso por puerta exclusiva + primera copa gratis".`,
        priority: 'medium',
        category: 'alert',
        scope: 'zone',
        targetKey: 'Acceso Preferente',
        rule: 'Ocupación Acceso Preferente < 60%',
        dataPoint: `${apOcupacion.toFixed(0)}% ocupación (problema de credibilidad histórico)`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 7: SEGMENTO 31+ INFRAREPRESENTADO
  // Dispara si: Segmento 31+ < 10% (fue 12% en 2024)
  // ═══════════════════════════════════════════════════════════════════
  if (audiencia && audiencia.edades) {
    const segmento31 = audiencia.edades.find(e => e.rango === '31+');
    if (segmento31) {
      const pct31 = (segmento31.asistentes / audiencia.totalAsistentes) * 100;
      if (pct31 < 10) {
        recs.push({
          id: 'segmento-31-bajo',
          title: 'Segmento 31+ por debajo de 2024',
          description: `Solo ${pct31.toFixed(0)}% de compradores son 31+ (${segmento31.asistentes} de ${audiencia.totalAsistentes}). En 2024 era 12%.

Este segmento tiene mayor poder adquisitivo y prefiere VIP/experiencias premium. Son los asistentes originales de las primeras ediciones (2019-2021) que ahora trabajan.

Acción: Campaña email a base de datos 2019-2022 con mensaje "Los que empezamos esto" + pack nostalgia (entrada + foto con pass original).`,
          priority: 'low',
          category: 'marketing',
          scope: 'ageSegment',
          targetKey: '31+',
          rule: 'Segmento 31+ < 10% del total',
          dataPoint: `${pct31.toFixed(0)}% actual vs 12% en 2024`
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 8: TIQETS BAJO RENDIMIENTO
  // Dispara si: Tiqets < 50% de capacidad
  // ═══════════════════════════════════════════════════════════════════
  const tiqets = ticketingProviders.find(p => p.nombre === 'Tiqets');
  if (tiqets) {
    const tiqetsOcupacion = (tiqets.vendidas / tiqets.capacidad) * 100;
    if (tiqetsOcupacion < 55) {
      recs.push({
        id: 'tiqets-revisar-asignacion',
        title: 'Tiqets no está moviendo inventario',
        description: `Tiqets solo ha vendido ${tiqets.vendidas} de ${tiqets.capacidad} asignadas (${tiqetsOcupacion.toFixed(0)}%).

Tiqets funciona mejor para turismo internacional y experiencias culturales. Primaverando tiene público principalmente local (70% Andalucía).

Acción: Reducir asignación de Tiqets en 1.000 entradas y reasignar a Fever o Web Oficial. Notificar a Tiqets antes del 31 de enero.`,
        priority: 'medium',
        category: 'alert',
        scope: 'provider',
        targetKey: 'Tiqets',
        rule: 'Tiqets < 55% de capacidad asignada',
        dataPoint: `${tiqetsOcupacion.toFixed(0)}% ocupación - perfil turístico no encaja`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 9: TICKET PROMEDIO BAJO
  // Dispara si: Ticket promedio < Primaverando 2024
  // ═══════════════════════════════════════════════════════════════════
  if (ticketPromedio < PRIMAVERANDO_2024.ticketPromedio) {
    const diferenciaTicket = PRIMAVERANDO_2024.ticketPromedio - ticketPromedio;
    const ingresosPerdidos = diferenciaTicket * overview.entradasVendidas;
    recs.push({
      id: 'ticket-promedio-inferior',
      title: 'Ticket promedio inferior a 2024',
      description: `El ticket promedio actual es €${ticketPromedio.toFixed(2)} vs €${PRIMAVERANDO_2024.ticketPromedio.toFixed(2)} en 2024 (-€${diferenciaTicket.toFixed(2)}/entrada).

Esto representa €${ingresosPerdidos.toLocaleString('es-ES', { maximumFractionDigits: 0 })} menos de lo esperado sobre las ${overview.entradasVendidas.toLocaleString('es-ES')} ventas actuales.

Posible causa: demasiadas ventas en fase Early Bird sin suficiente escalada de precios.

Acción: Cerrar fase actual de precios y subir €3-5 comunicando "Fase 2 agotándose".`,
      priority: 'medium',
      category: 'pricing',
      scope: 'global',
      rule: 'Ticket promedio < €23.50 (Primaverando 2024)',
      dataPoint: `€${ticketPromedio.toFixed(2)} actual vs €${PRIMAVERANDO_2024.ticketPromedio.toFixed(2)} (2024)`
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 10: CONCENTRACIÓN SEVILLA EXCESIVA
  // Dispara si: Sevilla > 45% de ventas
  // ═══════════════════════════════════════════════════════════════════
  if (audiencia && audiencia.provincias) {
    const sevilla = audiencia.provincias.find(p => p.nombre === 'Sevilla');
    if (sevilla) {
      const sevillaPct = (sevilla.asistentes / audiencia.totalAsistentes) * 100;
      if (sevillaPct > 45) {
        recs.push({
          id: 'concentracion-sevilla-alta',
          title: 'Dependencia excesiva del público sevillano',
          description: `${sevillaPct.toFixed(0)}% de compradores son de Sevilla. Esto limita el potencial de crecimiento y aumenta el riesgo si hay evento competidor local.

Cádiz, Málaga y Córdoba sumaron 37% en 2024 pero ahora son solo ${((audiencia.provincias.find(p => p.nombre === 'Cádiz')?.asistentes || 0) + (audiencia.provincias.find(p => p.nombre === 'Málaga')?.asistentes || 0) + (audiencia.provincias.find(p => p.nombre === 'Córdoba')?.asistentes || 0)) / audiencia.totalAsistentes * 100}%.

Acción: Activar campaña geolocalizada en Instagram para Cádiz/Málaga con mensaje "Bus oficial desde tu ciudad + entrada" (partnership con ALSA/Socibus).`,
          priority: 'low',
          category: 'marketing',
          scope: 'city',
          targetKey: 'Sevilla',
          rule: 'Concentración Sevilla > 45%',
          dataPoint: `${sevillaPct.toFixed(0)}% de ventas concentradas en Sevilla`
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 11: GRADA SUPERIOR BAJA OCUPACIÓN
  // Dispara si: Grada Superior < 70%
  // ═══════════════════════════════════════════════════════════════════
  const gradaSuperior = zones.find(z => z.zona === 'Grada Superior');
  if (gradaSuperior) {
    const gsOcupacion = (gradaSuperior.vendidas / gradaSuperior.aforo) * 100;
    if (gsOcupacion < 70) {
      recs.push({
        id: 'grada-superior-baja',
        title: 'Grada Superior rezagada respecto a otras zonas',
        description: `Grada Superior tiene ${gsOcupacion.toFixed(0)}% ocupación (${gradaSuperior.vendidas}/${gradaSuperior.aforo}), la más baja del evento.

El precio medio de Grada Superior (€${(gradaSuperior.ingresos / gradaSuperior.vendidas).toFixed(0)}) es similar a Pista pero la experiencia es percibida como inferior (lejos del escenario).

Acción: Reposicionar como "Zona Relax - Vistas panorámicas" y añadir asientos reservados numerados como diferencial vs Pista.`,
        priority: 'low',
        category: 'alert',
        scope: 'zone',
        targetKey: 'Grada Superior',
        rule: 'Grada Superior < 70% ocupación',
        dataPoint: `${gsOcupacion.toFixed(0)}% ocupación - percepción valor bajo`
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGLA 12: RIESGO OPERATIVO - HISTORIAL DE INCIDENTES
  // Dispara siempre como recordatorio si ocupación > 70%
  // ═══════════════════════════════════════════════════════════════════
  if (ocupacionGlobal > 0.70) {
    recs.push({
      id: 'riesgo-operativo-accesos',
      title: 'Preparar plan de accesos ante alta ocupación',
      description: `Con ${(ocupacionGlobal * 100).toFixed(0)}% de ocupación prevista, se repetirán las condiciones que causaron colapsos en 2019, 2022 y 2023 (tiempos de espera de 90-180 minutos).

Incidentes documentados: denuncias FACUA por escasez de agua, expedientes sancionadores del Ayuntamiento de Sevilla.

Acción urgente: Contratar empresa externa de gestión de flujos + 3 puntos de acceso adicionales + dispensadores de agua gratuitos en cola exterior.`,
      priority: 'high',
      category: 'operations',
      scope: 'global',
      rule: 'Ocupación > 70% + historial de incidentes en accesos',
      dataPoint: `${(ocupacionGlobal * 100).toFixed(0)}% ocupación prevista - 3 incidentes documentados`
    });
  }

  return recs;
}
