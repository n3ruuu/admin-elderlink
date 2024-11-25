import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import Header from "./Header"
import Table from "./Table"

const Reports = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newsData, setNewsData] = useState([]) // List of news articles
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

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header onOpenModal={handleOpenModal} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Table
                        newsData={filteredNews} // Use filtered data
                        handleOpenModal={handleOpenModal}
                    />
                </div>
            </div>
            {isModalOpen && <Modal onClose={handleCloseModal} />}
        </section>
    )
}

export default Reports
