/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import axios from "axios"
import { FiEdit } from "react-icons/fi"
import html2pdf from "html2pdf.js"
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
        if (!isEditing) {
            // Going into edit mode: clear the input
            setReportName("")
        }
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

    const formatValue = (col, value) => {
        if (!value) return ""
        if (col === "dob") {
            // Format DOB to MM-DD-YYYY using moment
            return moment(value).format("MM-DD-YYYY")
        }
        // For arrays/strings with commas
        return value
            .toString()
            .split(",")
            .map((item) => item.trim())
            .join(", ")
    }

    const generatePDF = async () => {
        if (!selectedReportType) {
            alert("Please select a report type.")
            return
        }

        const filteredData = filters.length > 0 ? applyFilters() : membersData

        const element = document.createElement("div")
        element.innerHTML = `
        <style>
        @page { size: landscape; }
        body { font-family: 'Poppins', sans-serif; margin: 20px; color: #333; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 4px solid #219EBC; padding-bottom: 10px; }
        .header img { height: 60px; }
        .header h1 { flex-grow:1; text-align:center; font-size:24px; color:#219EBC; margin:0; }
        .barangay-info { font-size:14px; text-align:center; color:#555; margin-top:5px; }
        table { width:100%; border-collapse: collapse; margin-top: 20px; font-size:14px; border-radius: 8px; overflow: hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);}
        th, td { border:1px solid #ddd; padding:5px; vertical-align:top; }
        th { background-color: rgba(33, 158, 188, 0.8); color:white; text-align:center; font-weight:600; letter-spacing:0.5px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color:#f1f1f1; }
        .footer { margin-top:20px; font-size:12px; color:#666; text-align:right; border-top:1px solid #ccc; padding-top:10px; }
        </style>

        <div class="header">
            <img src="${ElderlinkLogo}" alt="Elderlink Logo" />
            <h1>${reportName}</h1>
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
                    ${selectedColumns.map((col) => `<th>${formatColumnName(col)}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                ${filteredData
                    .map(
                        (member) => `
                    <tr>
                        ${selectedColumns
                            .map(
                                (col) =>
                                    `<td>${col === "fullName" ? `${member.firstName} ${member.lastName}` : formatValue(col, member[col])}</td>`,
                            )
                            .join("")}
                    </tr>`,
                    )
                    .join("")}
            </tbody>
        </table>
    `

        const opt = {
            margin: [10, 10, 20, 10],
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, logging: false },
            jsPDF: { unit: "mm", format: "legal", orientation: "landscape" },
            pagebreak: { mode: ["css", "legacy"] },
        }

        try {
            // Generate PDF as blob
            const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob")

            // Save locally
            html2pdf().set(opt).from(element).save(`${reportName}.pdf`)

            // Log action
            await logAction("New Report")

            // Upload to backend
            const filePath = `uploads/${reportName}.pdf`
            const formData = new FormData()
            formData.append("reportFile", pdfBlob, `${reportName}.pdf`)
            formData.append("reportName", reportName)
            formData.append("reportType", selectedReportType)
            formData.append("createdBy", loggedInUsername)
            formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"))
            formData.append("pdfFilePath", filePath)

            await axios.post("http://localhost:5000/reports/save-report", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            // Open success modal
            setSuccessModalTitle("Generated Report!")
            setSuccessModalMessage("Report has been successfully generated.")
            setIsSuccessModalOpen(true)
            fetchReportsData()
        } catch (err) {
            console.error("Error generating/saving report:", err)
        }
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
                      ![
                          "firstName",
                          "middleName",
                          "lastName",
                          "guardianFirstName",
                          "guardianMiddleName",
                          "guardianLastName",
                          "guardianFullName",
                          "form_path", // <- remove this column
                      ].includes(key),
              )
              // Remove `fullName` if it exists, then reinsert in desired order
              const withoutNames = allColumns.filter((col) => col !== "fullName")
              return [
                  withoutNames[0], // First column
                  withoutNames[1], // Second column
                  "fullName",
                  "guardianFullName", // Full Name as the third column
                  ...withoutNames.slice(2), // Remaining columns
              ]
          })()
        : []

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white relative rounded-lg shadow-lg w-[70%] h-[90%] p-6">
                {/* Header */}
                <div className="grid grid-cols-3 gap-6 border-b pb-4 mb-6 items-end">
                    {/* Report Name */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Report Name</label>
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={reportName}
                                    onChange={handleNameChange}
                                    onBlur={handleEditToggle}
                                    className="text-2xl font-bold text-[#333333] border-b border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
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

                    {/* Report Type */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Report Type</label>
                        <select
                            className="text-lg font-semibold text-[#333333] rounded-lg bg-transparent w-[200px] h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                            value={selectedReportType}
                            onChange={(e) => setSelectedReportType(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select Report Type
                            </option>
                            <option value="Members List">Members List</option>
                            <option value="Health Records">Health Records</option>
                            <option value="Financial Records">Financial Records</option>
                        </select>
                    </div>

                    {/* Created By */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Created By</label>
                        <h2 className="text-2xl font-bold text-[#333333]">{loggedInUsername}</h2>
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
                            <span
                                className="border text-[#219EBC] border-[#219EBC] rounded-lg p-2 w-[100px] text-center font-bold
             hover:bg-[#219EBC] hover:text-white cursor-pointer transition-all duration-300"
                            >
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
                        onClick={onClose}
                        className="border text-[#219EBC] border-[#219EBC] rounded-lg p-2 w-[100px] text-center font-bold 
               hover:bg-[#219EBC] hover:text-white transition-all duration-300"
                    >
                        Close
                    </button>
                    <button
                        onClick={generatePDF}
                        className="bg-[#219EBC] text-white px-6 py-2 rounded-lg 
               hover:bg-[#1B7B9A] transition-all duration-300"
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
