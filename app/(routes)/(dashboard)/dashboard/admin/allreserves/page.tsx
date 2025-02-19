import { auth } from "@clerk/nextjs/server";

import { isAdministrator } from "@/lib/isAdministrator";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function ReservesManagerPage() {
  // const {userId}= auth();
  // if (!userId || !isAdministrator(userId)) {
  //   return redirect("/");
  //   }
    
    // const vehiculo = await db.vehiculo.findMany({
    // where: {
    // userId,
    // },
    // orderBy: {
    // createdAt: "desc",
    // },
    // });
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestiona los vehículos rentados</h2>
      
      </div>
    </div>
  );
}