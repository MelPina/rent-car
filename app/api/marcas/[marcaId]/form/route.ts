import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function PATCH(
    req: Request,
    { params }: { params: { marcaId: string } }
) {
    try {
        const { userId } = await auth();
        const { marcaId } = params;
        const values = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const marca = await db.marca.update({
            where: {
                id: marcaId,
             
            },
            data: {
                ...values,
            },
        });
        return NextResponse.json(marca);
    } catch (error) {
        console.log("[Marca FORM ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}