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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChevronRight,
    ArrowLeft,
    Plane,
    Hotel,
    Car,
    Music,
    Utensils,
    Clock,
    AlertCircle,
    CheckCircle2,
    CalendarClock,
    Mic2,
    Plus,
    MessageSquare
} from "lucide-react";

import { NotesSheet } from "../common/NotesSheet";

import {
    Artist,
    mockArtists,
    LogisticsStatus
} from "@/data/artistMockData";
import { cn } from "@/lib/utils";
import { useFestivalConfig } from "@/hooks/useFestivalConfig";

interface ArtistManagerProps {
    onCreateTask?: () => void;
}

export function ArtistManager({ onCreateTask }: ArtistManagerProps) {
    const { isDemo } = useFestivalConfig();
    const [artists, setArtists] = useState<Artist[]>(isDemo ? mockArtists : []);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [notesOpen, setNotesOpen] = useState(false);

    // Calculate dynamic pending items
    const getPendingCount = (artist: Artist) => {
        let count = 0;
        // Check logistics
        artist.logistics.hotels.forEach(h => { if (h.status === 'pending' || h.status === 'issue') count++; });
        artist.logistics.flights.forEach(f => { if (f.status === 'pending' || f.status === 'issue') count++; });
        artist.logistics.transports.forEach(t => { if (t.status === 'pending' || t.status === 'issue') count++; });

        // Check Rider
        if (artist.rider.status !== 'approved') count++;

        return count;
    };

    const getStatusVariant = (status: LogisticsStatus) => {
        switch (status) {
            case 'confirmed': return 'default';
            case 'booked': return 'secondary';
            case 'issue': return 'destructive';
            default: return 'outline';
        }
    };

    const getStatusLabel = (status: LogisticsStatus) => {
        switch (status) {
            case 'confirmed': return 'Confirmado';
            case 'booked': return 'Reservado';
            case 'issue': return 'Problema';
            case 'pending': return 'Pendiente';
            default: return status;
        }
    };

    if (selectedArtist) {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Header Navbar */}
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedArtist(null)} className="h-8 gap-1 pl-1">
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold leading-none">{selectedArtist.name}</h2>
                        <span className="text-xs text-muted-foreground">{selectedArtist.genre} • {selectedArtist.stage}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setNotesOpen(true)} className="gap-2 h-8">
                            <MessageSquare className="h-4 w-4" />
                            Notas
                        </Button>
                        <Badge variant="outline" className="gap-1 h-8">
                            <Clock className="h-3 w-3" />
                            {format(new Date(selectedArtist.performanceTime), "HH:mm", { locale: es })}
                        </Badge>
                    </div>
                </div>

                <NotesSheet
                    open={notesOpen}
                    onOpenChange={setNotesOpen}
                    entityId={selectedArtist.id}
                    entityType="artist"
                    entityName={selectedArtist.name}
                />

                <Tabs defaultValue="logistics" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="logistics">Logística & Viajes</TabsTrigger>
                        <TabsTrigger value="hospitality">Rider & Hospitality</TabsTrigger>
                        <TabsTrigger value="schedule">Horarios</TabsTrigger>
                    </TabsList>

                    {/* LOGISTICS TAB */}
                    <TabsContent value="logistics" className="space-y-4">
                        {/* Hotels Section */}
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <Hotel className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-mark rounded uppercase tracking-wide">Hotel</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-3">
                                {selectedArtist.logistics.hotels.length > 0 ? (
                                    selectedArtist.logistics.hotels.map(hotel => (
                                        <div key={hotel.id} className="border rounded-md p-3 text-sm flex justify-between items-start bg-card/50">
                                            <div>
                                                <div className="font-semibold">{hotel.hotelName}</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {hotel.rooms} hab. {hotel.roomType} • {format(new Date(hotel.checkIn), "d MMM", { locale: es })} - {format(new Date(hotel.checkOut), "d MMM", { locale: es })}
                                                </div>
                                            </div>
                                            <Badge variant={getStatusVariant(hotel.status)} className="text-[10px]">
                                                {getStatusLabel(hotel.status)}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-xs text-muted-foreground bg-muted/20 rounded border border-dashed">
                                        No hay hoteles asignados
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Flights Section */}
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <Plane className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-medium uppercase tracking-wide">Vuelos</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-3">
                                {selectedArtist.logistics.flights.length > 0 ? (
                                    selectedArtist.logistics.flights.map(flight => (
                                        <div key={flight.id} className="border rounded-md p-3 text-sm flex justify-between items-start bg-card/50">
                                            <div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    {flight.airline} <span className="text-muted-foreground font-normal">• {flight.flightNumber}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                    <span>{flight.departure}</span>
                                                    <span className="text-muted-foreground/50">→</span>
                                                    <span>{flight.arrival}</span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground mt-1">
                                                    {flight.passengerCount} pasajeros
                                                </div>
                                            </div>
                                            <Badge variant={getStatusVariant(flight.status)} className="text-[10px]">
                                                {getStatusLabel(flight.status)}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-xs text-muted-foreground bg-muted/20 rounded border border-dashed">
                                        No hay vuelos asignados
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Transport Section */}
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-medium uppercase tracking-wide">Transporte Interno</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-3">
                                {selectedArtist.logistics.transports.length > 0 ? (
                                    selectedArtist.logistics.transports.map(trans => (
                                        <div key={trans.id} className="border rounded-md p-3 text-sm flex justify-between items-start bg-card/50">
                                            <div className="w-full">
                                                <div className="flex justify-between w-full mb-1">
                                                    <span className="font-semibold capitalize">{trans.type}</span>
                                                    <span className="text-xs font-mono bg-muted px-1 rounded">{trans.pickUpTime}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {trans.pickUpLocation} → {trans.dropOffLocation}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-xs text-muted-foreground bg-muted/20 rounded border border-dashed">
                                        No hay transporte asignado
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* HOSPITALITY TAB */}
                    <TabsContent value="hospitality" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="pb-2 pt-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <Utensils className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-sm font-medium uppercase tracking-wide">Catering & Camerino</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="space-y-2">
                                        {selectedArtist.rider.catering.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-2 p-1.5 hover:bg-muted/50 rounded transition-colors">
                                                <Checkbox checked={item.status} className="mt-0.5" />
                                                <div className="grid gap-0.5">
                                                    <span className={cn("text-sm leading-none", item.status && "line-through text-muted-foreground")}>{item.item}</span>
                                                    {item.notes && <span className="text-[11px] text-muted-foreground italic">{item.notes}</span>}
                                                </div>
                                            </div>
                                        ))}
                                        {selectedArtist.rider.catering.length === 0 && (
                                            <p className="text-xs text-muted-foreground italic">No hay requerimientos de catering.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2 pt-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <Mic2 className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-sm font-medium uppercase tracking-wide">Rider Técnico</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="space-y-3">
                                        {selectedArtist.rider.technicalAttributes.map((attr, idx) => (
                                            <div key={idx} className="flex justify-between text-sm border-b pb-1 last:border-0 last:pb-0">
                                                <span className="text-muted-foreground">{attr.label}</span>
                                                <span className="font-medium text-right">{attr.value}</span>
                                            </div>
                                        ))}
                                        {selectedArtist.rider.technicalAttributes.length === 0 && (
                                            <p className="text-xs text-muted-foreground italic">Rider técnico no definido.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* SCHEDULE TAB */}
                    <TabsContent value="schedule">
                        <Card>
                            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-sm font-medium uppercase tracking-wide">Itinerario del Artista</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <div className="relative pl-4 border-l border-muted space-y-6 my-2">
                                    {selectedArtist.schedule.map((item) => (
                                        <div key={item.id} className="relative">
                                            <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary ring-offset-background" />
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-semibold text-primary">{item.time}</span>
                                                <span className="text-sm font-medium leading-none">{item.activity}</span>
                                                <span className="text-xs text-muted-foreground">{item.location}</span>
                                                {item.remindMe && (
                                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Recordatorio auto.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        );
    }

    // MAIN LIST COMPONENT
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-end">
                <Button size="sm" className="gap-2" onClick={onCreateTask}>
                    <Plus className="h-4 w-4" />
                    Nueva Tarea de Artista
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Estado</TableHead>
                            <TableHead>Artista</TableHead>
                            <TableHead className="hidden md:table-cell">Escenario</TableHead>
                            <TableHead className="text-center w-[120px]">Pendientes</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {artists.map((artist) => (
                            <TableRow
                                key={artist.id}
                                className="group cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => setSelectedArtist(artist)}
                            >
                                <TableCell>
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                                        artist.overallStatus === 'ok' ? "bg-green-100/50 text-green-700 border-green-200" :
                                            artist.overallStatus === 'warning' ? "bg-amber-100/50 text-amber-700 border-amber-200" :
                                                "bg-red-100/50 text-red-700 border-red-200"
                                    )}>
                                        <div className={cn("h-1.5 w-1.5 rounded-full bg-current")} />
                                        {artist.overallStatus === 'ok' ? 'OK' :
                                            artist.overallStatus === 'warning' ? 'Revisar' : 'Crítico'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-semibold">{artist.name}</div>
                                    <div className="text-xs text-muted-foreground md:hidden">{artist.stage}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                    {artist.stage}
                                </TableCell>
                                <TableCell className="text-center">
                                    {getPendingCount(artist) > 0 ? (
                                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px] w-auto">
                                            {getPendingCount(artist)} alertas
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-green-100 text-green-700 hover:bg-green-100">
                                            Todo Ok
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
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
