/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react"

const ArchiveModal = ({ isOpen, onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState("")

    if (!isOpen) return null

    const handleConfirm = () => {
        if (selectedReason) {
            onConfirm(selectedReason) // Pass the selected reason to the onConfirm function
            onClose() // Close the modal after confirming
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold">Archive Member Data</h2>
                <p className="text-sm text-gray-600">
                    Please select a reason for archiving this senior citizen's
                    membership information.
                </p>
                <div className="mt-4">
                    <select
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="" disabled>
                            Select a reason
                        </option>
                        <option value="Deceased">Deceased</option>
                        <option value="Relocated">Relocated</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="mr-2 bg-gray-300 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArchiveModal
