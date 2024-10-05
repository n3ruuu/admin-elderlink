/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"
import Form from "./Form"
import FileUpload from "./FileUpload"
import Buttons from "./Buttons"

const Modal = ({ isOpen, onClose, onSave, member, existingMembers }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "male",
        address: "",
        phone: "",
        email: "",
        age: "",
    })

    const [fileName, setFileName] = useState("") // State for file name
    const [importedMembers, setImportedMembers] = useState([]) // State to hold imported member data
    const [duplicateError, setDuplicateError] = useState("") // State for duplicate error message

    useEffect(() => {
        if (member) {
            const [firstName = "", lastName = ""] = member.name
                ? member.name.split(" ")
                : []

            setFormData({
                firstName,
                lastName,
                dob: member.dob ? moment(member.dob).format("YYYY-MM-DD") : "",
                gender: member.gender || "male",
                address: member.address || "",
                phone: member.phone || "",
                email: member.email || "",
                age: member.age || "",
            })
        }
    }, [member])

    useEffect(() => {
        if (formData.dob) {
            const birthDate = moment(formData.dob)
            const calculatedAge = moment().diff(birthDate, "years")
            setFormData((prevData) => ({
                ...prevData,
                age: calculatedAge,
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                age: "",
            }))
        }
    }, [formData.dob])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const checkForDuplicates = (newMember) => {
        const newName =
            `${newMember.firstName} ${newMember.lastName}`.toLowerCase() // Combine first and last name
        const isDuplicate = existingMembers.some((member) => {
            const existingName = member.name.toLowerCase() // Ensure case-insensitivity
            return existingName === newName
        })
        return isDuplicate
    }

    const handleSave = () => {
        const formattedData = {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`,
            dob: formData.dob,
        }

        // Check for duplicates before saving
        if (checkForDuplicates(formattedData)) {
            setDuplicateError("A member with the same name already exists.")
            return
        } else {
            setDuplicateError("") // Clear error if no duplicates
        }

        onSave(formattedData)
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            dob: "",
            gender: "male",
            address: "",
            phone: "",
            email: "",
            age: "",
        })
        setFileName("No file chosen") // Reset the file name after save
        setImportedMembers([]) // Reset imported members after save
        setDuplicateError("") // Reset the duplicate error message
    }

    const handleImportSave = () => {
        const duplicateFound = importedMembers.some((member) =>
            checkForDuplicates(member),
        )

        if (duplicateFound) {
            setDuplicateError(
                "One or more members in the import already exist.",
            )
            return
        }

        // Save all members if no duplicates
        importedMembers.forEach((member) => onSave(member))
        resetForm() // Reset the form after saving imported members
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Member" : "Add New Member"}
                </h2>
                {duplicateError && (
                    <p className="text-red-600">{duplicateError}</p>
                )}{" "}
                {/* Show error message */}
                <form>
                    <Form formData={formData} onChange={handleChange} />
                    {/* Render FileUpload only when adding a new member */}
                    {!member && (
                        // Inside Modal Component's return
                        <FileUpload
                            fileName={fileName}
                            setFileName={setFileName}
                            setImportedMembers={setImportedMembers}
                            existingMembers={existingMembers} // Pass existingMembers to FileUpload
                            setDuplicateError={setDuplicateError} // Pass setDuplicateError to FileUpload
                        />
                    )}
                    <Buttons
                        onClose={onClose}
                        handleSave={handleSave}
                        importedMembers={importedMembers}
                        handleImportSave={handleImportSave}
                    />
                </form>
            </div>
        </div>
    )
}

export default Modal
