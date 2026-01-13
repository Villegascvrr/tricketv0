import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";

interface AuditLogEntry {
  action: string;
  entity_type: string;
  entity_id?: string;
  old_value?: Json;
  new_value?: Json;
}

export function useAuditLog() {
  const { user } = useAuth();

  const logAction = async ({
    action,
    entity_type,
    entity_id,
    old_value,
    new_value,
  }: AuditLogEntry) => {
    if (!user) return;

    try {
      await supabase.from("audit_logs").insert([{
        user_id: user.id,
        action,
        entity_type,
        entity_id: entity_id || null,
        old_value: old_value || null,
        new_value: new_value || null,
      }]);
    } catch (error) {
      console.error("Failed to log audit action:", error);
    }
  };

  return { logAction };
}
