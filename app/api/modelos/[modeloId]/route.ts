import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { modeloId: string } }) {
  try {
    const { userId } = await auth()
    const { modeloId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const modelo = await db.modelo.update({
      where: {
        id: modeloId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(modelo)
  } catch (error) {
    console.log("[MODELO_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { modeloId: string } }) {
  try {
    const { userId } = await auth()
    const { modeloId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const modelo = await db.modelo.delete({
      where: {
        id: modeloId,
      },
    })

    return NextResponse.json(modelo)
  } catch (error) {
    console.log("[MODELO_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

