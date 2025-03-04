"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import TransactionDialog from "@/components/transaction-dialog";

const TransationPage = () => {
  const [transations, settransations] = useState<{
    ammout: string;
    type: string,
    date: string,
    category: string,
    description: string,
  }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchtransations();
  }, []);

  const fetchtransations = async () => {
    try {
      const response = await fetch("/api/transations");

      const data = await response.json();
      console.log(" dados", data);

      settransations(data.transactions);
    } catch (error) {
      console.error("Erro ao buscar Transaçãos:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transaçãos</h1>
        <Button className="bg-gradient-to-r bg-gradient-to-r from-green-500 to-green-700 text-white" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4 " /> Nova Transação
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
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transations.map((transation, index) => (
                <TableRow key={index}>
                  <TableCell>{transation.ammout}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchtransations}
      />
    </div>
  );
};

export default TransationPage;
