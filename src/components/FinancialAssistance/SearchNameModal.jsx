/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form"
import FinancialAssistanceModal from "./FinancialAssistanceModal"

const SearchNameModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [membersList, setMembersList] = useState([])
    const [isEditable, setIsEditable] = useState(true)
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedMember, setSelectedMember] = useState("")

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
        setSearchTerm(suggestion.name)
        setSelectedMember(suggestion) // Store the entire object
        setSuggestions([])
        setIsEditable(false)
    }

    const clearSearchTerm = () => {
        setSearchTerm("")
        setSuggestions([])
        setIsEditable(true)
    }

    const handleNext = () => {
        setCurrentStep(2)
    }

    const handleAddRecord = async (newRecord) => {
        // Validate benefit_status length
        if (newRecord.benefit_status && newRecord.benefit_status.length > 10) {
            console.error(
                "Benefit status is too long:",
                newRecord.benefit_status,
            )
            return // Prevent the request if validation fails
        }

        try {
            const response = await fetch(
                "http://localhost:5000/financial-assistance",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        member_name: selectedMember.name,
                        member_id: selectedMember.id, // Ensure selectedMember has id
                        ...newRecord,
                    }),
                },
            )

            if (!response.ok) {
                throw new Error("Failed to add record")
            }

            const result = await response.json()
            console.log("New record added:", result)
            setCurrentStep(1) // Reset to the first step
            onClose() // Close the modal
        } catch (error) {
            console.error("Error adding record:", error)
        }
    }

    const isSaveDisabled = searchTerm.trim() === ""

    if (!isOpen) return null

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
                            suggestions={suggestions}
                            handleSuggestionClick={handleSuggestionClick}
                            handleSave={handleNext}
                            onClose={onClose}
                            isSaveDisabled={isSaveDisabled}
                            isEditable={isEditable}
                        />
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <FinancialAssistanceModal
                    memberName={selectedMember.name} // Use selectedMember object
                    onCancel={() => setCurrentStep(1)}
                    onAdd={handleAddRecord}
                />
            )}
        </>
    )
}

export default SearchNameModal
