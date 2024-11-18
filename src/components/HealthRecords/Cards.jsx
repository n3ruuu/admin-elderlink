/* eslint-disable react/prop-types */
import TotalNumberIcon from "../../assets/icons/total-senior.svg"
import PriorityCareIcon from "../../assets/icons/priority-care.svg"
import RecentUpdatesIcon from "../../assets/icons/recent-updates.svg"

const Cards = ({ totalRecords, recentUpdatesCount, priorityCareCount }) => {
    return (
        <div className="flex gap-5 mb-5">
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#EDFFEE] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={TotalNumberIcon} alt="Total Number Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">{totalRecords}</h3>
                    <p className="text-[24px]">Total Health Records</p>
                </div>
            </div>
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#FFE5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={PriorityCareIcon} alt="Priority Care Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">{priorityCareCount}</h3>
                    <p className="text-[24px]">Priority Care</p>
                </div>
            </div>
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#FFF5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={RecentUpdatesIcon} alt="Recent Updates Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">{recentUpdatesCount}</h3>
                    <p className="text-[24px]">Recent Updates</p>
                </div>
            </div>
        </div>
    )
}

export default Cards
