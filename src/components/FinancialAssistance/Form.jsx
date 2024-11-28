/* eslint-disable react/prop-types */
import moment from "moment"; // Import Moment.js
import { useState, useEffect } from "react";

const Form = ({ onClose }) => {
    const [benefits, setBenefits] = useState([]); // State for holding multiple benefits
    const [benefitType, setBenefitType] = useState("No Benefit"); // State for Benefit Type
    const [monthOfClaim, setMonthOfClaim] = useState(""); // State for Month of Claim
    const [benefitName, setBenefitName] = useState(""); // State for Benefit Name
    const [dob, setDob] = useState(""); // State for DOB
    const [claimer, setClaimer] = useState(""); // State for Claimer
    const [relationship, setRelationship] = useState(""); // State for Relationship

    // Reset form fields if 'No Benefit' or initial empty selection
    useEffect(() => {
        if (benefitType === "No Benefit" || benefitType === "") {
            setBenefitName("");
            setMonthOfClaim("");
            setDob("");
            setClaimer("");
            setRelationship("");
        }
    }, [benefitType]);

    // Function to determine quarter based on selected month
    const getQuarter = (month) => {
        const monthNum = moment(month, "YYYY-MM").month() + 1; // Convert to 1-based month
        if (monthNum <= 3) return "Q1";
        if (monthNum <= 6) return "Q2";
        if (monthNum <= 9) return "Q3";
        return "Q4";
    };

  // Form validation check
const isFormValid = () => {
    return (
        benefitType &&
        (benefitType === "Social Pension" || (benefitName && benefitType === "Financial Assistance")) && // Benefit Name required for Financial Assistance
        (benefitType === "Financial Assistance" || monthOfClaim) && // Skip Month of Claim check for Financial Assistance
        claimer &&
        relationship
    );
};


    // Handle Date of Claim formatting for Financial Assistance
    const handleDobChange = (e) => {
        const formattedDateOfClaim = moment(e.target.value).format("MM/DD/YYYY");
        setDob(formattedDateOfClaim);
    };

    // Handle adding a new benefit
    const handleAddBenefit = () => {
        if (isFormValid()) {
            setBenefits((prevBenefits) => [
                ...prevBenefits,
                { benefitType, monthOfClaim, benefitName, benefitDescription, dob, claimer, relationship },
            ]);
            // Reset fields after adding
            setBenefitType("No Benefit");
            setMonthOfClaim("");
            setBenefitName("");
            setBenefitDescription("");
            setDob("");
            setClaimer("");
            setRelationship("");
        }
    };

    return (
        <div>
            {/* Benefit Type and Month of Claim */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Financial Record</h2>
    
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-[#219EBC] rounded-full w-full"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Step 3 of 3</p>
            </div>
    
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Benefit Type */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Benefit Type {benefitType !== "No Benefit" && <span className="text-red-500">*</span>}
                    </label>
                    <select
                        value={benefitType}
                        onChange={(e) => setBenefitType(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="No Benefit">No Benefit</option>
                        <option value="Social Pension">Social Pension</option>
                        <option value="Financial Assistance">Financial Assistance</option>
                    </select>
                </div>

                {/* Conditional Rendering for Fields */}
                {benefitType === "Financial Assistance" ? (
                    <>
                        {/* DOB Field for Financial Assistance */}
                        <div className="">
                            <label className="block text-lg font-medium text-gray-700 mb-1">
                                Date of Claim {benefitType !== "No Benefit" && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="date"
                                onChange={handleDobChange}
                                value={dob ? moment(dob, "MM/DD/YYYY").format("YYYY-MM-DD") : ""}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </>
                ) : benefitType !== "No Benefit" ? (
                    // Month of Claim for Other Benefits
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Month of Claim {benefitType !== "No Benefit" && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="month"
                            value={monthOfClaim}
                            onChange={(e) => setMonthOfClaim(e.target.value)}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {monthOfClaim && (
                            <p className="text-sm text-gray-600 mt-1">
                                Quarter: <span className="font-semibold">{getQuarter(monthOfClaim)}</span>
                            </p>
                        )}
                    </div>
                ) : null}
            </div>
            
            {/* Additional Fields for Financial Assistance */}
            {benefitType === "Financial Assistance" && (
                <div className="mb-6 gap-4">
                    {/* Program Name */}
                    <div className="w-full">
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Program Name {benefitType !== "No Benefit" && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter benefit program name"
                            value={benefitName}
                            onChange={(e) => setBenefitName(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Claimer and Relationship Fields */}
            {benefitType !== "No Benefit" && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Claimer */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Claimer {benefitType !== "No Benefit" && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter claimer name"
                            value={claimer}
                            onChange={(e) => setClaimer(e.target.value)}
                        />
                    </div>
        
                    {/* Relationship */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-1">
                            Relationship {benefitType !== "No Benefit" && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter relationship"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                        />
                    </div>
                </div>
            )}
    
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={onClose}
                    className="border w-[100px] border-[#219EBC] bg-transparent p-3 text-[#219EBC] rounded-md font-semibold"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAddBenefit}
                    disabled={!isFormValid()}
                    className="w-[100px] bg-[#219EBC] text-white p-3 rounded-md font-semibold disabled:opacity-50"
                >
                    Add
                </button>
            </div>
            
           {/* Render Added Benefits */}
{benefits.length > 0 && (
    <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Added Benefits</h3>
        <ul className="space-y-4 mt-4">
            {benefits.map((benefit, index) => (
                <li key={index} className="border p-4 rounded-md shadow-sm">
                    <h4 className="font-semibold text-lg">{benefit.benefitName || benefit.benefitType}</h4>
                    <p><strong>Benefit Type:</strong> {benefit.benefitType}</p>

                    {/* Conditionally render Month of Claim or Date of Claim based on Benefit Type */}
                    {benefit.benefitType === "Financial Assistance" ? (
                        <p><strong>Date of Claim:</strong> {moment(benefit.dob).format("MMMM DD, YYYY")}</p>
                    ) : (
                        <>
                            <p><strong>Claim Month:</strong> {moment(benefit.monthOfClaim).format("MMMM YYYY")}</p>
                            <p><strong>Quarter:</strong> {getQuarter(benefit.monthOfClaim)}</p>
                        </>
                    )}

                    <p><strong>Claimer:</strong> {benefit.claimer}</p>
                    <p><strong>Relationship:</strong> {benefit.relationship}</p>
                </li>
            ))}
        </ul>
    </div>
)}

        </div>
    );
};

export default Form;
