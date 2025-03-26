"use client"

import { useEffect, useState } from "react"
import type { Vehiculo, TipoVehiculo, Marca, Modelo, TipoCombustible } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { ButtonAddVehiculo } from "./components/button-add-vehiculos"
import { VehiculosList } from "./components/vehiculo-list"
import { ExportVehiculos } from "../export/export-vehiculos"

type VehiculoWithRelations = Vehiculo & {
  tpVehiculo: TipoVehiculo
  marca: Marca
  modelo: Modelo
  tpCombustible: TipoCombustible
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<VehiculoWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchVehiculos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/vehiculos", {
        // Add cache: 'no-store' to prevent caching
        cache: "no-store",
        // Add a timestamp to prevent caching
        headers: {
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar los vehículos")
      }

      const data = await response.json()
      setVehiculos(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehiculos()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestiona tus Vehículos</h1>
        <div className="flex space-x-2">
          {!isLoading && vehiculos.length > 0 && <ExportVehiculos />}
          <ButtonAddVehiculo onVehiculoAdded={fetchVehiculos} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <VehiculosList vehiculos={vehiculos} onVehiculoUpdated={fetchVehiculos} />
      )}
    </div>
  )
}

