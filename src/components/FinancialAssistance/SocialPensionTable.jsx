/* eslint-disable react/prop-types */

import { useState } from "react"
import moment from "moment"
import EditIcon from "../../assets/icons/edit.svg"
import ViewIcon from "../../assets/icons/eye.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ReportIcon from "../../assets/icons/report.svg"

const SocialPensionTable = ({ socialPensionMembers, onEdit, handleViewClick }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5 // Number of items to display per page

    const totalPages = Math.ceil(socialPensionMembers.length / itemsPerPage) // Calculate total pages
    const startIndex = (currentPage - 1) * itemsPerPage // Calculate start index
    const currentMembers = socialPensionMembers.slice(startIndex, startIndex + itemsPerPage) // Get current active members for display

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-6 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Full Name</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Disbursement Date</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Status</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Claimer</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Relationship</th>
                        <th className="px-6 text-left font-medium whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => {
                        const isNullData = !member.disbursement_date && !member.claimer && !member.relationship

                        const getStatusText = () => {
                            if (isNullData) return "N/A"
                            return member.status || "Unclaimed"
                        }

                        const getStatusColor = () => {
                            if (isNullData) return "" // No color for N/A
                            if (member.status === "Claimed") return "text-green-500 font-semibold"
                            if (member.status === "Unclaimed") return "text-red-500 font-semibold"
                            return "" // Default case
                        }

                        return (
                            <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                                <td className="px-6 py-4 text-left">{member.control_no}</td>
                                <td className="px-6 text-left whitespace-nowrap">{member.full_name}</td>
                                <td className="px-6 whitespace-nowrap">
                                    {member.disbursement_date
                                        ? moment(member.disbursement_date).format("MMMM D, YYYY")
                                        : "N/A"}
                                </td>
                                <td className={`px-6 whitespace-nowrap ${getStatusColor()}`}>{getStatusText()}</td>
                                <td className="px-6 whitespace-nowrap">{member.claimer || "N/A"}</td>
                                <td className="px-6 whitespace-nowrap">{member.relationship || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap flex gap-3 items-center">
                                    <button aria-label="Edit" onClick={() => onEdit(member)}>
                                        <img src={EditIcon} alt="Edit" />
                                    </button>
                                    <button aria-label="View" onClick={() => handleViewClick(member)}>
                                        <img src={ViewIcon} alt="View" />
                                    </button>
                                    <button aria-label="Archive">
                                        <img src={ArchiveIcon} alt="Archive" />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="flex fixed bottom-5 mt-4">
                {/* Pagination controls */}
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 ${
                            currentPage === 1
                                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                        } rounded-md`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 ${
                                currentPage === index + 1
                                    ? "bg-[#219EBC] text-white"
                                    : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                            } rounded-md mx-1`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 ${
                            currentPage === totalPages
                                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"
                        } rounded-md`}
                    >
                        Next
                    </button>
                </div>

                {/* Generate Report button at bottom-right */}
                <button className="fixed bottom-5 right-16 border text-[#219EBC] border-[#219EBC] flex px-5 py-3 rounded-md hover:bg-[#219EBC] hover:text-white transition-colors duration-300 group">
                    <img
                        src={ReportIcon}
                        alt="Report Icon"
                        className="w-5 h-5 mr-2 transition duration-300 group-hover:brightness-0 group-hover:invert"
                    />
                    <span>Generate Report</span>
                </button>
            </div>
        </div>
    )
}

export default SocialPensionTable
