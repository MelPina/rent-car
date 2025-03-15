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
import { FormAddMarcas } from "../FormAddMarcas";


export function ButtonAddMarca() {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpenDialog(true)} >
         Registrar Marca
          <PlusCircle className="ml-2" />
        </Button>
      </DialogTrigger >
      <DialogContent>
        <DialogTitle>Registrar Marca</DialogTitle>
        <DialogHeader>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <FormAddMarcas setOpenDialog={setOpenDialog} />
      </DialogContent>
    </Dialog >
  );
}




