import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user?.id) {
      return NextResponse.json(
        { message: "Nao autorizado" },
        { status: 401 }
      );
    }

    const logs = await prisma.log.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Descricao do erro:", {
      message: (error as any).message,
      stack: (error as any).stack,
      name: (error as any).name,
      ...(error as any),
    });

    return NextResponse.json(
      { message: "Erro Interno" },
      { status: 500 }
    );
  }
}
