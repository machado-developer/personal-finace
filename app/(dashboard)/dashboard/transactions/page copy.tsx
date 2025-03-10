"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowUpCircle, ArrowDownCircle, MoreVertical, Edit, Trash } from "lucide-react";
import TransactionDialog from "@/components/transaction-dialog";
import { formatCurrency, formatDate, formatHour } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  date: string;
  type: "RECEITA" | "DESPESA";
  amount: number;
  description: string;
  category?: {
    id: string;
    name: string;
    type: "RECEITA" | "DESPESA";
  };
}

const TransationPage = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // Captura ?type=despesa ou ?type=receita

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);

  useEffect(() => {
    fetchTransactions();
  }, [type]); // Atualiza sempre que o `type` mudar

  const fetchTransactions = async () => {
    try {
      const query = type ? `?type=${type}` : ""; // Adiciona ?type=despesa se existir
      const response = await fetch(`/api/transactions${query}`);
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  const handleEdit = (transaction: Transaction): void => {
    setSelectedTransaction(transaction);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (transaction: Transaction): Promise<void> => {
    if (window.confirm("Tem certeza que deseja excluir esta transação? Essa ação não pode ser desfeita.")) {
      try {
        await fetch(`/api/transactions/${transaction.id}`, { method: "DELETE" });
        fetchTransactions();
      } catch (error) {
        console.error("Erro ao excluir transação:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transações - {type || "Todas"}</h1>
        <Button className="bg-gradient-to-r from-green-500 to-green-700 text-white" onClick={() => { setIsEditing(false); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nova Transação
        </Button>
      </div>

      <Card className="shadow-md border-1">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Lista de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(new Date(transaction.date))}</TableCell>
                  <TableCell>{formatHour(new Date(transaction.date))}</TableCell>
                  <TableCell>{transaction?.category?.name}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {transaction.type === "RECEITA" ? (
                      <ArrowUpCircle className="text-green-500 w-5 h-5" />
                    ) : (
                      <ArrowDownCircle className="text-red-500 w-5 h-5" />
                    )}
                    {transaction.type}
                  </TableCell>
                  <TableCell>
                    <span className={
                      transaction.type === "DESPESA" ? "bg-red-200 text-red-700 px-2 py-1 rounded-md" : "bg-green-200 text-green-700 px-2 py-1 rounded-md"
                    }>
                      {transaction.type === "RECEITA" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(transaction)}>
                          <Trash className="w-4 h-4 mr-2 text-red-500" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} isEditing={isEditing} transaction={selectedTransaction} onSuccess={fetchTransactions} />
    </div>
  );
};

export default TransationPage;
