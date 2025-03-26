"use client"

import { useState } from "react"
import type { RentaDevolucion, Vehiculo, Cliente, Empleado } from "@prisma/client"
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

type RentaDevolucionWithRelations = RentaDevolucion & {
  vehiculo: Vehiculo
  cliente: Cliente
  empleado: Empleado
}

interface DeleteRentaDevolucionModalProps {
  isOpen: boolean
  onClose: () => void
  rentaDevolucion: RentaDevolucionWithRelations
  onSuccess: () => void
}

export function DeleteRentaDevolucionModal({
  isOpen,
  onClose,
  rentaDevolucion,
  onSuccess,
}: DeleteRentaDevolucionModalProps) {
  const [isLoading, setIsLoading] = useState(false)

 
  const isDefaultDate = (date: Date) => {
    const dateObj = new Date(date)
    return dateObj.getFullYear() < 1970
  }

 
  const isDevuelta = () => {
    return rentaDevolucion.fechaDevolucion && !isDefaultDate(rentaDevolucion.fechaDevolucion)
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)

    
      const response = await fetch(`/api/rentas-devoluciones/${rentaDevolucion.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la renta")
      }

      toast({
        title: "Renta eliminada",
        description: "La renta ha sido eliminada correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la renta",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar esta renta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la renta del vehículo
            <span className="font-medium"> {rentaDevolucion.vehiculo.descripcion}</span> al cliente
            <span className="font-medium"> {rentaDevolucion.cliente.nombre}</span>.
            {isDevuelta() && " También se eliminará el registro de devolución asociado."}
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

