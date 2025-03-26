"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Marca } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { AddMarcaModal } from "./components/add-marcas-modal"
import { MarcasTable } from "./components/marcas-table"

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchMarcas = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/marcas")

      if (!response.ok) {
        throw new Error("Error al cargar las marcas")
      }

      const data = await response.json()
      setMarcas(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMarcas()
  }, [])

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
    fetchMarcas()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestiona las Marcas</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Marca
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <MarcasTable marcas={marcas} refreshData={fetchMarcas}/>
      )}

      <AddMarcaModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />
    </div>
  )
}

