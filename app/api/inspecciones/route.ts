import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const inspecciones = await db.inspeccion.findMany({
      include: {
        vehiculo: true,
        cliente: true,
        empleado: true,
      },
      orderBy: {
        fecha: "desc",
      },
    })

    return NextResponse.json(inspecciones)
  } catch (error) {
    console.log("[INSPECCIONES]", error)
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

    const inspeccion = await db.inspeccion.create({
      data: {
        userId,
        ...values,
      },
    })

    return NextResponse.json(inspeccion)
  } catch (error) {
    console.log("[INSPECCIONES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

