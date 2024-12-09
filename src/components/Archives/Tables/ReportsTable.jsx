import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal" // Ensure the path to UndoModal is correct
import axios from "axios"

const ReportsTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false) // Modal visibility state
    const [reportsData, setReportsData] = useState([]) // Store fetched reports
    const [selectedReportId, setSelectedReportId] = useState(null) // Track selected report ID

    const fetchReportsData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/reports/get-news") // Replace with your API endpoint
            const archivedReports = response.data.filter((report) => report.status === "Archived") // Filter archived reports
            setReportsData(archivedReports) // Update state with filtered data
        } catch (error) {
            console.error("Error fetching reports data:", error)
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchReportsData()
    }, [])

    // Open the modal and set the selected report ID
    const handleUndoClick = (id) => {
        setSelectedReportId(id) // Set the ID of the news to be undone
        setIsModalOpen(true) // Open the UndoModal
    }

    // Handle confirming the Undo action
    const handleUndoConfirm = async () => {
        if (!selectedReportId) return // Ensure an ID is selected

        try {
            const response = await axios.put(`http://localhost:5000/reports/undo/${selectedReportId}`, {
                status: "Active", // Example payload; adjust based on API requirements
            })

            if (response.status === 200) {
                // Update the state to reflect the change
                setReportsData((prevReports) =>
                    prevReports.map((report) =>
                        report.id === selectedReportId ? { ...report, status: "Active" } : report,
                    ),
                )
                console.log("Report status updated successfully.")
                fetchReportsData()
            } else {
                console.error("Failed to update report status.")
            }
        } catch (error) {
            console.error("Error confirming undo action:", error)
        } finally {
            setIsModalOpen(false) // Close the modal
        }
    }

    // Handle closing the modal
    const handleModalClose = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="px-4">
            {/* Scrollable container with a fixed height */}
            <div className="overflow-y-auto rounded-xl shadow-xl max-h-[calc(90vh-200px)] mx-16">
                <table className="min-w-full bg-white">
                    <thead className="text-gray-500 border-b">
                        <tr>
                            <th className="px-8 py-4 text-left font-medium whitespace-nowrap">Report Name</th>
                            <th className="px-6 py-4 text-left font-medium">Report Type</th>
                            <th className="px-6 py-4 text-left font-medium">Time Created</th>
                            <th className="px-6 py-4 text-left font-medium">Created by</th>
                            <th className="px-6 py-4 text-left font-medium">Action</th>
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
                                <td className="px-8 py-4 text-left align-top">{report.report_name}</td>
                                <td className="px-6 py-4 text-left align-top">{report.report_type}</td>
                                <td className="px-6 py-4 text-left align-top">
                                    {moment(report.created_at).format("MM-DD-YYYY, h:mm:ss A")}
                                </td>
                                <td className="px-6 py-4 text-left align-top whitespace-nowrap">{report.created_by}</td>
                                <td className="pl-8 text-left">
                                    <button
                                        className="cursor-pointer text-[#219EBC] font-semibold underline"
                                        onClick={() => handleUndoClick(report.id)}
                                    >
                                        Undo
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Undo Modal */}
            <UndoModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleUndoConfirm} />
        </div>
    )
}

export default ReportsTable
