"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import BudgetDialog from "@/components/budget-dialog"

export default function BudgetsPage() {
  const { data: session } = useSession()
  const [budgets, setBudgets] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets")
      const data = await response.json()
      setBudgets(data.budgets)
    } catch (error) {
      console.error("Error fetching budgets:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {budgets.map((budget) => (
          <Card key={budget.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{budget.name}</span>
                <span>{formatCurrency(budget.amount)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent: {formatCurrency(budget.spent)}</span>
                  <span>Remaining: {formatCurrency(budget.remaining)}</span>
                </div>
                <Progress
                  value={(budget.spent / budget.amount) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {new Date(budget.startDate).toLocaleDateString()} -{" "}
                  {new Date(budget.endDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BudgetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchBudgets}
      />
    </div>
  )
}