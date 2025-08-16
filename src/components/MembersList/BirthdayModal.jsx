/* eslint-disable react/prop-types */
import { useState } from "react"
import SendIcon from "../../assets/icons/send-icon.svg"
import moment from "moment"
import EmailModal from "./EmailModal"

const BirthdayModal = ({ isOpen, onClose, upcomingBirthdays }) => {
    const [isSMSModalOpen, setIsSMSModalOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)

    if (!isOpen) return null

    const today = moment()

    const openSMSModal = (member) => {
        setSelectedMember(member)
        setIsSMSModalOpen(true)
    }

    const closeSMSModal = () => {
        setIsSMSModalOpen(false)
        setSelectedMember(null)
    }

    const sortedBirthdays = [...upcomingBirthdays].sort((a, b) => a.firstName.localeCompare(b.firstName))

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#219EBC]">Birthday Today 🎉</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-3xl font-bold transition-colors duration-300"
                    >
                        &times;
                    </button>
                </div>

                {/* Birthday cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {sortedBirthdays.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No birthdays today 🎂</p>
                    ) : (
                        sortedBirthdays.map((member) => {
                            const memberBirthday = moment(member.dob).format("MM-DD")
                            const memberFullName =
                                `${member.firstName || ""} ${member.middleName || ""} ${member.lastName || ""}`.trim()
                            const isToday = memberBirthday === today.format("MM-DD")

                            return (
                                <div
                                    key={member.id}
                                    className={`p-4 rounded-xl flex flex-col justify-between transition-transform duration-300 hover:scale-105 border ${
                                        isToday ? "border-[#219EBC]" : "border-gray-300"
                                    } bg-white`}
                                >
                                    <div>
                                        <h3
                                            className={`text-lg font-semibold ${
                                                isToday ? "text-[#219EBC]" : "text-gray-800"
                                            }`}
                                        >
                                            {memberFullName}
                                        </h3>
                                        <p className="text-gray-600">{moment(member.dob).format("MMMM D")}</p>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <img
                                            src={SendIcon}
                                            alt="Send Icon"
                                            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-200"
                                            title="Send Birthday Email"
                                            onClick={() => openSMSModal(member)}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {selectedMember && <EmailModal isOpen={isSMSModalOpen} onClose={closeSMSModal} member={selectedMember} />}
        </div>
    )
}

export default BirthdayModal
