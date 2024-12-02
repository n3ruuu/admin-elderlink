/* eslint-disable react/prop-types */
const SocialPensionFields = ({ claimDates, claimers, relationships, onFieldChange }) => {
    return (
        <fieldset className="border border-gray-300 p-4 rounded-md mb-6">
            <legend className="text-lg font-semibold text-gray-700 px-2">Social Pension Details</legend>
            {[0, 1, 2, 3].map((quarter) => (
                <div key={quarter} className="mb-4">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Quarter {quarter + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Claim Date</label>
                            <input
                                type="date"
                                value={claimDates[quarter]}
                                onChange={(e) => onFieldChange(quarter, "claimDates", e.target.value)}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Claimer</label>
                            <input
                                type="text"
                                value={claimers[quarter]}
                                onChange={(e) => onFieldChange(quarter, "claimers", e.target.value)}
                                placeholder="Enter claimer's name"
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Relationship</label>
                            <select
                                value={relationships[quarter]}
                                onChange={(e) => onFieldChange(quarter, "relationships", e.target.value)}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
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
            ))}
        </fieldset>
    )
}

export default SocialPensionFields
