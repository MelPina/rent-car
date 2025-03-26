"use client"
import { Button } from "@/components/ui/button"
import { Car, Fuel, Pencil, Tag, Trash, Wrench } from "lucide-react"
import Image from "next/image"
// import { useRouter } from "next/navigation"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { TipoVehiculo, Marca, Modelo, TipoCombustible, Vehiculo } from "@prisma/client"
import { EditVehiculoForm } from "./edit-vehiculo-fom"

type VehiculoWithRelations = Vehiculo & {
  tpVehiculo: TipoVehiculo
  marca: Marca
  modelo: Modelo
  tpCombustible: TipoCombustible
}

interface VehiculoCardProps {
  vehiculo: VehiculoWithRelations
  onVehiculoUpdated: () => void
}

export function VehiculoCard({ vehiculo, onVehiculoUpdated }: VehiculoCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  // const router = useRouter()
  const { toast } = useToast()

  const deleteVehiculo = async () => {
    try {
      await axios.delete(`/api/vehiculos/${vehiculo.id}`)
      toast({
        title: "Vehículo eliminado",
        description: "El vehículo ha sido eliminado correctamente",
      })
      onVehiculoUpdated()
    } catch {
      toast({
        title: "Algo salió mal",
        description: "No se pudo eliminar el vehículo",
        variant: "destructive",
      })
    }
  }

  // const toggleEstado = async (estado: boolean) => {
  //   try {
  //     await axios.patch(`/api/vehiculos/${vehiculo.id}`, { estado })
  //     if (estado) {
  //       toast({
  //         title: "Vehículo Activado ✅",
  //       })
  //     } else {
  //       toast({
  //         title: "Vehículo Desactivado ⚠",
  //       })
  //     }
  //     onVehiculoUpdated()
  //     router.refresh()
  //   } catch  {
  //     toast({
  //       title: "Algo salió mal",
  //       description: "No se pudo actualizar el estado del vehículo",
  //       variant: "destructive",
  //     })
  //   }
  // }

  return (
    <>
      <div className="relative p-1 bg-white rounded-lg shadow-md hover:shadow-lg">
        <Image
          src={vehiculo.photo || "/placeholder.svg?height=200&width=400"}
          alt={vehiculo.descripcion}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />

        {/* {vehiculo.estado ? (
          <p className="absolute top-0 right-0 w-full p-1 text-center text-white bg-green-700 rounded-t-lg">Activo</p>
        ) : (
          <p className="absolute top-0 left-0 right-0 w-full p-1 text-center text-white bg-red-300 rounded-t-lg">
            Inactivo
          </p>
        )} */}

        <div className="relative p-3">
          <div className="flex flex-col mb-3 gap-x-4">
            <p className="text-xl min-h-16 lg:min-h-fit">{vehiculo.descripcion}</p>
            <p className="text-sm text-gray-600">{vehiculo.noPlaca}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <p className="flex items-center">
              <Car className="h-4 w-4 mr-2" strokeWidth={1} />
              {vehiculo.tpVehiculo.descripcion}
            </p>

            <p className="flex items-center">
              <Tag className="h-4 w-4 mr-2" strokeWidth={1} />
              {vehiculo.marca.descripcion}
            </p>
            <p className="flex items-center">
              <Wrench className="h-4 w-4 mr-2" strokeWidth={1} />
              {vehiculo.modelo.descripcion}
            </p>
            <p className="flex items-center">
              <Fuel className="h-4 w-4 mr-2" strokeWidth={1} />
              {vehiculo.tpCombustible.descripcion}
            </p>

            
          </div>
          <div className="flex justify-between mt-3 gap-x-4">
            <Button variant="outline" onClick={deleteVehiculo}>
              Eliminar
              <Trash className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              Editar
              <Pencil className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {/* {vehiculo.estado ? (
            <Button className="w-full mt-3" variant="outline" onClick={() => toggleEstado(false)}>
              Desactivar
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="w-full mt-3" onClick={() => toggleEstado(true)}>
              Activar
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          )} */}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Vehículo</DialogTitle>
            <DialogDescription>Modifique los datos del vehículo y guarde los cambios.</DialogDescription>
          </DialogHeader>
          <EditVehiculoForm vehiculoData={vehiculo} setOpenDialog={setIsEditDialogOpen} onSuccess={onVehiculoUpdated} />
        </DialogContent>
      </Dialog>
    </>
  )
}

