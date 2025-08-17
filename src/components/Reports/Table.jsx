/* eslint-disable react/prop-types */
import { useState } from "react"
import PrintIcon from "../../assets/icons/print.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment"
import ArchiveModal from "./ArchiveModal"
import SuccessModal from "../common/SuccessModal"
import axios from "axios"
import ReportIcon from "../../assets/icons/report.svg"
import html2pdf from "html2pdf.js"
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

    const totalPages = Math.ceil(reportsData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleDownload = (report) => {
        const fileUrl = `http://localhost:5000/${report.pdf_file_path}`
        window.open(fileUrl, "_blank")
    }

    // Open Archive Modal
    const handleOpenModal = (report) => {
        setSelectedReport(report)
        setIsModalOpen(true)
    }

    // Close Archive Modal
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedReport(null)
    }

    const logAction = async (action) => {
        try {
            const response = await fetch("http://localhost:5000/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                }),
            })

            if (!response.ok) throw new Error("Failed to log action")
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
            setSuccessModalOpen(true)
            await logAction("Archive Report")
        } catch (error) {
            console.error("Error archiving the report:", error)
            alert("Error archiving the report")
        }

        fetchReportsData()
        setIsModalOpen(false)
        setSelectedReport(null)
    }
    const generatePDF = () => {
        const element = document.createElement("div")

        element.innerHTML = `
    <style>
    @page { 
        size: landscape; 
    }

    body { 
        font-family: 'Poppins', sans-serif; 
        margin: 20px; 
        color: #333; 
        background-color: #fff; 
    }

    .header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 20px; 
        border-bottom: 4px solid #219EBC; 
        padding-bottom: 15px; 
    }

    .header img { 
        height: 60px; 
    }

    .header h1 { 
        text-align: center; 
        color: #219EBC; 
        font-size: 24px; 
        margin: 0; 
        flex-grow: 1; 
    }

    .barangay-info { 
        font-size: 14px; 
        color: #555; 
        margin-top: 5px; 
        text-align: center; 
    }

    table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 20px; 
        font-size: 14px; 
        border-radius: 8px; 
        overflow: hidden; 
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
    }

    th, td { 
        border: 1px solid #ddd; 
        padding: 5px; 
        text-align: left; 
        vertical-align: top; 
    }

    th { 
        text-align:center;
        font-weight: 600; 
        letter-spacing: 0.5px; 
        background-color: rgba(33, 158, 188, 0.8);
        color: white;
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
    }

    tr:nth-child(even) { 
        background-color: #f9f9f9; 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
    }

    tr:hover { 
        background-color: #f1f1f1; 
    }

    .footer { 
        margin-top: 30px; 
        font-size: 12px; 
        color: #666; 
        text-align: right; 
        border-top: 1px solid #ccc; 
        padding-top: 10px; 
    }
    </style>

    <div class="header">
      <img src="${ElderlinkLogo}" alt="Elderlink Logo" />
      <h1>Reports Data</h1>
      <img src="${MojonLogo}" alt="Mojon Logo" />
    </div>

    <div class="barangay-info">
      <p><strong>Barangay Mojon</strong></p>
      <p>123 Main Street, Brgy. Mojon</p>
      <p>Contact No: (123) 456-7890</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Report Name</th>
          <th>Report Type</th>
          <th>Time Created</th>
          <th>Created By</th>
        </tr>
      </thead>
      <tbody>
        ${reportsData
            .map(
                (report) => `
          <tr>
            <td>${report.report_name || "N/A"}</td>
            <td>${report.report_type || "N/A"}</td>
            <td>${moment(report.created_at).format("MM-DD-YYYY, h:mm:ss A")}</td>
            <td>${report.created_by || "N/A"}</td>
          </tr>
        `,
            )
            .join("")}
      </tbody>
    </table>
  `

        const opt = {
            margin: [10, 10, 20, 10],
            filename: "reports_data.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, logging: false },
            jsPDF: { unit: "mm", format: "legal", orientation: "landscape" },
            pagebreak: { mode: ["css", "legacy"] },
        }

        html2pdf()
            .set(opt)
            .from(element)
            .toPdf()
            .get("pdf")
            .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages()
                const footerText = `Report Generated On: ${new Date().toLocaleString()} | Report By: ${
                    localStorage.getItem("username") || ""
                }`

                pdf.setFont("Poppins", "normal")
                pdf.setFontSize(10)

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i)
                    const pageWidth = pdf.internal.pageSize.getWidth()
                    const pageHeight = pdf.internal.pageSize.getHeight()

                    // Footer left: Report info
                    pdf.text(footerText, 10, pageHeight - 10)

                    // Footer right: Page number
                    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10)
                }
            })
            .save()
    }

    return (
        <div className="rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="border-b bg-[#219EBC] opacity-90 text-white">
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
                            className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"} text-[#333333] font-[500] transition-colors hover:bg-[#F1F1F1]`}
                        >
                            <td className="p-4 text-left border-x border-gray-300">{report.report_name}</td>
                            <td className="p-4 text-left border-x border-gray-300">{report.report_type}</td>
                            <td className="p-4 text-left border-x border-gray-300">
                                {moment(report.created_at).format("MM-DD-YYYY, h:mm:ss A")}
                            </td>
                            <td className="p-4 text-left border-x border-gray-300 whitespace-nowrap">
                                {report.created_by}
                            </td>
                            <td className="p-4 flex justify-center items-center gap-3">
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

            {/* Pagination */}
            <div className="flex fixed bottom-5 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ${
                        currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white"
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
                                : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white"
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
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white"
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
            {selectedReport && (
                <ArchiveModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    reportName={selectedReport.report_name}
                    onConfirm={handleConfirmArchive}
                />
            )}

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title={modalTitle}
                message={modalMessage}
                isArchiving={true}
                onGoToArchives={() => (window.location.href = "/archives")}
            />
        </div>
    )
}

export default Table
