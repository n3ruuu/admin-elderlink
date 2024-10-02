import SearchIcon from "../../assets/icons/search.svg"
import { useState } from "react"

const DashboardHeader = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
        // Implement search logic, such as filtering results based on searchQuery and selectedCategory
    }

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value)
        // Implement category filter logic
    }

    return (
        <div className="p-16 w-full pb-8 flex items-start">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Dashboard</h1>
                <p className="text-[#767171CC] mt-3">
                    Overview of key metrics and activities
                </p>
            </div>
            <div className="flex items-start justify-end w-1/2 text-[#76717180]">
                <div className="relative w-1/2">
                    <input
                        type="search"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
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
                    value={selectedCategory}
                    onChange={handleCategoryChange}
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

export default DashboardHeader
