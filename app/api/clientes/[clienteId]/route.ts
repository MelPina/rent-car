import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { clienteId: string } }) {
  try {
    const { userId } = await auth()
    const { clienteId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const cliente = await db.cliente.update({
      where: {
        id: clienteId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.log("[CLIENTE_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { clienteId: string } }) {
  try {
    const { userId } = await auth()
    const { clienteId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const cliente = await db.cliente.delete({
      where: {
        id: clienteId,
      },
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.log("[CLIENTE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

