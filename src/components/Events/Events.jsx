import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import ArchiveModal from "./ArchiveModal"
import Calendar from "./Calendar"
import Header from "./Header"
import Table from "./Table"
import ViewModeSwitcher from "./ViewModeSwitcher"
import SuccessModal from "../common/SuccessModal"

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

    const handleOpenModal = (event = null) => {
        setCurrentEvent(event)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentEvent(null)
    }

    const handleSave = async (updatedEvent) => {
        try {
            const eventData = {
                title: updatedEvent.title,
                date: updatedEvent.date,
                location: updatedEvent.location,
                organizer: updatedEvent.organizer,
                category: updatedEvent.category,
            }

            if (updatedEvent.id) {
                const response = await axios.put(
                    `http://localhost:5000/events/${updatedEvent.id}`,
                    eventData,
                )
                setEventsData((prevData) =>
                    prevData.map((event) =>
                        event.id === updatedEvent.id ? response.data : event,
                    ),
                )
                setModalTitle("Event Updated!")
                setModalMessage("The event has been successfully edited.")
            } else {
                const response = await axios.post(
                    "http://localhost:5000/events",
                    eventData,
                )
                setEventsData((prevData) => [...prevData, response.data])
                setModalTitle("Event Added!")
                setModalMessage(
                    "The event has been successfully added to the event list.",
                )
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
            await axios.put(
                `http://localhost:5000/events/archive/${eventToArchive.id}`,
                { status: "Archived" },
            )

            // Update local state by filtering out the archived event
            setEventsData((prevData) => {
                const updatedData = prevData.filter(
                    (event) => event.id !== eventToArchive.id,
                )
                console.log("Updated Events Data:", updatedData)
                return updatedData
            })

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
                            eventsData={eventsData}
                            filter={filter}
                            onArchiveClick={handleArchiveClick}
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
