/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/search.svg"

const Header = ({ handleOpenModal, setSearchTerm }) => {
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value) // Update search term on change
    }

    return (
        <div className="p-16 w-full pb-8  flex">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Members List</h1>
                <p className="text-[#767171CC] mt-3">
                    Access and update member profiles
                </p>
            </div>
            <div className="flex w-1/2 justify-end gap-5 items-start text-[#333333]">
                {/* Search Bar */}
                <div className="w-[60%]">
                    <div className="relative w-full max-w-md">
                        <div className="relative w-full">
                            <input
                                type="search"
                                name="search"
                                id="search"
                                className="p-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                                placeholder="Search..."
                                onChange={handleSearchChange} // Set search term on change
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
                    onClick={() => handleOpenModal(null)}
                >
                    &#43; Add Member
                </button>
            </div>
        </div>
    )
}

export default Header
