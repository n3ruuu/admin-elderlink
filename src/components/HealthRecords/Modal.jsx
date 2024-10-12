/* eslint-disable react/prop-types */
// src/components/Modal.jsx

import { useState, useEffect } from "react"

const Modal = ({ isOpen, onClose, onSave, member, membersList }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        medicalConditions: "",
        medications: "",
        allergies: "",
        emergencyContact: "",
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])

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

    useEffect(() => {
        // Update suggestions based on search term
        if (searchTerm) {
            const filteredSuggestions = membersList.filter((member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            setSuggestions(filteredSuggestions)
        } else {
            setSuggestions([])
        }
    }, [searchTerm, membersList])

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
        setSearchTerm("") // Clear search term on save
        setSuggestions([]) // Clear suggestions on save
    }

    const handleSuggestionClick = (suggestion) => {
        const [firstName, lastName] = suggestion.name.split(" ")
        setFormData({
            ...formData,
            firstName,
            lastName,
            medicalConditions: suggestion.medical_conditions || "",
            medications: suggestion.medications || "",
            allergies: suggestion.allergies || "",
            emergencyContact: suggestion.emergency_contact || "",
        })
        setSearchTerm("") // Clear search term
        setSuggestions([]) // Clear suggestions
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Record" : "Add New Record"}
                </h2>

                <form>
                    {/* Search Member */}
                    <div className="mb-4">
                        <label
                            htmlFor="searchMember"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Search Member
                        </label>
                        <input
                            type="text"
                            id="searchMember"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Search by name"
                        />
                        {suggestions.length > 0 && (
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
                            value={formData.medicalConditions}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter medical conditions"
                        />
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
                            value={formData.medications}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter medications"
                        />
                    </div>

                    {/* Allergies */}
                    <div className="mb-4">
                        <label
                            htmlFor="allergies"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Allergies
                        </label>
                        <input
                            type="text"
                            id="allergies"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter allergies"
                        />
                    </div>

                    {/* Emergency Contact */}
                    <div className="mb-4">
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
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter emergency contact"
                        />
                    </div>

                    {/* Save and Cancel Buttons */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            type="button"
                            className="bg-[#FFFFFF] border-[#219EBC] text-[#219EBC] hover:bg-gray-100 py-2 px-4 rounded-lg"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-[#219EBC] text-white hover:bg-[#027b9c] py-2 px-4 rounded-lg"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal
