"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, RotateCcw } from "lucide-react"
import type { RentaDevolucion, Vehiculo, Cliente, Empleado } from "@prisma/client"
import { EditRentaDevolucionModal } from "./edit-renta-devolucion-modal"
import { DeleteRentaDevolucionModal } from "./delete-renta-devolucion-modal"
import { DevolucionModal } from "./devolucion-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"

type RentaDevolucionWithRelations = RentaDevolucion & {
  vehiculo: Vehiculo
  cliente: Cliente
  empleado: Empleado
}

interface RentasDevolucionesTableProps {
  rentasDevoluciones: RentaDevolucionWithRelations[]
  onRentaDevolucionUpdated: () => void
}

export function RentasDevolucionesTable({
  rentasDevoluciones,
  onRentaDevolucionUpdated,
}: RentasDevolucionesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDevolucionModalOpen, setIsDevolucionModalOpen] = useState(false)
  const [selectedRentaDevolucion, setSelectedRentaDevolucion] = useState<RentaDevolucionWithRelations | null>(null)

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentRentasDevoluciones = rentasDevoluciones.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(rentasDevoluciones.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (rentaDevolucion: RentaDevolucionWithRelations) => {
    setSelectedRentaDevolucion(rentaDevolucion)
    setIsEditModalOpen(true)
  }

  const handleDelete = (rentaDevolucion: RentaDevolucionWithRelations) => {
    setSelectedRentaDevolucion(rentaDevolucion)
    setIsDeleteModalOpen(true)
  }

  const handleDevolucion = (rentaDevolucion: RentaDevolucionWithRelations) => {
    setSelectedRentaDevolucion(rentaDevolucion)
    setIsDevolucionModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    onRentaDevolucionUpdated()
  }

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false)
    onRentaDevolucionUpdated()
  }

  const handleDevolucionSuccess = () => {
    setIsDevolucionModalOpen(false)
    onRentaDevolucionUpdated()
  }


  const calcularDiasRestantes = (rentaDevolucion: RentaDevolucionWithRelations) => {
    
    if (rentaDevolucion.fechaDevolucion && !isDefaultDate(rentaDevolucion.fechaDevolucion)) {
      return null
    }

    const fechaInicio = new Date(rentaDevolucion.fechaRenta)
    const fechaFin = new Date(fechaInicio)
    fechaFin.setDate(fechaFin.getDate() + rentaDevolucion.cantidadDias)

    const hoy = new Date()
    const diferencia = fechaFin.getTime() - hoy.getTime()
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24))

    return diasRestantes
  }

  
  const isDefaultDate = (date: Date) => {
    const dateObj = new Date(date)
    return dateObj.getFullYear() < 1970
  }

  
  const isDevuelta = (rentaDevolucion: RentaDevolucionWithRelations) => {
    if (!rentaDevolucion.fechaDevolucion) return false

    const fechaDevolucion = new Date(rentaDevolucion.fechaDevolucion)
    return fechaDevolucion.getFullYear() > 1970
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption>Lista de Rentas y Devoluciones</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Vehículo</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Empleado</TableHead>
            <TableHead>Fecha Renta</TableHead>
            <TableHead>Fecha Devolución</TableHead>
            <TableHead>Días</TableHead>
            <TableHead>Monto por Día</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRentasDevoluciones.map((rentaDevolucion) => {
            const diasRestantes = calcularDiasRestantes(rentaDevolucion)
            const devuelta = isDevuelta(rentaDevolucion)

            return (
              <TableRow key={rentaDevolucion.id}>
                <TableCell className="font-medium">{rentaDevolucion.vehiculo.descripcion}</TableCell>
                <TableCell>{rentaDevolucion.cliente.nombre}</TableCell>
                <TableCell>{rentaDevolucion.empleado.nombre}</TableCell>
                <TableCell>{new Date(rentaDevolucion.fechaRenta).toLocaleDateString()}</TableCell>
                <TableCell>
                  {devuelta ? new Date(rentaDevolucion.fechaDevolucion).toLocaleDateString() : "Pendiente"}
                </TableCell>
                <TableCell>
                  {rentaDevolucion.cantidadDias}
                  {!devuelta && diasRestantes !== null && (
                    <Badge
                      variant={diasRestantes < 0 ? "destructive" : diasRestantes <= 1 ? "outline" : "secondary"}
                      className="ml-2"
                    >
                      {diasRestantes < 0
                        ? `${Math.abs(diasRestantes)} días de retraso`
                        : diasRestantes === 0
                          ? "Vence hoy"
                          : diasRestantes === 1
                            ? "Vence mañana"
                            : `${diasRestantes} días restantes`}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>${rentaDevolucion.montoPorDia.toFixed(2)}</TableCell>
                <TableCell>${(rentaDevolucion.montoPorDia * rentaDevolucion.cantidadDias).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={rentaDevolucion.estado ? "default" : "secondary"}>
                    {rentaDevolucion.estado ? (devuelta ? "Devuelto" : "Activa") : "Inactiva"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {!devuelta && rentaDevolucion.estado && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDevolucion(rentaDevolucion)}
                        className="text-blue-500 hover:bg-blue-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => handleEdit(rentaDevolucion)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(rentaDevolucion)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
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

      {selectedRentaDevolucion && (
        <>
          <EditRentaDevolucionModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            rentaDevolucion={selectedRentaDevolucion}
            onSuccess={handleEditSuccess}
          />
          <DeleteRentaDevolucionModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            rentaDevolucion={selectedRentaDevolucion}
            onSuccess={handleDeleteSuccess}
          />
          <DevolucionModal
            isOpen={isDevolucionModalOpen}
            onClose={() => setIsDevolucionModalOpen(false)}
            rentaDevolucion={selectedRentaDevolucion}
            onSuccess={handleDevolucionSuccess}
          />
        </>
      )}
    </div>
  )
}

