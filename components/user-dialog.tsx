"use client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    role: z.enum(["ADMIN", "USER"]),
});

type UserForm = z.infer<typeof userSchema>;

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    isEditing?: boolean;
    user?: {
        id?: string;
        name: string;
        email: string;
        password?: string;
        role: "ADMIN" | "USER";
    };
}

export default function UserDialog({
    open,
    onOpenChange,
    onSuccess,
    isEditing = false,
    user,
}: UserDialogProps) {
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        control,
    } = useForm<UserForm>({
        resolver: zodResolver(userSchema),
        defaultValues: user || {
            name: "",
            email: "",
            password: "",
            role: "USER",
        },
    });

    const selectedRole = useWatch({ control, name: "role" });

    useEffect(() => {
        if (isEditing && user) {
            reset({ ...user, password: "" });
        } else {
            reset({ name: "", email: "", password: "", role: "USER" });
        }
    }, [isEditing, user, reset]);

    const onSubmit = async (data: UserForm) => {
        try {
            console.log("FORMULARIO", data);
            const response = await fetch(
                isEditing ? `/api/users/${data.id}` : "/api/auth/register",
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                const errorData = await response.json(); // Captura o erro do backend
                throw new Error(errorData.message || "Ocorreu um erro desconhecido");
            }

            reset();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ocorreu um erro");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Usuário" : "Adicionar Usuário"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                   <input 
autoComplete="new-password"
                        placeholder="Nome"
                        {...register("name")}
                        className={errors.name ? "border-destructive" : ""}
                    />
                   <input 
autoComplete="new-password"
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className={errors.email ? "border-destructive" : ""}
                    />
                   <input 
autoComplete="new-password"
                        type="password"
                        placeholder="Senha"
                        {...register("password")}
                        className={errors.password ? "border-destructive" : ""}
                    />
                    <Select
                        value={selectedRole}
                        onValueChange={(value) => setValue("role", value as "ADMIN" | "USER")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o papel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="USER">Usuário</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit" className="w-full bg-green-600 text-white" disabled={isSubmitting}>
                        {isSubmitting
                            ? isEditing
                                ? "Atualizando..."
                                : "Adicionando..."
                            : isEditing
                                ? "Atualizar Usuário"
                                : "Adicionar Usuário"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
