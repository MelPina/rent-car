"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Inspeccion, Vehiculo } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { InspeccionesTable } from "./components/inspecciones-table"
import { AddInspeccionModal } from "./components/add-inspeccion-modal"

type InspeccionWithVehiculo = Inspeccion & {
  vehiculo: Vehiculo
}

export default function InspeccionesPage() {
  const [inspecciones, setInspecciones] = useState<InspeccionWithVehiculo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchInspecciones = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/inspecciones")

      if (!response.ok) {
        throw new Error("Error al cargar las inspecciones")
      }

      const data = await response.json()
      setInspecciones(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInspecciones()
  }, [])

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
    fetchInspecciones()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestiona la Inspección de los vehículos</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Inspección
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <InspeccionesTable inspecciones={inspecciones} onInspeccionUpdated={fetchInspecciones} />
      )}

      <AddInspeccionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}

