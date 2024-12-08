/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import axios from "axios"
import Form from "./Form"
import moment from "moment" // Import Moment.js
import SuccessModal from "./SuccessModal"

const Modal = ({ closeAllModal, onClose, member, onSave, membersData, memberInfo }) => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successModalMessage, setSuccessModalMessage] = useState("")
    const [successModalTitle, setSuccessModalTitle] = useState("")

    const memberRecords = member ? membersData.filter((data) => data.member_id === member.member_id) : []

    const [formValues, setFormValues] = useState({
        Q1: { disbursement_date: null, claimer: null, relationship: null },
        Q2: { disbursement_date: null, claimer: null, relationship: null },
        Q3: { disbursement_date: null, claimer: null, relationship: null },
        Q4: { disbursement_date: null, claimer: null, relationship: null },
        benefitType: "Social Pension",
    })

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
        const { benefitType, Q1, Q2, Q3, Q4 } = formValues

        // Map quarters and ensure missing values are null
        const allQuarterData = [Q1, Q2, Q3, Q4].map((quarterData, idx) => ({
            quarter: `Q${idx + 1}`,
            disbursement_date: quarterData.disbursement_date || null,
            claimer: quarterData.claimer || null,
            relationship: quarterData.relationship || null,
            proof: null, // Default proof as null
        }))

        try {
            let memberId = member?.member_id || null
            let fullName = `${memberInfo?.firstName} ${memberInfo?.lastName}` // Combine first and last name
            let controlNo = null // Variable to hold control_no

            // If adding a new member
            if (!member) {
                const memberResponse = await axios.post("http://localhost:5000/members", memberInfo)
                memberId = memberResponse.data.memberId // Get the new member ID from the response
                fullName = `${memberInfo.firstName} ${memberInfo.lastName}` // Construct full_name for the new member
                controlNo = memberResponse.data.control_no // Assuming control_no is returned in the response
            } else {
                fullName = `${member.firstName} ${member.lastName}` // Construct full_name for an existing member
                controlNo = member.control_no // Get control_no from the existing member
            }

            // Prepare data for social pension
            const socialPensionData = {
                member_id: memberId,
                control_no: controlNo, // Include control_no in the data
                full_name: fullName, // Include full_name in the data
                benefitType,
                quarterData: allQuarterData,
            }

            // Check if the member already has a social pension record
            if (member) {
                // If member exists, update the record
                await axios.put(
                    `http://localhost:5000/financial-assistance/social-pension/${member.member_id}`,
                    socialPensionData,
                )
                // Notify parent to refresh data
                onSave()
            } else {
                // If no member, create a new record
                await axios.post("http://localhost:5000/financial-assistance/social-pension", socialPensionData)
                setSuccessModalTitle("Member Added!")
                setSuccessModalMessage("New member has been successfully added.")
                setIsSuccessModalOpen(true)
            }
        } catch (error) {
            console.error("Error saving data", error)
        }
    }

    const isEditMode = !!member

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[40%]">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {isEditMode ? "Edit Financial Record" : "Add Financial Record"}
                </h2>
                <div className="mb-6">
                    {!isEditMode && (
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-[#219EBC] rounded-full w-2/3"></div>
                        </div>
                    )}
                    {!isEditMode && <p className="text-sm text-gray-600 mt-2 mb-6">Step 3 of 3</p>}
                </div>
                <Form
                    formValues={formValues}
                    onChange={handleInputChange}
                    onClose={onClose}
                    isFormValid={() => true} // Allow submission without validation
                    isEditMode={!!member}
                    handleSubmit={handleSubmit}
                    handleDateChange={handleDateChange}
                />
            </div>
            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    closeAllModal() // Close parent modal after dismissing success modal
                    setIsSuccessModalOpen(false)
                    // Reload the page
                    setTimeout(() => {
                        window.location.reload() // Reloads the page
                    }, 0) // Optional delay for user experience
                }}
                title={successModalTitle}
                message={successModalMessage}
                onGoToArchives={() => console.log("Navigating to Archives")}
                isArchiving={false}
            />
        </div>
    )
}

export default Modal
