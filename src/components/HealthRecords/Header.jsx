/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/search.svg"
import FilterIcon from "../../assets/icons/filter-icon.svg"

const Header = ({ onOpenModal, searchTerm, setSearchTerm }) => {
    return (
        <div className="p-16 w-full pb-8 flex">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Health Records</h1>
                <p className="text-[#767171CC] mt-3">
                    Maintain comprehensive health records
                </p>
            </div>
            <div className="flex justify-end items-start gap-5 w-1/2 text-[#333333]">
                <div className="w-[60%]">
                    <div className="relative w-full max-w-md">
                        <div className="relative w-full">
                            <input
                                type="search"
                                name="search"
                                id="search"
                                className="p-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <img
                                src={SearchIcon}
                                alt="Search Icon"
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                            />
                        </div>
                        <img
                            src={FilterIcon}
                            alt="Filter Icon"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                        />
                    </div>
                </div>

                <button
                    className="text-[#F5F5FA] bg-[#219EBC] px-8 text-[24px] py-2 rounded-lg hover:bg-[#1A7F8C]"
                    onClick={() => onOpenModal(null)} // Open modal for new member
                >
                    &#43; Add Record
                </button>
            </div>
        </div>
    )
}

export default Header
