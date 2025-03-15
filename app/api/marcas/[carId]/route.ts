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
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const marca = await db.marca.update({
            where: {
                id: marcaId,
                
            },
            data: {
                
            },
        });
        return NextResponse.json(marca);
    } catch (error) {
        console.log("[CAR ID PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });

    }
}

export async function DELETE(
    req: Request,
    {
        params,
    }: {
        params: { marcaId: string };
    }
) {
    try {
        const { userId } = await auth();
        const { marcaId } = params;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const deletedMarca = await db.marca.delete({
            where: {
                id: marcaId,
            },
        });
        return NextResponse.json(deletedMarca);
    } catch (error) {
        console.log("[DELETE MARCA ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}