import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal" // Assuming UndoModal is in the same folder
import { FiArrowDown, FiArrowUp } from "react-icons/fi"

const NewsTable = () => {
    const [news, setNews] = useState([]) // State to hold fetched News data
    const [isModalOpen, setIsModalOpen] = useState(false) // Modal visibility state
    const [selectedNewsId, setSelectedNewsId] = useState(null) // Store selected news ID for undo
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

    const handleUndoClick = (id) => {
        setSelectedNewsId(id) // Set the ID of the news to be undone
        setIsModalOpen(true) // Open the UndoModal
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
                console.log("News status updated.")
                setIsModalOpen(false) // Close the modal after confirming the action
                fetchNews()
            } else {
                console.error("Failed to update news status")
            }
        } catch (error) {
            console.error("Error undoing action:", error)
        }
    }

    const handleModalClose = () => {
        setIsModalOpen(false) // Close the modal when Cancel is clicked
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
                                <td className="pl-8 text-left">
                                    <button
                                        onClick={() => {
                                            handleUndoClick(news.id)
                                        }}
                                        className="cursor-pointer text-[#219EBC] font-semibold underline"
                                    >
                                        Undo
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Undo Modal */}
            <UndoModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleUndoConfirm} />
        </div>
    )
}

export default NewsTable
