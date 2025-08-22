/* eslint-disable react/prop-types */

const ViewModeSwitcher = ({ filter, handleFilterChange }) => {
    return (
        <div className="flex pl-16 pb-8 text-[20px] gap-5 justify-between">
            <div className="flex gap-2 items-center">
                <div className="flex items-center">
                    <div className="flex border border-[#219EBC] rounded-xl ">
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] rounded-l-lg px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "members" ? "bg-[#219EBC] text-white" : ""
                            }`}
                            onClick={() => handleFilterChange("members")}
                        >
                            Members
                        </button>
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] border-r px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "health" ? "bg-[#219EBC] text-white" : ""
                            }`}
                            onClick={() => handleFilterChange("health")}
                        >
                            Health
                        </button>
                        {/* <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] border-r px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "finance" ? "bg-[#219EBC] text-white" : ""
                            }`}
                            onClick={() => handleFilterChange("finance")}
                        >
                            Finance
                        </button> */}
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] border-r px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "events" ? "bg-[#219EBC] text-white" : ""
                            }`}
                            onClick={() => handleFilterChange("events")}
                        >
                            Events
                        </button>
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC]  px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "news" ? "bg-[#219EBC] text-white" : ""
                            }`}
                            onClick={() => handleFilterChange("news")}
                        >
                            News
                        </button>
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] border-l border-l-[#219EBC] px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "forms" ? "bg-[#219EBC] text-white" : ""
                            }`}
                            onClick={() => handleFilterChange("forms")}
                        >
                            Forms
                        </button>
                        <button
                            className={`border-1 border-[#219EBC] text-[#219EBC] border-l border-l-[#219EBC] rounded-r-lg px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                filter === "reports" ? "bg-[#219EBC] text-white" : ""
                            }`}
                            onClick={() => handleFilterChange("reports")}
                        >
                            Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewModeSwitcher
