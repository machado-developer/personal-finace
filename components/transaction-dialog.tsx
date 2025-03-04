"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["RECEITA", "DESPESA"]),
  description: z.string().min(1),
  categoryId: z.string(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function TransactionDialog({
  open,
  onOpenChange,
  onSuccess,
}: TransactionDialogProps) {
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<
    { id: string; name: string; type: "RECEITA" | "DESPESA" }[]
  >([]);
  const [selectedType, setSelectedType] = useState<"RECEITA" | "DESPESA" | "">(
    ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
  });

  // Atualiza o tipo selecionado no estado quando o usuário muda o select
  useEffect(() => {
    setSelectedType(watch("type") || "");
  }, [watch("type")]);

  console.log("FORM ERROS", errors);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        console.log("CATEGORIAS", data);

        setCategories(data.categories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: TransactionForm) => {
    console.log("DATA", data);
    
    try {
      const response = await fetch("/api/transations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar transação");
      }

      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="transaction-description">
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="transaction-description">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Input
              type="number"
              step="0.01"
              placeholder="Valor"
              {...register("amount", { valueAsNumber: true })}
              className={errors.amount ? "border-destructive" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Select para Tipo */}
          <Select
            onValueChange={(value) => {
              setSelectedType(value as "RECEITA" | "DESPESA");
              setValue("type", value as "RECEITA" | "DESPESA");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RECEITA">Receita</SelectItem>
              <SelectItem value="DESPESA">Despesa</SelectItem>
            </SelectContent>
          </Select>

          {/* Select para Categoria - Filtrado pelo Tipo */}
          <Select
            onValueChange={(value) => setValue("categoryId", value)}
            {...register("categoryId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((category) => category.type === selectedType)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Input
              placeholder="Descrição"
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Transação"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
