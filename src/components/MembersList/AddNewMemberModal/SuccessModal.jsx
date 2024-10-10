/* eslint-disable react/prop-types */

const SuccessModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[510px] relative">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>{" "}
                {/* Dynamic title */}
                <p className="mb-12 text-[#767171CC]">
                    {message} {/* Dynamic message */}
                </p>
                <button
                    onClick={onClose}
                    className="bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 absolute bottom-4 right-4"
                >
                    Got it
                </button>
            </div>
        </div>
    )
}

export default SuccessModal
