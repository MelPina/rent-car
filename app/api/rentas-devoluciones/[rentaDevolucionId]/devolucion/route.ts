import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { rentaDevolucionId: string } }) {
  try {
    const { userId } = await auth()
    const { rentaDevolucionId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verificar si la renta existe
    const rentaDevolucion = await db.rentaDevolucion.findUnique({
      where: {
        id: rentaDevolucionId,
      },
    })

    if (!rentaDevolucion) {
      return new NextResponse("Renta no encontrada", { status: 404 })
    }

    // Verificar si ya tiene fecha de devolución válida
    if (rentaDevolucion.fechaDevolucion) {
      const fechaDevolucion = new Date(rentaDevolucion.fechaDevolucion)
      if (fechaDevolucion.getFullYear() > 1970) {
        return new NextResponse("Esta renta ya ha sido devuelta", { status: 400 })
      }
    }

    // Actualizar la renta con la fecha de devolución
    const updatedRentaDevolucion = await db.rentaDevolucion.update({
      where: {
        id: rentaDevolucionId,
      },
      data: {
        fechaDevolucion: values.fechaDevolucion,
        comentario: values.comentario,
      },
    })

    return NextResponse.json(updatedRentaDevolucion)
  } catch (error) {
    console.log("[RENTA_DEVOLUCION_REGISTER]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

