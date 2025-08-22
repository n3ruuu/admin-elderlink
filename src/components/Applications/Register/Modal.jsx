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
        placeOfBirth: "",
        occupation: "",
        address: "",
        contactNumber: "",
        nameOfSpouse: "",
        education: "",
        guardianFirstName: "",
        guardianMiddleName: "",
        guardianLastName: "",
        guardianEmail: "",
        guardianContact: "",
        guardianRelationship: "",
        requirement1: "",
        requirement2: "",
        requirement3: "",
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
                placeOfBirth: application.placeOfBirth || "",
                occupation: application.occupation || "",
                address: application.address || "",
                contactNumber: application.contactNumber || "",
                nameOfSpouse: application.nameOfSpouse || "",
                education: application.education || "",
                guardianFirstName: application.guardianFirstName || "",
                guardianMiddleName: application.guardianMiddleName || "",
                guardianLastName: application.guardianLastName || "",
                guardianEmail: application.guardianEmail || "",
                guardianContact: application.guardianContact || "",
                guardianRelationship: application.guardianRelationship || "",
                requirement1: application.requirement1 || "",
                requirement2: application.requirement2 || "",
                requirement3: application.requirement3 || "",
            })
        }
    }, [application])

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.put(
                `http://5.181.217.153:5000/application/members/${application.id}`,
                formValues,
            )
            console.log("Updated application:", response.data)
            onClose() // Close the modal after submitting the form
        } catch (error) {
            console.error("Error updating application:", error)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%] h-[90%] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Register to OSCA</h2>

                <form onSubmit={handleSubmit}>
                    <Form formValues={formValues} onClose={onClose} />
                </form>
            </div>
        </div>
    )
}

export default Modal
