"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, MoreVertical, Edit, Trash } from "lucide-react";
import UserDialog from "@/components/user-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const UserRegistrationPage = () => {
    const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string }[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id?: string; name: string; email: string; password?: string; role: "ADMIN" | "USER" } | undefined>(undefined);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchUsers();
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

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            try {
                await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
                fetchUsers();
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
            }
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Cadastro de Usuários</h1>
                    <Button className="bg-gradient-to-r from-green-500 to-green-700 text-white" onClick={() => { setIsEditing(false); setIsDialogOpen(true); }}>
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
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                        <Edit className="w-4 h-4 mr-2" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(user.id)}>
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

                <div className="flex justify-between items-center mt-4">
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        Anterior
                    </Button>
                    <span>Página {currentPage} de {Math.ceil(users.length / itemsPerPage)}</span>
                    <Button disabled={currentPage >= Math.ceil(users.length / itemsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>
                        Próximo
                    </Button>
                </div>
            </div>

            <UserDialog
                open={isDialogOpen}
                isEditing={isEditing}
                user={selectedUser || undefined}
                onOpenChange={setIsDialogOpen}
                onSuccess={() => {
                    fetchUsers();
                    setIsDialogOpen(false);
                }}
            />
        </>
    );
};

export default UserRegistrationPage;
