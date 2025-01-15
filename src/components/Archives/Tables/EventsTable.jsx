import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal"
import UndoIcon from "../../../assets/icons/cancel.svg"
import DeleteIcon from "../../../assets/icons/archive.svg"
import DeleteModal from "../DeleteModal" // Import the DeleteModal component

const EventsTable = () => {
    const [events, setEvents] = useState([]) // State to hold fetched events data
    const [showUndoModal, setShowUndoModal] = useState(false) // State to control undo modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false) // State to control delete modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null) // State to hold the selected event

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/events")
            const data = await response.json()

            // Filter out archived events
            const archivedEvents = data.filter(
                (event) => event.status === "Archived" || event.status === "Deleted",
            )
            setEvents(archivedEvents)
        } catch (error) {
            console.error("Error fetching events:", error)
        }
    }

    // Call the fetchEvents function inside useEffect
    useEffect(() => {
        fetchEvents()
    }, [])

    // Handle opening the undo modal and setting the selected event
    const handleUndoClick = (event) => {
        setSelectedEvent(event) // Set the event to undo
        setShowUndoModal(true) // Show the undo modal
    }

    // Handle opening the delete modal and setting the selected event
    const handleDeleteClick = (event) => {
        setSelectedEvent(event) // Set the event to delete
        setShowDeleteModal(true) // Show the delete modal
    }

    // Handle closing the modals
    const handleCloseModal = () => {
        setShowUndoModal(false)
        setShowDeleteModal(false)
        setSelectedEvent(null)
    }

    // Handle undo action (restore the event to active status)
    const handleUndoConfirm = async () => {
        if (selectedEvent) {
            try {
                const response = await fetch(
                    `http://localhost:5000/events/archive/${selectedEvent.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ status: "Active" }), // Undo the archive
                    }
                )

                if (response.ok) {
                    // Update the event state
                    setEvents((prevEvents) =>
                        prevEvents.map((event) =>
                            event.id === selectedEvent.id
                                ? { ...event, status: "Active" }
                                : event
                        )
                    )
                alert("Event has been successfully restored.");

                } else {
                    console.error("Failed to undo archive")
                }
            } catch (error) {
                console.error("Error undoing archive:", error)
            }
        }
        handleCloseModal() // Close the modal after the action
        fetchEvents() // Re-fetch events after the change
    }

    // Handle delete action (mark the event as deleted)
    const handleDeleteConfirm = async () => {
        if (selectedEvent) {
            try {
                const response = await fetch(
                    `http://localhost:5000/events/delete/${selectedEvent.id}`,
                    {
                        method: "DELETE", // Send DELETE request to mark the event as deleted
                    }
                )

                if (response.ok) {
                    // Update the event state
                    setEvents((prevEvents) =>
                        prevEvents.filter((event) => event.id !== selectedEvent.id)
                    )
                alert("Event has been successfully deleted.")

                } else {
                    console.error("Failed to delete event")
                }
            } catch (error) {
                console.error("Error deleting event:", error)
            }
        }
        handleCloseModal() // Close the modal after the action
        fetchEvents() // Re-fetch events after the change
    }

    return (
        <div className="rounded-xl max-h-[calc(90vh-200px)] mx-16">
            {/* Set max height and enable vertical scrolling */}
            <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-xl">
                <thead className="text-[#767171CC] border-b">
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
                        <th className="text-left font-medium whitespace-nowrap">
                            Status
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            }`}
                            key={event.id}
                        >
                            <td className="px-16 py-4 text-left whitespace-nowrap">
                                {event.title}
                            </td>
                            <td className="text-left whitespace-nowrap">
                                {moment(event.date).format("MMMM D, YYYY")}
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
                            <td className="text-left text-red-500 whitespace-nowrap">
                                {event.status}
                            </td>
                            <td className="pl-16 text-left flex gap-2 mt-3">
                                <button onClick={() => handleUndoClick(event)} className="cursor-pointer">
                                    <img src={UndoIcon} alt="Undo Icon" className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteClick(event)} className="cursor-pointer">
                                    <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pass the modal props */}
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
        </div>
    )
}

export default EventsTable
