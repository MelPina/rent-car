"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { TipoVehiculo } from "@prisma/client"
import { EditTipoVehiculoModal } from "./edit-tipo-vehiculo-modal"
import { DeleteTipoVehiculoModal } from "./delete-tipo-vehiculo-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

interface TiposVehiculoTableProps {
  tiposVehiculo: TipoVehiculo[];
  refreshData: () => void;
}

export function TiposVehiculoTable({ tiposVehiculo, refreshData }: TiposVehiculoTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTipoVehiculo, setSelectedTipoVehiculo] = useState<TipoVehiculo | null>(null)

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTiposVehiculo = tiposVehiculo.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(tiposVehiculo.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (tipoVehiculo: TipoVehiculo) => {
    setSelectedTipoVehiculo(tipoVehiculo)
    setIsEditModalOpen(true)
  }

  const handleDelete = (tipoVehiculo: TipoVehiculo) => {
    setSelectedTipoVehiculo(tipoVehiculo)
    setIsDeleteModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    refreshData()}

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    refreshData();
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Lista de Tipos de Vehículo</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTiposVehiculo.map((tipoVehiculo) => (
            <TableRow key={tipoVehiculo.id}>
              <TableCell className="font-medium">{tipoVehiculo.descripcion}</TableCell>
              <TableCell>{tipoVehiculo.estado ? "Activo" : "Inactivo"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(tipoVehiculo)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(tipoVehiculo)}
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
                  onClick={currentPage > 1 ? () => handlePageChange(currentPage - 1) : undefined}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                  onClick={currentPage < totalPages ? () => handlePageChange(currentPage + 1) : undefined}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {selectedTipoVehiculo && (
        <>
          <EditTipoVehiculoModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            tipoVehiculo={selectedTipoVehiculo}
            onSuccess={handleEditSuccess}
          />
          <DeleteTipoVehiculoModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            tipoVehiculo={selectedTipoVehiculo}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  )
}

