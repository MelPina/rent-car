

"use client";
import { Vehiculo } from "@prisma/client";
import { useEffect, useState } from "react";
import { FiltersAndListCarsProps } from "./FilterAndListCars.types";
import { ListCars } from "../ListCars";

export function FilterAndListCars(props: FiltersAndListCarsProps) {
    const { vehiculos } = props;
    return (
        <div>
            <p>Filters cars ... </p>
            <ListCars vehiculos={vehiculos}/>
        </div>
    )
}