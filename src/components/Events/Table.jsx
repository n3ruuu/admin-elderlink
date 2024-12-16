/* eslint-disable react/prop-types */
import { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import SendIcon from "../../assets/icons/send-icon.svg"
import moment from "moment"
import EmailModal from "./EmailModal"

const Table = ({ eventsData, handleOpenModal, onArchiveClick }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [isSMSModalOpen, setSMSModalOpen] = useState(false)
    const itemsPerPage = 5

    // Filter and sort active events
    const activeEventsData = eventsData.filter((event) => event.status === "Active")

    // Sort the events by date (ascending)
    const sortedEvents = activeEventsData.sort((a, b) => new Date(a.date) - new Date(b.date))

    // Pagination
    const totalPages = Math.ceil(sortedEvents.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentEvents = sortedEvents.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="mt-8">
            <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-xl">
                <thead className="text-[#767171CC] border-b">
                    <tr>
                        <th className="px-8 py-4 text-left font-medium">Title</th>
                        <th className="text-left font-medium">Date and Time</th>
                        <th className="text-left font-medium">Location</th>
                        <th className="text-left font-medium">Organizer</th>
                        <th className="text-left font-medium">Category</th>
                        <th className="text-left font-medium">Recurrence</th>
                        <th className="px-8 w-[150px] text-left font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEvents.map((event, index) => (
                        <tr
                            className={`text-[#333333] h-[100px] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={event.id}
                        >
                            <td className="px-8 align-top w-[300px] py-4 text-left">{event.title}</td>
                            <td className="text-left align-top w-[280px] py-4 whitespace-nowrap">
    {moment(event.date).format("MMMM DD, YYYY")}
    {event.recurrence !== "One-Time" && (
        <div className="text-sm text-gray-500">
            until {moment(event.endDate).format("MMMM DD, YYYY")}
        </div>
    )}
</td>

                            <td className="text-left align-top py-4">{event.location}</td>
                            <td className="text-left align-top py-4">{event.organizer}</td>
                            <td className="text-left align-top py-4">{event.category}</td>
                            <td className="text-left align-top py-4">
    {event.recurrence === "One-Time" ? (
        <span className="text-gray-500">No Recurrence</span>
    ) : (
        <div>
            <div>{event.recurrence}</div>
         
        </div>
    )}
</td>


                            <td className="px-8 pt-4 align-top py-4 text-left flex gap-3">
                                <button onClick={() => handleOpenModal(event)}>
                                    <img src={EditIcon} alt="Edit Icon" className="w-[20px]" />
                                </button>
                                <button onClick={() => onArchiveClick(event)}>
                                    <img src={ArchiveIcon} alt="Archive Icon" className="w-[20px]" />
                                </button>
                                <button onClick={() => setSMSModalOpen(true)}>
                                    <img src={SendIcon} alt="Send Icon" className="w-[20px]" />
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

            {/* Compose SMS Modal */}
            <EmailModal isOpen={isSMSModalOpen} onClose={() => setSMSModalOpen(false)} />
        </div>
    )
}

export default Table
