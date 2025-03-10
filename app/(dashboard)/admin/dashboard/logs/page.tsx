"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { formatDate, formatHour } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";



const UserLogPage = () => {
    const [logs, setLogs] = useState<UserLog[]>([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await fetch("/api/user-logs");
            const data = await response.json();
            console.log("LOGS", data);
            setLogs(data.logs);
        } catch (error) {
            console.error("Erro ao buscar logs dos usuários:", error);
        }
    };

    interface UserLog {
        id: string;
        action: string;
        details: string;
        createdAt: string;
        user: {
            name: string;
        }
    }

    const handleDelete = async (log: UserLog): Promise<void> => {
        if (window.confirm(`Tem certeza que deseja excluir este log? Essa ação não pode ser desfeita.`)) {
            try {
                await fetch(`/api/user-logs/${log.id}`, { method: "DELETE" });
                fetchLogs();
            } catch (error) {
                console.error("Erro ao excluir log:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Logs dos Usuários</h1>
            </div>

            <Card className="shadow-md border-1">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Lista de Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ação</TableHead>
                                <TableHead>Detalhe</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Hora</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log, index) => (
                                <TableRow key={index}>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>{log.details}</TableCell>
                                    <TableCell>{log.user.name}</TableCell>
                                    <TableCell>{formatDate(new Date(log.createdAt))}</TableCell>
                                    <TableCell>{formatHour(new Date(log.createdAt))}</TableCell>
                                     
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserLogPage;