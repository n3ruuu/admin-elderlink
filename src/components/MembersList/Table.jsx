/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import moment from "moment"
import { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ReportIcon from "../../assets/icons/report.svg"
import { jsPDF } from "jspdf"
import ElderlinkLogo from "../../assets/elderlink-logo.png"
import ArchiveModal from "./ArchiveModal" // Import ArchiveModal
import SuccessModal from "./SuccessModal"
import axios from "axios" // Make sure axios is imported

const Table = ({ membersData, onEdit, fetchMembersData }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    const [showReportOptions, setShowReportOptions] = useState(false)

    const totalPages = Math.ceil(membersData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMembers = membersData.slice(startIndex, startIndex + itemsPerPage)
    const loggedInUsername = localStorage.getItem("username") || ""

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successModalMessage, setSuccessModalMessage] = useState("")
    const [successModalTitle, setSuccessModalTitle] = useState("")

    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false) // State to handle Archive Modal visibility
    const [selectedMember, setSelectedMember] = useState(null) // Track selected member for archiving

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

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
            } catch (error) {
                console.error("Error archiving member:", error)
                alert("There was an error archiving the member. Please try again.")
            }
        }
    }

    // Generate CSV data
    const csvData = [
        [
            "Control No.",
            "Full Name",
            "Birthdate",
            "Sex",
            "Civil Status",
            "Address",
            "Contact Number",
            "Purchase Booklet No.",
            "Medicine Booklet No.",
            "Date Issued",
        ],
        ...membersData.map((member) => [
            member.controlNo,
            `${member.firstName} ${member.middleName || ""} ${member.lastName} ${member.extension}`,
            moment(member.dob).format("MM-DD-YYYY"),
            member.sex,
            member.civilStatus,
            member.address,
            member.contactNumber,
            member.purchaseBookletNo || "N/A",
            member.medicineBookletNo || "N/A",
            member.dateIssued ? moment(member.dateIssued).format("MM-DD-YYYY") : "N/A",
        ]),
    ]

    // Convert CSV data to a CSV string
    const generateCSV = () => {
        const csvContent = csvData.map((row) => row.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "members_report.csv"
        link.click()
    }

    const generatePDF = () => {
        const doc = new jsPDF("l", "mm", "a4") // 'l' for landscape orientation

        // Logo - Upper Left (Smaller Size)
        const logo = new Image()
        logo.src = ElderlinkLogo
        doc.addImage(logo, "PNG", 10, 10, 30, 16) // Smaller size for the logo

        // Title - Centered, bold
        doc.setFontSize(22)
        doc.setFont("helvetica", "bold")
        doc.text("Members List Report", doc.internal.pageSize.width / 2, 20, { align: "center" })

        // Table Headers and Data
        const headers = [
            "Control No.",
            "Full Name",
            "Birthdate",
            "Sex",
            "Civil Status",
            "Address",
            "Contact Number",
            "Purchase Booklet No.",
            "Medicine Booklet No.",
            "Date Issued",
        ]

        const rows = membersData.map((member) => [
            member.controlNo,
            `${member.firstName} ${member.middleName || ""} ${member.lastName} ${member.extension}`,
            moment(member.dob).format("MM-DD-YYYY"),
            member.sex,
            member.civilStatus,
            member.address,
            member.contactNumber,
            member.purchaseBookletNo || "N/A",
            member.medicineBookletNo || "N/A",
            member.dateIssued ? moment(member.dateIssued).format("MM-DD-YYYY") : "N/A",
        ])

        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 40, // Position the table below the header
            theme: "grid", // Grid style for table
            headStyles: {
                fillColor: [33, 158, 188],
                textColor: [255, 255, 255],
                fontSize: 12,
            }, // Header styling
            bodyStyles: { fontSize: 10 }, // Body text size
            columnStyles: {
                0: { cellWidth: 25 }, // Control No. column width
                1: { cellWidth: 30 }, // Full Name column width
                2: { cellWidth: 30 }, // Birthdate column width
                3: { cellWidth: 20 }, // Sex column width
                4: { cellWidth: 30 }, // Civil Status column width
                5: { cellWidth: 50 }, // Address column width
                6: { cellWidth: 30 }, // Contact Number column width
                7: { cellWidth: 20 }, // Purchase Booklet column width
                8: { cellWidth: 20 }, // Medicine Booklet column width
                9: { cellWidth: 20 }, // Date Issued column width
            },
            margin: { left: 10, right: 10 },
            didDrawPage: function (data) {
                // Footer Section - Lower Left with added margin
                doc.setFontSize(8)
                doc.text(
                    `Report Generated On: ${moment().format("MM-DD-YYYY hh:mm A")}`,
                    10,
                    doc.internal.pageSize.height - 15,
                )
                doc.text("Report Generated By: " + loggedInUsername, 10, doc.internal.pageSize.height - 10)

                // Page Number - Lower Right
                doc.text(
                    "Page " + doc.internal.getNumberOfPages(),
                    doc.internal.pageSize.width - 30,
                    doc.internal.pageSize.height - 10,
                )
            },
        })

        // Save the PDF
        doc.save("members_list_report_landscape.pdf")
    }

    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] rounded-xl shadow-lg">
                <thead className="text-[#767171CC] h-[80px] align-baseline">
                    <tr>
                        <th className="pl-8 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Full Name</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Birthdate</th>
                        <th className="text-left font-medium whitespace-nowrap w-[5%]">Sex</th>
                        <th className="text-left font-medium whitespace-nowrap w-fit">Civil Status</th>
                        <th className="text-left font-medium whitespace-nowrap w-[12%]">Address</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Contact Number</th>
                        <th className="text-left font-medium whitespace-nowrap w-[7%]">
                            Purchase <br /> Booklet No.
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[8%]">
                            Medicine <br /> Booklet No.
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[5%]">Date Issued</th>
                        <th className="px-4 text-left font-medium whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                            <td className="px-8 py-4 text-left">{member.controlNo}</td>
                            <td className="text-left whitespace-nowrap">
                                {member.firstName} {member.middleName && `${member.middleName} `} {member.lastName}{" "}
                                {member.extension}
                            </td>
                            <td className="text-left whitespace-nowrap">{moment(member.dob).format("MM-DD-YYYY")}</td>
                            <td className="text-left">{member.sex}</td>
                            <td className="text-left">{member.civilStatus}</td>
                            <td className="text-left whitespace-nowrap">{member.address}</td>
                            <td className="text-left">{member.contactNumber}</td>
                            <td className="text-left">{member.purchaseBookletNo || "N/A"}</td>
                            <td className="text-left">{member.medicineBookletNo || "N/A"}</td>
                            <td className="text-left whitespace-nowrap">
                                {member.dateIssued ? moment(member.dateIssued).format("MM-DD-YYYY") : "N/A"}
                            </td>
                            <td className="px-4 py-4 flex gap-2">
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => onEdit(member)} // Trigger the edit action
                                >
                                    <img src={EditIcon} alt="Edit Icon" className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => openArchiveModal(member)} // Open ArchiveModal when clicked
                                >
                                    <img src={ArchiveIcon} alt="Archive Icon" className="w-5 h-5" />
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
    )
}

export default Table
