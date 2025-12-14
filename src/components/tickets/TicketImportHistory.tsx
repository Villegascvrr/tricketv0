import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTicketImports } from '@/hooks/useTicketImports';
import { Skeleton } from '@/components/ui/skeleton';

interface TicketImportHistoryProps {
  eventId: string;
}

export const TicketImportHistory = ({ eventId }: TicketImportHistoryProps) => {
  const { imports, loading, deleteImport } = useTicketImports(eventId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de Importaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (imports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de Importaciones</CardTitle>
          <CardDescription>No hay importaciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileSpreadsheet className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Importa tu primer archivo de tickets para ver el historial aquí</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalImported = imports.reduce((sum, i) => sum + i.imported_count, 0);
  const totalErrors = imports.reduce((sum, i) => sum + i.error_count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Historial de Importaciones</CardTitle>
            <CardDescription>
              {imports.length} importaciones · {totalImported.toLocaleString()} tickets totales
              {totalErrors > 0 && ` · ${totalErrors} errores`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Archivo</TableHead>
                <TableHead className="text-right">Importados</TableHead>
                <TableHead className="text-right">Errores</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.map((imp) => (
                <TableRow key={imp.id}>
                  <TableCell className="text-xs">
                    {format(new Date(imp.imported_at), "d MMM yyyy, HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {imp.provider_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                    {imp.file_name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">{imp.imported_count.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {imp.error_count > 0 ? (
                      <div className="flex items-center justify-end gap-1 text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-xs">{imp.error_count}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar registro de importación?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esto eliminará el registro del historial pero NO los tickets importados.
                            Para eliminar los tickets, usa la opción de gestión de datos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteImport(imp.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
