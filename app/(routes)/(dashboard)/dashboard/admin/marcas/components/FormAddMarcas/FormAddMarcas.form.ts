import { z } from "zod";
export const formSchema = z.object({
  descripcion:  z.string().min(2).max(50),
  estado : z.boolean(),
  Modelos:  z.string().min(2).max(50),
  Vehiculos:   z.string().min(2).max(50),
});


