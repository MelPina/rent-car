import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tiposVehiculo = await db.tipoVehiculo.findMany({
      orderBy: {
        descripcion: "asc",
      },
    })

    return NextResponse.json(tiposVehiculo)
  } catch (error) {
    console.log("[TIPOS_VEHICULO]", error)
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

    const tipoVehiculo = await db.tipoVehiculo.create({
      data: {
        ...values,
      },
    })

    return NextResponse.json(tipoVehiculo)
  } catch (error) {
    console.log("[TIPOS_VEHICULO_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

