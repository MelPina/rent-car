"use client"

import { useState } from "react"
import type { Vehiculo, TipoVehiculo, Marca, Modelo, TipoCombustible } from "@prisma/client"
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
import { toast } from "@/components/ui/use-toast"

type VehiculoWithRelations = Vehiculo & {
  tpVehiculo: TipoVehiculo
  marca: Marca
  modelo: Modelo
  tpCombustible: TipoCombustible
}

interface DeleteVehiculoModalProps {
  isOpen: boolean
  onClose: () => void
  vehiculo: VehiculoWithRelations
  onSuccess: () => void
}

export function DeleteVehiculoModal({ isOpen, onClose, vehiculo, onSuccess }: DeleteVehiculoModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setIsLoading(true)

      // Llamada a la API para eliminar el vehículo
      const response = await fetch(`/api/vehiculos/${vehiculo.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el vehículo")
      }

      toast({
        title: "Vehículo eliminado",
        description: "El vehículo ha sido eliminado correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el vehículo",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro de eliminar este vehículo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el vehículo
            <span className="font-medium"> {vehiculo.descripcion} </span>
            con placa <span className="font-medium">{vehiculo.noPlaca}</span>.
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

