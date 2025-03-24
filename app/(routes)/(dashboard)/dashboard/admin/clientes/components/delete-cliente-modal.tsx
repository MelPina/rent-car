"use client"

import { useState } from "react"
import type { Cliente } from "@prisma/client"
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

interface DeleteClienteModalProps {
  isOpen: boolean
  onClose: () => void
  cliente: Cliente
  onSuccess: () => void
}

export function DeleteClienteModal({ isOpen, onClose, cliente, onSuccess }: DeleteClienteModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true)

      // Llamada a la API para eliminar el cliente
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el cliente")
      }

      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el cliente",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar este cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente
            <span className="font-medium"> {cliente.nombre}</span> con cédula
            <span className="font-medium"> {cliente.cedula}</span>.
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

