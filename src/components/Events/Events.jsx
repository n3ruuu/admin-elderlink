import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"
import Calendar from "./Calendar"
import Header from "./Header"
import Table from "./Table"
import ViewModeSwitcher from "./ViewModeSwitcher"
import SuccessModal from "../common/SuccessModal" // Import your SuccessModal

const Events = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [successModalOpen, setSuccessModalOpen] = useState(false) // State for success modal
    const [currentEvent, setCurrentEvent] = useState(null)
    const [eventToArchive, setEventToArchive] = useState(null)
    const [eventsData, setEventsData] = useState([])
    const [filter, setFilter] = useState("all")
    const [viewMode, setViewMode] = useState("list")
    const [modalTitle, setModalTitle] = useState("") // Title for the success modal
    const [modalMessage, setModalMessage] = useState("") // Message for the success modal

    // Fetch events from the backend when the component mounts
    useEffect(() => {
        fetchEvents()
    }, [])

    // Function to fetch events
    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/events")
            setEventsData(response.data) // Update the state with the fetched data
        } catch (error) {
            console.error("Error fetching events:", error)
        }
    }

    // Open the modal with the event data to edit
    const handleOpenModal = (event = null) => {
        setCurrentEvent(event)
        setIsModalOpen(true)
    }

    // Close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentEvent(null)
    }

    // Save event (create or update)
    const handleSave = async (updatedEvent) => {
        try {
            const eventData = {
                title: updatedEvent.title,
                date: updatedEvent.date,
                location: updatedEvent.location,
                organizer: updatedEvent.organizer,
                category: updatedEvent.category,
                // Add any other relevant fields you want to save
            }

            if (updatedEvent.id) {
                // Update existing event
                const response = await axios.put(
                    `http://localhost:5000/events/${updatedEvent.id}`,
                    eventData, // Use the new object without circular references
                )
                setEventsData((prevData) =>
                    prevData.map((event) =>
                        event.id === updatedEvent.id ? response.data : event,
                    ),
                )
                // Set success modal for update
                setModalTitle("Event Updated!")
                setModalMessage("The event has been successfully edited.")
            } else {
                // Create new event
                const response = await axios.post(
                    "http://localhost:5000/events",
                    eventData, // Use the new object without circular references
                )
                setEventsData((prevData) => [...prevData, response.data])
                // Set success modal for addition
                setModalTitle("Event Added!")
                setModalMessage(
                    `The event has been successfully added to the event list.`,
                )
            }
        } catch (error) {
            console.error("Error saving event:", error)
        }
        handleCloseModal()
        setSuccessModalOpen(true) // Open success modal
        fetchEvents()
    }

    // Archive an event
    const handleArchiveClick = (event) => {
        setEventToArchive(event)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmArchive = async () => {
        try {
            await axios.put(
                `http://localhost:5000/events/archive/${eventToArchive.id}`,
                { status: "archived" },
            )
            setEventsData((prevData) =>
                prevData.filter((event) => event.id !== eventToArchive.id),
            )
            setIsConfirmModalOpen(false)
            setEventToArchive(null)
        } catch (error) {
            console.error("Error archiving event:", error)
        }
    }

    // Close the confirm archive modal
    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false)
        setEventToArchive(null)
    }

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter)
    }

    // Handle view mode change
    const handleViewModeChange = (mode) => {
        setViewMode(mode)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header
                onOpenModal={handleOpenModal}
                handleFilterChange={handleFilterChange}
                filter={filter}
            />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <ViewModeSwitcher
                        viewMode={viewMode}
                        handleViewModeChange={handleViewModeChange}
                    />
                    {viewMode === "list" ? (
                        <Table
                            eventsData={eventsData} // Pass eventsData to Table component
                            filter={filter}
                            handleOpenModal={handleOpenModal}
                            handleArchiveClick={handleArchiveClick}
                        />
                    ) : (
                        <div className="mt-8">
                            <Calendar events={eventsData} />
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
                />
            )}
            {isConfirmModalOpen && (
                <ArchiveConfirmModal
                    event={eventToArchive}
                    onConfirm={handleConfirmArchive}
                    onClose={handleCloseConfirmModal}
                />
            )}
            {successModalOpen && ( // Render SuccessModal
                <SuccessModal
                    isOpen={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                    title={modalTitle}
                    message={modalMessage}
                    onGoToArchives={null} // Add if you have a go to archives function
                    isArchiving={false} // Change if you want to show archiving
                />
            )}
        </section>
    )
}

export default Events
