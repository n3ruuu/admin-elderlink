/* eslint-disable react/prop-types */

const ArchiveModal = ({ isOpen, onClose, onConfirm, memberName }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
                <h2 className="text-lg font-bold">Confirm Archive</h2>
                <p>Are you sure you want to archive {memberName}?</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="mr-2 bg-gray-300 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArchiveModal
