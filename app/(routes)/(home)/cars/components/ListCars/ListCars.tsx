
"use-client";
import { Button } from "@/components/ui/button";
import { Fuel, Gem, Heart, Users, Wrench } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { Vehiculo } from "@prisma/client";
import Link from "next/link";
import { ListCarsProps } from "./ListCars.types";
import { auth } from "@clerk/nextjs/server";
export function ListCars(props: ListCarsProps) {
    const { vehiculos } = props;
    const userId = auth();
    if (!vehiculos) {
        return <p>Skeleton... </p>;
    }
    return (
        <>
            {vehiculos.length == 0 && (
                <p>No se han encontrado vehículos con estos filtros</p>
            )}
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {vehiculos.map((car: Vehiculo) => {
                    const { descripcion,
                        noChasis,
                        noMotor,
                        noPlaca,                       
                        tpCombustibleId,
                        estado,  id } = car
                    return (
                        <div key={id} className="p-1 rounded-lg shadow-md hover: shadow-lg">
                            <Image src={photo} alt="" />
                        </div>
                    )
                })}
            </div>
        </>
    )
}
