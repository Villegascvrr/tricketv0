import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MarketingCampaign {
  id: string;
  name: string;
  type: string;
  platform: string;
  status: string;
  start_date: string;
  end_date: string | null;
  budget: number;
  spent: number;
  reach: number;
  clicks: number;
  tickets_sold: number;
  estimated_revenue: number;
  ctr: number;
  observation: string | null;
  team_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NewCampaign = Omit<MarketingCampaign, 'id' | 'created_at' | 'updated_at'>;

const fetchCampaigns = async (): Promise<MarketingCampaign[]> => {
  const { data, error } = await supabase
    .from('marketing_campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as MarketingCampaign[];
};

export function useMarketingCampaigns() {
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['marketing-campaigns'],
    queryFn: fetchCampaigns,
  });

  const addCampaignMutation = useMutation({
    mutationFn: async (campaign: Partial<NewCampaign>) => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert({
          name: campaign.name!,
          type: campaign.type || 'paid',
          platform: campaign.platform || 'instagram',
          status: campaign.status || 'active',
          start_date: campaign.start_date!,
          end_date: campaign.end_date || null,
          budget: campaign.budget || 0,
          spent: campaign.spent || 0,
          reach: campaign.reach || 0,
          clicks: campaign.clicks || 0,
          tickets_sold: campaign.tickets_sold || 0,
          estimated_revenue: campaign.estimated_revenue || 0,
          ctr: campaign.ctr || 0,
          observation: campaign.observation || null,
          team_notes: campaign.team_notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NewCampaign> }) => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
    },
  });

  const addCampaign = async (campaign: Partial<NewCampaign>) => {
    try {
      await addCampaignMutation.mutateAsync(campaign);
      toast({
        title: "Campaña creada",
        description: `"${campaign.name}" añadida correctamente`
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la campaña",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<NewCampaign>) => {
    try {
      await updateCampaignMutation.mutateAsync({ id, updates });
      toast({
        title: "Campaña actualizada",
        description: "Los cambios se han guardado"
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la campaña",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await deleteCampaignMutation.mutateAsync(id);
      toast({
        title: "Campaña eliminada",
        description: "La campaña se ha eliminado correctamente"
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la campaña",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    campaigns,
    isLoading,
    error,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    isAdding: addCampaignMutation.isPending,
    isUpdating: updateCampaignMutation.isPending,
    isDeleting: deleteCampaignMutation.isPending,
  };
}
