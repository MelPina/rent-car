import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { inspeccionId: string } }) {
  try {
    const { userId } = await auth()
    const { inspeccionId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const inspeccion = await db.inspeccion.update({
      where: {
        id: inspeccionId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(inspeccion)
  } catch (error) {
    console.log("[INSPECCION_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { inspeccionId: string } }) {
  try {
    const { userId } = await auth()
    const { inspeccionId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const inspeccion = await db.inspeccion.delete({
      where: {
        id: inspeccionId,
      },
    })

    return NextResponse.json(inspeccion)
  } catch (error) {
    console.log("[INSPECCION_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

