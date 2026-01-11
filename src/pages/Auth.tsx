import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useInvitationCode } from '@/hooks/useInvitationCode';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { Ticket, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  invitationCode: z.string().optional(),
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [invitationCode, setInvitationCode] = useState(searchParams.get('code') || '');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { validateCode, validationResult, isValidating, clearValidation } = useInvitationCode();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Auto-validate code from URL
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setIsSignUp(true);
      validateCode(codeFromUrl);
    }
  }, [searchParams]);

  // Validate code when user types (debounced)
  useEffect(() => {
    if (!invitationCode.trim()) {
      clearValidation();
      return;
    }

    const timeout = setTimeout(() => {
      validateCode(invitationCode);
    }, 500);

    return () => clearTimeout(timeout);
  }, [invitationCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const validation = signUpSchema.safeParse({ email, password, fullName, invitationCode });
        if (!validation.success) {
          toast({
            title: 'Error de validación',
            description: validation.error.errors[0].message,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // If there's an invitation code, validate it first
        if (invitationCode.trim() && (!validationResult?.valid)) {
          toast({
            title: 'Código inválido',
            description: validationResult?.error || 'Por favor verifica el código de invitación',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Cuenta existente',
              description: 'Este email ya está registrado. Por favor inicia sesión.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error de registro',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          // If registration successful and we have a valid code, link the user to the event
          if (validationResult?.valid && validationResult.codeId) {
            // Store the code info to be processed after email confirmation
            localStorage.setItem('pendingInvitationCode', JSON.stringify({
              codeId: validationResult.codeId,
              eventId: validationResult.eventId,
              festivalRoleId: validationResult.festivalRoleId,
              isOwnerCode: validationResult.isOwnerCode,
            }));
          }

          toast({
            title: '¡Éxito!',
            description: validationResult?.valid 
              ? `Cuenta creada. Serás asociado a ${validationResult.eventName}.`
              : 'Cuenta creada exitosamente.',
          });
          setIsSignUp(false);
        }
      } else {
        const validation = signInSchema.safeParse({ email, password });
        if (!validation.success) {
          toast({
            title: 'Error de validación',
            description: validation.error.errors[0].message,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Error de inicio de sesión',
              description: 'Email o contraseña incorrectos.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error de inicio de sesión',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          // Check for pending invitation code after login
          const pendingCode = localStorage.getItem('pendingInvitationCode');
          if (pendingCode) {
            try {
              const codeInfo = JSON.parse(pendingCode);
              await processInvitationCode(codeInfo);
              localStorage.removeItem('pendingInvitationCode');
            } catch (e) {
              console.error('Error processing pending invitation code:', e);
            }
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processInvitationCode = async (codeInfo: {
    codeId: string;
    eventId: string;
    festivalRoleId?: string;
    isOwnerCode: boolean;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      
      // Record code use
      await client.from('invitation_code_uses').insert({
        code_id: codeInfo.codeId,
        user_id: user.id,
      });

      // Get current uses and increment
      const { data: codeData } = await client
        .from('invitation_codes')
        .select('current_uses')
        .eq('id', codeInfo.codeId)
        .single();

      if (codeData) {
        await client
          .from('invitation_codes')
          .update({ current_uses: codeData.current_uses + 1 })
          .eq('id', codeInfo.codeId);
      }

      // Add user to team_members
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', user.id)
        .single();

      await supabase.from('team_members').insert({
        event_id: codeInfo.eventId,
        user_id: user.id,
        email: profile?.email || user.email || '',
        name: profile?.full_name || '',
        festival_role_id: codeInfo.festivalRoleId || null,
        is_owner: codeInfo.isOwnerCode,
        status: 'active',
        joined_at: new Date().toISOString(),
      });

      toast({
        title: '¡Bienvenido al equipo!',
        description: 'Has sido añadido al evento exitosamente.',
      });
    } catch (error) {
      console.error('Error processing invitation code:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Ingresa tus datos para crear tu cuenta'
              : 'Ingresa tu email y contraseña'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan García"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invitationCode" className="flex items-center gap-2">
                    <Ticket className="h-4 w-4" />
                    Código de invitación (opcional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="invitationCode"
                      type="text"
                      placeholder="PRIMAVERA2026"
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                      className={`pr-10 ${
                        validationResult?.valid 
                          ? 'border-green-500 focus-visible:ring-green-500' 
                          : validationResult?.error 
                            ? 'border-destructive focus-visible:ring-destructive' 
                            : ''
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isValidating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      {!isValidating && validationResult?.valid && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {!isValidating && validationResult?.error && invitationCode.trim() && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  {validationResult?.valid && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Acceso a: {validationResult.eventName}
                      {validationResult.festivalRoleName && ` (${validationResult.festivalRoleName})`}
                      {validationResult.isOwnerCode && ' (Acceso completo)'}
                    </p>
                  )}
                  {validationResult?.error && invitationCode.trim() && (
                    <p className="text-sm text-destructive">{validationResult.error}</p>
                  )}
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar sesión'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => {
                setIsSignUp(!isSignUp);
                clearValidation();
              }}
            >
              {isSignUp
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
