/* eslint-disable react/prop-types */

const SuccessModal = ({
    isOpen,
    onClose,
    title,
    message,
    onGoToArchives,
    isArchiving,
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[510px] flex flex-col">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                {/* Dynamic title */}
                <p className="mb-6 text-[#767171CC]">
                    {message} {/* Dynamic message */}
                </p>

                {isArchiving ? (
                    // Show both "Go to Archives" and "Got it" buttons if archiving
                    <div className="flex justify-end gap-5">
                        <button
                            onClick={onGoToArchives}
                            className="text-[#219EBC] border w-[150px] border-[#219EBC] hover:bg-[#219EBC] hover:text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            Go to Archives
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-[#219EBC] w-[100px] hover:bg-[#168B99] text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            Got it
                        </button>
                    </div>
                ) : (
                    // Show only "Got it" button for other actions
                    <button
                        onClick={onClose}
                        className="self-end bg-[#219EBC] w-[100px] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 bottom-4 right-4"
                    >
                        Got it
                    </button>
                )}
            </div>
        </div>
    )
}

export default SuccessModal
