"use client"
import { useState, useEffect } from "react"
import { ExportButtons } from "./export-buttons"
import type { Vehiculo, TipoVehiculo, Marca, Modelo, TipoCombustible } from "@prisma/client"
import { toast } from "@/hooks/use-toast"

type VehiculoWithRelations = Vehiculo & {
  tpVehiculo: TipoVehiculo
  marca: Marca
  modelo: Modelo
  tpCombustible: TipoCombustible
}

export function ExportVehiculos() {
  const [vehiculos, setVehiculos] = useState<VehiculoWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/vehiculos", {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar los vehículos")
        }

        const data = await response.json()
        console.log("Fetched vehiculos:", data.length)
        setVehiculos(data)
      } catch (error) {
        console.error("Error fetching vehiculos:", error)
        toast({
          title: "Error al obtener los vehículos",
          description: "No se pudieron cargar los datos para exportar",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehiculos()
  }, [])

  const columns = [
    "Descripción",
    "No. Placa",
    "No. Chasis",
    "No. Motor",
    "Tipo",
    "Marca",
    "Modelo",
    "Combustible",
    "Estado",
  ]

  const getRowData = (vehiculo: VehiculoWithRelations) => {
    // Make sure all values are strings or numbers for proper export
    return [
      vehiculo.descripcion || "",
      vehiculo.noPlaca || "",
      vehiculo.noChasis || "",
      vehiculo.noMotor || "",
      vehiculo.tpVehiculo?.descripcion || "",
      vehiculo.marca?.descripcion || "",
      vehiculo.modelo?.descripcion || "",
      vehiculo.tpCombustible?.descripcion || "",
      vehiculo.estado ? "Activo" : "Inactivo",
    ]
  }

  if (isLoading) {
    return null
  }

  return (
    <ExportButtons<VehiculoWithRelations>
      data={vehiculos}
      fileName="Reporte_de_vehiculos"
      title="Lista de Vehículos"
      columns={columns}
      getRowData={getRowData}
    />
  )
}

