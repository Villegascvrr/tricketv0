
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Plus, Search, Filter, MoreVertical, Pencil, Trash2,
    Briefcase, CheckCircle2, Clock, AlertCircle, User
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { initialSponsors, Sponsor, categoryLabels, statusLabels } from "@/data/sponsorsMockData";
import { SponsorDialog } from "./SponsorDialog";
import { SponsorDetail } from "./SponsorDetail";
import { useFestivalConfig } from "@/hooks/useFestivalConfig";

export default function SponsorList() {
    const { isDemo } = useFestivalConfig();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);

    useEffect(() => {
        if (isDemo) {
            setSponsors(initialSponsors);
        } else {
            setSponsors([]);
        }
    }, [isDemo]);

    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(null);

    // Derived state for detail view
    const selectedSponsor = sponsors.find(s => s.id === selectedSponsorId);

    // Filtering
    const filteredSponsors = sponsors.filter(sponsor => {
        const matchesSearch = sponsor.name.toLowerCase().includes(search.toLowerCase()) ||
            sponsor.internal_responsible.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === "all" || sponsor.category === filterCategory;
        const matchesStatus = filterStatus === "all" || sponsor.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Actions
    const handleCreate = (data: any) => {
        const newSponsor: Sponsor = {
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...data
        };
        setSponsors([newSponsor, ...sponsors]);
    };

    const handleUpdate = (data: any) => {
        const targetId = editingSponsor?.id;
        if (!targetId) return;

        const updatedSponsors = sponsors.map(s =>
            s.id === targetId
                ? { ...s, ...data, updated_at: new Date().toISOString() }
                : s
        );
        setSponsors(updatedSponsors);
        setEditingSponsor(null);
    };

    const handleDetailUpdate = (id: string, updates: Partial<Sponsor>) => {
        const updatedSponsors = sponsors.map(s =>
            s.id === id
                ? { ...s, ...updates, updated_at: new Date().toISOString() }
                : s
        );
        setSponsors(updatedSponsors);
    };

    const handleDelete = () => {
        if (!deleteId) return;
        setSponsors(sponsors.filter(s => s.id !== deleteId));
        setDeleteId(null);
    };

    const openEdit = (sponsor: Sponsor) => {
        setEditingSponsor(sponsor);
        setIsDialogOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'cerrado': return 'bg-success/10 text-success border-success/20';
            case 'en_curso': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'cerrado': return <CheckCircle2 className="h-3 w-3 mr-1" />;
            case 'en_curso': return <Clock className="h-3 w-3 mr-1" />;
            default: return <AlertCircle className="h-3 w-3 mr-1" />;
        }
    };

    if (selectedSponsor) {
        return (
            <SponsorDetail
                sponsor={selectedSponsor}
                onBack={() => setSelectedSponsorId(null)}
                onUpdate={handleDetailUpdate}
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-lg">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar marca o responsable..."
                            className="pl-9 h-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[140px] h-9">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {Object.entries(categoryLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[140px] h-9">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {Object.entries(statusLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={() => { setEditingSponsor(null); setIsDialogOpen(true); }} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Marca
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSponsors.map((sponsor) => (
                    <Card
                        key={sponsor.id}
                        className="hover:bg-accent/5 transition-colors group cursor-pointer border-transparent hover:border-primary/20 hover:shadow-md"
                        onClick={() => setSelectedSponsorId(sponsor.id)}
                    >
                        <CardHeader className="pb-3 pt-4 px-4 sticky top-0">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold">{sponsor.name}</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">{categoryLabels[sponsor.category]}</CardDescription>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" onClick={(e) => e.stopPropagation()}>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEdit(sponsor); }}>
                                            <Pencil className="h-3.5 w-3.5 mr-2" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(sponsor.id); }}>
                                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-3">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={`text-xs font-normal border ${getStatusColor(sponsor.status)}`}>
                                    {getStatusIcon(sponsor.status)}
                                    {statusLabels[sponsor.status]}
                                </Badge>
                                <Badge variant="secondary" className="text-xs font-normal bg-secondary/50">
                                    {sponsor.agreement_type}
                                </Badge>
                            </div>

                            {sponsor.notes && (
                                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">
                                    {sponsor.notes}
                                </p>
                            )}

                            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground border-t mt-2">
                                <User className="h-3.5 w-3.5" />
                                <span>Resp: <span className="font-medium text-foreground">{sponsor.internal_responsible}</span></span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {
                filteredSponsors.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                        <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No se encontraron marcas con los filtros actuales.</p>
                    </div>
                )
            }

            <SponsorDialog
                open={isDialogOpen}
                onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingSponsor(null); }}
                onSubmit={editingSponsor ? handleUpdate : handleCreate}
                initialData={editingSponsor}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará la marca y toda su información asociada. No se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
