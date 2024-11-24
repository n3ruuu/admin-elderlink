/* eslint-disable react/prop-types */
import { useState } from "react"
import SendIcon from "../../assets/icons/send-icon.svg"

const SmsModal = ({ isOpen, onClose, member }) => {
    const [message, setMessage] = useState("")
    const [image, setImage] = useState(null) // State for storing the image

    const handleSendSMS = async () => {
        const phoneNumber = member?.phone // Assuming `member` includes `phone`
        const messageContent = message.trim()

        if (!phoneNumber || !messageContent) {
            alert("Phone number or message is missing!")
            return
        }

        const formData = new FormData()
        formData.append("number", phoneNumber)
        formData.append("message", messageContent)

        // If an image is selected, append it to formData
        if (image) {
            formData.append("image", image)
        }

        try {
            const response = await fetch("http://localhost:5000/sms", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                alert("SMS sent successfully!")
                onClose() // Close modal after sending
            } else {
                alert(`Failed to send SMS: ${result.error}`)
            }
        } catch (error) {
            alert("An error occurred while sending the SMS.")
            console.error(error)
        }
    }

    if (!isOpen) return null

    const isMessageEmpty = !message.trim()

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith("image/")) {
            setImage(file) // Store the image file in state
        } else {
            alert("Please upload a valid image file.")
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[500px] h-[700px] rounded-lg shadow-lg p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Compose SMS</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Recipient Name</label>
                    <input
                        type="text"
                        value={member?.name || ""}
                        readOnly
                        className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Recipient Phone</label>
                    <input
                        type="text"
                        value={member?.phone || ""}
                        readOnly
                        className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4 flex-grow">
                    <label className="block text-gray-700 font-medium mb-2">Message Content</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        className="w-full h-[90%] p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your message here..."
                    ></textarea>
                </div>

                {/* Image upload section */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Attach Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex justify-end mt-auto gap-2">
                    <button
                        onClick={handleSendSMS}
                        disabled={isMessageEmpty}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                            isMessageEmpty
                                ? "bg-gray-300 text-white cursor-not-allowed"
                                : "bg-[#219EBC] text-white hover:bg-[#1b87a1]"
                        }`}
                    >
                        <img
                            src={SendIcon}
                            alt="Send Icon"
                            className={`h-4 w-4 ${isMessageEmpty ? "text-white" : ""}`}
                        />
                        <span className={`${isMessageEmpty ? "text-white" : ""}`}>Send SMS</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SmsModal
