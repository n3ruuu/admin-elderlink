/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"

const Modal = ({ isOpen, onClose, onSave, event }) => {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        location: "",
        organizer: "",
        category: "",
    })

    const isEditMode = !!event // Determine if this is edit mode
    const [isModified, setIsModified] = useState(false) // Track if the form has been modified

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                title: event.title || "",
                date: event.date ? moment(event.date).format("YYYY-MM-DD") : "",
                location: event.location || "",
                organizer: event.organizer || "",
                category: event.category || "",
            })
            setIsModified(false) // Reset modification state on load
        } else {
            setFormData({
                title: "",
                date: "",
                location: "",
                organizer: "",
                category: "",
            })
        }
    }, [event, isEditMode])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        setIsModified(true) // Mark form as modified on any change
    }

    const isFormValid = () => {
        return (
            formData.title &&
            formData.date &&
            formData.location &&
            formData.organizer &&
            formData.category
        )
    }

    const handleSave = () => {
        const updatedEvent = {
            ...event,
            title: formData.title,
            date: formData.date,
            location: formData.location,
            organizer: formData.organizer,
            category: formData.category,
        }
        onSave(updatedEvent)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">
                    {isEditMode ? "Edit Event" : "Add Event"}
                </h2>
                <form>
                    {/* Event Title */}
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-lg font-medium text-gray-700 mb-1"
                        >
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
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

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border w-[100px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={
                                !isFormValid() || (isEditMode && !isModified)
                            } // Disable button if form is invalid or not modified in edit mode
                            className={`bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px] ${!isFormValid() || (isEditMode && !isModified) ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isEditMode && event.id ? "Save" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal
