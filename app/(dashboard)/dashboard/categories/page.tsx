"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import CategoryDialog from "@/components/category-dialog";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<{ name: string; type: string }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button className="bg-gradient-to-r bg-gradient-to-r from-green-500 to-green-700 text-white" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4 " /> Nova Categoria
        </Button>
      </div>

      <Card className="shadow-md border-1">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell>{category.name}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchCategories}
      />
    </div>
  );
};

export default CategoriesPage;
