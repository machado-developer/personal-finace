"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalTitle } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const initialExpenses = [
  { id: 1, category: "Aluguel", description: "Aluguel", amount: "R$ 1.200,00", date: "01/02/2025" },
  { id: 2, category: "Supermercado", description: "Supermercado", amount: "R$ 350,00", date: "05/02/2025" },
  { id: 3, category: "Internet", description: "Internet", amount: "R$ 150,00", date: "10/02/2025" },
];

const categories = ["Aluguel", "Supermercado", "Internet", "Transporte", "Lazer"];

const ExpensesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [form, setForm] = useState({ category: "", description: "", amount: "", date: "" });
  const [loading, setLoading] = useState(false);
  interface Expense {
    id: number;
    category: string;
    description: string;
    amount: string;
    date: string;
  }

  const expenseSchema = z.object({
    description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
    amount: z.number().positive("O valor deve ser positivo"),
    date: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(expenseSchema),
  });

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setForm(expense);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  interface ExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
  }




  interface FormData {
    description: string;
    amount: number;
    date: string;
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Despesa cadastrada com sucesso!");

    } catch (error) {
      alert("Erro ao cadastrar despesa");
    } finally {
      setLoading(false);
    }

    return (
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Despesas</h1>
          <div className="space-x-4">
            <Button
              onClick={() => { setEditingExpense(null); setIsDialogOpen(true); }}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white"
            >
              <Plus className="bg-gradient-to-r from-green-500 to-green-700 text-white" /> Adicionar Despesa
            </Button>
            <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Descrição</TableHeader>
              <TableHeader>Valor</TableHeader>
              <TableHeader>Data</TableHeader>
              <TableHeader>Ações</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                    onClick={() => handleEdit(expense)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Modal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-4 space-y-4">
              <ModalTitle>{editingExpense ? "Editar Despesa" : "Adicionar Despesa"}</ModalTitle>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descrição"
              />
              <Input
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Valor"
              />
              <Input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Data"
                type="date"
              />
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsDialogOpen(false)} variant="outline">Cancelar</Button>
                <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600">
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}
export default ExpensesPage;

