"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formSchema } from "./FormAddMarcas.form"
import type { FormAddMarcasProps } from "./FormAddMarcas.types"
import { useToast } from "@/hooks/use-toast"

interface Modelo {
  id: string
  idMarca: string
  descripcion: string
  estado: boolean
}
interface Vehículos {
  id: string  
  name: string
  
}

export function FormAddMarcas(props: FormAddMarcasProps) {
  const { setOpenDialog } = props
  const router = useRouter()
  const { toast } = useToast()
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [vehículos, setVehículos] = useState<Vehículos[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch modelos from the API
  useEffect(() => {
    const fetchModelos = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("/api/modelos")
        setModelos(response.data)
      } catch (error) {
        console.error("Error fetching modelos:", error)
        toast({
          title: "Error al cargar los modelos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchModelos()
  }, [toast])

  useEffect(() => {
    const fetchVehiculos = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("/api/car")
        setVehículos(response.data)
      } catch (error) {
        console.error("Error fetching modelos:", error)
        toast({
          title: "Error al cargar los modelos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehiculos()
  }, [toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: "",
      estado: false,
      Modelos: "",
      Vehiculos: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpenDialog(false)
    try {
      const formattedValues = {
        descripcion: values.descripcion,
        estado: values.estado,
        Modelos: values.Modelos ? [values.Modelos] : [], 
        Vehiculos: values.Vehiculos ? [values.Vehiculos] : [] 
    };
      await axios.post("/api/marcas", formattedValues)
      toast({
        title: "Marca Registrada ✅",
      })
      router.refresh()
    } catch {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      })
    }
    console.log(values)
  }

  const { isValid } = form.formState

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
                  <Input placeholder="Nombre de la marca" {...field} />
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
                    field.onChange(value)
                    form.trigger("Modelos")
                  }}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "Cargando modelos..." : "Selecciona el modelo"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {modelos.length > 0 ? (
                      modelos
                        .filter((modelo) => modelo.id && modelo.id.trim() !== "") 
                        .map((modelo) => (
                          <SelectItem key={modelo.id} value={modelo.id}>
                            {modelo.descripcion || `Modelo ${modelo.id}`}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="placeholder" disabled>
                        {isLoading ? "Cargando..." : "No hay modelos disponibles"}
                      </SelectItem>
                    )}
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
                    field.onChange(value)
                    form.trigger("Vehiculos")
                  }}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "Cargando vehículos..." : "Selecciona el vehículo"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehículos.length > 0 ? (
                      vehículos
                        .filter((vehículos) => vehículos.id && vehículos.id.trim() !== "") 
                        .map((vehículos) => (
                          <SelectItem key={vehículos.id} value={vehículos.id}>
                            {vehículos.name || `Vehículos ${vehículos.id}`}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="placeholder" disabled>
                        {isLoading ? "Cargando..." : "No hay vehículos disponibles"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-5" disabled={!isValid}>
          Agregar
        </Button>
      </form>
    </Form>
  )
}

