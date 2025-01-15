import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal" // Import the DeleteModal component

import { FiArrowDown, FiArrowUp } from "react-icons/fi"

const NewsTable = () => {
    const [news, setNews] = useState([]) // State to hold fetched News data
    const [isUndoModalOpen, setIsUndoModalOpen] = useState(false) // Undo modal visibility state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false) // Delete modal visibility state
    const [selectedNewsId, setSelectedNewsId] = useState(null) // Store selected news ID for undo or delete
    const [sortOrder, setSortOrder] = useState("asc") // "asc" for ascending, "desc" for descending

    useEffect(() => {
        fetchNews()
    }, [])

    // Fetch data from the API
    const fetchNews = async () => {
        try {
            const response = await fetch("http://localhost:5000/news")
            const data = await response.json()
            console.log(data) // Log the full response to see the data structure

            // Filter only Archived news
            const archivedNews = data.filter((newsItem) => newsItem.status === "Archived")

            // Set the filtered news
            setNews(archivedNews)
        } catch (error) {
            console.error("Error fetching News:", error)
        }
    }

    // Function to toggle sort order
    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc"
        setSortOrder(newSortOrder)
    }

    const handleUndoClick = (newsItem) => {
        setSelectedNewsId(newsItem.id) // Set the ID of the news to be undone
        setIsUndoModalOpen(true) // Open the UndoModal
    }

    const handleUndoConfirm = async () => {
        console.log("Undoing action for news ID:", selectedNewsId)

        try {
            // Send a PUT request to update the status of the news item (either archive or undo)
            const response = await fetch(`http://localhost:5000/news/archive/${selectedNewsId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                // Update the local state to reflect the status change (archive or undo)
                setNews((prevNews) =>
                    prevNews.map((newsItem) =>
                        newsItem.id === selectedNewsId
                            ? {
                                  ...newsItem,
                                  status: response.status === 200 ? "Active" : "Archived",
                              } // Toggle status based on the action performed
                            : newsItem,
                    ),
                )
                alert("News has been successfully restored.")
                setIsUndoModalOpen(false) // Close the modal after confirming the action
                fetchNews()
            } else {
                console.error("Failed to update news status")
            }
        } catch (error) {
            console.error("Error undoing action:", error)
        }
    }

    const handleDeleteClick = (newsItem) => {
        setSelectedNewsId(newsItem.id) // Set the ID of the news to be deleted
        setIsDeleteModalOpen(true) // Open the DeleteModal
    }

    const handleDeleteConfirm = async () => {
        console.log("Deleting news ID:", selectedNewsId)

        try {
            // Send a DELETE request to delete the news item
            const response = await fetch(`http://localhost:5000/news/${selectedNewsId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                // Remove the deleted news from local state
                setNews((prevNews) => prevNews.filter((newsItem) => newsItem.id !== selectedNewsId))
                console.log("News deleted.")
                alert("News has been successfully deleted.")
                setIsDeleteModalOpen(false) // Close the modal after confirming the action
            } else {
                console.error("Failed to delete news")
            }
        } catch (error) {
            console.error("Error deleting news:", error)
        }
    }

    const handleModalClose = () => {
        setIsUndoModalOpen(false) // Close the modal when Cancel is clicked
        setIsDeleteModalOpen(false) // Close the delete modal
    }

    return (
        <div className=" x-auto px-4">
            {/* Scrollable container with a fixed height */}
            <div className="overflow-y-auto rounded-xl shadow-xl max-h-[calc(90vh-200px)] mx-16">
                <table className="min-w-full bg-white">
                    <thead className="text-gray-500 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left font-medium whitespace-nowrap">News Headline</th>
                            <th className="px-6 py-4 text-left font-medium">Author</th>
                            <th className="px-6 py-4 text-left font-medium flex items-center">
                                Date
                                <button onClick={handleSort} className="ml-2 text-[#219EBC] hover:text-[#1d87a1]">
                                    {sortOrder === "asc" ? (
                                        <FiArrowDown className="inline-block" />
                                    ) : (
                                        <FiArrowUp className="inline-block" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-left font-medium">Body</th>
                            <th className="px-6 py-4 text-left font-medium">Photos</th>
                            <th className="px-6 py-4 text-left font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map((news, index) => (
                            <tr
                                className={`text-[#333333] h-[100px] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                                key={news.id}
                            >
                                <td className="px-6 py-4 text-left align-top">{news.headline}</td>
                                <td className="px-6 py-4 text-left align-top">{news.author}</td>
                                <td className="px-6 py-4 text-left align-top whitespace-nowrap">
                                    {moment(news.date).format("MMMM D, YYYY")}
                                </td>
                                <td className="px-6 py-4 text-left align-top">{news.body}</td>
                                <td className="px-6 py-4 text-left">
                                    {news.images ? (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {/* Parse the string into an array if necessary */}
                                            {Array.isArray(JSON.parse(news.images)) ? (
                                                JSON.parse(news.images).map((image, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={`http://localhost:5000/uploads/${image}`}
                                                        alt={`News Image ${idx + 1}`}
                                                        className="w-[100px] h-[60px] object-cover rounded-md"
                                                    />
                                                ))
                                            ) : (
                                                <img
                                                    src={`http://localhost:5000/uploads/${news.images}`}
                                                    alt="News"
                                                    className="w-[100px] h-[60px] object-cover rounded-md"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td className="pl-16 text-left flex gap-2 mt-3">
                                    <button onClick={() => handleUndoClick(news)} className="cursor-pointer">
                                        <img src={UndoIcon} alt="Undo Icon" className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(news)} className="cursor-pointer">
                                        <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Undo Modal */}
            <UndoModal isOpen={isUndoModalOpen} onClose={handleModalClose} onConfirm={handleUndoConfirm} />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleModalClose}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

export default NewsTable
