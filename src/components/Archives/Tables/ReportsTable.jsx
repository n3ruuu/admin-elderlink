import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal"
import DeleteSuccessModal from "../DeleteSuccessModal" // ✅ import success modal
import axios from "axios"

const ReportsTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // ✅ success modal state
    const [reportsData, setReportsData] = useState([])
    const [selectedReportId, setSelectedReportId] = useState(null)

    const fetchReportsData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/reports/get-news")
            const archivedReports = response.data.filter((report) => report.status === "Archived")
            setReportsData(archivedReports)
        } catch (error) {
            console.error("Error fetching reports data:", error)
        }
    }

    useEffect(() => {
        fetchReportsData()
    }, [])

    const handleUndoClick = (id) => {
        setSelectedReportId(id)
        setIsModalOpen(true)
    }

    const handleDeleteClick = (id) => {
        setSelectedReportId(id)
        setIsDeleteModalOpen(true)
    }

    const handleUndoConfirm = async () => {
        if (!selectedReportId) return

        try {
            const response = await axios.put(`http://localhost:5000/reports/undo/${selectedReportId}`, {
                status: "Active",
            })

            if (response.status === 200) {
                setReportsData((prevReports) =>
                    prevReports.map((report) =>
                        report.id === selectedReportId ? { ...report, status: "Active" } : report,
                    ),
                )
                fetchReportsData()
            } else {
                console.error("Failed to update report status.")
            }
        } catch (error) {
            console.error("Error confirming undo action:", error)
        } finally {
            setIsModalOpen(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedReportId) return

        try {
            const response = await axios.delete(`http://localhost:5000/reports/delete/${selectedReportId}`)

            if (response.status === 200) {
                setReportsData((prevReports) =>
                    prevReports.filter((report) => report.id !== selectedReportId),
                )
                // ✅ open success modal
                setIsSuccessModalOpen(true)
            } else {
                console.error("Failed to delete report.")
            }
        } catch (error) {
            console.error("Error confirming delete action:", error)
        } finally {
            setIsDeleteModalOpen(false)
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setIsDeleteModalOpen(false)
        setIsSuccessModalOpen(false) // ✅ close success modal
    }

    return (
        <div className="px-4">
            <div className="mx-12 rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="border-b opacity-90 bg-[#219EBC] text-white">
                        <tr>
                            <th className="px-8 py-4 text-left font-medium whitespace-nowrap border-x border-gray-300">
                                Report Name
                            </th>
                            <th className="px-6 py-4 text-left font-medium border-x border-gray-300">Report Type</th>
                            <th className="px-6 py-4 text-left font-medium border-x border-gray-300">Time Created</th>
                            <th className="px-6 py-4 text-left font-medium border-x border-gray-300">Created by</th>
                            <th className="px-6 py-4 text-left font-medium border-x border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportsData.map((report, index) => (
                            <tr
                                className={`text-[#333333] font-[500] transition-colors hover:bg-[#F1F1F1] ${
                                    index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                                }`}
                                key={report.id}
                            >
                                <td className="px-8 py-4 text-left align-top border-x border-gray-300">
                                    {report.report_name}
                                </td>
                                <td className="px-6 py-4 text-left align-top border-x border-gray-300">
                                    {report.report_type}
                                </td>
                                <td className="px-6 py-4 text-left align-top border-x border-gray-300">
                                    {moment(report.created_at).format("MM-DD-YYYY, h:mm:ss A")}
                                </td>
                                <td className="px-6 py-4 text-left align-top whitespace-nowrap border-x border-gray-300">
                                    {report.created_by}
                                </td>
                                <td className="pl-4 text-center flex mt-3 border-x">
                                    <button
                                        onClick={() => handleUndoClick(report.id)}
                                        className="cursor-pointer w-8 h-8 flex justify-center items-center"
                                    >
                                        <img src={UndoIcon} alt="Undo Icon" className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(report.id)}
                                        className="cursor-pointer w-8 h-8 flex justify-center items-center"
                                    >
                                        <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Undo Modal */}
            <UndoModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleUndoConfirm} />

            {/* Delete Modal */}
            <DeleteModal isOpen={isDeleteModalOpen} onClose={handleModalClose} onConfirm={handleDeleteConfirm} />

            {/* ✅ Success Modal */}
            <DeleteSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleModalClose}
                message="Report has been successfully deleted."
            />
        </div>
    )
}

export default ReportsTable
