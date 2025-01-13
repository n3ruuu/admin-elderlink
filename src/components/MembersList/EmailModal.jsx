import { useState } from "react"
import SendIcon from "../../assets/icons/send-icon.svg"
import moment from "moment" // Import moment.js

const EmailModal = ({ isOpen, onClose, member }) => {
    const [message, setMessage] = useState("")
    const [image, setImage] = useState(null)

   // Function to generate a personalized birthday greeting
const generateBirthdayGreeting = () => {
    if (member?.dob) {
        // Get the member's birthday in MM-DD format (ignoring the year)
        const memberBirthday = moment(member.dob).format("MM-DD")
        const today = moment().format("MM-DD") // Get today's date in MM-DD format

        console.log(memberBirthday, today)
        // Check if today's month and day match the member's birthday (ignoring the year)
        if (today === memberBirthday) {
            setMessage(`Dear ${member.firstName},\n\nWishing you a very Happy Birthday! 🎉 May this special day bring you joy, peace, and all the happiness you deserve.\n\nBest regards,\nElderlink Team`)
        } else {
            setMessage(`Dear ${member.firstName},\n\nWe hope this message finds you in good health and spirits. Should you need any assistance, please feel free to reach out.\n\nBest regards,\nElderlink Team`)
        }
    }
}

    const handleSendEmail = async () => {
        const formData = new FormData()
        formData.append("message", message)
        formData.append("subject", "Greeting Notice!"); 
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
                alert("Email sent successfully!")
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
