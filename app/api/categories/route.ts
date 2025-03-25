import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import logAction from "@/services/auditService"
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  type: z.enum(["RECEITA", "DESPESA"]),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }


    const categories = await prisma.category.findMany({
      where: {
        createdById: session?.user?.id,
      },
      orderBy: {
        name: "asc",
      },
    });


    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error details:", {
      message: (error as any).message,
      stack: (error as any).stack,
      name: (error as any).name,
      ...(error as any),
    });

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const data = categorySchema.parse(body)
    const userId = session?.user?.id;
    const category = await prisma.category.create({
      data: {
        ...data,

        createdBy: {
          connect: {
            id: session.user?.id,
            email: session.user?.email?.toString(),
          },
        },
      },
    })
    // Registrar log no backend
    await logAction(userId, "Nova Categoria", `nome: ${category.name}, Tipo: ${category.type}`);
    return NextResponse.json(category, { status: 201 })
  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      )
    }
    console.log("Error details:", {
      message: (error as any).message,
      stack: (error as any).stack,
      name: (error as any).name,
      ...(error as any),
    });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
