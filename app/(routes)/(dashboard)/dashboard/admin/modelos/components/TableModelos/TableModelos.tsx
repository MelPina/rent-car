"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Modelo, Marca } from "@prisma/client"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination"
import { EditModeloModal } from "./edit-modelo-modal"
import { DeleteModeloModal } from "./delete-modelo-modal"

type ModeloWithMarca = Modelo & {
    marca: Marca
}

interface ModelosTableProps {
    modelos: ModeloWithMarca[];
    refreshData: () => void;
}

export function ModelosTable({ modelos, refreshData }: ModelosTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedModelo, setSelectedModelo] = useState<ModeloWithMarca | null>(null)

    const itemsPerPage = 10
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentModelos = modelos.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(modelos.length / itemsPerPage)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleEdit = (modelo: ModeloWithMarca) => {
        setSelectedModelo(modelo)
        setIsEditModalOpen(true)
    }

    const handleDelete = (modelo: ModeloWithMarca) => {
        setSelectedModelo(modelo)
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
                <TableCaption>Lista de Modelos</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentModelos.map((modelo) => (
                        <TableRow key={modelo.id}>
                            <TableCell className="font-medium">{modelo.descripcion}</TableCell>
                            <TableCell>{modelo.marca.descripcion}</TableCell>
                            <TableCell>{modelo.estado ? "Activo" : "Inactivo"}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleEdit(modelo)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDelete(modelo)}
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

            {selectedModelo && (
                <>
                    <EditModeloModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        modelo={selectedModelo}
                        onSuccess={handleEditSuccess}
                    />
                    <DeleteModeloModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        modelo={selectedModelo}
                        onSuccess={handleDeleteSuccess}
                    />
                </>
            )}
        </div>
    )
}

