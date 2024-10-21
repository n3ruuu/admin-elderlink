/* eslint-disable react/prop-types */

const Form = ({
    searchTerm,
    setSearchTerm,
    clearSearchTerm,
    handleSuggestionClick,
    suggestions, // Add suggestions prop
    isSaveDisabled,
    handleSave,
    onClose,
}) => {
    return (
        <form className="relative">
            {/* Search Member / Name Display */}
            <div className="mb-4 relative">
                <label
                    htmlFor="searchMember"
                    className="block text-lg font-medium text-gray-700 mb-1"
                >
                    Search Member
                </label>
                <input
                    type="text"
                    id="searchMember"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="relative p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search by name"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={clearSearchTerm}
                        className="absolute right-3 top-10 text-2xl text-gray-500 hover:text-gray-800"
                        title="Clear search"
                    >
                        &times;
                    </button>
                )}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && ( // Check if there are any suggestions
                <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md shadow-md w-full">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}

            {/* Save and Cancel Buttons */}
            <div className="flex justify-end gap-5 items-center mt-8">
                <button
                    type="button"
                    className="border w-[100px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className={`bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px] ${
                        isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                >
                    Save
                </button>
            </div>
        </form>
    )
}

export default Form
