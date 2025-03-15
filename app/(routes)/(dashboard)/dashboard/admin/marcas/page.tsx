import { auth } from "@clerk/nextjs/server";
import { isAdministrator } from "@/lib/isAdministrator";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListMarcas } from "./components/ListMarcas";
import { ButtonAddMarca } from "./components/ButtonAddMarca";

export default async function MarcasManagerPage() {
  const { userId } = await auth();
  if (!userId || !isAdministrator(userId)) {
    return redirect("/");
  }

  const marca = await db.marca.findMany({

  });

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestiona las Marcas</h2>
        <ButtonAddMarca />
      </div>
     <br />
      <div>
        <ListMarcas marcas={marca} />
      </div>
    </div>
  );
}