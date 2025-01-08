import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import ArchiveModal from "./ArchiveModal"
import Calendar from "./Calendar"
import Header from "./Header"
import Table from "./Table"
import ViewModeSwitcher from "./ViewModeSwitcher"
import SuccessModal from "../common/SuccessModal"
import moment from "moment"

const Events = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [currentEvent, setCurrentEvent] = useState(null)
    const [eventToArchive, setEventToArchive] = useState(null)
    const [eventsData, setEventsData] = useState([])
    const [filter, setFilter] = useState("all")
    const [viewMode, setViewMode] = useState("list")
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("") // State for the search query
    const [modalFromRowClick, setModalFromRowClick] = useState(false)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/events")
            setEventsData(response.data)
        } catch (error) {
            console.error("Error fetching events:", error)
        }
    }

    const logAction = async (action) => {
        try {
            const response = await fetch("http://localhost:5000/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"), // Current timestamp in ISO format
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to log action")
            }

            console.log("Action logged successfully")
        } catch (error) {
            console.error("Error logging action:", error)
        }
    }

    const handleOpenModal = (event = null, isRowClick = false) => {
        setCurrentEvent(event)
        setIsModalOpen(true)
        setModalFromRowClick(isRowClick) // New state to track modal origin
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentEvent(null)
    }

    const handleSave = async (updatedEvent) => {
        try {

            if (moment(updatedEvent.date).isBefore(moment(), "day")) {
                alert("Error: The event date cannot be in the past.");
                return; // Exit the function without saving
            }

            const eventData = {
                title: updatedEvent.title,
                description: updatedEvent.description, // Add description
                date: updatedEvent.date,
                time: updatedEvent.time, // Add time
                location: updatedEvent.location,
                organizer: updatedEvent.organizer,
                category: updatedEvent.category,
                recurrence: updatedEvent.recurrence, // Add recurrence
                endDate: updatedEvent.endDate, // Add endDate
                recurrenceDates: updatedEvent.recurrenceDates // Add an array to store recurrence dates
            };
            if (updatedEvent.id) {
                const response = await axios.put(`http://localhost:5000/events/${updatedEvent.id}`, eventData)
                setEventsData((prevData) =>
                    prevData.map((event) => (event.id === updatedEvent.id ? response.data : event)),
                )
                setModalTitle("Event Updated!")
                setModalMessage("The event has been successfully edited.")
                await logAction(`Update Event`)
            } else {
                const response = await axios.post("http://localhost:5000/events", eventData)
                setEventsData((prevData) => [...prevData, response.data])
                setModalTitle("Event Added!")
                setModalMessage("The event has been successfully added to the event list.")
                await logAction(`New Event`)
            }
        } catch (error) {
            console.error("Error saving event:", error)
        }
        handleCloseModal()
        setSuccessModalOpen(true)
        fetchEvents()
    }
    

    const handleArchiveClick = (event) => {
        setEventToArchive(event)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmArchive = async () => {
        try {
            // Archive the event in the backend
            await axios.put(`http://localhost:5000/events/archive/${eventToArchive.id}`, { status: "Archived" })

            // Update local state by filtering out the archived event
            setEventsData((prevData) => {
                const updatedData = prevData.filter((event) => event.id !== eventToArchive.id)
                console.log("Updated Events Data:", updatedData)
                return updatedData
            })

            await logAction(`Archive Event`)

            // Close the confirmation modal
            setIsConfirmModalOpen(false)
            setEventToArchive(null)

            // Open the SuccessModal with appropriate title and message
            setModalTitle("Event Archived!")
            setModalMessage("The event has been successfully archived.")
            setSuccessModalOpen(true) // Open the success modal
        } catch (error) {
            console.error("Error archiving event:", error)
        }
    }

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false)
        setEventToArchive(null)
    }

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter)
    }

    const handleViewModeChange = (mode) => {
        setViewMode(mode)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    // Filter the events based on the search query
    const filteredEvents = eventsData.filter((event) => {
        return (
            (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (event.organizer && event.organizer.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header
                onOpenModal={handleOpenModal}
                handleFilterChange={handleFilterChange}
                filter={filter}
                searchQuery={searchQuery} // Pass the search query to Header
                onSearchChange={handleSearchChange} // Pass the search change handler to Header
            />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <ViewModeSwitcher viewMode={viewMode} handleViewModeChange={handleViewModeChange} />
                    {viewMode === "list" ? (
                        <Table
                            eventsData={filteredEvents} // Use filtered events
                            handleOpenModal={handleOpenModal}
                            onArchiveClick={handleArchiveClick}
                        />
                    ) : (
                        <div className="mt-8">
                            <Calendar events={filteredEvents} /> {/* Use filtered events */}
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    event={currentEvent}
                    isRowClick={modalFromRowClick}
                />
            )}
            {isConfirmModalOpen && (
                <ArchiveModal
                    isOpen={isConfirmModalOpen}
                    onClose={handleCloseConfirmModal}
                    onConfirm={handleConfirmArchive}
                    eventName={eventToArchive ? eventToArchive.title : ""}
                />
            )}
            {successModalOpen && (
                <SuccessModal
                    isOpen={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                    title={modalTitle}
                    message={modalMessage}
                />
            )}
        </section>
    )
}

export default Events
