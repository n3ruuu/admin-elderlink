/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"

const FinancialAssistanceModal = ({ isOpen, onClose, onSave, member }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        age: "",
        benefitStatus: "",
        benefitType: "",
    })

    useEffect(() => {
        if (member) {
            setFormData({
                firstName: member.name.split(" ")[0] || "",
                lastName: member.name.split(" ")[1] || "",
                dob: member.dob ? moment(member.dob).format("YYYY-MM-DD") : "",
                age: member.age || "",
                benefitStatus: member.benefitStatus || "",
                benefitType: member.benefitType || "",
            })
        }
    }, [member])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSave = () => {
        // Convert date back to the original format
        const formattedData = {
            ...formData,
            dob: formData.dob ? moment(formData.dob).format("YYYY-MM-DD") : "",
        }
        onSave(formattedData)
        setFormData({
            firstName: "",
            lastName: "",
            dob: "",
            age: "",
            benefitStatus: "",
            benefitType: "",
        })
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Beneficiary" : "Add Beneficiary"}
                </h2>
                <form>
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                First Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Juan"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Last Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Dela Cruz"
                                required
                            />
                        </div>
                    </div>

                    {/* Date of Birth and Age */}
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
                                type="date"
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="age"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Age <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="65"
                                required
                            />
                        </div>
                    </div>

                    {/* Benefit Status and Benefit Type */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="benefitStatus"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Benefit Status{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="benefitStatus"
                                name="benefitStatus"
                                value={formData.benefitStatus}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="" disabled>
                                    Select Status
                                </option>
                                <option value="claimed">Claimed</option>
                                <option value="unclaimed">Unclaimed</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="benefitType"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Benefit Type{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="benefitType"
                                name="benefitType"
                                value={formData.benefitType}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="" disabled>
                                    Select Type
                                </option>
                                <option value="SSS">
                                    Social Pension Program (SSS)
                                </option>
                                <option value="GSIS">GSIS Pension</option>
                            </select>
                        </div>
                    </div>

                    {/* Export CSV and Buttons */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            type="button"
                            className="bg-[#FFFFFF] border-[#219EBC] text-[#219EBC] border-2 px-6 py-2 rounded-xl hover:bg-[#219EBC] hover:text-[#FFFFFF] hover:border-[#219EBC]"
                        >
                            Export .CSV File
                        </button>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className="bg-[#FFFFFF] border-[#219EBC] text-[#219EBC] border-2 px-6 py-2 rounded-xl"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="text-[#FFFFFF] bg-[#219EBC] px-6 py-2 rounded-xl"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FinancialAssistanceModal
