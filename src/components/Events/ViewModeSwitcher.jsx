/* eslint-disable react/prop-types */
import FilterIcon from "../../assets/icons/filter.svg"
import moment from "moment"

const ViewModeSwitcher = ({
    handleViewModeChange,
    viewMode,
    filter,
    handleFilterChange,
}) => {
    return (
        <div className="flex text-[20px] gap-5 justify-between">
            <div className="flex gap-2 items-center">
                {viewMode === "calendar" ? (
                    <div className="flex items-center">
                        <p className="text-[#219EBC] text-[36px] font-bold">
                            {moment().format("MMMM YYYY")}
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <img
                            className="h-5"
                            src={FilterIcon}
                            alt="Filter Icon"
                        />
                        <p className="text-[#219EBC] ml-2">Filter:</p>
                        <div className="flex border border-[#219EBC] rounded-2xl ml-2">
                            <button
                                className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] rounded-l-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                    filter === "all"
                                        ? "bg-[#219EBC] text-white"
                                        : ""
                                }`}
                                onClick={() => handleFilterChange("all")}
                            >
                                All
                            </button>
                            <button
                                className={`border-1 border-[#219EBC] text-[#219EBC] px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                    filter === "ongoing"
                                        ? "bg-[#219EBC] text-white"
                                        : ""
                                }`}
                                onClick={() => handleFilterChange("ongoing")}
                            >
                                Ongoing
                            </button>
                            <button
                                className={`border-1 border-[#219EBC] text-[#219EBC] border-l border-l-[#219EBC] rounded-r-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                    filter === "archived"
                                        ? "bg-[#219EBC] text-white"
                                        : ""
                                }`}
                                onClick={() => handleFilterChange("archived")}
                            >
                                Archived
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex">
                <div>
                    <div className="flex border border-[#219EBC] rounded-2xl w-[250px]">
                        <button
                            className={`border-1 border-[#219EBC] w-1/2 text-[#219EBC] border-r border-r-[#219EBC] rounded-l-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                viewMode === "list"
                                    ? "bg-[#219EBC] text-white"
                                    : ""
                            }`}
                            onClick={() => handleViewModeChange("list")}
                        >
                            List
                        </button>
                        <button
                            className={`border-1 border-[#219EBC] w-1/2 text-[#219EBC] rounded-r-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                viewMode === "calendar"
                                    ? "bg-[#219EBC] text-white"
                                    : ""
                            }`}
                            onClick={() => handleViewModeChange("calendar")}
                        >
                            Calendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewModeSwitcher
