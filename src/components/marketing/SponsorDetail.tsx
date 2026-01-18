
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FolderOpen } from "lucide-react";
import {
    ArrowLeft, User, Briefcase, FileText, CheckCircle2, AlertCircle, Clock,
    Link2, Target, Share2, Layers, ShieldCheck, PenTool
} from "lucide-react";
import { Sponsor, statusLabels, categoryLabels, agreementLabels, SponsorStatus, Agreement, initialAgreements, Deliverable, DeliverableStatus, Activation, ActivationStatus, Publication, PublicationStatus, SponsorSegmentation } from "@/data/sponsorsMockData";
import { AgreementList } from "./AgreementList";
import { DeliverableChecklist } from "./DeliverableChecklist";
import { ActivationList } from "./ActivationList";
import { PublicationList } from "./PublicationList";
import { SponsorCompliance } from "./SponsorCompliance";
import { SponsorSegmentationCard } from "./SponsorSegmentationCard";

interface SponsorDetailProps {
    sponsor: Sponsor;
    onBack: () => void;
    onUpdate: (id: string, updates: Partial<Sponsor>) => void;
}

export function SponsorDetail({ sponsor, onBack, onUpdate }: SponsorDetailProps) {
    const [activeTab, setActiveTab] = useState("acuerdos");

    const handleStatusChange = (newStatus: SponsorStatus) => {
        onUpdate(sponsor.id, { status: newStatus });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'cerrado': return 'text-success border-success/30 bg-success/10';
            case 'en_curso': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
            default: return 'text-muted-foreground border-border bg-muted';
        }
    };

    // Agreements Logic
    // In a real app, this would be fetched separate, but here we can mock check "sponsor.agreements"
    // For the demo, if sponsor has no agreements, we inject some mocks if ID matches, or empty
    const currentAgreements = sponsor.agreements || [];

    const handleAddAgreement = (data: Omit<Agreement, "id">) => {
        const newAgreement: Agreement = {
            id: `agr-${Date.now()}`,
            ...data
        };
        const updatedAgreements = [newAgreement, ...currentAgreements];
        onUpdate(sponsor.id, { agreements: updatedAgreements });
    };

    const handleUpdateAgreement = (agreementId: string, updates: Partial<Agreement>) => {
        const updatedAgreements = currentAgreements.map(a =>
            a.id === agreementId ? { ...a, ...updates } : a
        );
        onUpdate(sponsor.id, { agreements: updatedAgreements });
    };

    const handleDeleteAgreement = (agreementId: string) => {
        const updatedAgreements = currentAgreements.filter(a => a.id !== agreementId);
        onUpdate(sponsor.id, { agreements: updatedAgreements });
    };

    // Deliverables Logic
    const currentDeliverables = sponsor.deliverables || [];

    const handleAddDeliverable = (data: Omit<Deliverable, "id">) => {
        const newDeliverable: Deliverable = {
            id: `del-${Date.now()}`,
            ...data
        };
        const updatedList = [newDeliverable, ...currentDeliverables];
        onUpdate(sponsor.id, { deliverables: updatedList });
    };

    const handleUpdateDeliverableStatus = (id: string, status: DeliverableStatus) => {
        const updatedList = currentDeliverables.map(d =>
            d.id === id ? { ...d, status } : d
        );
        onUpdate(sponsor.id, { deliverables: updatedList });
    };

    const handleDeleteDeliverable = (id: string) => {
        const updatedList = currentDeliverables.filter(d => d.id !== id);
        onUpdate(sponsor.id, { deliverables: updatedList });
    };

    // Activations Logic
    const currentActivations = sponsor.activations || [];

    const handleAddActivation = (data: Omit<Activation, "id">) => {
        const newActivation: Activation = {
            id: `act-${Date.now()}`,
            ...data
        };
        const updatedList = [newActivation, ...currentActivations];
        onUpdate(sponsor.id, { activations: updatedList });
    };

    const handleUpdateActivationStatus = (id: string, status: ActivationStatus) => {
        const updatedList = currentActivations.map(a =>
            a.id === id ? { ...a, status } : a
        );
        onUpdate(sponsor.id, { activations: updatedList });
    };

    const handleDeleteActivation = (id: string) => {
        const updatedList = currentActivations.filter(a => a.id !== id);
        onUpdate(sponsor.id, { activations: updatedList });
    };

    // Publications Logic
    const currentPublications = sponsor.publications || [];

    const handleAddPublication = (data: Omit<Publication, "id">) => {
        const newPublication: Publication = {
            id: `pub-${Date.now()}`,
            ...data
        };
        const updatedList = [newPublication, ...currentPublications];
        onUpdate(sponsor.id, { publications: updatedList });
    };

    const handleUpdatePublicationStatus = (id: string, status: PublicationStatus) => {
        const updatedList = currentPublications.map(p =>
            p.id === id ? { ...p, status } : p
        );
        onUpdate(sponsor.id, { publications: updatedList });
    };

    const handleDeletePublication = (id: string) => {
        const updatedList = currentPublications.filter(p => p.id !== id);
        onUpdate(sponsor.id, { publications: updatedList });
    };

    // Segmentation Logic
    const handleUpdateSegmentation = (segmentation: SponsorSegmentation) => {
        onUpdate(sponsor.id, { segmentation });
    };

    const sections = [
        { id: "acuerdos", label: "Acuerdos", icon: FileText },
        { id: "entregables", label: "Entregables", icon: Layers },
        { id: "activaciones", label: "Acciones", icon: HandshakeIcon },
        { id: "publicaciones", label: "Publicaciones", icon: Share2 },
        { id: "cumplimiento", label: "Cumplimiento", icon: ShieldCheck },
        { id: "segmentacion", label: "Segmentación", icon: Target },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Header & Back */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between border-b pb-4">
                <div className="flex items-center gap-4 min-w-[300px]">
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 shrink-0">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">{sponsor.name}</h2>
                            <Badge variant="outline" className="font-normal text-xs">{categoryLabels[sponsor.category]}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <Briefcase className="h-3 w-3" />
                            {agreementLabels[sponsor.agreement_type]}
                            <span className="text-border">|</span>
                            <User className="h-3 w-3" />
                            {sponsor.internal_responsible}
                        </p>
                    </div>
                </div>

                {/* Notes Section - Compact in Header */}
                <div className="flex-1 max-w-2xl px-4 lg:border-l lg:border-r lg:mx-4 py-1 lg:py-0">
                    <div className="flex items-start gap-2.5">
                        <PenTool className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Notas / Contexto</span>
                            <p className="text-sm text-foreground/90 line-clamp-2 leading-snug">
                                {sponsor.notes || "Sin notas adicionales o contexto clave definido."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5 shadow-sm">
                        <span className="text-xs font-medium text-muted-foreground">Estado:</span>
                        <Select value={sponsor.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className={`h-6 w-[120px] text-xs border-0 p-0 focus:ring-0 shadow-none bg-transparent ${getStatusColor(sponsor.status).split(' ')[0]}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(statusLabels).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Subsections Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <TabsTrigger key={section.id} value={section.id} className="flex flex-col gap-1.5 py-2 text-xs h-auto">
                                <Icon className="h-4 w-4" />
                                {section.label}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {sections.map((section) => (
                    <TabsContent key={section.id} value={section.id} className="mt-4">
                        {section.id === 'acuerdos' ? (
                            <AgreementList
                                agreements={currentAgreements}
                                onAdd={handleAddAgreement}
                                onUpdate={handleUpdateAgreement}
                                onDelete={handleDeleteAgreement}
                            />
                        ) : section.id === 'entregables' ? (
                            <DeliverableChecklist
                                deliverables={currentDeliverables}
                                onAdd={handleAddDeliverable}
                                onUpdateStatus={handleUpdateDeliverableStatus}
                                onDelete={handleDeleteDeliverable}
                            />
                        ) : section.id === 'activaciones' ? (
                            <ActivationList
                                activations={currentActivations}
                                onAdd={handleAddActivation}
                                onUpdateStatus={handleUpdateActivationStatus}
                                onDelete={handleDeleteActivation}
                            />
                        ) : section.id === 'publicaciones' ? (
                            <PublicationList
                                publications={currentPublications}
                                onAdd={handleAddPublication}
                                onUpdateStatus={handleUpdatePublicationStatus}
                                onDelete={handleDeletePublication}
                            />
                        ) : section.id === 'cumplimiento' ? (
                            <SponsorCompliance sponsor={sponsor} />
                        ) : section.id === 'segmentacion' ? (
                            <SponsorSegmentationCard
                                segmentation={sponsor.segmentation}
                                onUpdate={handleUpdateSegmentation}
                            />
                        ) : (
                            <Card className="min-h-[300px] flex flex-col items-center justify-center border-dashed">
                                <div className="p-4 rounded-full bg-muted/30 mb-4">
                                    <FolderOpen className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-muted-foreground">Sección {section.label}</h3>
                                <p className="text-sm text-muted-foreground">No hay datos registrados todavía.</p>
                            </Card>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

// Icon helper
function HandshakeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m11 17 2 2a1 1 0 1 0 3-3" />
            <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-1.42-1.42l.88-.88a5 5 0 0 1 7.07 0l2.12 2.12a5 5 0 0 1 0 7.07l-2.5 2.5a5 5 0 0 1-7.07 0l-2.5-2.5" />
        </svg>
    )
}
