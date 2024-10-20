/* eslint-disable react/prop-types */

const Form = ({
    formData,
    setFormData,
    handleKeyPressConditions,
    handleKeyPressMedications,
    removeCondition,
    removeMedication,
    clearSearchTerm,
    isEditable,
    searchTerm,
    setSearchTerm,
    suggestions,
    handleSuggestionClick,
    handleSave,
    onClose,
    isEditing,
    isSaveDisabled,
}) => {
    // Ensure controlled inputs by handling onChange
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value || "", // Ensure no undefined values
        }))
    }

    // New function to validate form
    const isFormValid = () => {
        return (
            formData.guardian_name.trim() !== "" &&
            formData.relationship.trim() !== "" &&
            formData.emergencyContact.trim() !== ""
        )
    }

    return (
        <form className="relative">
            {/* Search Member / Name Display */}
            <div className="mb-4 relative">
                <label
                    htmlFor="searchMember"
                    className="block text-lg font-medium text-gray-700 mb-1"
                >
                    {isEditing ? "Member Name" : "Search Member"}
                </label>
                {isEditing ? (
                    <input
                        type="text"
                        value={`${formData.firstName} ${formData.lastName}`}
                        readOnly
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                ) : (
                    <input
                        type="text"
                        id="searchMember"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={!isEditable}
                        className="relative p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search by name"
                    />
                )}
                {searchTerm && !isEditing && (
                    <button
                        type="button"
                        onClick={clearSearchTerm}
                        className="absolute right-3 top-10 text-2xl text-gray-500 hover:text-gray-800"
                        title="Clear search"
                    >
                        &times;
                    </button>
                )}
                {suggestions.length > 0 && !isEditing && (
                    <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-md w-full">
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

            {/* Medical Conditions */}
            <div className="mb-4">
                <label
                    htmlFor="medicalConditions"
                    className="block text-lg font-medium text-gray-700 mb-1"
                >
                    Medical Conditions
                </label>
                <input
                    type="text"
                    id="medicalConditions"
                    name="medicalConditions"
                    onKeyPress={handleKeyPressConditions}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter medical condition and press Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.medicalConditions.map((condition, index) => (
                        <div
                            key={index}
                            className="bg-[#219EBC] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#168B99]" // Change background on hover
                            onClick={() => removeCondition(condition)}
                        >
                            {condition}{" "}
                            <span className="ml-2 font-bold transition-transform duration-300 transform hover:scale-125 hover:text-gray-300">
                                &times; {/* Change properties on hover */}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medications */}
            <div className="mb-4">
                <label
                    htmlFor="medications"
                    className="block text-lg font-medium text-gray-700 mb-1"
                >
                    Medications
                </label>
                <input
                    type="text"
                    id="medications"
                    name="medications"
                    onKeyPress={handleKeyPressMedications}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter medication and press Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.medications.map((medication, index) => (
                        <div
                            key={index}
                            className="bg-[#219EBC] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#168B99]"
                            onClick={() => removeMedication(medication)}
                        >
                            {medication}{" "}
                            <span className="ml-2 font-bold">&times;</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Guardian */}
            <div className="mb-4">
                <label
                    htmlFor="guardian_name"
                    className="block text-lg font-medium text-gray-700 mb-1"
                >
                    Guardian Name
                </label>
                <input
                    type="text"
                    id="guardian_name"
                    name="guardian_name"
                    value={formData.guardian_name || ""}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter guardian name"
                />
            </div>

            {/* Relationship and Emergency Contact on the same row */}
            <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                    <label
                        htmlFor="relationship"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Relationship
                    </label>
                    <input
                        type="text"
                        id="relationship"
                        name="relationship"
                        value={formData.relationship || ""}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter relationship"
                    />
                </div>

                <div className="w-1/2">
                    <label
                        htmlFor="emergencyContact"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Emergency Contact
                    </label>
                    <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact || ""}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter emergency contact"
                    />
                </div>
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-end gap-5 items-center mt-8">
                <button
                    type="button"
                    className="border w-[100px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className={`bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px] ${
                        isSaveDisabled || !isFormValid()
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    onClick={handleSave}
                    disabled={isSaveDisabled || !isFormValid()}
                >
                    Save
                </button>
            </div>
        </form>
    )
}

export default Form
