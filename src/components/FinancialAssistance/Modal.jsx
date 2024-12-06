/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import axios from "axios"
import Form from "./Form"
import moment from "moment" // Import Moment.js

const Modal = ({ onClose, member, onSave, membersData }) => {
    const memberRecords = member ? membersData.filter((data) => data.member_id === member.member_id) : []

    const [formValues, setFormValues] = useState({
        Q1: { disbursement_date: "", claimer: "", relationship: "" },
        Q2: { disbursement_date: "", claimer: "", relationship: "" },
        Q3: { disbursement_date: "", claimer: "", relationship: "" },
        Q4: { disbursement_date: "", claimer: "", relationship: "" },
        benefitType: "Social Pension",
    })

    const formatDateToLocal = (dateStr) => {
        // Use Moment.js to handle date formatting
        return moment(dateStr).format("YYYY-MM-DD") // Format to "YYYY-MM-DD"
    }

    useEffect(() => {
        if (member) {
            const updatedFormValues = { ...formValues }
            memberRecords.forEach((record) => {
                updatedFormValues[record.quarter] = {
                    disbursement_date: record.disbursement_date ? formatDateToLocal(record.disbursement_date) : "",
                    claimer: record.claimer || "",
                    relationship: record.relationship || "",
                }
            })
            updatedFormValues.benefitType = member.benefitType || "Social Pension"
            setFormValues(updatedFormValues)
        }
    }, [member])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const [quarter, field] = name.split("_")

        console.log("Input change detected:", { name, value, quarter, field }) // Debug log

        setFormValues((prev) => ({
            ...prev,
            [quarter]: {
                ...prev[quarter],
                [field]: value,
            },
        }))
    }

    const handleDateChange = (quarter, date) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [quarter]: {
                ...prevValues[quarter],
                disbursement_date: date,
            },
        }))
    }

    const handleSubmit = async () => {
        const { benefitType, Q1, Q2, Q3, Q4 } = formValues
        const allQuarterData = [Q1, Q2, Q3, Q4].map((quarterData, idx) => ({
            quarter: `Q${idx + 1}`,
            ...quarterData,
        }))

        try {
            const socialPensionData = {
                member_id: member?.member_id || null,
                benefitType,
                quarterData: allQuarterData,
            }
            console.log(socialPensionData)

            if (member) {
                await axios.put(
                    `http://localhost:5000/financial-assistance/social-pension/${member.member_id}`,
                    socialPensionData,
                )
            } else {
                await axios.post("http://localhost:5000/financial-assistance/social-pension", socialPensionData)
            }

            onSave() // Notify parent to refresh data
            onClose() // Close the modal after saving the data
        } catch (error) {
            console.error("Error saving data", error)
        }
    }

    const isFormValid = () => {
        // Ensure all required fields are filled out
        return (
            Object.values(formValues).every(
                (quarter) => quarter.disbursement_date && quarter.claimer && quarter.relationship,
            ) && formValues.benefitType !== ""
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
                    handleDateChange={handleDateChange}
                />
            </div>
        </div>
    )
}

export default Modal
