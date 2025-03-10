"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, DollarSign, CreditCard, BarChart2 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Definição da interface do usuário
interface User {
  id: number;
  name: string;
  email: string;
}

// Definição da interface do log de atividade
interface Log {
  createdAt: string;
  formattedDate: string;
  user?: {
    name: string;
  };
  action: string;
}

// Definição da interface das estatísticas
interface Stats {
  totalUsers: number;
  totalRevenue: number;
  totalExpenses: number;
  totalTransactions: number;
  totalGoals: number;
  totalBudgets: number;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    totalTransactions: 0,
    totalGoals: 0,
    totalBudgets: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchLogs();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/admin/logs");
      const data = await response.json();
      const formattedLogs = data.logs.map((log: Log) => ({
        ...log,
        formattedDate: new Date(log.createdAt).toLocaleDateString(),
      }));
      setLogs(formattedLogs);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats-admin");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const pieData = [
    { name: "Receitas", value: stats.totalRevenue || 20 },
    { name: "Despesas", value: stats.totalExpenses || 45 },
  ];

  const barData = [
    { name: "Metas", value: stats.totalGoals || 43 },
    { name: "Orçamentos", value: stats.totalBudgets || 10 },
  ];

  const COLORS = [ "#22C55E","#FFA500"];
  const COLORS2 = ["#3B82F6", "#FFA500"];


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel Administrativo</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {[{ title: "Usuários Registrados", value: stats.totalUsers, Icon: Users, color: "text-blue-500" },
        { title: "Receitas Totais", value: stats.totalRevenue, Icon: DollarSign, color: "text-green-500" },
        { title: "Despesas Totais", value: stats.totalExpenses, Icon: CreditCard, color: "text-red-500" },
        { title: "Transações Totais", value: stats.totalTransactions, Icon: BarChart2, color: "text-yellow-500" },
        ].map(({ title, value, Icon, color }, index) => (
          <Card key={index} className="shadow-lg border border-gray-200">
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-md border-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Receitas e Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={150} label fill="#8884d8" dataKey="value">
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

        <Card className="shadow-lg border-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Metas e Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0088FE" barSize={50}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Logs Recentes */}
      <Card className="shadow-lg border-1 mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Logs Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.formattedDate}</TableCell>
                    <TableCell>{log.user?.name || "Usuário desconhecido"}</TableCell>
                    <TableCell>{log.action}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Nenhum log encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
