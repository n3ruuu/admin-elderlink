import { useState } from "react"
import SearchIcon from "../assets/icons/search.svg"
import EditIcon from "../assets/icons/edit.svg"
import FilterIcon from "../assets/icons/filter-icon.svg"
import ArchiveIcon from "../assets/icons/archive2.svg"
import SendIcon from "../assets/icons/send-icon.svg"
import EventsData from "../data/events.json"
import Modal from "../modals/EventsModal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"
import Calendar from "../Calendar"
import moment from "moment"

const Events = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentEvent, setCurrentEvent] = useState(null)
    const [eventToArchive, setEventToArchive] = useState(null)
    const [eventsData, setEventsData] = useState(EventsData)
    const [filter, setFilter] = useState("all")
    const [viewMode, setViewMode] = useState("list") // State for view mode

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
            {/* Header */}
            <div className="p-16 w-full pb-8 flex items-start">
                <div className="w-1/2">
                    <h1 className="text-6xl font-bold">Manage Events</h1>
                    <p className="text-[#767171CC] mt-3">
                        Plan and coordinate events
                    </p>
                </div>
                <div className="flex items-start w-1/2 text-[#76717180]">
                    <div className="relative w-full">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="p-3 pr-12 border border-gray-300 border-r-0 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                            placeholder="Search..."
                        />
                        <img
                            src={SearchIcon}
                            alt="Search Icon"
                            className="absolute right-3 top-6 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                        />
                    </div>

                    <select
                        name="category"
                        id="category"
                        className="p-3 border h-[50px] border-gray-300 rounded-r-xl border-l-1 focus:outline-none"
                        onChange={(e) => handleFilterChange(e.target.value)}
                    >
                        <option className="text-[#000000]" value="all">
                            All Categories
                        </option>
                        <option className="text-[#000000]" value="category1">
                            Category 1
                        </option>
                        <option className="text-[#000000]" value="category2">
                            Category 2
                        </option>
                        <option className="text-[#000000]" value="category3">
                            Category 3
                        </option>
                    </select>
                    <button
                        className={`text-[#F5F5FA] bg-[#219EBC] w-full px-8 ml-4 text-[24px] py-2 rounded-xl ${
                            !currentEvent && filter === "add"
                                ? "bg-opacity-80"
                                : ""
                        }`}
                        onClick={() => handleOpenModal(null)}
                    >
                        &#43; Add Event
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex w-full h-full">
                {/* Left Section: Cards and Service Requests */}
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <div className="flex text-[20px] gap-5 justify-between">
                        <div className="flex gap-2 items-center">
                            {/* Conditional rendering of the header or filter */}
                            {viewMode === "calendar" ? (
                                <div className="flex items-center">
                                    <p className="text-[#219EBC] text-[36px] font-bold">
                                        {moment().format("MMMM YYYY")}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <img
                                        className="h-5"
                                        src={FilterIcon}
                                        alt="Filter Icon"
                                    />
                                    <p className="text-[#219EBC] ml-2">
                                        Filter:
                                    </p>
                                    <div className="flex border border-[#219EBC] rounded-2xl ml-2">
                                        <button
                                            className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] rounded-l-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                                filter === "all"
                                                    ? "bg-[#219EBC] text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleFilterChange("all")
                                            }
                                        >
                                            All
                                        </button>
                                        <button
                                            className={`border-1 border-[#219EBC] text-[#219EBC] px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                                filter === "ongoing"
                                                    ? "bg-[#219EBC] text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleFilterChange("ongoing")
                                            }
                                        >
                                            Ongoing
                                        </button>
                                        <button
                                            className={`border-1 border-[#219EBC] text-[#219EBC] border-l border-l-[#219EBC] rounded-r-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                                filter === "archived"
                                                    ? "bg-[#219EBC] text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleFilterChange("archived")
                                            }
                                        >
                                            Archived
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex">
                            <div>
                                <div className="flex border border-[#219EBC] rounded-2xl w-[250px]">
                                    <button
                                        className={`border-1 border-[#219EBC] w-1/2 text-[#219EBC] border-r border-r-[#219EBC] rounded-l-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                            viewMode === "list"
                                                ? "bg-[#219EBC] text-white"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleViewModeChange("list")
                                        }
                                    >
                                        List
                                    </button>
                                    <button
                                        className={`border-1 border-[#219EBC] w-1/2 text-[#219EBC] rounded-r-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                            viewMode === "calendar"
                                                ? "bg-[#219EBC] text-white"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleViewModeChange("calendar")
                                        }
                                    >
                                        Calendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Rendering */}
                    {viewMode === "list" && (
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
                                    {eventsData
                                        .filter((event) =>
                                            filter === "all"
                                                ? true
                                                : filter === "ongoing"
                                                  ? event.status === "Ongoing"
                                                  : event.status === "Archived",
                                        )
                                        .map((event) => (
                                            <tr key={event.id}>
                                                <td className="px-16 py-4 text-left whitespace-nowrap">
                                                    {event.title}
                                                </td>
                                                <td className="text-left whitespace-nowrap">
                                                    {event.date}
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
                                                <td className="px-8 text-left whitespace-nowrap">
                                                    <button
                                                        onClick={() =>
                                                            handleOpenModal(
                                                                event,
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={EditIcon}
                                                            alt="Edit Icon"
                                                            className="h-5"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleArchiveClick(
                                                                event,
                                                            )
                                                        }
                                                        className="ml-2"
                                                    >
                                                        <img
                                                            src={ArchiveIcon}
                                                            alt="Archive Icon"
                                                            className="h-5"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleArchiveClick(
                                                                event,
                                                            )
                                                        }
                                                        className="ml-2"
                                                    >
                                                        <img
                                                            src={SendIcon}
                                                            alt="Send Icon"
                                                            className="h-5"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {viewMode === "calendar" && (
                        <div className="mt-8">
                            <Calendar events={eventsData} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {isModalOpen && (
                <Modal
                    event={currentEvent}
                    onClose={handleCloseModal}
                    onSave={handleSave}
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
