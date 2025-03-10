import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("DATDOS »", body);
    const data = goalSchema.parse(body);


    const goal = await prisma.goal.create({
      data: {
        ...data,
        deadline: new Date(data.deadline),
        userId: session.user.id,
      },
    });

    await prisma.log.create({
      data: {
        action: "Nova meta criada",
        details: `Created financial goal: id: ${goal.id},\n ${data.name}`,
        userId: session.user.id,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Error details:", {
        message: (error as any).message,
        stack: (error as any).stack,
        name: (error as any).name,
        ...(error as any),
      });
      
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }
    console.error("Error details:", {
      message: (error as any).message,
      stack: (error as any).stack,
      name: (error as any).name,
      ...(error as any),
    });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Obter todas as metas do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
