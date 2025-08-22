/* eslint-disable react/prop-types */
import { useState } from "react"
import SendIcon from "../../assets/icons/send-icon.svg" // Use as <img src=... />
import moment from "moment"

const EmailModal = ({ isOpen, onClose, member }) => {
    const [message, setMessage] = useState("")
    const [image, setImage] = useState(null)
    const [selectedGreeting, setSelectedGreeting] = useState(null)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // new state for success modal

    if (!isOpen) return null

    const today = moment().format("MM-DD")

    const greetings = [
        `🎉 Happy Birthday, ${member?.firstName}! Wishing you a day full of love, laughter, and cake! 🍰`,
        `🌟 Cheers to you, ${member?.firstName}! May your birthday sparkle with joy and happiness!`,
        `🎈 Hey ${member?.firstName}, it’s your special day! Celebrate big and enjoy every moment!`,
        `🥳 Happy Birthday, ${member?.firstName}! May your year ahead be as amazing as you are!`,
        `💖 Wishing a wonderful birthday to ${member?.firstName}! May today be filled with smiles and love!`,
    ]

    const generalGreetings = [
        `Dear ${member?.firstName}, we hope this message finds you well. Feel free to reach out if you need assistance.`,
        `Hello ${member?.firstName}, wishing you a pleasant day from all of us at Elderlink!`,
        `Hi ${member?.firstName}, we’re sending you warm regards and hope you’re doing great today!`,
        `Greetings ${member?.firstName}! Remember, Elderlink is always here to support you.`,
        `Dear ${member?.firstName}, just checking in and sending our best wishes!`,
    ]

    const generateGreeting = (idx) => {
        if (member?.dob && today === moment(member.dob).format("MM-DD")) {
            setMessage(greetings[idx])
        } else {
            setMessage(generalGreetings[idx])
        }
        setSelectedGreeting(idx)
    }

    const handleSendEmail = async () => {
        if (!member?.guardianEmail) {
            alert("No recipient email available!")
            return
        }

        const formData = new FormData()
        formData.append("message", message)
        formData.append("subject", "Special Greeting from Elderlink")
        formData.append("recipients", JSON.stringify([member.guardianEmail]))
        if (image) formData.append("image", image)

        try {
            const response = await fetch("http://5.181.217.153:5000/events/send-email", {
                method: "POST",
                body: formData,
            })
            if (response.ok) {
                setIsSuccessModalOpen(true) // Show success modal
            } else {
                console.error("Failed to send email")
            }
        } catch (error) {
            console.error("Error sending email:", error)
        }
    }

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false)
        onClose() // Close the main EmailModal as well
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith("image/")) {
            setImage(file)
        } else {
            alert("Please upload a valid image file.")
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col animate-fadeIn relative">
                <h2 className="text-2xl font-bold text-[#219EBC] mb-4 flex items-center gap-2">✉️ Compose Email</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Recipient Name</label>
                    <input
                        type="text"
                        value={`${member?.firstName || ""} ${member?.middleName || ""} ${member?.lastName || ""}`.trim()}
                        readOnly
                        className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Recipient Guardian Email</label>
                    <input
                        type="email"
                        value={member?.guardianEmail || ""}
                        readOnly
                        className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Select a Greeting</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(member?.dob && today === moment(member.dob).format("MM-DD")
                            ? greetings
                            : generalGreetings
                        ).map((g, idx) => (
                            <button
                                key={idx}
                                onClick={() => generateGreeting(idx)}
                                className={`p-2 rounded-lg border text-left transition-colors duration-200 hover:bg-[#B3E0F2] ${
                                    selectedGreeting === idx
                                        ? "bg-[#B3E0F2] border-[#219EBC]"
                                        : "bg-white border-gray-300"
                                }`}
                            >
                                {g.length > 50 ? g.substring(0, 50) + "..." : g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4 flex-grow">
                    <label className="block text-gray-700 font-medium mb-1">Message Content</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="6"
                        className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                        placeholder="Your message here..."
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Attach Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-auto">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-200">
                        Cancel
                    </button>
                    <button
                        onClick={handleSendEmail}
                        disabled={!message.trim()}
                        className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                            !message.trim()
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#219EBC] hover:bg-[#1b8aa0] transition-colors duration-200"
                        }`}
                    >
                        <img src={SendIcon} alt="Send" className="h-4 w-4" />
                        Send Email
                    </button>
                </div>

                {/* Success Modal */}
                {isSuccessModalOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center rounded-2xl">
                        <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 w-64">
                            <h3 className="text-xl font-bold text-[#219EBC]">✅ Email Sent!</h3>
                            <button
                                onClick={closeSuccessModal}
                                className="px-4 py-2 bg-[#219EBC] text-white rounded-lg hover:bg-[#1b8aa0]"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmailModal
