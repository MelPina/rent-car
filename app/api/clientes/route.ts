import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const clientes = await db.cliente.findMany({
      orderBy: {
        nombre: "asc",
      },
    })

    return NextResponse.json(clientes)
  } catch (error) {
    console.log("[CLIENTES]", error)
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

    const cliente = await db.cliente.create({
      data: {
        ...values,
      },
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.log("[CLIENTES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

