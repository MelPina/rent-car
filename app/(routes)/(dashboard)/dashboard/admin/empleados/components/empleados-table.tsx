"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Empleado } from "@prisma/client"
import { EditEmpleadoModal } from "./edit-empleado-modal"
import { DeleteEmpleadoModal } from "./delete-empleado-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

interface EmpleadosTableProps {
  empleados: Empleado[];
  refreshData: () => void;
}

export function EmpleadosTable({ empleados, refreshData }: EmpleadosTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null)

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentEmpleados = empleados.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(empleados.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (empleado: Empleado) => {
    setSelectedEmpleado(empleado)
    setIsEditModalOpen(true)
  }

  const handleDelete = (empleado: Empleado) => {
    setSelectedEmpleado(empleado)
    setIsDeleteModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    refreshData();  }

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    refreshData();
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Lista de Empleados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Tanda Laboral</TableHead>
            <TableHead>Comisión (%)</TableHead>
            <TableHead>Fecha Ingreso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEmpleados.map((empleado) => (
            <TableRow key={empleado.id}>
              <TableCell className="font-medium">{empleado.nombre}</TableCell>
              <TableCell>{empleado.cedula}</TableCell>
              <TableCell>{empleado.tandaLabor}</TableCell>
              <TableCell>{empleado.porcientoComision}%</TableCell>
              <TableCell>{new Date(empleado.fechaIngreso).toLocaleDateString()}</TableCell>
              <TableCell>{empleado.estado ? "Activo" : "Inactivo"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(empleado)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(empleado)}
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

      {selectedEmpleado && (
        <>
          <EditEmpleadoModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            empleado={selectedEmpleado}
            onSuccess={handleEditSuccess}
          />
          <DeleteEmpleadoModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            empleado={selectedEmpleado}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  )
}

