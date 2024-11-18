import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal" // Import the UndoModal component

const MembersListTable = () => {
    const [members, setMembers] = useState([]) // State to hold fetched members data
    const [showModal, setShowModal] = useState(false) // State for showing the UndoModal
    const [selectedMember, setSelectedMember] = useState(null) // State to store the member being archived/undo-archived

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            const response = await fetch("http://localhost:5000/members")
            const data = await response.json()

            // Filter out archived members (assuming 'status' is not 'Active' for archived members)
            const activeMembers = data.filter(
                (member) => member.status !== "Active",
            )
            setMembers(activeMembers)
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
        const { id, status } = selectedMember
        const newStatus = status === "Active" ? "Archived" : "Active" // Toggle between Active and Archived
        try {
            const response = await fetch(
                `http://localhost:5000/members/archive/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                },
            )
            const data = await response.json()

            if (response.ok) {
                // Update the members state after successful update
                setMembers((prevMembers) =>
                    prevMembers.map((member) =>
                        member.id === id
                            ? { ...member, status: newStatus }
                            : member,
                    ),
                )
                closeUndoModal() // Close the modal after successful action
                fetchMembers()
            } else {
                console.error("Error:", data.message)
            }
        } catch (error) {
            console.error("Error updating member status:", error)
        }
    }

    return (
        <div className="rounded-xl max-h-[calc(90vh-200px)] mx-16">
            {/* Set max height and enable vertical scrolling */}
            <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-xl">
                <thead className="text-[#767171CC] border-b">
                    <tr>
                        <th className="pl-16 py-4 text-left font-medium whitespace-nowrap w-[10%]">
                            ID No.
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[20%]">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[15%]">
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
                        <th className="text-left pl-8 font-medium whitespace-nowrap w-[10%]">
                            Status
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap w-[10%]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr
                            key={member.id}
                            className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                        >
                            <td className="px-16 py-4 text-left">
                                {member.idNo}
                            </td>
                            <td className="text-left">{member.name}</td>
                            <td className="text-left">
                                {moment(member.dob).format("MMMM D, YYYY")}
                            </td>
                            <td className="text-left">{member.age}</td>
                            <td className="text-left">
                                {member.gender === "male" ? "Male" : "Female"}
                            </td>
                            <td className="text-left">{member.address}</td>
                            <td className="text-left">{member.phone}</td>
                            <td
                                className={`text-left pl-8 ${getStatusColor(member.status)}`}
                            >
                                {member.status}
                            </td>
                            <td className="px-8 py-4 flex gap-2 text-[#219EBC] font-semibold underline">
                                <button
                                    onClick={() =>
                                        openUndoModal(member.id, member.status)
                                    }
                                >
                                    Undo
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Undo Modal */}
            <UndoModal
                isOpen={showModal}
                onClose={closeUndoModal}
                onConfirm={handleUndoArchive}
            />
        </div>
    )
}

export default MembersListTable
