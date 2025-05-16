import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Atualizar uma meta financeira
export async function PUT(req: Request, { params }:  { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    const id = (await params).id; // Await the params promise to get the id

    const updates = await req.json();
updates.deadline = new Date(updates.deadline)
    const updatedGoal = await prisma.goal.update({
      where: { id, userId },
      data: updates,
    });

    await prisma.log.create({
      data: {
        action: "GOAL_UPDATED",
        details: `Meta atualizada: ${updatedGoal.name}`,
        userId,
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("Erro ao atualizar meta:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}

// Excluir uma meta financeira
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }
    
    const id = (await params).id; // Await the params promise to get the id

    await prisma.goal.delete({
      where: { id, userId },
    });

    await prisma.log.create({
      data: {
        action: "GOAL_DELETED",
        details: `Meta excluída com ID: ${id}`,
        userId,
      },
    });

    return NextResponse.json({ message: "Meta excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir meta:", error);
    return NextResponse.json({ message: "Erro interno no servidor" }, { status: 500 });
  }
}
