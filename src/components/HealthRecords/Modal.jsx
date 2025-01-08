/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import ErrorModal from "../MembersList/ErrorModal"
import Form from "./Form"
import axios from "axios"
import FinancialRecordsModal from "../FinancialAssistance/Modal"

const Modal = ({ closeAllModal, onClose, member, onSave, memberInfo }) => {
    const [formValues, setFormValues] = useState({
        medicalConditions: [],
        medications: [],
        guardianFirstName: "",
        guardianMiddleName: "",
        guardianLastName: "",
        guardianEmail: "",
        guardianContact: "",
        guardianRelationship: "",
    })
    const [newMemberData, setNewMemberData] = useState(null)

    useEffect(() => {
        console.log(memberInfo, formValues)
        if (member) {
            setFormValues({
                medicalConditions: member.medicalConditions ? member.medicalConditions.split(",") : [],
                medications: member.medications ? member.medications.split(",") : [],
                guardianFirstName: member.guardianFirstName || "",
                guardianMiddleName: member.guardianMiddleName || "",
                guardianLastName: member.guardianLastName || "",
                guardianEmail: member.guardianEmail || "",
                guardianContact: member.guardianContact || "",
                guardianRelationship: member.guardianRelationship || "",
            })
        }
    }, [member])

    const [errors, setErrors] = useState([])
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

    const [isFinancialRecordsModalOpen, setIsFinancialRecordsModalOpen] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues((prevData) => ({
            ...prevData,
            [name]: value || "",
        }))
    }

    const handleSubmit = async () => {
        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            setIsErrorModalOpen(true)
        } else {
            try {
                if (member) {
                    // Edit existing member in the database
                    const response = await axios.put(
                        `http://localhost:5000/members/health-records/${member.id}`,
                        formValues,
                    )
                    console.log("Response:", response.data) // Log the response from the backend
                } else {
                    // Add new member to the database
                    const updatedMemberData = { ...memberInfo, ...formValues }
                    setNewMemberData(updatedMemberData)
                    openFinancialRecordsModal() // Open the Financial Records Modal
                }
                onSave() // Notify parent to refresh data
            } catch (error) {
                console.error("Error saving data:", error.response ? error.response.data : error.message) // Log more detailed error response
            }
        }
    }

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false)
    }

    const openFinancialRecordsModal = () => {
        setIsFinancialRecordsModalOpen(true) // Set the state to open the modal
    }

    const closeFinancialRecordsModal = () => {
        setIsFinancialRecordsModalOpen(false) // Set the state to close the modal
        console.log("CLOSING FINANCIAL RECORD MODAL")
    }

    const closeAllModals = () => {
        closeAllModal()
        setIsFinancialRecordsModalOpen(false)
        console.log("PASSING")
    }

    const validateForm = () => {
        let formErrors = []

        const nameRegex = /^[A-Za-z\s]+$/
        if (!nameRegex.test(formValues.guardianFirstName)) {
            formErrors.push("Guardian first name must only contain letters and spaces.")
        }
        if (!nameRegex.test(formValues.guardianLastName)) {
            formErrors.push("Guardian last name must only contain letters and spaces.")
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(formValues.guardianEmail)) {
            formErrors.push("Invalid email address.")
        }

        const contactRegex = /^09\d{9}$/ // Matches 09123456789 format
        if (!contactRegex.test(formValues.guardianContact)) {
            formErrors.push("Contact number must be in the format 09123456789.")
        }

        return formErrors
    }

    const isFormValid = () => {
        return (
            formValues.guardianFirstName?.trim() !== "" &&
            formValues.guardianLastName?.trim() !== "" &&
            formValues.guardianEmail?.trim() !== "" &&
            formValues.guardianContact?.trim() !== "" &&
            formValues.guardianRelationship?.trim() !== ""
        )
    }

    const handleKeyPressConditions = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const condition = e.target.value.trim()
            if (condition && !formValues.medicalConditions.includes(condition)) {
                setFormValues((prevData) => ({
                    ...prevData,
                    medicalConditions: [...prevData.medicalConditions, condition],
                }))
            }
            e.target.value = ""
        }
    }

    const handleKeyPressMedications = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const medication = e.target.value.trim()
            if (medication && !formValues.medications.includes(medication)) {
                setFormValues((prevData) => ({
                    ...prevData,
                    medications: [...prevData.medications, medication],
                }))
            }
            e.target.value = ""
        }
    }

    const removeCondition = (condition) => {
        setFormValues((prevData) => ({
            ...prevData,
            medicalConditions: prevData.medicalConditions.filter((c) => c !== condition),
        }))
    }

    const removeMedication = (medication) => {
        setFormValues((prevData) => ({
            ...prevData,
            medications: prevData.medications.filter((m) => m !== medication),
        }))
    }

    const isEditMode = !!member

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {isEditMode ? "Edit Health Record" : "Add Health Record"}
                </h2>
                <div className="mb-6">
                    {!isEditMode && (
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-[#219EBC] rounded-full w-2/3"></div>
                        </div>
                    )}
                    {!isEditMode && <p className="text-sm text-gray-600 mt-2 mb-6">Step 2 of 3</p>}
                </div>

                {isErrorModalOpen && <ErrorModal errors={errors} onClose={handleCloseErrorModal} />}

                <form>
                    <Form
                        formValues={formValues}
                        onChange={handleInputChange}
                        handleKeyPressConditions={handleKeyPressConditions}
                        handleKeyPressMedications={handleKeyPressMedications}
                        removeCondition={removeCondition}
                        removeMedication={removeMedication}
                        onClose={onClose}
                        handleSubmit={handleSubmit}
                        isFormValid={isFormValid}
                        isEditMode={isEditMode}
                    />
                </form>

                {isFinancialRecordsModalOpen && (
                    <FinancialRecordsModal
                        closeAllModal={closeAllModals}
                        onClose={closeFinancialRecordsModal}
                        memberInfo={newMemberData} // Pass the form values or the member info to the modal
                    />
                )}
            </div>
        </div>
    )
}

export default Modal
