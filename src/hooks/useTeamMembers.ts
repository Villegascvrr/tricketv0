import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FestivalRole {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  bg_color: string | null;
  permissions: string[];
  created_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string | null;
  email: string;
  name: string | null;
  phone: string | null;
  festival_role_id: string | null;
  status: string;
  invited_by: string | null;
  invited_at: string | null;
  joined_at: string | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
  festival_role?: FestivalRole | null;
}

export interface NewTeamMember {
  email: string;
  name?: string;
  phone?: string;
  festival_role_id?: string;
}

export function useTeamMembers() {
  const queryClient = useQueryClient();

  // Fetch all festival roles
  const rolesQuery = useQuery({
    queryKey: ["festival-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("festival_roles")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as FestivalRole[];
    },
  });

  // Fetch all team members with their roles
  const membersQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          *,
          festival_role:festival_roles(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TeamMember[];
    },
  });

  // Invite a new team member
  const inviteMemberMutation = useMutation({
    mutationFn: async (member: NewTeamMember) => {
      const { data, error } = await supabase
        .from("team_members")
        .insert({
          email: member.email,
          name: member.name || null,
          phone: member.phone || null,
          festival_role_id: member.festival_role_id || null,
          status: "invited",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Invitación enviada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al enviar invitación: " + error.message);
    },
  });

  // Update team member
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TeamMember> }) => {
      const { data, error } = await supabase
        .from("team_members")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Miembro actualizado");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar: " + error.message);
    },
  });

  // Delete team member
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Miembro eliminado");
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar: " + error.message);
    },
  });

  return {
    // Data
    roles: rolesQuery.data || [],
    members: membersQuery.data || [],
    
    // Loading states
    isLoadingRoles: rolesQuery.isLoading,
    isLoadingMembers: membersQuery.isLoading,
    isLoading: rolesQuery.isLoading || membersQuery.isLoading,
    
    // Error states
    rolesError: rolesQuery.error,
    membersError: membersQuery.error,
    
    // Mutations
    inviteMember: inviteMemberMutation.mutate,
    updateMember: updateMemberMutation.mutate,
    deleteMember: deleteMemberMutation.mutate,
    
    // Mutation states
    isInviting: inviteMemberMutation.isPending,
    isUpdating: updateMemberMutation.isPending,
    isDeleting: deleteMemberMutation.isPending,
  };
}
