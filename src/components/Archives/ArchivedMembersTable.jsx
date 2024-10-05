/* eslint-disable react/prop-types */
import { useState } from "react"
import ArchiveConfirmModal from "../MembersList/ArchiveConfirmModal" // adjust the path as necessary
import axios from "axios" // Ensure axios is installed

const Table = ({ membersData, setMembersData }) => {
    // Add setMembersData prop
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedMemberId, setSelectedMemberId] = useState(null)

    const handleArchiveClick = (memberId) => {
        setSelectedMemberId(memberId)
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedMemberId(null) // Reset selected member ID
    }

    const handleConfirmArchive = async (archiveReason) => {
        try {
            // Send a request to update the member's status in the database
            await axios.put(
                `http://localhost:5000/members/${selectedMemberId}`,
                { status: archiveReason },
            )

            // Update the local state to reflect the change
            setMembersData((prevData) =>
                prevData.map((member) =>
                    member.id === selectedMemberId
                        ? { ...member, status: archiveReason }
                        : member,
                ),
            )
        } catch (error) {
            console.error("Error archiving member:", error)
            alert("Failed to archive member. Please try again.")
        }
    }

    return (
        <div className="flex-1 flex flex-col pl-16 pr-16">
            <table className="w-full bg-[#FFFFFF] shadow-xl rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr className="border-b">
                        <th className="px-16 py-4 text-left font-[500]">
                            Name
                        </th>
                        <th className="text-left font-[500]">Date of Birth</th>
                        <th className="text-left font-[500]">Gender</th>
                        <th className="text-left font-[500]">Address</th>
                        <th className="text-left font-[500]">Status</th>
                        <th className="text-left font-[500]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {membersData.map((item, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            }`}
                            key={item.id}
                        >
                            <td className="px-16 py-4">{item.name}</td>
                            <td>{item.dob}</td>
                            <td>{item.gender}</td>
                            <td>{item.address}</td>
                            <td
                                className={
                                    item.status === "Deceased"
                                        ? "text-red-500"
                                        : ""
                                }
                            >
                                {item.status}
                            </td>
                            <td>
                                <button
                                    onClick={() => handleArchiveClick(item.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Archive
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <ArchiveConfirmModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onConfirm={handleConfirmArchive} // Pass the function to handle confirmation
                    memberName={
                        membersData.find(
                            (member) => member.id === selectedMemberId,
                        )?.name
                    } // Get the selected member's name
                />
            )}
        </div>
    )
}

export default Table
