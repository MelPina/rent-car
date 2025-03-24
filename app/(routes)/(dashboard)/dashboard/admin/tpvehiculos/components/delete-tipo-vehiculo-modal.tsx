"use client"

import { useState } from "react"
import type { TipoVehiculo } from "@prisma/client"
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

interface DeleteTipoVehiculoModalProps {
  isOpen: boolean
  onClose: () => void
  tipoVehiculo: TipoVehiculo
  onSuccess: () => void
}

export function DeleteTipoVehiculoModal({ isOpen, onClose, tipoVehiculo, onSuccess }: DeleteTipoVehiculoModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true)

      // Llamada a la API para eliminar el tipo de vehículo
      const response = await fetch(`/api/tipos-vehiculo/${tipoVehiculo.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el tipo de vehículo")
      }

      toast({
        title: "Tipo de vehículo eliminado",
        description: "El tipo de vehículo ha sido eliminado correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el tipo de vehículo",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar este tipo de vehículo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de vehículo
            <span className="font-medium"> {tipoVehiculo.descripcion}</span>.
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

