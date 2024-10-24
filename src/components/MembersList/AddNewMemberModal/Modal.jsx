/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"
import Form from "./Form"
import FileUpload from "./FileUpload"
import Buttons from "./Buttons"

const Modal = ({ isOpen, onClose, onSave, member, existingMembers }) => {
    const [formData, setFormData] = useState({
        idNo: "",
        firstName: "",
        lastName: "",
        dob: "",
        gender: "male",
        address: "",
        phone: "",
        age: "",
    })

    const [initialData, setInitialData] = useState(formData)
    const [fileName, setFileName] = useState("No file chosen")
    const [importedMembers, setImportedMembers] = useState([])
    const [duplicateError, setDuplicateError] = useState("")
    const [ageError, setAgeError] = useState("")
    const [formValid, setFormValid] = useState(false)
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        if (member) {
            const [firstName = "", lastName = ""] = member.name
                ? member.name.split(" ")
                : []

            const newFormData = {
                idNo: member.idNo || "",
                firstName,
                lastName,
                dob: member.dob ? moment(member.dob).format("YYYY-MM-DD") : "",
                gender: member.gender || "male",
                address: member.address || "",
                phone: member.phone || "",
                age: member.age || "",
            }

            setFormData(newFormData)
            setInitialData(newFormData)
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

    useEffect(() => {
        setFormValid(validateFields())
        setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialData))
    }, [formData])

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
            `${newMember.firstName} ${newMember.lastName}`.toLowerCase()
        const isDuplicate = existingMembers.some((member) => {
            const existingName = member.name.toLowerCase()
            return existingName === newName
        })
        return isDuplicate
    }

    const isAgeValid = (age) => {
        return age >= 60
    }

    const validateFields = () => {
        const errors = {}
        const { idNo, firstName, lastName, dob, address, phone, age } = formData

        if (!idNo) errors.idNo = "Please fill out this field."
        if (!firstName) errors.firstName = "Please fill out this field."
        if (!lastName) errors.lastName = "Please fill out this field."
        if (!dob) errors.dob = "Please fill out this field."
        if (!address) errors.address = "Please fill out this field."
        if (!phone) errors.phone = "Please fill out this field."
        if (dob && !isAgeValid(age)) {
            setAgeError("Age must be 60 years or older.")
            errors.age = true
        } else {
            setAgeError("")
        }

        return Object.keys(errors).length === 0
    }

    const handleSave = (e) => {
        e.preventDefault()
        if (!formValid || !isChanged) {
            return
        }

        const formattedData = {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`,
            dob: formData.dob,
        }

        if (!member && checkForDuplicates(formattedData)) {
            setDuplicateError("A member with the same name already exists.")
            return
        } else {
            setDuplicateError("")
        }

        onSave(formattedData)
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            idNo: "",
            firstName: "",
            lastName: "",
            dob: "",
            gender: "male",
            address: "",
            phone: "",
            age: "",
        })
        setFileName("No file chosen")
        setImportedMembers([])
        setDuplicateError("")
        setAgeError("")
        setIsChanged(false)
        setInitialData({
            idNo: "",
            firstName: "",
            lastName: "",
            dob: "",
            gender: "male",
            address: "",
            phone: "",
            age: "",
        })
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

        importedMembers.forEach((member) => onSave(member))
        resetForm()
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Member" : "Add New Member"}
                </h2>
                {duplicateError && (
                    <p className="text-red-600">{duplicateError}</p>
                )}
                {ageError && <p className="text-red-600">{ageError}</p>}
                <form>
                    <Form formData={formData} onChange={handleChange} />
                    {!member && (
                        <FileUpload
                            fileName={fileName}
                            setFileName={setFileName}
                            setImportedMembers={setImportedMembers}
                            existingMembers={existingMembers}
                            setDuplicateError={setDuplicateError}
                        />
                    )}
                    <Buttons
                        onClose={onClose}
                        handleSave={handleSave}
                        importedMembers={importedMembers}
                        handleImportSave={handleImportSave}
                        formValid={formValid}
                        isEditing={!!member}
                        isChanged={isChanged}
                    />
                </form>
            </div>
        </div>
    )
}

export default Modal
