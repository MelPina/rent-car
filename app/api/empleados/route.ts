import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const empleados = await db.empleado.findMany({
      orderBy: {
        nombre: "asc",
      },
    })

    return NextResponse.json(empleados)
  } catch (error) {
    console.log("[EMPLEADOS]", error)
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

    const empleado = await db.empleado.create({
      data: {
        ...values,
      },
    })

    return NextResponse.json(empleado)
  } catch (error) {
    console.log("[EMPLEADOS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

