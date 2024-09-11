/* eslint-disable react/prop-types */
import FilterIcon from "../../assets/icons/filter.svg"

const FilterButtons = ({ filter, setFilter }) => (
    <div className="flex text-[20px] gap-5 justify-between">
        <div className="flex gap-2 items-center">
            <div className="flex items-center">
                <img className="h-5" src={FilterIcon} alt="Filter Icon" />
                <p className="text-[#219EBC] ml-2">Filter:</p>
                <div className="flex border border-[#219EBC] rounded-2xl ml-2">
                    {["all", "pending", "approved", "denied", "incomplete"].map(
                        (status) => (
                            <button
                                key={status}
                                className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] ${status === "incomplete" ? "rounded-r-xl" : "rounded-l-xl"} px-4 py-2 hover:bg-[#219EBC] hover:text-white ${filter === status ? "bg-[#219EBC] text-white" : ""}`}
                                onClick={() => setFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                            </button>
                        ),
                    )}
                </div>
            </div>
        </div>
    </div>
)

export default FilterButtons
