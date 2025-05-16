"use client";

import HeaderNonAuth from '@/components/header-non-auth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(""); // Resetar erro antes do envio
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setError("email ou senha incorretos");
      return;
    }

    const sessionResponse = await fetch("/api/auth/session");
    const session = await sessionResponse.json();

    if (session?.user?.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNonAuth />
      {/* Hero Section */}
      <section className="bg-gradient-to-r bg-dark-base text-white py-40 min-h-screen">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <motion.h1
              className="text-2xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Gerencie as suas finanças com facilidade
            </motion.h1>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Controle seus gastos, economize e alcance seus objetivos financeiros com nosso sistema intuitivo.
            </motion.p>
          </div>
          <div className="md:w-1/2 h-full flex items-center">
            <Card className="w-full h-full flex flex-col justify-center w-[25rem] min-h-[500px]">
              <CardHeader className="space-y-1">
                <motion.h1
                  className="text-2xl font-bold tracking-tight text-gradient-to-r from-green-600 to-green-800"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Entrar
                </motion.h1>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Insira suas credenciais para acessar sua conta
                </motion.p>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between">
                <CardContent className="space-y-4 flex-grow">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Senha"
                      {...register("password")}
                      className={errors.password ? "border-destructive" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-900 to-[#091426]" disabled={isSubmitting}>
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Cadastre-se
                    </Link>

                  </p>
                  <br>
                  </br>
                  <p className="text-sm text-center text-muted-foreground">

                    <Link href="/recovery-password" className="text-primary hover:underline">
                      Recuperar a senha?{" "}
                    </Link>

                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
