import { auth } from "@clerk/nextjs/server";
import { ButtonAddCar } from "./components/ButtonAddCar";
import { isAdministrator } from "@/lib/isAdministrator";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListCars } from "./components/ListCars";
import ExportButtonsCar from "./components/ExportButtosCar/ExportButtonsCar";

export default async function CarsManagerPage() {
  const {userId}= await auth();
  if (!userId || !isAdministrator(userId)) {
    return redirect("/");
    }
    
  const car = await db.car.findMany({
    where: {
      userId: userId,
  },
    orderBy: {
      createdAt: "desc",      
    }
  });
  
  console.log(car);
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestiona tus vehículos</h2>
  
        <div className="flex items-center space-x-4">
        <br></br>
        <ExportButtonsCar />
        <ButtonAddCar />
      </div>
      </div>
      <div>
        <ListCars cars={car}/>
         {/* <TableCars vehiculos={vehiculo} />  */}
      </div>
    </div>
  );
}