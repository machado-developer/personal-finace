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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

const goalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "O nome da meta é obrigatório"),
  targetAmount: z.coerce.number().positive("O valor alvo deve ser positivo"),
  savedAmount: z.coerce.number().min(0, "O valor atual não pode ser negativo"),
  deadline: z.string().min(1, "A data limite é obrigatória"),
  categoryId: z.string().optional(),
});

type GoalForm = z.infer<typeof goalSchema>;

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  isEditing?: boolean;
  goal?: GoalForm;
}

export default function GoalDialog({
  open,
  onOpenChange,
  onSuccess,
  isEditing = false,
  goal,
}: GoalDialogProps) {
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<GoalForm>({
    defaultValues: {
      name: "",
      targetAmount: 0,
      savedAmount: 0,
      deadline: "",
      categoryId: "",
    },
  });

  console.log("METAS", goal);

  useEffect(() => {
    if (goal) {
      reset(goal);
      setSelectedCategory(goal.categoryId || "");
    }
  }, [goal, reset]);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (goal) {
      setValue("deadline", goal.deadline.split("T")[0]); // Remove a parte da hora
    }
  }, [setValue, goal]);
  const onSubmit = async (data: GoalForm) => {
    try {
      const response = await fetch(
        isEditing ? `/api/goals/${data.id}` : "/api/goals",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing ? "Falha ao atualizar meta" : "Falha ao criar meta"
        );
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Meta Financeira" : "Adicionar Meta Financeira"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <label>Nome da Meta</label>
            <Input
              autoComplete="new-password"
              placeholder="Nome da Meta"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setValue("categoryId", value);
              }}
            >

              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria">
                  {/* {categories.find((cat) => cat.id === selectedCategory)?.name || "Selecione a categoria"} */}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>Valor Alvo</label>
            <Input
              autoComplete="new-password"
              type="number"
              step="0.01"
              placeholder="Valor Alvo"
              {...register("targetAmount", { valueAsNumber: true })}
              className={errors.targetAmount ? "border-destructive" : ""}
            />
            {errors.targetAmount && <p className="text-destructive">{errors.targetAmount.message}</p>}
          </div>
          <div>
            <label>Valor Atual</label>
            <Input
              autoComplete="new-password"
              type="number"
              step="0.01"
              placeholder="Valor Atual"
              {...register("savedAmount", { valueAsNumber: true })}
              className={errors.savedAmount ? "border-destructive" : ""}
            />
            {errors.savedAmount && <p className="text-destructive">{errors.savedAmount.message}</p>}
          </div>
          <div>
            <label>Data limite <br></br>{goal?.deadline && ` ( ${goal.deadline.split("T")[0]})`}</label>
            <Input
              autoComplete="new-password"
              type="date"
              {...register("deadline")}
              className={errors.deadline ? "border-destructive" : ""}
            />
            {errors.deadline && <p className="text-destructive">{errors.deadline.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-green-600 text-white" disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? "Atualizando..." : "Adicionando...") : isEditing ? "Atualizar Meta" : "Adicionar Meta"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
