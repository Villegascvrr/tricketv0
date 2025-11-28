// Genera recomendaciones de IA dinámicas basadas en los datos reales del festival
import { festivalData } from '@/data/festivalData';

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
}

export function generateAIRecommendations(): Recommendation[] {
  const recs: Recommendation[] = [];

  // Ocupación global
  const ocupacionGlobal = festivalData.overview.entradasVendidas / festivalData.aforoTotal;

  // ALERTA: Ocupación global baja
  if (ocupacionGlobal < 0.7) {
    recs.push({
      title: 'Ocupación global del evento por debajo del 70%',
      description: `El evento tiene una ocupación del ${(ocupacionGlobal * 100).toFixed(1)}%. Considera lanzar campañas de marketing agresivas, promociones de último minuto o paquetes especiales para aumentar las ventas y alcanzar el 75-80% de ocupación.`,
      priority: 'high',
      category: 'alert',
      scope: 'global'
    });
  }

  // Análisis de cada proveedor
  festivalData.ticketingProviders.forEach(provider => {
    const ocupacionProveedor = provider.vendidas / provider.capacidad;
    
    // CRÍTICO: Proveedor con ocupación muy baja
    if (ocupacionProveedor < 0.3) {
      recs.push({
        title: `${provider.nombre} con ocupación crítica (${(ocupacionProveedor * 100).toFixed(1)}%)`,
        description: `${provider.nombre} solo ha vendido ${provider.vendidas.toLocaleString()} de ${provider.capacidad.toLocaleString()} entradas. Es urgente implementar una campaña de marketing intensiva específica para este canal o revisar la visibilidad y accesibilidad de compra.`,
        priority: 'high',
        category: 'marketing',
        scope: 'provider',
        targetKey: provider.nombre
      });
    }
    // MEDIA: Proveedor con ocupación media-baja
    else if (ocupacionProveedor < 0.5) {
      recs.push({
        title: `Potenciar ventas en ${provider.nombre}`,
        description: `${provider.nombre} tiene una ocupación del ${(ocupacionProveedor * 100).toFixed(1)}%. Implementa promociones exclusivas, descuentos por tiempo limitado o paquetes atractivos para acelerar las ventas en este canal.`,
        priority: 'medium',
        category: 'marketing',
        scope: 'provider',
        targetKey: provider.nombre
      });
    }
    // BUENO: Proveedor con buena ocupación pero se puede optimizar precio
    else if (ocupacionProveedor > 0.75) {
      recs.push({
        title: `${provider.nombre} con alta demanda - optimizar pricing`,
        description: `${provider.nombre} tiene una ocupación del ${(ocupacionProveedor * 100).toFixed(1)}%. Con esta alta demanda, puedes considerar ajustar precios al alza para entradas restantes o crear paquetes premium para maximizar ingresos.`,
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
    
    // Zona con alta ocupación - oportunidad de pricing
    if (ocupacionZona > 0.8) {
      recs.push({
        title: `Zona ${zone.zona} - alta demanda detectada`,
        description: `La zona ${zone.zona} tiene ${(ocupacionZona * 100).toFixed(1)}% de ocupación. Considera aumentar precios para las entradas restantes o crear paquetes VIP exclusivos para maximizar el revenue de esta zona popular.`,
        priority: 'high',
        category: 'pricing',
        scope: 'zone',
        targetKey: zone.zona
      });
    }
    // Zona con baja ocupación - alerta
    else if (ocupacionZona < 0.5) {
      recs.push({
        title: `Zona ${zone.zona} con baja ocupación`,
        description: `La zona ${zone.zona} solo tiene ${(ocupacionZona * 100).toFixed(1)}% de ocupación (${zone.vendidas.toLocaleString()} de ${zone.aforo.toLocaleString()} entradas). Implementa descuentos específicos para esta zona o campañas de marketing que resalten sus ventajas.`,
        priority: 'medium',
        category: 'alert',
        scope: 'zone',
        targetKey: zone.zona
      });
    }
  });

  // Análisis de ingresos promedio
  const precioPromedio = festivalData.overview.ingresosTotales / festivalData.overview.entradasVendidas;
  
  // Si el precio promedio es bajo, sugerir estrategia de upselling
  if (precioPromedio < 120) {
    recs.push({
      title: 'Precio promedio por entrada inferior a objetivo',
      description: `El precio promedio actual es de ${precioPromedio.toFixed(2)}€. Considera implementar estrategias de upselling como paquetes VIP, merchandising incluido, o experiencias premium para aumentar el ticket promedio.`,
      priority: 'medium',
      category: 'pricing',
      scope: 'global'
    });
  }

  // Oportunidad: Si hay zonas premium con buena ocupación
  const vipZone = festivalData.zones.find(z => z.zona === 'VIP');
  if (vipZone && (vipZone.vendidas / vipZone.aforo) > 0.8) {
    recs.push({
      title: 'Éxito en segmento premium - expandir oferta',
      description: `La zona VIP tiene excelente ocupación (${((vipZone.vendidas / vipZone.aforo) * 100).toFixed(1)}%). Esto indica que existe demanda para experiencias premium. Considera crear paquetes adicionales premium o aumentar la capacidad de zonas VIP en futuros eventos.`,
      priority: 'high',
      category: 'marketing',
      scope: 'global'
    });
  }

  return recs;
}
