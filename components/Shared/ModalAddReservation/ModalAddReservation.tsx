"use client";
import { ModalAddReservationProps } from "./ModalAddReservation.types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Car } from "@prisma/client";
import { CalendarSelector } from "./CalendarSelector";
import { addDays } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ModalAddReservation(props: ModalAddReservationProps) {
    const { car } = props;
    const [dateSelected, setDateSelected] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: new Date(),
        to: addDays(new Date(), 5),
    });
    const onReserveCar = async (car: Car, dateSelected: any) => { };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full mt-3">
                    Reservar vehículo
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Selecciona las fechas en las quieres alquilar el vehículo
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                    </AlertDialogDescription>
                       <CalendarSelector setDateSelected ={setDateSelected} carPriceDay={car.priceDay} />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onReserveCar(car, "")}>
                        Reservar vehículo
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}