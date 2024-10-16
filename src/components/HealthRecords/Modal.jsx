/* eslint-disable react/prop-types */
// src/components/Modal.jsx

import { useState, useEffect } from "react"
import Form from "./Form"

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
            setIsEditable(false) // Disable search input when a member is selected
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

                {/* Pass necessary props to the Form component */}
                <Form
                    formData={formData}
                    setFormData={setFormData}
                    handleKeyPressConditions={handleKeyPressConditions}
                    handleKeyPressMedications={handleKeyPressMedications}
                    removeCondition={removeCondition}
                    removeMedication={removeMedication}
                    clearSearchTerm={clearSearchTerm}
                    isEditable={isEditable}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    suggestions={suggestions}
                    handleSuggestionClick={handleSuggestionClick}
                    handleSave={handleSave}
                    onClose={onClose}
                />
            </div>
        </div>
    )
}

export default Modal
