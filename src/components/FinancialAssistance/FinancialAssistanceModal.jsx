/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"

const FinancialAssistanceModal = ({ onCancel, onAdd }) => {
    const [memberName, setMemberName] = useState("")
    const [benefitType, setBenefitType] = useState("")
    const [dateOfClaim, setDateOfClaim] = useState("")
    const [benefitStatus, setBenefitStatus] = useState("claimed")
    const [claimer, setClaimer] = useState("")
    const [relationship, setRelationship] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [membersList, setMembersList] = useState([])
    const [isEditable, setIsEditable] = useState(true)

    // Fetch members from the backend
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:5000/members")
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const data = await response.json()
                setMembersList(data)
            } catch (error) {
                console.error("Failed to fetch members:", error)
            }
        }

        fetchMembers()
    }, [])

    // Update suggestions based on search term
    useEffect(() => {
        if (searchTerm) {
            const filteredSuggestions = membersList.filter((member) => {
                return (
                    member.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                    member.name.toLowerCase() !== searchTerm.toLowerCase()
                )
            })
            setSuggestions(filteredSuggestions)
        } else {
            setSuggestions([])
        }
    }, [searchTerm, membersList])

    // Handle member suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name)
        setMemberName(suggestion.name)
        setSuggestions([])
        setIsEditable(false) // Disable search input once selected
    }

    // Clear the search field and reset editable state
    const clearSearchTerm = () => {
        setSearchTerm("")
        setSuggestions([])
        setIsEditable(true)
    }

    // Check if all fields are filled
    const isFormValid = benefitType && dateOfClaim && claimer && relationship

    // Add new financial assistance record
    const handleAdd = () => {
        if (!isFormValid) return

        const newRecord = {
            member_name: memberName,
            benefit_type: benefitType,
            date_of_claim: dateOfClaim,
            benefit_status: benefitStatus,
            claimer,
            relationship,
        }

        onAdd(newRecord)
        clearFields()
    }

    // Clear input fields
    const clearFields = () => {
        setMemberName("")
        setBenefitType("")
        setDateOfClaim("")
        setBenefitStatus("claimed")
        setClaimer("")
        setRelationship("")
        setSearchTerm("")
        setIsEditable(true) // Reset search input to be editable
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[40%]">
                {/* Title - Aligned Upper Left */}
                <h2 className="text-3xl font-bold mb-6">Add Beneficiary</h2>

                {/* Search Member / Name Display */}
                <div className="mb-6 relative w-full">
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Member Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                        placeholder="Search by name"
                        disabled={!isEditable}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={clearSearchTerm}
                            className="absolute right-3 top-10 text-2xl text-gray-500 hover:text-gray-800"
                            title="Clear search"
                        >
                            &times;
                        </button>
                    )}
                    {suggestions.length > 0 && (
                        <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-md w-full z-10">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                >
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Benefit Type and Date of Claim */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Benefit Type */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Benefit Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                            value={benefitType}
                            onChange={(e) => setBenefitType(e.target.value)}
                        >
                            <option value="">Select benefit type</option>
                            <option value="SSS">SSS Benefit</option>
                            <option value="GSIS">GSIS Benefit</option>
                            <option value="Social Pension">
                                Social Pension
                            </option>
                            <option value="Medical Needs">Medical Needs</option>
                            <option value="Burial Assistance">
                                Burial Assistance
                            </option>
                            <option value="Emergency Cash">
                                Emergency Cash
                            </option>
                            <option value="Centenarian Benefit">
                                Centenarian Benefit
                            </option>
                        </select>
                    </div>

                    {/* Date of Claim */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Date of Claim{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                            value={dateOfClaim}
                            onChange={(e) => setDateOfClaim(e.target.value)}
                        />
                    </div>
                </div>

                {/* Claimer and Relationship */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Claimer */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Claimer <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                            value={claimer}
                            onChange={(e) => setClaimer(e.target.value)}
                        />
                    </div>

                    {/* Relationship */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Relationship <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                        />
                    </div>
                </div>

                {/* Benefit Status */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Benefit Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center font-bold gap-4">
                        {/* Claimed Status */}
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="claimed"
                                name="benefitStatus"
                                value="claimed"
                                checked={benefitStatus === "claimed"}
                                onChange={() => setBenefitStatus("claimed")}
                                className="hidden"
                            />
                            <label
                                htmlFor="claimed"
                                className={`flex items-center cursor-pointer ${
                                    benefitStatus === "claimed"
                                        ? "text-green-600"
                                        : "text-gray-700"
                                }`}
                            >
                                <span
                                    className={`w-5 h-5 inline-block rounded-full border-2 ${
                                        benefitStatus === "claimed"
                                            ? "bg-green-600 border-green-600"
                                            : "border-gray-400"
                                    } flex items-center justify-center`}
                                >
                                    {benefitStatus === "claimed" && (
                                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                                    )}
                                </span>
                                <span className="ml-2">Claimed</span>
                            </label>
                        </div>

                        {/* Unclaimed Status */}
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="unclaimed"
                                name="benefitStatus"
                                value="unclaimed"
                                checked={benefitStatus === "unclaimed"}
                                onChange={() => setBenefitStatus("unclaimed")}
                                className="hidden"
                            />
                            <label
                                htmlFor="unclaimed"
                                className={`flex items-center cursor-pointer ${
                                    benefitStatus === "unclaimed"
                                        ? "text-yellow-500"
                                        : "text-gray-700"
                                }`}
                            >
                                <span
                                    className={`w-5 h-5 inline-block rounded-full border-2 ${
                                        benefitStatus === "unclaimed"
                                            ? "bg-yellow-500 border-yellow-500"
                                            : "border-gray-400"
                                    } flex items-center justify-center`}
                                >
                                    {benefitStatus === "unclaimed" && (
                                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                                    )}
                                </span>
                                <span className="ml-2">Unclaimed</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        className="border w-[100px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className={`${
                            isFormValid ? "" : "opacity-50 cursor-not-allowed"
                        } bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px]`}
                        onClick={handleAdd}
                        disabled={!isFormValid}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FinancialAssistanceModal
