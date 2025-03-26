import {   TipoVehiculo, Marca, Modelo, TipoCombustible } from "@prisma/client";

export type TableCarsProps = {
  vehiculos: ( {    
    tpVehiculo: TipoVehiculo;
    marca: Marca;
    modelo: Modelo;
    tpCombustible: TipoCombustible;   
  })[];
};

