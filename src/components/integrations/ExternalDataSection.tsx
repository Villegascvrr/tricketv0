import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  CloudSun, 
  Instagram,
  ExternalLink,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExternalDataSource {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'demo' | 'pending';
  dataType: string;
  lastUpdate: string | null;
  route: string;
  color: string;
}

const externalDataSources: ExternalDataSource[] = [
  {
    id: 'google-trends',
    name: 'Google Trends',
    description: 'Tendencias de búsqueda',
    icon: <TrendingUp className="h-5 w-5" />,
    status: 'demo',
    dataType: 'Interés de búsqueda por ciudad, evolución semanal, términos relacionados',
    lastUpdate: 'Hace 1 hora',
    route: '/marketing',
    color: 'text-blue-500 bg-blue-500/10'
  },
  {
    id: 'weather',
    name: 'Clima (Weather)',
    description: 'Condiciones meteorológicas',
    icon: <CloudSun className="h-5 w-5" />,
    status: 'demo',
    dataType: 'Previsión festival, histórico fechas similares, indicadores de riesgo',
    lastUpdate: 'Hace 30 min',
    route: '/weather',
    color: 'text-cyan-500 bg-cyan-500/10'
  },
  {
    id: 'social-media',
    name: 'Redes Sociales',
    description: 'Meta / Instagram',
    icon: <Instagram className="h-5 w-5" />,
    status: 'pending',
    dataType: 'Alcance orgánico, engagement, rendimiento de publicaciones',
    lastUpdate: null,
    route: '/marketing',
    color: 'text-pink-500 bg-pink-500/10'
  }
];

const ExternalDataSection = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status: ExternalDataSource['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-success/10 text-success border-success/20 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Sincronizado
          </Badge>
        );
      case 'demo':
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Datos demo
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <Clock className="h-3 w-3" />
            En configuración
          </Badge>
        );
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground mb-3">Datos Externos</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Fuentes de datos externas configuradas por Tricket para enriquecer el análisis
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {externalDataSources.map((source) => (
          <Card key={source.id} className={source.status === 'pending' ? 'opacity-75' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${source.color}`}>
                    {source.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{source.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {source.description}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(source.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-2.5 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Tipo de datos</p>
                <p className="text-xs text-foreground">{source.dataType}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    {source.status === 'pending' ? 'Estado' : 'Última actualización'}
                  </p>
                  <p className="text-xs font-medium">
                    {source.status === 'pending' 
                      ? 'Configuración por Tricket en proceso' 
                      : source.lastUpdate || 'Sin datos'}
                  </p>
                </div>
                
                <Button 
                  variant="outline"
                  size="sm" 
                  className="gap-1.5 h-7 text-xs"
                  onClick={() => navigate(source.route)}
                  disabled={source.status === 'pending'}
                >
                  Ver datos
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExternalDataSection;