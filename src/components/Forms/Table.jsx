/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import axios from "axios" // Import axios for API requests

import ArchiveIcon from "../../assets/icons/archive2.svg" // Import Archive Icon
import ArchiveModal from "./ArchiveModal" // Import your ArchiveModal
import SuccessModal from "./SuccessModal" // Import your SuccessModal
import { useNavigate } from "react-router-dom" // Import useNavigate
import moment from "moment"

const Table = ({ formsData, fetchFormsData, logAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false) // For archive modal visibility
    const [selectedForm, setSelectedForm] = useState(null) // Track the selected form
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // Success modal visibility
    const [modalTitle, setModalTitle] = useState("") // Success modal title
    const [modalMessage, setModalMessage] = useState("") // Success modal message

    const navigate = useNavigate() // Initialize useNavigate hook

    const [categories, setCategories] = useState([]) // To store categories and icon paths

    useEffect(() => {
        // Fetch categories with icon paths from the backend
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/forms/initiatives")
                setCategories(response.data) // Set categories to state
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }

        fetchCategories() // Call function to fetch categories
    }, []) // Empty dependency array ensures it runs only once on mount

    // Find category icon path by category name
    const getCategoryIcon = (categoryName) => {
        const category = categories.find((c) => c.category_name === categoryName)
        return category ? `http://localhost:5000${category.icon_path}` : "/path/to/default-icon.svg" // Fallback to default icon if not found
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
        const newStatus = selectedForm.status === "Archived" ? "Active" : "Archived"

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
            console.error("Error archiving form:", error.response?.data?.error || error.message)
        }
    }

    // Filter forms with status "Active"
    const activeForms = formsData.filter((form) => form.status === "Active")

    return (
        <div className="max-h-[450px] mx-16 overflow-y-auto rounded-xl shadow-xl">
            <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <thead className="bg-[#219EBC] opacity-80 text-white text-left border-b border-[#e0e0e0]">
                    <tr>
                        <th className="font-[500] w-[40%] px-8 py-4 first:rounded-tl-xl last:rounded-tr-none">
                            Form Title
                        </th>
                        <th className="font-[500] w-[30%] px-4 py-4">Date Created</th>
                        <th className="font-[500] w-[20%] px-4 py-4">Category</th>
                        <th className="font-[500] w-[10%] px-4 py-4 last:rounded-tr-xl">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activeForms.map((form, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            } ${index === activeForms.length - 1}`}
                            key={form.id}
                        >
                            <td className="px-4 w-[40%] py-2 first:rounded-bl-xl">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={getCategoryIcon(form.category)}
                                        alt={form.category}
                                        className="h-12 w-12 object-contain"
                                    />
                                    <span>{form.title}</span>
                                </div>
                            </td>
                            <td className="px-4 w-[30%] py-2">{moment(form.createdAt).format("MMMM D, YYYY")}</td>
                            <td className="px-4 w-[20%] py-2">{form.category}</td>
                            <td className="px-4 py-2 text-right pr-8">
                                <button onClick={() => handleArchiveClick(form)}>
                                    <img src={ArchiveIcon} alt="Archive" className="h-5 w-5" />
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
