/* eslint-disable react/prop-types */
import { useState } from "react"

const FinancialAssistanceModal = ({ memberName, onCancel, onAdd }) => {
    const [benefitType, setBenefitType] = useState("")
    const [dateOfClaim, setDateOfClaim] = useState("")
    const [benefitStatus, setBenefitStatus] = useState("claimed")
    const [claimer, setClaimer] = useState("")
    const [relationship, setRelationship] = useState("")

    // Check if all fields are filled
    const isFormValid = benefitType && dateOfClaim && claimer && relationship

    const handleAdd = () => {
        if (!isFormValid) return
        const newRecord = {
            benefitType,
            dateOfClaim,
            benefitStatus,
            claimer,
            relationship,
        }
        onAdd(newRecord)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[67%]">
                <h3 className="text-lg font-semibold mb-4">{memberName}</h3>{" "}
                {/* Display selected member's name */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium mb-1">
                            Benefit Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                            value={benefitType}
                            onChange={(e) => setBenefitType(e.target.value)}
                        >
                            <option value="">Select benefit type</option>
                            <option value="SSS">SSS</option>
                            <option value="GSIS">GSIS</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium mb-1">
                            Date of Claim{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            placeholder="DD/MM/YYYY"
                            className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                            value={dateOfClaim}
                            onChange={(e) => setDateOfClaim(e.target.value)}
                        />
                    </div>

                    <div className="col-span-1 flex flex-col gap-3">
                        <label className="block text-sm font-medium mb-1">
                            Benefit Status{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                            {/* Custom styled radio for "Claimed" */}
                            <input
                                type="radio"
                                id="claimed"
                                name="benefitStatus"
                                value="claimed"
                                checked={benefitStatus === "claimed"}
                                onChange={() => setBenefitStatus("claimed")}
                                className="hidden"
                            />
                            <label
                                htmlFor="claimed"
                                className={`flex items-center cursor-pointer mr-4 ${
                                    benefitStatus === "claimed"
                                        ? "text-green-600"
                                        : "text-gray-700"
                                }`}
                            >
                                <span
                                    className={`w-5 h-5 inline-block rounded-full border-2 ${
                                        benefitStatus === "claimed"
                                            ? "bg-green-600 border-green-600"
                                            : "border-gray-400"
                                    } flex items-center justify-center`}
                                >
                                    {benefitStatus === "claimed" && (
                                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                                    )}
                                </span>
                                <span className="ml-2">Claimed</span>
                            </label>

                            {/* Custom styled radio for "Unclaimed" */}
                            <input
                                type="radio"
                                id="unclaimed"
                                name="benefitStatus"
                                value="unclaimed"
                                checked={benefitStatus === "unclaimed"}
                                onChange={() => setBenefitStatus("unclaimed")}
                                className="hidden"
                            />
                            <label
                                htmlFor="unclaimed"
                                className={`flex items-center cursor-pointer ${
                                    benefitStatus === "unclaimed"
                                        ? "text-red-600"
                                        : "text-gray-700"
                                }`}
                            >
                                <span
                                    className={`w-5 h-5 inline-block rounded-full border-2 ${
                                        benefitStatus === "unclaimed"
                                            ? "bg-red-600 border-red-600"
                                            : "border-gray-400"
                                    } flex items-center justify-center`}
                                >
                                    {benefitStatus === "unclaimed" && (
                                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                                    )}
                                </span>
                                <span className="ml-2">Unclaimed</span>
                            </label>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <label className="block text-sm font-medium mb-1">
                            Claimer <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter claimer's name"
                            className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                            value={claimer}
                            onChange={(e) => setClaimer(e.target.value)}
                        />
                    </div>

                    <div className="col-span-1 flex items-center">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">
                                Relationship{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm bg-[#F5F5FA] h-[45px] px-4"
                                value={relationship}
                                onChange={(e) =>
                                    setRelationship(e.target.value)
                                }
                            >
                                <option value="">Select relationship</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Sibling">Sibling</option>
                            </select>
                        </div>
                        <button
                            className="ml-2 w-[40px] h-[35px] text-2xl mt-5 bg-[#F5F5FA] text-[#767171] rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                            title="Add new relationship"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        className="border w-[100px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className={`bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px] ${
                            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handleAdd}
                        disabled={!isFormValid}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FinancialAssistanceModal
