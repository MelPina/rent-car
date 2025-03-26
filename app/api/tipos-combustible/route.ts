import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const tiposCombustible = await db.tipoCombustible.findMany({
      orderBy: {
        descripcion: "asc",
      },
    })

    return NextResponse.json(tiposCombustible)
  } catch (error) {
    console.log("[TIPOS_COMBUSTIBLE]", error)
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

    const tipoCombustible = await db.tipoCombustible.create({
      data: {
        ...values,
      },
    })

    return NextResponse.json(tipoCombustible)
  } catch (error) {
    console.log("[TIPOS_COMBUSTIBLE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

