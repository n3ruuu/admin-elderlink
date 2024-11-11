import { useState, useEffect } from "react"
import Header from "./Header"
import FormsCategories from "./FormsCategories"
import FormsContainer from "./FormsContainer"
import Table from "./Table" // Import Table component
import SuccessModal from "../common/SuccessModal"

const Forms = () => {
    const [formsData, setFormsData] = useState([]) // State to store forms data
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility
    const [modalTitle, setModalTitle] = useState("") // State for modal title
    const [modalMessage, setModalMessage] = useState("") // State for modal message

    useEffect(() => {
        fetchFormsData()
    }, [])

    // Fetch forms data from API on component mount
    const fetchFormsData = async () => {
        try {
            const response = await fetch("http://localhost:5000/forms")
            if (!response.ok) {
                throw new Error("Failed to fetch forms data")
            }
            const data = await response.json()
            setFormsData(data)
        } catch (error) {
            console.error("Error fetching forms data:", error)
        }
    }

    const handleCategoryClick = (category) => {
        setSelectedCategory(category)
    }

    const handleBackClick = () => {
        setSelectedCategory(null)
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("pdf", file)
        formData.append("title", file.name) // Use file name as the title
        formData.append("category", selectedCategory) // Assuming category is passed

        // Add current timestamp for createdAt
        const currentTimestamp = new Date().toISOString()
        formData.append("createdAt", currentTimestamp)

        try {
            const response = await fetch("http://localhost:5000/forms", {
                method: "POST",
                body: formData,
            })
            if (!response.ok) {
                throw new Error("Failed to upload file")
            }
            const data = await response.json()
            console.log("Form uploaded successfully:", data)
            fetchFormsData()

            // Show success modal
            setModalTitle("Upload Successful")
            setModalMessage("The form has been added successfully.")
            setIsModalOpen(true)
        } catch (error) {
            console.error("Error uploading file:", error)
        }
    }

    // Close modal handler
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    // Grouping forms by category
    const groupedForms = formsData.reduce((acc, form) => {
        if (!acc[form.category]) {
            acc[form.category] = []
        }
        acc[form.category].push(form)
        return acc
    }, {})

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header
                selectedCategory={selectedCategory}
                onFileUpload={handleFileUpload}
            />

            {selectedCategory ? (
                <>
                    <div className="flex items-center mx-16 space-x-4">
                        <span
                            className="text-[#666666] font-medium cursor-pointer text-xl hover:text-[#219EBC] transition duration-200"
                            onClick={handleBackClick}
                        >
                            &lt; Back
                        </span>
                        <span className="text-2xl font-bold">
                            {selectedCategory}
                        </span>
                    </div>

                    {/* Display grouped forms by category */}
                    <FormsContainer
                        groupedForms={groupedForms}
                        selectedCategory={selectedCategory}
                        fetchFormsData={fetchFormsData}
                    />
                </>
            ) : (
                <>
                    {/* Display FormsCategories and Table when no category is selected */}
                    <FormsCategories
                        onCategoryClick={handleCategoryClick}
                        fetchFormsData={fetchFormsData}
                    />
                    <h3 className="font-bold px-16 py-4 text-xl">
                        Recent Forms
                    </h3>
                    <Table
                        formsData={formsData}
                        fetchFormsData={fetchFormsData}
                    />{" "}
                    {/* Pass formsData as prop */}
                </>
            )}

            {/* Success Modal */}
            <SuccessModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
                isArchiving={false} // Not archiving, so show only "Got it" button
            />
        </section>
    )
}

export default Forms
