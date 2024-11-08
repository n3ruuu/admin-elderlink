/* eslint-disable react/prop-types */
const UndoModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h3 className="text-xl font-semibold mb-4">
                    Are you sure you want to undo?
                </h3>
                <div className="flex justify-between">
                    <button
                        onClick={onConfirm}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UndoModal
