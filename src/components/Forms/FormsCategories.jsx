/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import axios from "axios"
import ArchiveIcon from "../../assets/icons/archive2.svg" // Import Archive Icon
import ArchiveModal from "./ArchiveModal" // Import ArchiveModal
import SuccessModal from "./SuccessModal" // Import SuccessModal

const FormsCategories = ({ onCategoryClick }) => {
    const [categories, setCategories] = useState([]) // State to store fetched categories
    const [isModalOpen, setIsModalOpen] = useState(false) // State to control modal visibility
    const [selectedInitiative, setSelectedInitiative] = useState(null) // Store the selected article for archiving
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // State for SuccessModal
    const [successModalMessage, setSuccessModalMessage] = useState("") // Success message state
    const [successModalTitle, setSuccessModalTitle] = useState("") // Success title state

    useEffect(() => {
        // Fetch categories from backend when component mounts
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/forms/initiatives")
                setCategories(response.data) // Set categories to state
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }

        fetchCategories() // Call function to fetch categories
    }, []) // Empty dependency array ensures the fetch happens once when the component mounts

    const handleArchiveClick = (category) => {
        console.log("Selected category:", category)
        setSelectedInitiative(category) // Pass the entire category object, which includes the ID and name
        setIsModalOpen(true) // Open the modal
    }

    const handleArchiveConfirm = async () => {
        try {
            // Send DELETE request to the backend to delete the category
            await axios.delete(`http://localhost:5000/forms/initiatives/${selectedInitiative.id}`) // Assuming selectedInitiative contains the category ID

            console.log(`${selectedInitiative.category_name} has been deleted.`)
            // After deletion, fetch the updated categories
            const updatedCategories = categories.filter((category) => category.id !== selectedInitiative.id)
            setCategories(updatedCategories) // Update the state with the new list of categories

            setIsModalOpen(false) // Close the modal after confirming
        } catch (error) {
            console.error("Error deleting category:", error)
            alert("Failed to delete the category.")
        }
        setSuccessModalTitle("Initiative Deleted!")
        setSuccessModalMessage("The initiative has been successfully deleted.")
        setIsSuccessModalOpen(true) // Open the success modal
    }

    return (
        <div className="flex flex-wrap px-16 w-full gap-x-6 gap-y-4 font-[500]">
            {categories.map((category, index) => (
                <button
                    key={index}
                    onClick={() => onCategoryClick(category.category_name)} // Use dynamic category name
                    className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px] hover:bg-[#F0F0F0] transition-colors duration-300"
                >
                    <img
                        src={`http://localhost:5000${category.icon_path}`}
                        alt={`${category.category_name} Icon`}
                        className="mr-4 w-16 h-16 rounded-[50%] " // Add margin to separate the icon
                    />
                    <p className="flex items-center w-[80%] justify-between">
                        {category.category_name}
                        <img
                            src={ArchiveIcon}
                            alt="Archive Icon"
                            className=" w-5 h-5 mr-4 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation() // Prevent the button's click from being triggered
                                handleArchiveClick(category) // Open the modal on click
                            }}
                        />
                    </p>
                </button>
            ))}

            {/* Archive Modal */}
            <ArchiveModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close modal
                onConfirm={handleArchiveConfirm} // Archive the item
                article={selectedInitiative?.category_name} // Pass only the category name to the modal
            />

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
}

export default FormsCategories
