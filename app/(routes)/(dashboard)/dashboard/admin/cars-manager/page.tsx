import { auth } from "@clerk/nextjs/server";
import { ButtonAddCar } from "./components/ButtonAddCar";
import { isAdministrator } from "@/lib/isAdministrator";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TableCars } from "./components/TableCars/TableCars";

export default async function CarsManagerPage() {
  const {userId}= await auth();
  if (!userId || !isAdministrator(userId)) {
    return redirect("/");
    }
    
  const vehiculo = await db.vehiculo.findMany({
    where: {
      userId: userId,
  },
   include: {

          tpVehiculo: true,
          marca: true,
          modelo: true,
          tpCombustible: true,
  },
   
  });
  
  
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestiona tus vehículos</h2>
        <ButtonAddCar/>
      </div>
      <div>
         {/* <TableCars vehiculos={vehiculo} />  */}
      </div>
    </div>
  );
}