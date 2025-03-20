import { z } from "zod"

export const formSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  estado: z.boolean().default(false),
  Modelos: z.string().min(1, "Debe seleccionar un modelo"),
  Vehiculos: z.string().min(1, "Debe seleccionar un vehículo"),
})
