/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"

const Modal = ({ isOpen, onClose, onSave, member }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "male",
        address: "",
        phone: "",
        email: "",
    })

    useEffect(() => {
        if (member) {
            setFormData({
                firstName: member.name.split(" ")[0] || "",
                lastName: member.name.split(" ")[1] || "",
                dob: member.dob || "",
                gender: member.gender || "male",
                address: member.address || "",
                phone: member.phone || "",
                email: member.email || "",
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
        onSave(formData)
        setFormData({
            firstName: "",
            lastName: "",
            dob: "",
            gender: "male",
            address: "",
            phone: "",
            email: "",
        })
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {member ? "Edit Member" : "Add New Member"}
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

export default Modal
