/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import EditIcon from "../../assets/icons/edit2.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ReportIcon from "../../assets/icons/report.svg"
import { jsPDF } from "jspdf"
import ElderlinkLogo from "../../assets/elderlink-logo.png"
import moment from "moment"
import ArchiveModal from "./ArchiveModal" // Import ArchiveModal
import axios from "axios" // Make sure axios is imported
import SuccessModal from "./SuccessModal"
import MojonLogo from "../../assets/mojon-logo.png"

const Table = ({ membersData, onEdit, chronicConditions, fetchMembersData, logAction }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6 // Number of items to display per page
    const [showReportOptions, setShowReportOptions] = useState(false)

    const totalPages = Math.ceil(membersData.length / itemsPerPage) // Calculate total pages
    const startIndex = (currentPage - 1) * itemsPerPage // Calculate start index
    const currentMembers = membersData.slice(startIndex, startIndex + itemsPerPage) // Get current active members for display
    const loggedInUsername = localStorage.getItem("username") || ""

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successModalMessage, setSuccessModalMessage] = useState("")
    const [successModalTitle, setSuccessModalTitle] = useState("")

    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false) // State to handle Archive Modal visibility
    const [selectedMember, setSelectedMember] = useState(null) // Track selected member for archiving

    // Open the archive modal and set the selected member
    const openArchiveModal = (member) => {
        setSelectedMember(member)
        setIsArchiveModalOpen(true)
    }

    // Handle archiving the member
    const handleArchiveConfirm = async (reason) => {
        if (selectedMember) {
            console.log(`Archiving ${selectedMember.name} for reason: ${reason}`)

            try {
                // Make a PUT request to update the member status
                const response = await axios.put(`http://localhost:5000/members/archive/${selectedMember.id}`, {
                    reason,
                })

                console.log(response.data.message) // e.g., "Member archived successfully"

                // Close the modal after successful archiving
                setIsArchiveModalOpen(false) // Close modal locally

                setSuccessModalTitle("Archived Member!")
                setSuccessModalMessage("Member information has been successfully archived.")
                setIsSuccessModalOpen(true) // Open the success modal
                fetchMembersData()
                await logAction("Archive Member")
            } catch (error) {
                console.error("Error archiving member:", error)
            }
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // Convert CSV data to a CSV string
    const generateCSV = () => {
        const csvData = [
            [
                "Control No.",
                "Full Name",
                "Medical Conditions",
                "Medications",
                "Guardian Name",
                "Guardian Email",
                "Guardian Contact",
                "Guardian Relationship",
            ],
            ...membersData.map((member) => [
                member.controlNo,
                `${member.firstName} ${member.middleName} ${member.lastName} ${member.extension}`,
                member.medicalConditions,
                member.medications,
                `${member.guardianFirstName} ${member.guardianLastName}`,
                member.guardianEmail,
                member.guardianContact,
                member.guardianRelationship,
            ]),
        ]
        const csvContent = csvData.map((row) => row.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "health_records_report.csv"
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
     doc.text("Health Records", doc.internal.pageSize.width / 2, 30, { align: "center" })
 
        // Table Headers and Data
        const headers = [
            "Control No.",
            "Full Name",
            "Medical Conditions",
            "Medications",
            "Guardian Name",
            "Guardian Email",
            "Guardian Contact",
            "Guardian Relationship",
        ]
    
        const tableData = currentMembers.map((member) => [
            member.controlNo,
            `${member.firstName} ${member.middleName || ""} ${member.lastName} ${member.extension}`,
            member.medicalConditions,
            member.medications,
            `${member.guardianFirstName} ${member.guardianLastName}`,
            member.guardianEmail,
            member.guardianContact,
            member.guardianRelationship,
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
            2: { cellWidth: 35 }, // Medical Conditions column width
            3: { cellWidth: 35 }, // Medications column width
            4: { cellWidth: 30 }, // Guardian Name column width
            5: { cellWidth: 50 }, // Guardian Email column width
            6: { cellWidth: 30 }, // Guardian Contact column width
            7: { cellWidth: 30 }, // Guardian Relationship column width
        },
        margin: { left: 10, right: 10 },
        didDrawPage: function (data) {
            // Footer Section - Lower Left with added margin
            doc.setFontSize(8);
            doc.text(
                `Report Generated On: ${moment().format("MM-DD-YYYY hh:mm A")}`,
                10,
                doc.internal.pageSize.height - 15
            );
            doc.text("Report Generated By: " + loggedInUsername, 10, doc.internal.pageSize.height - 10);

            // Page Number - Lower Right with "X of Y" format
            const totalPages = doc.internal.getNumberOfPages();
            const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
            doc.text(`Page ${pageNum} of ${totalPages}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        },
    });

    // Save the PDF
    doc.save("health_records_report.pdf");
};  
    

    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-lg">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="pl-8 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Full Name</th>
                        <th className="text-left font-medium whitespace-normal">Medical Conditions</th>
                        <th className="text-left font-medium whitespace-normal">Medications</th>
                        <th className="text-left font-medium whitespace-nowrap">Guardian Name</th>
                        <th className="text-left font-medium whitespace-nowrap">Guardian Email</th>
                        <th className="text-left font-medium whitespace-nowrap">Guardian Contact</th>
                        <th className="text-left font-medium whitespace-nowrap">Relationship</th>
                        <th className="text-left font-medium whitespace-nowrap">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                            <td className="px-8 py-4 text-left align-baseline">{member.controlNo}</td>
                            <td className="text-left whitespace-nowrap align-baseline">
                                {member.firstName} {member.middleName && `${member.middleName} `} {member.lastName}{" "}
                                {member.extension}
                            </td>

                            <td className="whitespace-normal py-4 align-baseline">
                                {member.medicalConditions
                                    ? member.medicalConditions.split(",").map((condition, idx) => (
                                          <div
                                              key={idx}
                                              className={`${
                                                  chronicConditions.includes(condition.trim()) ? "text-red-500" : ""
                                              }`}
                                          >
                                              {condition.trim()}
                                          </div>
                                      ))
                                    : ""}
                            </td>
                            <td className="whitespace-normal py-4 align-baseline">
                                {member.medications
                                    ? member.medications
                                          .split(",")
                                          .map((medication, idx) => <div key={idx}>{medication.trim()}</div>)
                                    : ""}
                            </td>

                            <td className="whitespace-nowrap align-baseline">
                                {member.guardianFirstName} {member.guardianLastName}
                            </td>

                            <td className="whitespace-nowrap align-baseline">{member.guardianEmail}</td>
                            <td className="text-left  align-baseline">{member.guardianContact}</td>
                            <td className="whitespace-nowrap align-baseline">{member.guardianRelationship}</td>

                            <td className="flex gap-3 items-center py-4">
                                <button aria-label="Edit">
                                    <img src={EditIcon} alt="Edit" onClick={() => onEdit(member)} />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => openArchiveModal(member)} // Open ArchiveModal when clicked
                                >
                                    <img src={ArchiveIcon} alt="Archive" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex fixed bottom-5 mt-4">
                {/* Pagination controls */}
                <div>
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

                {isArchiveModalOpen && (
                    <ArchiveModal
                        isOpen={isArchiveModalOpen}
                        onClose={() => setIsArchiveModalOpen(false)}
                        onConfirm={handleArchiveConfirm} // Pass the handler to perform archiving
                    />
                )}

                {/* Success Modal */}
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={successModalTitle}
                    message={successModalMessage}
                    onGoToArchives={() => console.log("Navigating to Archives")}
                    isArchiving={false}
                />
            </div>
        </div>
    )
}

export default Table
