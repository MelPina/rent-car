import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isProtectedRoute = createRouteMatcher(["/dashboard(/.*)"]);


export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()
        return NextResponse.next();
  })

export const config = {
    matcher: [
         "/((?!.*\\..*|next).*)","/","/(api|trpc)(.*)"
        // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // '/(api|trpc)(.*)',
    ],
};