"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { RentaDevolucion, Vehiculo, Cliente, Empleado } from "@prisma/client"
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
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatDate } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

type RentaDevolucionWithRelations = RentaDevolucion & {
  vehiculo: Vehiculo
  cliente: Cliente
  empleado: Empleado
}

interface EditRentaDevolucionModalProps {
  isOpen: boolean
  onClose: () => void
  rentaDevolucion: RentaDevolucionWithRelations
  onSuccess: () => void
}

// Definir el esquema de validación
const formSchema = z.object({
  fechaRenta: z.date({
    required_error: "La fecha de renta es requerida",
  }),
  cantidadDias: z.coerce.number().min(1, "La cantidad de días debe ser al menos 1"),
  montoPorDia: z.coerce.number().min(1, "El monto por día debe ser al menos 1"),
  comentario: z.string().optional(),
})

export function EditRentaDevolucionModal({
  isOpen,
  onClose,
  rentaDevolucion,
  onSuccess,
}: EditRentaDevolucionModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Verificar si es una fecha por defecto (01/01/0001 o similar)
  const isDefaultDate = (date: Date) => {
    const dateObj = new Date(date)
    return dateObj.getFullYear() < 1970
  }

  // Verificar si una renta ha sido devuelta
  const isDevuelta = () => {
    return rentaDevolucion.fechaDevolucion && !isDefaultDate(rentaDevolucion.fechaDevolucion)
  }

  // Inicializar el formulario con los datos de la renta
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaRenta: new Date(rentaDevolucion.fechaRenta),
      cantidadDias: rentaDevolucion.cantidadDias,
      montoPorDia: rentaDevolucion.montoPorDia,
      comentario: rentaDevolucion.comentario || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Llamada a la API para actualizar la renta
      const response = await fetch(`/api/rentas-devoluciones/${rentaDevolucion.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar la renta")
      }

      toast({
        title: "Renta actualizada",
        description: "La renta ha sido actualizada correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al actualizar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la renta",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Renta</DialogTitle>
          <DialogDescription>
            Modifica los datos de la renta. {isDevuelta() && "Esta renta ya ha sido devuelta."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium mb-1">Vehículo</p>
            <p className="text-sm">
              {rentaDevolucion.vehiculo.descripcion} - {rentaDevolucion.vehiculo.noPlaca}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Cliente</p>
            <p className="text-sm">{rentaDevolucion.cliente.nombre}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Empleado</p>
            <p className="text-sm">{rentaDevolucion.empleado.nombre}</p>
          </div>
          {isDevuelta() && (
            <div>
              <p className="text-sm font-medium mb-1">Fecha de Devolución</p>
              <p className="text-sm">{formatDate(new Date(rentaDevolucion.fechaDevolucion))}</p>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fechaRenta"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Renta</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          disabled={isDevuelta()}
                        >
                          {field.value ? formatDate(field.value) : <span>Seleccionar fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || isDevuelta()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cantidadDias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de Días</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} disabled={isDevuelta()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="montoPorDia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto por Día ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} disabled={isDevuelta()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="comentario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Comentarios adicionales sobre la renta" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || isDevuelta()}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

