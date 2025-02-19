import { RentaDevolucion, Empleado, Cliente, Vehiculo } from "@prisma/client";

export type TableReservesProps = {
  orders: (RentaDevolucion & {
    empleado: Empleado;
    cliente: Cliente;   
    vehiculo: Vehiculo; 
  })[];
};
