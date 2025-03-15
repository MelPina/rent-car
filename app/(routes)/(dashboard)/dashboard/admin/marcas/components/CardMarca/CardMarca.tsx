"use client";
import { Button } from "@/components/ui/button";

import { Trash} from "lucide-react";
import { useRouter } from "next/navigation";
import { ButtonEditMarca } from "./ButtonEditMarca";
import { CardMarcaProps } from "./CardMarca.types";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
export function CardMarca(props: CardMarcaProps) {
    const { marca } = props;
    const router = useRouter();

    const deleteMarca = async () => {
        try {
            await axios.delete(`/api/marcas/${marca.id}`);
            toast({ title: "Marca deleted" });
            router.refresh();
        } catch (error) {
            toast({
                title: "Something went wrong",
                variant: "destructive",
            });
        }
    };

    
    return (
        <div className="relative p-1 bg-white rounded-lg shadow-md hover:shadow-lg">

            <div className="relative p-3">
                <div className="flex flex-col mb-3 gap-x-4">
                    <p className="text-xl min-h-16 lg:min-h-fit">{marca.descripcion}</p>                    
                </div>
               
                <div className="flex justify-between mt-3 gap-x-4">
                    <Button variant="outline" onClick={(deleteMarca)}>
                        Eliminar
                        <Trash className="w-4 h-4 ml-2" />
                    </Button>
                     <ButtonEditMarca marcaData={marca} />
                </div>
               
            </div >

        </div >

    );
}