/* eslint-disable react/prop-types */
import { useState } from "react"
import moment from "moment"
import SendIcon from "../../assets/icons/send-icon.svg"
import EmailModal from "./EmailModal" // Import the EmailModal component

const BirthdayModal = ({ isOpen, onClose, upcomingBirthdays }) => {
    const [isSMSModalOpen, setIsSMSModalOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)
    const [currentPage, setCurrentPage] = useState(1) // Track current page
    const itemsPerPage = 15 // Set the number of items per page

    if (!isOpen) return null // Don't render if modal is not open

    const today = moment() // Get the current date

    const openSMSModal = (member) => {
        setSelectedMember(member)
        setIsSMSModalOpen(true)
    }

    const closeSMSModal = () => {
        setIsSMSModalOpen(false)
        setSelectedMember(null)
    }

    // Function to get the next occurrence of a birthday
    const getNextBirthday = (dob) => {
        const birthdayThisYear = moment(dob).year(today.year())
        if (birthdayThisYear.isBefore(today, "day")) {
            // If the birthday has passed this year, get it for next year
            return birthdayThisYear.add(1, "year")
        }
        return birthdayThisYear
    }

    // Sort the upcomingBirthdays by their next birthday occurrence
    const sortedBirthdays = [...upcomingBirthdays].sort((a, b) => {
        const nextBirthdayA = getNextBirthday(a.dob)
        const nextBirthdayB = getNextBirthday(b.dob)

        return nextBirthdayA.isBefore(nextBirthdayB) ? -1 : 1
    })

    // Get the current page's members
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedMembers = sortedBirthdays.slice(startIndex, endIndex)

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // Calculate the total number of pages
    const totalPages = Math.ceil(sortedBirthdays.length / itemsPerPage)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[80%] text-left relative md:w-[30%]">
                <h2 className="text-xl font-bold mb-4">Upcoming Birthdays</h2>
                <button onClick={onClose} className="text-[#333333] text-2xl absolute top-4 right-5">
                    &times; {/* Close button */}
                </button>
                <ul>
                    {paginatedMembers.map((member) => {
                        const memberBirthday = moment(member.dob).format("MM-DD") // Format member's birthday to MM-DD
                        const memberFullName =
                            `${member.firstName || ""} ${member.middleName || ""} ${member.lastName || ""}`.trim()

                        return (
                            <li key={member.id} className="flex items-center justify-between mb-2">
                                <div>
                                    <span
                                        className={
                                            memberBirthday === today.format("MM-DD")
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
                                            memberBirthday === today.format("MM-DD")
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
                                        title="Send Birthday Email" // Tooltip for the send icon
                                        onClick={() => openSMSModal(member)} // Open SMS modal on icon click
                                    />
                                </div>
                            </li>
                        )
                    })}
                </ul>

                {/* Pagination controls */}
                <div className="mt-4 flex justify-center items-center space-x-4">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                    >
                        Previous
                    </button>

                    {/* Page number display */}
                    <span className="px-4 py-2 text-[#219EBC]">
                        Page {currentPage} of {totalPages}
                    </span>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                    >
                        Next
                    </button>
                </div>
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
