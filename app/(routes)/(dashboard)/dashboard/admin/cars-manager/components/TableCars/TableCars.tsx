"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableCarsProps } from "./TableCars.types";


export function TableCars(props: TableCarsProps) {
    const { vehiculos } = props;

    // Configuración de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calcular el índice de inicio y fin de la página actual
    const indexOfLastVehiculo = currentPage * itemsPerPage;
    const indexOfFirstVehiculo = indexOfLastVehiculo - itemsPerPage;
    const currentVehiculos = vehiculos.slice(indexOfFirstVehiculo, indexOfLastVehiculo);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(vehiculos.length / itemsPerPage);

    // Función para manejar el cambio de página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
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
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentVehiculos.map(({ vehiculo, tpVehiculo, marca, modelo, tpCombustible }) => (
                        <TableRow key={vehiculo.id}>
                            <TableCell className="font-medium">{vehiculo.descripcion}</TableCell>
                            <TableCell>{vehiculo.noChasis}</TableCell>
                            <TableCell>{vehiculo.noMotor}</TableCell>
                            <TableCell>{vehiculo.noPlaca}</TableCell>
                            <TableCell>{tpVehiculo.descripcion}</TableCell>
                            <TableCell>{marca.descripcion}</TableCell>
                            <TableCell>{modelo.descripcion}</TableCell>
                            <TableCell>{tpCombustible.descripcion}</TableCell>
                            <TableCell>{vehiculo.estado ? "Activo" : "Inactivo"}</TableCell>
                            <TableCell>
                                <button onClick={() => handleEdit(vehiculo.id)} className="btn-edit">Editar</button>
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
                        className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

const handleEdit = (id: string) => {
    console.log("Editar vehículo con ID:", id);
};