/* eslint-disable react/prop-types */
const DeleteSuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[450px] flex flex-col items-center text-center">
                <h2 className="text-xl font-semibold mb-4 text-[#219EBC]">Deleted Successfully</h2>
                <p className="text-gray-700 mb-6">The event has been permanently deleted.</p>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[#219EBC] text-white rounded-lg hover:bg-[#1b7c91] transition"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default DeleteSuccessModal
