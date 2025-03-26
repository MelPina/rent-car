import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { empleadoId: string } }) {
  try {
    const { userId } = await auth()
    const { empleadoId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const empleado = await db.empleado.update({
      where: {
        id: empleadoId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(empleado)
  } catch (error) {
    console.log("[EMPLEADO_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { empleadoId: string } }) {
  try {
    const { userId } = await auth()
    const { empleadoId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const empleado = await db.empleado.delete({
      where: {
        id: empleadoId,
      },
    })

    return NextResponse.json(empleado)
  } catch (error) {
    console.log("[EMPLEADO_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

