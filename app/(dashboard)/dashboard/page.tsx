"use client"
import TransactionDialog from "@/components/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Download, Plus, Target, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<{ date: string; type: string; amount: number; description: string }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentGoals: [],
    categoryBreakdown: [],
  });

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const exportData = () => {
    const csv = transactions
      .map((t) => `${t.date},${t.type},${t.amount},${t.description}`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <Button className="bg-gradient-to-r from-green-500 to-green-700 text-white" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Transação
            </Button>
            <Button variant="outline" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button variant="outline" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-md border-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentGoals.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Transações Recentes */}
        <Card className="shadow-md border-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          fetchTransactions();
          fetchStats();
        }}
      />
    </>
  );
};

export default DashboardPage;
