/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment" // Import Moment.js
import ArchiveModal from "./ArchiveModal" // Import the Confirmation Modal

const Table = ({ membersData, handleOpenModal }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // State for the confirmation modal
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [memberToArchive, setMemberToArchive] = useState(null)

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

    // Handle archive button click
    const handleArchiveClick = (member) => {
        setMemberToArchive(member)
        setIsConfirmModalOpen(true)
    }

    // Handle confirm archiving
    const handleConfirmArchive = async () => {
        setIsConfirmModalOpen(false)
        setMemberToArchive(null)
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
                                    onClick={() => handleArchiveClick(member)} // Open confirmation modal
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
                    className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#219EBC] hover:bg-[#168B99]"} text-white rounded-md`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 ${currentPage === index + 1 ? "bg-[#1A7A8A] text-white" : "bg-[#219EBC] hover:bg-[#168B99] text-white"} rounded-md mx-1`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#219EBC] hover:bg-[#168B99]"} text-white rounded-md`}
                >
                    Next
                </button>
            </div>

            {/* Confirmation Modal */}
            <ArchiveModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmArchive}
                memberName={memberToArchive?.name}
            />
        </div>
    )
}

export default Table
