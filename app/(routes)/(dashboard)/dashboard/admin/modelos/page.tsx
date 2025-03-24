"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Modelo, Marca } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { ModelosTable } from "./components/TableModelos"

type ModeloWithMarca = Modelo & {
  marca: Marca
}

export default function ModelosPage() {
  const [modelos, setModelos] = useState<ModeloWithMarca[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchModelos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/modelos")

      if (!response.ok) {
        throw new Error("Error al cargar los modelos")
      }

      const data = await response.json()
      setModelos(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchModelos()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestiona los Modelos</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Modelo
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <ModelosTable modelos={modelos} />
      )}
    </div>
  )
}

