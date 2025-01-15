/* eslint-disable react/prop-types */
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h3 className="text-xl font-semibold mb-4">
                    Are you sure you want to permanently delete this item?
                </h3>
                <div className="flex justify-end mt-8">
                    <button
                        onClick={onClose}
                        className="mr-2 border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC] hover:text-white font-bold px-4 py-2 rounded transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-[#219EBC] hover:bg-[#168B99] text-white font-bold px-4 py-2 rounded transition-colors duration-300"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
