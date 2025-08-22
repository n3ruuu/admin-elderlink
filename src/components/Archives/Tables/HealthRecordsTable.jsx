import { useState, useEffect } from "react"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal"
import SuccessModal from "../SuccessModal"
import DeleteSuccessModal from "../DeleteSuccessModal" // ✅ new modal

const HealthRecordsTable = () => {
    const [members, setMembers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // ✅ Modals for success messages
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false) // ✅ new state

    const itemsPerPage = 6
    const totalPages = Math.ceil(members.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMembers = members.slice(startIndex, startIndex + itemsPerPage)

    useEffect(() => {
        fetchMembers()
    }, [])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false)
        setSelectedMember(null)
    }

    const openDeleteModal = (memberId) => {
        setSelectedMember({ id: memberId })
        setShowDeleteModal(true)
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://5.181.217.153:5000/members/${selectedMember.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                // ✅ Remove from list
                setMembers((prevMembers) => prevMembers.filter((member) => member.id !== selectedMember.id))

                setShowDeleteSuccessModal(true) // ✅ open delete success modal
                closeDeleteModal()
            } else {
                console.error("Failed to delete member.")
            }
        } catch (error) {
            console.error("Error deleting member:", error)
        }
    }

    const fetchMembers = async () => {
        try {
            const response = await fetch("http://5.181.217.153:5000/members")
            const data = await response.json()

            const archivedMembers = data.filter((member) =>
                ["Relocated", "Deceased", "Inactive"].includes(member.status),
            )
            setMembers(archivedMembers)
        } catch (error) {
            console.error("Error fetching members:", error)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Deceased":
                return "text-red-500"
            case "Relocated":
                return "text-green-500"
            case "Inactive":
                return "text-yellow-500"
            default:
                return "text-gray-500"
        }
    }

    const openUndoModal = (memberId, currentStatus) => {
        setSelectedMember({ id: memberId, status: currentStatus })
        setShowModal(true)
    }

    const closeUndoModal = () => {
        setShowModal(false)
        setSelectedMember(null)
    }

    const handleUndoArchive = async () => {
        try {
            const response = await fetch(`http://5.181.217.153:5000/members/undo/${selectedMember.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Active" }),
            })

            if (response.ok) {
                // ✅ Remove the member from archived list since they're now Active
                setMembers((prevMembers) => prevMembers.filter((member) => member.id !== selectedMember.id))

                setSuccessMessage("Member has been successfully restored.")
                setShowSuccessModal(true)

                closeUndoModal()
            } else {
                console.error("Failed to undo archive.")
            }
        } catch (error) {
            console.error("Error undoing archive:", error)
        }
    }

    return (
        <div className="max-h-[450px] overflow-y-auto rounded-xl shadow-xl mx-16">
            <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <thead className="text-white sticky top-0 bg-[#219EBC] opacity-90">
                    <tr>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Control No.
                        </th>
                        <th className="p-4 text-center font-medium border-x border-gray-200">Full Name</th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Conditions
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Medications
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Guardian Name
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Guardian Email
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Guardian Contact
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Relationship
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Status
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                            <td className="p-4 text-center border-x border-gray-200 align-baseline">
                                {member.controlNo}
                            </td>
                            <td className="p-4 text-center border-x border-gray-200 align-baseline">
                                {member.firstName} {member.lastName}
                            </td>
                            <td className="p-4 text-left border-x border-gray-200 align-baseline">
                                {member.medicalConditions
                                    ? member.medicalConditions
                                          .split(",")
                                          .map((condition, idx) => <div key={idx}>{condition.trim()}</div>)
                                    : "N/A"}
                            </td>
                            <td className="p-4 text-left border-x border-gray-200 align-baseline">
                                {member.medications
                                    ? member.medications.split(",").map((med, idx) => <div key={idx}>{med.trim()}</div>)
                                    : "N/A"}
                            </td>
                            <td className="p-4 text-center border-x border-gray-200 align-baseline">
                                {member.guardianFirstName} {member.guardianLastName}
                            </td>
                            <td className="p-4 text-center border-x border-gray-200 align-baseline">
                                {member.guardianEmail}
                            </td>
                            <td className="p-4 text-center border-x border-gray-200 align-baseline">
                                {member.guardianContact}
                            </td>
                            <td className="p-4 text-center border-x border-gray-200 align-baseline">
                                {member.guardianRelationship}
                            </td>
                            <td
                                className={`p-4 text-center border-x border-gray-200 align-baseline ${getStatusColor(
                                    member.status,
                                )}`}
                            >
                                {member.status || "N/A"}
                            </td>
                            <td className="p-4 text-center border-x border-gray-200 flex justify-center gap-2 align-baseline">
                                <button onClick={() => openUndoModal(member.id, member.status)}>
                                    <img src={UndoIcon} alt="Undo" className="w-5 h-5" />
                                </button>
                                <button onClick={() => openDeleteModal(member.id)}>
                                    <img src={DeleteIcon} alt="Delete" className="w-5 h-5" />
                                </button>
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
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
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
                                : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
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
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                    } rounded-md`}
                >
                    Next
                </button>
            </div>

            {/* Modals */}
            <UndoModal isOpen={showModal} onClose={closeUndoModal} onConfirm={handleUndoArchive} />
            <DeleteModal isOpen={showDeleteModal} onClose={closeDeleteModal} onConfirm={handleDelete} />
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />
            <DeleteSuccessModal isOpen={showDeleteSuccessModal} onClose={() => setShowDeleteSuccessModal(false)} />
        </div>
    )
}

export default HealthRecordsTable
