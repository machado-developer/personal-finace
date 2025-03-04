"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash } from "lucide-react";
import BudgetDialog from "@/components/budget-dialog";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState<{
    id: string;
    amount: string;
    type: string;
    date: string;
    category: string;
    description: string;
  }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      const data = await response.json();
      setBudgets(data.budgets);
    } catch (error) {
      console.error("Erro ao buscar orçamentos:", error);
    }
  };

  const handleEdit = (budget: any) => {
    setSelectedBudget(budget);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      fetchBudgets();
    } catch (error) {
      console.error("Erro ao deletar orçamento:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Button className="bg-gradient-to-r from-green-500 to-green-700 text-white" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
        </Button>
      </div>

      <Card className="shadow-md border-1">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Lista de Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget, index) => (
                <TableRow key={index}>
                  <TableCell>{budget.amount}</TableCell>
                  <TableCell>{budget.type}</TableCell>
                  <TableCell>{budget.category}</TableCell>
                  <TableCell>{budget.description}</TableCell>
                  <TableCell>{budget.date}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => handleEdit(budget)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(budget.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BudgetDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={fetchBudgets} />
      {selectedBudget && (
        <BudgetDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} onSuccess={fetchBudgets} budget= {selectedBudget} />
      )}
    </div>
  );
};

export default BudgetPage;
