// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// export async function POST(req: Request) {
//     try {
//         const { userId } = await auth();
//         const data = await req.json();
//         if (!userId) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }
//         const marcas = await db.marca.create({
//             data: {
//                 userId,
//                 ...data,
//             },
//         });
//         return NextResponse.json(marcas);
//     } catch (error) {
//         console.log("[MARCA]", error);
//         return new NextResponse("Interal Error", { status: 500 });
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

    const marcas = await db.marca.findMany({
      orderBy: {
        descripcion: "asc",
      },
    })

    return NextResponse.json(marcas)
  } catch (error) {
    console.log("[MARCAS]", error)
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

    const marca = await db.marca.create({
      data: {
        ...values,
      },
    })

    return NextResponse.json(marca)
  } catch (error) {
    console.log("[MARCAS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

