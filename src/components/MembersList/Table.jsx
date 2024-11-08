/* eslint-disable react/prop-types */
import { useState } from "react"
import axios from "axios"
import moment from "moment"
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ArchiveModal from "./ArchiveModal"
import SuccessModal from "./SuccessModal"
import ReportIcon from "../../assets/icons/report.svg"

const Table = ({ membersData, handleOpenModal, handleArchiveMember }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [memberToArchive, setMemberToArchive] = useState(null)

    // State for SuccessModal
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    const totalPages = Math.ceil(membersData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMembers = membersData.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleArchiveClick = (member) => {
        setMemberToArchive(member)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmArchive = async (selectedReason) => {
        if (!memberToArchive) return

        try {
            await axios.put(
                `http://localhost:5000/members/archive/${memberToArchive.id}`,
                { status: selectedReason }, // Pass the selected reason in the request body
            )

            // Call the parent function to update membersData in the parent component
            handleArchiveMember(memberToArchive.id)

            // Open SuccessModal after successful archiving
            setIsSuccessModalOpen(true)
        } catch (error) {
            console.error(
                "Error archiving member:",
                error.response?.data?.error || error.message,
            )
        } finally {
            setIsConfirmModalOpen(false)
            setMemberToArchive(null)
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-[#FFFFFF] rounded-xl shadow-lg">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="pl-16 py-4 text-left font-medium whitespace-nowrap w-[10%]">
                            ID No.
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[20%]">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">
                            Date of Birth
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">
                            Age
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">
                            Gender
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[20%]">
                            Address
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">
                            Phone Number
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap w-[10%]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr
                            key={member.id}
                            className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                        >
                            {/* Senior Citizen ID No. column */}
                            <td className="px-16 py-4 text-left">
                                {member.idNo}
                            </td>
                            <td className="text-left">{member.name}</td>
                            <td className="text-left">
                                {moment(member.dob).format("YYYY-MM-DD")}
                            </td>
                            <td className="text-left">{member.age}</td>
                            <td className="text-left">
                                {member.gender === "male" ? "Male" : "Female"}
                            </td>
                            <td className="text-left">{member.address}</td>
                            <td className="text-left">{member.phone}</td>
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
                                    onClick={() => handleArchiveClick(member)}
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

            <div className="flex fixed bottom-5 mt-4">
                {/* Pagination controls */}
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

            {/* Archive modal */}
            <ArchiveModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmArchive}
                memberName={memberToArchive?.name}
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                onGoToArchives={() => {
                    setIsSuccessModalOpen(false)
                    // Navigate to archives
                }}
                isArchiving={true}
                title="Member Archived!"
                message="The member’s information has been successfully archived."
            />

            {/* Generate Report button at bottom-right */}
            <button
                className="fixed bottom-5 right-16 border text-[#219EBC] border-[#219EBC] flex px-5 py-3 rounded-md hover:bg-[#219EBC] hover:text-white transition-colors duration-300 group"
                onClick={() => {
                    console.log("Generating report...")
                }}
            >
                <img
                    src={ReportIcon}
                    alt="Report Icon"
                    className="w-5 h-5 mr-2 transition duration-300 group-hover:brightness-0 group-hover:invert"
                />
                <span>Generate Report</span>
            </button>
        </div>
    )
}

export default Table
