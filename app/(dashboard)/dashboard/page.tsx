"use client"
import TransactionDialog from "@/components/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, formatHour } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
      const response = await fetch("/api/transations");
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatorio Financeiro", 14, 10);
    autoTable(doc, {
      head: [["Tipo", "Montante", "Descrição", "Data", "Hora"]],
      body: transactions.map(trans => [
        trans.type,
        trans.amount,
        trans.description,
        formatDate(new Date(trans.date)),
        formatHour(new Date(trans.date))
      ])
    });
    doc.save("relatorio.pdf");
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
            <Button variant="outline" onClick={exportToPDF}>
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-md border-1 border-1 shadow-sm border border-gray-200 bg-green-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-800" >Saldo</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.balance)}</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-1 border-1 shadow-sm border border-gray-200 bg-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-800" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalIncome)}</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-1 border-1 shadow-sm border border-gray-200 bg-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 ">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-900" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{formatCurrency(stats.totalExpenses)}</div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-1 shadow-sm border border-gray-200 bg-yellow-500">
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
        <Card className="shadow-md mt-12 border-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(new Date(transaction.date))}</TableCell>
                  <TableCell>{formatHour(new Date(transaction.date))}</TableCell>
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
                      transaction.type === 'DESPESA' ? "bg-red-200 text-red-700 px-2 py-1 rounded-md" : "bg-green-200 text-green-700 px-2 py-1 rounded-md"
                    }

                    >
                      {transaction.type === "RECEITA" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
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
        isEditing={false}
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
