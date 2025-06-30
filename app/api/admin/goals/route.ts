import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
 
import { z } from "zod";
import logAction from "@/services/auditService";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

const goalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  savedAmount: z.number().min(0),
  deadline: z.string(),
  categoryId: z.string(),
});

// Criar uma meta financeira
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
    }

    const body = await req.json();
    
    const data = goalSchema.parse(body);


    const goal = await prisma.goal.create({
      data: {
        ...data,
        deadline: new Date(data.deadline),
        userId: session?.user?.id,

      },
    });

    await prisma.log.create({
      data: {
        action: "Nova meta criada",
        details: `Created financial goal: id: ${goal.id},\n ${data.name}`,
        userId: session?.user?.id,
      },
    });

    const userId = session?.user?.id;
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    if (data.savedAmount) {

      const transaction = await prisma.transaction.create({
        data: {
          description: `Valor movimentado referente a meta financeira ${goal?.name}`,
          categoryId: goal?.categoryId ?? "",
          amount: goal.savedAmount.toNumber(),
          type: category?.type,  // Ensure type is TransactionType
          userId: session?.user?.id,
          date: new Date(),
        },
      })
      await logAction(userId, "Nova Transação", `Descrição: ${transaction.description}, Tipo: ${transaction.type}, Quantia: ${transaction.amount}`);

    }


    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Descrição do erro:", {
        message: (error as any).message,
        stack: (error as any).stack,
        name: (error as any).name,
        ...(error as any),
      });

      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }
    console.error("Descrição do erro:", {
      message: (error as any).message,
      stack: (error as any).stack,
      name: (error as any).name,
      ...(error as any),
    });
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}

// Obter todas as metas do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
       
      orderBy: { deadline: "asc" },
      include:{
        user:true
      }
    });

    return NextResponse.json({ goals });
  } catch (error) {
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
