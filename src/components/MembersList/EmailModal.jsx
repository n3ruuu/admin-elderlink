/* eslint-disable react/prop-types */
import { useState } from "react"
import SendIcon from "../../assets/icons/send-icon.svg"

const EmailModal = ({ isOpen, onClose, member }) => {
    const [message, setMessage] = useState("")
    const [image, setImage] = useState(null)

    // Function to generate a personalized greeting
    const generateBirthdayGreeting = () => {
        if (member?.birthday) {
            const birthday = new Date(member?.birthday)
            const currentDate = new Date()

            // Check if today is the recipient's birthday
            if (birthday.getMonth() === currentDate.getMonth() && birthday.getDate() === currentDate.getDate()) {
                setMessage(
                    `🎉 Happy Birthday, ${member?.firstName || "there"}! 🎂\n\n` +
                        `Wishing you an incredible day filled with love, laughter, and all your favorite things! May this year bring you happiness, success, and endless blessings! Enjoy your special day! 🥳`,
                )
            } else if (birthday > currentDate) {
                const daysLeft = Math.ceil((birthday - currentDate) / (1000 * 60 * 60 * 24))
                setMessage(
                    `Hello ${member?.firstName || "there"}! 😊\n\n` +
                        `Just ${daysLeft} more days until your special day! We hope your upcoming birthday is as amazing as you are. Here's to a celebration full of joy and memorable moments! 🎈`,
                )
            } else {
                setMessage(
                    `Hello ${member?.firstName || "there"}! 🌟\n\n` +
                        `We hope you're doing great! Remember to cherish the small joys and celebrate each day. Let us know if there's anything we can do for you. Take care!`,
                )
            }
        } else {
            setMessage(
                `Hi there! 😊\n\n` +
                    `Just a quick note to let you know that we're thinking about you! Wishing you a wonderful day filled with positivity and good vibes. Stay awesome!`,
            )
        }
    }

    const handleSendEmail = async () => {
        const formData = new FormData()
        formData.append("message", message)
        formData.append("recipients", JSON.stringify([member?.guardianEmail])) // Send the recipient email as a list

        if (image) {
            formData.append("image", image)
        }

        try {
            const response = await fetch("http://localhost:5000/events/send-email", {
                method: "POST",
                body: formData,
            })
            if (response.ok) {
                console.log("Email sent successfully!")
                onClose() // Close the modal after sending the email
            } else {
                console.error("Failed to send email")
            }
        } catch (error) {
            console.error("Error sending email:", error)
        }
    }

    if (!isOpen) return null

    const isMessageEmpty = !message.trim()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith("image/")) {
            setImage(file)
        } else {
            alert("Please upload a valid image file.")
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[500px] h-[700px] rounded-lg shadow-lg p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Recipient Name</label>
                    <input
                        type="text"
                        value={`${member?.firstName || ""} ${member?.middleName || ""} ${member?.lastName || ""}`.trim()}
                        readOnly
                        className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Recipient Guardian Email</label>
                    <input
                        type="email"
                        value={member?.guardianEmail || ""}
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

                {/* Add the Generate Greeting button */}
                <div className="mb-4">
                    <button
                        onClick={generateBirthdayGreeting}
                        className="bg-[#219EBC] text-white px-4 py-2 rounded-lg hover:bg-[#1b87a1] transition duration-200"
                    >
                        Generate Greeting
                    </button>
                </div>

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
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSendEmail}
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
                        <span className={`${isMessageEmpty ? "text-white" : ""}`}>Send Email</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmailModal
