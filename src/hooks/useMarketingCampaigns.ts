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

export function useMarketingCampaigns(eventId?: string, isDemo: boolean = false) {
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['marketing-campaigns', eventId, isDemo],
    queryFn: async () => {
      // Validate UUID if not demo
      if (!isDemo && eventId) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(eventId)) {
          console.warn(`Invalid UUID format for marketing campaigns event ID: ${eventId}. Returning empty list.`);
          return [] as MarketingCampaign[];
        }
      }

      let query = supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isDemo && eventId) {
        query = query.eq('event_id', eventId);
      } else if (isDemo) {
        // For demo, we ideally only want rows without specific event_id or tagged as demo
        // For now, let's assume global rows are demo rows to preserve legacy behavior, 
        // but arguably we should filter. 
        // If we strictly want isolation: 
        // query = query.is('event_id', null); 
        // But doing so might hide existing demo data if column doesn't exist or is ignored.
        // Let's stick to: if Real event, filter STRICTLY. If Demo, take all (fallback).
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as MarketingCampaign[];
    },
    enabled: !!eventId || isDemo
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
          event_id: !isDemo ? eventId : null // Associate with event if real
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
