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

    const [initialFormData, setInitialFormData] = useState(formData) // State for initial form data
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [isEditable, setIsEditable] = useState(true)
    const [membersList, setMembersList] = useState([])
    const [selectedMemberId, setSelectedMemberId] = useState(null)
    const [isReadOnly, setIsReadOnly] = useState(false)

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
                console.log("Fetched members:", data) // Debug log
            } catch (error) {
                console.error("Failed to fetch members:", error)
            }
        }

        fetchMembers()
    }, [])

    useEffect(() => {
        if (member) {
            const newFormData = {
                firstName: member?.name?.split(" ")[0] || "",
                lastName: member?.name?.split(" ")[1] || "",
                medicalConditions: member.medical_conditions
                    ? member.medical_conditions.split(",")
                    : [],
                medications: member.medications
                    ? member.medications.split(",")
                    : [],
                emergencyContact: member.emergency_contact || "",
                guardian_name: member.guardian_name || "",
                relationship: member.relationship || "",
            }
            setFormData(newFormData)
            setInitialFormData(newFormData) // Set initial form data
            setSelectedMemberId(member.id || null)
            setIsEditable(false)
            setIsReadOnly(true)
        } else {
            const resetFormData = {
                firstName: "",
                lastName: "",
                medicalConditions: [],
                medications: [],
                emergencyContact: "",
                guardian_name: "",
                relationship: "",
            }
            setFormData(resetFormData)
            setInitialFormData(resetFormData) // Reset initial form data
            setSelectedMemberId(null)
            setIsEditable(true)
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
        console.log("Suggestion clicked:", suggestion) // Debug log
        const [firstName, lastName] = suggestion.name.split(" ")
        setFormData((prevData) => ({
            ...prevData,
            firstName: firstName,
            lastName: lastName || "", // Handle case where there's no last name
        }))
        setSearchTerm(suggestion.name)
        setSelectedMemberId(suggestion.id) // Ensure this is a valid ID
        setIsEditable(false) // Disable input when a suggestion is clicked
        setIsReadOnly(true)
        setTimeout(() => {
            setSuggestions([]) // Clear suggestions
        }, 0)
    }

    const handleSave = async () => {
        const healthRecordId = isEditing ? member?.health_record_id : null
        const currentMemberId = isEditing ? member?.member_id : selectedMemberId

        const body = {
            health_record_id: healthRecordId, // Include health_record_id in the body
            member_id: currentMemberId, // Use currentMemberId from member object
            member_name: formData.firstName + " " + formData.lastName,
            record_date: new Date().toISOString().split("T")[0], // Current date
            medical_conditions: formData.medicalConditions.join(","), // Convert to comma-separated string
            medications: formData.medications.join(","), // Convert to comma-separated string
            guardian_name: formData.guardian_name,
            relationship: formData.relationship,
            emergency_contact: formData.emergencyContact,
        }

        console.log("Request Body:", body) // Log all values in the body

        try {
            const url = `http://localhost:5000/health-records${
                isEditing ? `/${healthRecordId}` : "" // Append the ID if editing
            }`
            const method = isEditing ? "PUT" : "POST" // Use PUT for editing

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error("Failed to save health record")
            }

            const data = await response.json()
            console.log(data.message) // Log success message

            // Reset the form and update state
            setFormData({
                firstName: "",
                lastName: "",
                medicalConditions: [],
                medications: [],
                emergencyContact: "",
                guardian_name: "",
                relationship: "",
            })
            setInitialFormData({
                firstName: "",
                lastName: "",
                medicalConditions: [],
                medications: [],
                emergencyContact: "",
                guardian_name: "",
                relationship: "",
            }) // Reset initial form data
            setSearchTerm("")
            setSuggestions([])
            setIsEditable(true)
            setIsReadOnly(false)

            // Notify parent component about the saved record
            onSave({ ...data, id: currentMemberId })

            setSelectedMemberId(null) // Reset selected member ID
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

    // Check if the form data is unchanged
    const isFormUnchanged =
        JSON.stringify(formData) === JSON.stringify(initialFormData)

    if (!isOpen) return null // Do not render the modal if it's not open

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
                    isEditing={isEditing}
                    isSaveDisabled={isFormUnchanged} // Disable Save button if unchanged
                />
            </div>
        </div>
    )
}

export default Modal
