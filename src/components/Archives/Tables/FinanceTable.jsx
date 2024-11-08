import { useState, useEffect } from "react"
import UndoModal from "../UndoModal" // Import the UndoModal
import moment from "moment"

const HealthRecordsTable = () => {
    const [finance, setFinance] = useState([]) // State to hold fetched finance data
    const [showUndoModal, setShowUndoModal] = useState(false) // State to toggle Undo Modal visibility
    const [selectedMember, setSelectedMember] = useState(null) // State to track selected member for undo

    useEffect(() => {
        // Fetch data from the API
        fetchFinance()
    }, [])

    const fetchFinance = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/financial-assistance",
            )
            const data = await response.json()

            // Filter out archived finance
            const archivedFinance = data.filter(
                (member) => member.status !== "Active",
            )
            setFinance(archivedFinance)
        } catch (error) {
            console.error("Error fetching finance:", error)
        }
    }

    // Function to get the status color
    const getStatusColor = (status) => {
        switch (status) {
            case "Cancelled":
                return "text-red-500" // Red for Cancelled
            case "No Longer Available":
                return "text-yellow-500" // Yellow for No Longer Available
            case "Claimed":
                return "text-green-500" // Green for Claimed
            default:
                return "text-gray-500" // Default gray color
        }
    }

    // Handle undo action (revert status to 'Active')
    const handleUndo = async () => {
        if (selectedMember) {
            const response = await fetch(
                `http://localhost:5000/financial-assistance/archive/${selectedMember.financial_assistance_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "Active" }), // Set the status to 'Active'
                },
            )

            if (response.ok) {
                // Fetch updated data after undo
                fetchFinance()
                setShowUndoModal(false) // Close the undo modal
            } else {
                console.error("Failed to undo status update")
            }
        }
    }

    // Function to open the Undo Modal and set the selected member
    const openUndoModal = (member) => {
        setSelectedMember(member)
        setShowUndoModal(true)
    }

    return (
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] mx-16">
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Benefit Type
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Latest Date of Claim
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Claimer
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Relationship
                        </th>
                        <th className="text-left pl-8 font-medium whitespace-nowrap w-[10%]">
                            Status
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {finance.map((row, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={row.financial_assistance_id || `new-${index}`}
                        >
                            <td className="px-16 py-4 whitespace-nowrap">
                                {row.member_name || row.memberName}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.benefit_type || row.benefitType}
                            </td>
                            <td className="whitespace-nowrap">
                                {moment(
                                    row.date_of_claim || row.dateOfClaim,
                                ).format("MM-DD-YYYY")}
                            </td>

                            <td className="whitespace-nowrap">{row.claimer}</td>
                            <td className="whitespace-nowrap">
                                {row.relationship}
                            </td>
                            <td
                                className={`text-left pl-8 ${getStatusColor(
                                    row.status,
                                )}`}
                            >
                                {row.status}
                            </td>
                            <td
                                className="px-8 py-4 flex gap-2 text-[#219EBC] font-semibold underline cursor-pointer"
                                onClick={() => openUndoModal(row)}
                            >
                                Undo
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Undo Modal */}
            {showUndoModal && (
                <UndoModal
                    isOpen={showUndoModal}
                    onClose={() => setShowUndoModal(false)}
                    onConfirm={handleUndo}
                    member={selectedMember}
                />
            )}
        </div>
    )
}

export default HealthRecordsTable
