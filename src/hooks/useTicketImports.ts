import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface TicketImport {
  id: string;
  event_id: string;
  provider_name: string;
  file_name: string;
  imported_count: number;
  error_count: number;
  imported_at: string;
  raw_mapping_used: Json | null;
}

export interface TicketInsert {
  event_id: string;
  provider_name: string;
  sale_date: string;
  price: number;
  ticket_type?: string;
  zone_name?: string;
  channel?: string;
  buyer_city?: string;
  buyer_province?: string;
  buyer_country?: string;
  buyer_postal_code?: string;
  buyer_age?: number;
  buyer_birth_year?: number;
  has_email?: boolean;
  has_phone?: boolean;
  marketing_consent?: boolean;
  external_ticket_id?: string;
  currency?: string;
  status?: string;
}

export const useTicketImports = (eventId: string) => {
  const [imports, setImports] = useState<TicketImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const fetchImports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ticket_imports')
        .select('*')
        .eq('event_id', eventId)
        .order('imported_at', { ascending: false });

      if (error) throw error;
      setImports(data || []);
    } catch (error) {
      console.error('Error fetching imports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchImports();
    }
  }, [eventId]);

  const importTickets = async (
    tickets: TicketInsert[],
    providerName: string,
    fileName: string,
    mappingUsed: Record<string, string>
  ): Promise<{ success: boolean; importedCount: number; errorCount: number }> => {
    setImporting(true);
    let importedCount = 0;
    let errorCount = 0;

    try {
      // Insert tickets in batches of 100
      const batchSize = 100;
      for (let i = 0; i < tickets.length; i += batchSize) {
        const batch = tickets.slice(i, i + batchSize);
        const { error } = await supabase.from('tickets').insert(batch);
        
        if (error) {
          console.error('Batch insert error:', error);
          errorCount += batch.length;
        } else {
          importedCount += batch.length;
        }
      }

      // Record the import
      const { error: importError } = await supabase.from('ticket_imports').insert({
        event_id: eventId,
        provider_name: providerName,
        file_name: fileName,
        imported_count: importedCount,
        error_count: errorCount,
        raw_mapping_used: mappingUsed,
      });

      if (importError) {
        console.error('Error recording import:', importError);
      }

      await fetchImports();
      
      if (errorCount === 0) {
        toast.success(`${importedCount} tickets importados correctamente`);
      } else {
        toast.warning(`${importedCount} importados, ${errorCount} con errores`);
      }

      return { success: true, importedCount, errorCount };
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error al importar tickets');
      return { success: false, importedCount: 0, errorCount: tickets.length };
    } finally {
      setImporting(false);
    }
  };

  const deleteImport = async (importId: string) => {
    try {
      const { error } = await supabase
        .from('ticket_imports')
        .delete()
        .eq('id', importId);

      if (error) throw error;
      
      toast.success('Registro de importación eliminado');
      await fetchImports();
    } catch (error) {
      console.error('Error deleting import:', error);
      toast.error('Error al eliminar registro');
    }
  };

  return {
    imports,
    loading,
    importing,
    importTickets,
    deleteImport,
    refetch: fetchImports,
  };
};
