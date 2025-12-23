import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2, Sparkles, HelpCircle, Globe, RotateCcw, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChatMessageRenderer from "./ChatMessageRenderer";
import { festivalData, getAIContext } from "@/data/festivalData";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface EventChatDrawerProps {
  eventId: string;
  eventName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDemo?: boolean;
}

const EventChatDrawer = ({ eventId, eventName, open, onOpenChange, isDemo = false }: EventChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `¡Hola! 👋 Soy tu asistente de análisis para **${eventName}**. ${isDemo ? '\n\n🎪 *Modo Demo* - Usando datos de ejemplo de Primaverando 2025.\n\n' : ''}Puedo ayudarte a analizar datos, responder preguntas específicas y proporcionar insights sobre ventas, audiencia, canales y más. ¿En qué puedo ayudarte?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWebSearching, setIsWebSearching] = useState(false);
  const [showCommandsDialog, setShowCommandsDialog] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    '/competencia': 'Compara Primaverando con otros festivales de Sevilla como Icónica, Puro Latino Fest e Interestelar.',
    '/ayuda': 'Muéstrame la lista completa de comandos disponibles con ejemplos de uso y preguntas frecuentes que puedes responder.',
    // Web research commands - these are passed directly to backend
    '/investigar': '/investigar ', // Will prompt user to add topic
    '/noticias': '/noticias ',
    '/scrape': '/scrape ',
    '/tendencias': '/tendencias',
  };

  // Check if message is a web research command
  const isWebResearchCommand = (msg: string): boolean => {
    const webCommands = ['/investigar', '/noticias', '/scrape', '/tendencias', '/competencia'];
    return webCommands.some(cmd => msg.toLowerCase().startsWith(cmd));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let userMessage = input.trim();
    
    // Check if it's a command and expand it (except for web research commands)
    if (userMessage.startsWith('/')) {
      const commandKey = userMessage.split(' ')[0].toLowerCase();
      const expandedCommand = commands[commandKey];
      
      // For web research commands, keep the original message
      if (!isWebResearchCommand(userMessage) && expandedCommand) {
        userMessage = expandedCommand;
      }
    }
    
    setInput("");
    
    // Check if this is a web search command
    const isWebSearch = isWebResearchCommand(userMessage);
    setIsWebSearching(isWebSearch);
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Add placeholder for assistant response
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      abortControllerRef.current = new AbortController();
      
      // Build request body - include local context for demo mode
      const requestBody = isDemo 
        ? {
            eventId: "demo-primaverando-2025",
            messages: [...messages, { role: "user", content: userMessage }].map(m => ({
              role: m.role,
              content: m.content
            })),
            localContext: getAIContext(), // Include rich Primaverando context
          }
        : {
            eventId,
            messages: [...messages, { role: "user", content: userMessage }].map(m => ({
              role: m.role,
              content: m.content
            }))
          };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-event-analysis`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(requestBody),
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
      let textBuffer = ""; // Buffer for incomplete SSE lines

      if (!reader) {
        throw new Error('No se pudo iniciar el streaming');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line as data arrives
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          // Handle CRLF
          if (line.endsWith('\r')) line = line.slice(0, -1);
          
          // Skip SSE comments and empty lines
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

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
          } catch {
            // Incomplete JSON split across chunks - put it back and wait
            textBuffer = line + '\n' + textBuffer;
            break;
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
      setIsWebSearching(false);
      abortControllerRef.current = null;
    }
  };

  const quickCommands = [
    // Row 1 - Data commands
    { cmd: '/ventas', desc: 'Análisis de ventas', icon: '📊' },
    { cmd: '/canales', desc: 'Por canal', icon: '📈' },
    { cmd: '/ticketeras', desc: 'Ticketeras', icon: '🎫' },
    // Row 2 - More data
    { cmd: '/demografia', desc: 'Demografía', icon: '👥' },
    { cmd: '/proyecciones', desc: 'Proyecciones', icon: '🔮' },
    { cmd: '/zonas', desc: 'Zonas', icon: '🗺️' },
  ];

  const webCommands = [
    { cmd: '/investigar ', desc: 'Buscar web', icon: '🔍' },
    { cmd: '/noticias ', desc: 'Noticias', icon: '📰' },
    { cmd: '/tendencias', desc: 'Tendencias', icon: '📈' },
  ];

  const allCommandsInfo = [
    // Data commands
    { cmd: '/ventas', desc: 'Análisis de ventas', detail: 'Total ingresos, tickets, precio promedio, comparativa por canal y ticketera.', category: 'data' },
    { cmd: '/canales', desc: 'Por canal', detail: 'Rendimiento de cada canal de venta, cuál funciona mejor.', category: 'data' },
    { cmd: '/ticketeras', desc: 'Ticketeras', detail: 'Ocupación vs capacidad asignada por ticketera.', category: 'data' },
    { cmd: '/demografia', desc: 'Demografía', detail: 'Distribución por edades, provincias, perfil comprador.', category: 'data' },
    { cmd: '/proyecciones', desc: 'Proyecciones', detail: 'Estimación de ingresos: optimista, realista, pesimista.', category: 'data' },
    { cmd: '/zonas', desc: 'Zonas', detail: 'Ocupación y revenue por zona, ajustes de precio.', category: 'data' },
    { cmd: '/competencia', desc: 'Competencia', detail: 'Comparativa con Icónica, Puro Latino, Interestelar.', category: 'data' },
    // Web commands
    { cmd: '/investigar [tema]', desc: 'Buscar en web', detail: 'Busca información actualizada en internet con Perplexity.', category: 'web' },
    { cmd: '/noticias [tema]', desc: 'Noticias recientes', detail: 'Noticias de la última semana sobre el tema.', category: 'web' },
    { cmd: '/scrape [url]', desc: 'Extraer contenido', detail: 'Extrae el contenido de una URL específica con Firecrawl.', category: 'web' },
    { cmd: '/tendencias', desc: 'Tendencias', detail: 'Tendencias actuales del sector festivales universitarios.', category: 'web' },
    { cmd: '/ayuda', desc: 'Ayuda', detail: 'Lista de todos los comandos disponibles.', category: 'help' },
  ];

  const isMobile = useIsMobile();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className={cn(
          "p-0 flex flex-col",
          isMobile ? "w-full" : "w-full sm:max-w-none"
        )}
      >
        {/* Desktop: Collapse button on the left edge */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-50 h-20 w-8 rounded-l-lg rounded-r-none bg-background border border-r-0 border-border shadow-md hover:bg-muted"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        )}
        
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
            </div>
            {messages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessages([{
                  role: "assistant",
                  content: `¡Hola! 👋 Soy tu asistente de análisis para **${eventName}**. ${isDemo ? '\n\n🎪 *Modo Demo* - Usando datos de ejemplo de Primaverando 2025.\n\n' : ''}Puedo ayudarte a analizar datos, responder preguntas específicas y proporcionar insights sobre ventas, audiencia, canales y más. ¿En qué puedo ayudarte?`
                }])}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="text-xs">Nueva</span>
              </Button>
            )}
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
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground text-sm"
                        : "bg-muted/80 text-foreground border border-border/50"
                    )}
                  >
                    {message.content ? (
                      message.role === "assistant" ? (
                        <ChatMessageRenderer content={message.content} />
                      ) : (
                        <span className="text-sm">{message.content}</span>
                      )
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {isWebSearching ? (
                          <>
                            <Globe className="h-4 w-4 animate-pulse text-blue-500" />
                            <span>Buscando en la web...</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Analizando datos...</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {message.role === "assistant" && message.content && (
                    <p className="text-[10px] text-muted-foreground px-2">
                      {message.content.includes('---SOURCES---') ? '🌐 Incluye fuentes web' : 'Datos en tiempo real del evento'}
                    </p>
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
                      <div>
                        <h5 className="text-sm font-medium mb-2">📊 Comandos de Datos</h5>
                        {allCommandsInfo.filter(c => c.category === 'data').map((cmd, index) => (
                          <div key={index} className="border-b pb-2 mb-2 last:border-0">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {cmd.cmd}
                              </code>
                              <span className="text-sm">{cmd.desc}</span>
                            </div>
                            <p className="text-xs text-muted-foreground ml-1">{cmd.detail}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">🌐 Comandos Web</h5>
                        {allCommandsInfo.filter(c => c.category === 'web').map((cmd, index) => (
                          <div key={index} className="border-b pb-2 mb-2 last:border-0">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-sm font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                                {cmd.cmd}
                              </code>
                              <span className="text-sm">{cmd.desc}</span>
                            </div>
                            <p className="text-xs text-muted-foreground ml-1">{cmd.detail}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium mb-2">Ejemplos de uso:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                          <li><code>/investigar tendencias festivales 2025</code></li>
                          <li><code>/noticias Icónica Sevilla</code></li>
                          <li><code>/scrape https://primaverando.es</code></li>
                          <li>¿Cuál es el perfil del comprador típico?</li>
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