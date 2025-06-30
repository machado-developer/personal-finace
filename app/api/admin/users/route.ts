import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
"@/lib/auth";

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Nao autorizado" },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        actived: true,
        deletedAt: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno" },
      { status: 500 }
    )
  }
}