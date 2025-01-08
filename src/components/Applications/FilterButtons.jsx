/* eslint-disable react/prop-types */

const FilterButtons = ({ filter, setFilter }) => (
    <div className="flex text-[20px] gap-5 justify-between">
        <div className="flex gap-2 items-center">
            <div className="flex items-center">
                <div className="flex border border-[#219EBC] rounded-2xl ml-2">
                    {["all", "pending", "approved", "rejected"].map(
                        (status, index, array) => (
                            <button
                                key={status}
                                className={`border-1 border-[#219EBC] text-[#219EBC] ${index === 0 ? "rounded-l-xl" : ""} ${index === array.length - 1 ? "rounded-r-xl" : "border-r"} px-4 py-2 hover:bg-[#219EBC] hover:text-white ${filter === status ? "bg-[#219EBC] text-white" : ""}`}
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
