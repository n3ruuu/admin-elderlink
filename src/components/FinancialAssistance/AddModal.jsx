/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form"
import moment from "moment" // Import Moment.js
import axios from "axios" // Ensure axios is imported for API calls
import SuccessModal from "./SuccessModal"

const Modal = ({ onClose, member }) => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successModalMessage, setSuccessModalMessage] = useState("")
    const [successModalTitle, setSuccessModalTitle] = useState("")

    // Filter member records based on the passed `member` prop
    const memberRecords = member?.quarterData || []

    const [formValues, setFormValues] = useState({
        Q1: { disbursement_date: null, claimer: null, relationship: null },
        Q2: { disbursement_date: null, claimer: null, relationship: null },
        Q3: { disbursement_date: null, claimer: null, relationship: null },
        Q4: { disbursement_date: null, claimer: null, relationship: null },
        benefitType: "Social Pension",
    })

    const [successMessage, setSuccessMessage] = useState("") // State for success message

    const formatDateToLocal = (dateStr) => {
        return dateStr ? moment(dateStr).format("YYYY-MM-DD") : null
    }

    useEffect(() => {
        if (member) {
            const updatedFormValues = { ...formValues }
            memberRecords.forEach((record) => {
                updatedFormValues[record.quarter] = {
                    disbursement_date: record.disbursement_date ? formatDateToLocal(record.disbursement_date) : null,
                    claimer: record.claimer || null,
                    relationship: record.relationship || null,
                }
            })
            updatedFormValues.benefitType = member.benefitType || "Social Pension"
            setFormValues(updatedFormValues)
        }
    }, [member])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const [quarter, field] = name.split("_")

        setFormValues((prev) => ({
            ...prev,
            [quarter]: {
                ...prev[quarter],
                [field]: value || null,
            },
        }))
    }

    const handleDateChange = (quarter, date) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [quarter]: {
                ...prevValues[quarter],
                disbursement_date: date || null,
            },
        }))
    }

    const handleSubmit = async () => {
        // Extract data from formValues
        const { benefitType, Q1, Q2, Q3, Q4 } = formValues

        // Generate the next social_pension_id (assuming you are fetching it from a backend or it's calculated here)
        // For example, we could assume it's the next ID from the current member's ID, but you can replace this with your logic
        const socialPensionId = member?.social_pension_id + 1 // Adjust this based on how you get the next social_pension_id

        // Map quarters and ensure missing values are null, and add the social_pension_id to each quarter data
        const allQuarterData = [Q1, Q2, Q3, Q4].map((quarterData, idx) => ({
            quarter: `Q${idx + 1}`,
            disbursement_date: quarterData.disbursement_date || null,
            claimer: quarterData.claimer || null,
            relationship: quarterData.relationship || null,
            proof: null, // Default proof as null
            social_pension_id: socialPensionId, // Add social_pension_id to each quarter's data
        }))

        // Prepare data for saving the financial record
        const socialPensionData = {
            member_id: member?.member_id, // Ensure member's ID is used to associate with the correct member
            control_no: member?.control_no, // Ensure control_no for the existing member
            benefitType,
            quarterData: allQuarterData,
        }

        try {
            // Send a POST request to create a new financial assistance record
            await axios.post("http://5.181.217.153:5000/financial-assistance/social-pension", socialPensionData)

            setSuccessModalTitle("New Record Added!")
            setSuccessModalMessage("New social pension has been successfully added.")
            setIsSuccessModalOpen(true)

            // Optionally notify parent to refresh data (you can adjust this depending on your use case)
        } catch (error) {
            console.error("Error saving data", error)
            setSuccessMessage("Failed to add the financial record. Please try again.")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[40%]">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Financial Record</h2>
                <div className="mb-6"></div>

                {/* Success Message Display */}
                {successMessage && <div className="text-green-600 font-semibold mb-4">{successMessage}</div>}

                <Form
                    formValues={formValues}
                    onChange={handleInputChange}
                    onClose={onClose}
                    isFormValid={() => true} // Allow submission without validation
                    handleSubmit={handleSubmit}
                    handleDateChange={handleDateChange}
                />
            </div>
            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false) // Close the success modal
                    onClose() // Call parent modal's onClose to close the parent modal
                    setTimeout(() => {
                        window.location.reload() // Reload the page (optional)
                    }, 0) // Optional delay for user experience
                }}
                title={successModalTitle}
                message={successModalMessage}
                isArchiving={false}
            />
        </div>
    )
}

export default Modal
