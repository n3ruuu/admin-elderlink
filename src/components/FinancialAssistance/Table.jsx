/* eslint-disable react/prop-types */
import { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ViewIcon from "../../assets/icons/view.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ReportIcon from "../../assets/icons/report.svg"
import moment from "moment"

const Table = ({
    membersData,
    onOpenModal,
    handleArchiveClick,
    handleEditClick,
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const activeMembersData = membersData.filter(
        (member) => member.status === "Active",
    )
    const totalPages = Math.ceil(activeMembersData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMembers = activeMembersData.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Benefit Type
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Latest Date of Claim
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Status
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Claimer
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Relationship
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((row, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={row.id || `new-${index}`}
                        >
                            <td className="px-16 py-4 whitespace-nowrap">
                                {row.member_name || row.memberName}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.benefit_type || row.benefitType}
                            </td>
                            <td className="whitespace-nowrap">
                                {moment(
                                    row.date_of_claim || row.dateOfClaim,
                                ).format("MM-DD-YYYY")}
                            </td>
                            <td
                                className={`whitespace-nowrap font-[500] ${row.benefit_status === "claimed" ? "text-green-500" : "text-red-500"}`}
                            >
                                {row.benefit_status === "claimed"
                                    ? "Claimed"
                                    : "Unclaimed"}
                            </td>
                            <td className="whitespace-nowrap">{row.claimer}</td>
                            <td className="whitespace-nowrap">
                                {row.relationship}
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap flex gap-3 items-center">
                                <button
                                    aria-label="Edit"
                                    onClick={() => handleEditClick(row)}
                                >
                                    <img src={EditIcon} alt="Edit" />
                                </button>
                                <button
                                    aria-label="View"
                                    onClick={() => onOpenModal(row)}
                                >
                                    <img src={ViewIcon} alt="View" />
                                </button>
                                <button
                                    aria-label="Archive"
                                    onClick={handleArchiveClick}
                                >
                                    <img src={ArchiveIcon} alt="Archive" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex fixed bottom-5 mt-4">
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"}`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 ${currentPage === index + 1 ? "bg-[#219EBC] text-white" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"}`}
                    >
                        Next
                    </button>
                </div>

                <button
                    className="fixed bottom-5 right-16 border text-[#219EBC] border-[#219EBC] flex px-5 py-3 rounded-md hover:bg-[#219EBC] hover:text-white transition-colors duration-300 group"
                    onClick={() => console.log("Generating report...")}
                >
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

export default Table
