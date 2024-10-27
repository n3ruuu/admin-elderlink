/* eslint-disable react/prop-types */

const ViewModeSwitcher = ({ handleViewModeChange, viewMode }) => {
    return (
        <div className="flex text-[20px] gap-5 justify-between">
            <div className="flex border border-[#219EBC] rounded-2xl w-[250px]">
                <button
                    className={`border-1 border-[#219EBC] w-1/2 text-[#219EBC] border-r border-r-[#219EBC] rounded-l-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                        viewMode === "list" ? "bg-[#219EBC] text-white" : ""
                    }`}
                    onClick={() => handleViewModeChange("list")}
                >
                    List
                </button>
                <button
                    className={`border-1 border-[#219EBC] w-1/2 text-[#219EBC] rounded-r-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                        viewMode === "calendar" ? "bg-[#219EBC] text-white" : ""
                    }`}
                    onClick={() => handleViewModeChange("calendar")}
                >
                    Calendar
                </button>
            </div>
        </div>
    )
}

export default ViewModeSwitcher
