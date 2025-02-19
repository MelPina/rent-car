
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  // FormDescription,  
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formSchema } from "./FormAddCar.form";
import { FormAddCarProps } from "./FormAddCar.types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"
import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";

export function FormAddCar(props: FormAddCarProps) {
  const { setOpenDialog } = props;
  const router = useRouter();
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: "",
      noChasis: "",
      noMotor: "",
      noPlaca: "",
      tpVehiculoId: "",
      marcaId: "",
      modeloId: "",
      tpCombustibleId: "",
      photo: "",
      estado: true,
    },
  });
  const { toast } = useToast()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpenDialog(false);
    try {
      await axios.post('/api/car', values);
      toast({
        title: "Car created ✅",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Toyota Corolla 2022" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="noChasis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Chasis</FormLabel>
              <FormControl>
                <Input placeholder="Ej. 1HGCM82633A123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="noMotor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Motor</FormLabel>
              <FormControl>
                <Input placeholder="Ej. 1234XYZ5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="noPlaca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Placa</FormLabel>
              <FormControl>
                <Input placeholder="Ej. ABC-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                {photoUploaded ? (
                  <p className="text-sm">Image cargada correctamente!</p>
                ) : (
                  <UploadButton
                    className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                    {...field}
                    endpoint="photo"
                    onClientUploadComplete={(res) => {
                      form.setValue("photo", res?.[0].url);
                      setPhotoUploaded(true);
                    }}
                    onUploadError={(error: Error) => {
                      console.log(error);
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-5">Registrar Vehículo</Button>
      </form>
    </Form>
  );
}
