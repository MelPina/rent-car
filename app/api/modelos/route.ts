// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     try {
//         const { userId } = await auth();
//         if (!userId) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

      
//         const models = await db.modelo.findMany();

//         return NextResponse.json(models);
//     } catch (error) {
//         console.log("[MODELS GET]", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const modelos = await db.modelo.findMany({
      include: {
        marca: true,
      },
      orderBy: {
        descripcion: "asc",
      },
    })

    return NextResponse.json(modelos)
  } catch (error) {
    console.log("[MODELOS]", error)
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

    const modelo = await db.modelo.create({
      data: {
        ...values,
      },
    })

    return NextResponse.json(modelo)
  } catch (error) {
    console.log("[MODELOS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}


