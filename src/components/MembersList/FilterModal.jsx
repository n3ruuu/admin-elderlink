/* eslint-disable react/prop-types */
import { useState } from "react"

const FilterModal = ({ isOpen, closeModal }) => {
    // State for filter form fields
    const [gender, setGender] = useState("")
    const [age, setAge] = useState("")
    const [month, setMonth] = useState("") // Month field without year
    const [street, setStreet] = useState("")

    if (!isOpen) return null

    // Reset filter fields
    const resetFilters = () => {
        setGender("")
        setAge("")
        setMonth("") // Reset month field
        setStreet("")
    }

    // Handle filter form submission (if needed)
    const handleSubmit = (e) => {
        e.preventDefault()
        // Implement your filter logic here (e.g., pass filter values to the parent component or fetch filtered data)
        closeModal()
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96 relative">
                {/* Close Button (X) */}
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-5 text-3xl text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>

                <h2 className="text-xl text-[#333333] font-bold mb-4">
                    Filter
                </h2>

                {/* Filter Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="gender"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="age"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Age
                        </label>
                        <select
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Age Range</option>
                            <option value="60-70">60-70</option>
                            <option value="71-80">71-80</option>
                            <option value="81-90">81-90</option>
                            <option value="91+">91+</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="month"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Month
                        </label>
                        <select
                            id="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Street/Subdivision
                        </label>
                        <input
                            type="text"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter street or subdivision"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                        >
                            Reset
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#219EBC] text-white rounded-lg"
                        >
                            Apply
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FilterModal
