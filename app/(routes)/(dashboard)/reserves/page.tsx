import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Link } from "lucide-react";
import { redirect } from "next/navigation";
import { TableReserves } from "./components/TableReserves";


export default async function pageReserves() {
    const { userId } = auth();
    // if (!userId) {
    //     return redirect("/");
    // }
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
            <h1 className="mb-4 text-3x1">Página de Reservas</h1>
            {order.length == 0 ? (
                <div className="flex flex-col justify-center gap-4">
                    <h2 className="text-xl">No tienes ningún pedido</h2>
                    <p>Haz tus pedidos a través de la página de vehículos</p>
                    <Link href="/cars">
                        <Button>Lista de vehículos</Button>
                    </Link>
                </div>
            ) : (
               <TableReserves orders={order}/>
            )}
        </div>
    );
}

  

