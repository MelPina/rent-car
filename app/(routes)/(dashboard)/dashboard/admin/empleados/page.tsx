"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Empleado } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { AddEmpleadoModal } from "./components/add-empleado-model"
import { EmpleadosTable } from "./components/empleados-table"

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchEmpleados = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/empleados")

      if (!response.ok) {
        throw new Error("Error al cargar los empleados")
      }

      const data = await response.json()
      setEmpleados(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmpleados()
  }, [])

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
    fetchEmpleados()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestiona tus Empleados</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Empleado
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <EmpleadosTable empleados={empleados} refreshData={fetchEmpleados} />
      )}

      <AddEmpleadoModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />
    </div>
  )
}

