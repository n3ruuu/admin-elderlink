/* eslint-disable react/prop-types */
const Buttons = ({
    onClose,
    handleSave,
    importedMembers,
    handleImportSave,
    formValid, // Add formValid prop to control button state
    isEditing, // Add isEditing prop to determine if editing mode is active
    isChanged, // Add isChanged prop to track if changes were made
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
                    className="bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px]"
                >
                    Add
                </button>
            ) : (
                <button
                    type="submit"
                    onClick={handleSave}
                    disabled={!formValid || !isChanged} // Disable if form is not valid or no changes made
                    className={`${
                        !formValid || !isChanged
                            ? "opacity-50 cursor-not-allowed w-[100px]"
                            : "bg-[#219EBC] hover:bg-[#1A7A8A] text-white w-[100px]"
                    } bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px]`}
                >
                    {isEditing ? "Save" : "Add"}
                </button>
            )}
        </div>
    )
}

export default Buttons
