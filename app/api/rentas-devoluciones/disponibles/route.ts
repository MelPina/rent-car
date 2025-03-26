import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Obtener todos los vehículos activos
    const vehiculos = await db.vehiculo.findMany({
      where: {
        estado: true,
      },
    })

    // Obtener IDs de vehículos en renta activa
    const rentasActivas = await db.rentaDevolucion.findMany({
      where: {
        estado: true,
        fechaDevolucion: {
          // Considerar como no devuelto si la fecha es anterior a 1970 (fecha por defecto)
          lt: new Date("1970-01-02"),
        },
      },
      select: {
        vehiculoId: true,
      },
    })

    // Crear un conjunto de IDs de vehículos en renta
    const vehiculosEnRentaIds = new Set(rentasActivas.map((r) => r.vehiculoId))

    // Filtrar vehículos disponibles (no están en renta)
    const vehiculosDisponibles = vehiculos.filter((v) => !vehiculosEnRentaIds.has(v.id))

    console.log(`Total vehículos: ${vehiculos.length}, Disponibles: ${vehiculosDisponibles.length}`)

    return NextResponse.json(vehiculosDisponibles)
  } catch (error) {
    console.error("[VEHICULOS_DISPONIBLES]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

