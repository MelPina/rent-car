import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Obtener todos los vehículos
    const vehiculos = await db.vehiculo.findMany({
      where: {
        estado: true, // Solo vehículos activos
      },
    })

    // Obtener vehículos en renta activa (sin fecha de devolución)
    const vehiculosEnRenta = await db.rentaDevolucion.findMany({
      where: {
        estado: true, // Rentas activas
        fechaDevolucion: null, // Sin fecha de devolución
      },
      select: {
        vehiculoId: true,
      },
    })

    // También verificar vehículos con fecha de devolución por defecto (0001-01-01)
    const vehiculosConDevolucionPorDefecto = await db.rentaDevolucion.findMany({
      where: {
        estado: true,
        fechaDevolucion: {
          lt: new Date("1970-01-01"), // Fecha por defecto
        },
      },
      select: {
        vehiculoId: true,
      },
    })

    // Combinar los IDs de vehículos no disponibles
    const vehiculosNoDisponiblesIds = new Set([
      ...vehiculosEnRenta.map((r) => r.vehiculoId),
      ...vehiculosConDevolucionPorDefecto.map((r) => r.vehiculoId),
    ])

    // Filtrar vehículos disponibles (no están en renta)
    const vehiculosDisponibles = vehiculos.filter((v) => !vehiculosNoDisponiblesIds.has(v.id))

    return NextResponse.json(vehiculosDisponibles)
  } catch (error) {
    console.log("[VEHICULOS_DISPONIBLES]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

