/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"

const EventsModal = ({ isOpen, onClose, onSave, event }) => {
    const [formData, setFormData] = useState({
        eventTitle: "",
        date: "",
        location: "",
        organizer: "",
        category: "",
    })

    useEffect(() => {
        if (event) {
            setFormData({
                eventTitle: event.title || "",
                date: event.date ? moment(event.date).format("YYYY-MM-DD") : "",
                location: event.location || "",
                organizer: event.organizer || "",
                category: event.category || "",
            })
        }
    }, [event])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSave = () => {
        // Convert date back to the original format if needed
        onSave({
            ...formData,
            date: moment(formData.date).format("YYYY-MM-DD"),
        })
        setFormData({
            eventTitle: "",
            date: "",
            location: "",
            organizer: "",
            category: "",
        })
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {event ? "Edit Event" : "Add Event"}
                </h2>
                <form>
                    {/* Event Title */}
                    <div className="mb-4">
                        <label
                            htmlFor="eventTitle"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="eventTitle"
                            name="eventTitle"
                            value={formData.eventTitle}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter event title"
                            required
                        />
                    </div>

                    {/* Date and Category */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="date"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-lg font-medium text-gray-700 mb-1"
                            >
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="" disabled>
                                    Select Category
                                </option>
                                <option value="Social Gathering">
                                    Social Gathering
                                </option>
                                <option value="Workshop">Workshop</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Fitness">Fitness</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label
                            htmlFor="location"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter event location"
                            required
                        />
                    </div>

                    {/* Organizer */}
                    <div className="mb-4">
                        <label
                            htmlFor="organizer"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Organizer <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="organizer"
                            name="organizer"
                            value={formData.organizer}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter event organizer"
                            required
                        />
                    </div>

                    {/* Export CSV and Buttons */}
                    <div className="flex mt-8 place-content-end">
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className="bg-[#FFFFFF] border-[#219EBC] text-[#219EBC] border-2 px-6 py-2 rounded-xl"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="text-[#FFFFFF] bg-[#219EBC] px-6 py-2 rounded-xl"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EventsModal
