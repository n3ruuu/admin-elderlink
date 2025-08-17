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

    const activeEventsData = eventsData.filter((event) => event.status === "Active")
    const sortedEvents = activeEventsData.sort((a, b) => new Date(a.date) - new Date(b.date))
    const totalPages = Math.ceil(sortedEvents.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentEvents = sortedEvents.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="mt-8 rounded-xl shadow-xl overflow-hidden">
            <table className="min-w-full bg-white rounded-xl border border-gray-300 border-collapse">
                <thead className="bg-[#219EBC] opacity-90 text-white border-b border-gray-300">
                    <tr>
                        <th className="px-6 py-4 text-center font-medium border-x border-gray-300 rounded-tl-xl">
                            Title
                        </th>
                        <th className="px-6 py-4 text-center font-medium border-x border-gray-300">Date and Time</th>
                        <th className="px-6 py-4 text-center font-medium border-x border-gray-300">Location</th>
                        <th className="px-6 py-4 text-center font-medium border-x border-gray-300">Organizer</th>
                        <th className="px-6 py-4 text-center font-medium border-x border-gray-300">Category</th>
                        <th className="px-6 py-4 text-center font-medium border-x border-gray-300">Recurrence</th>
                        <th className="px-6 py-4 w-[150px] text-center font-medium border-x border-gray-300 rounded-tr-xl">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentEvents.map((event, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={event.id}
                        >
                            <td className="px-6 py-4 align-top w-[300px] border-x border-gray-300">{event.title}</td>
                            <td className="px-6 py-4 align-top w-[280px] whitespace-nowrap border-x border-gray-300">
                                {moment(event.date).format("MMMM DD, YYYY")}
                                {event.recurrence !== "One-Time" && (
                                    <div className="text-sm text-gray-500">
                                        until {moment(event.endDate).format("MMMM DD, YYYY")}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 align-top border-x border-gray-300">{event.location}</td>
                            <td className="px-6 py-4 align-top border-x border-gray-300">{event.organizer}</td>
                            <td className="px-6 py-4 align-top border-x border-gray-300">{event.category}</td>
                            <td className="px-6 py-4 align-top border-x border-gray-300">
                                {event.recurrence === "One-Time" ? (
                                    <span className="text-gray-500">No Recurrence</span>
                                ) : (
                                    <div>{event.recurrence}</div>
                                )}
                            </td>
                            <td className="px-6 py-4 align-top flex gap-3">
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

            <EmailModal isOpen={isSMSModalOpen} onClose={() => setSMSModalOpen(false)} />
        </div>
    )
}

export default Table
