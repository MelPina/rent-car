import { VehiculoCard } from "./vehiculo-card"
import type { TipoVehiculo, Marca, Modelo, TipoCombustible, Vehiculo } from "@prisma/client"

type VehiculoWithRelations = Vehiculo & {
  tpVehiculo: TipoVehiculo
  marca: Marca
  modelo: Modelo
  tpCombustible: TipoCombustible
}

interface VehiculosListProps {
  vehiculos: VehiculoWithRelations[]
  onVehiculoUpdated: () => void;
  
}

export function VehiculosList({ vehiculos, onVehiculoUpdated }: VehiculosListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-4">
      {vehiculos.map((vehiculo) => (
        <VehiculoCard key={vehiculo.id} vehiculo={vehiculo} onVehiculoUpdated={onVehiculoUpdated} />
      ))}
    </div>
  )
}

