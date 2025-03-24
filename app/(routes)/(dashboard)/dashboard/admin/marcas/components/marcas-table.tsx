"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Marca } from "@prisma/client"
import { EditMarcaModal } from "./edit-marca-modal"
import { DeleteMarcaModal } from "./delete-marca-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

interface MarcasTableProps {
  marcas: Marca[];
  refreshData: () => void;
}

export function MarcasTable({ marcas,refreshData }: MarcasTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null)

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentMarcas = marcas.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(marcas.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (marca: Marca) => {
    setSelectedMarca(marca)
    setIsEditModalOpen(true)
  }

  const handleDelete = (marca: Marca) => {
    setSelectedMarca(marca)
    setIsDeleteModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    refreshData()
 
  }

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    refreshData()
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Lista de Marcas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentMarcas.map((marca) => (
            <TableRow key={marca.id}>
              <TableCell className="font-medium">{marca.descripcion}</TableCell>
              <TableCell>{marca.estado ? "Activo" : "Inactivo"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(marca)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(marca)}
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

      {selectedMarca && (
        <>
          <EditMarcaModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            marca={selectedMarca}
            onSuccess={handleEditSuccess}
          />
          <DeleteMarcaModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            marca={selectedMarca}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  )
}

