import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

      
        const models = await db.modelo.findMany();

        return NextResponse.json(models);
    } catch (error) {
        console.log("[MODELS GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
