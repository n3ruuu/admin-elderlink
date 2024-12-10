/* eslint-disable react/prop-types */
import { useState } from "react"
import ApproveIcon from "../../assets/icons/approve.svg"
import RejectIcon from "../../assets/icons/reject.svg"
import PreviewIcon from "../../assets/icons/preview.svg"
import UndoIcon from "../../assets/icons/cancel.svg"
import Modal from "./Register/Modal" // Assuming you already have a Modal component

const Table = ({ applications, onStatusUpdate }) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState(null)

    // Function to open the modal with the selected application
    const openModal = (application) => {
        setSelectedApplication(application)
        setIsModalVisible(true)
    }

    // Function to close the modal
    const closeModal = () => {
        setIsModalVisible(false)
        setSelectedApplication(null)
    }

    return (
        <div>
            <table className="w-full bg-[#FFFFFF] shadow-xl rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr className="border-b">
                        <th className="px-16 py-4 text-left font-[500]">Applicant Name</th>
                        <th className="text-left font-[500]">Form Type</th>
                        <th className="text-left font-[500]">Status</th>
                        <th className="text-left font-[500]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((item, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={item.id}
                        >
                            <td className="px-16 py-4">{item.firstName}</td>
                            <td>OSCA Registration</td>
                            <td>{item.status}</td>
                            <td className="flex pt-2">
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200"
                                    aria-label="Preview"
                                    onClick={() => openModal(item)} // Open modal with item data
                                >
                                    <img src={PreviewIcon} alt="Preview Icon" className="w-5 h-5" />
                                </button>

                                {item.status === "Pending" && (
                                    <>
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200"
                                            aria-label="Approve"
                                            onClick={() => onStatusUpdate(item.id, "Approved")}
                                        >
                                            <img src={ApproveIcon} alt="Approve Icon" className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200"
                                            aria-label="Reject"
                                            onClick={() => onStatusUpdate(item.id, "Rejected")}
                                        >
                                            <img src={RejectIcon} alt="Reject Icon" className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {item.status === "Approved" && (
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-200"
                                        aria-label="Cancel"
                                        onClick={() => onStatusUpdate(item.id, "Pending")}
                                    >
                                        <img src={UndoIcon} alt="Cancel Icon" className="w-5 h-5" />
                                    </button>
                                )}

                                {item.status === "Rejected" && (
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-200"
                                        aria-label="Cancel"
                                        onClick={() => onStatusUpdate(item.id, "Pending")}
                                    >
                                        <img src={UndoIcon} alt="Cancel Icon" className="w-5 h-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Conditionally render Modal */}
            {isModalVisible && selectedApplication && <Modal onClose={closeModal} application={selectedApplication} />}
        </div>
    )
}

export default Table
