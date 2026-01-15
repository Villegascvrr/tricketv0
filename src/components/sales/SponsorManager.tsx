import { useState } from "react";
import { format } from "date-fns";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ChevronRight,
    ArrowLeft,
    Plus,
    Briefcase,
    FileCheck,
    Megaphone,
    Users,
    Target,
    Calendar,
    Euro,
    ShieldCheck,
    MessageSquare
} from "lucide-react";

import { NotesSheet } from "../common/NotesSheet";

import {
    Sponsor,
    demoSponsors,
    AgreementStatus,
    DeliverableStatus
} from "@/data/sponsorMockData";
import { cn } from "@/lib/utils";
import { useFestivalConfig } from "@/hooks/useFestivalConfig";

export function SponsorManager() {
    const { isDemo } = useFestivalConfig();
    // Only use demo data if isDemo is true, otherwise empty list for now
    const initialData = isDemo ? demoSponsors : [];

    const [sponsors, setSponsors] = useState<Sponsor[]>(initialData);
    const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
    const [notesOpen, setNotesOpen] = useState(false);

    const getStatusVariant = (status: AgreementStatus) => {
        switch (status) {
            case 'active': return 'success';
            case 'signed': return 'default';
            case 'negotiation': return 'secondary';
            case 'closed': return 'outline';
            default: return 'outline';
        }
    };

    const getStatusLabel = (status: AgreementStatus) => {
        switch (status) {
            case 'active': return 'Activo';
            case 'signed': return 'Firmado';
            case 'negotiation': return 'Negociación';
            case 'closed': return 'Cerrado';
            default: return status;
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Headline': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Platinum': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Silver': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    if (selectedSponsor) {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Header Navbar */}
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSponsor(null)} className="h-8 gap-1 pl-1">
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold leading-none flex items-center gap-2">
                            {selectedSponsor.name}
                            <Badge variant="outline" className={cn("text-[10px] font-normal", getTierColor(selectedSponsor.tier))}>
                                {selectedSponsor.tier}
                            </Badge>
                        </h2>
                        <span className="text-xs text-muted-foreground">{selectedSponsor.sector} • Afinidad {selectedSponsor.matchScore}%</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setNotesOpen(true)} className="gap-2 h-8">
                            <MessageSquare className="h-4 w-4" />
                            Notas
                        </Button>
                        <Badge variant={getStatusVariant(selectedSponsor.status)}>
                            {getStatusLabel(selectedSponsor.status)}
                        </Badge>
                    </div>
                </div>

                <NotesSheet
                    open={notesOpen}
                    onOpenChange={setNotesOpen}
                    entityId={selectedSponsor.id}
                    entityType="sponsor"
                    entityName={selectedSponsor.name}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: Agreement & Segmentation */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-medium uppercase tracking-wide">Acuerdo Comercial</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-3">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-muted/30 p-2 rounded">
                                        <div className="text-xs text-muted-foreground">Valor Económico</div>
                                        <div className="font-bold text-lg">{selectedSponsor.value.toLocaleString('es-ES')} €</div>
                                    </div>
                                    <div className="bg-muted/30 p-2 rounded">
                                        <div className="text-xs text-muted-foreground">Valor Especie</div>
                                        <div className="font-semibold">{selectedSponsor.kindValue ? `${selectedSponsor.kindValue.toLocaleString('es-ES')} €` : '-'}</div>
                                    </div>
                                </div>
                                <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Inicio:</span>
                                        <span>{format(new Date(selectedSponsor.startDate), "d MMM yyyy", { locale: es })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Fin:</span>
                                        <span>{format(new Date(selectedSponsor.endDate), "d MMM yyyy", { locale: es })}</span>
                                    </div>
                                </div>
                                <Separator />
                                <p className="text-xs italic text-muted-foreground">{selectedSponsor.description}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-medium uppercase tracking-wide">Segmentación</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-2 text-sm">
                                <div>
                                    <span className="text-xs text-muted-foreground block">Target de Edad</span>
                                    <span className="font-medium">{selectedSponsor.segmentation.ageRange}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Distribución Género</span>
                                    <span className="font-medium">{selectedSponsor.segmentation.genderFocus}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block">Intereses Clave</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedSponsor.segmentation.interests.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-[10px] h-5">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 2: Deliverables */}
                    <div className="space-y-4">
                        <Card className="h-full">
                            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <FileCheck className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-medium uppercase tracking-wide">Entregables & Assets</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-3">
                                {selectedSponsor.deliverables.map(item => (
                                    <div key={item.id} className="flex items-start gap-2 p-2 border rounded hover:bg-muted/50 transition-colors">
                                        <Checkbox checked={item.status === 'completed' || item.status === 'verified'} />
                                        <div className="flex-1 grid gap-0.5">
                                            <div className="flex justify-between items-start">
                                                <span className={cn("text-sm font-medium leading-none", (item.status === 'completed' || item.status === 'verified') && "line-through text-muted-foreground")}>
                                                    {item.item}
                                                </span>
                                                <Badge variant="outline" className="text-[9px] uppercase">{item.type}</Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                Vence: {format(new Date(item.dueDate), "d MMM", { locale: es })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {selectedSponsor.deliverables.length === 0 && (
                                    <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded">
                                        No hay entregables definidos
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 3: Actions & Activation */}
                    <div className="space-y-4">
                        <Card className="h-full">
                            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <Megaphone className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-medium uppercase tracking-wide">Acciones Pactadas</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-3">
                                {selectedSponsor.actions.map(action => (
                                    <div key={action.id} className="bg-muted/30 p-3 rounded border">
                                        <div className="font-semibold text-sm mb-1">{action.title}</div>
                                        <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                                        <Badge variant={action.status === 'executed' ? 'default' : 'secondary'} className="text-[10px]">
                                            {action.status === 'executed' ? 'Ejecutado' : 'Planificado'}
                                        </Badge>
                                    </div>
                                ))}
                                {selectedSponsor.actions.length === 0 && (
                                    <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded">
                                        No hay acciones planificadas
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Patrocinadores & Marcas</h2>
                    <p className="text-sm text-muted-foreground">Gestión de relaciones comerciales y activaciones</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Patrocinador
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Valor Total Acuerdos</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                        <div className="text-2xl font-bold">
                            {sponsors.reduce((acc, curr) => acc + curr.value + (curr.kindValue || 0), 0).toLocaleString('es-ES')} €
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Sponsors Activos</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                        <div className="text-2xl font-bold">
                            {sponsors.filter(s => s.status === 'active' || s.status === 'signed').length}
                        </div>
                        <p className="text-xs text-muted-foreground">de {sponsors.length} totales</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">En Negociación</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                        <div className="text-2xl font-bold text-amber-600">
                            {sponsors.filter(s => s.status === 'negotiation').reduce((acc, curr) => acc + curr.value, 0).toLocaleString('es-ES')} €
                        </div>
                        <p className="text-xs text-muted-foreground">{sponsors.filter(s => s.status === 'negotiation').length} oportunidades</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Retorno en Especie</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                        <div className="text-2xl font-bold text-blue-600">
                            {sponsors.reduce((acc, curr) => acc + (curr.kindValue || 0), 0).toLocaleString('es-ES')} €
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Estado</TableHead>
                            <TableHead>Marca / Sponsor</TableHead>
                            <TableHead className="hidden md:table-cell">Tier</TableHead>
                            <TableHead className="hidden md:table-cell text-right">Valor Total</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Afinidad</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sponsors.length > 0 ? (
                            sponsors.map((sponsor) => (
                                <TableRow
                                    key={sponsor.id}
                                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => setSelectedSponsor(sponsor)}
                                >
                                    <TableCell>
                                        <Badge variant={getStatusVariant(sponsor.status)} className="font-medium text-[10px]">
                                            {getStatusLabel(sponsor.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold">{sponsor.name}</div>
                                        <div className="text-xs text-muted-foreground">{sponsor.sector}</div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline" className={cn("text-[10px] font-normal", getTierColor(sponsor.tier))}>
                                            {sponsor.tier}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right font-mono text-xs">
                                        {(sponsor.value + (sponsor.kindValue || 0)).toLocaleString('es-ES')} €
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-center">
                                        <span className={cn(
                                            "text-xs font-bold",
                                            sponsor.matchScore >= 90 ? "text-green-600" :
                                                sponsor.matchScore >= 70 ? "text-blue-600" : "text-amber-600"
                                        )}>
                                            {sponsor.matchScore}%
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <ShieldCheck className="h-8 w-8 text-muted-foreground/50" />
                                        <p>No hay patrocinadores registrados.</p>
                                        <Button variant="outline" size="sm" className="mt-2">Añadir tu primer sponsor</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
