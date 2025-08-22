import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal"
import SuccessModal from "../SuccessModal"
import DeleteSuccessModal from "../DeleteSuccessModal" // ✅ new modal

const EventsTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [events, setEvents] = useState([]) // All fetched events
    const [showUndoModal, setShowUndoModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false) // ✅ new state
    const [successMessage, setSuccessMessage] = useState("")
    const [selectedEvent, setSelectedEvent] = useState(null)

    const itemsPerPage = 6

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/events")
            const data = await response.json()
            // Only fetch Archived or Deleted events
            const archivedEvents = data.filter(
                (event) => event.status === "Archived" || event.status === "Deleted"
            )
            setEvents(archivedEvents)
        } catch (error) {
            console.error("Error fetching events:", error)
        }
    }

    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date))

    // Pagination
    const totalPages = Math.ceil(sortedEvents.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedEvents = sortedEvents.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    // Undo modal handlers
    const handleUndoClick = (event) => {
        setSelectedEvent(event)
        setShowUndoModal(true)
    }
    const handleUndoConfirm = async () => {
        if (!selectedEvent) return
        try {
            const response = await fetch(
                `http://localhost:5000/events/archive/${selectedEvent.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Active" }),
                }
            )
            if (response.ok) {
                setEvents((prev) =>
                    prev.map((ev) =>
                        ev.id === selectedEvent.id ? { ...ev, status: "Active" } : ev
                    )
                )
                setSuccessMessage("Event has been successfully restored.")
                setShowSuccessModal(true)
            } else console.error("Failed to undo archive")
        } catch (error) {
            console.error("Error undoing archive:", error)
        }
        handleCloseModal()
        fetchEvents()
    }

    // Delete modal handlers
    const handleDeleteClick = (event) => {
        setSelectedEvent(event)
        setShowDeleteModal(true)
    }
    const handleDeleteConfirm = async () => {
        if (!selectedEvent) return
        try {
            const response = await fetch(
                `http://localhost:5000/events/delete/${selectedEvent.id}`,
                {
                    method: "DELETE",
                }
            )
            if (response.ok) {
                setEvents((prev) =>
                    prev.filter((ev) => ev.id !== selectedEvent.id)
                )
                setShowDeleteSuccessModal(true) // ✅ show delete success modal
            } else console.error("Failed to delete event")
        } catch (error) {
            console.error("Error deleting event:", error)
        }
        handleCloseModal()
        fetchEvents()
    }

    const handleCloseModal = () => {
        setShowUndoModal(false)
        setShowDeleteModal(false)
        setSelectedEvent(null)
    }

    return (
        <div className="rounded-xl opacity-90 shadow-xl overflow-hidden max-h-[calc(90vh-200px)] mx-16">
            <table className="min-w-full bg-white rounded-xl border-x border-gray-300">
                <thead className="bg-[#219EBC] text-white border-x border-gray-300">
                    <tr>
                        <th className="px-8 py-4 text-left font-medium rounded-tl-xl border-x border-gray-300">
                            Event Title
                        </th>
                        <th className="px-8 py-4 text-left font-medium border-x border-gray-300">
                            Date
                        </th>
                        <th className="px-8 py-4 text-left font-medium border-x border-gray-300">
                            Location
                        </th>
                        <th className="px-8 py-4 text-left font-medium border-x border-gray-300">
                            Organizer
                        </th>
                        <th className="px-8 py-4 text-left font-medium border-x border-gray-300">
                            Category
                        </th>
                        <th className="px-8 py-4 w-[150px] text-left font-medium rounded-tr-xl border-x border-gray-300">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedEvents.map((event, index) => (
                        <tr
                            key={event.id}
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            } border-x border-gray-300`}
                        >
                            <td className="px-8 py-4 text-left border-x border-gray-300">
                                {event.title}
                            </td>
                            <td className="px-8 py-4 text-left whitespace-nowrap border-x border-gray-300">
                                {moment(event.date).format("MMMM D, YYYY")}
                            </td>
                            <td className="px-8 py-4 text-left whitespace-nowrap border-x border-gray-300">
                                {event.location}
                            </td>
                            <td className="px-8 py-4 text-left whitespace-nowrap border-x border-gray-300">
                                {event.organizer}
                            </td>
                            <td className="px-8 py-4 text-left whitespace-nowrap border-x border-gray-300">
                                {event.category}
                            </td>
                            <td className="px-8 py-4 text-left flex gap-3 border-x border-gray-300">
                                <button onClick={() => handleUndoClick(event)}>
                                    <img src={UndoIcon} alt="Undo Icon" className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteClick(event)}>
                                    <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
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

            {/* Modals */}
            <UndoModal
                isOpen={showUndoModal}
                onClose={handleCloseModal}
                onConfirm={handleUndoConfirm}
            />
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
                onConfirm={handleDeleteConfirm}
            />
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />
            <DeleteSuccessModal
                isOpen={showDeleteSuccessModal}
                onClose={() => setShowDeleteSuccessModal(false)}
            />
        </div>
    )
}

export default EventsTable
