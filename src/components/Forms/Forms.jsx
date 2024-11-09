import { useState, useEffect } from "react"
import Header from "./Header"
import FormsCategories from "./FormsCategories"
import FormsContainer from "./FormsContainer"

const Forms = () => {
    const [formsData, setFormsData] = useState([]) // State to store forms data
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
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

        fetchFormsData()
    }, [])

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
        } catch (error) {
            console.error("Error uploading file:", error)
        }
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
                    />
                </>
            ) : (
                <FormsCategories onCategoryClick={handleCategoryClick} />
            )}
        </section>
    )
}

export default Forms
