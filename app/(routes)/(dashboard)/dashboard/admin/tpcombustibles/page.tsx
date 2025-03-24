"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { TipoCombustible } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { AddTipoCombustibleModal } from "./components/add-tipo-combustible"
import { TiposCombustibleTable } from "./components/tipos-combustible-table"

export default function TiposCombustiblePage() {
  const [tiposCombustible, setTiposCombustible] = useState<TipoCombustible[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchTiposCombustible = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/tipos-combustible")

      if (!response.ok) {
        throw new Error("Error al cargar los tipos de combustible")
      }

      const data = await response.json()
      setTiposCombustible(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTiposCombustible()
  }, [])

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
    fetchTiposCombustible()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tipos de Combustible</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Tipo de Combustible
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <TiposCombustibleTable tiposCombustible={tiposCombustible} refreshData={fetchTiposCombustible}/>
      )}

      <AddTipoCombustibleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}

