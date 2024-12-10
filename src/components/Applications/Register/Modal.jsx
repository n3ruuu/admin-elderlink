/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form"
import axios from "axios"

const Modal = ({ onClose, application }) => {
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
        medicalConditions: [],
        medications: [],
        guardianFirstName: "",
        guardianMiddleName: "",
        guardianLastName: "",
        guardianEmail: "",
        guardianContact: "",
        guardianRelationship: "",
        formFile: null, // Add state to hold the file
    })

    // Populate the form with the selected application's values
    useEffect(() => {
        if (application) {
            setFormValues({
                firstName: application.firstName || "",
                lastName: application.lastName || "",
                middleName: application.middleName || "",
                extension: application.extension || "",
                dob: application.dob || "",
                sex: application.sex || "",
                civilStatus: application.civilStatus || "",
                address: application.address || "",
                contactNumber: application.contactNumber || "",
                medicalConditions: application.medicalConditions || [],
                medications: application.medications || [],
                guardianFirstName: application.guardianFirstName || "",
                guardianMiddleName: application.guardianMiddleName || "",
                guardianLastName: application.guardianLastName || "",
                guardianEmail: application.guardianEmail || "",
                guardianContact: application.guardianContact || "",
                guardianRelationship: application.guardianRelationship || "",
                formFile: application.form_path || null, // Assuming this is part of the application object
            })
        }
    }, [application])

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            setFormValues({ ...formValues, formFile: file }) // Set the actual file in state
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        for (const key in formValues) {
            if (key !== "formFile") {
                formData.append(key, formValues[key])
            }
        }

        if (formValues.formFile) {
            formData.append("form_path", formValues.formFile)
        }

        formData.append("status", "Pending")

        // Debugging: Log the FormData content
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1])
        }

        try {
            const response = await axios.post("http://localhost:5000/members/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            console.log(response.data)
        } catch (error) {
            console.error("Error submitting form:", error)
        }
        onClose()
        alert("Success! You have a pending application for OSCA registration.")
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Register to OSCA</h2>

                <form>
                    <Form
                        formValues={formValues}
                        onChange={handleInputChange}
                        onClose={onClose}
                        handleKeyPressConditions={handleKeyPressConditions}
                        handleKeyPressMedications={handleKeyPressMedications}
                        removeCondition={removeCondition}
                        removeMedication={removeMedication}
                        handleSubmit={handleSubmit}
                        handleFileUpload={handleFileUpload}
                    />
                </form>
            </div>
        </div>
    )
}

export default Modal
