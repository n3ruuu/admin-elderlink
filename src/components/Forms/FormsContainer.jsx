/* eslint-disable react/prop-types */
import { useState } from "react"
import moment from "moment"
import EditIcon from "../../assets/icons/edit.svg" // Import the archive icon
import ArchiveIcon from "../../assets/icons/archive2.svg" // Import the archive icon
import ArchiveModal from "./ArchiveModal" // Import the ArchiveModal component
import axios from "axios" // Import axios for making API requests
import SuccessModal from "./SuccessModal"

const FormsContainer = ({ groupedForms, selectedCategory, fetchFormsData, logAction }) => {
    const [activeFormId, setActiveFormId] = useState(null) // Track the active form
    const [isModalOpen, setIsModalOpen] = useState(false) // Modal visibility state
    const [formTitle, setFormTitle] = useState("") // Store form title to display in modal
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("") // Success modal title
    const [modalMessage, setModalMessage] = useState("") // Success modal message
    const [isEditing, setIsEditing] = useState(false)
    const [editableTitle, setEditableTitle] = useState("") // Editable form title

    const handleArchiveClick = (formId, formTitle) => {
        setActiveFormId(formId) // Set the active form ID
        setFormTitle(formTitle) // Store the title for display in modal
        setIsModalOpen(true) // Open the modal
    }

    const handleModalClose = () => {
        setIsModalOpen(false) // Close the modal
        setActiveFormId(null) // Reset the active form ID
        setFormTitle("") // Reset the title
    }

    const handleEditClick = (formId, title) => {
        setEditableTitle(title) // Set the title to be editable
        setIsEditing(true) // Set editing mode to true
        setActiveFormId(formId)
    }

    const handleTitleChange = async (e) => {
        console.log(activeFormId)

        if (e.key === "Enter") {
            // Call the API to update the title
            try {
                const response = await axios.put(
                    `http://localhost:5000/forms/update-title/${activeFormId}`,
                    { newTitle: editableTitle }, // Send the new title in the request body
                )
                console.log(response.data.message) // Log success message
                // Optionally, update the UI after the successful update
                setIsEditing(false) // Exit editing mode
                fetchFormsData()
                await logAction(`Update Form`)
            } catch (error) {
                console.error("Error updating title:", error.response?.data?.error || error.message)
            }
        }
    }

    const handleArchiveConfirm = async () => {
        console.log(activeFormId)
        try {
            // Send PUT request to archive the form
            const response = await axios.put(
                `http://localhost:5000/forms/archive/${activeFormId}`,
                { newStatus: "Archived" }, // Match the backend's expected key
            )
            console.log(response.data.message) // Log success message
            // Close the modal after confirming
            handleModalClose()

            // Show success modal
            setModalTitle("Form Archived")
            setModalMessage("The form has been successfully archived.")
            setIsSuccessModalOpen(true)
            await logAction("Archive Form")
            fetchFormsData()
        } catch (error) {
            console.error("Error archiving form:", error.response?.data?.error || error.message)
        }
    }

    return (
        <div className="py-8 px-16">
            {/* Display only selected category forms with status 'Active' */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {groupedForms[selectedCategory]
                    ?.filter((form) => form.status === "Active") // Filter for 'Active' status
                    .map((form) => (
                        <div
                            key={form.id}
                            className="bg-white rounded-lg shadow-md p-6 hover:scale-105 transform transition-all relative"
                        >
                            <div>
                                {/* Use an object tag to display a thumbnail preview */}
                                <div className="w-full h-32 bg-gray-300 mb-4 rounded-lg">
                                    <object
                                        data={`http://localhost:5000/${form.pdfLink}`}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                    >
                                        <p>Your browser does not support PDF preview.</p>
                                    </object>
                                </div>
                                <div className="flex items-center justify-between">
                                    {/* Editable form title */}
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editableTitle}
                                            onChange={(e) => setEditableTitle(e.target.value)}
                                            onKeyDown={handleTitleChange}
                                            className="text-lg font-semibold w-full border-b-2 border-gray-400 focus:outline-none"
                                        />
                                    ) : (
                                        <h3 className="text-lg font-semibold">
                                            {formTitle || form.title} {/* Display form title or current form title */}
                                        </h3>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Date Created: {moment(form.createdAt).format("MMMM D, YYYY, h:mm A")}
                                </p>
                            </div>
                            <a
                                href={`http://localhost:5000/${form.pdfLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#219EBC] font-semibold mt-2 hover:underline inline-block"
                            >
                                Open Form
                            </a>

                            <img
                                src={EditIcon}
                                alt="Edit"
                                onClick={() => handleEditClick(form.id, form.title)}
                                className="absolute bottom-6 right-16 w-6 h-6 cursor-pointer transition-transform hover:scale-110"
                            />

                            {/* Archive icon in the bottom right corner */}
                            <img
                                src={ArchiveIcon}
                                alt="Archive"
                                onClick={() => handleArchiveClick(form.id, form.title)}
                                className="absolute bottom-6 right-8 w-6 h-6 cursor-pointer transition-transform hover:scale-110"
                            />
                        </div>
                    ))}
            </div>

            {/* Archive Modal */}
            <ArchiveModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleArchiveConfirm}
                article={formTitle}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={modalTitle}
                message={modalMessage}
                isArchiving={true}
                onGoToArchives={() => {
                    // Implement navigation to archives page if needed
                    console.log("Navigate to archives page")
                }}
            />
        </div>
    )
}

export default FormsContainer
