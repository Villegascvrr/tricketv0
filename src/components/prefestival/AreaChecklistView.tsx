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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    MoreVertical,
    Plus,
    Calendar,
    User,
    Trash2,
    Edit
} from "lucide-react";
import {
    PreFestivalTask,
    TaskStatus,
    statusLabels,
    priorityLabels
} from "@/data/preFestivalMockData";
import { cn } from "@/lib/utils";

interface AreaChecklistViewProps {
    tasks: PreFestivalTask[];
    areaId: string;
    onOpenTask: (task: PreFestivalTask) => void;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
    onCreateTask: () => void;
}

export function AreaChecklistView({
    tasks,
    areaId,
    onOpenTask,
    onStatusChange,
    onDeleteTask,
    onCreateTask
}: AreaChecklistViewProps) {

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case 'completado': return <CheckCircle2 className="h-4 w-4 text-success" />;
            case 'pendiente': return <Clock className="h-4 w-4 text-primary" />;
            case 'solicitado': return <AlertCircle className="h-4 w-4 text-warning" />;
            default: return <Clock className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'alta': return 'text-destructive bg-destructive/10 border-destructive/20';
            case 'media': return 'text-warning bg-warning/10 border-warning/20';
            default: return 'text-muted-foreground bg-muted border-muted-foreground/20';
        }
    };

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex justify-end">
                <Button onClick={onCreateTask} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Tarea en {areaId.charAt(0).toUpperCase() + areaId.slice(1)}
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Estado</TableHead>
                            <TableHead>Tarea</TableHead>
                            <TableHead className="w-[150px]">Responsable</TableHead>
                            <TableHead className="w-[100px]">Prioridad</TableHead>
                            <TableHead className="w-[120px]">Fecha Límite</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No hay tareas en esta área.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => {
                                const isOverdue = isPast(new Date(task.due_date)) && task.status !== 'hecha';

                                return (
                                    <TableRow key={task.id} className="group hover:bg-muted/50">
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent">
                                                        {getStatusIcon(task.status)}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem
                                                        onClick={() => onStatusChange(task.id, 'solicitado')}
                                                        className="gap-2"
                                                    >
                                                        {getStatusIcon('solicitado')}
                                                        Solicitado
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onStatusChange(task.id, 'pendiente')}
                                                        className="gap-2"
                                                    >
                                                        {getStatusIcon('pendiente')}
                                                        Pendiente
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onStatusChange(task.id, 'completado')}
                                                        className="gap-2"
                                                    >
                                                        {getStatusIcon('completado')}
                                                        Completado
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className="font-medium cursor-pointer hover:underline"
                                                onClick={() => onOpenTask(task)}
                                            >
                                                {task.title}
                                            </div>
                                            <div className="flex gap-2 mt-1">
                                                {task.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                        {task.assignee_name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs truncate max-w-[100px]" title={task.assignee_name}>
                                                    {task.assignee_name.split(' ')[0]}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("text-[10px] font-normal", getPriorityColor(task.priority))}>
                                                {priorityLabels[task.priority]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className={cn(
                                                "flex items-center gap-1.5 text-xs",
                                                isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                                            )}>
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{format(new Date(task.due_date), "d MMM", { locale: es })}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => onOpenTask(task)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onDeleteTask(task.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
