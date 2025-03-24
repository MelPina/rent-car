"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Modelo, Marca } from "@prisma/client"
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

type ModeloWithMarca = Modelo & {
  marca: Marca
}

interface EditModeloModalProps {
  isOpen: boolean
  onClose: () => void
  modelo: ModeloWithMarca
  onSuccess: () => void
}

// Definir el esquema de validación
const formSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  idMarca: z.string().min(1, "La marca es requerida"),
  estado: z.boolean(),
})

export function EditModeloModal({ isOpen, onClose, modelo, onSuccess }: EditModeloModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [marcas, setMarcas] = useState<Marca[]>([])

  // Inicializar el formulario con los datos del modelo
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: modelo.descripcion,
      idMarca: modelo.idMarca,
      estado: modelo.estado,
    },
  })

  // Cargar las marcas para el select
  const loadMarcas = async () => {
    try {
      const response = await fetch("/api/marcas")
      if (!response.ok) {
        throw new Error("Error al cargar las marcas")
      }
      const data = await response.json()
      setMarcas(data)
    } catch (error) {
      console.error("Error al cargar marcas:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las marcas",
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMarcas()
    }
  }, [isOpen])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Llamada a la API para actualizar el modelo
      const response = await fetch(`/api/modelos/${modelo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el modelo")
      }

      toast({
        title: "Modelo actualizado",
        description: "El modelo ha sido actualizado correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al actualizar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el modelo",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Modelo</DialogTitle>
          <DialogDescription>Modifica los datos del modelo y guarda los cambios.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="idMarca"
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

