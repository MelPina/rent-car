import { z } from "zod";  

export const formSchema = z.object({  
    descripcion: z.string().min(3, "La descripción debe tener al menos 3 caracteres").max(100, "Máximo 100 caracteres"),  
    noChasis: z.string().min(5, "El número de chasis es requerido").max(30, "Máximo 30 caracteres"),  
    noMotor: z.string().min(5, "El número de motor es requerido").max(30, "Máximo 30 caracteres"),  
    noPlaca: z.string().regex(/^[A-Z]{3}-\d{4}$/, "Formato inválido, ej. ABC-1234"),  
    tpVehiculoId: z.string().min(1, "El tipo de vehículo es requerido"),  
    marcaId: z.string().min(1, "La marca es requerida"),  
    modeloId: z.string().min(1, "El modelo es requerido"),  
    tpCombustibleId: z.string().min(1, "El tipo de combustible es requerido"),  
    estado: z.boolean(),
  });