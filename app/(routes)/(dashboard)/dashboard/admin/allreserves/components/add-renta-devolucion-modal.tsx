"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Vehiculo, Cliente, Empleado } from "@prisma/client"
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
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatDate } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface AddRentaDevolucionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// Definir el esquema de validación
const formSchema = z.object({
  vehiculoId: z.string().min(1, "El vehículo es requerido"),
  clienteId: z.string().min(1, "El cliente es requerido"),
  empleadoId: z.string().min(1, "El empleado es requerido"),
  fechaRenta: z.date({
    required_error: "La fecha de renta es requerida",
  }),
  cantidadDias: z.coerce.number().min(1, "La cantidad de días debe ser al menos 1"),
  montoPorDia: z.coerce.number().min(1, "El monto por día debe ser al menos 1"),
  comentario: z.string().optional(),
})

export function AddRentaDevolucionModal({ isOpen, onClose, onSuccess }: AddRentaDevolucionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState<Vehiculo[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  // Inicializar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiculoId: "",
      clienteId: "",
      empleadoId: "",
      fechaRenta: new Date(),
      cantidadDias: 1,
      montoPorDia: 0,
      comentario: "",
    },
  })

  // Cargar los datos necesarios
  const loadData = async () => {
    try {
      setDataLoaded(false)
      console.log("Cargando datos...")

      // Cargar vehículos
      const vehiculosResponse = await fetch("/api/vehiculos")
      if (!vehiculosResponse.ok) {
        throw new Error("Error al cargar los vehículos")
      }
      const vehiculosData = await vehiculosResponse.json()
      console.log("Vehículos cargados (total):", vehiculosData.length)
      setVehiculos(vehiculosData)

      // Cargar vehículos disponibles
      try {
        const disponiblesResponse = await fetch("/api/rentas-devoluciones/disponibles")
        if (disponiblesResponse.ok) {
          const disponiblesData = await disponiblesResponse.json()
          console.log("Vehículos disponibles:", disponiblesData.length)

          // Verificar qué vehículos están disponibles
          const disponiblesIds = disponiblesData.map((v: Vehiculo) => v.id)
          console.log("IDs de vehículos disponibles:", disponiblesIds)

          setVehiculosDisponibles(disponiblesData)
        } else {
          console.error("Error al cargar vehículos disponibles:", await disponiblesResponse.text())
          // No establecer vehículos disponibles si hay error
          setVehiculosDisponibles([])
        }
      } catch (error) {
        console.error("Error al cargar vehículos disponibles:", error)
        setVehiculosDisponibles([])
      }

      // Cargar clientes
      const clientesResponse = await fetch("/api/clientes")
      if (!clientesResponse.ok) {
        throw new Error("Error al cargar los clientes")
      }
      const clientesData = await clientesResponse.json()
      console.log("Clientes cargados:", clientesData.length)
      setClientes(clientesData)

      // Cargar empleados
      const empleadosResponse = await fetch("/api/empleados")
      if (!empleadosResponse.ok) {
        throw new Error("Error al cargar los empleados")
      }
      const empleadosData = await empleadosResponse.json()
      console.log("Empleados cargados:", empleadosData.length)
      setEmpleados(empleadosData)

      setDataLoaded(true)
      console.log("Datos cargados completamente")
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los datos necesarios",
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Verificar si el vehículo está disponible
      const isVehiculoDisponible = vehiculosDisponibles.some((v) => v.id === values.vehiculoId)

      if (!isVehiculoDisponible) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "El vehículo seleccionado no está disponible para renta",
        })
        return
      }

      // Llamada a la API para crear la renta
      const response = await fetch("/api/rentas-devoluciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          estado: true, // Renta activa
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al crear la renta: ${errorText}`)
      }

      toast({
        title: "Renta creada",
        description: "La renta ha sido creada correctamente",
      })

      form.reset()
      onSuccess()
    } catch (error) {
      console.error("Error al crear:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la renta",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Renta</DialogTitle>
          <DialogDescription>Ingrese los datos para crear una nueva renta de vehículo.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehiculoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!dataLoaded ? (
                          <div className="p-2 text-sm text-center text-muted-foreground">Cargando vehículos...</div>
                        ) : vehiculosDisponibles.length > 0 ? (
                          vehiculosDisponibles.map((vehiculo) => (
                            <SelectItem key={vehiculo.id} value={vehiculo.id}>
                              {vehiculo.descripcion} - {vehiculo.noPlaca}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-center text-muted-foreground">
                            No hay vehículos disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!dataLoaded ? (
                          <div className="p-2 text-sm text-center text-muted-foreground">Cargando clientes...</div>
                        ) : clientes.length > 0 ? (
                          clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nombre}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-center text-muted-foreground">
                            No hay clientes disponibles
                          </div>
                        )}
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
                name="empleadoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empleado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar empleado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!dataLoaded ? (
                          <div className="p-2 text-sm text-center text-muted-foreground">Cargando empleados...</div>
                        ) : empleados.length > 0 ? (
                          empleados.map((empleado) => (
                            <SelectItem key={empleado.id} value={empleado.id}>
                              {empleado.nombre}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-center text-muted-foreground">
                            No hay empleados disponibles
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          >
                            {field.value ? formatDate(field.value) : <span>Seleccionar fecha</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cantidadDias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de Días</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
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
                      <Input type="number" min="0" step="0.01" {...field} />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Renta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

