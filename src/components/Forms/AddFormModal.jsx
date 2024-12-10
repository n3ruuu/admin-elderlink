/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import SuccessModal from "./SuccessModal" // Import SuccessModal
import axios from "axios"
import moment from "moment"

const AddFormModal = ({ isOpen, onClose, onAddNewInitiative }) => {
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
        e.preventDefault() // Prevent default form submission behavior
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

            // Open the success modal with a success message
            setSuccessModalTitle("Initiative Added!")
            setSuccessModalMessage("Initiative has been successfully added.")
            setIsSuccessModalOpen(true) // Open the success modal
            // Add the new initiative to the list of initiatives (update parent component state)
            if (onAddNewInitiative) {
                onAddNewInitiative(response.data) // Passing the new initiative data to parent
            }

            // Do not close the AddFormModal immediately
            // Wait for the success modal to close before closing the form modal
        } catch (error) {
            console.error("Error saving form:", error)
        }
    }

    // Function to close the success modal and then the form modal
    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false) // Close the success modal first
        onClose() // Now close the AddFormModal after success modal closes
        window.location.reload() // Reload the page
    }

    // Reset success modal state when AddFormModal is closed
    useEffect(() => {
        if (!isOpen) {
            setIsSuccessModalOpen(false) // Reset success modal state when AddFormModal is closed
            setCategoryName("") // Clear the category name
            setIcon(null) // Clear the selected icon
        }
    }, [isOpen])

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
                        <div className="flex justify-between gap-4">
                            <button
                                type="button"
                                className="border w-[100px] h-[45px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#219EBC] text-white w-[100px] h-[45px] font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-[#1A7F92]"
                                onClick={handleSubmit}
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>

                {/* Success Modal moved here */}
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={closeSuccessModal} // Use the closeSuccessModal function to close the success modal
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
