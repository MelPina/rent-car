"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { TipoVehiculo } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { TiposVehiculoTable } from "./components/tipos-vehiculo-table"
import { AddTipoVehiculoModal } from "./components/add-tipo-vehiculo"

export default function TiposVehiculoPage() {
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchTiposVehiculo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/tipos-vehiculo")

      if (!response.ok) {
        throw new Error("Error al cargar los tipos de vehículo")
      }

      const data = await response.json()
      setTiposVehiculo(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTiposVehiculo()
  }, [])

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
    fetchTiposVehiculo()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestiona los Tipos de Vehículo</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
         Registrar Tipo de Vehículo
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <TiposVehiculoTable tiposVehiculo={tiposVehiculo} refreshData={fetchTiposVehiculo}/>
      )}

      <AddTipoVehiculoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}

