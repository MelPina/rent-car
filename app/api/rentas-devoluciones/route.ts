import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const rentasDevoluciones = await db.rentaDevolucion.findMany({
      include: {
        vehiculo: true,
        cliente: true,
        empleado: true,
      },
      orderBy: {
        fechaRenta: "desc",
      },
    })

    return NextResponse.json(rentasDevoluciones)
  } catch (error) {
    console.log("[RENTAS_DEVOLUCIONES]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verificar si el vehículo ya está en renta
    const vehiculoEnRenta = await db.rentaDevolucion.findFirst({
      where: {
        vehiculoId: values.vehiculoId,
        estado: true,
      },
    })

    // Si hay una renta existente, verificar si ya fue devuelta
    if (vehiculoEnRenta) {
      const fechaDevolucion = vehiculoEnRenta.fechaDevolucion
      const esDevuelto = fechaDevolucion && new Date(fechaDevolucion).getFullYear() > 1970

      if (!esDevuelto) {
        return new NextResponse("El vehículo ya está en renta y pendiente de devolución", { status: 400 })
      }
    }

    // Crear la renta con una fecha de devolución por defecto (null o una fecha mínima)
    // Usamos new Date(0) como valor por defecto para fechaDevolucion
    const rentaDevolucion = await db.rentaDevolucion.create({
      data: {
        ...values,
        userId,
        fechaDevolucion: new Date(0), // Fecha mínima como valor por defecto
      },
    })

    return NextResponse.json(rentaDevolucion)
  } catch (error) {
    console.log("[RENTAS_DEVOLUCIONES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

