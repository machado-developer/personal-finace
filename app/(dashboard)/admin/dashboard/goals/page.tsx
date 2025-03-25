"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash, MoreVertical } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import GoalDialog from "@/components/goal-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TransactionGaolDialog from "@/components/transation-goal-dialog"

export default function GoalsPage() {
  useSession()
  const [goals, setGoals] = useState<{ id: string; name: string; savedAmount: number; targetAmount: number; deadline: string; user?: { name: string } }[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/admin/goals")
      const data = await response.json()
      setGoals(data.goals)
    } catch (error) {
      console.error("Error fetching goals:", error)
    }
  }

  const handleEdit = (goal: Goal): void => {
    setSelectedGoal(goal);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  interface Goal {
    user?: {
      name: string
    },
    id?: string;
    name: string;
    savedAmount: number;
    targetAmount: number;
    deadline: string;

  }


  const handleDelete = async (goalId: string) => {
    if (window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      try {
        await fetch(`/api/admin/goals/${goalId}`, { method: "DELETE" })
        fetchGoals()
      } catch (error) {
        console.error("Error deleting goal:", error)
      }
    }
  }

  const filteredGoals = goals.filter((goal) => {
    const progress = (goal.savedAmount / goal.targetAmount) * 100
    const isCompleted = progress >= 100
    const goalDate = new Date(goal.deadline)

    if (startDate && goalDate < new Date(startDate)) return false
    if (endDate && goalDate > new Date(endDate)) return false
    if (statusFilter === "completed" && !isCompleted) return false
    if (statusFilter === "pending" && isCompleted) return false

    return true
  })

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Metas financeiras</h1>
        <Button className="bg-green-600" onClick={() => { setIsDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" /> Criar Meta
        </Button>
      </div>

      <Card className="shadow-md border-1 p-4">
        <div className="flex gap-4 mb-4">
          <Input
            autoComplete="new-password" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
          <Input
            autoComplete="new-password" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="shadow-md border-1">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Lista das Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>saved Amount</TableHead>
                <TableHead>Target Amount</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGoals.map((goal) => {
                const progress = (goal.savedAmount / goal.targetAmount) * 100
                return (
                  <TableRow key={goal.id}>
                    <TableCell>{goal?.user?.name}</TableCell>
                    <TableCell>{goal.name}</TableCell>
                    <TableCell>{formatCurrency(goal.savedAmount)}</TableCell>
                    <TableCell>{formatCurrency(goal.targetAmount)}</TableCell>
                    <TableCell>{new Date(goal.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {progress >= 100 ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Concluído</span>
                      ) : (
                        `${Math.round(progress || 0)}%`
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedGoalId(goal.id);
                              setIsTransactionDialogOpen(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2 text-blue-500" /> Adicionar Transação
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(goal)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(goal.id)}>
                            <Trash className="w-4 h-4 mr-2 text-red-500" /> Delete
                          </DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedGoalId && (
        <TransactionGaolDialog
          open={isTransactionDialogOpen}
          onOpenChange={setIsTransactionDialogOpen}
          goalId={selectedGoalId}
          onSuccess={fetchGoals}
        />
      )}

      <GoalDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} isEditing={isEditing} goal={selectedGoal} onSuccess={fetchGoals} />
    </div>
  )
}
