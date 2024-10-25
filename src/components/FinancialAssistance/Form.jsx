/* eslint-disable react/prop-types */
import moment from "moment" // Import Moment.js

const Form = ({
    searchTerm,
    setSearchTerm,
    isEditable,
    clearSearchTerm,
    suggestions,
    handleSuggestionClick,
    benefitType,
    setBenefitType,
    dateOfClaim,
    setDateOfClaim,
    claimer,
    setClaimer,
    relationship,
    setRelationship,
    benefitStatus,
    setBenefitStatus,
    onAdd,
    onCancel,
    isFormValid,
    isEditMode, // New prop to indicate edit mode
}) => {
    return (
        <div>
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
                        <option value="Social Pension">Social Pension</option>
                        <option value="Medical Needs">Medical Needs</option>
                        <option value="Burial Assistance">
                            Burial Assistance
                        </option>
                        <option value="Emergency Cash">Emergency Cash</option>
                        <option value="Centenarian Benefit">
                            Centenarian Benefit
                        </option>
                    </select>
                </div>

                {/* Date of Claim */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Date of Claim <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={moment(dateOfClaim).format("YYYY-MM-DD")}
                        onChange={(e) => setDateOfClaim(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
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
                        value={claimer}
                        onChange={(e) => setClaimer(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                        placeholder="Enter claimer's name"
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
                        className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                        placeholder="Enter relationship"
                    />
                </div>
            </div>

            {/* Benefit Status */}
            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-1">
                    Benefit Status <span className="text-red-500">*</span>
                </label>
                <select
                    className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                    value={benefitStatus}
                    onChange={(e) => setBenefitStatus(e.target.value)}
                >
                    <option value="claimed">Claimed</option>
                    <option value="not claimed">Not Claimed</option>
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel} // Call cancel function
                    className="border w-[100px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onAdd} // Call the unified function
                    className={`bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px] ${
                        !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!isFormValid} // Disable if the form is invalid
                >
                    {isEditMode ? "Edit" : "Add"} {/* Change button text */}
                </button>
            </div>
        </div>
    )
}

export default Form
