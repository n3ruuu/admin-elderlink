import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import Header from "./Header"
import Table from "./Table"
import SuccessModal from "../common/SuccessModal"

const News = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentNews, setCurrentNews] = useState(null) // Changed from currentEvent to currentNews
    const [newsData, setNewsData] = useState([]) // Changed from eventsData to newsData
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            const response = await axios.get("http://localhost:5000/news") // Updated endpoint for news
            setNewsData(response.data)
        } catch (error) {
            console.error("Error fetching news:", error)
        }
    }

    const handleSaveNews = (updatedNews) => {
        console.log(updatedNews) // Debugging line to check the updated news object
        if (updatedNews.id) {
            // Editing existing news
            setNewsData(
                newsData.map((news) =>
                    news.id === updatedNews.id ? updatedNews : news,
                ),
            )
            setModalTitle("News Updated!")
            setModalMessage("The news has been successfully updated.")
        } else {
            // Adding new news
            setNewsData([updatedNews, ...newsData])
            setModalTitle("News Published!")
            setModalMessage("The news has been successfully published.")
        }
        setSuccessModalOpen(true) // Open the success modal
        fetchNews() // Optionally refresh the news data
    }

    const handleOpenModal = (news = null) => {
        setCurrentNews(news) // Changed from event to news
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentNews(null)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header onOpenModal={handleOpenModal} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Table
                        newsData={newsData}
                        handleOpenModal={handleOpenModal}
                    />{" "}
                    {/* Changed from eventsData to newsData */}
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    onClose={handleCloseModal}
                    onSubmit={handleSaveNews}
                    news={currentNews} // optional if editing
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
