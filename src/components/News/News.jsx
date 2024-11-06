import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import Header from "./Header"
import Table from "./Table"

const News = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentNews, setCurrentNews] = useState(null) // Changed from currentEvent to currentNews
    const [newsData, setNewsData] = useState([]) // Changed from eventsData to newsData
    const [filter, setFilter] = useState("all")

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

    const handleOpenModal = (news = null) => {
        setCurrentNews(news) // Changed from event to news
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentNews(null)
    }

    const handleSave = async (updatedNews) => {
        try {
            const formData = new FormData()
            formData.append("headline", updatedNews.headline)
            formData.append("author", updatedNews.author)
            formData.append("date", updatedNews.date)
            formData.append("body", updatedNews.body)
            if (updatedNews.image) formData.append("image", updatedNews.image)

            if (updatedNews.id) {
                // Edit existing news
                const response = await axios.put(
                    `http://localhost:5000/news/${updatedNews.id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                )
                setNewsData((prevData) =>
                    prevData.map((news) =>
                        news.id === updatedNews.id ? response.data : news,
                    ),
                )
            } else {
                // Add new news
                const response = await axios.post(
                    "http://localhost:5000/news",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                )
                setNewsData((prevData) => [...prevData, response.data])
            }
        } catch (error) {
            console.error("Error saving news:", error)
        }
        handleCloseModal()
        fetchNews() // Fetch news again after save
    }

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header
                onOpenModal={handleOpenModal}
                handleFilterChange={handleFilterChange}
                filter={filter}
            />
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
                    onSubmit={handleSave}
                    news={currentNews} // optional if editing
                />
            )}
        </section>
    )
}

export default News
