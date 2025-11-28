// Genera recomendaciones de IA dinámicas basadas en los datos reales del festival
import { festivalData } from '@/data/festivalData';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
}

export function generateAIRecommendations(): Recommendation[] {
  const recs: Recommendation[] = [];

  // Verificar si hay datos suficientes
  if (!festivalData.overview.entradasVendidas || festivalData.overview.entradasVendidas === 0) {
    return [];
  }

  // Ocupación global
  const ocupacionGlobal = festivalData.overview.entradasVendidas / festivalData.aforoTotal;
  const precioPromedio = festivalData.overview.ingresosTotales / festivalData.overview.entradasVendidas;
  
  // Objetivo de ingresos: 5M € (fijo para referencia)
  const objetivoIngresos = 5000000;
  const ingresosTotales = festivalData.overview.ingresosTotales;

  // === REGLAS CRÍTICAS (ROJAS) ===
  
  // CRÍTICO: Ocupación total < 50%
  if (ocupacionGlobal < 0.5) {
    recs.push({
      id: 'global-ocupacion-critica',
      title: 'Ocupación global crítica - Por debajo del 50%',
      description: `⚠️ El evento tiene una ocupación de solo ${(ocupacionGlobal * 100).toFixed(1)}% (${festivalData.overview.entradasVendidas.toLocaleString('es-ES')} / ${festivalData.aforoTotal.toLocaleString('es-ES')} entradas vendidas).\n\n💰 Ingresos actuales: ${ingresosTotales.toLocaleString('es-ES')} €\n\n🎯 Acción sugerida: Lanzar campañas de marketing agresivas, promociones de último minuto o descuentos por volumen para alcanzar al menos el 60% de ocupación.`,
      priority: 'high',
      category: 'alert',
      scope: 'global'
    });
  }
  // ALERTA: Ocupación entre 50-70%
  else if (ocupacionGlobal >= 0.5 && ocupacionGlobal < 0.7) {
    recs.push({
      id: 'global-ocupacion-media',
      title: 'Ocupación global moderada - Entre 50-70%',
      description: `📊 El evento tiene una ocupación del ${(ocupacionGlobal * 100).toFixed(1)}% (${festivalData.overview.entradasVendidas.toLocaleString('es-ES')} / ${festivalData.aforoTotal.toLocaleString('es-ES')} entradas).\n\n💰 Ingresos actuales: ${ingresosTotales.toLocaleString('es-ES')} €\n\n🎯 Acción sugerida: Potenciar campañas en redes sociales, activar códigos de descuento exclusivos y reforzar canales de venta con mejor rendimiento.`,
      priority: 'medium',
      category: 'alert',
      scope: 'global'
    });
  }

  // CRÍTICO: Ingresos proyectados < 70% del objetivo
  const proyeccionIngresos = (ingresosTotales / ocupacionGlobal); // Proyección lineal simple
  if (proyeccionIngresos < objetivoIngresos * 0.7) {
    recs.push({
      id: 'global-ingresos-bajo-objetivo',
      title: 'Ingresos proyectados por debajo del 70% del objetivo',
      description: `⚠️ Con la tendencia actual, se proyectan ingresos finales de ${proyeccionIngresos.toLocaleString('es-ES', { maximumFractionDigits: 0 })} € (objetivo: ${objetivoIngresos.toLocaleString('es-ES')} €).\n\n📉 Actualmente: ${((ingresosTotales / objetivoIngresos) * 100).toFixed(1)}% del objetivo alcanzado.\n\n🎯 Acción sugerida: Revisar estrategia de precios, implementar upselling con paquetes premium, y acelerar ventas en ticketeras con capacidad disponible.`,
      priority: 'high',
      category: 'alert',
      scope: 'global'
    });
  }

  // Análisis de cada ticketera
  festivalData.ticketingProviders.forEach(provider => {
    const ocupacionProveedor = provider.vendidas / provider.capacidad;
    const capacidadSinVender = provider.capacidad - provider.vendidas;
    const porcentajeSinVender = (capacidadSinVender / provider.capacidad) * 100;
    
    // CRÍTICO: Ticketera con > 80% capacidad sin vender (< 20% ocupación)
    if (porcentajeSinVender > 80) {
      recs.push({
        id: `provider-${provider.nombre.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}-critico`,
        title: `${provider.nombre} - Capacidad crítica sin vender`,
        description: `⚠️ ${provider.nombre} tiene ${porcentajeSinVender.toFixed(1)}% de capacidad sin vender (${capacidadSinVender.toLocaleString('es-ES')} de ${provider.capacidad.toLocaleString('es-ES')} entradas disponibles).\n\n📊 Vendidas: ${provider.vendidas.toLocaleString('es-ES')} entradas (${(ocupacionProveedor * 100).toFixed(1)}%)\n💰 Ingresos: ${provider.ingresos.toLocaleString('es-ES')} €\n\n🎯 Acción sugerida: Implementar campaña de marketing intensiva específica para este canal, revisar visibilidad en plataforma y considerar redistribuir capacidad.`,
        priority: 'high',
        category: 'marketing',
        scope: 'provider',
        targetKey: provider.nombre
      });
    }
    // IMPORTANTE: Proveedor con ocupación media-baja
    else if (ocupacionProveedor < 0.5) {
      recs.push({
        id: `provider-${provider.nombre.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}-potenciar`,
        title: `Potenciar ventas en ${provider.nombre}`,
        description: `📊 ${provider.nombre} tiene una ocupación del ${(ocupacionProveedor * 100).toFixed(1)}%\n\n📈 Vendidas: ${provider.vendidas.toLocaleString('es-ES')} / ${provider.capacidad.toLocaleString('es-ES')} entradas\n💰 Ingresos: ${provider.ingresos.toLocaleString('es-ES')} €\n\n🎯 Acción sugerida: Implementar promociones exclusivas, descuentos por tiempo limitado o paquetes atractivos en este canal.`,
        priority: 'medium',
        category: 'marketing',
        scope: 'provider',
        targetKey: provider.nombre
      });
    }
    // BUENO: Proveedor con buena ocupación
    else if (ocupacionProveedor > 0.75) {
      recs.push({
        id: `provider-${provider.nombre.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}-optimizar`,
        title: `${provider.nombre} - Alta demanda detectada`,
        description: `✅ ${provider.nombre} tiene una ocupación del ${(ocupacionProveedor * 100).toFixed(1)}%\n\n📈 Vendidas: ${provider.vendidas.toLocaleString('es-ES')} / ${provider.capacidad.toLocaleString('es-ES')} entradas\n💰 Ingresos: ${provider.ingresos.toLocaleString('es-ES')} €\n\n🎯 Acción sugerida: Considerar ajustar precios al alza para entradas restantes o crear paquetes premium para maximizar ingresos.`,
        priority: 'medium',
        category: 'pricing',
        scope: 'provider',
        targetKey: provider.nombre
      });
    }
  });

  // Análisis de zonas
  festivalData.zones.forEach(zone => {
    const ocupacionZona = zone.vendidas / zone.aforo;
    const precioMedioZona = zone.ingresos / zone.vendidas;
    
    // CRÍTICO: Zona con ocupación < 30%
    if (ocupacionZona < 0.3) {
      recs.push({
        id: `zone-${zone.zona.toLowerCase().replace(/\s+/g, '-')}-critica`,
        title: `Zona ${zone.zona} - Ocupación crítica`,
        description: `⚠️ La zona ${zone.zona} tiene solo ${(ocupacionZona * 100).toFixed(1)}% de ocupación.\n\n📊 Vendidas: ${zone.vendidas.toLocaleString('es-ES')} / ${zone.aforo.toLocaleString('es-ES')} entradas\n💰 Ingresos: ${zone.ingresos.toLocaleString('es-ES')} € (precio medio: ${precioMedioZona.toFixed(2)} €)\n\n🎯 Acción sugerida: Implementar descuentos urgentes para esta zona, reasignar aforo o revisar visibilidad en plataformas de venta.`,
        priority: 'high',
        category: 'alert',
        scope: 'zone',
        targetKey: zone.zona
      });
    }
    // Zona con alta ocupación - oportunidad de pricing
    else if (ocupacionZona > 0.8) {
      recs.push({
        id: `zone-${zone.zona.toLowerCase().replace(/\s+/g, '-')}-alta-demanda`,
        title: `Zona ${zone.zona} - Alta demanda`,
        description: `✅ La zona ${zone.zona} tiene ${(ocupacionZona * 100).toFixed(1)}% de ocupación.\n\n📊 Vendidas: ${zone.vendidas.toLocaleString('es-ES')} / ${zone.aforo.toLocaleString('es-ES')} entradas\n💰 Ingresos: ${zone.ingresos.toLocaleString('es-ES')} € (precio medio: ${precioMedioZona.toFixed(2)} €)\n\n🎯 Acción sugerida: Considerar aumentar precios para entradas restantes o crear paquetes VIP exclusivos para maximizar ingresos.`,
        priority: 'medium',
        category: 'pricing',
        scope: 'zone',
        targetKey: zone.zona
      });
    }
    // IMPORTANTE: Zona con ocupación media-baja
    else if (ocupacionZona < 0.5) {
      recs.push({
        id: `zone-${zone.zona.toLowerCase().replace(/\s+/g, '-')}-baja-ocupacion`,
        title: `Zona ${zone.zona} - Ocupación baja`,
        description: `📊 La zona ${zone.zona} tiene ${(ocupacionZona * 100).toFixed(1)}% de ocupación.\n\n📈 Vendidas: ${zone.vendidas.toLocaleString('es-ES')} / ${zone.aforo.toLocaleString('es-ES')} entradas\n💰 Ingresos: ${zone.ingresos.toLocaleString('es-ES')} € (precio medio: ${precioMedioZona.toFixed(2)} €)\n\n🎯 Acción sugerida: Implementar promociones específicas para esta zona, resaltar ventajas o ajustar precios a la baja.`,
        priority: 'medium',
        category: 'alert',
        scope: 'zone',
        targetKey: zone.zona
      });
    }
  });

  // === SUGERENCIAS (AZULES) ===
  
  // SUGERENCIA: Precio medio bajo frente al objetivo (< 100€)
  const precioObjetivo = 100;
  if (precioPromedio < precioObjetivo) {
    recs.push({
      id: 'global-precio-promedio-bajo',
      title: 'Precio promedio por entrada por debajo de objetivo',
      description: `💡 El precio promedio actual es de ${precioPromedio.toFixed(2)}€ (objetivo: ~${precioObjetivo}€).\n\n📊 Ingresos actuales: ${ingresosTotales.toLocaleString('es-ES')} €\n\n🎯 Acción sugerida: Implementar estrategias de upselling como paquetes VIP, merchandising incluido, o experiencias premium para aumentar el ticket promedio.`,
      priority: 'low',
      category: 'pricing',
      scope: 'global'
    });
  }

  // SUGERENCIA: Segmentos demográficos con baja participación (< 10%)
  if (festivalData.audiencia && festivalData.audiencia.edades) {
    festivalData.audiencia.edades.forEach(edad => {
      const participacion = (edad.asistentes / festivalData.audiencia.totalAsistentes) * 100;
      if (participacion < 10) {
        recs.push({
          id: `demografia-${edad.rango.toLowerCase().replace(/\+/g, 'mas')}-baja`,
          title: `Baja conversión en segmento ${edad.rango}`,
          description: `💡 El segmento de edad ${edad.rango} representa solo el ${participacion.toFixed(1)}% de la audiencia (${edad.asistentes} asistentes de ${festivalData.audiencia.totalAsistentes}).\n\n🎯 Acción sugerida: Crear campañas de marketing específicas para este segmento demográfico, ajustar la comunicación o revisar canales de promoción.`,
          priority: 'low',
          category: 'marketing',
          scope: 'ageSegment',
          targetKey: edad.rango
        });
      }
    });
  }

  // Oportunidad: Zonas premium con alta ocupación
  const vipZone = festivalData.zones.find(z => z.zona === 'VIP');
  if (vipZone && (vipZone.vendidas / vipZone.aforo) > 0.8) {
    recs.push({
      id: 'global-exito-premium',
      title: 'Éxito en segmento premium - Expandir oferta',
      description: `✅ La zona VIP tiene excelente ocupación (${((vipZone.vendidas / vipZone.aforo) * 100).toFixed(1)}%).\n\n💰 Ingresos VIP: ${vipZone.ingresos.toLocaleString('es-ES')} €\n\n🎯 Acción sugerida: Crear paquetes adicionales premium, aumentar capacidad VIP en futuros eventos, o implementar experiencias exclusivas de mayor valor.`,
      priority: 'low',
      category: 'marketing',
      scope: 'global'
    });
  }

  return recs;
}
