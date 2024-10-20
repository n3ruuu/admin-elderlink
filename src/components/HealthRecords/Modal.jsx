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
        guardian_name: "", // Ensure this is initialized
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [isEditable, setIsEditable] = useState(true)
    const [membersList, setMembersList] = useState([]) // New state for member list
    const [selectedMemberId, setSelectedMemberId] = useState(null) // New state to store selected member ID

    useEffect(() => {
        // Fetch members list from the server
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:5000/members") // Adjust URL if necessary
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const data = await response.json()
                setMembersList(data) // Set the members list state
            } catch (error) {
                console.error("Failed to fetch members:", error)
            }
        }

        fetchMembers()
    }, []) // Fetch members when the modal opens

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
            })
            setSelectedMemberId(member.id) // Set selected member ID
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
        setSelectedMemberId(suggestion.id) // Capture the member ID when a suggestion is clicked
        setIsEditable(false)
        setTimeout(() => {
            setSuggestions([]) // Clear suggestions after selecting
        }, 0)
    }

    const handleSave = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/health-records",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        member_id: selectedMemberId, // Use the selected member's ID here
                        member_name:
                            formData.firstName + " " + formData.lastName, // Include member name
                        record_date: new Date().toISOString().split("T")[0], // Current date
                        medical_conditions:
                            formData.medicalConditions.join(","),
                        medications: formData.medications.join(","),
                        guardian_name:
                            formData.firstName + " " + formData.lastName, // Assuming guardian's name is the member's name
                        relationship: formData.guardian_name, // Modify this as needed
                        emergency_contact: formData.emergencyContact,
                    }),
                },
            )

            if (!response.ok) {
                throw new Error("Failed to save health record")
            }

            const data = await response.json()
            console.log(data.message) // Handle success notifications here

            // Call the onSave callback to update the parent component state
            onSave(data)

            // Reset the form
            setFormData({
                firstName: "",
                lastName: "",
                medicalConditions: [],
                medications: [],
                emergencyContact: "",
            })
            setSearchTerm("")
            setSuggestions([])
            setIsEditable(true)
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
