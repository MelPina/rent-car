import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { tipoCombustibleId: string } }) {
  try {
    const { userId } = await auth()
    const { tipoCombustibleId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tipoCombustible = await db.tipoCombustible.update({
      where: {
        id: tipoCombustibleId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(tipoCombustible)
  } catch (error) {
    console.log("[TIPO_COMBUSTIBLE_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { tipoCombustibleId: string } }) {
  try {
    const { userId } = await auth()
    const { tipoCombustibleId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tipoCombustible = await db.tipoCombustible.delete({
      where: {
        id: tipoCombustibleId,
      },
    })

    return NextResponse.json(tipoCombustible)
  } catch (error) {
    console.log("[TIPO_COMBUSTIBLE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

