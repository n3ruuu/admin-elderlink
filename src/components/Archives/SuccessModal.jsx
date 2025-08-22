/* eslint-disable react/prop-types */
const SuccessModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
                <h2 className="text-lg font-semibold text-[#219EBC] mb-4">Success</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#219EBC] text-white rounded-md hover:bg-[#176b85] transition-colors duration-300"
                >
                    OK
                </button>
            </div>
        </div>
    )
}

export default SuccessModal
