import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal"

const MembersListTable = () => {
    const [members, setMembers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 6
    const totalPages = Math.ceil(members.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMembers = members.slice(startIndex, startIndex + itemsPerPage)

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            const response = await fetch("http://localhost:5000/members")
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
            const response = await fetch(`http://localhost:5000/members/undo/${selectedMember.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Active" }),
            })

            if (response.ok) {
                setMembers((prev) =>
                    prev.map((member) => (member.id === selectedMember.id ? { ...member, status: "Active" } : member)),
                )
                alert("Member has been successfully restored.")
                closeUndoModal()
            } else {
                console.error("Failed to undo archive.")
            }
        } catch (error) {
            console.error("Error undoing archive:", error)
        }
    }

    const openDeleteModal = (memberId) => {
        setSelectedMember({ id: memberId })
        setShowDeleteModal(true)
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false)
        setSelectedMember(null)
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/members/${selectedMember.id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setMembers((prev) => prev.filter((member) => member.id !== selectedMember.id))
                closeDeleteModal()
                alert("Member has been successfully deleted.")
            } else {
                console.error("Failed to delete member.")
            }
        } catch (error) {
            console.error("Error deleting member:", error)
        }
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    return (
        <div className="max-h-[450px] overflow-y-auto rounded-xl shadow-xl mx-16">
            <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <thead className="text-white sticky bg-[#219EBC] opacity-90 top-0 h-[50px]">
                    <tr>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Control No.
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap w-[200px] border-x border-gray-200">
                            Full Name
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Birthdate
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">Sex</th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Civil Status
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap w-[200px] border-x border-gray-200">
                            Address
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Contact Number
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            PB No.
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            MB No.
                        </th>
                        <th className="p-4 text-center font-medium whitespace-nowrap border-x border-gray-200">
                            Date Issued
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
                        <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"} text-center`}>
                            <td className="p-4 border-x align-baseline border-gray-200">{member.controlNo}</td>
                            <td className="p-4 border-x align-baseline border-gray-200">
                                {member.firstName} {member.lastName}
                            </td>
                            <td className="p-4 border-x whitespace-nowrap align-baseline border-gray-200">
                                {moment(member.dob).format("MM-DD-YYYY")}
                            </td>
                            <td className="p-4 border-x align-baseline border-gray-200">{member.sex}</td>
                            <td className="p-4 border-x align-baseline border-gray-200">{member.civilStatus}</td>
                            <td className="p-4 border-x align-baseline border-gray-200">{member.address}</td>
                            <td className="p-4 border-x align-baseline border-gray-200">{member.contactNumber}</td>
                            <td className="p-4 border-x align-baseline border-gray-200">
                                {member.purchaseBookletNo || "N/A"}
                            </td>
                            <td className="p-4 border-x align-baseline border-gray-200">
                                {member.medicineBookletNo || "N/A"}
                            </td>
                            <td className="p-4 border-x align-baseline border-gray-200">
                                {member.dateIssued ? moment(member.dateIssued).format("MM-DD-YYYY") : "N/A"}
                            </td>
                            <td
                                className={`p-4 border-x align-baseline border-gray-200 font-medium ${getStatusColor(member.status)}`}
                            >
                                {member.status || "N/A"}
                            </td>
                            <td className="p-4 border-x border-gray-200 flex justify-center gap-2">
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

            {/* Pagination Controls */}
            <div className="flex fixed bottom-5 mt-4">
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

            {/* Modals */}
            <UndoModal isOpen={showModal} onClose={closeUndoModal} onConfirm={handleUndoArchive} />
            <DeleteModal isOpen={showDeleteModal} onClose={closeDeleteModal} onConfirm={handleDelete} />
        </div>
    )
}

export default MembersListTable
