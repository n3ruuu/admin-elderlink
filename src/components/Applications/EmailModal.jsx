/* eslint-disable react/prop-types */
import { useState } from "react";
import SendIcon from "../../assets/icons/send-icon.svg";

const EmailModal = ({ isOpen, onClose, recipients }) => {
    const [message, setMessage] = useState("");

    const handleSendEmail = async () => {
        const formData = new FormData();
        formData.append("subject", "Application Rejected!"); // Set subject to "Application Rejected!"
        formData.append("message", message);
    
        // Clean recipient emails to remove whitespace
        const sanitizedRecipients = recipients.map((email) => email.trimEnd()); // Use trimEnd to clean trailing spaces
        formData.append("recipients", JSON.stringify(sanitizedRecipients));
    
        try {
            const response = await fetch("http://localhost:5000/events/send-email", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                console.log("Email sent successfully!");
                alert("Email sent successfully!");
                onClose(); // Close the modal after sending the email
            } else {
                console.error("Failed to send email");
            }
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };
    

    if (!isOpen) return null;

    const isMessageEmpty = !message.trim();
    const isRecipientsEmpty = recipients.length === 0;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[500px] h-[700px] rounded-lg shadow-lg p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Recipient:</label>
                    <div className="flex mb-2">
                        <div
                            type="text"
                            className="p-4 border border-gray-300 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {recipients.join(", ")} 
                        </div>
                    </div>
                </div>
                <div className="mb-4 flex-grow">
                    <label className="block text-gray-700 font-medium mb-2">Reason for rejection:</label>
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
    );
};

export default EmailModal;
