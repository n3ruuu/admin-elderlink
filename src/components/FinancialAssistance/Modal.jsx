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
    })

    useEffect(() => {
        if (member) {
            setFormValues({
                benefitType: member.benefitType || "",
                claimDate: member.claimDate ? member.claimDate.split("T")[0] : "",
                programName: member.programName || "",
                claimer: member.claimer || "",
                claimerRelationship: member.claimerRelationship || "",
            })
        }
    }, [member])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }

    const handleSubmit = async () => {
        try {
            if (member) {
                console.log(formValues)
                // Edit existing member in the database
                await axios.put(`http://localhost:5000/members/financial-assistance/${member.id}`, formValues)
            } else {
                // Add new member to the database
                await axios.post("http://localhost:5000/members/financial-assistance", formValues)
            }
            onSave() // Notify parent to refresh data
        } catch (error) {
            console.error("Error saving data", error)
        }
    }

    const isFormValid = () =>
        formValues.benefitType &&
        (formValues.claimDate || formValues.programName) &&
        formValues.claimer &&
        formValues.claimerRelationship

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
                />
            </div>
        </div>
    )
}

export default Modal
