/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/search.svg"

const Header = ({ onOpenModal, searchTerm, onSearchChange }) => {
    return (
        <div className="p-16 w-full pb-8 flex justify-between">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Financial Assistance</h1>
                <p className="text-[#767171CC] mt-3">
                    Manage finances and benefits
                </p>
            </div>
            <div className="flex justify-end gap-5 w-1/2 items-start text-[#333333]">
                <div className="w-[60%]">
                    <div className="relative w-full max-w-md">
                        <div className="relative w-full">
                            <input
                                type="search"
                                name="search"
                                id="search"
                                value={searchTerm} // Bind the search term here
                                onChange={onSearchChange} // Call onSearchChange to update state
                                className="p-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                                placeholder="Search..."
                            />
                            <img
                                src={SearchIcon}
                                alt="Search Icon"
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    className="text-[#F5F5FA] bg-[#219EBC] px-8 text-[24px] py-2 rounded-lg hover:bg-[#1A7F8C]"
                    onClick={onOpenModal}
                >
                    &#43; Add Benefit
                </button>
            </div>
        </div>
    )
}

export default Header
