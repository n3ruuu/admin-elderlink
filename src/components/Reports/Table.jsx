/* eslint-disable react/prop-types */
import { useState } from "react"
import PrintIcon from "../../assets/icons/print.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment"
import ArchiveModal from "./ArchiveModal" // Import the ArchiveModal
import SuccessModal from "../common/SuccessModal"
import axios from "axios"

const Table = ({ reportsData, fetchReportsData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedReport, setSelectedReport] = useState(null)
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")

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
            handleCloseModal() // Close the modal after confirming the archive
            setSuccessModalOpen(true) // Show error message
            await logAction("Archive Report")
        } catch (error) {
            console.error("Error archiving the report:", error)
            alert("Error archiving the report")
        }
        fetchReportsData()
    }

    return (
        <div>
            <div className="overflow-y-auto max-h-[650px] w-full shadow-lg rounded-xl border">
                <table className="min-w-full bg-white">
                    <thead className="text-gray-500 border-b">
                        <tr>
                            <th className="px-8 py-4 text-left font-medium whitespace-nowrap">Report Name</th>
                            <th className="px-6 py-4 text-left font-medium">Report Type</th>
                            <th className="px-6 py-4 text-left font-medium">Time Created</th>
                            <th className="px-6 py-4 text-left font-medium">Created by</th>
                            <th className="px-6 py-4 text-left font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportsData.map((report, index) => (
                            <tr
                                className={`text-[#333333] font-[500] transition-colors hover:bg-[#F1F1F1] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                                key={report.id}
                            >
                                <td className="px-8 py-4 text-left align-top">{report.report_name}</td>
                                <td className="px-6 py-4 text-left align-top">{report.report_type}</td>
                                <td className="px-6 py-4 text-left align-top">
                                    {moment(report.created_at).format("MM-DD-YYYY, h:mm:ss A")}
                                </td>

                                <td className="px-6 py-4 text-left align-top whitespace-nowrap">{report.created_by}</td>
                                <td className="px-6 py-4 text-left flex gap-4 items-center">
                                    <button
                                        onClick={() => handleDownload(report)}
                                        className="text-[#219EBC] hover:text-[#1A8CB5] transition-colors"
                                    >
                                        <img src={PrintIcon} alt="Print Icon" className="h-5" />
                                    </button>

                                    <button
                                        onClick={() => handleOpenModal(report)} // Open the modal with the selected report
                                        className="text-[#FF9800] hover:text-[#F57C00] transition-colors"
                                    >
                                        <img src={ArchiveIcon} alt="Archive Icon" className="h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pass the state to the ArchiveModal */}
            <ArchiveModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmArchive}
                article={selectedReport?.report_name} // Pass the report name to the modal
            />
            {successModalOpen && (
                <SuccessModal
                    isOpen={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                    title={modalTitle}
                    message={modalMessage}
                />
            )}
        </div>
    )
}

export default Table
