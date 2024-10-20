/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form"

const Modal = ({ isOpen, onClose, onSave, member }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        medicalConditions: [],
        medications: [],
        emergencyContact: "",
        guardian_name: "",
        relationship: "",
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [isEditable, setIsEditable] = useState(true)
    const [membersList, setMembersList] = useState([])
    const [selectedMemberId, setSelectedMemberId] = useState(null)
    const [isReadOnly, setIsReadOnly] = useState(false)

    // Determine if the modal is in editing mode
    const isEditing = !!member

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:5000/members")
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const data = await response.json()
                setMembersList(data)
            } catch (error) {
                console.error("Failed to fetch members:", error)
            }
        }

        fetchMembers()
    }, [])

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
                emergencyContact: member.emergency_contact || "",
                guardian_name: member.guardian_name || "",
                relationship: member.relationship || "",
            })
            setSelectedMemberId(member.id)
            setIsEditable(false) // Make the name fields non-editable
            setIsReadOnly(true)
        } else {
            setIsEditable(true) // Allow editing when no member is selected
            setIsReadOnly(false)
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
        setSelectedMemberId(suggestion.id)
        setIsEditable(false) // Disable input when a suggestion is clicked
        setIsReadOnly(true)
        setTimeout(() => {
            setSuggestions([])
        }, 0)
    }

    const handleSave = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/health-records",
                {
                    method: isEditing ? "PUT" : "POST", // Use PUT for editing
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        member_id: selectedMemberId,
                        member_name:
                            formData.firstName + " " + formData.lastName,
                        record_date: new Date().toISOString().split("T")[0],
                        medical_conditions:
                            formData.medicalConditions.join(","),
                        medications: formData.medications.join(","),
                        guardian_name: formData.guardian_name,
                        relationship: formData.relationship,
                        emergency_contact: formData.emergencyContact,
                    }),
                },
            )

            if (!response.ok) {
                throw new Error("Failed to save health record")
            }

            const data = await response.json()
            console.log(data.message)

            // Reset the form
            setFormData({
                firstName: "",
                lastName: "",
                medicalConditions: [],
                medications: [],
                emergencyContact: "",
                guardian_name: "",
                relationship: "",
            })
            setSearchTerm("")
            setSuggestions([])
            setIsEditable(true)
            setIsReadOnly(false)

            // Notify parent component about the saved record
            onSave({ ...data, id: selectedMemberId }) // Pass the updated member data

            // Reset selected member ID after save to allow adding new records again
            setSelectedMemberId(null)
        } catch (error) {
            console.error("Error saving health record:", error)
        }
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
        setSearchTerm("")
        setSuggestions([])
        setIsEditable(true) // Make input editable again
        setIsReadOnly(false) // Reset read-only status
    }

    useEffect(() => {
        if (isOpen) {
            setIsEditable(true)
            setSearchTerm("")
            setSuggestions([])
            setIsReadOnly(false)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {isEditing ? "Edit Record" : "Add New Record"}
                </h2>

                <Form
                    formData={formData}
                    setFormData={setFormData}
                    handleKeyPressConditions={handleKeyPressConditions}
                    handleKeyPressMedications={handleKeyPressMedications}
                    removeCondition={removeCondition}
                    removeMedication={removeMedication}
                    clearSearchTerm={clearSearchTerm}
                    isEditable={isEditable}
                    isReadOnly={isReadOnly}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    suggestions={suggestions}
                    handleSuggestionClick={handleSuggestionClick}
                    handleSave={handleSave}
                    onClose={onClose}
                    isEditing={isEditing} // Pass the isEditing prop to Form
                />
            </div>
        </div>
    )
}

export default Modal
