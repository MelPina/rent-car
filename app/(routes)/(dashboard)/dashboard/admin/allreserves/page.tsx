import { auth } from "@clerk/nextjs/server";

import { isAdministrator } from "@/lib/isAdministrator";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TableReserves } from "../../../reserves/components/TableReserves";

export default async function ReservesManagerPage() {
  const {userId}= await auth();
  if (!userId || !isAdministrator(userId)) {
    return redirect("/");
    }

  const order = await db.rentaDevolucion.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      fechaRenta: "desc",
    },
    include: {
      empleado: true,
      cliente: true,
      vehiculo: true,
    },
  });
  console.log(order);
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestiona los vehículos rentados</h2>
      </div>
      <br />
        <div>

        <TableReserves orders={order} />
        </div>
    </div>
  );
}