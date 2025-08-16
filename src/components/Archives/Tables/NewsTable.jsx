import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal"
import { FiArrowDown, FiArrowUp } from "react-icons/fi"

const NewsTable = () => {
    const [news, setNews] = useState([])
    const [isUndoModalOpen, setIsUndoModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedNewsId, setSelectedNewsId] = useState(null)
    const [sortOrder, setSortOrder] = useState("asc")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            const response = await fetch("http://localhost:5000/news")
            const data = await response.json()
            // Only archived news
            const archivedNews = data.filter((item) => item.status === "Archived")
            setNews(archivedNews)
        } catch (error) {
            console.error("Error fetching News:", error)
        }
    }

    // Sort news by date
    const sortedNews = [...news].sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

    // Pagination
    const totalPages = Math.ceil(sortedNews.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentNews = sortedNews.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    const handleSort = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    const handleUndoClick = (newsItem) => {
        setSelectedNewsId(newsItem.id)
        setIsUndoModalOpen(true)
    }

    const handleUndoConfirm = async () => {
        if (!selectedNewsId) return
        try {
            const response = await fetch(`http://localhost:5000/news/archive/${selectedNewsId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Active" }),
            })
            if (response.ok) {
                setNews((prevNews) =>
                    prevNews.map((item) => (item.id === selectedNewsId ? { ...item, status: "Active" } : item)),
                )
                alert("News has been successfully restored.")
            }
        } catch (error) {
            console.error("Error undoing action:", error)
        }
        setIsUndoModalOpen(false)
        fetchNews()
    }

    const handleDeleteClick = (newsItem) => {
        setSelectedNewsId(newsItem.id)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedNewsId) return
        try {
            const response = await fetch(`http://localhost:5000/news/${selectedNewsId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })
            if (response.ok) {
                setNews((prevNews) => prevNews.filter((item) => item.id !== selectedNewsId))
                alert("News has been successfully deleted.")
            }
        } catch (error) {
            console.error("Error deleting news:", error)
        }
        setIsDeleteModalOpen(false)
    }

    const handleModalClose = () => {
        setIsUndoModalOpen(false)
        setIsDeleteModalOpen(false)
        setSelectedNewsId(null)
    }

    return (
        <div className="overflow-y-auto rounded-xl max-h-[calc(90vh-200px)] mx-16 border">
            <table className="min-w-full bg-white">
                <thead className="border-b bg-[#219EBC] text-white opacity-80">
                    <tr>
                        <th className="px-6 py-4 text-left font-medium whitespace-nowrap">News Headline</th>
                        <th className="px-6 py-4 text-left font-medium">Author</th>
                        <th className="px-6 py-4 text-left font-medium flex items-center">
                            Date
                            <button
                                onClick={handleSort}
                                className="ml-2 text-[#FFFFFF] hover:text-[#D6EFFF]"
                                aria-label="Sort by date"
                            >
                                {sortOrder === "asc" ? <FiArrowDown /> : <FiArrowUp />}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-left font-medium">Body</th>
                        <th className="px-6 py-4 text-left font-medium">Photos</th>
                        <th className="px-6 py-4 text-left font-medium">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {currentNews.map((newsItem, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={newsItem.id}
                        >
                            <td className="px-6 py-4">{newsItem.headline}</td>
                            <td className="px-6 py-4">{newsItem.author}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {moment(newsItem.date).format("MMMM D, YYYY")}
                            </td>
                            <td className="px-6 py-4">{newsItem.body}</td>
                            <td className="px-6 py-4">
                                {newsItem.images ? (
                                    <div className="flex gap-2 overflow-x-auto">
                                        {(() => {
                                            let imagesArray = []
                                            try {
                                                imagesArray = JSON.parse(newsItem.images)
                                            } catch {
                                                imagesArray = []
                                            }
                                            if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                                                return imagesArray.map((image, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={`http://localhost:5000/uploads/${image}`}
                                                        alt={`News Image ${idx + 1}`}
                                                        className="w-[100px] h-[60px] object-cover rounded-md cursor-pointer"
                                                    />
                                                ))
                                            } else {
                                                return (
                                                    <img
                                                        src={`http://localhost:5000/uploads/${newsItem.images}`}
                                                        alt="News"
                                                        className="w-[100px] h-[60px] object-cover rounded-md cursor-pointer"
                                                    />
                                                )
                                            }
                                        })()}
                                    </div>
                                ) : (
                                    "No Image"
                                )}
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                                <button onClick={() => handleUndoClick(newsItem)}>
                                    <img src={UndoIcon} alt="Undo Icon" className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteClick(newsItem)}>
                                    <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex fixed bottom-5 mt-4">
                {/* Pagination controls */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ${
                        currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                    } rounded-md`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 ${
                            currentPage === index + 1
                                ? "bg-[#219EBC] text-white"
                                : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                        } rounded-md mx-1`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ${
                        currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                    } rounded-md`}
                >
                    Next
                </button>
            </div>

            <UndoModal isOpen={isUndoModalOpen} onClose={handleModalClose} onConfirm={handleUndoConfirm} />
            <DeleteModal isOpen={isDeleteModalOpen} onClose={handleModalClose} onConfirm={handleDeleteConfirm} />
        </div>
    )
}

export default NewsTable
