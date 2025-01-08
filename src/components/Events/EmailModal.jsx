/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import SendIcon from "../../assets/icons/send-icon.svg"

const EmailModal = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState("")
    const [recipients, setRecipients] = useState([]) // Storing guardianEmail addresses
    const [members, setMembers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredMembers, setFilteredMembers] = useState([])
    const [image, setImage] = useState(null) // State to store uploaded image

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:5000/members")
                const data = await response.json()
                setMembers(data) // Assuming data is an array of member objects

                // Log all guardianEmail values
                const guardianEmails = data.map((member) => member.guardianEmail)
                console.log("All Guardian Emails:", guardianEmails)

                // Optional: Log only Gmail addresses
                const gmailAddresses = guardianEmails.filter((email) => email?.includes("@gmail.com"))
                console.log("Gmail Addresses:", gmailAddresses)
            } catch (error) {
                console.error("Error fetching members:", error)
            }
        }

        if (isOpen) {
            fetchMembers()
        }
    }, [isOpen])

    useEffect(() => {
        if (searchTerm) {
            const filtered = members.filter((member) => {
                // Concatenate firstName, middleName, and lastName into full name
                const fullName = `${member.firstName} ${member.middleName || ""} ${member.lastName}`
                return fullName.toLowerCase().includes(searchTerm.toLowerCase())
            })
            setFilteredMembers(filtered)
        } else {
            setFilteredMembers([]) // Clear the filtered members when there's no search term
        }
    }, [searchTerm, members])

    const handleSendEmail = async () => {
        const formData = new FormData()
        formData.append("message", message)

        // Clean recipient emails to remove whitespace
        const sanitizedRecipients = recipients.map((email) => email.trimEnd()) // Use trimEnd to clean trailing spaces
        formData.append("recipients", JSON.stringify(sanitizedRecipients))

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

    const addRecipient = (guardianEmail) => {
        if (!recipients.includes(guardianEmail)) {
            setRecipients((prev) => [...prev, guardianEmail])
        }
        setSearchTerm("") // Clear the search term after selection
        setFilteredMembers([]) // Clear suggestions
    }

    const toggleAllSeniorCitizens = () => {
        // Filter all Gmail addresses from the members list
        const gmailAddresses = members
            .map((member) => member.guardianEmail)
            .filter((email) => email?.includes("@gmail.com"))

        if (recipients.includes("All Senior Citizens")) {
            // Remove all Gmail addresses from recipients
            setRecipients([])
        } else {
            // Add all Gmail addresses to recipients if not already included
            setRecipients([...new Set([...recipients, ...gmailAddresses])])
        }
        setSearchTerm("") // Clear search term
        setFilteredMembers([]) // Clear suggestions
    }

    const removeRecipient = (guardianEmail) => {
        setRecipients(recipients.filter((recipient) => recipient !== guardianEmail))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
        }
    }

    if (!isOpen) return null

    const isMessageEmpty = !message.trim()
    const isRecipientsEmpty = recipients.length === 0

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[500px] h-[700px] rounded-lg shadow-lg p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Recipients:</label>
                    <div className="flex mb-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search names or emails..."
                            className="p-2 border border-gray-300 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={toggleAllSeniorCitizens}
                            className={`ml-2 px-4 py-2 rounded-lg transition duration-200 ${
                                recipients.includes("All Senior Citizens")
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-[#219EBC] text-white hover:bg-[#1b87a1]"
                            }`}
                        >
                            {recipients.includes("All Senior Citizens") ? "Remove All" : "All Senior Citizens"}
                        </button>
                    </div>
                    {filteredMembers.length > 0 && !recipients.includes("All Senior Citizens") && (
                        <div className="border border-gray-300 rounded-lg max-h-40 overflow-auto">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => addRecipient(member.guardianEmail)} // Store guardianEmail
                                >
                                    {member.firstName} {member.middleName && `${member.middleName} `} {member.lastName}{" "}
                                    ({member.guardianEmail}) {/* Display full name and guardianEmail */}
                                </div>
                            ))}
                        </div>
                    )}
                    {recipients.length > 0 && (
                        <div className="mt-2">
                            <p className="font-medium">Selected Recipients:</p>
                            <div className="flex flex-wrap">
                                {recipients.map((recipient, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 mr-2 mb-2 flex items-center"
                                    >
                                        {recipient}
                                        <button
                                            onClick={() => removeRecipient(recipient)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            X
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mb-4 flex-grow">
                    <label className="block text-gray-700 font-medium mb-2">Message Content:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        className="w-full h-[90%] p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your message here..."
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Upload Image:</label>
                    <input type="file" onChange={handleImageChange} className="p-2 border border-gray-300 rounded-lg" />
                    {image && (
                        <div className="mt-2">
                            <p className="text-gray-700">Selected Image:</p>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Uploaded preview"
                                className="w-32 h-32 object-cover mt-2"
                            />
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-auto gap-2">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSendEmail} // Send Email Logic
                        disabled={isMessageEmpty || isRecipientsEmpty}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                            isMessageEmpty || isRecipientsEmpty
                                ? "bg-gray-300 text-white cursor-not-allowed"
                                : "bg-[#219EBC] text-white hover:bg-[#1b87a1]"
                        }`}
                    >
                        <img
                            src={SendIcon}
                            alt="Send Icon"
                            className={`h-4 w-4 ${isMessageEmpty || isRecipientsEmpty ? "text-white" : ""}`}
                        />
                        <span className={`${isMessageEmpty || isRecipientsEmpty ? "text-white" : ""}`}>Send Email</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmailModal
