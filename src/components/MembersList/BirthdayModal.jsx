/* eslint-disable react/prop-types */
import { useState } from "react"
import moment from "moment"
import SendIcon from "../../assets/icons/send-icon.svg"
import EmailModal from "./EmailModal" // Import the EmailModal component

const BirthdayModal = ({ isOpen, onClose, upcomingBirthdays }) => {
    const [isSMSModalOpen, setIsSMSModalOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)

    if (!isOpen) return null // Don't render if modal is not open

    const today = moment().format("MM-DD") // Get today's date in MM-DD format

    const openSMSModal = (member) => {
        setSelectedMember(member)
        setIsSMSModalOpen(true)
    }

    const closeSMSModal = () => {
        setIsSMSModalOpen(false)
        setSelectedMember(null)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[80%] text-left relative md:w-[30%]">
                <h2 className="text-xl font-bold mb-4">Upcoming Birthdays</h2>
                <button onClick={onClose} className="text-[#333333] text-2xl absolute top-4 right-5">
                    &times; {/* Close button */}
                </button>
                <ul>
                    {upcomingBirthdays.map((member) => {
                        const memberBirthday = moment(member.dob).format("MM-DD") // Format member's birthday to MM-DD
                        const memberFullName =
                            `${member.firstName || ""} ${member.middleName || ""} ${member.lastName || ""}`.trim()

                        return (
                            <li key={member.id} className="flex items-center justify-between mb-2">
                                <div>
                                    <span
                                        className={
                                            memberBirthday === today
                                                ? "text-red-500 font-bold" // Apply red color if it's the member's birthday
                                                : ""
                                        }
                                    >
                                        {memberFullName}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={
                                            memberBirthday === today
                                                ? "text-red-500 font-bold" // Apply red color if it's the member's birthday
                                                : ""
                                        }
                                    >
                                        {moment(member.dob).format("MMMM D")}
                                    </span>
                                    <img
                                        src={SendIcon}
                                        alt="Send Icon"
                                        className="w-5 h-5 cursor-pointer"
                                        onClick={() => openSMSModal(member)} // Open SMS modal on icon click
                                    />
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* EmailModal for sending message */}
            {selectedMember && (
                <EmailModal
                    isOpen={isSMSModalOpen}
                    onClose={closeSMSModal}
                    member={selectedMember} // Pass selected member to EmailModal
                />
            )}
        </div>
    )
}

export default BirthdayModal
