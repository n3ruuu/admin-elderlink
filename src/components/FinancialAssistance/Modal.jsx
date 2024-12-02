/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import axios from "axios"
import Form from "./Form"

const Modal = ({ onClose, member, onSave }) => {
    const [formValues, setFormValues] = useState({
        quarter: "Q1", // default quarter, adjust if needed
        year: new Date().getFullYear(), // default to current year
        amount: "",
        status: "Unclaimed", // default status
        disbursement_date: "",
        claimer: "",
        relationship: "",
    })

    const formatDateToLocal = (dateStr) => {
        const date = new Date(dateStr)
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000) // Adjust to local time zone
        return localDate.toISOString().split("T")[0] // Return the date in YYYY-MM-DD format
    }

    useEffect(() => {
        if (member) {
            setFormValues({
                quarter: member.quarter || "Q1",
                year: member.year || new Date().getFullYear(),
                amount: member.amount || "",
                status: member.status || "Unclaimed",
                disbursement_date: member.disbursement_date ? formatDateToLocal(member.disbursement_date) : "",
                claimer: member.claimer || "",
                relationship: member.relationship || "",
            })
        }
    }, [member])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        const { quarter, year, amount, status, disbursement_date, claimer, relationship } = formValues

        try {
            const socialPensionData = {
                member_id: member?.id || null, // Assuming member id is passed for edit mode
                quarter,
                year,
                amount,
                status,
                disbursement_date,
                claimer,
                relationship,
            }

            if (member) {
                await axios.put(`http://localhost:5000/members/social-pension/${member.id}`, socialPensionData)
            } else {
                await axios.post("http://localhost:5000/members/social-pension", socialPensionData)
            }
            onSave() // Notify parent to refresh data
        } catch (error) {
            console.error("Error saving data", error)
        }
    }

    const isFormValid = () => {
        return (
            formValues.amount &&
            formValues.status &&
            formValues.disbursement_date &&
            formValues.claimer &&
            formValues.relationship
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
                />
            </div>
        </div>
    )
}

export default Modal
