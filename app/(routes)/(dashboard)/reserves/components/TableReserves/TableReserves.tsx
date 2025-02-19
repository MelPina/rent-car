"use client"; // Asegúrate de agregar esta línea al inicio del archivo

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableReservesProps } from "./TableReserves.types";

export function TableReserves(props: TableReservesProps) {
    const { orders } = props;

    // Configuración de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Cambia esto al número de elementos que deseas por página

    // Calcular el índice de inicio y fin de la página actual
    const indexOfLastRental = currentPage * itemsPerPage;
    const indexOfFirstRental = indexOfLastRental - itemsPerPage;
    const currentRentals = orders.slice(indexOfFirstRental, indexOfLastRental);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    // Función para manejar el cambio de página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Table>
                <TableCaption>Lista de Rentas y Devoluciones Recientes</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Empleado</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Vehículo</TableHead>
                        <TableHead>Fecha Renta</TableHead>
                        <TableHead>Fecha Devolución</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Monto por Día</TableHead>
                        <TableHead className="text-right">Días</TableHead>
                        <TableHead>Comentario</TableHead>
                        <TableHead>Acciones</TableHead> 
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentRentals.map((renta) => (
                        <TableRow key={renta.id}>
                            <TableCell className="font-medium">{renta.empleado.nombre}</TableCell>
                            <TableCell>{renta.cliente.nombre}</TableCell>
                            <TableCell>{renta.vehiculo.descripcion}</TableCell>
                            <TableCell>{new Date(renta.fechaRenta).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(renta.fechaDevolucion).toLocaleDateString()}</TableCell>
                            <TableCell>{renta.estado ? "Activo" : "Inactivo"}</TableCell>
                            <TableCell className="text-right">{renta.montoPorDia.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{renta.cantidadDias}</TableCell>
                            <TableCell>{renta.comentario}</TableCell>
                            <TableCell>
                                <button onClick={() => handleEdit(renta.id)} className="btn-edit">Editar</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Paginación */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}


const handleEdit = (id: string) => {
    console.log("Editar renta con ID:", id);
    
};
