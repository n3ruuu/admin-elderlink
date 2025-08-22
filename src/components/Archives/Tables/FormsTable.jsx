import { useState, useEffect } from "react"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal"
import SuccessModal from "../SuccessModal" // ✅ Import SuccessModal
import moment from "moment"
import axios from "axios"

const FormsTable = () => {
    const [forms, setForms] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFormId, setSelectedFormId] = useState(null)
    const [categories, setCategories] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formToDelete, setFormToDelete] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    // ✅ Success modal states
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false)
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("")

    const itemsPerPage = 8
    const totalPages = Math.ceil(forms.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedForms = forms
        .filter((form) => form.status === "Archived")
        .slice(startIndex, startIndex + itemsPerPage)

    useEffect(() => {
        fetchCategories()
        fetchForms()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/forms/initiatives")
            setCategories(response.data)
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const fetchForms = async () => {
        try {
            const response = await fetch("http://localhost:5000/forms")
            const data = await response.json()
            setForms(data)
        } catch (error) {
            console.error("Error fetching forms:", error)
        }
    }

    const getCategoryIcon = (categoryName) => {
        const category = categories.find((c) => c.category_name === categoryName)
        return category ? `http://localhost:5000${category.icon_path}` : "/path/to/default-icon.svg"
    }

    const handleUndoClick = (form) => {
        setSelectedFormId(form.id)
        setIsModalOpen(true)
    }

    // ✅ Handle Undo with SuccessModal
    const handleUndoConfirm = async () => {
        const formToUpdate = forms.find((form) => form.id === selectedFormId)
        const newStatus = formToUpdate.status === "Archived" ? "Active" : "Archived"

        try {
            const response = await fetch(`http://localhost:5000/forms/archive/${selectedFormId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newStatus }),
            })

            if (response.ok) {
                setForms((prevForms) =>
                    prevForms.map((form) => (form.id === selectedFormId ? { ...form, status: newStatus } : form)),
                )

                // ✅ Show success modal instead of alert
                setSuccessMessage("Form has been successfully restored.")
                setShowSuccessModal(true)

                setIsModalOpen(false)
            }
        } catch (error) {
            console.error("Error undoing action:", error)
        }
    }

    const handleDeleteClick = (form) => {
        setFormToDelete(form)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:5000/forms/${formToDelete.id}`, {
                method: "DELETE",
            })
            if (response.ok) {
                setForms((prevForms) => prevForms.filter((f) => f.id !== formToDelete.id))
                setShowDeleteModal(false)

                // ✅ Show delete success modal
                setDeleteSuccessMessage("Form deleted successfully.")
                setShowDeleteSuccessModal(true)
            }
        } catch (error) {
            console.error("Error deleting form:", error)
        }
    }

    const handleCloseModal = () => setShowDeleteModal(false)
    const handleModalClose = () => setIsModalOpen(false)
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    return (
        <div className="max-h-[650px] mx-16 overflow-y-auto rounded-xl shadow-xl border">
            <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <thead className="bg-[#219EBC] opacity-90 text-white text-left border-b border-[#e0e0e0]">
                    <tr>
                        <th className="font-[500] w-[40%] px-4 py-4 border-x border-gray-200">Form Title</th>
                        <th className="font-[500] w-[30%] px-4 py-4 border-x border-gray-200">Date Created</th>
                        <th className="font-[500] w-[30%] px-4 py-4 border-x border-gray-200">Category</th>
                        <th className="font-[500] w-[10%] px-4 py-4 border-x border-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedForms.map((form, index) => (
                        <tr
                            key={form.id}
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                        >
                            <td className="px-4 py-2 flex items-center gap-4 border-x border-gray-200">
                                <img
                                    src={getCategoryIcon(form.category)}
                                    alt={form.category}
                                    className="h-12 w-12 object-contain"
                                />
                                <span>{form.title}</span>
                            </td>
                            <td className="px-4 py-2 border-x border-gray-200">
                                {moment(form.createdAt).format("MMMM D, YYYY")}
                            </td>
                            <td className="px-4 py-2 border-x border-gray-200">{form.category}</td>
                            <td className="px-4 py-2 flex border-x border-gray-200">
                                <button
                                    onClick={() => handleUndoClick(form)}
                                    className="cursor-pointer w-8 h-8 flex justify-center items-center"
                                >
                                    <img src={UndoIcon} alt="Undo Icon" className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(form)}
                                    className="cursor-pointer w-8 h-8 flex justify-center items-center"
                                >
                                    <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex fixed bottom-5 mt-4">
                {/* Pagination controls */}
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 ${currentPage === index + 1 ? "bg-[#219EBC] text-white" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md mx-1`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modals */}
            <UndoModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleUndoConfirm} />
            <DeleteModal isOpen={showDeleteModal} onClose={handleCloseModal} onConfirm={handleDeleteConfirm} />

            {/* ✅ Success Modals */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />
            <SuccessModal
                isOpen={showDeleteSuccessModal}
                onClose={() => setShowDeleteSuccessModal(false)}
                message={deleteSuccessMessage}
            />
        </div>
    )
}

export default FormsTable
