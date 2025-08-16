/* eslint-disable react/prop-types */
import { useState } from "react"
import TotalNumberIcon from "../../assets/icons/total-senior.svg"
import BirthdayIcon from "../../assets/icons/birthday.svg"
import RegisteredIcon from "../../assets/icons/registered.svg"
import moment from "moment"
import BirthdayModal from "./BirthdayModal"

const Cards = ({ membersData }) => {
    const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false)
    const today = moment()

    // Filter members whose birthday is today
    const birthdaysToday = membersData.filter((member) => {
        const birthDate = moment(member.dob)
        return birthDate.date() === today.date() && birthDate.month() === today.month()
    })

    // Calculate newly registered members in the last 30 days
    const thirtyDaysAgo = today.clone().subtract(30, "days")
    const newlyRegistered = membersData.filter((member) => moment(member.registered_at).isAfter(thirtyDaysAgo))

    const handleSeeAllBirthdaysClick = () => {
        setIsBirthdayModalOpen(true)
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
                    <h3 className="font-bold text-5xl">{birthdaysToday.length}</h3>
                    <p className="text-[24px]">Birthday Today</p>
                </div>
                <div
                    onClick={handleSeeAllBirthdaysClick}
                    className="absolute bottom-2 right-5 text-[#FF69B4] cursor-pointer underline"
                >
                    See all birthdays today
                </div>
            </div>
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#FFF5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={RegisteredIcon} alt="Newly Registered Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">{newlyRegistered.length}</h3>
                    <p className="text-[24px]">Newly Registered</p>
                </div>
            </div>

            {/* Birthday Modal */}
            {isBirthdayModalOpen && (
                <BirthdayModal
                    isOpen={isBirthdayModalOpen}
                    onClose={() => setIsBirthdayModalOpen(false)}
                    upcomingBirthdays={birthdaysToday} // Pass today's birthdays
                />
            )}
        </div>
    )
}

export default Cards
