import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const data = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const marcas = await db.marca.create({
            data: {
                userId,
                ...data,
            },
        });
        return NextResponse.json(marcas);
    } catch (error) {
        console.log("[MARCA]", error);
        return new NextResponse("Interal Error", { status: 500 });
    }
}