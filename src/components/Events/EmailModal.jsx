/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import SendIcon from "../../assets/icons/send-icon.svg"

const EmailModal = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState("")
    const [recipients, setRecipients] = useState([])
    const [members, setMembers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredMembers, setFilteredMembers] = useState([])
    const [image, setImage] = useState(null)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // New state for success

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://5.181.217.153:5000/members")
                const data = await response.json()
                setMembers(data)
            } catch (error) {
                console.error("Error fetching members:", error)
            }
        }

        if (isOpen) fetchMembers()
    }, [isOpen])

    useEffect(() => {
        if (searchTerm) {
            const filtered = members.filter((member) => {
                const fullName = `${member.firstName} ${member.middleName || ""} ${member.lastName}`
                return fullName.toLowerCase().includes(searchTerm.toLowerCase())
            })
            setFilteredMembers(filtered)
        } else {
            setFilteredMembers([])
        }
    }, [searchTerm, members])

    const handleSendEmail = async () => {
        if (!message.trim() || recipients.length === 0) return

        const formData = new FormData()
        formData.append("message", message)
        formData.append("subject", "Event Notice!")
        formData.append("recipients", JSON.stringify(recipients.map((r) => r.trimEnd())))
        if (image) formData.append("image", image)

        try {
            const response = await fetch("http://5.181.217.153:5000/events/send-email", {
                method: "POST",
                body: formData,
            })
            if (response.ok) {
                setIsSuccessModalOpen(true) // Show success modal
            } else console.error("Failed to send email")
        } catch (error) {
            console.error("Error sending email:", error)
        }
    }

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false)
        onClose() // Close main EmailModal as well
    }

    const addRecipient = (guardianEmail) => {
        if (!recipients.includes(guardianEmail)) setRecipients((prev) => [...prev, guardianEmail])
        setSearchTerm("")
        setFilteredMembers([])
    }

    const toggleAllSeniorCitizens = () => {
        const gmailAddresses = members
            .map((member) => member.guardianEmail)
            .filter((email) => email?.includes("@gmail.com"))

        if (recipients.includes("All Senior Citizens")) {
            setRecipients([])
        } else {
            setRecipients([...new Set([...recipients, ...gmailAddresses])])
        }
        setSearchTerm("")
        setFilteredMembers([])
    }

    const removeRecipient = (guardianEmail) => {
        setRecipients(recipients.filter((r) => r !== guardianEmail))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) setImage(file)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-[500px] h-[800px] rounded-2xl shadow-2xl p-6 flex flex-col relative">
                <h2 className="text-2xl font-bold text-[#219EBC] mb-4 flex items-center gap-2">✉️ Compose Email</h2>

                {/* Recipients */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Recipients:</label>
                    <div className="flex mb-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search names or emails..."
                            className="p-2 border border-gray-300 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
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
                                    className="p-2 hover:bg-[#e0f4fb] cursor-pointer"
                                    onClick={() => addRecipient(member.guardianEmail)}
                                >
                                    {member.firstName} {member.middleName && `${member.middleName} `} {member.lastName}{" "}
                                    ({member.guardianEmail})
                                </div>
                            ))}
                        </div>
                    )}

                    {recipients.length > 0 && (
                        <div className="mt-2">
                            <p className="font-medium">Selected Recipients:</p>
                            <div className="flex flex-wrap">
                                {recipients.map((recipient, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-[#e0f4fb] text-[#219EBC] rounded-full px-2 py-1 mr-2 mb-2 flex items-center"
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

                {/* Message */}
                <div className="mb-4 flex-grow">
                    <label className="block text-gray-700 font-medium mb-2">Message Content:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        className="w-full h-[90%] p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#219EBC]"
                        placeholder="Enter your message here..."
                    ></textarea>
                </div>

                {/* Image */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Upload Image:</label>
                    <input type="file" onChange={handleImageChange} className="p-2 border border-gray-300 rounded-lg" />
                    {image && (
                        <div className="mt-2">
                            <p className="text-gray-700">Selected Image:</p>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="w-32 h-32 object-cover mt-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-auto gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSendEmail}
                        disabled={!message.trim() || recipients.length === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                            !message.trim() || recipients.length === 0
                                ? "bg-gray-300 text-white cursor-not-allowed"
                                : "bg-[#219EBC] text-white hover:bg-[#1b87a1]"
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
                                className="px-4 py-2 bg-[#219EBC] text-white rounded-lg hover:bg-[#1b87a1]"
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
