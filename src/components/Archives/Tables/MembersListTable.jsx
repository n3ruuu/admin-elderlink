import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal" // Import the DeleteModal component

const MembersListTable = () => {
    const [members, setMembers] = useState([]) 
    const [showModal, setShowModal] = useState(false) 
    const [showDeleteModal, setShowDeleteModal] = useState(false) // State for DeleteModal visibility
    const [selectedMember, setSelectedMember] = useState(null) 
    const [currentPage, setCurrentPage] = useState(1)

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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "Active",
                }),
            })

            if (response.ok) {
                setMembers((prevMembers) =>
                    prevMembers.map((member) =>
                        member.id === selectedMember.id ? { ...member, status: "Active" } : member,
                    ),
                )
                alert("Member has been successfully restored.");
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
        setShowDeleteModal(true) // Open the Delete Modal
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

    return (
        <div className="rounded-xl max-h-[calc(90vh-200px)] mx-16">
            <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-lg">
                <thead className="text-[#767171CC] h-[80px] align-baseline">
                    <tr>
                        <th className="pl-8 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Full Name</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Birthdate</th>
                        <th className="text-left font-medium whitespace-nowrap w-[5%]">Sex</th>
                        <th className="text-left font-medium whitespace-nowrap w-[7%]">Civil Status</th>
                        <th className="text-left font-medium whitespace-nowrap w-[12%]">Address</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Contact Number</th>
                        <th className="text-left font-medium whitespace-nowrap w-[7%]">
                            Purchase <br /> Booklet No.
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[8%]">
                            Medicine <br /> Booklet No.
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[5%]">Date Issued</th>
                        <th className="text-left pl-8 font-medium whitespace-nowrap w-[5%]">Status</th>
                        <th className="text-left pl-16 font-medium whitespace-nowrap w-[10%]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                            <td className="px-8 py-4 text-left">{member.controlNo}</td>
                            <td className="text-left whitespace-nowrap">{member.firstName} {member.lastName}</td>
                            <td className="text-left whitespace-nowrap">{moment(member.dob).format("MM-DD-YYYY")}</td>
                            <td className="text-left">{member.sex}</td>
                            <td className="text-left">{member.civilStatus}</td>
                            <td className="text-left whitespace-nowrap">{member.address}</td>
                            <td className="text-left">{member.contactNumber}</td>
                            <td className="text-left">{member.purchaseBookletNo || "N/A"}</td>
                            <td className="text-left">{member.medicineBookletNo || "N/A"}</td>
                            <td className="text-left whitespace-nowrap">
                                {member.dateIssued ? moment(member.dateIssued).format("MM-DD-YYYY") : "N/A"}
                            </td>
                            <td className={`text-left pl-8 ${getStatusColor(member.status) || "text-gray-500"}`}>
                                {member.status || "N/A"}
                            </td>
                            <td className="pl-16 text-left flex gap-2 mt-3">
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

            <UndoModal isOpen={showModal} onClose={closeUndoModal} onConfirm={handleUndoArchive} />
            <DeleteModal isOpen={showDeleteModal} onClose={closeDeleteModal} onConfirm={handleDelete} />
        </div>
    )
}

export default MembersListTable;
