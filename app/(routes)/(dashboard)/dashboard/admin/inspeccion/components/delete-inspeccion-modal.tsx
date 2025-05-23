"use client"

import { useState } from "react"
import type { Inspeccion, Vehiculo, Cliente, Empleado } from "@prisma/client"
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

// Definir el tipo con todas las relaciones necesarias
type InspeccionWithRelations = Inspeccion & {
  vehiculo: Vehiculo | null
  cliente: Cliente | null
  empleado: Empleado | null
}

interface DeleteInspeccionModalProps {
  isOpen: boolean
  onClose: () => void
  inspeccion: InspeccionWithRelations
  onSuccess: () => void
}

export function DeleteInspeccionModal({ isOpen, onClose, inspeccion, onSuccess }: DeleteInspeccionModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Verificar que inspeccion existe antes de intentar acceder a sus propiedades
  if (!inspeccion) {
    return null
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)

      // Llamada a la API para eliminar la inspección
      const response = await fetch(`/api/inspecciones/${inspeccion.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Error al eliminar la inspección")
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
        description: error instanceof Error ? error.message : "No se pudo eliminar la inspección",
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
            <span className="font-medium"> {inspeccion.vehiculo?.descripcion || "No disponible"}</span> con fecha
            <span className="font-medium">
              {" "}
              {inspeccion.fecha ? new Date(inspeccion.fecha).toLocaleDateString() : "No disponible"}
            </span>
            .
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

