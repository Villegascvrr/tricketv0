import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserFestivalRole {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  bg_color: string | null;
  permissions: string[] | null;
}

export interface TeamMemberInfo {
  id: string;
  phone: string | null;
  status: string;
  festival_role: UserFestivalRole | null;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as UserProfile | null;
    },
    enabled: !!user?.id,
  });

  // Fetch team member info with festival role
  const { data: teamMemberInfo, isLoading: isLoadingTeamMember } = useQuery({
    queryKey: ['user-team-member', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          phone,
          status,
          festival_role:festival_roles (
            id,
            name,
            description,
            icon,
            color,
            bg_color,
            permissions
          )
        `)
        .eq('email', user.email)
        .maybeSingle();
      
      if (error) throw error;
      return data as TeamMemberInfo | null;
    },
    enabled: !!user?.email,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { full_name?: string }) => {
      if (!user?.id) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
    },
  });

  // Update team member phone
  const updatePhoneMutation = useMutation({
    mutationFn: async (phone: string) => {
      if (!teamMemberInfo?.id) throw new Error('No team member record');
      
      const { error } = await supabase
        .from('team_members')
        .update({ phone })
        .eq('id', teamMemberInfo.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-team-member', user?.email] });
    },
  });

  return {
    profile,
    teamMemberInfo,
    isLoading: isLoadingProfile || isLoadingTeamMember,
    error: profileError,
    updateProfile: updateProfileMutation.mutate,
    updatePhone: updatePhoneMutation.mutate,
    isUpdating: updateProfileMutation.isPending || updatePhoneMutation.isPending,
  };
};
