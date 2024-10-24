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
    const [financialAssistanceRecords, setFinancialAssistanceRecords] =
        useState([]) // State to track financial assistance records

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

    const isSaveDisabled = searchTerm.trim() === ""

    // Function to handle adding a new financial assistance record
    const addFinancialAssistanceRecord = (newRecord) => {
        setFinancialAssistanceRecords((prevRecords) => [
            ...prevRecords,
            newRecord,
        ])
        setCurrentStep(1) // Go back to step 1 after saving
        clearSearchTerm() // Clear search term and reset editable state
    }

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
                    onSave={addFinancialAssistanceRecord} // Pass down the function to add records
                />
            )}

            {/* Displaying the Financial Assistance Records */}
            {financialAssistanceRecords.length > 0 && (
                <div className="mt-8 p-4 bg-gray-100 rounded">
                    <h3 className="text-xl font-semibold">Added Records:</h3>
                    <ul>
                        {financialAssistanceRecords.map((record, index) => (
                            <li key={index} className="mt-2">
                                {record.memberName} - {record.otherDetails}{" "}
                                {/* Replace with actual record details */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default SearchNameModal
