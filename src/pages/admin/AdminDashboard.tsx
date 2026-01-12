import React from "react";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Users,
  Ticket,
  DollarSign,
  Key,
  UserPlus,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+{trend.value}</span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { stats, registrationsChart, isLoading, isLoadingChart } = useAdminStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Visión global de la plataforma Tricket
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Eventos"
          value={stats?.totalEvents || 0}
          description={`${stats?.activeEvents || 0} activos`}
          icon={Calendar}
          isLoading={isLoading}
        />
        <StatCard
          title="Usuarios Registrados"
          value={stats?.totalUsers || 0}
          description={`${stats?.adminUsers || 0} administradores`}
          icon={Users}
          trend={
            stats?.recentRegistrations
              ? { value: stats.recentRegistrations, label: "últimos 30 días" }
              : undefined
          }
          isLoading={isLoading}
        />
        <StatCard
          title="Tickets Vendidos"
          value={stats?.totalTickets?.toLocaleString("es-ES") || 0}
          icon={Ticket}
          isLoading={isLoading}
        />
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats?.ticketRevenue || 0)}
          icon={DollarSign}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Códigos Activos"
          value={stats?.activeInvitationCodes || 0}
          description={`${stats?.usedInvitationCodes || 0} usos totales`}
          icon={Key}
          isLoading={isLoading}
        />
        <StatCard
          title="Miembros de Equipo"
          value={stats?.teamMembers || 0}
          icon={UserPlus}
          isLoading={isLoading}
        />
      </div>

      {/* Registrations Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Registros últimos 30 días
          </CardTitle>
          <CardDescription>
            Nuevos usuarios registrados en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingChart ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={registrationsChart}>
                <defs>
                  <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    format(new Date(value), "d MMM", { locale: es })
                  }
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip
                  labelFormatter={(value) =>
                    format(new Date(value), "d 'de' MMMM, yyyy", { locale: es })
                  }
                  formatter={(value: number) => [value, "Registros"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRegistrations)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
