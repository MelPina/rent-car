"use client"

import { useState } from "react"
import type { Modelo, Marca } from "@prisma/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

type ModeloWithMarca = Modelo & {
  marca: Marca
}

interface DeleteModeloModalProps {
  isOpen: boolean
  onClose: () => void
  modelo: ModeloWithMarca
  onSuccess: () => void
}

export function DeleteModeloModal({ isOpen, onClose, modelo, onSuccess }: DeleteModeloModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true)

      // Llamada a la API para eliminar el modelo
      const response = await fetch(`/api/modelos/${modelo.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el modelo")
      }

      toast({
        title: "Modelo eliminado",
        description: "El modelo ha sido eliminado correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el modelo",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar este modelo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el modelo
            <span className="font-medium"> {modelo.descripcion}</span> de la marca
            <span className="font-medium"> {modelo.marca.descripcion}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

