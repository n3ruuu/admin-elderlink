import { useState, useEffect } from "react"
import UndoModal from "../UndoModal" // Assuming UndoModal is in the same folder
import OscaIcon from "../../../assets/osca.png"
import BarangayIcon from "../../../assets/barangay.png"
import ProvincialIcon from "../../../assets/provincial.png"
import CityIcon from "../../../assets/city.png"

const FormsTable = () => {
    const [forms, setForms] = useState([]) // State to hold fetched forms data
    const [isModalOpen, setIsModalOpen] = useState(false) // Modal visibility state
    const [selectedFormId, setSelectedFormId] = useState(null) // Store selected form ID for undo

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Provincial Initiatives":
                return ProvincialIcon
            case "OSCA Initiatives":
                return OscaIcon
            case "Barangay Initiatives":
                return BarangayIcon
            case "City Initiatives":
                return CityIcon
            default:
                return null
        }
    }

    // Fetch data from the API
    const fetchForms = async () => {
        try {
            const response = await fetch("http://localhost:5000/forms")
            const data = await response.json()
            console.log(data) // Log the full response to see the data structure

            // Set all fetched forms
            setForms(data)
        } catch (error) {
            console.error("Error fetching Forms:", error)
        }
    }

    useEffect(() => {
        fetchForms()
    }, [])

    const handleUndoClick = (id) => {
        setSelectedFormId(id) // Set the ID of the form to be undone
        setIsModalOpen(true) // Open the UndoModal
    }

    const handleUndoConfirm = async () => {
        console.log("Undoing action for form ID:", selectedFormId)

        // Get the current status of the form and toggle it
        const newStatus =
            selectedFormId.status === "Archived" ? "Active" : "Archived"

        try {
            // Send a PUT request to update the status of the form (either archive or undo)
            const response = await fetch(
                `http://localhost:5000/forms/archive/${selectedFormId.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ newStatus }), // Send the new status in the request body
                },
            )

            if (response.ok) {
                // Update the local state to reflect the status change (archive or undo)
                setForms((prevForms) =>
                    prevForms.map((form) =>
                        form.id === selectedFormId
                            ? {
                                  ...form,
                                  status: newStatus, // Update status to the new value
                              }
                            : form,
                    ),
                )
                console.log("Form status updated.")
                setIsModalOpen(false) // Close the modal after confirming the action
                fetchForms()
            } else {
                console.error("Failed to update form status")
            }
        } catch (error) {
            console.error("Error undoing action:", error)
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false) // Close the modal when Cancel is clicked
    }

    // Separate active forms for rendering
    const archivedForms = forms.filter((form) => form.status === "Archived")

    return (
        <div className="mt-8 w-full mx-auto px-4">
            {/* Scrollable container with a fixed height */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] mx-16">
                <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                    <thead className="text-[#767171CC]">
                        <tr className="text-[#767171CC] text-left">
                            <th className="font-[500] w-[40%] px-8 py-4">
                                Form Title
                            </th>
                            <th className="font-[500] w-[30%] px-4 py-4">
                                Date Created
                            </th>
                            <th className="font-[500] w-[30%] px-4 py-4">
                                Category
                            </th>
                            <th className="font-[500] w-[10%] px-4 py-4">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {archivedForms.map((form, index) => (
                            <tr
                                className={`text-[#333333] font-[500] ${
                                    index % 2 === 0
                                        ? "bg-white"
                                        : "bg-[#F5F5FA]"
                                }`}
                                key={form.id}
                            >
                                <td className="px-4 w-[40%] py-2">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getCategoryIcon(form.category)}
                                            alt={form.category}
                                            className="h-12 w-12 object-contain"
                                        />
                                        <span>{form.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 w-[30%] py-2">
                                    {new Date(form.createdAt).toLocaleString()}
                                </td>
                                <td className="px-4 w-[20%] py-2">
                                    {form.category}
                                </td>
                                <td
                                    className="px-8 py-4 flex gap-2 text-[#219EBC] font-semibold underline cursor-pointer"
                                    onClick={() => handleUndoClick(form)}
                                >
                                    Undo
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Undo Modal */}
            <UndoModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleUndoConfirm}
            />
        </div>
    )
}

export default FormsTable
