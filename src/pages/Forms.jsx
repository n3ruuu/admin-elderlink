/* eslint-disable react/no-unescaped-entities */
import { useState } from "react"
import SearchIcon from "../assets/icons/search.svg"
// import ImportIcon from "../assets/icons/import-icon.svg"
import ProvincialIcon from "../assets/provincial.png"
import CityIcon from "../assets/city.png"
import BarangayIcon from "../assets/barangay.png"
import OscaIcon from "../assets/osca.png"
import FormsData from "../data/forms.json"
import NewFolder from "../modals/NewFolder"

const Forms = () => {
    const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)

    const handleNewFolderClick = () => {
        setIsNewFolderOpen(true)
    }

    const closeNewFolder = () => {
        setIsNewFolderOpen(false)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header */}
            <div className="p-16 w-full pb-8 flex items-start">
                <div className="w-1/2">
                    <h1 className="text-6xl font-bold">Form Library</h1>
                    <p className="text-[#767171CC] mt-3">
                        Create forms aligned to the community's need
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
                    <button
                        className="flex items-center justify-center gap-4 text-[#F5F5FA] bg-[#219EBC] w-full px-8 ml-4 text-[24px] py-2 rounded-xl"
                        onClick={handleNewFolderClick}
                    >
                        &#43; New Folder
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap px-16 w-full gap-4 font-[500]">
                <button className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px]">
                    <img src={ProvincialIcon} alt="Provincial Icon" />
                    <p>Provincial Initiatives</p>
                </button>
                <button className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px]">
                    <img src={CityIcon} alt="City Icon" />
                    <p>City Initiatives</p>
                </button>
                <button className="flex pl-8 gap text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px]">
                    <img src={BarangayIcon} alt="Barangay Icon" />
                    <p>Barangay Initiatives</p>
                </button>
                <button className="flex pl-8 gap text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px]">
                    <img src={OscaIcon} alt="OSCA Icon" />
                    <p>OSCA Initiatives</p>
                </button>
            </div>
            <p className="text-[#333333] text-[20px] mx-16 mt-8 mb-4">
                Recent Forms
            </p>
            <table className="w-[90%] bg-[#FFFFFF] rounded-[12px] mx-16 shadow-xl">
                <thead className="font-[100] text-left border-b border-b-1">
                    <tr className="text-[#767171CC]">
                        <th className="font-[500] px-16 py-4">Form Title</th>
                        <th className="font-[500] pl-4">Last Opened</th>
                        <th className="font-[500] pl-4">Category</th>
                        <th className="font-[500] pl-4"></th>{" "}
                        {/* Extra column for the dots */}
                    </tr>
                </thead>
                <tbody>
                    {FormsData.map((form, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            }`}
                            key={form.id}
                        >
                            <td className="px-4 py-2">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={form.imagePath}
                                        alt={form.title}
                                        className="h-12 w-12 object-contain"
                                    />
                                    <span>{form.title}</span>
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                {new Date(form.lastOpened).toLocaleString()}
                            </td>
                            <td className="px-4 py-2">{form.category}</td>
                            <td className="px-4 py-2 text-right pr-8">
                                <button className="text-xl">⋮</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isNewFolderOpen && <NewFolder onClose={closeNewFolder} />}
        </section>
    )
}

export default Forms
