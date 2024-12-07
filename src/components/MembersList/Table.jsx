/* eslint-disable react/prop-types */
import moment from "moment"
import { useState } from "react"
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"

const Table = ({ membersData, onEdit }) => {
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
            <table className="min-w-full bg-[#FFFFFF] rounded-xl shadow-lg">
                <thead className="text-[#767171CC] h-[80px] align-baseline">
                    <tr>
                        <th className="pl-8 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Full Name</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Birthdate</th>
                        <th className="text-left font-medium whitespace-nowrap w-[5%]">Sex</th>
                        <th className="text-left font-medium whitespace-nowrap w-fit">Civil Status</th>
                        <th className="text-left font-medium whitespace-nowrap w-[12%]">Address</th>
                        <th className="text-left font-medium whitespace-nowrap w-[10%]">Contact Number</th>
                        <th className="text-left font-medium whitespace-nowrap w-[7%]">
                            Purchase <br /> Booklet No.
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[8%]">
                            Medicine <br /> Booklet No.
                        </th>
                        <th className="text-left font-medium whitespace-nowrap w-[5%]">Date Issued</th>
                        <th className="px-4 text-left font-medium whitespace-nowrap">Actions</th>
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
                            <td className="text-left whitespace-nowrap">{moment(member.dob).format("MM-DD-YYYY")}</td>
                            <td className="text-left">{member.sex}</td>
                            <td className="text-left">{member.civilStatus}</td>
                            <td className="text-left whitespace-nowrap">{member.address}</td>
                            <td className="text-left">{member.contactNumber}</td>
                            <td className="text-left">{member.purchaseBookletNo || "N/A"}</td>
                            <td className="text-left">{member.medicineBookletNo || "N/A"}</td>
                            <td className="text-left whitespace-nowrap">
                                {member.dateIssued ? moment(member.dateIssued).format("MM-DD-YYYY") : "N/A"}
                            </td>
                            <td className="px-4 py-4 flex gap-2">
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => onEdit(member)} // Trigger the edit action
                                >
                                    <img src={EditIcon} alt="Edit Icon" className="w-5 h-5" />
                                </button>
                                <button className="text-red-500 hover:text-red-700">
                                    <img src={ArchiveIcon} alt="Archive Icon" className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex fixed bottom-5 mt-4">
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
    )
}

export default Table
