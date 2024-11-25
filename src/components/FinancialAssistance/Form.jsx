/* eslint-disable react/prop-types */
import moment from "moment" // Import Moment.js
import { useState } from "react"

const Form = ({
    searchTerm,
    benefitType,
    setBenefitType,
    monthOfClaim, // Rename prop
    setMonthOfClaim, // Rename prop
    claimer,
    setClaimer,
    relationship,
    setRelationship,
    benefitStatus,
    onCancel,
    handleSave,
    isEditMode,
    isModified, // Accept isModified prop
}) => {
    const isFormValid = () => {
        return (
            searchTerm &&
            benefitType &&
            monthOfClaim &&
            claimer &&
            relationship &&
            benefitStatus &&
            (benefitType === "Social Pension" || benefitName) // Require benefitName if Financial Assistance
        )
    }

    const [benefitName, setBenefitName] = useState("")
    const [benefitDescription, setBenefitDescription] = useState("")

    // Function to determine quarter based on selected month
    const getQuarter = (month) => {
        const monthNum = moment(month, "YYYY-MM").month() + 1 // Convert to 1-based month
        if (monthNum <= 3) return "Q1"
        if (monthNum <= 6) return "Q2"
        if (monthNum <= 9) return "Q3"
        return "Q4"
    }

    return (
        <div>
            {/* Benefit Type and Month of Claim */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Benefit Type */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Benefit Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={benefitType}
                        onChange={(e) => setBenefitType(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select benefit type</option>
                        <option value="Social Pension">Social Pension</option>
                        <option value="Financial Assistance">Financial Assistance</option>
                    </select>
                </div>

                {/* Month of Claim */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Month of Claim <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="month" // Use month picker
                        value={moment(monthOfClaim).format("YYYY-MM")}
                        onChange={(e) => setMonthOfClaim(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {monthOfClaim && (
                        <p className="text-sm text-gray-600 mt-1">
                            Quarter: <span className="font-semibold">{getQuarter(monthOfClaim)}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Additional Fields for Financial Assistance */}
            {benefitType === "Financial Assistance" && (
                <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                    {/* Program Name */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Program Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter benefit program name"
                            value={benefitName} // Bind to the new state
                            onChange={(e) => setBenefitName(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Program Description (optional)
                        </label>
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter description"
                            value={benefitDescription} // Bind to the new state
                            onChange={(e) => setBenefitDescription(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Benefit Status, Claimer, and Relationship */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Claimer */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Claimer <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={claimer}
                        onChange={(e) => setClaimer(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter claimer name"
                    />
                </div>
                {/* Relationship */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Relationship <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter relationship"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={onCancel}
                    className="border w-[100px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isFormValid() || (isEditMode && !isModified)} // Disable button if form is invalid or not modified in edit mode
                    className={`bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px] ${
                        !isFormValid() || (isEditMode && !isModified) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isEditMode ? "Save" : "Add"}
                </button>
            </div>
        </div>
    )
}

export default Form
