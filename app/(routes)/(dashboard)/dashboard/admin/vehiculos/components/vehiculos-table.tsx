"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Vehiculo, TipoVehiculo, Marca, Modelo, TipoCombustible } from "@prisma/client"
import { EditVehiculoModal } from "./edit-vehiculo-modal"
import { DeleteVehiculoModal } from "./delete-vehiculo-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

type VehiculoWithRelations = Vehiculo & {
  tpVehiculo: TipoVehiculo
  marca: Marca
  modelo: Modelo
  tpCombustible: TipoCombustible
}

interface VehiculosTableProps {
  vehiculos: VehiculoWithRelations[]
}

export function VehiculosTable({ vehiculos }: VehiculosTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedVehiculo, setSelectedVehiculo] = useState<VehiculoWithRelations | null>(null)

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentVehiculos = vehiculos.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(vehiculos.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (vehiculo: VehiculoWithRelations) => {
    setSelectedVehiculo(vehiculo)
    setIsEditModalOpen(true)
  }

  const handleDelete = (vehiculo: VehiculoWithRelations) => {
    setSelectedVehiculo(vehiculo)
    setIsDeleteModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    // Aquí podrías refrescar los datos si es necesario
  }

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false)
    // Aquí podrías refrescar los datos si es necesario
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Lista de Vehículos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>No. Chasis</TableHead>
            <TableHead>No. Motor</TableHead>
            <TableHead>No. Placa</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Combustible</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentVehiculos.map((vehiculo) => (
            <TableRow key={vehiculo.id}>
              <TableCell className="font-medium">{vehiculo.descripcion}</TableCell>
              <TableCell>{vehiculo.noChasis}</TableCell>
              <TableCell>{vehiculo.noMotor}</TableCell>
              <TableCell>{vehiculo.noPlaca}</TableCell>
              <TableCell>{vehiculo.tpVehiculo.descripcion}</TableCell>
              <TableCell>{vehiculo.marca.descripcion}</TableCell>
              <TableCell>{vehiculo.modelo.descripcion}</TableCell>
              <TableCell>{vehiculo.tpCombustible.descripcion}</TableCell>
              <TableCell>{vehiculo.estado ? "Activo" : "Inactivo"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(vehiculo)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(vehiculo)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {selectedVehiculo && (
        <>
          <EditVehiculoModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            vehiculo={selectedVehiculo}
            onSuccess={handleEditSuccess}
          />
          <DeleteVehiculoModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            vehiculo={selectedVehiculo}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  )
}

