/* eslint-disable react/prop-types */
import { useState } from "react"
import Form from "./Form"

const Modal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        medicalConditions: [],
        medications: [],
        emergencyContact: "",
        guardian_name: "",
        relationship: "",
    })

    const handleKeyPressConditions = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const condition = e.target.value.trim()
            if (condition && !formData.medicalConditions.includes(condition)) {
                setFormData((prevData) => ({
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
            if (medication && !formData.medications.includes(medication)) {
                setFormData((prevData) => ({
                    ...prevData,
                    medications: [...prevData.medications, medication],
                }))
            }
            e.target.value = ""
        }
    }

    const removeCondition = (condition) => {
        setFormData((prevData) => ({
            ...prevData,
            medicalConditions: prevData.medicalConditions.filter((c) => c !== condition),
        }))
    }

    const removeMedication = (medication) => {
        setFormData((prevData) => ({
            ...prevData,
            medications: prevData.medications.filter((m) => m !== medication),
        }))
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <Form
                    formData={formData}
                    setFormData={setFormData}
                    handleKeyPressConditions={handleKeyPressConditions}
                    handleKeyPressMedications={handleKeyPressMedications}
                    removeCondition={removeCondition}
                    removeMedication={removeMedication}
                    onClose={onClose}
                />
            </div>
        </div>
    )
}

export default Modal
