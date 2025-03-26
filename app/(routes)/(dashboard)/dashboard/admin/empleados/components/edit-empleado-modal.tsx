"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Empleado } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { validationCedula } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"

interface EditEmpleadoModalProps {
  isOpen: boolean
  onClose: () => void
  empleado: Empleado
  onSuccess: () => void
}

// Definir el esquema de validación
const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  cedula: z
    .string()
    .min(1, "La cédula es requerida")
    .refine((cedula) => validationCedula(cedula), {
      message: "La cédula ingresada no es válida",
    }),
  tandaLabor: z.string().min(1, "La tanda laboral es requerida"),
  porcientoComision: z.coerce
    .number()
    .min(0, "La comisión no puede ser negativa")
    .max(100, "La comisión no puede ser mayor a 100%"),
  fechaIngreso: z.string().min(1, "La fecha de ingreso es requerida"),
  estado: z.boolean(),
})


export function EditEmpleadoModal({ isOpen, onClose, empleado, onSuccess }: EditEmpleadoModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Formatear la fecha para el input date
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Inicializar el formulario con los datos del empleado
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: empleado.nombre,
      cedula: empleado.cedula,
      tandaLabor: empleado.tandaLabor,
      porcientoComision: empleado.porcientoComision,
      fechaIngreso: formatDate(new Date(empleado.fechaIngreso)),
      estado: empleado.estado,
    },
  })

  useEffect(() => {
    if (empleado) {
      form.reset({
        nombre: empleado.nombre,
        cedula: empleado.cedula,
        tandaLabor: empleado.tandaLabor,
        porcientoComision: empleado.porcientoComision,
        fechaIngreso: formatDate(new Date(empleado.fechaIngreso)),
        estado: empleado.estado,
      })
    }
  }, [empleado, form])
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Llamada a la API para actualizar el empleado
      const response = await fetch(`/api/empleados/${empleado.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          fechaIngreso: new Date(values.fechaIngreso),
        }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el empleado")
      }

      toast({
        title: "Empleado actualizado",
        description: "El empleado ha sido actualizado correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al actualizar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el empleado",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Empleado</DialogTitle>
          <DialogDescription>Modifica los datos del empleado y guarda los cambios.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula</FormLabel>
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
                name="tandaLabor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanda Laboral</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tanda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Matutina">Matutina</SelectItem>
                        <SelectItem value="Vespertina">Vespertina</SelectItem>
                        <SelectItem value="Nocturna">Nocturna</SelectItem>
                        <SelectItem value="Mixta">Mixta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="porcientoComision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentaje de Comisión</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fechaIngreso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Ingreso</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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

