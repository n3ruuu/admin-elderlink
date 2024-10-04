/* eslint-disable react/prop-types */
import FilterIcon from "../../assets/icons/filter.svg"

const ViewModeSwitcher = ({ filter, handleFilterChange }) => {
    return (
        <div className="flex pl-16 pb-8 text-[20px] gap-5 justify-between">
            <div className="flex gap-2 items-center">
                <div className="flex items-center">
                    <img className="h-5" src={FilterIcon} alt="Filter Icon" />
                    <p className="text-[#219EBC] ml-2">Filter:</p>
                    <div className="flex border border-[#219EBC] rounded-2xl ml-2">
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] rounded-l-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "members"
                                    ? "bg-[#219EBC] text-white"
                                    : ""
                            }`}
                            onClick={() => handleFilterChange("members")}
                        >
                            Members
                        </button>
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "health"
                                    ? "bg-[#219EBC] text-white"
                                    : ""
                            }`}
                            onClick={() => handleFilterChange("health")}
                        >
                            Health
                        </button>
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] border-l border-l-[#219EBC] rounded-r-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "finance"
                                    ? "bg-[#219EBC] text-white"
                                    : ""
                            }`}
                            onClick={() => handleFilterChange("finance")}
                        >
                            Finance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewModeSwitcher
