"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Marca } from "@prisma/client"
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
import { toast } from "@/hooks/use-toast"

interface EditMarcaModalProps {
  isOpen: boolean
  onClose: () => void
  marca: Marca
  onSuccess: () => void
}

// Definir el esquema de validación
const formSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  estado: z.boolean(),
})

export function EditMarcaModal({ isOpen, onClose, marca, onSuccess }: EditMarcaModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Inicializar el formulario con los datos de la marca
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: marca.descripcion,
      estado: marca.estado,
    },
  })

  useEffect(() => {
      if (marca) {
        form.reset({
          descripcion: marca.descripcion,
          estado: marca.estado,
        })
      }
    }, [marca, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      // Llamada a la API para actualizar la marca
      const response = await fetch(`/api/marcas/${marca.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar la marca")
      }

      toast({
        title: "Marca actualizada",
        description: "La marca ha sido actualizada correctamente",
      })

      onSuccess()
    } catch (error) {
      console.error("Error al actualizar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la marca",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Marca</DialogTitle>
          <DialogDescription>Modifica los datos de la marca y guarda los cambios.</DialogDescription>
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

