import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Simulação de banco de dados em memória
const tempCodes = new Map(); // { email: { code, expiresAt } }

export async function sendCode(req: NextRequest) {
    const { email } = await req.json();

    // Verifica se o e-mail está registrado
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "Se o email estiver cadastrado, enviaremos um código" }, { status: 200 });

    // Gera código de 5 dígitos
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    tempCodes.set(email, { code, expiresAt: Date.now() + 60 * 1000 });

    console.log(`Código enviado para ${email}: ${code}`); // Simula envio de email

    return NextResponse.json({ message: "Código enviado com sucesso" });
}

// Verificação do código
export async function POST(req: NextRequest) {
    const { email, code } = await req.json();
    const stored = tempCodes.get(email);

    if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
        return NextResponse.json({ message: "Código inválido ou expirado" }, { status: 400 });
    }

    tempCodes.delete(email);
    return NextResponse.json({ message: "Código verificado" });
}

// Reset da senha
export async function resetPassword(req: NextRequest) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });

    return NextResponse.json({ message: "Senha alterada com sucesso" });
}
