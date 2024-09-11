/* eslint-disable react/prop-types */
const ArchiveConfirmModal = ({ isOpen, onClose, onConfirm, memberName }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[30%]">
                <h2 className="text-2xl font-bold mb-6">Confirm Archive</h2>
                <p className="text-lg mb-6">
                    Are you sure you want to archive{" "}
                    <span className="font-bold">{memberName}</span> including
                    all existing records from the Elderlink?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        className="bg-[#FFFFFF] border-[#219EBC] text-[#219EBC] border-2 px-6 py-2 rounded-xl hover:bg-[#219EBC] hover:text-[#FFFFFF] hover:border-[#219EBC]"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="text-[#FFFFFF] bg-red-600 px-6 py-2 rounded-xl"
                        onClick={onConfirm}
                    >
                        Archive
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArchiveConfirmModal
