import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const [transactions, goals, categories] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          category: true,
        },
      }),
      prisma.goal.findMany({
        where: {
          userId: session.user.id,
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
        where: {
          transactions: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          transactions: {
            where: {
              userId: session.user.id,
              type: "EXPENSE",
            },
          },
        },
      }),
    ])

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0)

    const categoryBreakdown = categories
      .map((category) => ({
        name: category.name,
        value: category.transactions.reduce((sum, t) => sum + t.amount, 0),
      }))
      .filter((c) => c.value > 0)

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      recentGoals: goals,
      categoryBreakdown,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}