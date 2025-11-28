import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Download } from "lucide-react";

const Templates = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Plantillas de Importación
            </h1>
            <p className="text-muted-foreground">
              Gestiona plantillas para importar datos de diferentes ticketeras
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Plantilla
          </Button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Ticketmaster Estándar",
              provider: "Ticketmaster",
              fields: 12,
              lastUsed: "Hace 2 días",
            },
            {
              name: "Entradas.com Festival",
              provider: "Entradas.com",
              fields: 10,
              lastUsed: "Hace 1 semana",
            },
            {
              name: "Bclever Premium",
              provider: "Bclever",
              fields: 15,
              lastUsed: "Hace 3 días",
            },
            {
              name: "Forvenues Basic",
              provider: "Forvenues",
              fields: 8,
              lastUsed: "Hace 5 días",
            },
          ].map((template, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-primary" />
                  <Badge variant="outline">{template.provider}</Badge>
                </div>
                <CardTitle className="text-lg mt-4">{template.name}</CardTitle>
                <CardDescription>
                  {template.fields} campos mapeados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Último uso: {template.lastUsed}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">¿Qué son las plantillas?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Las plantillas te permiten configurar una vez cómo se mapean los
              campos de tus archivos CSV de cada ticketera. Así podrás importar
              datos de forma rápida y consistente sin tener que configurar el
              mapeo cada vez.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Templates;
