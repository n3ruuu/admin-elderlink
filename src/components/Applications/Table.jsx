/* eslint-disable react/prop-types */
import { useState } from "react"
import ApproveIcon from "../../assets/icons/approve.svg"
import RejectIcon from "../../assets/icons/reject.svg"
import PreviewIcon from "../../assets/icons/preview.svg"
import UndoIcon from "../../assets/icons/cancel.svg"
import SendIcon from "../../assets/icons/send-icon.svg"
import axios from "axios"
import moment from "moment"
import Modal from "./Register/Modal"
import EmailModal from "./EmailModal"

const Table = ({ applications, onStatusUpdate }) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [recipients, setRecipients] = useState([])

    // Status feedback modal
    const [statusMessage, setStatusMessage] = useState("")
    const [showStatusModal, setShowStatusModal] = useState(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(applications.length / itemsPerPage)

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    const openModal = (application) => {
        setSelectedApplication(application)
        setIsModalVisible(true)
    }

    const closeModal = () => {
        setIsModalVisible(false)
        setSelectedApplication(null)
    }

    const openEmailModal = (application) => {
        setRecipients([application.guardianEmail])
        setIsEmailModalOpen(true)
    }

    const closeEmailModal = () => {
        setIsEmailModalOpen(false)
        setRecipients([])
    }

    // Show status modal temporarily
    const showTemporaryStatus = (message) => {
        setStatusMessage(message)
        setShowStatusModal(true)
        setTimeout(() => setShowStatusModal(false), 2000)
    }

    const handleStatusUpdate = async (application, status) => {
        if (status === "Approved") {
            try {
                await axios.post("http://5.181.217.153:5000/members", {
                    firstName: application.firstName,
                    lastName: application.lastName,
                    middleName: application.middleName,
                    extension: application.extension,
                    dob: moment(application.dob).format("YYYY-MM-DD"),
                    sex: application.sex,
                    civilStatus: application.civilStatus,
                    address: application.address,
                    contactNumber: application.contactNumber,
                    controlNo: "",
                    purchaseBookletNo: "",
                    medicineBookletNo: "",
                    dateIssued: "",
                    medicalConditions: "",
                    medications: "",
                    guardianFirstName: application.guardianFirstName,
                    guardianMiddleName: application.guardianMiddleName,
                    guardianLastName: application.guardianLastName,
                    guardianEmail: application.guardianEmail,
                    guardianContact: application.guardianContact,
                    guardianRelationship: application.guardianRelationship,
                    status: "Active",
                })
                onStatusUpdate(application.id, "Approved")
                showTemporaryStatus("Successfully Approved ✅")
            } catch (error) {
                console.error("Error while adding member:", error)
            }
        } else {
            onStatusUpdate(application.id, status)
            const message = status === "Rejected" ? "Application Rejected ❌" : "Status set to Pending ⚪"
            showTemporaryStatus(message)
        }
    }

    // Slice applications to display only current page items
    const paginatedApplications = applications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="overflow-y-auto max-h-[650px] w-full shadow-lg rounded-xl border relative">
            {/* Status Feedback Modal */}
            {showStatusModal && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-xl shadow-lg border border-gray-300 z-50 animate-fadeIn">
                    {statusMessage}
                </div>
            )}

            <table className="min-w-full bg-white rounded-xl border border-gray-300 border-collapse">
                <thead className="bg-[#219EBC] text-white opacity-90">
                    <tr>
                        <th className="px-6 py-4 text-center font-[500] border border-gray-300">Applicant Name</th>
                        <th className="px-6 py-4 text-center font-[500] border border-gray-300">Form Type</th>
                        <th className="px-6 py-4 text-center font-[500] border border-gray-300">Application Type</th>
                        <th className="px-6 py-4 text-center font-[500] border border-gray-300">Application Status</th>
                        <th className="px-6 py-4 text-center w-[150px] font-[500] border border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedApplications.map((item, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={item.id}
                        >
                            <td className="px-6 py-3 border-x border-gray-300">
                                {item.firstName} {item.middleName} {item.lastName}
                            </td>
                            <td className="px-6 py-3 border-x border-gray-300">OSCA Registration</td>
                            <td className="px-6 py-3 border-x border-gray-300">
                                {item.applicationType.charAt(0).toUpperCase() + item.applicationType.slice(1)}{" "}
                                Registration
                            </td>
                            <td className="px-6 py-3 border-x border-gray-300">{item.applicationStatus}</td>
                            <td className="py-3 flex justify-center gap-2">
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200"
                                    aria-label="Preview"
                                    onClick={() => openModal(item)}
                                >
                                    <img src={PreviewIcon} alt="Preview Icon" className="w-5 h-5" />
                                </button>

                                {item.applicationStatus === "Pending" && (
                                    <>
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200"
                                            aria-label="Approve"
                                            onClick={() => handleStatusUpdate(item, "Approved")}
                                        >
                                            <img src={ApproveIcon} alt="Approve Icon" className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200"
                                            aria-label="Reject"
                                            onClick={() => handleStatusUpdate(item, "Rejected")}
                                        >
                                            <img src={RejectIcon} alt="Reject Icon" className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {item.applicationStatus === "Approved" && (
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-200"
                                        aria-label="Cancel"
                                        onClick={() => handleStatusUpdate(item, "Pending")}
                                    >
                                        <img src={UndoIcon} alt="Cancel Icon" className="w-5 h-5" />
                                    </button>
                                )}

                                {item.applicationStatus === "Rejected" && (
                                    <div className="flex gap-2">
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200"
                                            aria-label="Cancel"
                                            onClick={() => handleStatusUpdate(item, "Pending")}
                                        >
                                            <img src={UndoIcon} alt="Cancel Icon" className="w-5 h-5" />
                                        </button>

                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200"
                                            aria-label="Send"
                                            onClick={() => openEmailModal(item)}
                                        >
                                            <img src={SendIcon} alt="Send Icon" className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex fixed bottom-5 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ${
                        currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white"
                    } rounded-md`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 ${
                            currentPage === index + 1
                                ? "bg-[#219EBC] text-white"
                                : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white"
                        } rounded-md mx-1`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ${
                        currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white"
                    } rounded-md`}
                >
                    Next
                </button>
            </div>

            {isModalVisible && selectedApplication && <Modal onClose={closeModal} application={selectedApplication} />}
            {isEmailModalOpen && (
                <EmailModal isOpen={isEmailModalOpen} onClose={closeEmailModal} recipients={recipients} />
            )}
        </div>
    )
}

export default Table
