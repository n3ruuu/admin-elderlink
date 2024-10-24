/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form" // Import the Form component

const FinancialAssistanceModal = ({ onCancel, onAdd }) => {
    const [memberId, setMemberId] = useState(null)
    const [memberName, setMemberName] = useState("")
    const [benefitType, setBenefitType] = useState("")
    const [dateOfClaim, setDateOfClaim] = useState("")
    const [benefitStatus, setBenefitStatus] = useState("claimed")
    const [claimer, setClaimer] = useState("")
    const [relationship, setRelationship] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [membersList, setMembersList] = useState([])
    const [isEditable, setIsEditable] = useState(true)

    // Fetch members from the backend
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

    // Update suggestions based on search term
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

    // Handle member suggestion click
    const handleSuggestionClick = (suggestion) => {
        setMemberId(suggestion.id)
        setSearchTerm(suggestion.name)
        setMemberName(suggestion.name)
        setSuggestions([])
        setIsEditable(false) // Disable search input once selected
    }

    // Clear the search field and reset editable state
    const clearSearchTerm = () => {
        setSearchTerm("")
        setSuggestions([])
        setIsEditable(true)
    }

    // Check if all fields are filled
    const isFormValid = benefitType && dateOfClaim && claimer && relationship

    // Add new financial assistance record
    const handleAdd = () => {
        if (!isFormValid) return

        const newRecord = {
            member_id: memberId,
            member_name: memberName,
            benefit_type: benefitType,
            date_of_claim: dateOfClaim,
            benefit_status: benefitStatus,
            claimer,
            relationship,
        }

        onAdd(newRecord)
        clearFields()
    }

    // Clear input fields
    const clearFields = () => {
        setMemberName("")
        setBenefitType("")
        setDateOfClaim("")
        setBenefitStatus("claimed")
        setClaimer("")
        setRelationship("")
        setSearchTerm("")
        setMemberId(null)
        setIsEditable(true) // Reset search input to be editable
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[40%]">
                <h2 className="text-3xl font-bold mb-6">Add Beneficiary</h2>

                <Form
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isEditable={isEditable}
                    clearSearchTerm={clearSearchTerm}
                    suggestions={suggestions}
                    handleSuggestionClick={handleSuggestionClick}
                    benefitType={benefitType}
                    setBenefitType={setBenefitType}
                    dateOfClaim={dateOfClaim}
                    setDateOfClaim={setDateOfClaim}
                    claimer={claimer}
                    setClaimer={setClaimer}
                    relationship={relationship}
                    setRelationship={setRelationship}
                    benefitStatus={benefitStatus}
                    setBenefitStatus={setBenefitStatus}
                    onAdd={handleAdd}
                    onCancel={onCancel}
                    isFormValid={isFormValid}
                />
            </div>
        </div>
    )
}

export default FinancialAssistanceModal
