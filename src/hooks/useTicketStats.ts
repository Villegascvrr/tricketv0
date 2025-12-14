import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { festivalData } from '@/data/festivalData';
import { differenceInDays, subDays, format, startOfDay } from 'date-fns';

export interface TicketStats {
  // Core KPIs
  totalSold: number;
  grossRevenue: number;
  occupancyRate: number;
  avgTicketPrice: number;
  
  // Target metrics
  targetSales: number;
  salesGap: number;
  targetProgress: number;
  
  // Trend metrics
  yesterdaySales: number;
  avgDailySales: number;
  salesTrend: number; // percentage vs average
  last7DaysSales: number;
  
  // Time metrics
  daysToFestival: number;
  requiredDailyRate: number; // to meet target
  
  // By provider
  salesByProvider: {
    provider: string;
    sold: number;
    revenue: number;
    capacity: number | null;
    occupancy: number;
  }[];
  
  // By zone
  salesByZone: {
    zone: string;
    sold: number;
    revenue: number;
    capacity: number | null;
    occupancy: number;
  }[];
  
  // By channel
  salesByChannel: {
    channel: string;
    sold: number;
    revenue: number;
    percentage: number;
  }[];
  
  // Sales over time
  salesOverTime: {
    date: string;
    dateLabel: string;
    sales: number;
    revenue: number;
    cumulative: number;
  }[];
  
  // Demographics
  demographics: {
    byAge: { range: string; count: number; percentage: number }[];
    byProvince: { province: string; count: number; percentage: number }[];
    byCity: { city: string; count: number; percentage: number }[];
    withEmail: number;
    withPhone: number;
    withMarketingConsent: number;
  };
  
  // Data source
  isDemo: boolean;
  hasRealData: boolean;
  lastUpdated: Date;
}

const FESTIVAL_DATE = new Date('2025-03-29');
const REFERENCE_DATE = new Date('2025-01-15'); // Demo reference date
const TARGET_SALES = 18000; // 90% of 20,000 capacity

export const useTicketStats = (eventId: string) => {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isDemo = eventId?.startsWith('demo-') ?? false;

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isDemo) {
          // Use festivalData for demo mode
          const demoStats = generateDemoStats();
          setStats(demoStats);
        } else {
          // Fetch real data from Supabase
          const realStats = await fetchRealStats(eventId);
          setStats(realStats);
        }
      } catch (err) {
        console.error('Error fetching ticket stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        // Fallback to demo data on error
        setStats(generateDemoStats());
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchStats();
    }
  }, [eventId, isDemo]);

  return { stats, loading, error, refetch: () => setLoading(true) };
};

// Generate demo stats from festivalData
function generateDemoStats(): TicketStats {
  const { overview, ticketingProviders, zones, audiencia } = festivalData;
  
  const daysToFestival = differenceInDays(FESTIVAL_DATE, REFERENCE_DATE);
  const totalSold = overview.entradasVendidas;
  const grossRevenue = overview.ingresosTotales;
  const targetSales = overview.objetivoVentas || TARGET_SALES;
  const salesGap = targetSales - totalSold;
  
  // Sales by provider
  const salesByProvider = ticketingProviders.map(p => ({
    provider: p.nombre,
    sold: p.vendidas,
    revenue: p.ingresos,
    capacity: p.capacidad,
    occupancy: (p.vendidas / p.capacidad) * 100,
  }));
  
  // Sales by zone
  const salesByZone = zones.map(z => ({
    zone: z.zona,
    sold: z.vendidas,
    revenue: z.ingresos,
    capacity: z.aforo,
    occupancy: (z.vendidas / z.aforo) * 100,
  }));
  
  // Simulated channel distribution
  const channelDistribution = [
    { channel: 'Online', percentage: 45 },
    { channel: 'App Móvil', percentage: 25 },
    { channel: 'RRPP', percentage: 18 },
    { channel: 'Taquilla', percentage: 8 },
    { channel: 'Corporativo', percentage: 4 },
  ];
  
  const salesByChannel = channelDistribution.map(c => ({
    channel: c.channel,
    sold: Math.round(totalSold * (c.percentage / 100)),
    revenue: Math.round(grossRevenue * (c.percentage / 100)),
    percentage: c.percentage,
  }));
  
  // Generate sales over time (last 30 days)
  const salesOverTime = generateSimulatedSalesOverTime(totalSold, grossRevenue, 30);
  
  // Yesterday and average calculations
  const yesterdaySales = overview.ventasAyer || 342;
  const avgDailySales = overview.mediaVentasDiaria || 285;
  const salesTrend = ((yesterdaySales - avgDailySales) / avgDailySales) * 100;
  const last7DaysSales = salesOverTime.slice(-7).reduce((sum, d) => sum + d.sales, 0);
  
  // Required daily rate to meet target
  const requiredDailyRate = salesGap > 0 ? Math.ceil(salesGap / daysToFestival) : 0;
  
  // Demographics from audiencia
  const totalAudiencia = audiencia.totalAsistentes;
  
  return {
    totalSold,
    grossRevenue,
    occupancyRate: overview.ocupacion * 100,
    avgTicketPrice: grossRevenue / totalSold,
    targetSales,
    salesGap,
    targetProgress: (totalSold / targetSales) * 100,
    yesterdaySales,
    avgDailySales,
    salesTrend,
    last7DaysSales,
    daysToFestival,
    requiredDailyRate,
    salesByProvider,
    salesByZone,
    salesByChannel,
    salesOverTime,
    demographics: {
      byAge: audiencia.edades.map(e => ({
        range: e.rango,
        count: e.asistentes,
        percentage: (e.asistentes / totalAudiencia) * 100,
      })),
      byProvince: audiencia.provincias.map(p => ({
        province: p.nombre,
        count: p.asistentes,
        percentage: (p.asistentes / totalAudiencia) * 100,
      })),
      byCity: audiencia.ciudades.map(c => ({
        city: c.nombre,
        count: c.asistentes,
        percentage: (c.asistentes / totalAudiencia) * 100,
      })),
      withEmail: audiencia.contactStats.conEmail,
      withPhone: audiencia.contactStats.conTelefono,
      withMarketingConsent: audiencia.contactStats.consentimientoMarketing,
    },
    isDemo: true,
    hasRealData: false,
    lastUpdated: new Date(),
  };
}

// Fetch real stats from Supabase
async function fetchRealStats(eventId: string): Promise<TicketStats> {
  const now = new Date();
  const daysToFestival = differenceInDays(FESTIVAL_DATE, now);
  
  // Fetch all tickets for this event
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'confirmed');

  if (error) throw error;

  // If no tickets, return empty stats with demo fallback
  if (!tickets || tickets.length === 0) {
    const demoStats = generateDemoStats();
    return { ...demoStats, hasRealData: false, isDemo: false };
  }

  const totalSold = tickets.length;
  const grossRevenue = tickets.reduce((sum, t) => sum + Number(t.price || 0), 0);
  const targetSales = TARGET_SALES;
  const salesGap = targetSales - totalSold;
  
  // Fetch provider allocations for capacity
  const { data: allocations } = await supabase
    .from('ticket_provider_allocations')
    .select('provider_name, allocated_capacity')
    .eq('event_id', eventId);

  const allocationMap = new Map(
    allocations?.map(a => [a.provider_name, a.allocated_capacity]) || []
  );

  // Fetch zones for capacity
  const { data: zones } = await supabase
    .from('zones')
    .select('name, capacity')
    .eq('event_id', eventId);

  const zoneMap = new Map(
    zones?.map(z => [z.name, z.capacity]) || []
  );

  // Group by provider
  const providerGroups = groupBy(tickets, t => t.provider_name || 'Sin ticketera');
  const salesByProvider = Object.entries(providerGroups).map(([provider, tix]) => {
    const capacity = allocationMap.get(provider) || null;
    return {
      provider,
      sold: tix.length,
      revenue: tix.reduce((sum, t) => sum + Number(t.price || 0), 0),
      capacity,
      occupancy: capacity ? (tix.length / capacity) * 100 : 0,
    };
  });

  // Group by zone
  const zoneGroups = groupBy(tickets, t => t.zone_name || 'Sin zona');
  const salesByZone = Object.entries(zoneGroups).map(([zone, tix]) => {
    const capacity = zoneMap.get(zone) || null;
    return {
      zone,
      sold: tix.length,
      revenue: tix.reduce((sum, t) => sum + Number(t.price || 0), 0),
      capacity,
      occupancy: capacity ? (tix.length / capacity) * 100 : 0,
    };
  });

  // Group by channel
  const channelGroups = groupBy(tickets, t => t.channel || 'Sin canal');
  const salesByChannel = Object.entries(channelGroups).map(([channel, tix]) => ({
    channel,
    sold: tix.length,
    revenue: tix.reduce((sum, t) => sum + Number(t.price || 0), 0),
    percentage: (tix.length / totalSold) * 100,
  }));

  // Sales over time (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(now, 29 - i);
    return format(startOfDay(date), 'yyyy-MM-dd');
  });

  const salesByDay = groupBy(tickets, t => {
    const saleDate = new Date(t.sale_date);
    return format(startOfDay(saleDate), 'yyyy-MM-dd');
  });

  let cumulative = 0;
  const salesOverTime = last30Days.map(date => {
    const dayTickets = salesByDay[date] || [];
    const sales = dayTickets.length;
    const revenue = dayTickets.reduce((sum, t) => sum + Number(t.price || 0), 0);
    cumulative += sales;
    
    return {
      date,
      dateLabel: format(new Date(date), 'd MMM'),
      sales,
      revenue,
      cumulative,
    };
  });

  // Yesterday and average
  const yesterdayDate = format(subDays(now, 1), 'yyyy-MM-dd');
  const yesterdaySales = salesByDay[yesterdayDate]?.length || 0;
  const last7DaysSales = salesOverTime.slice(-7).reduce((sum, d) => sum + d.sales, 0);
  const avgDailySales = Math.round(last7DaysSales / 7);
  const salesTrend = avgDailySales > 0 ? ((yesterdaySales - avgDailySales) / avgDailySales) * 100 : 0;
  
  // Required daily rate
  const requiredDailyRate = salesGap > 0 && daysToFestival > 0 ? Math.ceil(salesGap / daysToFestival) : 0;

  // Demographics
  const ticketsWithAge = tickets.filter(t => t.buyer_age);
  const ageGroups = {
    '18-21': ticketsWithAge.filter(t => t.buyer_age! >= 18 && t.buyer_age! <= 21).length,
    '22-25': ticketsWithAge.filter(t => t.buyer_age! >= 22 && t.buyer_age! <= 25).length,
    '26-30': ticketsWithAge.filter(t => t.buyer_age! >= 26 && t.buyer_age! <= 30).length,
    '31+': ticketsWithAge.filter(t => t.buyer_age! >= 31).length,
  };

  const provinceGroups = groupBy(tickets.filter(t => t.buyer_province), t => t.buyer_province!);
  const cityGroups = groupBy(tickets.filter(t => t.buyer_city), t => t.buyer_city!);

  return {
    totalSold,
    grossRevenue,
    occupancyRate: (totalSold / festivalData.aforoTotal) * 100,
    avgTicketPrice: totalSold > 0 ? grossRevenue / totalSold : 0,
    targetSales,
    salesGap,
    targetProgress: (totalSold / targetSales) * 100,
    yesterdaySales,
    avgDailySales,
    salesTrend,
    last7DaysSales,
    daysToFestival,
    requiredDailyRate,
    salesByProvider,
    salesByZone,
    salesByChannel,
    salesOverTime,
    demographics: {
      byAge: Object.entries(ageGroups).map(([range, count]) => ({
        range,
        count,
        percentage: ticketsWithAge.length > 0 ? (count / ticketsWithAge.length) * 100 : 0,
      })),
      byProvince: Object.entries(provinceGroups)
        .map(([province, tix]) => ({
          province,
          count: tix.length,
          percentage: (tix.length / totalSold) * 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7),
      byCity: Object.entries(cityGroups)
        .map(([city, tix]) => ({
          city,
          count: tix.length,
          percentage: (tix.length / totalSold) * 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7),
      withEmail: tickets.filter(t => t.has_email).length,
      withPhone: tickets.filter(t => t.has_phone).length,
      withMarketingConsent: tickets.filter(t => t.marketing_consent).length,
    },
    isDemo: false,
    hasRealData: true,
    lastUpdated: new Date(),
  };
}

// Helper: Generate simulated sales over time
function generateSimulatedSalesOverTime(totalSold: number, totalRevenue: number, days: number) {
  const result: TicketStats['salesOverTime'] = [];
  const avgPrice = totalSold > 0 ? totalRevenue / totalSold : 25;
  let cumulative = 0;
  
  const dailyAvg = totalSold / days;
  
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), days - 1 - i);
    const accelerationFactor = 1 + (i / days) * 1.5;
    const weekendBoost = (date.getDay() === 0 || date.getDay() === 6) ? 1.3 : 1;
    const variance = 0.7 + Math.random() * 0.6;
    
    const sales = Math.round(dailyAvg * accelerationFactor * weekendBoost * variance);
    const revenue = Math.round(sales * avgPrice);
    cumulative += sales;
    
    result.push({
      date: format(date, 'yyyy-MM-dd'),
      dateLabel: format(date, 'd MMM'),
      sales,
      revenue,
      cumulative,
    });
  }
  
  // Normalize to match total
  const scaleFactor = totalSold / cumulative;
  let runningTotal = 0;
  
  return result.map(d => {
    const scaledSales = Math.round(d.sales * scaleFactor);
    runningTotal += scaledSales;
    return {
      ...d,
      sales: scaledSales,
      revenue: Math.round(scaledSales * avgPrice),
      cumulative: runningTotal,
    };
  });
}

// Helper: Group array by key
function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    (result[key] = result[key] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}
