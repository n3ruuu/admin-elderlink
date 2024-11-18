import { useState, useEffect } from "react"
import Header from "./Header"
import FormsCategories from "./FormsCategories"
import FormsContainer from "./FormsContainer"
import Table from "./Table" // Import Table component
import SuccessModal from "./SuccessModal"
import moment from "moment"

const Forms = () => {
    const [formsData, setFormsData] = useState([]) // State to store forms data
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility
    const [modalTitle, setModalTitle] = useState("") // State for modal title
    const [modalMessage, setModalMessage] = useState("") // State for modal message
    const [searchQuery, setSearchQuery] = useState("") // State for search query

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

    const logAction = async (action) => {
        try {
            const response = await fetch("http://localhost:5000/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"), // Current timestamp in ISO format
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to log action")
            }

            console.log("Action logged successfully")
        } catch (error) {
            console.error("Error logging action:", error)
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
            await logAction(`New Form`)
        } catch (error) {
            console.error("Error uploading file:", error)
        }
    }

    // Handle search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    // Filter formsData based on search query
    const filteredFormsData = formsData.filter((form) => {
        return (
            form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            form.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    // Close modal handler
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    // Grouping forms by category
    const groupedForms = filteredFormsData.reduce((acc, form) => {
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
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange} // Pass the search change handler
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
                        logAction={logAction}
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
                        formsData={filteredFormsData} // Pass filtered forms data to Table
                        fetchFormsData={fetchFormsData}
                    />
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
