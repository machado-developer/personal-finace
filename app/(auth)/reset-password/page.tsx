"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HeaderNonAuth from "@/components/header-non-auth";
import Loading from "./loading-password";

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");


    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true); // Para verificar o token antes de mostrar a tela

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (!token && !email) {
            router.push("/recovery-password");
        } else {
            validateToken();
        }
    }, [token, email]);

    const validateToken = async () => {
        try {
            const response = await fetch("/api/recovery/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email }),
            });

            if (response.status !== 200) {
                router.push("/recovery-password");
            } else {
                setLoading(false);
            }
        } catch {
            router.push("/recovery-password");
        }
    };

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            const response = await fetch("/api/recovery/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, password: data.password }),
            });

            if (!response.ok) {
                throw new Error("Erro ao redefinir a senha");
            }

            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch (err) {
            setError("Não foi possível redefinir a senha. Tente novamente.");
        }
    };

    if (loading) {
        return (
            <Loading></Loading>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-600 to-green-800 text-white py-40">
            <HeaderNonAuth />
            <Card className="w-[25rem]">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Redefinir Senha</h2>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert variant="default">
                                <AlertDescription>Senha redefinida com sucesso!</AlertDescription>
                            </Alert>
                        )}
                        <div>
                            <Input
                                type="password"
                                placeholder="Nova senha"
                                {...register("password")}
                                className={errors.password ? "border-destructive" : ""}
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                        </div>
                        <div>
                            <Input
                                type="password"
                                placeholder="Confirmar senha"
                                {...register("confirmPassword")}
                                className={errors.confirmPassword ? "border-destructive" : ""}
                            />
                            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full bg-green-600 text-white" disabled={isSubmitting}>
                            {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
