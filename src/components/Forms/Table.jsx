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
import { useNavigate } from "react-router-dom" // Import useNavigate
import moment from "moment"

const Table = ({ formsData, fetchFormsData, logAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false) // For archive modal visibility
    const [selectedForm, setSelectedForm] = useState(null) // Track the selected form
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // Success modal visibility
    const [modalTitle, setModalTitle] = useState("") // Success modal title
    const [modalMessage, setModalMessage] = useState("") // Success modal message

    const navigate = useNavigate() // Initialize useNavigate hook

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

    const handleGoToArchives = () => {
        // Navigate to the Archives page
        navigate("/admin-elderlink/archives")
    }

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedForm(null)
    }

    const handleArchiveConfirm = async () => {
        if (!selectedForm) return

        // Toggle the new status based on current form's status
        const newStatus =
            selectedForm.status === "Archived" ? "Active" : "Archived"

        try {
            // Send PUT request to archive the form with the new status
            const response = await axios.put(
                `http://localhost:5000/forms/archive/${selectedForm.id}`,
                { newStatus }, // Send the new status in the request body
            )
            console.log(response.data.message) // Log success message

            // Close the modal after confirming
            closeModal()

            // Show success modal
            setModalTitle("Form Archived")
            setModalMessage("The form has been successfully archived.")
            setIsSuccessModalOpen(true)

            await logAction("Archive Form")

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
        <div className="overflow-x-auto max-w-full mx-16 shadow-xl">
            <table className="w-full bg-[#FFFFFF] shadow-xl rounded-xl">
                <thead className="font-[100] text-left border-b border-[#e0e0e0]">
                    <tr className="text-[#767171CC]">
                        <th className="font-[500] w-[40%] px-8 py-4">
                            Form Title
                        </th>
                        <th className="font-[500] w-[30%]  px-4 py-4">
                            Date Created
                        </th>
                        <th className="font-[500] w-[30%]  px-4 py-4">
                            Category
                        </th>
                        <th className="font-[500] w-[10%]  px-4 py-4">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {activeForms.map((form, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
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
                                {moment(form.createdAt).format("MMMM D, YYYY")}
                            </td>

                            <td className="px-4 w-[20%] py-2">
                                {form.category}
                            </td>
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
                onGoToArchives={handleGoToArchives}
                isArchiving={true}
            />
        </div>
    )
}

export default Table
