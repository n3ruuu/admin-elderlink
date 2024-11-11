/* eslint-disable react/prop-types */
import { useState } from "react"
import axios from "axios" // Import axios for API requests
import OscaIcon from "../../assets/osca.png"
import BarangayIcon from "../../assets/barangay.png"
import ProvincialIcon from "../../assets/provincial.png"
import CityIcon from "../../assets/city.png"
import ArchiveIcon from "../../assets/icons/archive2.svg" // Import Archive Icon
import ArchiveModal from "./ArchiveModal" // Import your ArchiveModal
import SuccessModal from "../common/SuccessModal" // Import your SuccessModal

const Table = ({ formsData, fetchFormsData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false) // For archive modal visibility
    const [selectedForm, setSelectedForm] = useState(null) // Track the selected form
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // Success modal visibility
    const [modalTitle, setModalTitle] = useState("") // Success modal title
    const [modalMessage, setModalMessage] = useState("") // Success modal message

    // Helper function to get the appropriate icon based on category
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

    // Open the modal and set the selected form
    const handleArchiveClick = (form) => {
        setSelectedForm(form)
        setIsModalOpen(true)
    }

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedForm(null)
    }

    // Handle archiving form (send PUT request)
    const handleArchiveConfirm = async () => {
        if (!selectedForm) return

        try {
            // Send PUT request to archive the form
            const response = await axios.put(
                `http://localhost:5000/forms/archive/${selectedForm.id}`,
            )
            console.log(response.data.message) // Log success message

            // Close the modal after confirming
            closeModal()

            // Show success modal
            setModalTitle("Form Archived")
            setModalMessage("The form has been successfully archived.")
            setIsSuccessModalOpen(true)

            // Re-fetch forms data after archiving
            fetchFormsData()
        } catch (error) {
            console.error(
                "Error archiving form:",
                error.response?.data?.error || error.message,
            )
        }
    }

    // Filter forms with status "Active"
    const activeForms = formsData.filter((form) => form.status === "Active")

    return (
        <div className="overflow-x-auto max-w-full mx-16">
            {/* Table with rounded corners */}
            <table className="w-full bg-[#FFFFFF] shadow-xl rounded-tl-[12px] rounded-tr-[12px]">
                <thead className="font-[100] text-left border-b border-[#e0e0e0]">
                    <tr className="text-[#767171CC]">
                        <th className="font-[500] px-8 py-4">Form Title</th>
                        <th className="font-[500] px-4 py-4">Date Created</th>
                        <th className="font-[500] px-4 py-4">Category</th>
                    </tr>
                </thead>
            </table>

            {/* Scrollable tbody with fixed height */}
            <div className="overflow-y-auto max-h-[300px]">
                <table className="w-full bg-[#FFFFFF] rounded-bl-[12px] rounded-br-[12px] shadow-xl">
                    <tbody>
                        {activeForms.map((form, index) => (
                            <tr
                                className={`text-[#333333] font-[500] ${
                                    index % 2 === 0
                                        ? "bg-white"
                                        : "bg-[#F5F5FA]"
                                }`}
                                key={form.id}
                            >
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getCategoryIcon(form.category)}
                                            alt={form.category}
                                            className="h-12 w-12 object-contain"
                                        />
                                        <span>{form.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    {new Date(form.createdAt).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">{form.category}</td>
                                <td className="px-4 py-2 text-right pr-8">
                                    {/* Archive icon */}
                                    <button
                                        onClick={() => handleArchiveClick(form)}
                                    >
                                        <img
                                            src={ArchiveIcon} // Use Archive Icon
                                            alt="Archive"
                                            className="h-5 w-5"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Archive Modal */}
            {isModalOpen && selectedForm && (
                <ArchiveModal
                    isOpen={isModalOpen}
                    article={selectedForm.title} // Pass the correct property for article (e.g., title of the form)
                    onClose={closeModal}
                    onConfirm={handleArchiveConfirm}
                />
            )}

            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={modalTitle}
                message={modalMessage}
                isArchiving={true}
                onGoToArchives={() => {
                    console.log("Navigate to archives page")
                }}
            />
        </div>
    )
}

export default Table
