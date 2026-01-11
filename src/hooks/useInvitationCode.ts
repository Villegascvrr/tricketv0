import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface InvitationCodeResult {
  valid: boolean;
  eventId?: string;
  eventName?: string;
  festivalRoleId?: string;
  festivalRoleName?: string;
  codeId?: string;
  isOwnerCode?: boolean;
  error?: string;
}

export function useInvitationCode() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<InvitationCodeResult | null>(null);

  const validateCode = async (code: string): Promise<InvitationCodeResult> => {
    if (!code.trim()) {
      return { valid: false, error: 'Código requerido' };
    }

    setIsValidating(true);
    try {
      // Query the invitation_codes table using raw query approach
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { data: codeData, error: codeError } = await client
        .from('invitation_codes')
        .select(`
          id,
          event_id,
          festival_role_id,
          max_uses,
          current_uses,
          expires_at,
          is_active
        `)
        .eq('code', code.trim().toUpperCase())
        .single();

      if (codeError || !codeData) {
        setValidationResult({ valid: false, error: 'Código no válido' });
        return { valid: false, error: 'Código no válido' };
      }

      // Check if code is active
      if (!codeData.is_active) {
        setValidationResult({ valid: false, error: 'Este código ya no está activo' });
        return { valid: false, error: 'Este código ya no está activo' };
      }

      // Check expiration
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        setValidationResult({ valid: false, error: 'Este código ha expirado' });
        return { valid: false, error: 'Este código ha expirado' };
      }

      // Check max uses
      if (codeData.max_uses !== null && codeData.current_uses >= codeData.max_uses) {
        setValidationResult({ valid: false, error: 'Este código ha alcanzado el límite de usos' });
        return { valid: false, error: 'Este código ha alcanzado el límite de usos' };
      }

      // Get event name
      const { data: eventData } = await supabase
        .from('events')
        .select('name')
        .eq('id', codeData.event_id)
        .single();

      // Get role name if applicable
      let roleName: string | undefined;
      if (codeData.festival_role_id) {
        const { data: roleData } = await supabase
          .from('festival_roles')
          .select('name')
          .eq('id', codeData.festival_role_id)
          .single();
        roleName = roleData?.name;
      }

      const result: InvitationCodeResult = {
        valid: true,
        eventId: codeData.event_id,
        eventName: eventData?.name,
        festivalRoleId: codeData.festival_role_id || undefined,
        festivalRoleName: roleName,
        codeId: codeData.id,
        isOwnerCode: !codeData.festival_role_id, // No role means owner-level access
      };

      setValidationResult(result);
      return result;
    } catch (error) {
      console.error('Error validating code:', error);
      setValidationResult({ valid: false, error: 'Error validando código' });
      return { valid: false, error: 'Error validando código' };
    } finally {
      setIsValidating(false);
    }
  };

  const redeemCode = async (codeId: string, userId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      
      // Record the code use
      const { error: useError } = await client
        .from('invitation_code_uses')
        .insert({
          code_id: codeId,
          user_id: userId,
        });

      if (useError) {
        console.error('Error recording code use:', useError);
        return { success: false, error: 'Error registrando uso del código' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error redeeming code:', error);
      return { success: false, error: 'Error canjeando código' };
    }
  };

  const clearValidation = () => {
    setValidationResult(null);
  };

  return {
    validateCode,
    redeemCode,
    isValidating,
    validationResult,
    clearValidation,
  };
}
