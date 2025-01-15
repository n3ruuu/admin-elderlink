import { useState, useEffect } from "react";
import UndoModal from "../UndoModal";
import UndoIcon from "../../../assets/icons/cancel.svg";
import DeleteIcon from "../../../assets/icons/archive.svg";
import DeleteModal from "../DeleteModal"; // Import the DeleteModal component
import moment from "moment";
import axios from "axios"; // Don't forget to import axios

const FormsTable = () => {
    const [forms, setForms] = useState([]); // State to hold fetched forms data
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [selectedFormId, setSelectedFormId] = useState(null); // Store selected form ID for undo
    const [categories, setCategories] = useState([]); // To store categories and icon paths
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to manage DeleteModal visibility
    const [formToDelete, setFormToDelete] = useState(null); // State to hold form ID for delete confirmation

    // Fetch categories with icon paths from the backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/forms/initiatives");
            setCategories(response.data); // Set categories to state
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Find category icon path by category name
    const getCategoryIcon = (categoryName) => {
        const category = categories.find((c) => c.category_name === categoryName);
        return category ? `http://localhost:5000${category.icon_path}` : "/path/to/default-icon.svg"; // Fallback to default icon if not found
    };

    // Fetch forms data
    const fetchForms = async () => {
        try {
            const response = await fetch("http://localhost:5000/forms");
            const data = await response.json();
            setForms(data); // Set forms to state
        } catch (error) {
            console.error("Error fetching Forms:", error);
        }
    };

    // Fetch data once the component mounts
    useEffect(() => {
        fetchCategories(); // Fetch categories on mount
        fetchForms(); // Fetch forms data
    }, []); // Empty dependency array ensures it runs only once on mount

    const handleUndoClick = (form) => {
        setSelectedFormId(form.id); // Set the ID of the form to be undone
        setIsModalOpen(true); // Open the UndoModal
    };

    const handleUndoConfirm = async () => {
        console.log("Undoing action for form ID:", selectedFormId);

        const formToUpdate = forms.find(form => form.id === selectedFormId);
        const newStatus = formToUpdate.status === "Archived" ? "Active" : "Archived";

        try {
            // Send a PUT request to update the status of the form (either archive or undo)
            const response = await fetch(
                `http://localhost:5000/forms/archive/${selectedFormId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ newStatus }), // Send the new status in the request body
                }
            );

            if (response.ok) {
                // Update the local state to reflect the status change (archive or undo)
                setForms(prevForms =>
                    prevForms.map(form =>
                        form.id === selectedFormId
                            ? { ...form, status: newStatus } // Update status to the new value
                            : form
                    )
                );
                alert("Form has been successfully restored.")
                setIsModalOpen(false); // Close the modal after confirming the action
                fetchForms(); // Refresh the forms list after the update
            } else {
                console.error("Failed to update form status");
            }
        } catch (error) {
            console.error("Error undoing action:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal when Cancel is clicked
    };

    const handleDeleteClick = (form) => {
        setFormToDelete(form); // Store the form to delete
        setShowDeleteModal(true); // Open the DeleteModal
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        try {
            // Send delete request to the backend
            const response = await fetch(`http://localhost:5000/forms/${formToDelete.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the deleted form from the state
                setForms(prevForms => prevForms.filter(form => form.id !== formToDelete.id));
                setShowDeleteModal(false); // Close the modal after confirming the delete
                alert("Form deleted successfully");
            } else {
                console.error("Failed to delete form");
            }
        } catch (error) {
            console.error("Error deleting form:", error);
        }
    };

    // Separate archived forms for rendering
    const archivedForms = forms.filter((form) => form.status === "Archived");

    // Handle delete modal close
    const handleCloseModal = () => {
        setShowDeleteModal(false); // Close the delete modal when Cancel is clicked
    };

    return (
        <div>
            <div className="rounded-xl max-h-[calc(90vh-200px)] mx-16">
                <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-xl">
                    <thead className="text-[#767171CC] border-b">
                        <tr className="text-[#767171CC] text-left">
                            <th className="font-[500] w-[40%] px-8 py-4">Form Title</th>
                            <th className="font-[500] w-[30%] px-4 py-4">Date Created</th>
                            <th className="font-[500] w-[30%] px-4 py-4">Category</th>
                            <th className="font-[500] w-[10%] px-4 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {archivedForms.map((form, index) => (
                            <tr
                                className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                                key={form.id}
                            >
                                <td className="px-4 w-[40%] py-2">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={getCategoryIcon(form.category)} // Get the correct icon dynamically
                                            alt={form.category}
                                            className="h-12 w-12 object-contain"
                                        />
                                        <span>{form.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 w-[30%] py-2">
                                    {moment(form.createdAt).format("MMMM D, YYYY")}
                                </td>
                                <td className="px-4 w-[20%] py-2">{form.category}</td>
                                <td className="pl-2 text-left flex gap-2 mt-3">
                                    <button onClick={() => handleUndoClick(form)} className="cursor-pointer w-8 h-8 flex justify-center items-center">
                                        <img src={UndoIcon} alt="Undo Icon" className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(form)} className="cursor-pointer w-8 h-8 flex justify-center items-center">
                                        <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
                                    </button>
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

            {/* Delete Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default FormsTable;
