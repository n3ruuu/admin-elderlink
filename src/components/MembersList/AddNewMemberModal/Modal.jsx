/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"
import Form from "./Form"
import FileUpload from "./FileUpload"
import Buttons from "./Buttons"

const Modal = ({ isOpen, onClose, onSave, member }) => {
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

    const [fileName, setFileName] = useState("No file chosen") // State for file name
    const [importedMembers, setImportedMembers] = useState([]) // State to hold imported member data

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

    const handleSave = () => {
        const formattedData = {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`,
            dob: formData.dob,
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
    }

    const handleImportSave = () => {
        importedMembers.forEach((member) => {
            onSave(member) // Save each imported member
        })
        resetForm() // Reset the form after saving imported members
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Member" : "Add New Member"}
                </h2>
                <form>
                    <Form formData={formData} onChange={handleChange} />
                    <FileUpload
                        fileName={fileName}
                        setFileName={setFileName}
                        setImportedMembers={setImportedMembers}
                    />
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
