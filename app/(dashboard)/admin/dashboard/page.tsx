"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { ArrowDownCircle, ArrowUpCircle, BarChart2, CreditCard, DollarSign, Users } from "lucide-react";
import { formatCurrency, formatDate, formatHour } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface Stats {
  totalUsers: number;
  totalRevenue: number;
  totalExpenses: number;
  totalTransactions: number;
  totalGoals: number;
  totalBudgets: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    totalTransactions: 0,
    totalGoals: 0,
    totalBudgets: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchTransationRecents = async () => {
    try {
      const response = await fetch("/api/admin/transations/recents");
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }


  }
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats-admin");
      const data = await response.json();

      setStats({
        totalUsers: data.totalUsers,
        totalRevenue: data.totalIncome,
        totalExpenses: data.totalExpenses,
        totalTransactions: data.totalTransactions,
        totalGoals: data.activeGoals,
        totalBudgets: data.categoryBreakdown.length,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTransationRecents();
  }, []);

  if (loading) {
    return <p className="text-center">Carregando dados...</p>;
  }

  const pieData = [
    { name: "Receitas", value: stats.totalRevenue },
    { name: "Despesas", value: stats.totalExpenses },
  ];
  const COLORS = ["#22C55E", "#FFA500"];

  const barData = [
    { name: "Metas", value: stats.totalGoals, color: "#4caf50" },
    { name: "Investimentos", value: stats.totalBudgets, color: "#ff6b6b" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel Administrativo</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {[{ title: "Usuários Registrados", bg: "border-gray-200 bg-white", value: stats.totalUsers, Icon: Users, color: "text-blue-500  " },
        { title: "Receitas Totais", bg: "border-gray-200 bg-white", value: formatCurrency(stats.totalRevenue), Icon: DollarSign, color: "text-green-500 " },
        { title: "Despesas Totais",bg:"border-gray-200 bg-white", value: formatCurrency(stats.totalExpenses), Icon: CreditCard, color: "text-red-500" },
        { title: "Transações Totais", bg: "border-gray-200 bg-white", value: stats.totalTransactions, Icon: BarChart2, color: "text-yellow-500" },
        ].map(({ title, value, Icon, color, bg }, index) => (
          <Card key={index} className={`shadow-lg border border-gray-200 ${bg}`}>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className={`h-6 w-6 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Tabela - 67% do espaço */}
        <Card className="w-[67%]   shadow-md border-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Transacções recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(new Date(transaction.date))}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {transaction.type === "RECEITA" ? (
                        <ArrowUpCircle className="text-green-500 w-5 h-5" />
                      ) : (
                        <ArrowDownCircle className="text-red-500 w-5 h-5" />
                      )}
                      {transaction.type}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          transaction.type === "DESPESA"
                            ? "bg-red-200 text-red-700 px-2 py-1 rounded-md"
                            : "bg-green-200 text-green-700 px-2 py-1 rounded-md"
                        }
                      >
                        {transaction.type === "RECEITA" ? "+" : "-"}{" "}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Gráficos - 33% do espaço */}
        <div className="w-[33%] flex flex-col gap-4">
          {/* PieChart */}
          <Card className="shadow-md border-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Distribuição de Receitas e Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    label
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>


        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
