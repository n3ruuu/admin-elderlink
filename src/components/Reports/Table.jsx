/* eslint-disable react/prop-types */
import { useState } from "react"
import PrintIcon from "../../assets/icons/print.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment"
import ArchiveModal from "./ArchiveModal" // Import the ArchiveModal
import SuccessModal from "../common/SuccessModal"
import axios from "axios"
import ReportIcon from "../../assets/icons/report.svg"
import jsPDF from "jspdf"
import "jspdf-autotable" // Ensure autoTable is imported for table generation
import MojonLogo from "../../assets/mojon-logo.png"
import ElderlinkLogo from "../../assets/elderlink-logo.png"

const Table = ({ reportsData, fetchReportsData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedReport, setSelectedReport] = useState(null)
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const totalPages = Math.ceil(reportsData.length / itemsPerPage) // Corrected from membersData
    const startIndex = (currentPage - 1) * itemsPerPage

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleDownload = (report) => {
        const fileUrl = `http://localhost:5000/${report.pdf_file_path}`
        window.open(fileUrl, "_blank")
    }

    const handleOpenModal = (report) => {
        setSelectedReport(report)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedReport(null) // Clear the selected report
    }

    const logAction = async (action) => {
        try {
            const response = await fetch("http://localhost:5000/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"), // Current timestamp in ISO format
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to log action")
            }

            console.log("Action logged successfully")
        } catch (error) {
            console.error("Error logging action:", error)
        }
    }

    const handleConfirmArchive = async () => {
        if (!selectedReport) return

        try {
            await axios.put(`http://localhost:5000/reports/archive-report/${selectedReport.id}`)

            setModalTitle("Report Archived!")
            setModalMessage("The report has been successfully archived.")
            setSuccessModalOpen(true) // Show success modal
            await logAction("Archive Report")
        } catch (error) {
            console.error("Error archiving the report:", error)
            alert("Error archiving the report")
        }

        // Refresh data after archiving and close modal
        fetchReportsData()
        setIsModalOpen(false)
        setSelectedReport(null)
    }

    // Generate PDF Function
    const generatePDF = () => {
        const doc = new jsPDF("l", "mm", "a4") // 'l' for landscape orientation

        // Logo - Upper Left (Smaller Size)
        const logo = new Image()
        logo.src = ElderlinkLogo
        doc.addImage(logo, "PNG", 15, 10, 25, 20) // Smaller size for the logo

        const mojonLogo = new Image()
        mojonLogo.src = MojonLogo

        // Position the logo in the upper-right corner
        doc.addImage(mojonLogo, "PNG", doc.internal.pageSize.width - 40, 10, 22, 22)

        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.setTextColor("#000000") // Black color for text
        const brgyHeader = "Brgy. Mojon"
        const brgyHeaderWidth = doc.getTextWidth(brgyHeader)
        doc.text(brgyHeader, doc.internal.pageSize.width / 2 - brgyHeaderWidth / 2, 28)

        // Title
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text("Reports Data", doc.internal.pageSize.width / 2, 35, { align: "center" })

        // Address and Contact Number
        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")
        const address = "123 Main Street, Brgy. Mojon"
        const contactNumber = "Contact No: (123) 456-7890"
        doc.text(address, doc.internal.pageSize.width / 2, 15, { align: "center" })
        doc.text(contactNumber, doc.internal.pageSize.width / 2, 20, { align: "center" })

        // Table Headers and Data
        const headers = ["Report Name", "Report Type", "Time Created", "Created By"]
        const rows = reportsData.map((report) => [
            report.report_name,
            report.report_type,
            moment(report.created_at).format("MM-DD-YYYY, h:mm:ss A"),
            report.created_by,
        ])

        // Add Table to PDF
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 40, // Position the table below the title and address
            theme: "grid",
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
            },
        })

        // Footer
        doc.setFontSize(10)
        doc.text(`Generated on ${moment().format("MM-DD-YYYY h:mm:ss A")}`, 10, doc.internal.pageSize.height - 10)

        // Page Number - Lower Right (Page x of y)
        const pageCount = doc.internal.getNumberOfPages()
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber
        doc.text(
            `Page ${currentPage} of ${pageCount}`,
            doc.internal.pageSize.width - 30,
            doc.internal.pageSize.height - 10,
        )

        // Save the PDF
        doc.save("reports_data.pdf")
    }

    return (
        <div className="rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="border-b bg-[#219EBC] text-white">
                    <tr>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Report Name
                        </th>
                        <th className="p-4 text-center font-medium border-x border-gray-200">Report Type</th>
                        <th className="p-4 text-center font-medium border-x border-gray-200">Time Created</th>
                        <th className="p-4 text-center font-medium border-x border-gray-200">Created By</th>
                        <th className="p-4 text-center font-medium border-x border-gray-200">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {reportsData.slice(startIndex, startIndex + itemsPerPage).map((report, index) => (
                        <tr
                            key={report.id}
                            className={`${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            } text-[#333333] font-[500] transition-colors hover:bg-[#F1F1F1]`}
                        >
                            <td className="p-4 text-left border-x border-gray-300">{report.report_name}</td>
                            <td className="p-4 text-left border-x border-gray-300">{report.report_type}</td>
                            <td className="p-4 text-left border-x border-gray-300">
                                {moment(report.created_at).format("MM-DD-YYYY, h:mm:ss A")}
                            </td>
                            <td className="p-4 text-left border-x border-gray-300 whitespace-nowrap">
                                {report.created_by}
                            </td>
                            <td className="p-4 border-x border-gray-300 flex justify-center items-center gap-3">
                                <button
                                    onClick={() => handleDownload(report)}
                                    className="text-[#219EBC] hover:text-[#1A8CB5] transition-colors"
                                >
                                    <img src={PrintIcon} alt="Print Icon" className="h-5" />
                                </button>

                                <button
                                    onClick={() => handleOpenModal(report)}
                                    className="text-[#FF9800] hover:text-[#F57C00] transition-colors"
                                >
                                    <img src={ArchiveIcon} alt="Archive Icon" className="h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex fixed bottom-5 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ${
                        currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                    } rounded-md`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 ${
                            currentPage === index + 1
                                ? "bg-[#219EBC] text-white"
                                : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                        } rounded-md mx-1`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ${
                        currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                    } rounded-md`}
                >
                    Next
                </button>
            </div>

            {/* Generate Report button */}
            <button
                onClick={generatePDF}
                className="fixed bottom-5 right-16 border text-[#219EBC] border-[#219EBC] flex px-5 py-3 rounded-md hover:bg-[#219EBC] hover:text-white transition-colors duration-300 group"
            >
                <img src={ReportIcon} alt="Report Icon" className="h-5 w-5 mr-2" />
                Generate Report
            </button>

            {/* Archive Modal */}
            {isModalOpen && (
                <ArchiveModal
                    onClose={handleCloseModal}
                    reportName={selectedReport?.report_name} // Pass the report name to the modal
                    onConfirm={handleConfirmArchive}
                />
            )}

            {/* Success Modal */}
            {successModalOpen && (
                <SuccessModal onClose={() => setSuccessModalOpen(false)} title={modalTitle} message={modalMessage} />
            )}
        </div>
    )
}

export default Table
