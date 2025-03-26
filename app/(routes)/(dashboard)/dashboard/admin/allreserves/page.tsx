// import { auth } from "@clerk/nextjs/server";

// import { isAdministrator } from "@/lib/isAdministrator";
// import { redirect } from "next/navigation";
// import { db } from "@/lib/db";
// import { TableReserves } from "../../../reserves/components/TableReserves";

// export default async function ReservesManagerPage() {
//   const {userId}= await auth();
//   if (!userId || !isAdministrator(userId)) {
//     return redirect("/");
//     }

//   const order = await db.rentaDevolucion.findMany({
//     where: {
//       userId: userId,
//     },
//     orderBy: {
//       fechaRenta: "desc",
//     },
//     include: {
//       empleado: true,
//       cliente: true,
//       vehiculo: true,
//     },
//   });
//   console.log(order);
//   return (
//     <div>
//       <div className="flex justify-between">
//         <h2 className="text-2xl font-bold">Gestiona los vehículos rentados</h2>
//       </div>
//       <br />
//         <div>

//         <TableReserves orders={order} />
//         </div>
//     </div>
//   );
// }


"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { RentaDevolucion, Vehiculo, Cliente, Empleado } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import { AddRentaDevolucionModal } from "./components/add-renta-devolucion-modal"
import { RentasDevolucionesTable } from "./components/rentas-devoluciones-table"

type RentaDevolucionWithRelations = RentaDevolucion & {
  vehiculo: Vehiculo
  cliente: Cliente
  empleado: Empleado
}

export default function RentasDevolucionesPage() {
  const [rentasDevoluciones, setRentasDevoluciones] = useState<RentaDevolucionWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchRentasDevoluciones = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/rentas-devoluciones")

      if (!response.ok) {
        throw new Error("Error al cargar las rentas y devoluciones")
      }

      const data = await response.json()
      setRentasDevoluciones(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRentasDevoluciones()
  }, [])

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
    fetchRentasDevoluciones()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestiona los vehículos rentados</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Renta
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <RentasDevolucionesTable
          rentasDevoluciones={rentasDevoluciones}
          onRentaDevolucionUpdated={fetchRentasDevoluciones}
        />
      )}

      <AddRentaDevolucionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}

