import { useState, useEffect } from "react"
import moment from "moment"
import UndoModal from "../UndoModal" // Import the UndoModal component

const EventsTable = () => {
    const [events, setEvents] = useState([]) // State to hold fetched events data
    const [showModal, setShowModal] = useState(false) // State to control modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null) // State to hold the event to undo

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/events")
            const data = await response.json()

            // Filter out archived events
            const archivedEvents = data.filter(
                (event) => event.status === "Archived",
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

    // Handle opening the modal and setting the selected event
    const handleUndoClick = (event) => {
        setSelectedEvent(event) // Set the event that will be undone
        setShowModal(true) // Show the modal
    }

    // Handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedEvent(null)
    }

    const handleUndoConfirm = async () => {
        if (selectedEvent) {
            try {
                // Send PUT request to update the event status to 'Active'
                const response = await fetch(
                    `http://localhost:5000/events/archive/${selectedEvent.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ status: "Active" }), // Set status to 'Active' (undo the archive)
                    },
                )

                if (response.ok) {
                    // After successful undo, update the events state to reflect the change
                    setEvents((prevEvents) =>
                        prevEvents.map((event) =>
                            event.id === selectedEvent.id
                                ? { ...event, status: "Active" }
                                : event,
                        ),
                    )
                } else {
                    console.error("Failed to undo archive")
                }
            } catch (error) {
                console.error("Error undoing archive:", error)
            }
        }
        handleCloseModal() // Close the modal after the action
        fetchEvents()
    }

    return (
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] mx-16">
            {/* Set max height and enable vertical scrolling */}
            <table className="bg-[#FFFFFF] rounded-xl shadow-lg w-full">
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
                        <th className="text-left font-medium whitespace-nowrap">
                            Status
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {events.length > 0 ? (
                        events.map((event) => (
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
                                <td className="text-left text-red-500 whitespace-nowrap">
                                    {event.status}
                                </td>
                                <td className="px-8 py-4 flex gap-2 text-[#219EBC] font-semibold underline">
                                    <button
                                        onClick={() => handleUndoClick(event)}
                                    >
                                        Undo
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

            {/* Pass the modal props */}
            <UndoModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onConfirm={handleUndoConfirm}
            />
        </div>
    )
}

export default EventsTable
