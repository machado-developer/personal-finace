import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";
import { PrismaClient, TransactionType } from "@prisma/client";
import logAction from "@/services/auditService";

const prisma = new PrismaClient()

const transactionSchema = z.object({
    amount: z.number().positive(),
    type: z.nativeEnum(TransactionType),
    description: z.string().min(1),
    categoryId: z.string(),
    userId: z.string().optional(),
    date: z.string().optional(),
})
export async function DELETE(req: Request, { params: { id } }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }


        if (!id) {
            return NextResponse.json({ error: "ID da categoria é obrigatório" }, { status: 400 });
        }

        await prisma.transaction.delete({
            where: {
                id,
                userId: session.user.id,
            },
        })
        await logAction(session.user.id, "Exclusão de Transação", `ID: ${id}`);

        return NextResponse.json({ message: "Transaction deleted" }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const { id, ...data } = await req.json()
        transactionSchema.parse(data)

        const updatedTransaction = await prisma.transaction.update({
            where: {
                id,
                userId: session.user.id,
            },
            data,
        })
        await logAction(session.user.id, "Atualização de Transação", `Descrição: ${updatedTransaction.description}, Tipo: ${updatedTransaction.type}, Quantia: ${updatedTransaction.amount}`);

        return NextResponse.json(updatedTransaction, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid input data" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}