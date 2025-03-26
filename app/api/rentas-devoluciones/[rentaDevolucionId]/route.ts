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

    // Verificar si la renta ya ha sido devuelta
    const rentaDevolucion = await db.rentaDevolucion.findUnique({
      where: {
        id: rentaDevolucionId,
      },
    })

    if (!rentaDevolucion) {
      return new NextResponse("Renta no encontrada", { status: 404 })
    }

    // Verificar si ya tiene fecha de devolución
    let yaDevuelta = false
    if (rentaDevolucion.fechaDevolucion) {
      const fechaDevolucion = new Date(rentaDevolucion.fechaDevolucion)
      if (fechaDevolucion.getFullYear() > 1970) {
        yaDevuelta = true
      }
    }

    // Si ya está devuelta, solo permitir actualizar el comentario
    const dataToUpdate = yaDevuelta ? { comentario: values.comentario } : values

    const updatedRentaDevolucion = await db.rentaDevolucion.update({
      where: {
        id: rentaDevolucionId,
      },
      data: dataToUpdate,
    })

    return NextResponse.json(updatedRentaDevolucion)
  } catch (error) {
    console.log("[RENTA_DEVOLUCION_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { rentaDevolucionId: string } }) {
  try {
    const { userId } = await auth()
    const { rentaDevolucionId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const rentaDevolucion = await db.rentaDevolucion.delete({
      where: {
        id: rentaDevolucionId,
      },
    })

    return NextResponse.json(rentaDevolucion)
  } catch (error) {
    console.log("[RENTA_DEVOLUCION_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

