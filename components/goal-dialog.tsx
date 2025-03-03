"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

const goalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0),
  deadline: z.string(),
})

type GoalForm = z.infer<typeof goalSchema>

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function GoalDialog({
  open,
  onOpenChange,
  onSuccess,
}: GoalDialogProps) {
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<GoalForm>({
      resolver: zodResolver(goalSchema),
      defaultValues: {
        currentAmount: 0,
      },
    })

  const onSubmit = async (data: GoalForm) => {
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create goal")
      }

      reset()
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Financial Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Input
              placeholder="Goal Name"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              step="0.01"
              placeholder="Target Amount"
              {...register("targetAmount", { valueAsNumber: true })}
              className={errors.targetAmount ? "border-destructive" : ""}
            />
            {errors.targetAmount && (
              <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              step="0.01"
              placeholder="Current Amount (Optional)"
              {...register("currentAmount", { valueAsNumber: true })}
              className={errors.currentAmount ? "border-destructive" : ""}
            />
            {errors.currentAmount && (
              <p className="text-sm text-destructive">{errors.currentAmount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="date"
              {...register("deadline")}
              className={errors.deadline ? "border-destructive" : ""}
            />
            {errors.deadline && (
              <p className="text-sm text-destructive">{errors.deadline.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Goal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}