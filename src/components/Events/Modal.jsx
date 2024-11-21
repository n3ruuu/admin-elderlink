/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"
import FormFields from "./FormFields"
import ScheduleModal from "./ScheduleModal"

const Modal = ({ isOpen, onClose, onSave, event }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        recurrence: "",
        date: "",
        time: "",
        location: "",
        organizer: "",
        eventType: "",
        scheduledDate: "",
        scheduledTime: "",
    })

    const [isModified, setIsModified] = useState(false)
    const [isScheduled, setIsScheduled] = useState(false)
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

    const isEditMode = !!event

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                title: event.title || "",
                description: event.description || "",
                category: event.category || "",
                recurrence: event.recurrence || "",
                date: event.date ? moment(event.date).format("YYYY-MM-DD") : "",
                time: event.time || "",
                location: event.location || "",
                organizer: event.organizer || "",
                eventType: event.eventType || "",
            })
            setIsScheduled(event.scheduledDate && event.scheduledTime)
            setIsModified(false)
        } else {
            setFormData({
                title: "",
                description: "",
                category: "",
                recurrence: "",
                date: "",
                time: "",
                location: "",
                organizer: "",
                eventType: "",
            })
            setIsScheduled(false)
        }
    }, [event, isEditMode])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        setIsModified(true)
    }

    const handleScheduleClick = () => {
        setIsScheduleModalOpen(true)
    }

    const handleSchedule = (scheduledDate, scheduledTime) => {
        setFormData((prevData) => ({
            ...prevData,
            date: scheduledDate,
            time: scheduledTime,
        }))
        setIsScheduled(true)
        setIsScheduleModalOpen(false)
    }

    const isFormValid = () => {
        return (
            formData.title &&
            formData.date &&
            formData.time &&
            formData.location &&
            formData.organizer &&
            formData.category &&
            formData.eventType
        )
    }

    const handleSave = () => {
        const updatedEvent = {
            ...event,
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            organizer: formData.organizer,
            category: formData.category,
            eventType: formData.eventType,
        }
        onSave(updatedEvent)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">{isEditMode && event.id ? "Edit Event" : "Add Event"}</h2>
                <form>
                    <FormFields
                        formData={formData}
                        onChange={handleChange}
                        isScheduled={isScheduled}
                        setIsScheduled={setIsScheduled}
                        handleScheduleClick={handleScheduleClick}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-5">
                        {/* Conditional Rendering for the Schedule Button */}
                        {!isFormValid() && (
                            <button
                                type="button"
                                onClick={handleScheduleClick}
                                className={`${
                                    isScheduled
                                        ? "bg-green-500 text-white hover:bg-green-600"
                                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                                } py-2 px-4 rounded-md transition-colors duration-300`}
                            >
                                {isScheduled ? "Scheduled Posting" : "Schedule for Later"}
                            </button>
                        )}

                        <div className="flex gap-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="border w-[100px] self-right border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!isFormValid() || (isEditMode && !isModified)}
                                className={`bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px] ${!isFormValid() || (isEditMode && !isModified) ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isEditMode && event.id ? "Save" : "Add"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Schedule Modal */}
            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSchedule={handleSchedule}
            />
        </div>
    )
}

export default Modal
