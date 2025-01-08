/* eslint-disable react/prop-types */

const Form = ({ formValues, onChange, onClose, isFormValid, isEditMode, handleSubmit, handleDateChange }) => {
    const handleFormSubmit = (e) => {
        e.preventDefault()
        if (isFormValid) {
            handleSubmit()
        }
    }

    return (
        <div>
            <div className="grid grid-cols-1 h-[560px] gap-4 mb-6">
                {formValues.benefitType === "Social Pension" && (
                    <fieldset className="border border-gray-300 p-4 rounded-md ">
                        <legend className="text-lg font-semibold text-gray-700 px-2">Social Pension Details</legend>
                        {[1, 2, 3, 4].map((quarter) => (
                            <div key={quarter} className="mb-4">
                                <h3 className="text-md font-medium text-gray-800 mb-2">Quarter {quarter}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Disbursement Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formValues[`Q${quarter}`].disbursement_date}
                                            onChange={(e) => handleDateChange(`Q${quarter}`, e.target.value)}
                                            placeholder="YYYY-MM-DD"
                                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Claimer</label>
                                        <input
                                            type="text"
                                            name={`Q${quarter}_claimer`}
                                            value={formValues[`Q${quarter}`]?.claimer || ""}
                                            onChange={onChange}
                                            placeholder="Enter claimer's name"
                                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                                        <select
                                            name={`Q${quarter}_relationship`}
                                            value={formValues[`Q${quarter}`]?.relationship || ""}
                                            onChange={onChange}
                                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                                        >
                                            <option value="">Select relationship</option>
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
                        ))}
                    </fieldset>
                )}
            </div>

            <div className="flex justify-end items-center">
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
