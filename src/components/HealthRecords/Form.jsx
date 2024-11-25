/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import { useState } from "react"
import FinancialRecordsModal from "../FinancialAssistance/Modal"

const Form = ({
    formData,
    setFormData,
    handleKeyPressConditions,
    handleKeyPressMedications,
    removeCondition,
    removeMedication,
    onClose,
}) => {
    // Ensure controlled inputs by handling onChange
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value || "", // Ensure no undefined values
        }))
    }

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleNextClick = () => {
        if (isFormValid) {
            setIsModalOpen(true) // Open the modal when Next is clicked
        }
    }

    // Check if all required fields are filled
    const isFormValid = () => {
        return (
            formData.guardian_first_name &&
            formData.guardian_last_name &&
            formData.guardian_email &&
            formData.guardian_contact &&
            formData.relationship
        )
    }

    return (
        <div className="p-2 bg-white">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Health Record</h2>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-[#219EBC] rounded-full w-2/3"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Step 2 of 3</p>
            </div>

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
                    {formData.medicalConditions.map((condition, index) => (
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
                    {formData.medications.map((medication, index) => (
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
                {/* Guardian Information */}
                <label className="block text-xl font-semibold text-gray-700 mb-3">GUARDIAN'S INFORMATION</label>
                <div className="flex space-x-4">
                    {/* First Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardian_first_name" className="block text-lg font-medium text-gray-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="guardian_first_name"
                            name="guardian_first_name"
                            value={formData.guardian_first_name || ""}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter first name"
                            required
                        />
                    </div>
                    {/* Last Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardian_last_name" className="block text-lg font-medium text-gray-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="guardian_last_name"
                            name="guardian_last_name"
                            value={formData.guardian_last_name || ""}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter last name"
                            required
                        />
                    </div>
                    {/* Middle Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardian_middle_name" className="block text-lg font-medium text-gray-700 mb-1">
                            Middle Name
                        </label>
                        <input
                            type="text"
                            id="guardian_middle_name"
                            name="guardian_middle_name"
                            value={formData.guardian_middle_name || ""}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter middle name"
                        />
                    </div>
                </div>
            </div>

            {/* Contact No and Email Address */}
            <div className="flex space-x-4 mb-6">
                {/* Email Address (full width) */}
                <div className="w-full">
                    <label htmlFor="guardian_email" className="block text-lg font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="guardian_email"
                        name="guardian_email"
                        value={formData.guardian_email || ""}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter email address"
                        required
                    />
                </div>
            </div>

            {/* Contact Number and Relationship side by side */}
            <div className="flex space-x-4 mb-6">
                {/* Contact Number */}
                <div className="w-1/2">
                    <label htmlFor="guardian_contact" className="block text-lg font-medium text-gray-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="guardian_contact"
                        name="guardian_contact"
                        value={formData.guardian_contact || ""}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter contact number"
                        required
                    />
                </div>

                {/* Relationship */}
                <div className="w-1/2">
                    <label htmlFor="relationship" className="block text-lg font-medium text-gray-700 mb-1">
                        Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="relationship"
                        name="relationship"
                        value={formData.relationship || ""}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="" disabled>
                            Select relationship
                        </option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Other">Other</option>
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
                    disabled={!isFormValid()}
                    onClick={handleNextClick}
                    type="button"
                    className={`${
                        isFormValid()
                            ? "bg-[#219EBC] w-[100px] h-[45px] hover:bg-[#1A7A8A] text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed w-[100px] h-[45px]"
                    } text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
                >
                    Next
                </button>
            </div>
            {/* Conditionally render the modal */}
            {isModalOpen && (
                <FinancialRecordsModal
                    onClose={() => setIsModalOpen(false)} // Close modal
                />
            )}
        </div>
    )
}

export default Form
