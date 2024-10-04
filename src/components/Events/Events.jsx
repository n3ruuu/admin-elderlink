import { useState } from "react"
import EventsData from "../../data/events.json"
import Modal from "./Modal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"
import Calendar from "./Calendar"
import Header from "./Header"
import Table from "./Table"
import ViewModeSwitcher from "./ViewModeSwitcher"

const Events = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentEvent, setCurrentEvent] = useState(null)
    const [eventToArchive, setEventToArchive] = useState(null)
    const [eventsData, setEventsData] = useState(EventsData)
    const [filter, setFilter] = useState("all")
    const [viewMode, setViewMode] = useState("list")

    const handleOpenModal = (event) => {
        setCurrentEvent(event)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentEvent(null)
    }

    const handleSave = (updatedEvent) => {
        if (currentEvent) {
            setEventsData((prevData) =>
                prevData.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event,
                ),
            )
        } else {
            setEventsData((prevData) => [
                ...prevData,
                { ...updatedEvent, id: prevData.length + 1 },
            ])
        }
        handleCloseModal()
    }

    const handleArchiveClick = (event) => {
        setEventToArchive(event)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmArchive = () => {
        setEventsData((prevData) =>
            prevData.filter((event) => event.id !== eventToArchive.id),
        )
        setIsConfirmModalOpen(false)
        setEventToArchive(null)
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
                handleOpenModal={handleOpenModal}
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
        </section>
    )
}

export default Events
