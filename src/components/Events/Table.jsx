/* eslint-disable react/prop-types */
import { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import SendIcon from "../../assets/icons/send-icon.svg"
import ReportIcon from "../../assets/icons/report.svg"
import moment from "moment"

const Table = ({ eventsData, handleOpenModal, handleArchiveClick }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    // Calculate pagination
    const totalPages = Math.ceil(eventsData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentEvents = eventsData.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <div className="mt-8">
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                            Event Title
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Date
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Location
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Organizer
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Category
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentEvents.length > 0 ? (
                        currentEvents.map((event) => (
                            <tr key={event.id}>
                                <td className="px-16 py-4 text-left whitespace-nowrap">
                                    {event.title}
                                </td>
                                <td className="text-left whitespace-nowrap">
                                    {moment(event.date).format("MM-DD-YYYY")}
                                </td>
                                <td className="text-left whitespace-nowrap">
                                    {event.location}
                                </td>
                                <td className="text-left whitespace-nowrap">
                                    {event.organizer}
                                </td>
                                <td className="text-left whitespace-nowrap">
                                    {event.category}
                                </td>
                                <td className="px-8 pt-4 text-left whitespace-nowrap flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(event)}
                                    >
                                        <img
                                            src={EditIcon}
                                            alt="Edit Icon"
                                            className="h-5"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleArchiveClick(event)
                                        }
                                    >
                                        <img
                                            src={ArchiveIcon}
                                            alt="Archive Icon"
                                            className="h-5"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleArchiveClick(event)
                                        }
                                    >
                                        <img
                                            src={SendIcon}
                                            alt="Send Icon"
                                            className="h-5"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                No events found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex fixed bottom-5 mt-4">
                {/* Pagination controls */}
                <div>
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

                {/* Generate Report button at bottom-right */}
                <button
                    className="fixed bottom-5 right-16 border text-[#219EBC] border-[#219EBC] flex px-5 py-3 rounded-md hover:bg-[#219EBC] hover:text-white transition-colors duration-300 group"
                    onClick={() => {
                        // Logic to generate report
                        console.log("Generating report...")
                    }}
                >
                    <img
                        src={ReportIcon}
                        alt="Report Icon"
                        className="w-5 h-5 mr-2 transition duration-300 group-hover:brightness-0 group-hover:invert"
                    />
                    <span>Generate Report</span>
                </button>
            </div>
        </div>
    )
}

export default Table
