
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SponsorSegmentation, SponsorFit } from "@/data/sponsorsMockData";
import { Target, Users, BarChart3, Save, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SponsorSegmentationCardProps {
    segmentation?: SponsorSegmentation;
    onUpdate: (segmentation: SponsorSegmentation) => void;
}

export function SponsorSegmentationCard({ segmentation, onUpdate }: SponsorSegmentationCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<SponsorSegmentation>({
        ageRange: '',
        targetAudience: '',
        fit: 'medio',
        notes: ''
    });

    useEffect(() => {
        if (segmentation) {
            setFormData(segmentation);
        }
    }, [segmentation]);

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const getFitColor = (fit: SponsorFit) => {
        switch (fit) {
            case 'alto': return 'bg-success/10 text-success border-success/20';
            case 'medio': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'bajo': return 'bg-muted text-muted-foreground border-border';
        }
    };

    if (isEditing) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Editar Segmentación
                    </CardTitle>
                    <CardDescription>Define el público objetivo y el encaje de la marca.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Rango de Edad</Label>
                            <Input
                                placeholder="Ej: 18-24, 25-35"
                                value={formData.ageRange}
                                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Encaje con Festival</Label>
                            <Select
                                value={formData.fit}
                                onValueChange={(val) => setFormData({ ...formData, fit: val as SponsorFit })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alto">Alto</SelectItem>
                                    <SelectItem value="medio">Medio</SelectItem>
                                    <SelectItem value="bajo">Bajo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Público Objetivo</Label>
                        <Input
                            placeholder="Ej: Universitarios, Amantes del Rock..."
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Notas de Segmentación</Label>
                        <Textarea
                            placeholder="Detalles adicionales sobre el target..."
                            value={formData.notes || ""}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        <Button size="sm" onClick={handleSave} className="gap-1">
                            <Save className="h-3.5 w-3.5" /> Guardar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Segmentación y Target
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {!segmentation ? (
                    <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-muted/10">
                        No hay datos de segmentación definidos.
                        <div className="mt-2">
                            <Button variant="link" onClick={() => setIsEditing(true)}>Definir Segmentación</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-medium">
                                    <Users className="h-3.5 w-3.5" /> Rango de Edad
                                </span>
                                <p className="text-lg font-semibold">{segmentation.ageRange}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-medium">
                                    <BarChart3 className="h-3.5 w-3.5" /> Encaje
                                </span>
                                <div>
                                    <Badge variant="outline" className={`font-medium ${getFitColor(segmentation.fit)}`}>
                                        {segmentation.fit.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground uppercase font-medium">Público Objetivo</span>
                            <p className="text-sm">{segmentation.targetAudience}</p>
                        </div>

                        {segmentation.notes && (
                            <div className="space-y-1 pt-2 border-t">
                                <span className="text-xs text-muted-foreground flex gap-1 items-center">
                                    Notas Adicionales
                                </span>
                                <p className="text-xs text-muted-foreground italic">
                                    "{segmentation.notes}"
                                </p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
