/* eslint-disable react/prop-types */
import { useState } from "react"
import moment from "moment"
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ArchiveModal from "./ArchiveModal"
import axios from "axios"
import SuccessModal from "./SuccessModal"

const FormsContainer = ({ groupedForms, selectedCategory, fetchFormsData, logAction }) => {
    const [activeFormId, setActiveFormId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formTitle, setFormTitle] = useState("")
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editableTitle, setEditableTitle] = useState("")

    const handleArchiveClick = (formId, formTitle) => {
        setActiveFormId(formId)
        setFormTitle(formTitle)
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setActiveFormId(null)
        setFormTitle("")
    }

    const handleEditClick = (formId, title) => {
        setEditableTitle(title)
        setIsEditing(true)
        setActiveFormId(formId)
    }

    const handleTitleChange = async (e) => {
        if (e.key === "Enter") {
            try {
                await axios.put(`http://localhost:5000/forms/update-title/${activeFormId}`, {
                    newTitle: editableTitle,
                })
                setIsEditing(false)
                fetchFormsData()
                await logAction(`Update Form`)
            } catch (error) {
                console.error("Error updating title:", error.response?.data?.error || error.message)
            }
        }
    }

    const handleArchiveConfirm = async () => {
        try {
            await axios.put(`http://localhost:5000/forms/archive/${activeFormId}`, {
                newStatus: "Archived",
            })
            handleModalClose()
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
        <div className="py-4 px-8 md:px-16 min-h-screen overflow-x-hidden">
            {/* Fixed height scrollable container */}
            <div className="max-h-[600px] overflow-y-auto overflow-x-hidden">
                <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-fr">
                    {groupedForms[selectedCategory]
                        ?.filter((form) => form.status === "Active")
                        .map((form) => (
                            <div
                                key={form.id}
                                className="bg-white rounded-xl shadow-lg p-4 hover:scale-105 transform transition-all relative flex flex-col "
                            >
                                {/* PDF Preview */}
                                <div className="w-full h-44 bg-gray-100 mb-4 rounded-lg overflow-hidden relative">
                                    <object
                                        data={`http://localhost:5000/${form.pdfLink}`}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                        className="rounded-lg"
                                    >
                                        <p className="text-center text-gray-500 mt-20">PDF preview not supported</p>
                                    </object>
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-20 rounded-lg"></div>
                                </div>

                                {/* Form Title */}
                                {isEditing && activeFormId === form.id ? (
                                    <input
                                        type="text"
                                        value={editableTitle}
                                        onChange={(e) => setEditableTitle(e.target.value)}
                                        onKeyDown={handleTitleChange}
                                        className="text-lg font-bold border-b-2 border-blue-400 focus:outline-none w-full mb-2 py-1 px-2 rounded"
                                    />
                                ) : (
                                    <h3 className="text-lg font-bold mb-2 text-gray-800 truncate">{form.title}</h3>
                                )}

                                {/* Date */}
                                <p className="text-sm text-gray-500 mb-4">
                                    Created: {moment(form.createdAt).format("MMM D, YYYY, h:mm A")}
                                </p>

                                {/* Open Form Link */}
                                <a
                                    href={`http://localhost:5000/${form.pdfLink}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white bg-[#219EBC] hover:bg-[#1b8ca3] font-semibold py-1 px-3 rounded inline-block mb-4 text-center transition-colors"
                                >
                                    Open Form
                                </a>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-4 mt-auto">
                                    <img
                                        src={EditIcon}
                                        alt="Edit"
                                        onClick={() => handleEditClick(form.id, form.title)}
                                        className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform"
                                    />
                                    <img
                                        src={ArchiveIcon}
                                        alt="Archive"
                                        onClick={() => handleArchiveClick(form.id, form.title)}
                                        className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform"
                                    />
                                </div>
                            </div>
                        ))}
                </div>
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
                onGoToArchives={() => console.log("Navigate to archives page")}
            />
        </div>
    )
}

export default FormsContainer
