/* eslint-disable react/prop-types */
import { useState } from "react"
import SuccessModal from "./SuccessModal" // Import SuccessModal
import axios from "axios"

const AddFormModal = ({ isOpen, onClose }) => {
    const [categoryName, setCategoryName] = useState("") // Category name state
    const [icon, setIcon] = useState(null) // State to store the selected image
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // State for SuccessModal
    const [successModalMessage, setSuccessModalMessage] = useState("") // Success message state
    const [successModalTitle, setSuccessModalTitle] = useState("") // Success title state

    const handleIconChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setIcon(URL.createObjectURL(file)) // Create a URL for the image preview
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("category_name", categoryName)
        if (icon) {
            const fileInput = document.getElementById("formIcon")
            formData.append("icon", fileInput.files[0])
        }

        try {
            const response = await axios.post("http://localhost:5000/forms/initiatives", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            console.log(response.data)
            onClose() // Close modal on success
            setSuccessModalTitle("Initiative Added!")
            setSuccessModalMessage("Initiative has been successfully added.")
            setIsSuccessModalOpen(true) // Open the success modal
            console.log("Success modal state updated:", isSuccessModalOpen) // Debugging log
        } catch (error) {
            console.error("Error saving form:", error)
        }
    }

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold">Add New Category</h2>
                    <form className="mt-4">
                        <div className="mb-4">
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="categoryName"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="formIcon" className="block text-sm font-medium text-gray-700">
                                Icon
                            </label>
                            <input
                                type="file"
                                id="formIcon"
                                accept="image/*"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                                onChange={handleIconChange}
                            />
                            {icon && (
                                <div className="mt-2">
                                    <img
                                        src={icon}
                                        alt="Icon preview"
                                        className="w-20 h-20 object-contain rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" className="text-gray-700 hover:text-gray-500" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                {/* Success Modal moved here */}
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={successModalTitle}
                    message={successModalMessage}
                    onGoToArchives={() => console.log("Navigating to Archives")} // Implement this function if needed
                    isArchiving={false} // Adjust based on your use case
                />
            </div>
        )
    )
}

export default AddFormModal
