import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Music, Sparkles, Calendar, Users } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const validation = signUpSchema.safeParse({ email, password, fullName });
        if (!validation.success) {
          toast({
            title: 'Error de validación',
            description: validation.error.errors[0].message,
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
              description: 'Este email ya está registrado. Por favor, inicia sesión.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error al registrarse',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: '¡Bienvenido!',
            description: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
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
              title: 'Error de acceso',
              description: 'Email o contraseña incorrectos.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error de acceso',
              description: error.message,
              variant: 'destructive',
            });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-festival relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md text-center space-y-8">
            {/* Logo/Brand */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                <Music className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight">
                Primaverando
              </h1>
              <p className="text-xl font-medium opacity-90">
                Festival de Sevilla
              </p>
              <p className="text-sm opacity-75 font-light">
                La mayor fiesta universitaria de Andalucía
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-2xl font-bold">20K</p>
                <p className="text-xs opacity-75">Aforo</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-2xl font-bold">6ª</p>
                <p className="text-xs opacity-75">Edición</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 opacity-75" />
                </div>
                <p className="text-2xl font-bold">7+</p>
                <p className="text-xs opacity-75">Artistas</p>
              </div>
            </div>
            
            {/* Event Info */}
            <div className="pt-6 space-y-2">
              <p className="text-sm font-medium">
                📍 Estadio de La Cartuja, Sevilla
              </p>
              <p className="text-sm font-medium">
                📅 29 de marzo de 2025
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-background p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl gradient-festival mb-2">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold gradient-festival-text">
              Primaverando
            </h1>
            <p className="text-sm text-muted-foreground">Panel de Gestión</p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-display font-bold">
                {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? 'Introduce tus datos para crear tu cuenta'
                  : 'Accede al panel de gestión del festival'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Tu nombre"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
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
                    className="h-11"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-11 gradient-festival hover:opacity-90 transition-opacity font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Cargando...' : isSignUp ? 'Crear cuenta' : 'Acceder'}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-muted-foreground"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp
                    ? '¿Ya tienes cuenta? Inicia sesión'
                    : '¿No tienes cuenta? Regístrate'}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <p className="text-center text-xs text-muted-foreground">
            Panel de Business Intelligence para{' '}
            <span className="font-medium gradient-festival-text">Primaverando Festival</span>
          </p>
        </div>
      </div>
    </div>
  );
}
