/* eslint-disable react/prop-types */
import { useState } from "react"

const ScheduleModal = ({ isOpen, onClose, onSchedule }) => {
    const [scheduledDate, setScheduledDate] = useState("")
    const [scheduledTime, setScheduledTime] = useState("")

    const handleSchedule = () => {
        onSchedule(scheduledDate, scheduledTime)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[20%]">
                <h2 className="text-3xl font-bold mb-6">Schedule Event</h2>
                <div className="mb-4">
                    <label
                        htmlFor="scheduledDate"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Select Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="scheduledDate"
                        name="scheduledDate"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="scheduledTime"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Select Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        id="scheduledTime"
                        name="scheduledTime"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div className="flex justify-end gap-5 mt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border w-[100px] text-[#219EBC] hover:bg-[#219EBC] hover:text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSchedule}
                        className="bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px]"
                    >
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ScheduleModal
