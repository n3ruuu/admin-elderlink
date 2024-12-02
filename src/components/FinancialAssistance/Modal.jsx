/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import axios from "axios"
import Form from "./Form"

const Modal = ({ onClose, member, onSave }) => {
    const [formValues, setFormValues] = useState({
        benefitType: "No Benefit",
        claimDate: "",
        programName: "",
        claimer: "",
        claimerRelationship: "",
        claimDates: ["", "", "", ""],
        claimers: ["", "", "", ""],
        relationships: ["", "", "", ""],
    })

    const formatDateToLocal = (dateStr) => {
        const date = new Date(dateStr)
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000) // Adjust to local time zone
        return localDate.toISOString().split("T")[0] // Return the date in YYYY-MM-DD format
    }

    useEffect(() => {
        if (member) {
            setFormValues({
                benefitType: member.benefitType || "No Benefit",
                claimDate: member.claimDate ? formatDateToLocal(member.claimDate) : "",
                programName: member.programName || "",
                claimer: member.claimer || "",
                claimerRelationship: member.claimerRelationship || "",
                claimDates: [
                    member.claimDateQ1 ? formatDateToLocal(member.claimDateQ1) : "",
                    member.claimDateQ2 ? formatDateToLocal(member.claimDateQ2) : "",
                    member.claimDateQ3 ? formatDateToLocal(member.claimDateQ3) : "",
                    member.claimDateQ4 ? formatDateToLocal(member.claimDateQ4) : "",
                ],
                claimers: [
                    member.claimerQ1 || "",
                    member.claimerQ2 || "",
                    member.claimerQ3 || "",
                    member.claimerQ4 || "",
                ],
                relationships: [
                    member.relationshipQ1 || "",
                    member.relationshipQ2 || "",
                    member.relationshipQ3 || "",
                    member.relationshipQ4 || "",
                ],
            })
        }
    }, [member])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleSocialPensionChange = (index, field, value) => {
        setFormValues((prev) => {
            const updatedField = [...prev[field]]
            updatedField[index] = value
            return { ...prev, [field]: updatedField }
        })
    }

    const handleSubmit = async () => {
        const {
            benefitType,
            claimDates,
            claimers,
            relationships,
            claimDate,
            programName,
            claimer,
            claimerRelationship,
        } = formValues

        try {
            if (benefitType === "Social Pension") {
                // Filter out empty fields
                const socialPensionData = {
                    benefitType,
                    claimDateQ1: claimDates[0] || null,
                    claimerQ1: claimers[0] || null,
                    relationshipQ1: relationships[0] || null,
                    claimDateQ2: claimDates[1] || null,
                    claimerQ2: claimers[1] || null,
                    relationshipQ2: relationships[1] || null,
                    claimDateQ3: claimDates[2] || null,
                    claimerQ3: claimers[2] || null,
                    relationshipQ3: relationships[2] || null,
                    claimDateQ4: claimDates[3] || null,
                    claimerQ4: claimers[3] || null,
                    relationshipQ4: relationships[3] || null,
                }
                if (member) {
                    await axios.put(`http://localhost:5000/members/social-pension/${member.id}`, socialPensionData)
                } else {
                    await axios.post("http://localhost:5000/members/social-pension", socialPensionData)
                }
            } else {
                const financialAssistanceData = {
                    benefitType,
                    claimDate: claimDate || null,
                    programName: programName || null,
                    claimer: claimer || null,
                    claimerRelationship: claimerRelationship || null,
                }
                if (member) {
                    await axios.put(
                        `http://localhost:5000/members/financial-assistance/${member.id}`,
                        financialAssistanceData,
                    )
                } else {
                    await axios.post("http://localhost:5000/members/financial-assistance", financialAssistanceData)
                }
            }
            onSave() // Notify parent to refresh data
        } catch (error) {
            console.error("Error saving data", error)
        }
    }

    const isFormValid = () => {
        return (
            formValues.benefitType &&
            formValues.claimDate &&
            formValues.programName &&
            formValues.claimer &&
            formValues.claimerRelationship
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[40%]">
                <Form
                    formValues={formValues}
                    onChange={handleInputChange}
                    onClose={onClose}
                    isFormValid={isFormValid}
                    isEditMode={!!member}
                    handleSubmit={handleSubmit}
                    handleSocialPensionChange={handleSocialPensionChange}
                />
            </div>
        </div>
    )
}

export default Modal
