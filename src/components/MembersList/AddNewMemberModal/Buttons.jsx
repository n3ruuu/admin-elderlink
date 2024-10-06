/* eslint-disable react/prop-types */
const Buttons = ({
    onClose,
    handleSave,
    importedMembers,
    handleImportSave,
}) => {
    return (
        <div className="flex justify-end mt-6 space-x-4">
            <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
                Cancel
            </button>
            {importedMembers.length > 0 ? (
                <button
                    type="button"
                    onClick={handleImportSave}
                    className="bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded"
                >
                    Import Members
                </button>
            ) : (
                <button
                    type="submit"
                    onClick={handleSave} // This will handle saving
                    className="bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded"
                >
                    Save
                </button>
            )}
        </div>
    )
}

export default Buttons
