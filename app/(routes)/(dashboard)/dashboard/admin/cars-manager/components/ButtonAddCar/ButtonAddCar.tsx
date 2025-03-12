"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { FormAddCar } from "../FormAddCar";


export function ButtonAddCar() {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpenDialog(true)} >
         Registrar Vehículo
          <PlusCircle className="ml-2" />
        </Button>
      </DialogTrigger >
      <DialogContent>
        <DialogTitle>Registrar Vehículo</DialogTitle>
        <DialogHeader>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <FormAddCar setOpenDialog={setOpenDialog} />
      </DialogContent>
    </Dialog >
  );
}




