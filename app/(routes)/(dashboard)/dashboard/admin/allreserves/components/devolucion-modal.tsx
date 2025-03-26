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

interface DevolucionModalProps {
  isOpen: boolean
  onClose: () => void
  rentaDevolucion: RentaDevolucionWithRelations
  onSuccess: () => void
}

// Definir el esquema de validación
const formSchema = z.object({
  fechaDevolucion: z.date({
    required_error: "La fecha de devolución es requerida",
  }),
  comentario: z.string().optional(),
})

export function DevolucionModal({ isOpen, onClose, rentaDevolucion, onSuccess }: DevolucionModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Inicializar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaDevolucion: new Date(),
      comentario: rentaDevolucion.comentario || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Llamada a la API para registrar la devolución
      const response = await fetch(`/api/rentas-devoluciones/${rentaDevolucion.id}/devolucion`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Error al registrar la devolución")
      }

      toast({
        title: "Devolución registrada",
        description: "La devolución ha sido registrada correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al registrar devolución:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la devolución",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calcular días transcurridos desde la renta hasta hoy
  const calcularDiasTranscurridos = () => {
    const fechaRenta = new Date(rentaDevolucion.fechaRenta)
    const hoy = new Date()
    const diferencia = hoy.getTime() - fechaRenta.getTime()
    return Math.max(1, Math.ceil(diferencia / (1000 * 3600 * 24)))
  }

  const diasTranscurridos = calcularDiasTranscurridos()
  const diasContratados = rentaDevolucion.cantidadDias
  const hayRetraso = diasTranscurridos > diasContratados

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Devolución</DialogTitle>
          <DialogDescription>Registre la devolución del vehículo.</DialogDescription>
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
            <p className="text-sm font-medium mb-1">Fecha de Renta</p>
            <p className="text-sm">{formatDate(new Date(rentaDevolucion.fechaRenta))}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Días Contratados</p>
            <p className="text-sm">{rentaDevolucion.cantidadDias}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Días Transcurridos</p>
            <p className={`text-sm ${hayRetraso ? "text-destructive font-medium" : ""}`}>
              {diasTranscurridos} {hayRetraso && `(${diasTranscurridos - diasContratados} días de retraso)`}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Monto Total</p>
            <p className="text-sm">${(rentaDevolucion.montoPorDia * diasTranscurridos).toFixed(2)}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fechaDevolucion"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Devolución</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                        disabled={(date) => date < new Date(rentaDevolucion.fechaRenta)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comentario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Comentarios adicionales sobre la devolución"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar Devolución"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

