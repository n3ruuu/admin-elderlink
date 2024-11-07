/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import EditIcon from "../../assets/icons/edit2.svg"
import ViewIcon from "../../assets/icons/view.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import ReportIcon from "../../assets/icons/report.svg"

const Table = ({ membersData, onOpenModal, onArchiveClick }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(6) // Initial value
    const tableContainerRef = useRef(null)

    // Filter members to only include those with status 'Active'
    const activeMembersData = membersData.filter(
        (member) => member.status === "Active",
    )

    const totalPages = Math.ceil(activeMembersData.length / itemsPerPage) // Calculate total pages
    const startIndex = (currentPage - 1) * itemsPerPage // Calculate start index
    const currentMembers = activeMembersData.slice(
        startIndex,
        startIndex + itemsPerPage,
    ) // Get current active members for display

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // Adjust number of items per page based on the container's height
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (tableContainerRef.current) {
                const containerHeight = tableContainerRef.current.clientHeight
                const rowHeight = 50 // Height of one table row (adjust if necessary)
                const rowsPerPage = Math.floor(containerHeight / rowHeight)
                setItemsPerPage(rowsPerPage > 0 ? rowsPerPage : 1)
            }
        }

        updateItemsPerPage()

        // Recalculate on window resize
        window.addEventListener("resize", updateItemsPerPage)
        return () => {
            window.removeEventListener("resize", updateItemsPerPage)
        }
    }, [])

    return (
        <div
            ref={tableContainerRef}
            className="relative max-h-[500px] overflow-y-auto"
        >
            <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-lg">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="text-left font-medium whitespace-nowrap px-16 py-4 w-[20%]">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-normal">
                            Medical Conditions
                        </th>
                        <th className="text-left font-medium whitespace-normal">
                            Medications
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Guardian
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Relationship
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Emergency Contact
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {currentMembers.map((row, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            }`}
                            key={row.id}
                        >
                            <td className="px-16 py-4 whitespace-nowrap">
                                {row.name}
                            </td>
                            <td className="whitespace-normal py-4">
                                {row.medical_conditions
                                    ? row.medical_conditions
                                          .split(",")
                                          .map((condition, index) => (
                                              <div key={index}>
                                                  {condition.trim()}
                                              </div>
                                          ))
                                    : ""}
                            </td>
                            <td className="whitespace-normal py-4">
                                {row.medications
                                    ? row.medications
                                          .split(",")
                                          .map((medication, index) => (
                                              <div key={index}>
                                                  {medication.trim()}
                                              </div>
                                          ))
                                    : ""}
                            </td>

                            <td className="whitespace-nowrap">
                                {row.guardian_name}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.relationship}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.emergency_contact}
                            </td>

                            <td className="flex gap-3 items-center py-4">
                                <button
                                    aria-label="Edit"
                                    onClick={() => onOpenModal(row)}
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
                                    onClick={() => onArchiveClick(row)}
                                >
                                    <img src={ArchiveIcon} alt="Archive" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex mt-4 justify-between">
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
                <button
                    className=" border text-[#219EBC] border-[#219EBC] flex px-5 py-3 rounded-md hover:bg-[#219EBC] hover:text-white transition-colors duration-300 group"
                    onClick={() => {
                        // Logic to generate report
                        console.log("Generating report...")
                    }}
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
