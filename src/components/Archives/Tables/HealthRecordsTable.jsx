import { useState, useEffect } from "react"
import UndoModal from "../UndoModal" // Import the UndoModal
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal" // Import the DeleteModal component

const HealthRecordsTable = () => {
    const [members, setMembers] = useState([]) // State to hold fetched members data
    const [showModal, setShowModal] = useState(false) // State for showing the UndoModal
    const [selectedMember, setSelectedMember] = useState(null) // State to store the member being archived/undo-archived
    const [currentPage, setCurrentPage] = useState(1) // Current page state
    const [showDeleteModal, setShowDeleteModal] = useState(false) // State for DeleteModal visibility

    const itemsPerPage = 6 // Number of items to display per page
    const totalPages = Math.ceil(members.length / itemsPerPage) // Calculate total pages
    const startIndex = (currentPage - 1) * itemsPerPage // Calculate start index
    const currentMembers = members.slice(startIndex, startIndex + itemsPerPage) // Get current active members for display

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
        setShowDeleteModal(true) // Open the Delete Modal
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/members/${selectedMember.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setMembers((prevMembers) =>
                    prevMembers.filter((member) => member.id !== selectedMember.id)
                )
                closeDeleteModal()
                alert("Member has been successfully deleted.")
            } else {
                console.error("Failed to delete member.")
            }
        } catch (error) {
            console.error("Error deleting member:", error)
        }
    }

    const fetchMembers = async () => {
        try {
            const response = await fetch("http://localhost:5000/members")
            const data = await response.json()

            // Only show active members (assuming 'status' is 'Active' for active members)
            const archivedMembers = data.filter((member) =>
                ["Relocated", "Deceased", "Inactive"].includes(member.status),
            )
            setMembers(archivedMembers)
        } catch (error) {
            console.error("Error fetching members:", error)
        }
    }

    // Function to get the status color
    const getStatusColor = (status) => {
        switch (status) {
            case "Deceased":
                return "text-red-500" // Red for Deceased
            case "Relocated":
                return "text-green-500" // Green for Relocated
            case "Inactive":
                return "text-yellow-500" // Yellow for Inactive
            default:
                return "text-gray-500" // Default gray color
        }
    }

    // Function to handle opening the modal for undo archiving
    const openUndoModal = (memberId, currentStatus) => {
        setSelectedMember({ id: memberId, status: currentStatus })
        setShowModal(true)
    }

    // Function to handle closing the UndoModal
    const closeUndoModal = () => {
        setShowModal(false)
        setSelectedMember(null)
    }

    // Function to handle undo archiving or archiving a member
    const handleUndoArchive = async () => {
        try {
            const response = await fetch(`http://localhost:5000/members/undo/${selectedMember.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "Active", // Set the status to "Active"
                }),
            })

            if (response.ok) {
                // Update the frontend by setting the member's status to "Active"
                setMembers((prevMembers) =>
                    prevMembers.map((member) =>
                        member.id === selectedMember.id ? { ...member, status: "Active" } : member,
                    ),
                )

                // Close the modal after the update
                closeUndoModal()
            } else {
                console.error("Failed to undo archive.")
            }
        } catch (error) {
            console.error("Error undoing archive:", error)
        }
    }

    return (
        <div className="rounded-xl max-h-[calc(90vh-200px)] mx-16">
            <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-lg">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="pl-8 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Full Name</th>
                        <th className="text-left font-medium whitespace-normal">Medical Conditions</th>
                        <th className="text-left font-medium whitespace-normal">Medications</th>
                        <th className="text-left font-medium whitespace-nowrap">Guardian Name</th>
                        <th className="text-left font-medium whitespace-nowrap">Guardian Email</th>
                        <th className="text-left font-medium whitespace-nowrap">Guardian Contact</th>
                        <th className="text-left font-medium whitespace-nowrap">Relationship</th>
                        <th className="text-left pl-8 font-medium whitespace-nowrap">Status</th>
                        <th className="text-left pl-8 font-medium whitespace-nowrap">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                            <td className="px-8 py-4 text-left align-baseline">{member.controlNo}</td>
                            <td className="text-left whitespace-nowrap align-baseline">
                                {member.firstName} {member.lastName}
                            </td>

                            <td className="whitespace-normal py-4 align-baseline">
                                {member.medicalConditions
                                    ? member.medicalConditions
                                          .split(",")
                                          .map((condition, idx) => <div key={idx}>{condition.trim()}</div>)
                                    : ""}
                            </td>
                            <td className="whitespace-normal py-4 align-baseline">
                                {member.medications
                                    ? member.medications
                                          .split(",")
                                          .map((medication, idx) => <div key={idx}>{medication.trim()}</div>)
                                    : ""}
                            </td>

                            <td className="whitespace-nowrap align-baseline">
                                {member.guardianFirstName} {member.guardianLastName}
                            </td>

                            <td className="whitespace-nowrap align-baseline">{member.guardianEmail}</td>
                            <td className="text-left align-baseline">{member.guardianContact}</td>
                            <td className="whitespace-nowrap align-baseline">{member.guardianRelationship}</td>
                            <td className={`text-left pl-8 ${getStatusColor(member.status) || "text-gray-500"}`}>
                                {member.status || "N/A"}
                            </td>
                            <td className="pl-8 text-left flex gap-2 mt-3">
                                <button onClick={() => openUndoModal(member.id, member.status)} className="cursor-pointer">
                                    <img src={UndoIcon} alt="Undo Icon" className="w-5 h-5" />
                                </button>
                                <button onClick={() => openDeleteModal(member.id)} className="cursor-pointer">
                                    <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex fixed bottom-5 mt-4">
                {/* Pagination controls */}
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 ${currentPage === index + 1 ? "bg-[#219EBC] text-white" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md mx-1`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Undo Modal */}
            <UndoModal isOpen={showModal} onClose={closeUndoModal} onConfirm={handleUndoArchive} />
            <DeleteModal isOpen={showDeleteModal} onClose={closeDeleteModal} onConfirm={handleDelete} />
     
        </div>
    )
}

export default HealthRecordsTable
