"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Inspeccion, Vehiculo } from "@prisma/client"
import { EditInspeccionModal } from "./edit-inspeccion-modal"
import { DeleteInspeccionModal } from "./delete-inspeccion-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

type InspeccionWithVehiculo = Inspeccion & {
  vehiculo: Vehiculo
}

interface InspeccionesTableProps {
  inspecciones: InspeccionWithVehiculo[]
  onInspeccionUpdated: () => void
}

export function InspeccionesTable({ inspecciones, onInspeccionUpdated }: InspeccionesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedInspeccion, setSelectedInspeccion] = useState<InspeccionWithVehiculo | null>(null)

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentInspecciones = inspecciones.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(inspecciones.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (inspeccion: InspeccionWithVehiculo) => {
    setSelectedInspeccion(inspeccion)
    setIsEditModalOpen(true)
  }

  const handleDelete = (inspeccion: InspeccionWithVehiculo) => {
    setSelectedInspeccion(inspeccion)
    setIsDeleteModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    onInspeccionUpdated()
  }

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false)
    onInspeccionUpdated()
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Lista de Inspecciones</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Vehículo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado Gomas</TableHead>
            <TableHead>Combustible</TableHead>
            <TableHead>Ralladuras</TableHead>
            <TableHead>Roturas Cristal</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentInspecciones.map((inspeccion) => (
            <TableRow key={inspeccion.id}>
              <TableCell className="font-medium">{inspeccion.vehiculo.descripcion}</TableCell>
              <TableCell>{inspeccion.clienteId}</TableCell>
              <TableCell>{new Date(inspeccion.fecha).toLocaleDateString()}</TableCell>
              <TableCell>{inspeccion.estadoGomas}</TableCell>
              <TableCell>{inspeccion.cantidadCombustible}</TableCell>
              <TableCell>{inspeccion.tieneRalladuras ? "Sí" : "No"}</TableCell>
              <TableCell>{inspeccion.tieneRoturasCristal ? "Sí" : "No"}</TableCell>
              <TableCell>{inspeccion.estado ? "Activo" : "Inactivo"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(inspeccion)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(inspeccion)}
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

      {selectedInspeccion && (
        <>
          <EditInspeccionModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            inspeccion={selectedInspeccion}
            onSuccess={handleEditSuccess}
          />
          <DeleteInspeccionModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            inspeccion={selectedInspeccion}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  )
}

