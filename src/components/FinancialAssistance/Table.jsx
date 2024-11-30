/* eslint-disable react/prop-types */
import { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ViewIcon from "../../assets/icons/eye.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment"
import ViewModal from "./ViewModal"

const Table = ({ membersData, onEdit, handleFileUpload }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedBenefitType, setSelectedBenefitType] = useState("Social Pension") // Default benefit type
    const [selectedQuarter, setSelectedQuarter] = useState("Q1") // Default to Q1
    const [modalOpen, setModalOpen] = useState(false) // Modal state
    const [selectedMember, setSelectedMember] = useState(null) // State for selected member's data

    const itemsPerPage = 6
    const totalPages = Math.ceil(membersData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMembers = membersData
        .filter((member) => member.benefitType === selectedBenefitType) // Filter members based on selected benefit type
        .slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const toggleBenefitType = () => {
        // Toggle between "Social Pension" and "Financial Assistance"
        setSelectedBenefitType((prev) => (prev === "Social Pension" ? "Financial Assistance" : "Social Pension"))
    }

    const handleViewClick = (member) => {
        setSelectedMember(member) // Set the selected member data
        setModalOpen(true) // Open the modal
    }

    return (
        <div>
            <button
                onClick={toggleBenefitType}
                className="mb-4 px-6 py-2 bg-[#219EBC] text-white rounded-md hover:bg-[#1a7d8d] transition-colors duration-300"
            >
                Toggle Benefit Type ({selectedBenefitType})
            </button>

            {/* Dropdown for selecting Quarter */}
            <div className="mb-4">
                <label htmlFor="quarter-select" className="mr-2 text-[#219EBC]">
                    Select Quarter:
                </label>
                <select
                    id="quarter-select"
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                </select>
            </div>

            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="pl-8 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="text-left font-medium whitespace-nowrap">Full Name</th>
                        <th className="text-left font-medium whitespace-nowrap">Program Name</th>
                        <th className="text-left font-medium whitespace-nowrap">Claim Date</th>
                        <th className="text-left font-medium whitespace-nowrap">Claimer</th>
                        <th className="text-left font-medium whitespace-nowrap">Relationship</th>
                        {selectedBenefitType !== "Social Pension" && (
                            <>
                                <th className="text-left font-medium whitespace-nowrap">Proof</th>
                                <th className="text-left font-medium whitespace-nowrap">Benefit Status</th>
                            </>
                        )}
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
                            <td className="whitespace-nowrap">
                                {member.benefitType === "Social Pension"
                                    ? "Social Pension Program"
                                    : member.programName}
                            </td>
                            <td className="whitespace-nowrap">
                                {/* Show selected quarter's claim date */}
                                {member.benefitType === "Social Pension" ? (
                                    <div>{moment(member[`claimDate${selectedQuarter}`]).format("MMMM D, YYYY")}</div>
                                ) : member.claimDate ? (
                                    moment(member.claimDate).format("MMMM D, YYYY")
                                ) : (
                                    "N/A"
                                )}
                            </td>
                            <td className="whitespace-nowrap">
                                {/* Show selected quarter's claimer */}
                                {member.benefitType === "Social Pension"
                                    ? member[`claimer${selectedQuarter}`] || "N/A"
                                    : member.claimer || "N/A"}
                            </td>
                            <td className="whitespace-nowrap">
                                {/* Show selected quarter's relationship */}
                                {member.benefitType === "Social Pension"
                                    ? member[`relationship${selectedQuarter}`] || "N/A"
                                    : member.claimerRelationship || "N/A"}
                            </td>

                            {/* Conditional rendering for Proof and Benefit Status */}
                            {selectedBenefitType !== "Social Pension" && (
                                <>
                                    <td className="whitespace-nowrap">
                                        {member.proof ? (
                                            <a
                                                href={`http://localhost:5000/uploads/${member.proof}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                View Proof
                                            </a>
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
                                                    onChange={(e) => handleFileUpload(e, member.id)}
                                                />
                                            </label>
                                        )}
                                    </td>
                                    <td
                                        className={`whitespace-nowrap font-[500] ${
                                            member.benefitStatus === "Claimed" ? "text-green-500" : "text-red-500"
                                        }`}
                                    >
                                        {member.benefitStatus || "Unclaimed"}
                                    </td>
                                </>
                            )}

                            <td className="px-8 py-4 whitespace-nowrap flex gap-3 items-center">
                                <button aria-label="Edit">
                                    <img src={EditIcon} alt="Edit" onClick={() => onEdit(member)} />
                                </button>
                                <button aria-label="View" onClick={() => handleViewClick(member)}>
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
            </div>
            {modalOpen && selectedMember && <ViewModal member={selectedMember} onClose={() => setModalOpen(false)} />}
        </div>
    )
}

export default Table
