import SearchIcon from "../../assets/icons/search.svg"

const Header = () => {
    return (
        <div className="p-16 w-full pb-8 flex items-start">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Archives</h1>
                <p className="text-[#767171CC] mt-3">
                    Deceased or inactive members of OSCA
                </p>
            </div>
            <div className="flex w-1/2 text-[#76717180] place-content-end">
                <div className="relative">
                    <input
                        type="search"
                        name="search"
                        id="search"
                        className="p-3 pr-12 border border-gray-300 border-r-0 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        placeholder="Search..."
                    />
                    <img
                        src={SearchIcon}
                        alt="Search Icon"
                        className="absolute right-3 top-6 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                    />
                </div>
                <select
                    name="category"
                    id="category"
                    className="p-3 border h-[50px] border-gray-300 rounded-r-xl border-l-1 focus:outline-none"
                >
                    <option className="text-[#000000]" value="all">
                        All Categories
                    </option>
                    <option className="text-[#000000]" value="category1">
                        Category 1
                    </option>
                    <option className="text-[#000000]" value="category2">
                        Category 2
                    </option>
                    <option className="text-[#000000]" value="category3">
                        Category 3
                    </option>
                </select>
            </div>
        </div>
    )
}

export default Header
