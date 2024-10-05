/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment" // Import Moment.js
import { useState } from "react"
import ArchiveConfirmModal from "./ArchiveConfirmModal" // Import the modal

const Table = ({ membersData, handleOpenModal, setArchivedMembers }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7

    // Archive Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)

    // Calculate total pages
    const totalPages = Math.ceil(membersData.length / itemsPerPage)

    // Get current members to display
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMembers = membersData.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    // Change page
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleArchiveClickWithModal = (member) => {
        setSelectedMember(member)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedMember(null)
    }

    const handleConfirmArchive = (reason) => {
        if (selectedMember) {
            // Archive the member here
            const archivedMember = {
                ...selectedMember,
                status: reason, // Add the reason to the archived member
            }
            // Update the state of archived members
            setArchivedMembers((prev) => [...prev, archivedMember])
        }
        handleCloseModal()
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Date of Birth
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Age
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Gender
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Address
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Phone Number
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Email
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member) => (
                        <tr key={member.id} className="border-b">
                            <td className="px-16 py-4 text-left">
                                {member.name}
                            </td>
                            <td className="text-left">
                                {moment(member.dob).format("YYYY-MM-DD")}
                            </td>
                            <td className="text-left">{member.age}</td>
                            <td className="text-left">
                                {member.gender === "male" ? "Male" : "Female"}
                            </td>
                            <td className="text-left">{member.address}</td>
                            <td className="text-left">{member.phone}</td>
                            <td className="text-left">{member.email}</td>
                            <td className="px-8 py-4 flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(member)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <img
                                        src={EditIcon}
                                        alt="Edit Icon"
                                        className="w-5 h-5"
                                    />
                                </button>
                                <button
                                    onClick={() =>
                                        handleArchiveClickWithModal(member)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <img
                                        src={ArchiveIcon}
                                        alt="Archive Icon"
                                        className="w-5 h-5"
                                    />
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
                    className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#1A7A8A] hover:bg-[#168B99]"} text-white rounded-md`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 ${currentPage === index + 1 ? "bg-[#219EBC] text-white" : "bg-[#1A7A8A] hover:bg-[#168B99]"} text-white rounded-md mx-1`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#1A7A8A] hover:bg-[#168B99]"} text-white rounded-md`}
                >
                    Next
                </button>
            </div>

            {/* Archive Modal */}
            <ArchiveConfirmModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmArchive} // Handle archive confirmation
            />
        </div>
    )
}

export default Table
