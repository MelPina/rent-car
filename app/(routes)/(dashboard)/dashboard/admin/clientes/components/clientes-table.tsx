"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Cliente } from "@prisma/client"
import { EditClienteModal } from "./edit-cliente-modal"
import { DeleteClienteModal } from "./delete-cliente-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

interface ClientesTableProps {
  clientes: Cliente[];
  refreshData: () => void;
}

export function ClientesTable({ clientes, refreshData }: ClientesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentClientes = clientes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(clientes.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsEditModalOpen(true)
  }

  const handleDelete = (cliente: Cliente) => {
    setSelectedCliente(cliente)
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
        <TableCaption>Lista de Clientes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>No. Tarjeta Crédito</TableHead>
            <TableHead>Límite Crédito</TableHead>
            <TableHead>Tipo Persona</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentClientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nombre}</TableCell>
              <TableCell>{cliente.cedula}</TableCell>
              <TableCell>{cliente.noTarjetaCr}</TableCell>
              <TableCell>${cliente.limiteCredito.toFixed(2)}</TableCell>
              <TableCell>{cliente.tipoPersona}</TableCell>
              <TableCell>{cliente.estado ? "Activo" : "Inactivo"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(cliente)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(cliente)}
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

      {selectedCliente && (
        <>
          <EditClienteModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            cliente={selectedCliente}
            onSuccess={handleEditSuccess}
          />
          <DeleteClienteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            cliente={selectedCliente}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  )
}

