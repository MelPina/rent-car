import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { vehiculoId: string } }) {
  try {
    const { userId } = await auth()
    const { vehiculoId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const vehiculo = await db.vehiculo.update({
      where: {
        id: vehiculoId,
        userId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(vehiculo)
  } catch (error) {
    console.log("[VEHICULO_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { vehiculoId: string } }) {
  try {
    const { userId } = await auth()
    const { vehiculoId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const vehiculo = await db.vehiculo.delete({
      where: {
        id: vehiculoId,
        userId,
      },
    })

    return NextResponse.json(vehiculo)
  } catch (error) {
    console.log("[VEHICULO_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

