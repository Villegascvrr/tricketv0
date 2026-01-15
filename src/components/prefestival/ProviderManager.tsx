import { useState } from "react";
import { format, isPast } from "date-fns";
import { es } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import {
    ChevronRight,
    Truck,
    Phone,
    Mail,
    FileText,
    Calendar,
    Euro,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Paperclip,
    ArrowLeft,
    Plus,
    User,
    MessageSquare
} from "lucide-react";

import { NotesSheet } from "../common/NotesSheet";

import {
    Provider,
    ProviderStatus,
    mockProviders
} from "@/data/providerMockData";
import { cn } from "@/lib/utils";

export function ProviderManager() {
    const [providers, setProviders] = useState<Provider[]>(mockProviders);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [notesOpen, setNotesOpen] = useState(false);

    const handleStatusChange = (providerId: string, newStatus: ProviderStatus) => {
        setProviders(prev => prev.map(p =>
            p.id === providerId ? { ...p, status: newStatus } : p
        ));
        if (selectedProvider && selectedProvider.id === providerId) {
            setSelectedProvider(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const getStatusColor = (status: ProviderStatus) => {
        switch (status) {
            case 'ok': return 'bg-green-100 text-green-800 border-green-200';
            case 'risk': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: ProviderStatus) => {
        switch (status) {
            case 'ok': return 'OK';
            case 'risk': return 'En Riesgo';
            case 'blocked': return 'Bloqueado';
            default: return status;
        }
    };

    if (selectedProvider) {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Header Detail */}
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedProvider(null)} className="h-8 gap-1 pl-1">
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        {selectedProvider.name}
                        <Badge variant="outline" className="font-normal text-xs">{selectedProvider.category}</Badge>
                    </h2>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setNotesOpen(true)} className="gap-2 h-8">
                            <MessageSquare className="h-4 w-4" />
                            Notas
                        </Button>
                        <Select
                            value={selectedProvider.status}
                            onValueChange={(val: ProviderStatus) => handleStatusChange(selectedProvider.id, val)}
                        >
                            <SelectTrigger className={cn("w-[130px] h-8", getStatusColor(selectedProvider.status))}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ok">OK</SelectItem>
                                <SelectItem value="risk">En Riesgo</SelectItem>
                                <SelectItem value="blocked">Bloqueado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <NotesSheet
                    open={notesOpen}
                    onOpenChange={setNotesOpen}
                    entityId={selectedProvider.id}
                    entityType="provider"
                    entityName={selectedProvider.name}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: Info & Contracts & Files */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Información
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-3 text-sm">
                                <p className="text-muted-foreground text-xs">{selectedProvider.description}</p>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="font-medium">{selectedProvider.contactName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                        <a href={`mailto:${selectedProvider.contactEmail}`} className="hover:underline text-primary">
                                            {selectedProvider.contactEmail}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{selectedProvider.contactPhone}</span>
                                    </div>
                                </div>
                                <div className="bg-muted/50 p-2 rounded text-xs italic">
                                    "{selectedProvider.notes}"
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Tasks */}
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Tareas Relacionadas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-2">
                                {selectedProvider.relatedTaskIds.length > 0 ? (
                                    selectedProvider.relatedTaskIds.map(taskId => (
                                        <div key={taskId} className="flex items-center gap-2 text-sm p-1.5 bg-muted/30 rounded border border-transparent hover:border-border transition-colors">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            <span className="font-medium text-xs">Tarea #{taskId}</span>
                                            {/* Note: In a real app we would resolve the task title here */}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">No hay tareas vinculadas.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Contratos
                                </CardTitle>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-2">
                                {selectedProvider.checklist.contracts.map(contract => (
                                    <div key={contract.id} className="flex items-center justify-between text-sm border p-2 rounded-md hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span className="font-medium">{contract.name}</span>
                                        </div>
                                        <Badge variant={contract.status === 'signed' ? 'default' : 'secondary'} className="text-[10px] h-5">
                                            {contract.status === 'signed' ? 'Firmado' : contract.status === 'pending_signature' ? 'Pdte. Firma' : 'Borrador'}
                                        </Badge>
                                    </div>
                                ))}
                                {selectedProvider.checklist.contracts.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-2">No hay contratos</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 2: Checklists (Dates, Deliverables) */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Fechas Clave
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-2">
                                {selectedProvider.checklist.dates.map(dateItem => {
                                    const overdue = !dateItem.completed && isPast(new Date(dateItem.date));
                                    return (
                                        <div key={dateItem.id} className="flex items-start gap-2 text-sm p-1">
                                            <Checkbox id={dateItem.id} checked={dateItem.completed} />
                                            <div className="grid gap-0.5 leading-none">
                                                <label
                                                    htmlFor={dateItem.id}
                                                    className={cn(
                                                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                                        dateItem.completed && "line-through text-muted-foreground"
                                                    )}
                                                >
                                                    {dateItem.label}
                                                </label>
                                                <p className={cn("text-xs", overdue ? "text-destructive font-semibold" : "text-muted-foreground")}>
                                                    {format(new Date(dateItem.date), "d MMM yyyy", { locale: es })}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Entregables
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-2">
                                {selectedProvider.checklist.deliverables.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm p-1">
                                        <span className={cn(item.status === 'completed' && "text-muted-foreground line-through")}>
                                            {item.label}
                                        </span>
                                        {item.status === 'completed' ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : item.status === 'not_applicable' ? (
                                            <span className="text-[10px] text-muted-foreground">N/A</span>
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-orange-400" />
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 3: Payments */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    Pagos
                                </CardTitle>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-3">
                                {selectedProvider.checklist.payments.map(payment => {
                                    const isPaid = payment.status === 'paid';
                                    const isOverdue = payment.status === 'overdue';
                                    return (
                                        <div key={payment.id} className="border rounded p-3 text-sm relative overflow-hidden">
                                            {isPaid && <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-bl" />}
                                            {isOverdue && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl" />}

                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium">{payment.concept}</span>
                                                <span className="font-bold">{payment.amount.toLocaleString('es-ES')} €</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                <span>{format(new Date(payment.dueDate), "d MMM yyyy", { locale: es })}</span>
                                                <Badge
                                                    variant={isPaid ? "default" : isOverdue ? "destructive" : "outline"}
                                                    className="h-4 px-1.5 text-[10px]"
                                                >
                                                    {isPaid ? 'Pagado' : isOverdue ? 'Vencido' : 'Pendiente'}
                                                </Badge>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="pt-2 border-t flex justify-between text-sm font-semibold">
                                    <span>Total Asignado:</span>
                                    <span>
                                        {selectedProvider.checklist.payments.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('es-ES')} €
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-end">
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Proveedor
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Estado</TableHead>
                            <TableHead>Proveedor</TableHead>
                            <TableHead className="hidden md:table-cell">Categoría</TableHead>
                            <TableHead className="hidden md:table-cell">Contacto</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {providers.map((provider) => (
                            <TableRow
                                key={provider.id}
                                className="group cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setSelectedProvider(provider)}
                            >
                                <TableCell>
                                    <div className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium border", getStatusColor(provider.status))}>
                                        {getStatusLabel(provider.status)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{provider.name}</div>
                                    <div className="text-xs text-muted-foreground md:hidden">{provider.category}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant="secondary" className="font-normal">{provider.category}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                    {provider.contactName}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
