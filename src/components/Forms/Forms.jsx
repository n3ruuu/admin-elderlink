import { useState, useEffect } from "react"
import Header from "./Header"
import FormsCategories from "./FormsCategories"
import FormsContainer from "./FormsContainer"
import axios from "axios"
import Table from "./Table"
import SuccessModal from "./SuccessModal"
import moment from "moment"
import AddFormModal from "./AddFormModal"

const Forms = () => {
    const [categories, setCategories] = useState([]) // State to store fetched categories
    const [formsData, setFormsData] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddFormModalOpen, setIsAddFormModalOpen] = useState(false)

    useEffect(() => {
        fetchFormsData()
        fetchCategories()
    }, [])

    // Fetch categories from backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/forms/initiatives")
            setCategories(response.data) // Set categories to state
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const fetchFormsData = async () => {
        try {
            const response = await fetch("http://localhost:5000/forms")
            if (!response.ok) throw new Error("Failed to fetch forms data")
            const data = await response.json()
            setFormsData(data)
        } catch (error) {
            console.error("Error fetching forms data:", error)
        }
    }

    // Called when a category is deleted in child, updates parent's categories
    const handleCategoryDelete = (id) => {
        setCategories((prev) => prev.filter((category) => category.id !== id))
        fetchFormsData()
    }

    const handleAddNewInitiative = async (newInitiative) => {
        console.log("Adding new initiative...")

        // Update state immediately to show the new initiative
        setCategories((prev) => [newInitiative, ...prev])

        // Close add modal and show success modal
        setIsAddFormModalOpen(false)
        setModalTitle("Initiative Added!")
        setModalMessage("The initiative has been successfully added.")
        setIsModalOpen(true)
        console.log("New initiative added and state updated.")

        // Then fetch latest categories from backend to keep data in sync
        try {
            await fetchCategories()
        } catch (error) {
            console.error("Error fetching updated categories:", error)
        }
    }

    const logAction = async (action) => {
        try {
            const response = await fetch("http://localhost:5000/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                }),
            })
            if (!response.ok) throw new Error("Failed to log action")
            console.log("Action logged successfully")
        } catch (error) {
            console.error("Error logging action:", error)
        }
    }

    const handleCategoryClick = (category) => setSelectedCategory(category)
    const handleBackClick = () => setSelectedCategory(null)

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("pdf", file)
        formData.append("title", file.name)
        formData.append("category", selectedCategory)
        formData.append("createdAt", new Date().toISOString())

        try {
            const response = await fetch("http://localhost:5000/forms", {
                method: "POST",
                body: formData,
            })
            if (!response.ok) throw new Error("Failed to upload file")
            const data = await response.json()
            console.log("Form uploaded successfully:", data)
            fetchFormsData()

            setModalTitle("Upload Successful")
            setModalMessage("The form has been added successfully.")
            setIsModalOpen(true)
            await logAction("New Form")
        } catch (error) {
            console.error("Error uploading file:", error)
        }
    }

    const handleSearchChange = (e) => setSearchQuery(e.target.value)

    const filteredFormsData = formsData.filter((form) => {
        const title = form.title || ""
        const category = form.category || ""
        return (
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    const handleAddFormClick = () => setIsAddFormModalOpen(true)
    const handleCloseAddFormModal = () => setIsAddFormModalOpen(false)

    const groupedForms = filteredFormsData.reduce((acc, form) => {
        if (!acc[form.category]) acc[form.category] = []
        acc[form.category].push(form)
        return acc
    }, {})

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header
                selectedCategory={selectedCategory}
                onFileUpload={handleFileUpload}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onAddFormClick={handleAddFormClick}
            />

            {selectedCategory ? (
                <>
                    <div className="flex items-center mx-16 space-x-6 py-4">
                        {/* Back Button */}
                        <button
                            onClick={handleBackClick}
                            className="flex items-center gap-2 text-white bg-[#219EBC] hover:bg-[#1b8ca3] font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all"
                        >
                            {/* Left Arrow Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>

                        {/* Category Title */}
                        <h2 className="text-3xl font-extrabold text-gray-800">{selectedCategory}</h2>
                    </div>

                    <FormsContainer
                        groupedForms={groupedForms}
                        selectedCategory={selectedCategory}
                        fetchFormsData={fetchFormsData}
                        logAction={logAction}
                    />
                </>
            ) : (
                <>
                    <FormsCategories
                        categories={categories}
                        onCategoryClick={handleCategoryClick}
                        onCategoryDelete={handleCategoryDelete}
                    />
                    <h3 className="font-bold px-16 py-4 text-xl">Recent Forms</h3>
                    <Table formsData={filteredFormsData} fetchFormsData={fetchFormsData} logAction={logAction} />
                </>
            )}

            <SuccessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                message={modalMessage}
                isArchiving={false}
            />

            <AddFormModal
                isOpen={isAddFormModalOpen}
                onClose={handleCloseAddFormModal}
                onAddNewInitiative={handleAddNewInitiative}
            />
        </section>
    )
}

export default Forms
