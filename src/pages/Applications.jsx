import { useState } from "react"
import SearchIcon from "../assets/icons/search.svg"
import FilterIcon from "../assets/icons/filter-icon.svg"
import ApplicationsData from "../data/applications.json"
import EditIcon from "../assets/icons/edit.svg"
import ApproveIcon from "../assets/icons/approve.svg"
import RejectIcon from "../assets/icons/reject.svg"
import PreviewIcon from "../assets/icons/preview.svg"
import PrintIcon from "../assets/icons/print.svg"

const Applications = () => {
    const [filter, setFilter] = useState("all")
    const filteredData = ApplicationsData.filter(
        (item) => filter === "all" || item.status.toLowerCase() === filter,
    )

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header */}
            <div className="p-16 w-full pb-8 flex items-start">
                <div className="w-1/2">
                    <h1 className="text-6xl font-bold">Manage Applications</h1>
                    <p className="text-[#767171CC] mt-3">
                        Streamline application processing and approval workflows
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
            {/* Content */}
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <div className="flex text-[20px] gap-5 justify-between">
                        <div className="flex gap-2 items-center">
                            {/* Conditional rendering of the header or filter */}
                            <div className="flex items-center">
                                <img
                                    className="h-5"
                                    src={FilterIcon}
                                    alt="Filter Icon"
                                />
                                <p className="text-[#219EBC] ml-2">Filter:</p>
                                <div className="flex border border-[#219EBC] rounded-2xl ml-2">
                                    <button
                                        className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] rounded-l-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                            filter === "all"
                                                ? "bg-[#219EBC] text-white"
                                                : ""
                                        }`}
                                        onClick={() => setFilter("all")}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                            filter === "pending"
                                                ? "bg-[#219EBC] text-white"
                                                : ""
                                        }`}
                                        onClick={() => setFilter("pending")}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                            filter === "approved"
                                                ? "bg-[#219EBC] text-white"
                                                : ""
                                        }`}
                                        onClick={() => setFilter("approved")}
                                    >
                                        Approved
                                    </button>
                                    <button
                                        className={`border-1 border-[#219EBC] text-[#219EBC] border-r border-r-[#219EBC] px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                            filter === "denied"
                                                ? "bg-[#219EBC] text-white"
                                                : ""
                                        }`}
                                        onClick={() => setFilter("denied")}
                                    >
                                        Denied
                                    </button>
                                    <button
                                        className={`border-1 border-[#219EBC] text-[#219EBC] rounded-r-xl px-4 py-2 hover:bg-[#219EBC] hover:text-white ${
                                            filter === "incomplete"
                                                ? "bg-[#219EBC] text-white"
                                                : ""
                                        }`}
                                        onClick={() => setFilter("incomplete")}
                                    >
                                        Incomplete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mt-8">
                        <table className="w-full bg-[#FFFFFF] shadow-xl rounded-xl">
                            <thead className="text-[#767171CC] ">
                                <tr className="border-b">
                                    <th className="px-16 py-4 text-left font-[500]">
                                        Applicant Name
                                    </th>
                                    <th className="text-left font-[500]">
                                        Date Submitted
                                    </th>
                                    <th className="text-left font-[500]">
                                        Form Type
                                    </th>
                                    <th className="text-left font-[500]">
                                        Status
                                    </th>
                                    <th className="text-left font-[500]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr
                                        className={`text-[#333333] font-[500] ${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-[#F5F5FA]"
                                        }`}
                                        key={item.id}
                                    >
                                        <td className="px-16 py-4">
                                            {item.applicant_name}
                                        </td>
                                        <td>{item.date_submitted}</td>
                                        <td>{item.form_type}</td>
                                        <td>{item.status}</td>
                                        <td className="flex pt-2">
                                            {/* Preview Button */}
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-200"
                                                aria-label="Preview"
                                            >
                                                <img
                                                    src={PreviewIcon}
                                                    alt="Preview Icon"
                                                    className="w-5 h-5"
                                                />
                                            </button>

                                            {/* Conditional Buttons */}
                                            {item.status === "Pending" && (
                                                <>
                                                    <button
                                                        className="p-2 rounded-full hover:bg-gray-200"
                                                        aria-label="Approve"
                                                    >
                                                        <img
                                                            src={ApproveIcon}
                                                            alt="Approve Icon"
                                                            className="w-5 h-5"
                                                        />
                                                    </button>
                                                    <button
                                                        className="p-2 rounded-full hover:bg-gray-200"
                                                        aria-label="Reject"
                                                    >
                                                        <img
                                                            src={RejectIcon}
                                                            alt="Reject Icon"
                                                            className="w-5 h-5"
                                                        />
                                                    </button>
                                                </>
                                            )}

                                            {item.status === "Incomplete" && (
                                                <>
                                                    <button
                                                        className="p-2 rounded-full hover:bg-gray-200"
                                                        aria-label="Edit"
                                                    >
                                                        <img
                                                            src={EditIcon}
                                                            alt="Edit Icon"
                                                            className="w-5 h-5"
                                                        />
                                                    </button>
                                                    <button
                                                        className="p-2 rounded-full hover:bg-gray-200"
                                                        aria-label="Delete"
                                                    >
                                                        <img
                                                            src={RejectIcon}
                                                            alt="Delete Icon"
                                                            className="w-5 h-5"
                                                        />
                                                    </button>
                                                </>
                                            )}

                                            {item.status === "Approved" && (
                                                <>
                                                    <button
                                                        className="p-2 rounded-full hover:bg-gray-200"
                                                        aria-label="Print"
                                                    >
                                                        <img
                                                            src={PrintIcon}
                                                            alt="Print Icon"
                                                            className="w-5 h-5"
                                                        />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Applications
