import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const vehiculos = await db.vehiculo.findMany({
      where: {
        userId,
      },
      include: {
        tpVehiculo: true,
        marca: true,
        modelo: true,
        tpCombustible: true,
      },
      orderBy: {
        descripcion: "asc",
      },
    })

    return NextResponse.json(vehiculos)
  } catch (error) {
    console.log("[VEHICULOS]", error)
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

    const vehiculo = await db.vehiculo.create({
      data: {
        ...values,
        userId,
      },
    })

    return NextResponse.json(vehiculo)
  } catch (error) {
    console.log("[VEHICULOS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

