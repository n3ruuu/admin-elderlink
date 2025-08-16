/* eslint-disable react/prop-types */
import { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment"
import { FiArrowDown, FiArrowUp } from "react-icons/fi"
import ImageModal from "./ImageModal" // Make sure you have this component in the same folder or adjust import accordingly

const Table = ({ newsData, handleOpenModal, handleOpenArchiveModal }) => {
    // Filter news with status "Active"
    const activeNewsData = newsData.filter((news) => news.status === "Active")

    const [currentPage, setCurrentPage] = useState(1)
    const [sortOrder, setSortOrder] = useState("asc") // "asc" for ascending, "desc" for descending
    const itemsPerPage = 5

    const totalPages = Math.ceil(activeNewsData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentNews = activeNewsData.slice(startIndex, startIndex + itemsPerPage)

    // Image modal states
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState(null)

    // Function to toggle sort order
    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc"
        setSortOrder(newSortOrder)
    }

    // Sorting the data based on the selected sort order
    const sortedNews = currentNews.sort((a, b) => {
        const dateA = moment(a.date)
        const dateB = moment(b.date)

        if (sortOrder === "asc") {
            return dateA.isBefore(dateB) ? -1 : 1
        } else {
            return dateA.isAfter(dateB) ? -1 : 1
        }
    })

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const openImageModal = (src) => {
        setSelectedImageSrc(src)
        setIsImageModalOpen(true)
    }

    const closeImageModal = () => {
        setIsImageModalOpen(false)
        setSelectedImageSrc(null)
    }

    return (
        <>
            <div className="mt-8">
                {/* Scrollable container with a fixed height */}
                <div className="overflow-y-auto max-h-[650px] w-full shadow-lg rounded-xl border">
                    <table className="min-w-full bg-white">
                        <thead className="border-b bg-[#219EBC] text-white opacity-80">
                            <tr>
                                <th className="px-6 py-4 text-center font-medium whitespace-nowrap">News Headline</th>
                                <th className="px-6 py-4 text-center font-medium">Author</th>
                                <th className="px-6 py-4 text-center font-medium flex items-center">
                                    Date
                                    <button
                                        onClick={handleSort}
                                        className="ml-2 text-[#219EBC] hover:text-[#1d87a1]"
                                        aria-label="Sort by date"
                                    >
                                        {sortOrder === "asc" ? (
                                            <FiArrowDown className="inline-block" />
                                        ) : (
                                            <FiArrowUp className="inline-block" />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-center w-[400px] font-medium">Body</th>
                                <th className="px-6 py-4 text-center w-[400px] font-medium">Photos</th>
                                <th className="px-6 py-4 text-center font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedNews.map((news, index) => (
                                <tr
                                    className={`text-[#333333] h-[100px] font-[500] ${
                                        index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                                    }`}
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
                                                {(() => {
                                                    let imagesArray = []
                                                    try {
                                                        imagesArray = JSON.parse(news.images)
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
                                                                onClick={() =>
                                                                    openImageModal(
                                                                        `http://localhost:5000/uploads/${image}`,
                                                                    )
                                                                }
                                                            />
                                                        ))
                                                    } else {
                                                        // If images is a single string (not JSON array)
                                                        return (
                                                            <img
                                                                src={`http://localhost:5000/uploads/${news.images}`}
                                                                alt="News"
                                                                className="w-[100px] h-[60px] object-cover rounded-md cursor-pointer"
                                                                onClick={() =>
                                                                    openImageModal(
                                                                        `http://localhost:5000/uploads/${news.images}`,
                                                                    )
                                                                }
                                                            />
                                                        )
                                                    }
                                                })()}
                                            </div>
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-left flex gap-2">
                                        <button onClick={() => handleOpenModal(news)}>
                                            <img src={EditIcon} alt="Edit Icon" className="h-5" />
                                        </button>

                                        <button onClick={() => handleOpenArchiveModal(news)}>
                                            <img src={ArchiveIcon} alt="Archive Icon" className="h-5" />
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
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal isOpen={isImageModalOpen} imageSrc={selectedImageSrc} onClose={closeImageModal} />
        </>
    )
}

export default Table
