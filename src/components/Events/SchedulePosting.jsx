/* eslint-disable react/prop-types */
import { useState } from "react"

const SchedulePosting = ({ isOpen, onClose, onSave }) => {
    const [postingDate, setPostingDate] = useState("")
    const [postingTime, setPostingTime] = useState("")
    const [isPosted, setIsPosted] = useState(false)

    if (!isOpen) return null

    const handleSave = () => {
        // Assuming onSave is a function that handles saving the date and time
        onSave(postingDate, postingTime)
        setIsPosted(true) // Set the success state to show "Schedule posting is set!"
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">Schedule Posting</h2>
                <div className="mb-4">
                    <label
                        htmlFor="postingDate"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Select Posting Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="postingDate"
                        value={postingDate}
                        onChange={(e) => setPostingDate(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="postingTime"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Select Posting Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        id="postingTime"
                        value={postingTime}
                        onChange={(e) => setPostingTime(e.target.value)}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div className="flex justify-between mt-5">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px]"
                    >
                        Set Posting
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="border w-[100px] self-right border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Cancel
                    </button>
                </div>

                {isPosted && (
                    <p className="mt-4 text-green-500 font-semibold">
                        Schedule posting is set!
                    </p>
                )}
            </div>
        </div>
    )
}

export default SchedulePosting
