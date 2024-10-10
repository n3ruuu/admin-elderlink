/* eslint-disable react/prop-types */
const Buttons = ({
    onClose,
    handleSave,
    importedMembers,
    handleImportSave,
    formValid, // Add formValid prop to control button state
    isEditing, // Add isEditing prop to determine if editing mode is active
}) => {
    return (
        <div className="flex justify-end mt-6 space-x-4">
            <button
                type="button"
                onClick={onClose}
                className="border w-[100px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
            >
                Cancel
            </button>
            {importedMembers.length > 0 ? (
                <button
                    type="button"
                    onClick={handleImportSave}
                    className="bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                    Add
                </button>
            ) : (
                <button
                    type="submit"
                    onClick={handleSave}
                    disabled={!formValid} // Disable if form is not valid
                    className={`${
                        !formValid
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed w-[100px]"
                            : "bg-[#219EBC] hover:bg-[#1A7A8A] text-white w-[100px]"
                    } font-bold py-2 px-4 rounded transition-colors duration-300`}
                >
                    {isEditing ? "Edit" : "Add"}
                </button>
            )}
        </div>
    )
}

export default Buttons
