/* eslint-disable react/prop-types */
import TotalNumberIcon from "../../assets/icons/total-senior.svg"
import PriorityCareIcon from "../../assets/icons/priority-care.svg"
import RecentUpdatesIcon from "../../assets/icons/recent-updates.svg"

const Cards = ({ totalRecords, recentUpdatesCount, priorityCareCount, onPriorityCareClick }) => {
    return (
        <div className="flex gap-5 mb-5">
            {/* Total Health Records */}
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                <div className="bg-[#EDFFEE] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={TotalNumberIcon} alt="Total Number Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">{totalRecords}</h3>
                    <p className="text-[24px]">Total Health Records</p>
                </div>
            </div>

            {/* Priority Care */}
            <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center relative">
                <div className="bg-[#FFE5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                    <img src={PriorityCareIcon} alt="Priority Care Icon" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-5xl">{priorityCareCount}</h3>
                    <p className="text-[24px]">Priority Care</p>
                </div>

                {/* "See members who need priority care" link */}
                <div
                    onClick={onPriorityCareClick}
                    className="absolute bottom-2 right-5 text-[#FF4D4D] cursor-pointer underline"
                >
                    See members who need priority care
                </div>
            </div>

            {/* Recent Updates */}
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
