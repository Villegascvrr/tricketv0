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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Influencer, InfluencerStatus } from "@/data/influencerMockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface InfluencerListProps {
    influencers: Influencer[];
    onEdit: (influencer: Influencer) => void;
    onDelete: (id: string) => void;
    onSelect: (influencer: Influencer) => void;
}

export function InfluencerList({ influencers, onEdit, onDelete, onSelect }: InfluencerListProps) {
    const getStatusVariant = (status: InfluencerStatus) => {
        switch (status) {
            case 'Activo': return 'success';
            case 'Pendiente': return 'warning';
            case 'Finalizado': return 'secondary';
            default: return 'outline';
        }
    };

    if (influencers.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No se encontraron influencers.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Plataforma</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="hidden md:table-cell">Responsable</TableHead>
                        <TableHead className="hidden md:table-cell">Contacto</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {influencers.map((influencer) => (
                        <TableRow
                            key={influencer.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => onSelect(influencer)}
                        >
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{influencer.name}</span>
                                    {influencer.notes && (
                                        <span className="text-[10px] text-muted-foreground line-clamp-1">{influencer.notes}</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{influencer.primaryPlatform}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize">
                                    {influencer.category}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(influencer.status)}>
                                    {influencer.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                {influencer.assignedTo}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm">
                                <div className="flex flex-col gap-0.5">
                                    {influencer.contact.socialHandle && (
                                        <span className="text-xs font-mono">{influencer.contact.socialHandle}</span>
                                    )}
                                    {influencer.contact.email && (
                                        <span className="text-[10px] text-muted-foreground">{influencer.contact.email}</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => onEdit(influencer)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete(influencer.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
