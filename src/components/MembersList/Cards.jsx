/* eslint-disable react/prop-types */
import { useState } from "react"
import TotalNumberIcon from "../../assets/icons/total-senior.svg"
import BirthdayIcon from "../../assets/icons/birthday.svg"
import RegisteredIcon from "../../assets/icons/registered.svg"
import moment from "moment" // Import Moment.js
import BirthdayModal from "./BirthdayModal" // Import the BirthdayModal component

const Cards = ({ membersData }) => {
    const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false) // State for the BirthdayModal
    const currentDate = moment() // Current date
    const currentMonth = currentDate.month() // Get the current month (0-11)

    // Calculate upcoming birthdays
    const upcomingBirthdays = membersData.filter((member) => {
        const birthDate = moment(member.dob) // Parse member's date of birth
        const birthMonth = birthDate.month() // Get birth month (0-11)
        // Check if birthday is in the current month or next month
        if (birthMonth === currentMonth) {
            return birthDate.date() >= currentDate.date() // Birthday is today or later this month
        } else if (birthMonth === (currentMonth + 1) % 12) {
            return true // Birthday is in next month
        }
        return false // Not an upcoming birthday
    })

    // Calculate newly registered members in the last 30 days
    const thirtyDaysAgo = currentDate.clone().subtract(30, "days") // Date 30 days ago
    const newlyRegistered = membersData.filter((member) => {
        const registrationDate = moment(member.registered_at) // Parse member's registration date
        return registrationDate.isAfter(thirtyDaysAgo) // Check if registered within the last 30 days
    })

    const handleSeeAllBirthdaysClick = () => {
        setIsBirthdayModalOpen(true) // Open the BirthdayModal when the "See all upcoming birthdays" is clicked
    }

    return (
        <div className="flex gap-5 mb-5">
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#EDFFEE] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={TotalNumberIcon} alt="Total Number Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">{membersData.length}</h3>
                    <p className="text-[24px]">Total Senior Citizens</p>
                </div>
            </div>
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center relative">
                <div className="bg-[#FFF1F8] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={BirthdayIcon} alt="Birthday Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">
                        {upcomingBirthdays.length}
                    </h3>
                    <p className="text-[24px]">Upcoming Birthdays</p>
                </div>
                {/* Add "See all upcoming birthdays" text with updated color and underline */}
                <div
                    onClick={handleSeeAllBirthdaysClick} // Trigger opening the BirthdayModal
                    className="absolute bottom-2 right-5 text-[#FF69B4] cursor-pointer underline"
                >
                    See all upcoming birthdays
                </div>
            </div>
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#FFF5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={RegisteredIcon} alt="Newly Registered Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">
                        {newlyRegistered.length}
                    </h3>
                    <p className="text-[24px]">Newly Registered</p>
                </div>
            </div>

            {/* Birthday Modal */}
            {isBirthdayModalOpen && (
                <BirthdayModal
                    isOpen={isBirthdayModalOpen}
                    onClose={() => setIsBirthdayModalOpen(false)} // Close the modal
                    upcomingBirthdays={upcomingBirthdays} // Pass the upcoming birthdays data
                />
            )}
        </div>
    )
}

export default Cards
