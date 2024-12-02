/* eslint-disable react/prop-types */
import SocialPensionFields from "./SocialPensionFields"

const Form = ({ formValues, onChange, onClose, isFormValid, isEditMode, handleSubmit }) => {
    const handleFormSubmit = (e) => {
        e.preventDefault() // Prevent form from refreshing the page
        if (isFormValid) {
            handleSubmit()
        }
    }

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
            <div className="grid grid-cols-1 gap-4 mb-6">
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
                    <SocialPensionFields formValues={formValues} onChange={onChange} />
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
                        onClick={handleFormSubmit}
                        disabled={!isFormValid} // Disable the button if form is not valid
                    >
                        {isEditMode ? "Save" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Form
