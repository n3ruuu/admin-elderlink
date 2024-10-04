/* eslint-disable react/prop-types */
import { useState } from "react"

const ArchiveConfirmModal = ({ isOpen, onClose, onConfirm, memberName }) => {
    const [archiveReason, setArchiveReason] = useState("")

    if (!isOpen) return null

    const handleConfirm = () => {
        if (!archiveReason) {
            alert("Please select a reason for archiving.")
            return
        }
        onConfirm(archiveReason) // Pass the selected reason to the confirm handler
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[30%]">
                <h2 className="text-2xl font-bold mb-6">Confirm Archive</h2>
                <p className="text-lg mb-4">
                    Are you sure you want to archive{" "}
                    <span className="font-bold">{memberName}</span> including
                    all existing records from the Elderlink?
                </p>
                <div className="mb-4">
                    <select
                        value={archiveReason}
                        onChange={(e) => setArchiveReason(e.target.value)}
                        className="border rounded-md p-2 w-full"
                    >
                        <option value="">Select a reason...</option>
                        <option value="Deceased">Deceased</option>
                        <option value="Relocated">Relocated</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
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
                        onClick={handleConfirm}
                    >
                        Archive
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArchiveConfirmModal
