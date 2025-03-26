import { Navbar } from '@/components/Shared/Navbar';
import React from 'react'
import { HeaderCars } from './components/HeaderCars';
import { FilterAndListCars } from './components/FilterAndListCars';
import { db } from '@/lib/db';

export default async function pageCars() {
    const vehiculos = await db.vehiculo.findMany({
        where: {
        // isPublish: true,
        },
        orderBy: {
        // createdAt: "desc",
        },
        });
    return (
        <div>
            <Navbar />
            <div className="p-6 mx-auto max-w-7xl">
                <HeaderCars />
               
                <div>
                    {/* <FilterAndListCars vehiculos={vehiculos} /> */}
                </div>
            </div>
        </div>
    );

}
