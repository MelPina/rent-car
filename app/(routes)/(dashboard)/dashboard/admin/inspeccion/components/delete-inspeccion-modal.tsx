"use client"

import { useState } from "react"
import type { Inspeccion, Vehiculo } from "@prisma/client"
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

type InspeccionWithVehiculo = Inspeccion & {
  vehiculo: Vehiculo
}

interface DeleteInspeccionModalProps {
  isOpen: boolean
  onClose: () => void
  inspeccion: InspeccionWithVehiculo
  onSuccess: () => void
}

export function DeleteInspeccionModal({ isOpen, onClose, inspeccion, onSuccess }: DeleteInspeccionModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true)

      // Llamada a la API para eliminar la inspección
      const response = await fetch(`/api/inspecciones/${inspeccion.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la inspección")
      }

      toast({
        title: "Inspección eliminada",
        description: "La inspección ha sido eliminada correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la inspección",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar esta inspección?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la inspección del vehículo
            <span className="font-medium"> {inspeccion.vehiculo.descripcion}</span> con fecha
            <span className="font-medium"> {new Date(inspeccion.fecha).toLocaleDateString()}</span>.
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

