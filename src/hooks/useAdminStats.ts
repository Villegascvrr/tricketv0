import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminStats {
  totalEvents: number;
  activeEvents: number;
  totalUsers: number;
  adminUsers: number;
  totalTickets: number;
  ticketRevenue: number;
  activeInvitationCodes: number;
  usedInvitationCodes: number;
  teamMembers: number;
  recentRegistrations: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  user_email?: string;
  created_at: string;
}

export function useAdminStats() {
  // Fetch overall stats
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        eventsRes,
        profilesRes,
        userRolesRes,
        ticketsRes,
        codesRes,
        teamMembersRes,
      ] = await Promise.all([
        supabase.from("events").select("id, start_date, end_date", { count: "exact" }),
        supabase.from("profiles").select("id, created_at", { count: "exact" }),
        supabase.from("user_roles").select("id, role", { count: "exact" }),
        supabase.from("tickets").select("id, price", { count: "exact" }),
        supabase.from("invitation_codes").select("id, is_active, current_uses"),
        supabase.from("team_members").select("id", { count: "exact" }),
      ]);

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate active events (ongoing or future)
      const activeEvents = eventsRes.data?.filter(e => new Date(e.end_date) >= now).length || 0;

      // Count admin users
      const adminUsers = userRolesRes.data?.filter(r => r.role === 'admin').length || 0;

      // Calculate ticket revenue
      const ticketRevenue = ticketsRes.data?.reduce((sum, t) => sum + (Number(t.price) || 0), 0) || 0;

      // Count active and used invitation codes
      const activeInvitationCodes = codesRes.data?.filter(c => c.is_active).length || 0;
      const usedInvitationCodes = codesRes.data?.reduce((sum, c) => sum + (c.current_uses || 0), 0) || 0;

      // Recent registrations (last 30 days)
      const recentRegistrations = profilesRes.data?.filter(
        p => new Date(p.created_at) >= thirtyDaysAgo
      ).length || 0;

      return {
        totalEvents: eventsRes.count || 0,
        activeEvents,
        totalUsers: profilesRes.count || 0,
        adminUsers,
        totalTickets: ticketsRes.count || 0,
        ticketRevenue,
        activeInvitationCodes,
        usedInvitationCodes,
        teamMembers: teamMembersRes.count || 0,
        recentRegistrations,
      } as AdminStats;
    },
  });

  // Fetch recent audit logs
  const auditLogsQuery = useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, action, entity_type, entity_id, user_id, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        // If table doesn't exist yet or no permission, return empty
        console.warn("Could not fetch audit logs:", error.message);
        return [];
      }

      return data as RecentActivity[];
    },
  });

  // Fetch registrations over time (last 30 days)
  const registrationsChartQuery = useQuery({
    queryKey: ["admin-registrations-chart"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by day
      const grouped: Record<string, number> = {};
      data?.forEach(profile => {
        const day = new Date(profile.created_at).toISOString().split("T")[0];
        grouped[day] = (grouped[day] || 0) + 1;
      });

      // Fill in missing days
      const result: { date: string; registrations: number }[] = [];
      const current = new Date(thirtyDaysAgo);
      const today = new Date();
      
      while (current <= today) {
        const dateStr = current.toISOString().split("T")[0];
        result.push({
          date: dateStr,
          registrations: grouped[dateStr] || 0,
        });
        current.setDate(current.getDate() + 1);
      }

      return result;
    },
  });

  return {
    stats: statsQuery.data,
    recentActivity: auditLogsQuery.data || [],
    registrationsChart: registrationsChartQuery.data || [],
    isLoading: statsQuery.isLoading,
    isLoadingActivity: auditLogsQuery.isLoading,
    isLoadingChart: registrationsChartQuery.isLoading,
    error: statsQuery.error,
  };
}
