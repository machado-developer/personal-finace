import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import logAction from "@/services/auditService";
import { authOptions } from "@/lib/auth";
 

const prisma = new PrismaClient();

const categorySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    type: z.enum(["RECEITA", "DESPESA"]),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const data = categorySchema.parse(body);

        const id = (await params).id; // Await the params promise to get the id

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                type: data.type,
            },
        });
        await logAction(session?.user?.id, "Actualização de Categoria", `Name: ${data.name}, Type: ${data.type}`);

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid input data" },
                { status: 400 }
            );
        }
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const id = (await params).id; // Await the params promise to get the id

        await prisma.category.delete({
            where: { id },
        });
        await logAction(session?.user?.id, "Eliminação de Categoria", `ID: ${id}`);

        return NextResponse.json({ message: "Category deleted" }, { status: 200 });
    } catch (error) {
        console.log("Error details:", {
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