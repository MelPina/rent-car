"use client"
import { useState, useEffect } from "react"
import { ExportButtons } from "./export-buttons"
import type { Inspeccion, Vehiculo, Cliente, Empleado } from "@prisma/client"
import { toast } from "@/hooks/use-toast"

type InspeccionWithRelations = Inspeccion & {
  vehiculo: Vehiculo | null
  cliente: Cliente | null
  empleado: Empleado | null
}

export function ExportInspecciones() {
  const [inspecciones, setInspecciones] = useState<InspeccionWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInspecciones = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/inspecciones", {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar las inspecciones")
        }

        const data = await response.json()
        console.log("Fetched inspecciones:", data.length)
        setInspecciones(data)
      } catch (error) {
        console.error("Error fetching inspecciones:", error)
        toast({
          title: "Error al obtener las inspecciones",
          description: "No se pudieron cargar los datos para exportar",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInspecciones()
  }, [])

  const columns = [
    "Vehículo",
    "Cliente",
    "Empleado",
    "Fecha",
    "Estado Gomas",
    "Combustible",
    "Ralladuras",
    "Goma Respuesta",
    "Gato",
    "Roturas Cristal",
    "Estado",
  ]

  const getRowData = (inspeccion: InspeccionWithRelations) => {
    // Make sure all values are strings or numbers for proper export
    return [
      inspeccion.vehiculo?.descripcion || "No disponible",
      inspeccion.cliente?.nombre || "No disponible",
      inspeccion.empleado?.nombre || "No disponible",
      inspeccion.fecha ? new Date(inspeccion.fecha).toLocaleDateString() : "No disponible",
      inspeccion.estadoGomas || "No disponible",
      inspeccion.cantidadCombustible || "No disponible",
      inspeccion.tieneRalladuras ? "Sí" : "No",
      inspeccion.tieneGomaRespuesta ? "Sí" : "No",
      inspeccion.tieneGato ? "Sí" : "No",
      inspeccion.tieneRoturasCristal ? "Sí" : "No",
      inspeccion.estado ? "Activo" : "Inactivo",
    ]
  }

  if (isLoading) {
    return null
  }

  return (
    <ExportButtons<InspeccionWithRelations>
      data={inspecciones}
      fileName="Reporte_de_inspecciones"
      title="Lista de Inspecciones"
      columns={columns}
      getRowData={getRowData}
    />
  )
}

