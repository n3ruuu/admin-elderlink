/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import ErrorModal from "./ErrorModal"
import Form from "./Form"
import moment from "moment"
import axios from "axios"
import HealthRecordsModal from "../HealthRecords/Modal"

const Modal = ({ onClose, member, onSave }) => {
    const fetchNextControlNo = async () => {
        try {
            const response = await axios.get("http://5.181.217.153:5000/members")
            const members = response.data

            // Get all controlNos that match "MOJ####" format
            const mojNumbers = members
                .map((m) => m.controlNo)
                .filter((no) => /^MOJ\d{4}$/.test(no))
                .map((no) => parseInt(no.slice(3))) // Get the numeric part

            const maxNumber = mojNumbers.length > 0 ? Math.max(...mojNumbers) : 0
            const nextNumber = (maxNumber + 1).toString().padStart(4, "0")

            return `MOJ${nextNumber}`
        } catch (error) {
            console.error("Error fetching next Control No:", error)
            return "MOJ0001" // fallback if DB is empty or fails
        }
    }

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

    const isEditMode = !!member // Check if the modal is in Edit mode

    useEffect(() => {
        if (member) {
            // Editing existing member
            setFormValues({
                firstName: member.firstName || "",
                lastName: member.lastName || "",
                middleName: member.middleName || "",
                extension: member.extension || "",
                dob: member.dob ? moment(member.dob).format("MM/DD/YYYY") : "",
                sex: member.sex || "",
                civilStatus: member.civilStatus || "",
                address: member.address || "",
                contactNumber: member.contactNumber || "",
                controlNo: member.controlNo || "",
                purchaseBookletNo: member.purchaseBookletNo || "",
                medicineBookletNo: member.medicineBookletNo || "",
                dateIssued: member.dateIssued ? moment(member.dateIssued).format("MM/DD/YYYY") : "",
            })
        } else {
            // Adding new member → fetch next Control No
            fetchNextControlNo().then((nextNo) => {
                setFormValues((prev) => ({
                    ...prev,
                    controlNo: nextNo,
                }))
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
        console.log("CLOSING HEALTH RECORD MODAL")
        setHealthRecordsFormValues(null)
    }

    const closeAllModal = () => {
        onClose()
        setIsHealthRecordsModalOpen(false)
        console.log("PASSING")
    }

    const checkForDuplicates = async (controlNo, purchaseBookletNo, medicineBookletNo) => {
        try {
            const response = await axios.get("http://5.181.217.153:5000/members")
            const members = response.data

            const controlNoExists = members.some((member) => member.controlNo === controlNo)
            const purchaseBookletNoExists = members.some((member) => member.purchaseBookletNo === purchaseBookletNo)
            const medicineBookletNoExists = members.some((member) => member.medicineBookletNo === medicineBookletNo)

            console.log(controlNoExists)

            return {
                controlNo: controlNoExists,
                purchaseBookletNo: purchaseBookletNoExists,
                medicineBookletNo: medicineBookletNoExists,
            }
        } catch (error) {
            console.error("Error fetching members for duplicate check:", error)
            throw new Error("Failed to check for duplicates. Please try again.")
        }
    }

    const validateForm = async () => {
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

        const purchaseBookletNoPattern = /^PB\d{4}$/
        if (
            formValues.purchaseBookletNo.trim() !== "" &&
            !purchaseBookletNoPattern.test(formValues.purchaseBookletNo)
        ) {
            errorMessages.push("Purchase Booklet No. must follow the format: PB0001.")
        }

        const medicineBookletNoPattern = /^MB\d{4}$/
        if (
            formValues.medicineBookletNo.trim() !== "" &&
            !medicineBookletNoPattern.test(formValues.medicineBookletNo)
        ) {
            errorMessages.push("Medicine Booklet No. must follow the format: MB0001.")
        }

        // Skip duplicate checks if in edit mode
        if (!isEditMode) {
            try {
                // Initialize duplicateCheck object to track duplicates
                const duplicateCheck = {
                    controlNo: await checkForDuplicates(formValues.controlNo, null, null).then((res) => res.controlNo),
                }

                // Check for duplicates only if `purchaseBookletNo` is not empty
                if (formValues.purchaseBookletNo.trim() !== "") {
                    duplicateCheck.purchaseBookletNo = await checkForDuplicates(
                        null,
                        formValues.purchaseBookletNo,
                        null,
                    ).then((res) => res.purchaseBookletNo)
                }

                // Check for duplicates only if `medicineBookletNo` is not empty
                if (formValues.medicineBookletNo.trim() !== "") {
                    duplicateCheck.medicineBookletNo = await checkForDuplicates(
                        null,
                        null,
                        formValues.medicineBookletNo,
                    ).then((res) => res.medicineBookletNo)
                }

                // Add error messages based on duplicate checks
                if (duplicateCheck.controlNo) {
                    errorMessages.push("Control No. is already in use.")
                }
                if (duplicateCheck.purchaseBookletNo) {
                    errorMessages.push("Purchase Booklet No. is already in use.")
                }
                if (duplicateCheck.medicineBookletNo) {
                    errorMessages.push("Medicine Booklet No. is already in use.")
                }
            } catch (error) {
                console.error("Error checking for duplicates", error)
                errorMessages.push("Failed to check for duplicates. Please try again.")
            }
        }

        return errorMessages
    }

    const isFormValid = Object.entries(formValues).every(([key, value]) =>
        optionalFields.includes(key) ? true : value.trim() !== "",
    )

    const handleSubmit = async () => {
        const validationErrors = await validateForm()
        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            setIsErrorModalOpen(true)
        } else {
            try {
                if (member) {
                    // Edit existing member in the database

                    await axios.put(`http://5.181.217.153:5000/members/members-list/${member.id}`, formValues)
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
                    closeAllModal={closeAllModal}
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
