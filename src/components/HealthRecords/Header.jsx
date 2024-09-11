/* eslint-disable react/prop-types */
import { useState } from "react"
import SearchIcon from "../../assets/icons/search.svg"

const Section = ({ onOpenModal }) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    return (
        <div className="p-16 w-full pb-8 flex items-start">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Health Records</h1>
                <p className="text-[#767171CC] mt-3">
                    Maintain comprehensive health records
                </p>
            </div>
            <div className="flex items-start w-1/2 text-[#76717180]">
                <div className="relative w-full">
                    <input
                        type="search"
                        name="search"
                        id="search"
                        className="p-3 pr-12 border border-gray-300 border-r-0 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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
                <button
                    className="text-[#F5F5FA] bg-[#219EBC] w-full px-8 ml-4 text-[24px] py-2 rounded-xl"
                    onClick={() => onOpenModal(null)} // Open modal for new member
                >
                    &#43; Add New Record
                </button>
            </div>
        </div>
    )
}

export default Section
