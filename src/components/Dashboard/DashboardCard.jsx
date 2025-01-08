/* eslint-disable react/prop-types */
const DashboardCard = ({ icon, count, title, bgColor }) => {
    return (
        <div className="bg-white w-[315px] h-[275px] rounded-[12px] p-8 flex flex-col gap-4">
            <div
                className={`${bgColor} w-[70px] h-[70px] p-4 rounded-[20px] flex items-center`}
            >
                <img src={icon} alt={title} />
            </div>
            <h3 className="font-bold text-5xl">{count}</h3>
            <p className="text-[24px]">{title}</p>
        </div>
    )
}

export default DashboardCard
