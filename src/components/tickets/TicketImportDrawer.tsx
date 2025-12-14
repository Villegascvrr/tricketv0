import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, ChevronRight, ChevronLeft, Check, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTicketImports, TicketInsert } from '@/hooks/useTicketImports';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface TicketImportDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}

type Step = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete';

// Campos de la tabla tickets que se pueden mapear
const TICKET_FIELDS = [
  { key: 'sale_date', label: 'Fecha de venta', required: true },
  { key: 'price', label: 'Precio', required: true },
  { key: 'ticket_type', label: 'Tipo de entrada', required: false },
  { key: 'zone_name', label: 'Zona', required: false },
  { key: 'channel', label: 'Canal de venta', required: false },
  { key: 'buyer_city', label: 'Ciudad', required: false },
  { key: 'buyer_province', label: 'Provincia', required: false },
  { key: 'buyer_country', label: 'País', required: false },
  { key: 'buyer_postal_code', label: 'Código postal', required: false },
  { key: 'buyer_age', label: 'Edad', required: false },
  { key: 'buyer_birth_year', label: 'Año nacimiento', required: false },
  { key: 'has_email', label: 'Tiene email', required: false },
  { key: 'has_phone', label: 'Tiene teléfono', required: false },
  { key: 'marketing_consent', label: 'Consentimiento marketing', required: false },
  { key: 'external_ticket_id', label: 'ID externo', required: false },
  { key: 'currency', label: 'Moneda', required: false },
  { key: 'status', label: 'Estado', required: false },
];

const PROVIDERS = [
  'Ticketmaster',
  'Fever',
  'El Corte Inglés',
  'Bclever',
  'Tiqets',
  'Eventbrite',
  'Dice',
  'See Tickets',
  'Web Oficial',
  'Otro',
];

export const TicketImportDrawer = ({ open, onOpenChange, eventId }: TicketImportDrawerProps) => {
  const [step, setStep] = useState<Step>('upload');
  const [providerName, setProviderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [rawData, setRawData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<TicketInsert[]>([]);
  const [importResult, setImportResult] = useState<{ importedCount: number; errorCount: number } | null>(null);

  const { importTickets, importing } = useTicketImports(eventId);

  const resetState = () => {
    setStep('upload');
    setProviderName('');
    setFileName('');
    setRawData([]);
    setColumns([]);
    setMapping({});
    setPreviewData([]);
    setImportResult(null);
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setRawData(results.data as Record<string, any>[]);
            setColumns(Object.keys(results.data[0] as object));
            setStep('mapping');
          }
        },
        error: (error) => {
          console.error('CSV parse error:', error);
        },
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];
        
        if (jsonData.length > 0) {
          setRawData(jsonData);
          setColumns(Object.keys(jsonData[0]));
          setStep('mapping');
        }
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const handleMappingChange = (ticketField: string, csvColumn: string) => {
    setMapping((prev) => ({
      ...prev,
      [ticketField]: csvColumn === 'none' ? '' : csvColumn,
    }));
  };

  const parseValue = (value: any, fieldKey: string): any => {
    if (value === undefined || value === null || value === '') return null;

    // Campos numéricos
    if (['price', 'buyer_age', 'buyer_birth_year'].includes(fieldKey)) {
      const num = parseFloat(String(value).replace(',', '.').replace(/[€$]/g, '').trim());
      return isNaN(num) ? null : num;
    }

    // Campos booleanos
    if (['has_email', 'has_phone', 'marketing_consent'].includes(fieldKey)) {
      const strVal = String(value).toLowerCase().trim();
      return strVal === 'true' || strVal === 'sí' || strVal === 'si' || strVal === '1' || strVal === 'yes';
    }

    // Fecha de venta - intentar parsear varios formatos
    if (fieldKey === 'sale_date') {
      // Si ya es una fecha ISO, devolverla
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return value;
      }
      // Intentar parsear DD/MM/YYYY o DD-MM-YYYY
      const dateMatch = String(value).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`;
      }
      // Intentar parsear fecha Excel (número de días desde 1900)
      if (typeof value === 'number') {
        const date = new Date((value - 25569) * 86400 * 1000);
        return date.toISOString();
      }
      return new Date().toISOString();
    }

    return String(value).trim();
  };

  const generatePreview = () => {
    const requiredFields = TICKET_FIELDS.filter(f => f.required).map(f => f.key);
    const missingRequired = requiredFields.filter(f => !mapping[f]);

    if (missingRequired.length > 0) {
      return;
    }

    const preview: TicketInsert[] = rawData.slice(0, 100).map((row) => {
      const ticket: TicketInsert = {
        event_id: eventId,
        provider_name: providerName,
        sale_date: parseValue(row[mapping['sale_date']], 'sale_date'),
        price: parseValue(row[mapping['price']], 'price') || 0,
      };

      // Mapear campos opcionales
      TICKET_FIELDS.forEach(({ key }) => {
        if (mapping[key] && key !== 'sale_date' && key !== 'price') {
          const value = parseValue(row[mapping[key]], key);
          if (value !== null) {
            (ticket as any)[key] = value;
          }
        }
      });

      return ticket;
    });

    setPreviewData(preview);
    setStep('preview');
  };

  const handleImport = async () => {
    setStep('importing');

    // Generar todos los tickets
    const allTickets: TicketInsert[] = rawData.map((row) => {
      const ticket: TicketInsert = {
        event_id: eventId,
        provider_name: providerName,
        sale_date: parseValue(row[mapping['sale_date']], 'sale_date'),
        price: parseValue(row[mapping['price']], 'price') || 0,
      };

      TICKET_FIELDS.forEach(({ key }) => {
        if (mapping[key] && key !== 'sale_date' && key !== 'price') {
          const value = parseValue(row[mapping[key]], key);
          if (value !== null) {
            (ticket as any)[key] = value;
          }
        }
      });

      return ticket;
    });

    const result = await importTickets(allTickets, providerName, fileName, mapping);
    setImportResult(result);
    setStep('complete');
  };

  const requiredFields = TICKET_FIELDS.filter(f => f.required).map(f => f.key);
  const missingRequired = requiredFields.filter(f => !mapping[f]);
  const canProceedToPreview = missingRequired.length === 0 && providerName;

  return (
    <Drawer open={open} onOpenChange={(o) => {
      if (!o) resetState();
      onOpenChange(o);
    }}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Tickets
          </DrawerTitle>
          <DrawerDescription>
            {step === 'upload' && 'Sube un archivo CSV o Excel con los datos de tickets'}
            {step === 'mapping' && 'Mapea las columnas del archivo a los campos de tickets'}
            {step === 'preview' && 'Revisa los datos antes de importar'}
            {step === 'importing' && 'Importando tickets...'}
            {step === 'complete' && 'Importación completada'}
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 pb-4">
          {/* Step: Upload */}
          {step === 'upload' && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Proveedor / Ticketera</Label>
                <Select value={providerName} onValueChange={setProviderName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Archivo (CSV o Excel)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Arrastra un archivo o haz clic para seleccionar
                  </p>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Mapping */}
          {step === 'mapping' && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{fileName}</p>
                  <p className="text-xs text-muted-foreground">{rawData.length} filas detectadas</p>
                </div>
                <Badge variant={providerName ? 'secondary' : 'destructive'}>
                  {providerName || 'Sin proveedor'}
                </Badge>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Campo de ticket</TableHead>
                      <TableHead className="w-1/3">Columna del archivo</TableHead>
                      <TableHead>Ejemplo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TICKET_FIELDS.map(({ key, label, required }) => (
                      <TableRow key={key}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{label}</span>
                            {required && <Badge variant="destructive" className="text-[10px] px-1">Req.</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={mapping[key] || 'none'}
                            onValueChange={(v) => handleMappingChange(key, v)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="No mapear" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">— No mapear —</SelectItem>
                              {columns.map((col) => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {mapping[key] && rawData[0]?.[mapping[key]] !== undefined
                            ? String(rawData[0][mapping[key]])
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {missingRequired.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Faltan campos obligatorios: {missingRequired.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* Step: Preview */}
          {step === 'preview' && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Vista previa de importación</p>
                  <p className="text-xs text-muted-foreground">
                    Mostrando {Math.min(previewData.length, 10)} de {rawData.length} tickets
                  </p>
                </div>
                <Badge>{providerName}</Badge>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Zona</TableHead>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Provincia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 10).map((ticket, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-xs">
                          {ticket.sale_date ? new Date(ticket.sale_date).toLocaleDateString('es-ES') : '—'}
                        </TableCell>
                        <TableCell className="text-xs">€{ticket.price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="text-xs">{ticket.ticket_type || '—'}</TableCell>
                        <TableCell className="text-xs">{ticket.zone_name || '—'}</TableCell>
                        <TableCell className="text-xs">{ticket.buyer_city || '—'}</TableCell>
                        <TableCell className="text-xs">{ticket.buyer_province || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Resumen de importación</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total tickets:</span>{' '}
                    <span className="font-medium">{rawData.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Proveedor:</span>{' '}
                    <span className="font-medium">{providerName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Importing */}
          {step === 'importing' && (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Importando {rawData.length} tickets...</p>
            </div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && importResult && (
            <div className="py-8 text-center space-y-4">
              {importResult.errorCount === 0 ? (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                  <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              )}
              <div>
                <p className="text-lg font-medium">Importación completada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {importResult.importedCount} tickets importados
                  {importResult.errorCount > 0 && `, ${importResult.errorCount} con errores`}
                </p>
              </div>
            </div>
          )}
        </ScrollArea>

        <DrawerFooter className="flex-row gap-2">
          {step === 'upload' && (
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">Cancelar</Button>
            </DrawerClose>
          )}

          {step === 'mapping' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Atrás
              </Button>
              <Button 
                onClick={generatePreview} 
                disabled={!canProceedToPreview}
                className="flex-1"
              >
                Vista previa
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </>
          )}

          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('mapping')} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Atrás
              </Button>
              <Button onClick={handleImport} disabled={importing} className="flex-1">
                Importar {rawData.length} tickets
              </Button>
            </>
          )}

          {step === 'complete' && (
            <DrawerClose asChild>
              <Button className="flex-1">Cerrar</Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
