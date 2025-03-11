"use client";

import HeaderNonAuth from '@/components/header-non-auth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
    email: z.string().email("Digite um email válido")
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    

    const onSubmit = async (data: ForgotPasswordForm) => {
        setMessage("");
        setError("");
        try {
            const response = await fetch("/api/recovery/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Erro ao solicitar recuperação");
            
            setMessage("Se o email estiver cadastrado, enviaremos um código de verificação");
            setTimeout(() => {
                router.push(`/verify-code?email=${data.email}`); // Correção aqui
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <HeaderNonAuth />
            <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-40 min-h-screen">
                <div className="container mx-auto px-4 flex justify-center">
                    <Card className="w-[25rem] min-h-[200px]">
                        <CardHeader className="space-y-1 text-center">
                            <motion.h1
                                className="text-2xl font-bold"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                Recuperar Senha
                            </motion.h1>
                            <motion.p
                                className="text-sm text-muted-foreground"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Insira seu email para receber um código de verificação
                            </motion.p>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
                            <CardContent className="space-y-4 flex-grow">
                                {message && <Alert variant="default"><AlertDescription>{message}</AlertDescription></Alert>}
                                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                                <div className="space-y-1">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        {...register("email")}
                                        className={errors.email ? "border-destructive" : ""}
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-800" disabled={isSubmitting}>
                                    {isSubmitting ? "Enviando..." : "Enviar Código"}
                                </Button>
                            </CardContent>
                        </form>
                    </Card>
                </div>
            </section>
        </div>
    );
}