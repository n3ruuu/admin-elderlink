/* eslint-disable react/prop-types */
import { useState } from "react"
import axios from "axios"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ArchiveModal from "./ArchiveModal"
import SuccessModal from "./SuccessModal"

const FormsCategories = ({ categories, onCategoryClick, onCategoryDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedInitiative, setSelectedInitiative] = useState(null)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successModalMessage, setSuccessModalMessage] = useState("")
    const [successModalTitle, setSuccessModalTitle] = useState("")

    const handleArchiveClick = (category) => {
        setSelectedInitiative(category)
        setIsModalOpen(true)
    }

    const handleArchiveConfirm = async () => {
        try {
            await axios.delete(`http://localhost:5000/forms/initiatives/${selectedInitiative.id}`)
            onCategoryDelete(selectedInitiative.id)
            setIsModalOpen(false)
            setSuccessModalTitle("Initiative Deleted!")
            setSuccessModalMessage(
                `The initiative "${selectedInitiative.category_name}" and all its forms have been successfully deleted.`,
            )
            setIsSuccessModalOpen(true)
        } catch (error) {
            console.error("Error deleting category and its forms:", error)
            alert("Failed to delete the initiative and its forms.")
        }
    }

    return (
        <div className="px-16 font-[500]">
            {/* Scrollable container */}
            <div
                className="flex flex-wrap gap-x-6 gap-y-4"
                style={{
                    maxHeight: "270px", // height for 6 items
                    overflowY: categories.length > 6 ? "auto" : "visible", // scroll if >6
                }}
            >
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => onCategoryClick(category.category_name)}
                        className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px] hover:bg-[#F0F0F0] transition-colors duration-300"
                    >
                        <img
                            src={`http://localhost:5000${category.icon_path}`}
                            alt={`${category.category_name} Icon`}
                            className="mr-4 w-16 h-16 rounded-[50%]"
                        />
                        <p className="flex items-center w-[80%] justify-between">
                            {category.category_name}
                            <img
                                src={ArchiveIcon}
                                alt="Archive Icon"
                                className="w-5 h-5 mr-4 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleArchiveClick(category)
                                }}
                            />
                        </p>
                    </button>
                ))}
            </div>

            <ArchiveModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleArchiveConfirm}
                article={selectedInitiative?.category_name}
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={successModalTitle}
                message={successModalMessage}
                onGoToArchives={() => console.log("Navigating to Archives")}
                isArchiving={false}
            />
        </div>
    )
}

export default FormsCategories
