/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/search.svg"

const Header = ({ onOpenModal, searchQuery, onSearchChange }) => {
    return (
        <div className="p-16 w-full pb-8 flex ">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Manage Events</h1>
                <p className="text-[#767171CC] mt-3">Plan and coordinate events</p>
            </div>
            <div className="flex items-start gap-5 justify-end w-1/2 text-[#333333]">
                <div className="w-[60%]">
                    <div className="relative w-full max-w-md">
                        <div className="relative w-full">
                            <input
                                type="search"
                                name="search"
                                id="search"
                                value={searchQuery} // Bind value to searchQuery
                                onChange={onSearchChange} // Handle search input change
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
                    &#43; Add Events
                </button>
            </div>
        </div>
    )
}

export default Header
