"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { TipoCombustible } from "@prisma/client"
import { EditTipoCombustibleModal } from "./edit-tipo-combustible-modal"
import { DeleteTipoCombustibleModal } from "./delete-tipo-combustible-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

interface TiposCombustibleTableProps {
  tiposCombustible: TipoCombustible[];
  refreshData: () => void;
}

export function TiposCombustibleTable({ tiposCombustible, refreshData }: TiposCombustibleTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTipoCombustible, setSelectedTipoCombustible] = useState<TipoCombustible | null>(null)

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTiposCombustible = tiposCombustible.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(tiposCombustible.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (tipoCombustible: TipoCombustible) => {
    setSelectedTipoCombustible(tipoCombustible)
    setIsEditModalOpen(true)
  }

  const handleDelete = (tipoCombustible: TipoCombustible) => {
    setSelectedTipoCombustible(tipoCombustible)
    setIsDeleteModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    refreshData();
  }

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    refreshData();
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Lista de Tipos de Combustible</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTiposCombustible.map((tipoCombustible) => (
            <TableRow key={tipoCombustible.id}>
              <TableCell className="font-medium">{tipoCombustible.descripcion}</TableCell>
              <TableCell>{tipoCombustible.estado ? "Activo" : "Inactivo"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(tipoCombustible)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(tipoCombustible)}
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

      {selectedTipoCombustible && (
        <>
          <EditTipoCombustibleModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            tipoCombustible={selectedTipoCombustible}
            onSuccess={handleEditSuccess}
          />
          <DeleteTipoCombustibleModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            tipoCombustible={selectedTipoCombustible}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  )
}

