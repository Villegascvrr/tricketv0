import { useState, useMemo, useEffect } from "react";
import { Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PageBreadcrumb from "../PageBreadcrumb";
import { Influencer, demoInfluencers, InfluencerPlatform, InfluencerStatus, InfluencerCampaign, PostDeliverable, AdminDeliverable } from "@/data/influencerMockData";
import { InfluencerList } from "./influencers/InfluencerList";
import { InfluencerDialog } from "./influencers/InfluencerDialog";
import { InfluencerDetail } from "./influencers/InfluencerDetail";
import { InfluencerDashboard } from "./influencers/InfluencerDashboard";
import { useToast } from "@/hooks/use-toast";
import { useEvent } from "@/contexts/EventContext";

export function InfluencerManager() {
    const { toast } = useToast();
    const { selectedEvent } = useEvent();
    const [influencers, setInfluencers] = useState<Influencer[]>([]);

    useEffect(() => {
        const isDemo = !selectedEvent?.id ||
            selectedEvent.id === 'demo' ||
            selectedEvent.id === 'demo-event-id';

        if (isDemo) {
            setInfluencers(demoInfluencers);
        } else {
            setInfluencers([]);
        }

        // Reset detail view selection when switching events
        setSelectedInfluencer(null);
    }, [selectedEvent?.id]);

    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
    const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);
    const [platformFilter, setPlatformFilter] = useState<InfluencerPlatform | "All">("All");
    const [statusFilter, setStatusFilter] = useState<InfluencerStatus | "All">("All");

    const filteredInfluencers = useMemo(() => {
        return influencers.filter(inf => {
            const matchesSearch = inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inf.contact.socialHandle?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPlatform = platformFilter === "All" || inf.primaryPlatform === platformFilter;
            const matchesStatus = statusFilter === "All" || inf.status === statusFilter;
            return matchesSearch && matchesPlatform && matchesStatus;
        });
    }, [influencers, searchTerm, platformFilter, statusFilter]);

    const handleCreate = () => {
        setEditingInfluencer(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (influencer: Influencer) => {
        setEditingInfluencer(influencer);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este influencer?")) {
            setInfluencers(prev => prev.filter(inf => inf.id !== id));
            toast({
                title: "Influencer eliminado",
                description: "El influencer ha sido eliminado correctamente.",
            });
            if (selectedInfluencer?.id === id) {
                setSelectedInfluencer(null);
            }
        }
    };

    const handleSave = (data: Partial<Influencer>) => {
        if (editingInfluencer) {
            setInfluencers(prev => prev.map(inf =>
                inf.id === editingInfluencer.id
                    ? { ...inf, ...data, updatedAt: new Date().toISOString() } as Influencer
                    : inf
            ));
            toast({ title: "Actualizado", description: "Influencer actualizado correctamente." });
            if (selectedInfluencer?.id === editingInfluencer.id) {
                setSelectedInfluencer(prev => prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } as Influencer : null);
            }
        } else {
            const newInfluencer: Influencer = {
                id: `inf-${Date.now()}`,
                name: data.name || "Nuevo Influencer",
                primaryPlatform: data.primaryPlatform || "Instagram",
                category: data.category || "nicho",
                status: data.status || "Pendiente",
                assignedTo: data.assignedTo || "Sin asignar",
                contact: data.contact || {},
                notes: data.notes || "",
                socials: [],
                campaigns: [],
                totalReach: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...data
            } as Influencer;

            setInfluencers(prev => [newInfluencer, ...prev]);
            toast({ title: "Creado", description: "Nuevo influencer añadido a la lista." });
        }
    };

    const handleUpdateInfluencer = (id: string, updates: Partial<Influencer>) => {
        const update = (inf: Influencer) => {
            if (inf.id !== id) return inf;
            return { ...inf, ...updates, updatedAt: new Date().toISOString() };
        };
        setInfluencers(prev => prev.map(update));
        if (selectedInfluencer?.id === id) {
            setSelectedInfluencer(prev => prev ? update(prev) : null);
        }
    };

    const handleUpdateStatus = (id: string, status: InfluencerStatus) => {
        handleUpdateInfluencer(id, { status });
        toast({ title: "Estado Actualizado", description: `El estado ha cambiado a ${status}.` });
    };

    const handleAddCampaign = (influencerId: string, campaign: InfluencerCampaign) => {
        const update = (inf: Influencer) => {
            if (inf.id !== influencerId) return inf;
            return {
                ...inf,
                campaigns: [campaign, ...inf.campaigns]
            };
        };
        setInfluencers(prev => prev.map(update));
        if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(prev => prev ? update(prev) : null);
        }
        toast({ title: "Campaña Creada", description: `La campaña "${campaign.name}" ha sido añadida.` });
    };

    const handleEditCampaign = (influencerId: string, updatedCampaign: InfluencerCampaign) => {
        const update = (inf: Influencer) => {
            if (inf.id !== influencerId) return inf;
            return {
                ...inf,
                campaigns: inf.campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c)
            };
        };
        setInfluencers(prev => prev.map(update));
        if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(prev => prev ? update(prev) : null);
        }
        toast({ title: "Campaña Actualizada", description: `Los cambios en "${updatedCampaign.name}" se han guardado.` });
    };

    const handleDeleteCampaign = (influencerId: string, campaignId: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta campaña?")) return;

        const update = (inf: Influencer) => {
            if (inf.id !== influencerId) return inf;
            return {
                ...inf,
                campaigns: inf.campaigns.filter(c => c.id !== campaignId)
            };
        };
        setInfluencers(prev => prev.map(update));
        if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(prev => prev ? update(prev) : null);
        }
        toast({ title: "Campaña Eliminada", description: "La campaña ha sido eliminada correctamente." });
    };

    const handleAddPost = (influencerId: string, post: PostDeliverable) => {
        const update = (inf: Influencer) => {
            if (inf.id !== influencerId) return inf;
            const updatedCampaigns = inf.campaigns.map(c => {
                if (c.id !== post.campaignId) return c;
                return {
                    ...c,
                    deliverables: [...c.deliverables, post]
                };
            });
            return { ...inf, campaigns: updatedCampaigns };
        };
        setInfluencers(prev => prev.map(update));
        if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(prev => prev ? update(prev) : null);
        }
        toast({ title: "Publicación Añadida", description: "La publicación se ha registrado correctamente." });
    };

    const handleAddDeliverable = (influencerId: string, deliverable: AdminDeliverable) => {
        const update = (inf: Influencer) => {
            if (inf.id !== influencerId) return inf;
            const updatedCampaigns = inf.campaigns.map(c => {
                if (c.id !== deliverable.campaignId) return c;
                return {
                    ...c,
                    adminDeliverables: [...c.adminDeliverables, deliverable]
                };
            });
            return { ...inf, campaigns: updatedCampaigns };
        };
        setInfluencers(prev => prev.map(update));
        if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(prev => prev ? update(prev) : null);
        }
        toast({ title: "Entregable Registrado", description: "El entregable se ha guardado correctamente." });
    };

    const handleUpdateDeliverableStatus = (influencerId: string, deliverableId: string, newStatus: 'Pendiente' | 'Entregado') => {
        const update = (inf: Influencer) => {
            if (inf.id !== influencerId) return inf;
            const updatedCampaigns = inf.campaigns.map(c => ({
                ...c,
                adminDeliverables: c.adminDeliverables.map(d =>
                    d.id === deliverableId ? { ...d, status: newStatus } : d
                )
            }));
            return { ...inf, campaigns: updatedCampaigns };
        };
        setInfluencers(prev => prev.map(update));
        if (selectedInfluencer?.id === influencerId) {
            setSelectedInfluencer(prev => prev ? update(prev) : null);
        }
        toast({ title: "Estado Actualizado", description: `Entregable marcado como ${newStatus}.` });
    };

    if (selectedInfluencer) {
        return (
            <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
                <PageBreadcrumb items={[
                    { label: "Marketing", href: "/marketing" },
                    { label: "Influencers", href: "/marketing/influencers", onClick: () => setSelectedInfluencer(null) },
                    { label: selectedInfluencer.name }
                ]} />

                <InfluencerDetail
                    key={selectedInfluencer.id}
                    influencer={selectedInfluencer}
                    onBack={() => setSelectedInfluencer(null)}
                    onUpdateStatus={handleUpdateStatus}
                    onUpdateInfluencer={handleUpdateInfluencer}
                    onUpdatePostStatus={(influencerId, postId, newStatus) => {
                        const updateInfluencer = (inf: Influencer) => {
                            if (inf.id !== influencerId) return inf;
                            const updatedCampaigns = inf.campaigns.map(campaign => ({
                                ...campaign,
                                deliverables: campaign.deliverables.map(post =>
                                    post.id === postId ? { ...post, status: newStatus } : post
                                )
                            }));
                            return { ...inf, campaigns: updatedCampaigns };
                        };
                        setInfluencers(prev => prev.map(updateInfluencer));
                        if (selectedInfluencer?.id === influencerId) {
                            setSelectedInfluencer(prev => prev ? updateInfluencer(prev) : null);
                        }
                        toast({ title: "Estado Actualizado", description: `Publicación marcada como ${newStatus}.` });
                    }}
                    onAddCampaign={handleAddCampaign}
                    onEditCampaign={handleEditCampaign}
                    onDeleteCampaign={handleDeleteCampaign}
                    onAddPost={handleAddPost}
                    onAddDeliverable={handleAddDeliverable}
                    onUpdateDeliverableStatus={handleUpdateDeliverableStatus}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
            <PageBreadcrumb items={[
                { label: "Marketing", href: "/marketing" },
                { label: "Influencers" }
            ]} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Influencers</h1>
                    <p className="text-muted-foreground">Listado de influencers y creadores de contenido.</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Influencer
                </Button>
            </div>

            <InfluencerDashboard
                influencers={influencers}
                onSelect={setSelectedInfluencer}
            />

            <div className="flex flex-col md:flex-row gap-4 p-4 bg-card border rounded-lg shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o usuario..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={platformFilter} onValueChange={(val) => setPlatformFilter(val as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">Todas</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">Todos</SelectItem>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <InfluencerList
                influencers={filteredInfluencers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelect={setSelectedInfluencer}
            />

            <InfluencerDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                influencer={editingInfluencer}
                onSave={handleSave}
            />
        </div>
    );
}
