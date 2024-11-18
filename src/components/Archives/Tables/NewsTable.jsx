import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal" // Assuming UndoModal is in the same folder

const NewsTable = () => {
    const [news, setNews] = useState([]) // State to hold fetched News data
    const [isModalOpen, setIsModalOpen] = useState(false) // Modal visibility state
    const [selectedNewsId, setSelectedNewsId] = useState(null) // Store selected news ID for undo

    useEffect(() => {
        // Fetch data from the API
        const fetchNews = async () => {
            try {
                const response = await fetch("http://localhost:5000/news")
                const data = await response.json()
                console.log(data) // Log the full response to see the data structure

                // Set all fetched news (both Active and Archived)
                setNews(data)
            } catch (error) {
                console.error("Error fetching News:", error)
            }
        }

        fetchNews()
    }, [])

    const handleUndoClick = (id) => {
        setSelectedNewsId(id) // Set the ID of the news to be undone
        setIsModalOpen(true) // Open the UndoModal
    }

    const handleUndoConfirm = async () => {
        console.log("Undoing action for news ID:", selectedNewsId)

        try {
            // Send a PUT request to update the status of the news item (either archive or undo)
            const response = await fetch(
                `http://localhost:5000/news/archive/${selectedNewsId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )

            if (response.ok) {
                // Update the local state to reflect the status change (archive or undo)
                setNews((prevNews) =>
                    prevNews.map((newsItem) =>
                        newsItem.id === selectedNewsId
                            ? {
                                  ...newsItem,
                                  status:
                                      response.status === 200
                                          ? "Active"
                                          : "Archived",
                              } // Toggle status based on the action performed
                            : newsItem,
                    ),
                )
                console.log("News status updated.")
                setIsModalOpen(false) // Close the modal after confirming the action
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
                {/* Set max height and enable vertical scrolling */}
                <table className="bg-[#FFFFFF] rounded-xl shadow-xl w-full">
                    <thead className="text-[#767171CC] border-b">
                        <tr>
                            <th className="px-6 py-4 text-left font-medium">
                                News Headline
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Author
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Body
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Photo
                            </th>
                            <th className="text-left font-medium whitespace-nowrap">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {news
                            .filter(
                                (newsItem) => newsItem.status === "Archived",
                            ) // Filter to show only Archived news
                            .map((newsItem) => (
                                <tr
                                    key={newsItem.id}
                                    className="border-b last:border-none space-y-4"
                                >
                                    <td className="px-6 py-4 text-left align-top">
                                        {newsItem.headline}
                                    </td>
                                    <td className="px-6 py-4 text-left align-top">
                                        {newsItem.author}
                                    </td>
                                    <td className="px-6 py-4 text-left align-top whitespace-nowrap">
                                        {moment(newsItem.date).format(
                                            "MMMM D, YYYY",
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-left align-top">
                                        {newsItem.body}
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        {newsItem.image ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${newsItem.image}`}
                                                alt="News"
                                                className="w-[500px] h-[200px] object-cover rounded-md"
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td className="text-left text-red-500 align-top pt-4 whitespace-nowrap">
                                        {newsItem.status}
                                    </td>
                                    <td className="px-8 cursor-pointer flex gap-2 text-[#219EBC] align-top font-semibold underline">
                                        <button
                                            onClick={() =>
                                                handleUndoClick(newsItem.id)
                                            }
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
            <UndoModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleUndoConfirm}
            />
        </div>
    )
}

export default NewsTable
