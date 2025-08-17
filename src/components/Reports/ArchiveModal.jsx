/* eslint-disable react/prop-types */
const ArchiveModal = ({ isOpen, onClose, onConfirm, reportName }) => {
    if (!isOpen) return null

    const handleConfirm = () => {
        onConfirm()
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Archive</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Are you sure you want to archive the report titled{" "}
                    <span className="font-bold text-gray-900">{reportName}</span>?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        className="border border-[#219EBC] text-[#219EBC] hover:bg-[#219EBC] hover:text-white font-medium px-5 py-2.5 rounded-lg"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-lg"
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
