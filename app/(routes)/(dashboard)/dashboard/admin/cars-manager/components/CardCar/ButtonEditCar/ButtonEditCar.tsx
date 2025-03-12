"use client";
import { Button } from "@/components/ui/button";
import { ButtonEditCarProps } from "./ButtonEditCar.types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { use, useState } from "react";
import { FormEditCar } from "../FormEditCar";

export function ButtonEditCar(props: ButtonEditCarProps) {
    const { carData } = props;
    const [openDialog, setOpenDialog] = useState(false);
    return (
        <Dialog open={openDialog}  onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpenDialog(true)} >
                    Editar
                    <Pencil className="w-4 h-4 ml-2" />
                </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogTitle>Editar Vehículo</DialogTitle>
                <DialogHeader>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
               <FormEditCar setOpenDialog={setOpenDialog} carData={carData} />
            </DialogContent>
        </Dialog>
        
    );
}

