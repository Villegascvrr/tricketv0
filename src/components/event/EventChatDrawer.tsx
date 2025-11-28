import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Loader2, Sparkles, HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface EventChatDrawerProps {
  eventId: string;
  eventName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventChatDrawer = ({ eventId, eventName, open, onOpenChange }: EventChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `¡Hola! 👋 Soy tu asistente de análisis para ${eventName}. Puedo ayudarte a analizar datos, responder preguntas específicas y proporcionar insights sobre ventas, audiencia, canales y más. ¿En qué puedo ayudarte?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCommandsDialog, setShowCommandsDialog] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Command shortcuts mapping
  const commands: Record<string, string> = {
    '/ventas': '¿Cuál es el análisis completo de ventas? Incluye: total de ingresos, tickets vendidos, precio promedio, comparativa por canal y ticketera, y proyección para el final del evento.',
    '/canales': 'Analiza el rendimiento de cada canal de venta: cuál funciona mejor, cuál tiene mayor ticket promedio, y recomendaciones de optimización.',
    '/ticketeras': 'Compara el rendimiento de todas las ticketeras: ocupación vs capacidad asignada, ingresos generados, y recomendaciones de redistribución.',
    '/demografia': 'Proporciona un análisis demográfico detallado: distribución por edades, provincias más representadas, ciudades principales, y perfil del comprador típico.',
    '/proyecciones': 'Genera proyecciones de ingresos hasta el final del evento basándote en la tendencia actual de ventas. Incluye escenarios optimista, realista y pesimista.',
    '/zonas': '¿Qué zonas tienen mejor y peor ocupación? Analiza precio vs demanda por zona y sugiere ajustes de precio o estrategias.',
    '/ayuda': 'Muéstrame la lista completa de comandos disponibles con ejemplos de uso y preguntas frecuentes que puedes responder.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let userMessage = input.trim();
    
    // Check if it's a command and expand it
    if (userMessage.startsWith('/')) {
      const expandedCommand = commands[userMessage.toLowerCase()];
      if (expandedCommand) {
        userMessage = expandedCommand;
      }
    }
    
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Add placeholder for assistant response
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-event-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            eventId,
            messages: [...messages, { role: "user", content: userMessage }].map(m => ({
              role: m.role,
              content: m.content
            }))
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Límite de rate alcanzado. Intenta de nuevo en unos momentos.");
        } else if (response.status === 402) {
          toast.error("Créditos agotados. Por favor, añade créditos a tu workspace.");
        } else {
          throw new Error('Error en la respuesta del servidor');
        }
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (!reader) {
        throw new Error('No se pudo iniciar el streaming');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                accumulatedContent += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: accumulatedContent
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore JSON parse errors for partial chunks
            }
          }
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        console.error('Error in chat:', error);
        toast.error("Error al procesar tu pregunta. Intenta de nuevo.");
        setMessages(prev => prev.slice(0, -1));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const quickCommands = [
    // Row 1
    { cmd: '/ventas', desc: 'Análisis completo de ventas' },
    { cmd: '/canales', desc: 'Rendimiento por canal' },
    { cmd: '/ticketeras', desc: 'Comparativa de ticketeras' },
    // Row 2
    { cmd: '/demografia', desc: 'Distribución demográfica' },
    { cmd: '/proyecciones', desc: 'Proyecciones de ingresos' },
    { cmd: '/zonas', desc: 'Ocupación por zonas' },
  ];

  const allCommandsInfo = [
    { cmd: '/ventas', desc: 'Análisis completo de ventas', detail: 'Incluye: total de ingresos, tickets vendidos, precio promedio, comparativa por canal y ticketera, y proyección para el final del evento.' },
    { cmd: '/canales', desc: 'Rendimiento por canal', detail: 'Analiza el rendimiento de cada canal de venta: cuál funciona mejor, cuál tiene mayor ticket promedio, y recomendaciones de optimización.' },
    { cmd: '/ticketeras', desc: 'Comparativa de ticketeras', detail: 'Compara el rendimiento de todas las ticketeras: ocupación vs capacidad asignada, ingresos generados, y recomendaciones de redistribución.' },
    { cmd: '/demografia', desc: 'Distribución demográfica', detail: 'Análisis demográfico detallado: distribución por edades, provincias más representadas, ciudades principales, y perfil del comprador típico.' },
    { cmd: '/proyecciones', desc: 'Proyecciones de ingresos', detail: 'Genera proyecciones de ingresos hasta el final del evento basándote en la tendencia actual de ventas. Incluye escenarios optimista, realista y pesimista.' },
    { cmd: '/zonas', desc: 'Ocupación por zonas', detail: '¿Qué zonas tienen mejor y peor ocupación? Analiza precio vs demanda por zona y sugiere ajustes de precio o estrategias.' },
    { cmd: '/ayuda', desc: 'Lista de comandos', detail: 'Muestra la lista completa de comandos disponibles con ejemplos de uso y preguntas frecuentes.' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg">Chat con IA</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Análisis en tiempo real de {eventName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Conectado a los datos de este evento: ventas, ticketeras, zonas, audiencia y proyecciones.
              </p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {message.content || (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  {message.role === "assistant" && message.content && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] text-muted-foreground px-1">
                        Datos basados en el evento actual · última importación: 15/04/2024
                      </p>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  Comandos rápidos:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {quickCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-2"
                      onClick={() => setInput(cmd.cmd)}
                      disabled={isLoading}
                    >
                      <div className="flex flex-col items-start">
                        <code className="text-[10px] font-mono text-primary">{cmd.cmd}</code>
                        <span className="text-[9px] text-muted-foreground leading-tight mt-0.5">{cmd.desc}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                <Dialog open={showCommandsDialog} onOpenChange={setShowCommandsDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <HelpCircle className="h-3 w-3 mr-1" />
                      Ver todos los comandos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Lista de Comandos Disponibles</DialogTitle>
                      <DialogDescription>
                        Usa estos comandos para análisis rápidos del evento
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {allCommandsInfo.map((cmd, index) => (
                        <div key={index} className="border-b pb-3 last:border-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                              {cmd.cmd}
                            </code>
                            <span className="text-sm font-medium">{cmd.desc}</span>
                          </div>
                          <p className="text-xs text-muted-foreground ml-1">{cmd.detail}</p>
                        </div>
                      ))}
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium mb-2">Ejemplos de preguntas habituales:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                          <li>¿Cuál es el perfil del comprador típico?</li>
                          <li>¿Qué provincia tiene más ventas?</li>
                          <li>¿Cuál es la proyección de ingresos final?</li>
                          <li>¿Qué ticketera está rindiendo mejor?</li>
                          <li>¿Qué zona tiene peor ocupación?</li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="p-6 pt-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta o usa /comandos..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Usa comandos como <code className="text-primary">/ventas</code> o <code className="text-primary">/demografia</code> para análisis rápidos
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EventChatDrawer;