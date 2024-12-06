/* eslint-disable react/prop-types */
import BeneficiariesIcon from "../../assets/icons/beneficiaries.svg"
import DisburseIcon from "../../assets/icons/disburse.svg"
import PayoutIcon from "../../assets/icons/payout.svg"

const Cards = ({ totalBeneficiaries, monthlyTotalPayouts, upcomingPayouts }) => (
    <div className="flex gap-5 mb-5">
        <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
            <div className="bg-[#EDFFEE] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                <img src={BeneficiariesIcon} alt="Total Number Icon" />
            </div>
            <div className="flex flex-col">
                <h3 className="font-bold text-5xl">{totalBeneficiaries}</h3>
                <p className="text-[24px]">Total Beneficiaries</p>
            </div>
        </div>
        <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
            <div className="bg-[#FFF5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                <img src={DisburseIcon} alt="Recent Transactions Icon" />
            </div>
            <div className="flex flex-col">
                <h3 className="font-bold text-5xl">{monthlyTotalPayouts}</h3>
                <p className="text-[24px]">Monthly Total Payouts</p>
            </div>
        </div>
        <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
            <div className="bg-[#FFF1F8] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                <img src={PayoutIcon} alt="Upcoming Payouts Icon" />
            </div>
            <div className="flex flex-col">
                <h3 className="font-bold text-5xl">{upcomingPayouts}</h3>
                <p className="text-[24px]">Upcoming Payouts</p>
            </div>
        </div>
    </div>
)

export default Cards
