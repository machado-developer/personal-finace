import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Atualizar uma meta financeira
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
        }

        const { id, ...updates } = await req.json();
        const updatedGoal = await prisma.goal.update({
            where: { id,   },
            data: updates,
        });

        await prisma.log.create({
            data: {
                action: "meta atualizada",
                details: `Updated financial goal: ${updatedGoal.name}`,
                userId: session?.user?.id,
            },
        });
        

        //registrando a nova transacao com os dados da meta actual
       
        return NextResponse.json(updatedGoal);
    } catch (error) {
        return NextResponse.json({ message: "Erro interno" }, { status: 500 });
    }
}

// Excluir uma meta financeira
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
        }

        const { id } = await req.json();
        await prisma.goal.delete({
            where: { id, userId: session?.user?.id },
        });

        await prisma.log.create({
            data: {
                action: "Meta excluída",
                details: `Deleted financial goal with ID: ${id}`,
                userId: session?.user?.id,
            },
        });

        return NextResponse.json({ message: "Goal deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Erro interno" }, { status: 500 });
    }
}
