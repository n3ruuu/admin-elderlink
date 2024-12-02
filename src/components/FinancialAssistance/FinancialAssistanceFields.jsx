/* eslint-disable react/prop-types */

const FinancialAssistanceFields = ({ formValues, onChange }) => {
    return (
        <div>
            {/* Program Name and Date of Claim Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Program Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="programName"
                        value={formValues.programName}
                        onChange={onChange}
                        placeholder="Enter benefit program name"
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Date of Claim <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="claimDate"
                        value={formValues.claimDate}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Claimer and Relationship Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Claimer <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="claimer"
                        value={formValues.claimer}
                        onChange={onChange}
                        placeholder="Enter claimer's name"
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-1">
                        Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="claimerRelationship"
                        value={formValues.claimerRelationship}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="" disabled>
                            Select relationship
                        </option>
                        <option value="Parent">Parent</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Relative">Relative</option>
                        <option value="Guardian">Guardian</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default FinancialAssistanceFields
