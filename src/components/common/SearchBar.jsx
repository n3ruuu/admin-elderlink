/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/search.svg"
import FilterIcon from "../../assets/icons/filter-icon.svg"

const SearchBar = () => {
    return (
        <div className="relative w-full max-w-md">
            <div className="relative w-full">
                <input
                    type="search"
                    name="search"
                    id="search"
                    className="p-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                    placeholder="Search..."
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
    )
}

export default SearchBar
