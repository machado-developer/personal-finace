"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserDialog from "@/components/user-dialog";
import { Plus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const UserRegistrationPage = () => {
    const [users, setUsers] = useState<{ name: string; email: string; role: string }[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users");
            const data = await response.json();
            console.log("USUAROS", data);
            
            setUsers(data.users);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Cadastro de Usuários</h1>
                    <Button className="bg-gradient-to-r from-green-500 to-green-700 text-white" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
                    </Button>
                </div>

                <Card className="shadow-md border-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Usuários Cadastrados ({users.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Função</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <UserDialog
                open={isDialogOpen}
                isEditing={false}
                onOpenChange={setIsDialogOpen}
                onSuccess={() => {
                    fetchUsers();
                    setIsDialogOpen(false
                    );
                }}
            />
        </>
    );
};

export default UserRegistrationPage;
