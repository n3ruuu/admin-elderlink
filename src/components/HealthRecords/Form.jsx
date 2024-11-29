/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

const Form = ({
    formValues,
    onChange,
    handleKeyPressConditions,
    handleKeyPressMedications,
    removeCondition,
    removeMedication,
    onClose,
    handleSubmit,
    isFormValid,
    isEditMode,
}) => {
    return (
        <>
            {/* Medical Conditions */}
            <div className="mb-4">
                <label htmlFor="medicalConditions" className="block text-lg font-medium text-gray-700 mb-1">
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
                    {formValues.medicalConditions.map((condition, index) => (
                        <div
                            key={index}
                            className="bg-[#219EBC] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#168B99]"
                            onClick={() => removeCondition(condition)}
                        >
                            {condition}{" "}
                            <span className="ml-2 font-bold transition-transform duration-300 transform hover:scale-125 hover:text-gray-300">
                                &times;
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medications */}
            <div className="mb-4">
                <label htmlFor="medications" className="block text-lg font-medium text-gray-700 mb-1">
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
                    {formValues.medications.map((medication, index) => (
                        <div
                            key={index}
                            className="bg-[#219EBC] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#168B99]"
                            onClick={() => removeMedication(medication)}
                        >
                            {medication} <span className="ml-2 font-bold">&times;</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Guardian's Information */}
            <div className="mb-6">
                <label className="block text-xl font-semibold text-gray-700 mb-3">GUARDIAN'S INFORMATION</label>
                <div className="flex space-x-4">
                    {/* First Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardianFirstName" className="block text-lg font-medium text-gray-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="guardianFirstName"
                            name="guardianFirstName"
                            value={formValues.guardianFirstName || ""}
                            onChange={onChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter first name"
                            required
                        />
                    </div>
                    {/* Last Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardianLastName" className="block text-lg font-medium text-gray-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="guardianLastName"
                            name="guardianLastName"
                            value={formValues.guardianLastName || ""}
                            onChange={onChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter last name"
                            required
                        />
                    </div>
                    {/* Middle Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardianMiddleName" className="block text-lg font-medium text-gray-700 mb-1">
                            Middle Name
                        </label>
                        <input
                            type="text"
                            id="guardianMiddleName"
                            name="guardianMiddleName"
                            value={formValues.guardianMiddleName || ""}
                            onChange={onChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter middle name"
                        />
                    </div>
                </div>
            </div>

            {/* Contact No and Email Address */}
            <div className="flex space-x-4 mb-6">
                <div className="w-full">
                    <label htmlFor="guardianEmail" className="block text-lg font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="guardianEmail"
                        name="guardianEmail"
                        value={formValues.guardianEmail || ""}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter email address"
                        required
                    />
                </div>
            </div>

            {/* Contact Number and guardianRelationship side by side */}
            <div className="flex space-x-4 mb-6">
                <div className="w-1/2">
                    <label htmlFor="guardianContact" className="block text-lg font-medium text-gray-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="guardianContact"
                        name="guardianContact"
                        value={formValues.guardianContact || ""}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter contact number"
                        required
                    />
                </div>
                <div className="w-1/2">
                    <label htmlFor="guardianRelationship" className="block text-lg font-medium text-gray-700 mb-1">
                        Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="relationship"
                        name="guardianRelationship"
                        value={formValues.guardianRelationship || ""}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Relationship</option>
                        <option value="Parent">Parent</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Wife">Wife</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                    </select>
                </div>
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-end gap-5 items-center mt-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="border w-[100px] h-[45px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                    Cancel
                </button>
                <button
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                    type="button"
                    className={`${
                        isFormValid
                            ? "bg-[#219EBC] w-[100px] h-[45px] hover:bg-[#1A7A8A] text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed w-[100px] h-[45px]"
                    } font-bold py-2 px-4 rounded transition-colors duration-300`}
                >
                    {isEditMode ? "Save" : "Next"}
                </button>
            </div>
        </>
    )
}

export default Form
