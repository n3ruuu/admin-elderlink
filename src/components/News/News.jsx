import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import Header from "./Header"
import Table from "./Table"
import SuccessModal from "../common/SuccessModal"
import ArchiveModal from "./ArchiveModal" // Import ArchiveModal component
import moment from "moment"

const News = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentNews, setCurrentNews] = useState(null) // For adding or editing news
    const [newsData, setNewsData] = useState([]) // List of news articles
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [selectedNews, setSelectedNews] = useState(null) // News to be archived
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            const response = await axios.get("http://localhost:5000/news")
            setNewsData(response.data)
        } catch (error) {
            console.error("Error fetching news:", error)
            // Optionally, set an error message to show the user
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

    const filteredNews = newsData.filter((news) => {
        const headline = news?.headline?.toLowerCase() || "" // Ensure it's a string
        const author = news?.author?.toLowerCase() || "" // Ensure it's a string
        const body = news?.body?.toLowerCase() || "" // Ensure it's a string

        return (
            headline.includes(searchQuery.toLowerCase()) ||
            author.includes(searchQuery.toLowerCase()) ||
            body.includes(searchQuery.toLowerCase())
        )
    })

    const handleSaveNews = async (updatedNews) => {
        try {
            if (updatedNews.id) {
                // Editing existing news
                setNewsData(newsData.map((news) => (news.id === updatedNews.id ? updatedNews : news)))
                setModalTitle("News Updated!")
                setModalMessage("The news has been successfully updated.")
                await logAction(`Update News`)
            } else {
                // Adding new news
                setNewsData([updatedNews, ...newsData])
                setModalTitle("News Published!")
                setModalMessage("The news has been successfully published.")
                await logAction(`Publish News`)
            }
            setSuccessModalOpen(true) // Open the success modal
            fetchNews()
        } catch (error) {
            console.error("Error saving news:", error)
            setModalTitle("Error")
            setModalMessage("There was an issue saving the news.")
            setSuccessModalOpen(true) // Show error message
        }
    }

    const handleOpenModal = (news = null) => {
        setCurrentNews(news) // Set current news for editing or adding
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentNews(null)
    }

    const openArchiveModal = (news) => {
        setSelectedNews(news)
        setIsArchiveModalOpen(true)
    }

    const closeArchiveModal = () => {
        setIsArchiveModalOpen(false)
        setSelectedNews(null)
    }

    const handleArchiveConfirm = async () => {
        if (selectedNews) {
            try {
                // Update the status of the news to "Archived" in the backend
                await axios.put(`http://localhost:5000/news/archive/${selectedNews.id}`)
                setNewsData(
                    newsData.map((news) => (news.id === selectedNews.id ? { ...news, status: "Archived" } : news)),
                )
                setModalTitle("News Archived!")
                setModalMessage("The news has been successfully archived.")
                setSuccessModalOpen(true) // Show success modal
                closeArchiveModal() // Close archive modal
                await logAction(`Archive News`)
            } catch (error) {
                console.error("Error archiving news:", error)
                setModalTitle("Error")
                setModalMessage("There was an issue archiving the news.")
                setSuccessModalOpen(true) // Show error message
            }
        }
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header onOpenModal={handleOpenModal} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Table
                        newsData={filteredNews} // Use filtered data
                        handleOpenModal={handleOpenModal}
                        handleOpenArchiveModal={openArchiveModal}
                    />
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    onClose={handleCloseModal}
                    onSubmit={handleSaveNews}
                    news={currentNews} // Pass current news data
                />
            )}
            {isArchiveModalOpen && (
                <ArchiveModal
                    isOpen={isArchiveModalOpen}
                    onClose={closeArchiveModal}
                    onConfirm={handleArchiveConfirm}
                    article={selectedNews?.headline || ""}
                />
            )}
            {successModalOpen && (
                <SuccessModal
                    isOpen={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                    title={modalTitle}
                    message={modalMessage}
                />
            )}
        </section>
    )
}

export default News
