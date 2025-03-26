
import { Car } from "@prisma/client";

import Image from 'next/image'
import { Fuel, Gem, Users, Wrench } from "lucide-react";
import { CarsListProps } from "../admin/cars-manager/components/ListCars/ListCars.types";
import { ModalAddReservation } from "@/components/Shared/ModalAddReservation";


export function CarList(props: CarsListProps) {
    const { cars } = props;

    return (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {cars.map((car: Car) => {
                const {
                    priceDay,
                    photo,
                    CV,
                    engine,
                    id,
                    people,
                    name,
                    transmission,
                    type,
                } = car;
                // return <div key={car.id}>{car.name}</div>;
                return (
                    <div key={id} className="p-1 rounded-lg shadow-md hover:shadow-lg">
                        <Image
                            src={photo}
                            alt={name}
                            width={400}
                            height={600}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-3">
                            <div className="flex flex-col mb-3 gap-x-4">
                                <p className="text-xl min-h-16 lg:min-h-fit">{name}</p>
                                <p>{priceDay}$ /día</p>
                            </div>
                            <p className="flex items-center">
                                <Gem className="h-4 w-4 mr-2" strokeWidth={1} />
                                {type}
                            </p>
                            <p className="flex items-center">
                                <Wrench className="h-4 w-4 mr-2" strokeWidth={1} />
                                {transmission}
                            </p>
                            <p className="flex items-center">
                                <Users className="h-4 w-4 mr-2" strokeWidth={1} />
                                {people}
                            </p>
                            <p className="flex items-center">
                                <Fuel className="h-4 w-4 mr-2" strokeWidth={1} />
                                {engine}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-x-3">
                         <ModalAddReservation car={car} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}