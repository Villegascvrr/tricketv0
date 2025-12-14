import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Zone {
  id: string;
  name: string;
  capacity: number | null;
  event_id: string;
  created_at: string;
  updated_at: string;
}

export type NewZone = Omit<Zone, 'id' | 'created_at' | 'updated_at'>;

const DEFAULT_EVENT_ID = "primaverando-2025";

const fetchZones = async (eventId: string): Promise<Zone[]> => {
  const { data, error } = await supabase
    .from('zones')
    .select('*')
    .eq('event_id', eventId)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []) as Zone[];
};

export function useZones(eventId: string = DEFAULT_EVENT_ID) {
  const queryClient = useQueryClient();

  const { data: zones = [], isLoading, error } = useQuery({
    queryKey: ['zones', eventId],
    queryFn: () => fetchZones(eventId),
  });

  const addZoneMutation = useMutation({
    mutationFn: async (zone: Partial<NewZone>) => {
      const { data, error } = await supabase
        .from('zones')
        .insert({
          name: zone.name!,
          capacity: zone.capacity || null,
          event_id: zone.event_id || eventId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones', eventId] });
    },
  });

  const updateZoneMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NewZone> }) => {
      const { data, error } = await supabase
        .from('zones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones', eventId] });
    },
  });

  const deleteZoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones', eventId] });
    },
  });

  const addZone = async (zone: Partial<NewZone>) => {
    try {
      await addZoneMutation.mutateAsync(zone);
      toast({
        title: "Zona creada",
        description: `"${zone.name}" añadida correctamente`
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la zona",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateZone = async (id: string, updates: Partial<NewZone>) => {
    try {
      await updateZoneMutation.mutateAsync({ id, updates });
      toast({
        title: "Zona actualizada",
        description: "Los cambios se han guardado"
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la zona",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteZone = async (id: string) => {
    try {
      await deleteZoneMutation.mutateAsync(id);
      toast({
        title: "Zona eliminada",
        description: "La zona se ha eliminado correctamente"
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la zona",
        variant: "destructive"
      });
      return false;
    }
  };

  const totalCapacity = zones.reduce((sum, z) => sum + (z.capacity || 0), 0);

  return {
    zones,
    isLoading,
    error,
    addZone,
    updateZone,
    deleteZone,
    totalCapacity,
    isAdding: addZoneMutation.isPending,
    isUpdating: updateZoneMutation.isPending,
    isDeleting: deleteZoneMutation.isPending,
  };
}
