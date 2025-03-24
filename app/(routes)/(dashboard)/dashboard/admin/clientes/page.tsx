"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Cliente } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { AddClienteModal } from "./components/add-clientes-modal"
import { ClientesTable } from "./components/clientes-table"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchClientes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/clientes")

      if (!response.ok) {
        throw new Error("Error al cargar los clientes")
      }

      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
    fetchClientes()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestiona tus Clientes</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <ClientesTable clientes={clientes}  refreshData={fetchClientes}/>
      )}

      <AddClienteModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />
    </div>
  )
}

