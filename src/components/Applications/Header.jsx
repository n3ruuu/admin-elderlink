/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/search.svg"

const Header = ({ searchQuery, setSearchQuery }) => (
    <div className="p-16 w-full pb-8 flex items-start">
        <div className="w-1/2">
            <h1 className="text-6xl font-bold">Manage Applications</h1>
            <p className="text-[#767171CC] mt-3">
                Streamline application processing and approval workflows
            </p>
        </div>
        <div className="flex w-1/2 items-start justify-end text-[#333333]">
            <div className="w-[60%]">
                <div className="relative w-full max-w-md">
                    <div className="relative w-full">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
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
        </div>
    </div>
)

export default Header
