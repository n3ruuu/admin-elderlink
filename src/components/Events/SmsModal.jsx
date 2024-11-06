/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import SendIcon from "../../assets/icons/send-icon.svg"

const SmsModal = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState("")
    const [recipients, setRecipients] = useState([])
    const [members, setMembers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredMembers, setFilteredMembers] = useState([])

    // Fetch members when the modal opens
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:5000/members")
                const data = await response.json()
                setMembers(data) // Assuming data is an array of member objects
            } catch (error) {
                console.error("Error fetching members:", error)
            }
        }

        if (isOpen) {
            fetchMembers()
        }
    }, [isOpen])

    useEffect(() => {
        // Filter members based on the search term
        if (searchTerm) {
            const filtered = members.filter((member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            setFilteredMembers(filtered)
        } else {
            setFilteredMembers([])
        }
    }, [searchTerm, members])

    const handleSendSMS = () => {
        console.log("Sending SMS to:", recipients, "Message:", message)
        onClose()
    }

    const addRecipient = (name) => {
        if (!recipients.includes(name)) {
            setRecipients((prev) => [...prev, name])
        }
        setSearchTerm("") // Clear the search term after selection
        setFilteredMembers([]) // Clear suggestions
    }

    const toggleAllSeniorCitizens = () => {
        if (recipients.includes("All Senior Citizens")) {
            setRecipients(recipients.filter((r) => r !== "All Senior Citizens"))
        } else {
            setRecipients(["All Senior Citizens"])
        }
        setSearchTerm("") // Clear search term
        setFilteredMembers([]) // Clear suggestions
    }

    const removeRecipient = (name) => {
        setRecipients(recipients.filter((recipient) => recipient !== name))
    }

    if (!isOpen) return null

    const isMessageEmpty = !message.trim()
    const isRecipientsEmpty = recipients.length === 0

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[500px] h-[700px] rounded-lg shadow-lg p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Compose SMS</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Recipients:
                    </label>
                    <div className="flex mb-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search names..."
                            className="p-2 border border-gray-300 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={toggleAllSeniorCitizens}
                            className={`ml-2 px-4 py-2 rounded-lg transition duration-200 ${
                                recipients.includes("All Senior Citizens")
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        >
                            {recipients.includes("All Senior Citizens")
                                ? "Remove All"
                                : "All Senior Citizens"}
                        </button>
                    </div>
                    {filteredMembers.length > 0 &&
                        !recipients.includes("All Senior Citizens") && (
                            <div className="border border-gray-300 rounded-lg max-h-40 overflow-auto">
                                {filteredMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() =>
                                            addRecipient(member.name)
                                        }
                                    >
                                        {member.name}
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
                                            onClick={() =>
                                                removeRecipient(recipient)
                                            }
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
                    <label className="block text-gray-700 font-medium mb-2">
                        Message Content:
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        className="w-full h-[90%] p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your message here..."
                    ></textarea>
                </div>
                <div className="flex justify-end mt-auto gap-2">
                    <button
                        onClick={handleSendSMS}
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
                        <span
                            className={`${isMessageEmpty || isRecipientsEmpty ? "text-white" : ""}`}
                        >
                            Send SMS
                        </span>
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
