import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Influencer, InfluencerCategory, InfluencerPlatform, InfluencerStatus } from "@/data/influencerMockData";
import { teamMembers } from "@/data/preFestivalMockData";

const formSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    primaryPlatform: z.enum(["Instagram", "TikTok", "YouTube", "Otros"] as const),
    category: z.enum(["local", "nacional", "nicho", "lifestyle", "musica", "otros"] as const),
    status: z.enum(["Pendiente", "Activo", "Finalizado"] as const),
    assignedTo: z.string().min(1, "Debes asignar un responsable"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    socialHandle: z.string().min(1, "El handle es obligatorio"),
    notes: z.string().optional(),
});

interface InfluencerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    influencer?: Influencer | null;
    onSave: (data: Partial<Influencer>) => void;
}

export function InfluencerDialog({ open, onOpenChange, influencer, onSave }: InfluencerDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            primaryPlatform: "Instagram",
            category: "nicho",
            status: "Pendiente",
            assignedTo: "",
            email: "",
            phone: "",
            socialHandle: "",
            notes: "",
        },
    });

    useEffect(() => {
        if (influencer) {
            form.reset({
                name: influencer.name,
                primaryPlatform: influencer.primaryPlatform,
                category: influencer.category,
                status: influencer.status,
                assignedTo: influencer.assignedTo,
                email: influencer.contact.email || "",
                phone: influencer.contact.phone || "",
                socialHandle: influencer.contact.socialHandle || "",
                notes: influencer.notes || "",
            });
        } else {
            form.reset({
                name: "",
                primaryPlatform: "Instagram",
                category: "nicho",
                status: "Pendiente",
                assignedTo: "", // Could set default user
                email: "",
                phone: "",
                socialHandle: "",
                notes: "",
            });
        }
    }, [influencer, open, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const influencerData: Partial<Influencer> = {
            name: values.name,
            primaryPlatform: values.primaryPlatform,
            category: values.category,
            status: values.status,
            assignedTo: values.assignedTo,
            notes: values.notes,
            contact: {
                email: values.email || undefined,
                phone: values.phone || undefined,
                socialHandle: values.socialHandle,
            },
        };
        onSave(influencerData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{influencer ? "Editar Influencer" : "Nuevo Influencer"}</DialogTitle>
                    <DialogDescription>
                        {influencer ? "Modifica los datos del influencer." : "Añade un nuevo influencer a la lista."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. Ana García" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="socialHandle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usuario (Handle)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="@usuario" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="primaryPlatform"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plataforma Principal</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona plataforma" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Instagram">Instagram</SelectItem>
                                                <SelectItem value="TikTok">TikTok</SelectItem>
                                                <SelectItem value="YouTube">YouTube</SelectItem>
                                                <SelectItem value="Otros">Otros</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoría</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona categoría" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="local">Local</SelectItem>
                                                <SelectItem value="nacional">Nacional</SelectItem>
                                                <SelectItem value="nicho">Nicho</SelectItem>
                                                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                                                <SelectItem value="musica">Música</SelectItem>
                                                <SelectItem value="otros">Otros</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="assignedTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Responsable Interno</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del responsable" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">Quién gestiona este contacto.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                                <SelectItem value="Activo">Activo</SelectItem>
                                                <SelectItem value="Finalizado">Finalizado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@ejemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+34..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notas adicionales, acuerdos verbales, etc."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
