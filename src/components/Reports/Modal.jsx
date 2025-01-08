/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import axios from "axios"
import { FiEdit } from "react-icons/fi"
import jsPDF from "jspdf"
import "jspdf-autotable"
import moment from "moment"
import ElderlinkLogo from "../../assets/elderlink-logo.png"
import SuccessModal from "./SuccessModal" // Import SuccessModal
import MojonLogo from "../../assets/mojon-logo.png"

const Modal = ({ isOpen, onClose, fetchReportsData }) => {
    const [filters, setFilters] = useState([{ field: "", condition: "", value: "" }])
    const [reportName, setReportName] = useState("Report Name")
    const [isEditing, setIsEditing] = useState(false)
    const [selectedReportType, setSelectedReportType] = useState("")
    const [selectedColumns, setSelectedColumns] = useState([]) // State for selected columns
    const loggedInUsername = localStorage.getItem("username") || ""
    const [membersData, setMembersData] = useState([])
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // State for SuccessModal
    const [successModalMessage, setSuccessModalMessage] = useState("") // Success message state
    const [successModalTitle, setSuccessModalTitle] = useState("") // Success title state

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

    const fetchMembersData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/members")
            const membersWithFullName = response.data.map((member) => ({
                ...member,
                fullName: `${member.firstName || ""} ${member.middleName || ""} ${member.lastName || ""}`.trim(),
                guardianFullName: `${member.guardianFirstName || ""} ${member.guardianLastName || ""}`.trim(),
            }))

            setMembersData(membersWithFullName)
        } catch (error) {
            console.error("Error fetching members data:", error)
        }
    }

    useEffect(() => {
        fetchMembersData()
    }, [])

    useEffect(() => {
        // Automatically select the columns id, controlNo, firstName, lastName if membersData is available
        if (membersData.length > 0) {
            setSelectedColumns(["id", "controlNo", "fullName"])
        }
    }, [membersData]) // Runs every time membersData changes

    const addFilter = () => {
        setFilters([...filters, { field: "", condition: "", value: "" }])
    }

    const removeFilter = (index) => {
        setFilters(filters.filter((_, i) => i !== index))
    }

    const handleFilterChange = (index, key, value) => {
        const updatedFilters = [...filters]
        updatedFilters[index][key] = value
        setFilters(updatedFilters)
    }

    const handleEditToggle = () => {
        setIsEditing(!isEditing)
    }

    const handleNameChange = (e) => {
        setReportName(e.target.value)
    }

    const handleColumnToggle = (column) => {
        setSelectedColumns((prevSelectedColumns) =>
            prevSelectedColumns.includes(column)
                ? prevSelectedColumns.filter((col) => col !== column)
                : [...prevSelectedColumns, column],
        )
    }

    const applyFilters = () => {
        return membersData.filter((item) => {
            return filters.every((filter) => {
                if (!filter.field || !filter.condition || !filter.value) return true

                const fieldValue = item[filter.field]?.toString() || ""
                const filterValue = filter.value.toLowerCase()

                switch (filter.condition) {
                    case "is equal to":
                        return fieldValue.toLowerCase() === filterValue
                    case "is not equal to":
                        return fieldValue.toLowerCase() !== filterValue
                    default:
                        return true
                }
            })
        })
    }

    const generatePDF = async () => {
        const filteredData = filters.length > 0 ? applyFilters() : membersData
        const doc = new jsPDF({ orientation: "landscape" })

        // Logo - Upper Left (Smaller Size)
        const logo = new Image()
        logo.src = ElderlinkLogo
        doc.addImage(logo, "PNG", 15, 10, 25, 20) // Smaller size for the logo
// Logo - Upper Right
const mojonLogo = new Image();
mojonLogo.src = MojonLogo;

// Position the logo in the upper-right corner
doc.addImage(mojonLogo, "PNG", doc.internal.pageSize.width - 40, 10, 22, 22); // Position adjusted for the right

        // Brgy. Mojon Header - Centered Below the Logo
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.setTextColor("#000000") // Black color for text
        const brgyHeader = "Brgy. Mojon"
        const brgyHeaderWidth = doc.getTextWidth(brgyHeader)
        doc.text(brgyHeader, doc.internal.pageSize.width / 2 - brgyHeaderWidth / 2, 20)

        // Center the Report Name Below Brgy. Mojon
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        const reportNameWidth = doc.getTextWidth(reportName)
        doc.text(reportName, doc.internal.pageSize.width / 2 - reportNameWidth / 2, 30)

        const headers = selectedColumns.map((col) => formatColumnName(col))
        const rows = filteredData.map((item) => selectedColumns.map((column) => item[column]))

        doc.autoTable({
    startY: 40,
    head: [headers],
    body: rows,
    headStyles: {
        fillColor: "#000000", // Black background for headers
        textColor: "#FFFFFF", // White text for headers
        fontSize: 12,
        halign: "center",
    },
    bodyStyles: {
        fontSize: 10,
        halign: "center",
        textColor: "#000000", // Black text for body
    },
    theme: "grid",
    didDrawPage: function (data) {
        // Footer Section - Lower Left with added margin
        doc.setFontSize(8);
        doc.text(
            `Report Generated On: ${moment().format("MM-DD-YYYY hh:mm A")}`,
            10,
            doc.internal.pageSize.height - 15
        );
        doc.text("Report Generated By: " + loggedInUsername, 10, doc.internal.pageSize.height - 10);

        // Page Number - Lower Right
        const pageCount = doc.internal.getNumberOfPages();
        const pageNumber = `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`;
        doc.text(
            pageNumber,
            doc.internal.pageSize.width - 30 - doc.getTextWidth(pageNumber), // Adjust for the width of the text
            doc.internal.pageSize.height - 10
        );
    },
});


        const pdfBlob = doc.output("blob")

   // Check if the selected report type is null or empty
   if (!selectedReportType) {
    alert("Please select a report type.");
    return;
}

        // Save the file locally
        doc.save(`${reportName}.pdf`) // This will trigger the download to your local computer
        await logAction("New Report")

        // Include the file path (uploads/)
        const filePath = `uploads/${reportName}.pdf`

        const formData = new FormData()
        formData.append("reportFile", pdfBlob, `${reportName}.pdf`)
        formData.append("reportName", reportName)
        formData.append("reportType", selectedReportType)
        formData.append("createdBy", loggedInUsername)
        formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"))
        formData.append("pdfFilePath", filePath) // Store only the file path in DB

        try {
          
            await axios.post("http://localhost:5000/reports/save-report", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Important for file uploads
                },
            })
        } catch (error) {
            console.error("Error saving report:", error)
        }
        // Open the success modal with a success message
        setSuccessModalTitle("Generated Report!")
        setSuccessModalMessage("Report has been successfully generated.")
        setIsSuccessModalOpen(true) // Open the success modal
        fetchReportsData()
    }

    const formatColumnName = (columnName) => {
        if (columnName === "fullName") {
            return "Full Name"
        }
        if (columnName === "dob") {
            return "Date of Birth"
        }

        if (columnName === "id") {
            return "ID"
        }
        return columnName
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
    }

    const columnNames = membersData.length
        ? (() => {
              const allColumns = Object.keys(membersData[0]).filter(
                  (key) =>
                      !["firstName", "middleName", "lastName", "guardianFirstName", "guardianLastName"].includes(key),
              )
              // Remove `fullName` and `guardianFullName` if they exist, then reinsert them in the desired order
              const withoutNames = allColumns.filter((col) => col !== "fullName" && col !== "guardianFullName")
              return [
                  withoutNames[0], // First column
                  withoutNames[1], // Second column
                  "fullName", // Full Name as the third column
                  "guardianFullName", // Guardian Full Name as the fourth column
                  ...withoutNames.slice(2), // Remaining columns
              ]
          })()
        : []

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white relative rounded-lg shadow-lg w-[70%] h-[90%] p-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-500">Report Name</p>
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={reportName}
                                    onChange={handleNameChange}
                                    onBlur={handleEditToggle}
                                    className="text-3xl font-bold text-[#333333] border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                    autoFocus
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-[#333333]">{reportName}</h2>
                            )}
                            <button onClick={handleEditToggle} className="text-[#333333] hover:text-gray-700">
                                <FiEdit className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-10 text-left">
                    <div>
    <p className="text-sm text-gray-500">Report Type</p>
    <select
        className="text-2xl font-bold text-[#333333] rounded-lg bg-transparent p-2 pl-0 w-full"
        value={selectedReportType}
        onChange={(e) => setSelectedReportType(e.target.value)}
        required
    >
        <option value="" disabled>Select Report Type</option>
        <option value="Members List">Members List</option>
        <option value="Health Records">Health Records</option>
        <option value="Financial Records">Financial Records</option>
    </select>
</div>

                        <div>
                            <p className="text-sm text-gray-500">Created By</p>
                            <h2 className="text-3xl font-bold text-[#333333]">{loggedInUsername}</h2>
                        </div>
                    </div>
                </div>

                {/* Columns */}
                <div className="mb-6">
                    <label className="font-semibold mb-2 block">Columns</label>
                    <div className="flex flex-wrap gap-2">
                        {columnNames.map((column) => (
                            <span
                                key={column}
                                className={`px-3 py-1 rounded-full cursor-pointer transition-all ease-in-out duration-300 ${
                                    selectedColumns.includes(column)
                                        ? "bg-[#219EBC] text-white border border-[#219EBC]"
                                        : "bg-transparent text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white"
                                }`}
                                onClick={() => handleColumnToggle(column)}
                            >
                                {formatColumnName(column)}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <label className="font-semibold mb-2 block">Filters</label>
                    {filters.map((filter, index) => (
                        <div key={index} className="flex items-center gap-4 mb-4">
                            <span className="border text-[#004365] border-[#004365] rounded-lg p-2 w-[100px] text-center font-bold">
                                SHOW
                            </span>

                            <select
                                className="border border-gray-300 rounded-lg p-2 w-1/3"
                                value={filter.field}
                                onChange={(e) => handleFilterChange(index, "field", e.target.value)}
                            >
                                <option value="">Select Field</option>
                                {columnNames.map((column) => (
                                    <option key={column} value={column}>
                                        {formatColumnName(column)}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border border-gray-300 rounded-lg p-2 w-1/3"
                                value={filter.condition}
                                onChange={(e) => handleFilterChange(index, "condition", e.target.value)}
                            >
                                <option value="">Condition</option>
                                <option value="is equal to">is equal to</option>
                                <option value="is not equal to">is not equal to</option>
                            </select>

                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 w-1/3"
                                value={filter.value}
                                onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                                placeholder="Filter value"
                            />

                            <button className="text-red-500" onClick={() => removeFilter(index)}>
                                Remove
                            </button>
                        </div>
                    ))}

                    <button className="text-[#219EBC] mt-4" onClick={addFilter}>
                        Add Filter
                    </button>
                </div>

                {/* Generate PDF and Close Buttons */}
                <div className="absolute bottom-6 right-6 flex gap-2">
                    <button
                        onClick={onClose} // Assuming `onClose` is passed as a prop to close the modal
                        className="border text-[#004365] border-[#004365] rounded-lg p-2 w-[100px] text-center font-bold hover:bg-[#004365] hover:text-white transition-all duration-300"
                    >
                        Close
                    </button>
                    <button
                        onClick={generatePDF}
                        className="bg-[#004365] text-white px-6 py-2 rounded-lg hover:bg-[#00354d] transition-all duration-300"
                    >
                        Generate PDF
                    </button>
                </div>
            </div>
            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => {
                        setIsSuccessModalOpen(false)
                    }}
                    title={successModalTitle}
                    message={successModalMessage}
                />
            )}
        </div>
    )
}

export default Modal
