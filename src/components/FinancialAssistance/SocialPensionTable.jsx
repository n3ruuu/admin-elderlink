/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react"
import moment from "moment"
import EditIcon from "../../assets/icons/edit.svg"
import ViewIcon from "../../assets/icons/eye.svg"
import html2pdf from "html2pdf.js"
import ReportIcon from "../../assets/icons/report.svg"
import AddIcon from "../../assets/icons/add.svg"
import ElderlinkLogo from "../../assets/elderlink-logo.png"
import AddModal from "./AddModal"
import MojonLogo from "../../assets/mojon-logo.png"

const SocialPensionTable = ({ socialPensionMembers, onEdit, handleViewClick }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5 // Number of items to display per page
    const [showReportOptions, setShowReportOptions] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)

    const totalPages = Math.ceil(socialPensionMembers.length / itemsPerPage) // Calculate total pages
    const startIndex = (currentPage - 1) * itemsPerPage // Calculate start index
    const currentMembers = socialPensionMembers.slice(startIndex, startIndex + itemsPerPage) // Get current active members for display
    const loggedInUsername = localStorage.getItem("username") || ""
    const [selectedMember, setSelectedMember] = useState(null)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleAddClick = (member) => {
        setSelectedMember(member) // Set the selected member data
        setShowAddModal(true) // Show the AddModal
        console.log(selectedMember)
    }

    const handleCloseAddModal = () => {
        setShowAddModal(false) // Close the AddModal
        setSelectedMember(null) // Reset the selected member data
    }

    const generateCSV = () => {
        const header = ["Control No.", "Full Name", "Quarter", "Disbursement Date", "Status", "Claimer", "Relationship"]

        // Use all socialPensionMembers instead of just currentMembers for CSV export
        const csvData = [
            header,
            ...socialPensionMembers.map((member) => [
                member.control_no,
                member.full_name,
                member.quarter,
                member.disbursement_date ? moment(member.disbursement_date).format("MMMM D, YYYY") : "N/A",
                member.status || "Unclaimed",
                member.claimer || "N/A",
                member.relationship || "N/A",
            ]),
        ]

        // Convert data to a CSV string
        const csvContent = csvData.map((row) => row.join(",")).join("\n")

        // Create a Blob and trigger the download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "members_report.csv"
        link.click()
    }

    const generatePDF = () => {
        const element = document.createElement("div")

        element.innerHTML = `
    <style>
        @page { size: landscape; }

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

        .header img { height: 60px; }

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

        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f1f1f1; }

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
        <h1>Financial Records Report</h1>
        <img src="${MojonLogo}" alt="Mojon Logo" />
    </div>

    <div class="barangay-info">
        <p><strong>Barangay Mojon</strong></p>
        <p>VR69+82W, Malolos, Bulacan</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Control No.</th>
                <th>Full Name</th>
                <th>Quarter</th>
                <th>Disbursement Date</th>
                <th>Status</th>
                <th>Claimer</th>
                <th>Relationship</th>
            </tr>
        </thead>
        <tbody>
            ${socialPensionMembers
                .map(
                    (member) => `
                    <tr>
                        <td>${member.control_no || "N/A"}</td>
                        <td>${member.full_name || "N/A"}</td>
                        <td>${member.quarter || "N/A"}</td>
                        <td>${member.disbursement_date ? moment(member.disbursement_date).format("MMMM D, YYYY") : "N/A"}</td>
                        <td>${member.status || "Unclaimed"}</td>
                        <td>${member.claimer || "N/A"}</td>
                        <td>${member.relationship || "N/A"}</td>
                    </tr>
                `,
                )
                .join("")}
        </tbody>
    </table>
    `

        const opt = {
            margin: [10, 10, 20, 10],
            filename: "social_pension_members_report.pdf",
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
                const footerText = `Report Generated On: ${moment().format("MM-DD-YYYY hh:mm A")} | Report By: ${localStorage.getItem("username") || ""}`

                pdf.setFont("Poppins", "normal")
                pdf.setFontSize(10)

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i)
                    const pageWidth = pdf.internal.pageSize.getWidth()
                    const pageHeight = pdf.internal.pageSize.getHeight()

                    pdf.text(footerText, 10, pageHeight - 10)
                    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10)
                }
            })
            .save()
    }

    return (
        <div className="max-h-[450px] overflow-y-auto rounded-xl shadow-xl border border-gray-200">
            <table className="min-w-full text-[#333333] font-medium bg-white shadow-lg rounded-xl">
                <thead className="text-white sticky bg-[#219EBC] opacity-90 top-0 h-[50px]">
                    <tr>
                        <th className="px-6 py-4 text-center font-medium whitespace-nowrap border-x border-gray-200 w-[10%]">
                            Control No.
                        </th>
                        <th className="px-6 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Full Name
                        </th>
                        <th className="text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Disbursement Date
                        </th>
                        <th className="px-6 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Status
                        </th>
                        <th className="px-16 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Claimer
                        </th>
                        <th className="px-6 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Relationship
                        </th>
                        <th className="px-6 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => {
                        const isNullData = !member.disbursement_date && !member.claimer && !member.relationship

                        const getStatusColor = () => {
                            if (isNullData) return ""
                            if (member.status === "Claimed") return "text-green-500 font-semibold"
                            if (member.status === "Unclaimed") return "text-red-500 font-semibold"
                            return ""
                        }

                        const getStatusText = () => {
                            if (isNullData) return "N/A"
                            return member.status || "Unclaimed"
                        }

                        return (
                            <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                                <td className="px-6 py-4 text-left border-x border-gray-200">{member.control_no}</td>
                                <td className="px-6 text-left whitespace-nowrap border-x border-gray-200">
                                    {member.full_name}
                                </td>
                                <td className="px-6 whitespace-nowrap border-x border-gray-200">
                                    {member.disbursement_date
                                        ? moment(member.disbursement_date).format("MMMM D, YYYY")
                                        : "N/A"}
                                </td>
                                <td className={`px-6 whitespace-nowrap border-x border-gray-200 ${getStatusColor()}`}>
                                    {getStatusText()}
                                </td>
                                <td className="px-6 whitespace-nowrap border-x border-gray-200">
                                    {member.claimer || "N/A"}
                                </td>
                                <td className="px-6 whitespace-nowrap border-x border-gray-200">
                                    {member.relationship || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex gap-3 items-center border-x border-gray-200">
                                    <button aria-label="Edit" onClick={() => onEdit(member)}>
                                        <img src={EditIcon} alt="Edit" />
                                    </button>
                                    <button aria-label="View" onClick={() => handleViewClick(member)}>
                                        <img src={ViewIcon} alt="View" />
                                    </button>
                                    <button aria-label="Add" onClick={() => handleAddClick(member)}>
                                        <img src={AddIcon} alt="Add" />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="flex fixed bottom-5 mt-4">
                {/* Pagination Controls */}
                <div className="flex fixed bottom-5 mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 ${currentPage === index + 1 ? "bg-[#219EBC] text-white" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md mx-1`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                    >
                        Next
                    </button>
                </div>

                {/* Generate Report button at bottom-right */}
                <button
                    className="fixed bottom-5 right-16 border text-[#219EBC] border-[#219EBC] flex px-5 py-3 rounded-md hover:bg-[#219EBC] hover:text-white transition-colors duration-300 group"
                    onClick={() => setShowReportOptions(!showReportOptions)}
                >
                    <img
                        src={ReportIcon}
                        alt="Report Icon"
                        className="w-5 h-5 mr-2 transition duration-300 group-hover:brightness-0 group-hover:invert"
                    />
                    <span>Generate Report</span>
                </button>

                {/* Report Options Modal */}
                {showReportOptions && (
                    <div className="fixed bottom-16 right-16 flex flex-col items-center bg-white p-4 rounded-md shadow-lg space-y-2">
                        <h2 className="text-lg font-semibold text-black mb-4">Select Report Format</h2>
                        <button
                            onClick={generateCSV}
                            className="text-[#219EBC] border border-[#219EBC] px-4 py-2 rounded-md w-full hover:bg-[#219EBC] hover:text-white transition duration-200"
                        >
                            Download CSV
                        </button>
                        <button
                            onClick={generatePDF}
                            className="text-[#219EBC] border border-[#219EBC] px-4 py-2 rounded-md w-full hover:bg-[#219EBC] hover:text-white transition duration-200"
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={() => setShowReportOptions(false)}
                            className="mt-4 text-gray-500 w-full text-center hover:text-[#219EBC] transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                )}

                {showAddModal && (
                    <AddModal
                        onClose={handleCloseAddModal} // Pass the close handler to the modal
                        member={selectedMember}
                    />
                )}
            </div>
        </div>
    )
}

export default SocialPensionTable
