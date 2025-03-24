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
        estado: true, // Renta activa
        OR: [
          { fechaDevolucion: null }, // Sin fecha de devolución
          { fechaDevolucion: { lt: new Date("1970-01-01") } }, // O con fecha por defecto
        ],
      },
    })

    if (vehiculoEnRenta) {
      return new NextResponse("El vehículo ya está en renta", { status: 400 })
    }

    const rentaDevolucion = await db.rentaDevolucion.create({
      data: {
        ...values,
        userId,
      },
    })

    return NextResponse.json(rentaDevolucion)
  } catch (error) {
    console.log("[RENTAS_DEVOLUCIONES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

