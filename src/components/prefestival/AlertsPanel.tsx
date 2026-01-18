import { useState } from "react";
import { TaskAlert, areaLabels } from "@/data/preFestivalMockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Clock, XCircle, ArrowRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AlertsPanelProps {
  alerts: TaskAlert[];
  onOpenTask: (taskId: string) => void;
}

export function AlertsPanel({ alerts, onOpenTask }: AlertsPanelProps) {
  const [showAllDialog, setShowAllDialog] = useState(false);

  const getAlertIcon = (type: TaskAlert['type']) => {
    switch (type) {
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getAlertColor = (type: TaskAlert['type']) => {
    switch (type) {
      case 'overdue': return 'border-destructive/30 bg-destructive/5';
      case 'urgent': return 'border-warning/30 bg-warning/5';
    }
  };

  const getAlertLabel = (type: TaskAlert['type']) => {
    switch (type) {
      case 'overdue': return 'Vencida';
      case 'urgent': return 'Requiere Atención';
    }
  };

  const renderAlertCard = (alert: TaskAlert) => (
    <div
      key={alert.id}
      className={cn(
        "p-3 rounded-lg border",
        getAlertColor(alert.type)
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        {getAlertIcon(alert.type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Badge variant="outline" className="text-[10px] px-1.5">
              {getAlertLabel(alert.type)}
            </Badge>
            <Badge variant="secondary" className="text-[10px] px-1.5">
              {areaLabels[alert.task.area]}
            </Badge>
          </div>
          <p className="text-sm font-medium leading-tight">
            {alert.task.title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {alert.message}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full h-7 text-xs"
        onClick={() => {
          onOpenTask(alert.task.id);
          setShowAllDialog(false);
        }}
      >
        Ver tarea
        <ArrowRight className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );

  if (alerts.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas operativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-success/10 mb-3">
              <AlertTriangle className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm font-medium">Sin alertas</p>
            <p className="text-xs text-muted-foreground">
              Todas las tareas están bajo control
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const visibleAlerts = alerts.slice(0, 3);
  const hasMore = alerts.length > 3;

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Alertas operativas
            </CardTitle>
            <Badge variant="destructive" className="text-xs">
              {alerts.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4 pt-2 pb-4">
              {visibleAlerts.map(renderAlertCard)}

              {hasMore && (
                <Button
                  variant="secondary"
                  className="w-full text-xs gap-1 h-8 mt-2"
                  onClick={() => setShowAllDialog(true)}
                >
                  <Expand className="h-3 w-3" />
                  Ver todas ({alerts.length})
                </Button>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <DialogTitle>Alertas Operativas</DialogTitle>
                <DialogDescription>
                  {alerts.length} alertas requieren atención inmediata
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0 p-6 pt-2">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-3 pb-6">
                {alerts.map(renderAlertCard)}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
