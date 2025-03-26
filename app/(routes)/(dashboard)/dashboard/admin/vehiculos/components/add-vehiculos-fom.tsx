"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadButton } from "@/utils/uploadthing"
import { useToast } from "@/hooks/use-toast"
import type { TipoVehiculo, Marca, Modelo, TipoCombustible } from "@prisma/client"

// Definir el esquema de validación
const formSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  noChasis: z.string().min(1, "El número de chasis es requerido"),
  noMotor: z.string().min(1, "El número de motor es requerido"),
  noPlaca: z.string().min(1, "El número de placa es requerido"),
  tpVehiculoId: z.string().min(1, "El tipo de vehículo es requerido"),
  marcaId: z.string().min(1, "La marca es requerida"),
  modeloId: z.string().min(1, "El modelo es requerido"),
  tpCombustibleId: z.string().min(1, "El tipo de combustible es requerido"),
  photo: z.string().min(1, "La foto es requerida"),
  estado: z.boolean().default(true),
})

interface AddVehiculoFormProps {
  setOpenDialog: (open: boolean) => void
  onSuccess?: () => void
}

export function AddVehiculoForm({ setOpenDialog, onSuccess }: AddVehiculoFormProps) {
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [tiposCombustible, setTiposCombustible] = useState<TipoCombustible[]>([])
  const [filteredModelos, setFilteredModelos] = useState<Modelo[]>([])

  const router = useRouter()
  const { toast } = useToast()

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
  })

  // Observar cambios en el campo marcaId para filtrar modelos
  const marcaId = form.watch("marcaId")

  useEffect(() => {
    if (marcaId) {
      const modelosFiltrados = modelos.filter((modelo) => modelo.idMarca === marcaId)
      setFilteredModelos(modelosFiltrados)

      // Resetear el modelo seleccionado si la marca cambia
      form.setValue("modeloId", "")
    }
  }, [marcaId, modelos, form])

  // Cargar los datos necesarios
  const loadSelectData = async () => {
    try {
      // Cargar tipos de vehículo
      const tiposResponse = await fetch("/api/tipos-vehiculo")
      if (tiposResponse.ok) {
        const tiposData = await tiposResponse.json()
        setTiposVehiculo(tiposData.filter((tipo: TipoVehiculo) => tipo.estado))
      }

      // Cargar marcas
      const marcasResponse = await fetch("/api/marcas")
      if (marcasResponse.ok) {
        const marcasData = await marcasResponse.json()
        setMarcas(marcasData.filter((marca: Marca) => marca.estado))
      }

      // Cargar modelos
      const modelosResponse = await fetch("/api/modelos")
      if (modelosResponse.ok) {
        const modelosData = await modelosResponse.json()
        setModelos(modelosData.filter((modelo: Modelo) => modelo.estado))
      }

      // Cargar tipos de combustible
      const combustiblesResponse = await fetch("/api/tipos-combustible")
      if (combustiblesResponse.ok) {
        const combustiblesData = await combustiblesResponse.json()
        setTiposCombustible(combustiblesData.filter((tipo: TipoCombustible) => tipo.estado))
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos necesarios",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadSelectData()
  }, [])

  const { isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpenDialog(false)
    try {
      await axios.post("/api/vehiculos", values)
      toast({
        title: "Vehículo Registrado ✅",
      })
      router.refresh()
      // Call the onSuccess callback to refresh the parent component
      if (onSuccess) {
        onSuccess()
      }
    } catch {
      toast({
        title: "Algo salió mal",
        description: "No se pudo registrar el vehículo",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota Corolla 2022" {...field} />
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
                  <Input placeholder="1HGCM82633A123456" {...field} />
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
                  <Input placeholder="1234XYZ5678" {...field} />
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
                  <Input placeholder="ABC-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tpVehiculoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Vehículo</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.trigger("tpVehiculoId")
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de vehículo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposVehiculo.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marcaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.trigger("marcaId")
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {marcas.map((marca) => (
                      <SelectItem key={marca.id} value={marca.id}>
                        {marca.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modeloId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.trigger("modeloId")
                  }}
                  defaultValue={field.value}
                  disabled={!marcaId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={marcaId ? "Seleccionar modelo" : "Seleccione una marca primero"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredModelos.map((modelo) => (
                      <SelectItem key={modelo.id} value={modelo.id}>
                        {modelo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tpCombustibleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Combustible</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.trigger("tpCombustibleId")
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de combustible" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposCombustible.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.descripcion}
                      </SelectItem>
                    ))}
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
                    <p className="text-sm">Imagen cargada correctamente!</p>
                  ) : (
                    <UploadButton
                      className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                      {...field}
                      endpoint="photo"
                      onClientUploadComplete={(res) => {
                        form.setValue("photo", res?.[0].url)
                        setPhotoUploaded(true)
                        form.trigger("photo")
                      }}
                      onUploadError={(error: Error) => {
                        console.log(error)
                      }}
                    />
                  )}
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
    </Form>
  )
}

