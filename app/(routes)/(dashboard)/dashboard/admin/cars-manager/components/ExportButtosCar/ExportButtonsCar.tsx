"use client";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; 
import autoTable from "jspdf-autotable"; 
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Car {
    id: string;
    userId: string;
    name: string;
    CV: string;
    transmission: string;
    people: string;
    photo: string;
    priceDay: string;
    engine: string;
    type: string;
    isPublish?: boolean;
    createdAt: string;
    updatedAt: string;
}

const ExportButtons = () => {
    const [cars, setCars] = useState<Car[]>([]);

    // Fetch de la API
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get("/api/car"); 
                setCars(response.data);
            } catch (error) {
                console.error("Error fetching cars:", error);
                toast({
                    title: "Error al obtener los autos 🚨",
                    variant: "destructive",
                });
            }
        };

        fetchCars();
    }, []);

   
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Lista de Autos", 14, 10);

        const tableColumn = ["Nombre", "CV", "Transmisión", "Precio/Día"];
        const tableRows = cars.map((car) => [
            car.name,
            car.CV,
            car.transmission,
            `$${car.priceDay}`,
        ]);


        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("Reporte_de_vehículos.pdf");
    };

   
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(cars);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Cars");
        XLSX.writeFile(workbook, "Reporte_de_vehículos.xlsx");
    };

    return (
       <>
       
            <Button
                onClick={exportToPDF}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
                Exportar a PDF
            </Button>

            <Button
                onClick={exportToExcel}
                className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-900 transition"
            >
                Exportar a Excel
            </Button>
            </>
        
    );
};

export default ExportButtons;
