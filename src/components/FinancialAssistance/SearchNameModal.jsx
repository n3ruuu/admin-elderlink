/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form"
import FinancialAssistanceModal from "./FinancialAssistanceModal"

const SearchNameModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [membersList, setMembersList] = useState([])
    const [isEditable, setIsEditable] = useState(true)
    const [currentStep, setCurrentStep] = useState(1) // Step state
    const [selectedMember, setSelectedMember] = useState("") // State for the selected member's name

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
        if (searchTerm) {
            const filteredSuggestions = membersList.filter((member) => {
                return (
                    member.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                    member.name.toLowerCase() !== searchTerm.toLowerCase()
                )
            })
            setSuggestions(filteredSuggestions)
        } else {
            setSuggestions([])
        }
    }, [searchTerm, membersList])

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name) // Set the selected name in the search input
        setSelectedMember(suggestion.name) // Set the selected member's name
        setSuggestions([]) // Clear suggestions immediately
        setIsEditable(false) // Lock the input field
    }

    const clearSearchTerm = () => {
        setSearchTerm("")
        setSuggestions([])
        setIsEditable(true) // Make input editable again
    }

    const handleNext = () => {
        setCurrentStep(2) // Move to the next step
    }

    const handleAddRecord = (newRecord) => {
        // You can implement logic to add the financial assistance record here
        console.log("New record added:", newRecord)
        setCurrentStep(1) // Reset to the first step after submission
        onClose() // Close the modal
    }

    const isSaveDisabled = searchTerm.trim() === "" // Disable Save button if search term is empty

    if (!isOpen) return null // Do not render the modal if it's not open

    return (
        <>
            {currentStep === 1 && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                        <h2 className="text-3xl font-bold mb-6">
                            Search Member
                        </h2>
                        <Form
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            clearSearchTerm={clearSearchTerm}
                            suggestions={suggestions} // Pass suggestions to Form
                            handleSuggestionClick={handleSuggestionClick}
                            handleSave={handleNext} // Call handleNext on Save button click
                            onClose={onClose}
                            isSaveDisabled={isSaveDisabled}
                            isEditable={isEditable} // Pass the editable state to Form
                        />
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <FinancialAssistanceModal
                    memberName={selectedMember} // Pass the selected member's name
                    onCancel={() => setCurrentStep(1)} // Go back to step 1
                    onAdd={handleAddRecord} // Handle adding the financial assistance record
                />
            )}
        </>
    )
}

export default SearchNameModal
