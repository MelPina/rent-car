import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { tipoVehiculoId: string } }) {
  try {
    const { userId } = await auth()
    const { tipoVehiculoId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tipoVehiculo = await db.tipoVehiculo.update({
      where: {
        id: tipoVehiculoId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(tipoVehiculo)
  } catch (error) {
    console.log("[TIPO_VEHICULO_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { tipoVehiculoId: string } }) {
  try {
    const { userId } = await auth()
    const { tipoVehiculoId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tipoVehiculo = await db.tipoVehiculo.delete({
      where: {
        id: tipoVehiculoId,
      },
    })

    return NextResponse.json(tipoVehiculo)
  } catch (error) {
    console.log("[TIPO_VEHICULO_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

