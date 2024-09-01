/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"

const HealthRecordsModal = ({ isOpen, onClose, onSave, member }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        medicalConditions: "",
        medications: "",
        allergies: "",
        emergencyContact: "",
    })

    useEffect(() => {
        if (member) {
            setFormData({
                firstName: member.name.split(" ")[0] || "",
                lastName: member.name.split(" ")[1] || "",
                medicalConditions: member.medical_conditions || "",
                medications: member.medications || "",
                allergies: member.allergies || "",
                emergencyContact: member.emergency_contact || "",
            })
        }
    }, [member])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSave = () => {
        onSave(formData)
        setFormData({
            firstName: "",
            lastName: "",
            medicalConditions: "",
            medications: "",
            allergies: "",
            emergencyContact: "",
        })
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Record" : "Add New Record"}
                </h2>
                <form>
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                First Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Juan"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Last Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Dela Cruz"
                                required
                            />
                        </div>
                    </div>

                    {/* Medical Conditions and Medications */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                            <label
                                htmlFor="medicalConditions"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Medical Conditions{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="medicalConditions"
                                name="medicalConditions"
                                value={formData.medicalConditions}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Hypertension, Diabetes"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="medications"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Medications{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="medications"
                                name="medications"
                                value={formData.medications}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Insulin, Lisinopril"
                                required
                            />
                        </div>
                    </div>

                    {/* Allergies and Emergency Contact */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="allergies"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Allergies{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="allergies"
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Penicillin, Nuts"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="emergencyContact"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Emergency Contact{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="emergencyContact"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="John Doe, +63 912 345 6789"
                                required
                            />
                        </div>
                    </div>

                    {/* Export CSV and Buttons */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            type="button"
                            className="bg-[#FFFFFF] border-[#219EBC] text-[#219EBC] border-2 px-6 py-2 rounded-xl hover:bg-[#219EBC] hover:text-[#FFFFFF] hover:border-[#219EBC]"
                        >
                            Export .CSV File
                        </button>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className="bg-[#FFFFFF] border-[#219EBC] text-[#219EBC] border-2 px-6 py-2 rounded-xl"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="text-[#FFFFFF] bg-[#219EBC] px-6 py-2 rounded-xl"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default HealthRecordsModal
