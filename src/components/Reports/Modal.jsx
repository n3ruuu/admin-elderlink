/* eslint-disable react/prop-types */
import { useState } from "react"
import { FiEdit } from "react-icons/fi"

const Modal = ({ isOpen, onClose }) => {
    const [filters, setFilters] = useState([{ field: "", condition: "", value: "" }])
    const [reportName, setReportName] = useState("Report Name") // Default report name
    const [isEditing, setIsEditing] = useState(false) // Editing state
    const [selectedReportType, setSelectedReportType] = useState("")
    const loggedInUsername = localStorage.getItem("username") || ""

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
        setIsEditing(!isEditing) // Toggle edit mode
    }

    const handleNameChange = (e) => {
        setReportName(e.target.value) // Update the report name
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white relative rounded-lg shadow-lg w-[70%] h-[90%] p-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    {/* Left Section: Report Name and Edit Icon */}
                    <div className="flex flex-col gap-2">
                        {/* Label for the report */}
                        <p className="text-sm text-gray-500">Report Name</p>

                        {/* Report Name and Edit Icon */}
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={reportName}
                                    onChange={handleNameChange}
                                    onBlur={handleEditToggle} // Exit edit mode on blur
                                    className="text-3xl font-bold text-[#333333] border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                    autoFocus
                                />
                            ) : (
                                <h2 className="text-3xl font-bold text-[#333333]">{reportName}</h2>
                            )}
                            <button
                                onClick={handleEditToggle} // Toggle edit mode
                                className="text-[#333333] hover:text-gray-700"
                            >
                                <FiEdit className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {/* Right Section: Report Details */}
                    <div className="flex gap-10 text-left">
                        {/* Report Type */}
                        <div>
                            <p className="text-sm text-gray-500">Report Type</p>
                            <select
                                className="text-3xl font-bold text-[#333333] rounded-lg p-2 pl-0 w-full"
                                value={selectedReportType}
                                onChange={(e) => setSelectedReportType(e.target.value)}
                            >
                                <option value="">Select Report Type</option>
                                <option value="members">Members List</option>
                                <option value="health-records">Health Records</option>
                                <option value="financial-assistance">Financial Assistance</option>
                            </select>
                        </div>

                        {/* Created By */}
                        <div>
                            <p className="text-sm text-gray-500">Created By</p>
                            <h2 className="text-3xl font-bold text-[#333333]">{loggedInUsername} </h2>
                        </div>
                    </div>
                </div>

                {/* Columns */}
                <div className="mb-6">
                    <label className="font-semibold mb-2 block">Columns</label>
                    <div className="flex flex-wrap gap-2">
                        {["Name", "Medical Conditions", "Medications", "Guardian", "Relationship", "Contact"].map(
                            (column) => (
                                <span
                                    key={column}
                                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full cursor-pointer"
                                >
                                    {column}
                                </span>
                            ),
                        )}
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
                                <option value="Medical Conditions">Medical Conditions</option>
                                {/* Add more options as needed */}
                            </select>

                            <select
                                className="border border-[#004365] text-[#004365] font-bold rounded-lg p-2 w-1/3"
                                value={filter.condition}
                                onChange={(e) => handleFilterChange(index, "condition", e.target.value)}
                            >
                                <option value="">SELECT CONDITION</option>
                                <option value="is equal to">IS EQUAL TO</option>
                                <option value="is not equal to">IS NOT EQUAL TO</option>
                                <option value="has any value">HAS ANY VALUE</option>
                                <option value="has no value">HAS NO VALUE</option>
                            </select>

                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 w-1/3"
                                value={filter.value}
                                onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                                placeholder="Value"
                            />

                            {filters.length > 1 && (
                                <button onClick={() => removeFilter(index)} className="text-red-500 hover:text-red-700">
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="flex gap-3 font-bold justify-center">
                        <button
                            onClick={addFilter}
                            className="border border-[#004365] text-[#004365] px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-[#004365] hover:text-white"
                        >
                            CLEAR FILTERS
                        </button>
                        <button
                            onClick={addFilter}
                            className="bg-[#004365] text-white px-4 py-2 rounded-lg hover:bg-[#004365]"
                        >
                            ADD FILTERS
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex absolute bottom-5 left-1/2 transform -translate-x-1/2 text-[#F5F5FA] font-bold gap-4">
                    <button
                        onClick={onClose}
                        className="border border-[#004365] text-[#004365] px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-[#004365] hover:text-white"
                    >
                        CLOSE
                    </button>
                    <button className="bg-[#004365] text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-[#00314d] hover:text-[#F5F5FA]">
                        VIEW REPORT
                    </button>
                    <button className="bg-[#3EB742] text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-[#36a736] hover:text-[#F5F5FA]">
                        SAVE AND VIEW
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal
