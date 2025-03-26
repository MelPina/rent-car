"use client"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

// Generic type parameter T for the data items
interface ExportButtonsProps<T> {
  data: T[]
  fileName: string
  title: string
  columns: string[]
  getRowData: (item: T) => (string | number | boolean)[]
}

export function ExportButtons<T>({ data, fileName, title, columns, getRowData }: ExportButtonsProps<T>) {
  const exportToPDF = () => {
    // Debug the data
    console.log("Exporting to PDF:", data.length, "items")

    // Create new document
    const doc = new jsPDF()
    doc.text(title, 14, 10)

    // Prepare table data
    const tableRows = data.map((item) => getRowData(item))
    console.log("PDF rows:", tableRows.length)

    // Generate table
    autoTable(doc, {
      head: [columns],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    })

    // Save the PDF
    doc.save(`${fileName}.pdf`)
  }

  const exportToExcel = () => {
    // Debug the data
    console.log("Exporting to Excel:", data.length, "items")

    // Create a simplified version of the data for Excel
    const excelData = data.map((item) => {
      const rowData = getRowData(item)
      const excelRow: Record<string, string | number | boolean> = {}

      columns.forEach((col, i) => {
        excelRow[col] = rowData[i]
      })

      return excelRow
    })

    console.log("Excel rows:", excelData.length)

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")

    // Save the Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }

  // Only show export buttons if we have data
  if (!data || data.length === 0) {
    return null
  }

  return (
    <div className="flex space-x-2">
      <Button onClick={exportToPDF} variant="outline" className="bg-red-500 text-white hover:bg-red-700">
        <FileDown className="mr-2 h-4 w-4" />
        PDF ({data.length})
      </Button>

      <Button onClick={exportToExcel} variant="outline" className="bg-green-700 text-white hover:bg-green-900">
        <FileDown className="mr-2 h-4 w-4" />
        Excel ({data.length})
      </Button>
    </div>
  )
}

