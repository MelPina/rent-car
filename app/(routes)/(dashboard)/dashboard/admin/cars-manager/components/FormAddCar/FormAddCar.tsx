"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "./FormAddCar.form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { FormAddCarProps } from "./FormAddCar.types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"

export function FormAddCar(props: FormAddCarProps) {
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const { setOpenDialog } = props;
  const router = useRouter();
  const { toast } = useToast()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      CV: "",
      transmission: "",
      people: "",
      photo: "",
      engine: "",
      type: "",
      priceDay: "",
      isPublish: false,
    }
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpenDialog(false);
    try {
      await axios.post('/api/car', values);
      toast({
        title: "Vehículo Registrado ✅",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
    console.log(values);
  };

  const { isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Tesla Model S Plaid" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="CV"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Power</FormLabel>
                <FormControl>
                  <Input placeholder="150 CV" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>

                <Select
                 onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger("transmission"); 
                }}                
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of car" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automático</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="people"
            render={({ field }) => (
              <FormItem>
                <FormLabel>People</FormLabel>

                <Select
                 onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger("people"); 
                }}    
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the quantity of people" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="engine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engine</FormLabel>

                <Select
                 onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger("engine"); 
                }}    
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the engine of the car" />                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>

                    <SelectItem value="gasoil">Gasolina</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Eléctrico</SelectItem>
                    <SelectItem value="hybrid">Híbrido</SelectItem>

                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>

                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.trigger("type"); 
                  }}    
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of car" />
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
                        form.trigger("photo");
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

          <FormField
            control={form.control}
            name="priceDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Day</FormLabel>
                <FormControl>
                  <Input placeholder="20$" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        </div>
        
        <Button type="submit" className="w-full mt-5" disabled={!isValid}>
          Agregar
        </Button>

      </form>
    </Form >
    
  );

}



// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Form,
//   FormControl,
//   // FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { formSchema } from "./FormAddCar.form";
// import { FormAddCarProps } from "./FormAddCar.types";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast"
// import { useState } from "react";
// import { UploadButton } from "@/utils/uploadthing";

// export function FormAddCar(props: FormAddCarProps) {
//   const { setOpenDialog } = props;
//   const router = useRouter();
//   const [photoUploaded, setPhotoUploaded] = useState(false)
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       descripcion: "",
//       noChasis: "",
//       noMotor: "",
//       noPlaca: "",
//       tpVehiculoId: "",
//       marcaId: "",
//       modeloId: "",
//       tpCombustibleId: "",
//       photo: "",
//       estado: true,
//     },
//   });
//   const { toast } = useToast()

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setOpenDialog(false);
//     try {
//       await axios.post('/api/car', values);
//       toast({
//         title: "Car created ✅",
//       });
//       router.refresh();
//     } catch (error) {
//       toast({
//         title: "Something went wrong",
//         variant: "destructive",
//       });
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="descripcion"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Descripción</FormLabel>
//               <FormControl>
//                 <Input placeholder="Ej. Toyota Corolla 2022" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="noChasis"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>No. Chasis</FormLabel>
//               <FormControl>
//                 <Input placeholder="Ej. 1HGCM82633A123456" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="noMotor"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>No. Motor</FormLabel>
//               <FormControl>
//                 <Input placeholder="Ej. 1234XYZ5678" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="noPlaca"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>No. Placa</FormLabel>
//               <FormControl>
//                 <Input placeholder="Ej. ABC-1234" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* <FormField
//           control={form.control}
//           name="photo"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Imagen</FormLabel>
//               <FormControl>
//                 {photoUploaded ? (
//                   <p className="text-sm">Image cargada correctamente!</p>
//                 ) : (
//                   <UploadButton
//                     className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
//                     {...field}
//                     endpoint="photo"
//                     onClientUploadComplete={(res) => {
//                       form.setValue("photo", res?.[0].url);
//                       setPhotoUploaded(true);
//                     }}
//                     onUploadError={(error: Error) => {
//                       console.log(error);
//                     }}
//                   />
//                 )}
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         /> */}

//         <Button type="submit" className="w-full mt-5">Registrar Vehículo</Button>
//       </form>
//     </Form>
//   );
// }
