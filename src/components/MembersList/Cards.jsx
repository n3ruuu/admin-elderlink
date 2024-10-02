/* eslint-disable react/prop-types */
import TotalNumberIcon from "../../assets/icons/total-senior.svg"
import BirthdayIcon from "../../assets/icons/birthday.svg"
import RegisteredIcon from "../../assets/icons/registered.svg"

const Cards = ({ membersData }) => {
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
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#FFF1F8] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={BirthdayIcon} alt="Birthday Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">15</h3>
                    <p className="text-[24px]">Upcoming Birthdays</p>
                </div>
            </div>
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#FFF5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={RegisteredIcon} alt="Newly Registered Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">10</h3>
                    <p className="text-[24px]">Newly Registered</p>
                </div>
            </div>
        </div>
    )
}

export default Cards
