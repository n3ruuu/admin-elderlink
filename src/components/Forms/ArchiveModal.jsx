/* eslint-disable react/prop-types */
const ArchiveModal = ({ isOpen, onClose, onConfirm, article }) => {
    if (!isOpen) return null

    const handleConfirm = () => {
        onConfirm() // Call the onConfirm callback to handle archiving
        onClose() // Optionally close the modal after confirming
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            role="dialog"
            aria-labelledby="confirm-archive-title"
            aria-modal="true"
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
                <h2 id="confirm-archive-title" className="text-2xl font-bold mb-6">
                    Confirm Delete
                </h2>
                <p className="text-lg mb-4">
                    Are you sure you want to delete the forms about <span className="font-bold">{article}</span>?
                </p>
                <div className="flex justify-end space-x-1">
                    <button
                        type="button"
                        className="mr-2 border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC] hover:text-white font-bold px-4 py-2 rounded transition-colors duration-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded transition-colors duration-300"
                        onClick={handleConfirm}
                    >
                        Archive
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArchiveModal
