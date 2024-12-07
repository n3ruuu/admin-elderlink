/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import ErrorModal from "./ErrorModal"
import Form from "./Form"
import axios from "axios"
import HealthRecordsModal from "../HealthRecords/Modal"

const Modal = ({ onClose, member, onSave }) => {
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        extension: "",
        dob: "",
        sex: "",
        civilStatus: "",
        address: "",
        contactNumber: "",
        controlNo: "",
        purchaseBookletNo: "",
        medicineBookletNo: "",
        dateIssued: "",
    })
    const [errors, setErrors] = useState([])
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
    const [isHealthRecordsModalOpen, setIsHealthRecordsModalOpen] = useState(false)
    const [healthRecordsFormValues, setHealthRecordsFormValues] = useState(null)

    const optionalFields = ["middleName", "extension", "purchaseBookletNo", "medicineBookletNo", "dateIssued"]

    useEffect(() => {
        console.log("Member prop:", member)
        if (member) {
            setFormValues({
                firstName: member.firstName || "",
                lastName: member.lastName || "",
                middleName: member.middleName || "",
                extension: member.extension || "",
                dob: member.dob ? member.dob.split("T")[0] : "", // Format date
                sex: member.sex || "",
                civilStatus: member.civilStatus || "",
                address: member.address || "",
                contactNumber: member.contactNumber || "",
                controlNo: member.controlNo || "",
                purchaseBookletNo: member.purchaseBookletNo || "",
                medicineBookletNo: member.medicineBookletNo || "",
                dateIssued: member.dateIssued ? member.dateIssued.split("T")[0] : "", // Format date
            })
        }
    }, [member])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }

    const onOpenHealthRecordsModal = (formValues) => {
        setHealthRecordsFormValues(formValues) // Set the formValues for Health Records
        setIsHealthRecordsModalOpen(true) // Open the Health Records Modal
    }

    const onCloseHealthRecordsModal = () => {
        setIsHealthRecordsModalOpen(false)
        setHealthRecordsFormValues(null)
    }

    const validateForm = () => {
        const errorMessages = []
        const dob = new Date(formValues.dob)
        const today = new Date()
        const age = today.getFullYear() - dob.getFullYear()

        if (age < 60) errorMessages.push("Age must be 60 or above.")

        const namePattern = /^[A-Za-z\s]+$/
        if (!namePattern.test(formValues.firstName)) errorMessages.push("First Name must only contain letters.")
        if (!namePattern.test(formValues.lastName)) errorMessages.push("Last Name must only contain letters.")

        const contactPattern = /^09\d{9}$/ // Matches 09123456789
        if (!contactPattern.test(formValues.contactNumber)) {
            errorMessages.push("Contact Number must follow the format: 09123456789.")
        }

        const controlNoPattern = /^MOJ\d{4}$/
        if (!controlNoPattern.test(formValues.controlNo)) {
            errorMessages.push("ID Control must follow the format: MOJ0001.")
        }

        return errorMessages
    }

    const isFormValid = Object.entries(formValues).every(([key, value]) =>
        optionalFields.includes(key) ? true : value.trim() !== "",
    )

    const handleSubmit = async () => {
        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            setIsErrorModalOpen(true)
        } else {
            try {
                if (member) {
                    // Edit existing member in the database
                    await axios.put(`http://localhost:5000/members/members-list/${member.id}`, formValues)
                } else {
                    onOpenHealthRecordsModal(formValues)
                }
                onSave() // Notify parent to refresh data
            } catch (error) {
                console.error("Error saving data", error)
            }
        }
    }

    const handleCloseErrorModal = () => setIsErrorModalOpen(false)

    const isEditMode = !!member // Check if the modal is in Edit mode

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {isEditMode ? "Edit Member" : "Add New Member"}
                </h2>
                <div className="mb-6">
                    {!isEditMode && (
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-[#219EBC] rounded-full w-1/3"></div>
                        </div>
                    )}
                    {!isEditMode && <p className="text-sm text-gray-600 mt-2 mb-6">Step 1 of 3</p>}
                </div>

                {isErrorModalOpen && <ErrorModal errors={errors} onClose={handleCloseErrorModal} />}
                <form>
                    <Form
                        formValues={formValues}
                        onChange={handleInputChange}
                        onClose={onClose}
                        handleSubmit={handleSubmit}
                        isFormValid={isFormValid}
                        isEditMode={isEditMode}
                    />
                </form>
            </div>
            {isHealthRecordsModalOpen && (
                <HealthRecordsModal
                    onClose={onCloseHealthRecordsModal}
                    member={null}
                    onSave={onSave}
                    memberInfo={healthRecordsFormValues}
                />
            )}
        </div>
    )
}

export default Modal
