"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddVehiculoForm } from "./add-vehiculos-fom"

interface ButtonAddVehiculoProps {
  onVehiculoAdded: () => void
}

export function ButtonAddVehiculo({ onVehiculoAdded }: ButtonAddVehiculoProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Vehículo
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
            <DialogDescription>Ingrese los datos para crear un nuevo vehículo.</DialogDescription>
          </DialogHeader>
          <AddVehiculoForm setOpenDialog={setIsDialogOpen} onSuccess={onVehiculoAdded} />
        </DialogContent>
      </Dialog>
    </>
  )
}

