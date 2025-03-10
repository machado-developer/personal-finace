import { PrismaClient, TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [transactions, goals, categories] = await Promise.all([
      prisma.transaction.findMany({
        include: {
          category: true,
        },
      }),
      prisma.goal.findMany({
        where: {
          deadline: {
            gte: new Date(),
          },
        },
        orderBy: {
          deadline: "asc",
        },
        take: 5,
      }),
      prisma.category.findMany({
        include: {
          transactions: {
            where: {
              type: TransactionType.DESPESA,
            },
          },
        },
      }),
    ]);

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.RECEITA)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === TransactionType.DESPESA)
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = categories
      .map((category) => ({
        name: category.name,
        value: category.transactions.reduce((sum, t) => sum + t.amount, 0),
      }))
      .filter((c) => c.value > 0);

    // Formatação dos dados para os gráficos
    const barChartData = [
      { name: "Metas", value: goals.length },
      { name: "Orçamentos", value: totalExpenses },
    ];

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      recentGoals: goals,
      categoryBreakdown,
      barChartData, // Dados formatados para o Recharts
    });
  } catch (error) {
    console.log("ERRO", JSON.stringify(error));

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
