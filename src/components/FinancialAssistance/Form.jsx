/* eslint-disable react/prop-types */
import SocialPensionFields from "./SocialPensionFields"

const Form = ({ formValues, onChange, onClose, isFormValid, isEditMode, handleSubmit, handleSocialPensionChange }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {isEditMode ? "Edit Financial Record" : "Add Financial Record"}
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-[#219EBC] rounded-full w-full"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Step 3 of 3</p>
            </div>

            {/* Benefit Type and Date Fields */}
            <div className="grid grid-cols- gap-4 mb-6">
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Benefit Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="benefitType"
                        value={formValues.benefitType}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="No Benefit">No Benefit</option>
                        <option value="Social Pension">Social Pension</option>
                        <option value="Financial Assistance">Financial Assistance</option>
                    </select>
                </div>

                {formValues.benefitType === "Social Pension" && (
                    <SocialPensionFields
                        claimDates={formValues.claimDates}
                        claimers={formValues.claimers}
                        relationships={formValues.relationships}
                        onFieldChange={handleSocialPensionChange}
                    />
                )}

                {formValues.benefitType === "Financial Assistance" && (
                    <div>
                        {/* Program Name and Date of Claim Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-1">
                                    Program Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="programName"
                                    value={formValues.programName}
                                    onChange={onChange}
                                    placeholder="Enter benefit program name"
                                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-1">
                                    Date of Claim <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="claimDate"
                                    value={formValues.claimDate}
                                    onChange={onChange}
                                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Claimer and Relationship Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-1">
                                    Claimer <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="claimer"
                                    value={formValues.claimer}
                                    onChange={onChange}
                                    placeholder="Enter claimer's name"
                                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-1">
                                    Relationship <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="claimerRelationship"
                                    value={formValues.claimerRelationship}
                                    onChange={onChange}
                                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" disabled>
                                        Select relationship
                                    </option>
                                    <option value="Parent">Parent</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Relative">Relative</option>
                                    <option value="Guardian">Guardian</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end items-center mt-8">
                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <button
                        onClick={onClose}
                        className="border w-[100px] h-[45px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        className={`w-[100px] h-[45px] font-bold py-2 px-4 rounded transition-colors duration-300 ${isFormValid ? "bg-[#219EBC] hover:bg-[#1A7A8A] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        onClick={handleSubmit}
                    >
                        {isEditMode ? "Save" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Form
