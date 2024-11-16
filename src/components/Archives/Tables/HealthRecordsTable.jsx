import { useState, useEffect } from "react"
import UndoModal from "../UndoModal" // Import the UndoModal

const HealthRecordsTable = () => {
    const [members, setMembers] = useState([]) // State to hold fetched members data
    const [showUndoModal, setShowUndoModal] = useState(false) // State to toggle Undo Modal visibility
    const [selectedMember, setSelectedMember] = useState(null) // State to track selected member for undo

    useEffect(() => {
        // Fetch data from the API
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            const response = await fetch("http://localhost:5000/health-records")
            const data = await response.json()

            // Filter out archived members
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
            case "Cured":
                return "text-green-500" // Green for Relocated
            case "Completed Treatment":
                return "text-green-500" // Yellow for Inactive
            default:
                return "text-gray-500" // Default gray color
        }
    }

    const handleUndo = async () => {
        if (selectedMember) {
            console.log("Selected Member:", selectedMember) // Check if selectedMember is defined
            const response = await fetch(
                `http://localhost:5000/health-records/archive/${selectedMember.health_record_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "Active" }),
                },
            )

            if (response.ok) {
                fetchMembers()
                setShowUndoModal(false) // Close the undo modal
            } else {
                console.error("Failed to undo status update")
            }
        } else {
            console.error("Selected member is not defined")
        }
    }

    // Function to open the Undo Modal and set the selected member
    const openUndoModal = (member) => {
        setSelectedMember(member)
        setShowUndoModal(true)
    }

    return (
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] mx-16">
            <table className="bg-[#FFFFFF] rounded-xl shadow-lg w-full">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="text-left font-medium whitespace-nowrap px-16 py-4 w-[20%]">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-normal">
                            Medical Conditions
                        </th>
                        <th className="text-left font-medium whitespace-normal">
                            Medications
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Guardian
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Relationship
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Emergency Contact
                        </th>
                        <th className="text-left pl-8 font-medium whitespace-nowrap w-[10%]">
                            Status
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {members.map((row, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            }`}
                            key={row.id}
                        >
                            <td className="px-16 py-4 whitespace-nowrap">
                                {row.name}
                            </td>
                            <td className="whitespace-normal py-4">
                                {row.medical_conditions
                                    ? row.medical_conditions
                                          .split(",")
                                          .map((condition, idx) => (
                                              <div key={idx}>
                                                  {condition.trim()}
                                              </div>
                                          ))
                                    : ""}
                            </td>
                            <td className="whitespace-normal py-4">
                                {row.medications
                                    ? row.medications
                                          .split(",")
                                          .map((medication, idx) => (
                                              <div key={idx}>
                                                  {medication.trim()}
                                              </div>
                                          ))
                                    : ""}
                            </td>

                            <td className="whitespace-nowrap">
                                {row.guardian_name}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.relationship}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.emergency_contact}
                            </td>
                            <td
                                className={`text-left pl-8 ${getStatusColor(row.status)}`}
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
            <UndoModal
                isOpen={showUndoModal}
                onClose={() => setShowUndoModal(false)}
                onConfirm={handleUndo}
            />
        </div>
    )
}

export default HealthRecordsTable
