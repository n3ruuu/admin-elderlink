/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react"
import moment from "moment"
import EditIcon from "../../assets/icons/edit.svg"
import ViewIcon from "../../assets/icons/eye.svg"
import { jsPDF } from "jspdf"
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
        // Initialize jsPDF instance with landscape orientation
        const doc = new jsPDF("l", "mm", "a4") // Landscape orientation
    
       // Logo - Upper Left (Smaller Size)
       const logo = new Image()
       logo.src = ElderlinkLogo
       doc.addImage(logo, "PNG", 15, 10, 25, 20) // Smaller size for the logo
   
       const mojonLogo = new Image();
       mojonLogo.src = MojonLogo;
   
       // Position the logo in the upper-right corner
       doc.addImage(mojonLogo, "PNG", doc.internal.pageSize.width - 40, 10, 22, 22);
   
       doc.setFontSize(18)
       doc.setFont("helvetica", "bold")
       doc.setTextColor("#000000") // Black color for text
       const brgyHeader = "Brgy. Mojon"
       const brgyHeaderWidth = doc.getTextWidth(brgyHeader)
       doc.text(brgyHeader, doc.internal.pageSize.width / 2 - brgyHeaderWidth / 2, 20)
   
       // Title - Centered, bold
       doc.setFontSize(18)
       doc.setFont("helvetica", "bold")
       doc.text("Financial Records", doc.internal.pageSize.width / 2, 30, { align: "center" })
   
        // Table Headers and Data
        const headers = [
            "Control No.",
            "Full Name",
            "Quarter",
            "Disbursement Date",
            "Status",
            "Claimer",
            "Relationship",
        ]
    
        // Data for the table
        const tableData = socialPensionMembers.map((member) => [
            member.control_no,
            member.full_name,
            member.quarter,
            member.disbursement_date ? moment(member.disbursement_date).format("MMMM D, YYYY") : "N/A",
            member.status || "Unclaimed",
            member.claimer || "N/A",
            member.relationship || "N/A",
        ])
    
      // Create table using autoTable
doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 40, // Position the table below the header
    theme: "grid", // Grid style for table
    headStyles: {
        fillColor: [255, 255, 255], // White background for headers
        textColor: [0, 0, 0], // Black text color
        fontSize: 12,
        fontStyle: "normal", // Remove bold from header text
        lineWidth: 0.2, // Reduced border thickness for header cells
        lineColor: [0, 0, 0], // Black border for header cells
    }, // Header styling
    bodyStyles: {
        fontSize: 10, // Body text size
        textColor: [0, 0, 0], // Black text color
        lineWidth: 0.2, // Reduced border thickness for body cells
        lineColor: [0, 0, 0], // Black border for body cells
    }, // Body styling
    columnStyles: {
        0: { cellWidth: 25 }, // Control No. column width
        1: { cellWidth: 35 }, // Full Name column width
        2: { cellWidth: 35 }, // Disbursement Date column width
        3: { cellWidth: 30 }, // Quarter column width
        4: { cellWidth: 30 }, // Status column width
        5: { cellWidth: 30 }, // Claimer column width
        6: { cellWidth: 30 }, // Relationship column width
    },
    margin: { left: 40, right: 10 },
    didDrawPage: function (data) {
        // Footer Section - Lower Left with added margin
        doc.setFontSize(8);
        doc.text(
            `Report Generated On: ${moment().format("MM-DD-YYYY hh:mm A")}`,
            10,
            doc.internal.pageSize.height - 15
        );
        doc.text("Report Generated By: " + loggedInUsername, 10, doc.internal.pageSize.height - 10);

        // Page Number - Lower Right in "X of Y" format
        const totalPages = doc.internal.getNumberOfPages();
        const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
        doc.text(
            `Page ${pageNum} of ${totalPages}`,
            doc.internal.pageSize.width - 30,
            doc.internal.pageSize.height - 10
        );
    },
})

// Save the PDF
doc.save("social_pension_members_report.pdf");
    }
    

    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-6 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Full Name</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Disbursement Date</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Status</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Claimer</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Relationship</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => {
                        const isNullData = !member.disbursement_date && !member.claimer && !member.relationship

                        const getStatusColor = () => {
                            if (isNullData) return "" // No color for N/A
                            if (member.status === "Claimed") return "text-green-500 font-semibold"
                            if (member.status === "Unclaimed") return "text-red-500 font-semibold"
                            return "" // Default case
                        }

                        const getStatusText = () => {
                            if (isNullData) return "N/A"
                            return member.status || "Unclaimed"
                        }

                        return (
                            <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                                <td className="px-6 py-4 text-left">{member.control_no}</td>
                                <td className="px-6 text-left whitespace-nowrap">{member.full_name}</td>
                                <td className="px-6 whitespace-nowrap">
                                    {member.disbursement_date
                                        ? moment(member.disbursement_date).format("MMMM D, YYYY")
                                        : "N/A"}
                                </td>
                                <td className={`px-6 whitespace-nowrap ${getStatusColor()}`}>{getStatusText()}</td>
                                <td className="px-6 whitespace-nowrap">{member.claimer || "N/A"}</td>
                                <td className="px-6 whitespace-nowrap">{member.relationship || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap flex gap-3 items-center">
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
                {/* Pagination controls */}
                <div>
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
