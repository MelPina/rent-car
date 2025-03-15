"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "./FormEditMarca.form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormEditMarcaProps } from "./FromEditMarcas.types";
import { on } from "events";
import { toast } from "@/hooks/use-toast";

export function FormEditMarca(props: FormEditMarcaProps) {
    const { marcasData } = props;
    const { setOpenDialog } = props;
    const router = useRouter();

     const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          descripcion:  "",
          estado: false,
          Modelos:  "",
          Vehiculos:  "",
         
        }
      });
    const { isValid } = form.formState;
   
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setOpenDialog(false);
        try {
            await axios.patch(`/api/marca/${marcasData.id}/form`, values);
            toast({ title: "Marca modificada correctamente ✅" });
            router.refresh();
        } catch (error) {
            toast({
                title: "Something went wrong",
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Tesla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             
              <FormField
                control={form.control}
                name="Modelos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
    
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.trigger("Modelos");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatico">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
             
          
              <FormField
                control={form.control}
                name="Vehiculos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehículo</FormLabel>
    
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.trigger("Vehiculos");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el Vehículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sedan">Sedán</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="coupe">Coupé</SelectItem>
                        <SelectItem value="familiar">Familiar</SelectItem>
                        <SelectItem value="luxe">De luxe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />     
    
    
            </div>
    
            <Button type="submit" className="w-full mt-5" disabled={!isValid}>
             Editar
            </Button>
    
          </form>
        </Form >
    
      );
    
    }
