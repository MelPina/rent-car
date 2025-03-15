"use client";
import { Button } from "@/components/ui/button";
import { ButtonEditMarcaProps } from "./ButtonEditMarca.types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import {  useState } from "react";
import { FormEditMarca } from "../FormEditMarca";

export function ButtonEditMarca(props: ButtonEditMarcaProps) {
    const { marcaData } = props;
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
            <DialogTitle>Editar Marca</DialogTitle>
                <DialogHeader>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
               <FormEditMarca setOpenDialog={setOpenDialog} marcasData={marcaData} />
            </DialogContent>
        </Dialog>
        
    );
}

