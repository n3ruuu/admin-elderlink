/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"
import Papa from "papaparse"

const Modal = ({ isOpen, onClose, onSave, member }) => {
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        gender: "male",
        address: "",
        phone: "",
        email: "",
        age: "",
    })

    useEffect(() => {
        if (member) {
            // Set form data when editing a member
            setFormData({
                name: member.name || "",
                dob: member.dob ? moment(member.dob).format("MM/DD/YYYY") : "",
                gender: member.gender || "male",
                address: member.address || "",
                phone: member.phone || "",
                email: member.email || "",
                age: member.age || "",
            })
        }
    }, [member]) // Re-run when the member prop changes

    useEffect(() => {
        // Calculate age when date of birth changes
        if (formData.dob) {
            const birthDate = moment(formData.dob, "MM/DD/YYYY")
            const calculatedAge = moment().diff(birthDate, "years")
            setFormData((prevData) => ({
                ...prevData,
                age: calculatedAge,
            }))
        } else {
            // Reset age if dob is empty
            setFormData((prevData) => ({
                ...prevData,
                age: "",
            }))
        }
    }, [formData.dob]) // Run when dob changes

    if (!isOpen) return null // Do not render if modal is not open

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
            dob: formData.dob
                ? moment(formData.dob, "MM/DD/YYYY").format("YYYY-MM-DD") // Format as needed for your DB
                : "",
        }
        onSave(formattedData) // Save the edited data
        resetForm() // Reset form after save
    }

    const resetForm = () => {
        setFormData({
            name: "",
            dob: "",
            gender: "male",
            address: "",
            phone: "",
            email: "",
            age: "",
        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const csvData = event.target.result
                parseCSV(csvData)
            }
            reader.readAsText(file)
        }
    }

    const parseCSV = (csvData) => {
        Papa.parse(csvData, {
            header: true,
            complete: (results) => {
                const memberData = results.data // Get all members from the CSV
                if (memberData.length > 0) {
                    // Directly save each member to the database
                    memberData.forEach((member) => {
                        const formattedMember = {
                            ...member,
                            dob: member.dob
                                ? moment(member.dob, "MM/DD/YYYY").format(
                                      "YYYY-MM-DD",
                                  )
                                : "",
                        }
                        // Call the onSave function to add member to the database
                        onSave(formattedMember)
                    })
                }
            },
        })
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Member" : "Add New Member"}
                </h2>
                <form>
                    {/* Full Name */}
                    <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Juan Dela Cruz"
                            required
                        />
                    </div>

                    {/* Date of Birth and Gender */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="dob"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Date of Birth{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="MM/DD/YYYY"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="gender"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <label
                            htmlFor="address"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="123 Main St."
                            required
                        />
                    </div>

                    {/* Phone Number and Email */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Phone Number{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="+63 912 345 6789"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Email Address{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Import CSV and Buttons */}
                    <div className="flex justify-between items-center mt-8">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csvInput"
                        />
                        <label
                            htmlFor="csvInput"
                            className="bg-[#FFFFFF] border-[#219EBC] text-[#219EBC] border-2 px-6 py-2 rounded-xl cursor-pointer hover:bg-[#219EBC] hover:text-[#FFFFFF] hover:border-[#219EBC]"
                        >
                            Import .CSV File
                        </label>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-[#219EBC] text-white px-6 py-2 rounded-xl hover:bg-[#1A7D92]"
                                onClick={handleSave}
                            >
                                {member ? "Save Changes" : "Add Member"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal
