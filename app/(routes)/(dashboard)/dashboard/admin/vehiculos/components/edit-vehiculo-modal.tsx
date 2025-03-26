"use client"

import React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Vehiculo, TipoVehiculo, Marca, Modelo, TipoCombustible } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"

type VehiculoWithRelations = Vehiculo & {
  tpVehiculo: TipoVehiculo
  marca: Marca
  modelo: Modelo
  tpCombustible: TipoCombustible
}

interface EditVehiculoModalProps {
  isOpen: boolean
  onClose: () => void
  vehiculo: VehiculoWithRelations
  onSuccess: () => void
}

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
  estado: z.boolean(),
  photo: z.string().min(1, "La foto es requerida"),
})

export function EditVehiculoModal({ isOpen, onClose, vehiculo, onSuccess }: EditVehiculoModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculo[]>([])
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [tiposCombustible, setTiposCombustible] = useState<TipoCombustible[]>([])

  // Inicializar el formulario con los datos del vehículo
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: vehiculo.descripcion,
      noChasis: vehiculo.noChasis,
      noMotor: vehiculo.noMotor,
      noPlaca: vehiculo.noPlaca,
      tpVehiculoId: vehiculo.tpVehiculoId,
      marcaId: vehiculo.marcaId,
      modeloId: vehiculo.modeloId,
      tpCombustibleId: vehiculo.tpCombustibleId,
      estado: vehiculo.estado,
      photo: vehiculo.photo,
    },
  })

  // Función para cargar los datos de los selects
  // En una implementación real, estos datos se cargarían desde la API
  const loadSelectData = async () => {
    try {
      // Aquí cargarías los datos reales desde tu API
      // Por ahora, usamos datos de ejemplo
      setTiposVehiculo([{ id: vehiculo.tpVehiculoId, descripcion: vehiculo.tpVehiculo.descripcion, estado: true }])
      setMarcas([{ id: vehiculo.marcaId, descripcion: vehiculo.marca.descripcion, estado: true }])
      setModelos([
        { id: vehiculo.modeloId, descripcion: vehiculo.modelo.descripcion, estado: true, idMarca: vehiculo.marcaId },
      ])
      setTiposCombustible([
        { id: vehiculo.tpCombustibleId, descripcion: vehiculo.tpCombustible.descripcion, estado: true },
      ])
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los datos necesarios",
      })
    }
  }

  // Cargar datos cuando se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      loadSelectData()
    }
  }, [isOpen])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Llamada a la API para actualizar el vehículo
      const response = await fetch(`/api/vehiculos/${vehiculo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el vehículo")
      }

      toast({
        title: "Vehículo actualizado",
        description: "El vehículo ha sido actualizado correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al actualizar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el vehículo",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Vehículo</DialogTitle>
          <DialogDescription>Modifica los datos del vehículo y guarda los cambios.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="noMotor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Motor</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tpVehiculoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Vehículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="modeloId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modelos.map((modelo) => (
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar combustible" />
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
            </div>

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la Foto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Estado Activo</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

