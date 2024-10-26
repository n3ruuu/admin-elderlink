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
    const [initialValues, setInitialValues] = useState({})

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
        setSuggestions([])
        setIsEditable(true)
    }

    // Check if all fields are filled
    const hasChanged = () => {
        return (
            memberName !== initialValues.member_name ||
            benefitType !== initialValues.benefit_type ||
            dateOfClaim !== initialValues.date_of_claim ||
            benefitStatus !== initialValues.benefit_status ||
            claimer !== initialValues.claimer ||
            relationship !== initialValues.relationship
        )
    }

    const isFormValid =
        benefitType &&
        dateOfClaim &&
        claimer &&
        relationship &&
        (modalData ? hasChanged() : true) // For edit mode, check if values have changed

    // Add or save financial assistance record
    const handleSave = () => {
        if (!isFormValid) return

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
            onSave(recordData) // Save changes to the existing record
        } else {
            onAdd(recordData) // Add a new record
        }

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

    // Pre-fill the form with existing data if modalData is provided
    useEffect(() => {
        if (modalData) {
            const initial = {
                member_id: modalData.member_id,
                member_name: modalData.member_name,
                benefit_type: modalData.benefit_type,
                date_of_claim: modalData.date_of_claim,
                benefit_status: modalData.benefit_status,
                claimer: modalData.claimer,
                relationship: modalData.relationship,
            }
            setInitialValues(initial)

            setMemberId(modalData.member_id)
            setMemberName(modalData.member_name)
            setBenefitType(modalData.benefit_type)
            setDateOfClaim(modalData.date_of_claim)
            setBenefitStatus(modalData.benefit_status)
            setClaimer(modalData.claimer)
            setRelationship(modalData.relationship)
            setSearchTerm(modalData.member_name)
            setIsEditable(false) // Disable search input for editing
        } else {
            clearFields() // Clear fields if no modalData
        }
    }, [modalData])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {modalData ? "Edit Beneficiary" : "Add Beneficiary"}
                </h2>

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
                    onAdd={handleSave} // Use handleSave for both add and edit
                    onCancel={onCancel} // Pass down the cancel function
                    isFormValid={isFormValid}
                    isEditMode={!!modalData} // Pass whether in edit mode
                />
            </div>
        </div>
    )
}

export default Modal
