/* eslint-disable react/prop-types */
import { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ViewIcon from "../../assets/icons/eye.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ReportIcon from "../../assets/icons/report.svg"
import moment from "moment"

const Table = ({ membersData, onEdit, handleFileUpload }) => {
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 6

    const totalPages = Math.ceil(membersData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMembers = membersData.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="pl-8 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>

                        <th className="text-left font-medium whitespace-nowrap">Full Name</th>
                        <th className="text-left font-medium whitespace-nowrap">Program Name</th>
                        <th className="text-left font-medium whitespace-nowrap">Claim Date</th>
                        <th className="text-left font-medium whitespace-nowrap">Claimer</th>
                        <th className="text-left font-medium whitespace-nowrap">Relationship</th>
                        <th className="text-left font-medium whitespace-nowrap">Proof</th>
                        <th className="text-left font-medium whitespace-nowrap">Benefit Status</th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={member.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}>
                            <td className="px-8 py-4 text-left">{member.controlNo}</td>
                            <td className="text-left whitespace-nowrap">
                                {member.firstName} {member.middleName && `${member.middleName} `} {member.lastName}{" "}
                                {member.extension}
                            </td>
                            <td className="whitespace-nowrap">{member.programName}</td>
                            <td className="whitespace-nowrap">{moment(member.claimDate).format("MMMM D, YYYY")}</td>
                            <td className="whitespace-nowrap">{member.claimer}</td>
                            <td className="whitespace-nowrap">{member.claimerRelationship}</td>
                            <td className="whitespace-nowrap">
                                {member.proof ? (
                                    <div>
                                        <a
                                            href={`http://localhost:5000/uploads/${member.proof}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            View Proof
                                        </a>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor={`upload-proof-${member.id}`}
                                        className="text-[#219EBC] underline cursor-pointer"
                                    >
                                        Upload File
                                        <input
                                            type="file"
                                            id={`upload-proof-${member.id}`}
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, member.id)} // Handle file upload
                                        />
                                    </label>
                                )}
                            </td>

                            <td
                                className={`whitespace-nowrap font-[500] ${member.benefitStatus === "Claimed" ? "text-green-500" : "text-red-500"}`}
                            >
                                {member.benefitStatus === "Claimed" ? "Claimed" : "Unclaimed"}
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap flex gap-3 items-center">
                                <button aria-label="Edit">
                                    <img src={EditIcon} alt="Edit" onClick={() => onEdit(member)} />
                                </button>
                                <button
                                    aria-label="View"
                                    onClick={() => onEdit(member)} // Trigger the edit action
                                >
                                    <img src={ViewIcon} alt="View" />
                                </button>
                                <button aria-label="Archive">
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

export default Table
