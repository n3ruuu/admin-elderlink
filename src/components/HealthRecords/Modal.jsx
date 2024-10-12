/* eslint-disable react/prop-types */
// src/components/Modal.jsx

import { useState, useEffect } from "react"

const Modal = ({ isOpen, onClose, onSave, member, membersList }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        medicalConditions: [],
        medications: [],
        allergies: "",
        emergencyContact: "",
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [isEditable, setIsEditable] = useState(true)

    useEffect(() => {
        if (member) {
            setFormData({
                firstName: member.name.split(" ")[0] || "",
                lastName: member.name.split(" ")[1] || "",
                medicalConditions: member.medical_conditions
                    ? member.medical_conditions.split(",")
                    : [],
                medications: member.medications
                    ? member.medications.split(",")
                    : [],
                allergies: member.allergies || "",
                emergencyContact: member.emergency_contact || "",
            })
            // Disable search input when a member is selected
            setIsEditable(false)
        } else {
            setIsEditable(true) // Enable input if no member is selected
        }
    }, [member])

    useEffect(() => {
        if (searchTerm) {
            const filteredSuggestions = membersList.filter((member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            setSuggestions(filteredSuggestions)
        } else {
            setSuggestions([])
        }
    }, [searchTerm, membersList])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleKeyPressConditions = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const condition = e.target.value.trim()
            if (condition && !formData.medicalConditions.includes(condition)) {
                setFormData((prevData) => ({
                    ...prevData,
                    medicalConditions: [
                        ...prevData.medicalConditions,
                        condition,
                    ],
                }))
            }
            e.target.value = ""
        }
    }

    const handleKeyPressMedications = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const medication = e.target.value.trim()
            if (medication && !formData.medications.includes(medication)) {
                setFormData((prevData) => ({
                    ...prevData,
                    medications: [...prevData.medications, medication],
                }))
            }
            e.target.value = ""
        }
    }

    const handleSuggestionClick = (suggestion) => {
        const [firstName, lastName] = suggestion.name.split(" ")
        setFormData((prevData) => ({
            ...prevData,
            firstName: firstName,
            lastName: lastName,
        }))
        setSearchTerm(suggestion.name)
        setIsEditable(false)
        setTimeout(() => {
            setSuggestions([])
        }, 0)
    }

    const handleSave = () => {
        onSave({
            ...formData,
            medicalConditions: formData.medicalConditions.join(","),
            medications: formData.medications.join(","),
        })
        setFormData({
            firstName: "",
            lastName: "",
            medicalConditions: [],
            medications: [],
            allergies: "",
            emergencyContact: "",
        })
        setSearchTerm("")
        setSuggestions([])
        setIsEditable(true)
    }

    const removeCondition = (condition) => {
        setFormData((prevData) => ({
            ...prevData,
            medicalConditions: prevData.medicalConditions.filter(
                (c) => c !== condition,
            ),
        }))
    }

    const removeMedication = (medication) => {
        setFormData((prevData) => ({
            ...prevData,
            medications: prevData.medications.filter((m) => m !== medication),
        }))
    }

    const clearSearchTerm = () => {
        setSearchTerm("") // Clear search term
        setSuggestions([]) // Clear suggestions
        setIsEditable(true) // Make input editable again
    }

    useEffect(() => {
        if (isOpen) {
            setIsEditable(true)
            setSearchTerm("")
            setSuggestions([])
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Record" : "Add New Record"}
                </h2>

                <form className="relative">
                    {/* Search Member */}
                    <div className="mb-4 relative">
                        {" "}
                        {/* Added relative position here */}
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
                            disabled={!isEditable} // Disable input based on state
                            className="relative p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Search by name"
                        />
                        {/* Add the clear button (x) */}
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearchTerm}
                                className="absolute right-3 top-10 text-2xl text-gray-500 hover:text-gray-800"
                                title="Clear search"
                            >
                                &times; {/* Use × as the clear button */}
                            </button>
                        )}
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
                            onKeyPress={handleKeyPressConditions}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter medical condition and press Enter"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.medicalConditions.map(
                                (condition, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-200 px-3 py-1 rounded-full cursor-pointer"
                                        onClick={() =>
                                            removeCondition(condition)
                                        }
                                    >
                                        {condition}{" "}
                                        <span className="ml-2 text-red-500">
                                            x
                                        </span>
                                    </div>
                                ),
                            )}
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
                                    className="bg-gray-200 px-3 py-1 rounded-full cursor-pointer"
                                    onClick={() => removeMedication(medication)}
                                >
                                    {medication}{" "}
                                    <span className="ml-2 text-red-500">x</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Guardian */}
                    <div className="mb-4">
                        <label
                            htmlFor="guardian"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Guardian
                        </label>
                        <input
                            type="text"
                            id="guardian"
                            name="guardian"
                            value={formData.guardian}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter guardian"
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
                                value={formData.relationship}
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
                                value={formData.emergencyContact}
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
                            className="bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px]"
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
