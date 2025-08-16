/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import EditIcon from "../../assets/icons/edit2.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ReportIcon from "../../assets/icons/report.svg"
import html2pdf from "html2pdf.js"
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
        const element = document.createElement("div")

        const formatDate = (date) => (date ? moment(date).format("MM-DD-YYYY") : "N/A")

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
        <h1>Health Records Report</h1>
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
                <th>Control No.</th>
                <th>Full Name</th>
                <th>Medical Conditions</th>
                <th>Medications</th>
                <th>Guardian Name</th>
                <th>Guardian Email</th>
                <th>Guardian Contact</th>
                <th>Guardian Relationship</th>
            </tr>
        </thead>
        <tbody>
            ${currentMembers
                .map(
                    (member) => `
                    <tr>
                        <td>${member.controlNo || "N/A"}</td>
                        <td>${member.firstName || ""} ${member.middleName || ""} ${member.lastName || ""} ${member.extension || ""}</td>
                        <td>${member.medicalConditions || "N/A"}</td>
                        <td>${member.medications || "N/A"}</td>
                        <td>${member.guardianFirstName || ""} ${member.guardianLastName || ""}</td>
                        <td>${member.guardianEmail || "N/A"}</td>
                        <td>${member.guardianContact || "N/A"}</td>
                        <td>${member.guardianRelationship || "N/A"}</td>
                    </tr>
                `,
                )
                .join("")}
        </tbody>
    </table>
    `

        const opt = {
            margin: [10, 10, 20, 10],
            filename: "health_records_report.pdf",
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
                const footerText = `Report Generated On: ${moment().format(
                    "MM-DD-YYYY hh:mm A",
                )} | Report By: ${localStorage.getItem("username") || ""}`

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
        <div className="max-h-[450px] overflow-y-auto rounded-xl shadow-lg">
            <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-300">
                <thead className="text-white sticky bg-[#219EBC] opacity-90 top-0 h-[50px]">
                    <tr>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Control No.
                        </th>
                        <th className="p-4 text-center font-medium w-[200px] border-x border-gray-200">Full Name</th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-300">
                            Medical Conditions
                        </th>
                        <th className="p-4 text-center font-medium whitespace-normal border-x border-gray-300">
                            Medications
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-300">
                            Guardian Name
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-300">
                            Guardian Email
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-300">
                            Guardian Contact
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-300">
                            Relationship
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-300">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {currentMembers.map((member, index) => {
                        const hasChronicCondition =
                            member.medicalConditions &&
                            member.medicalConditions
                                .split(",")
                                .some((condition) => chronicConditions.includes(condition.trim()))

                        return (
                            <tr
                                key={member.id}
                                className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"} ${
                                    hasChronicCondition ? "border-l-4 border-red-500" : ""
                                }`}
                            >
                                <td className="p-4 text-left font-medium text-[#333333] align-baseline border-x border-gray-300">
                                    {member.controlNo}
                                </td>
                                <td className="p-4 text-left font-medium text-[#333333] align-baseline border-x border-gray-300">
                                    {member.firstName} {member.middleName && `${member.middleName} `}
                                    {member.lastName} {member.extension}
                                </td>
                                <td className="p-4 text-left font-medium text-[#333333] whitespace-normal align-baseline border-x border-gray-300">
                                    {member.medicalConditions
                                        ? member.medicalConditions
                                              .split(",")
                                              .map((condition, idx) => <div key={idx}>{condition.trim()}</div>)
                                        : ""}
                                </td>
                                <td className="p-4 text-left font-medium text-[#333333] whitespace-normal align-baseline border-x border-gray-300">
                                    {member.medications
                                        ? member.medications
                                              .split(",")
                                              .map((medication, idx) => <div key={idx}>{medication.trim()}</div>)
                                        : ""}
                                </td>
                                <td className="p-4 text-left font-medium text-[#333333] whitespace-nowrap align-baseline border-x border-gray-300">
                                    {member.guardianFirstName} {member.guardianLastName}
                                </td>
                                <td className="p-4 text-left font-medium text-[#333333] whitespace-nowrap align-baseline border-x border-gray-300">
                                    {member.guardianEmail}
                                </td>
                                <td className="p-4 text-left font-medium text-[#333333] align-baseline border-x border-gray-300">
                                    {member.guardianContact}
                                </td>
                                <td className="p-4 text-left font-medium text-[#333333] whitespace-nowrap align-baseline border-x border-gray-300">
                                    {member.guardianRelationship}
                                </td>
                                <td className="p-4 text-left font-medium text-[#333333] flex gap-3 items-center border-x border-gray-300">
                                    <button aria-label="Edit" onClick={() => onEdit(member)}>
                                        <img src={EditIcon} alt="Edit" />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => openArchiveModal(member)}
                                    >
                                        <img src={ArchiveIcon} alt="Archive" />
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
