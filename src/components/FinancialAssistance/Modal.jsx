/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form" // Import the Form component

const Modal = ({ onCancel, onAdd, onSave, modalData }) => {
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
    const [initialValues, setInitialValues] = useState({}) // Store initial values for comparison
    const [isModified, setIsModified] = useState(false) // Track if the form has been modified

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
            const filteredSuggestions = membersList.filter(
                (member) =>
                    member.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                    member.name.toLowerCase() !== searchTerm.toLowerCase(),
            )
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
        setIsEditable(true)
    }

    // Pre-fill the form with existing data if modalData is provided
    useEffect(() => {
        if (modalData) {
            setMemberId(modalData.member_id)
            setMemberName(modalData.member_name)
            setBenefitType(modalData.benefit_type)
            setDateOfClaim(modalData.date_of_claim)
            setBenefitStatus(modalData.benefit_status)
            setClaimer(modalData.claimer)
            setRelationship(modalData.relationship)
            setSearchTerm(modalData.member_name)
            setIsEditable(false) // Disable search input for editing

            // Store initial values for comparison
            setInitialValues({
                memberId: modalData.member_id,
                memberName: modalData.member_name,
                benefitType: modalData.benefit_type,
                dateOfClaim: modalData.date_of_claim,
                benefitStatus: modalData.benefit_status,
                claimer: modalData.claimer,
                relationship: modalData.relationship,
            })
        } else {
            clearFields() // Clear fields if no modalData
        }
    }, [modalData])

    const clearFields = () => {
        setMemberId(null)
        setMemberName("")
        setBenefitType("")
        setDateOfClaim("")
        setBenefitStatus("claimed")
        setClaimer("")
        setRelationship("")
        setSearchTerm("")
        setIsEditable(true)
        setInitialValues({}) // Reset initial values
        setIsModified(false) // Reset modified state
    }

    // Check if the current values differ from initial values
    useEffect(() => {
        const currentValues = {
            memberId,
            memberName,
            benefitType,
            dateOfClaim,
            benefitStatus,
            claimer,
            relationship,
        }

        setIsModified(
            JSON.stringify(currentValues) !== JSON.stringify(initialValues),
        ) // Set modified state
    }, [
        memberId,
        memberName,
        benefitType,
        dateOfClaim,
        benefitStatus,
        claimer,
        relationship,
        initialValues,
    ])

    const handleSave = () => {
        if (!isFormValid()) return

        const recordData = {
            member_id: memberId,
            member_name: memberName,
            benefit_type: benefitType,
            date_of_claim: dateOfClaim,
            benefit_status: benefitStatus,
            claimer,
            relationship,
        }

        if (modalData) {
            // In edit mode, pass the ID for the existing record
            recordData.financial_assistance_id =
                modalData.financial_assistance_id
            onSave(recordData) // Call onSave to update the record
        } else {
            onAdd(recordData) // Call onAdd to create a new record
        }

        clearFields()
    }

    const isFormValid = () => {
        // Implement your form validation logic here
        return (
            memberId &&
            memberName &&
            benefitType &&
            dateOfClaim &&
            claimer &&
            relationship
        ) // Return true or false based on validation
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[40%]">
                <h2 className="text-3xl font-semibold mb-6">
                    {modalData
                        ? "Edit Financial Assistance Record"
                        : "Add Financial Assistance Record"}
                </h2>
                <Form
                    memberName={memberName}
                    setMemberName={setMemberName}
                    benefitType={benefitType}
                    setBenefitType={setBenefitType}
                    dateOfClaim={dateOfClaim}
                    setDateOfClaim={setDateOfClaim}
                    benefitStatus={benefitStatus}
                    setBenefitStatus={setBenefitStatus}
                    claimer={claimer}
                    setClaimer={setClaimer}
                    relationship={relationship}
                    setRelationship={setRelationship}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    suggestions={suggestions}
                    handleSuggestionClick={handleSuggestionClick}
                    clearSearchTerm={clearSearchTerm}
                    isEditable={isEditable}
                    handleSave={handleSave}
                    onCancel={onCancel} // Pass cancel function
                    isEditMode={!!modalData} // Determine if in edit mode
                    isModified={isModified} // Pass modified state
                />
            </div>
        </div>
    )
}

export default Modal
