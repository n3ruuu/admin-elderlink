import { useState, useEffect } from "react"
import moment from "moment"

const FinanceTable = () => {
    const [finance, setFinance] = useState([]) // State to hold fetched finance data
    const [selectedQuarter, setSelectedQuarter] = useState("") // Initially empty
    const [currentPage, setCurrentPage] = useState(1) // Current page state

    const itemsPerPage = 5 // Number of items to display per page
    const totalPages = Math.ceil(finance.length / itemsPerPage) // Calculate total pages
    const startIndex = (currentPage - 1) * itemsPerPage // Calculate start index
    const currentMembers = finance.slice(startIndex, startIndex + itemsPerPage) // Get current active members for display

    // Function to determine the current quarter using moment.js
    const getCurrentQuarter = () => {
        const currentMonth = moment().month() + 1 // Get the current month (1-12)
        if (currentMonth >= 1 && currentMonth <= 3) return "Q1"
        if (currentMonth >= 4 && currentMonth <= 6) return "Q2"
        if (currentMonth >= 7 && currentMonth <= 9) return "Q3"
        return "Q4" // for months 10-12
    }

    useEffect(() => {
        setSelectedQuarter(getCurrentQuarter())
    }, [])

    useEffect(() => {
        fetchFinance() // Call fetchFinance whenever selectedQuarter changes
    }, [selectedQuarter])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const fetchFinance = async () => {
        try {
            const response = await fetch("http://localhost:5000/financial-assistance/social-pension")
            const data = await response.json()

            // Filter out archived finance
            const activeFinance = data.filter((member) => member.memberStatus !== "Active")

            // Filter members based on the selected quarter
            const socialPensionMembers = activeFinance.filter((member) => member.quarter === selectedQuarter)

            setFinance(socialPensionMembers) // Set the filtered data based on the selected quarter
        } catch (error) {
            console.error("Error fetching finance:", error)
        }
    }

    return (
        <div>
            <div className="mb-4">
                <label htmlFor="quarter-select" className="mr-2 pl-16 text-[#219EBC]">
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

            <div className="mx-16 max-h-[450px] overflow-y-auto rounded-xl shadow-xl border border-gray-200">
                <table className="min-w-full text-[#333333] font-medium bg-white shadow-lg rounded-xl border-x border-gray-300">
                    <thead className="text-white sticky bg-[#219EBC] opacity-90 top-0 h-[50px] border-x border-gray-300">
                        <tr>
                            <th className="px-6 py-4 text-left font-medium whitespace-nowrap w-[10%] border-x border-gray-300">
                                Control No.
                            </th>
                            <th className="px-6 text-left font-medium whitespace-nowrap border-x border-gray-300">
                                Full Name
                            </th>
                            <th className="px-6 text-left font-medium whitespace-nowrap border-x border-gray-300">
                                Disbursement Date
                            </th>
                            <th className="px-6 text-left font-medium whitespace-nowrap border-x border-gray-300">
                                Status
                            </th>
                            <th className="px-6 text-left font-medium whitespace-nowrap border-x border-gray-300">
                                Claimer
                            </th>
                            <th className="px-6 text-left font-medium whitespace-nowrap border-x border-gray-300">
                                Relationship
                            </th>
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
                                <tr
                                    key={member.id}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"} border-x border-gray-300`}
                                >
                                    <td className="px-6 py-4 text-left border-x border-gray-300">
                                        {member.control_no}
                                    </td>
                                    <td className="px-6 text-left whitespace-nowrap border-x border-gray-300">
                                        {member.full_name}
                                    </td>
                                    <td className="px-6 whitespace-nowrap border-x border-gray-300">
                                        {member.disbursement_date
                                            ? moment(member.disbursement_date).format("MMMM D, YYYY")
                                            : "N/A"}
                                    </td>
                                    <td
                                        className={`px-6 whitespace-nowrap border-x border-gray-300 ${getStatusColor()}`}
                                    >
                                        {getStatusText()}
                                    </td>
                                    <td className="px-6 whitespace-nowrap border-x border-gray-300">
                                        {member.claimer || "N/A"}
                                    </td>
                                    <td className="px-6 whitespace-nowrap border-x border-gray-300">
                                        {member.relationship || "N/A"}
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
                            className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 ${currentPage === index + 1 ? "bg-[#219EBC] text-white" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md mx-1`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white text-[#219EBC] border border-[#219EBC] hover:bg-[#219EBC] hover:text-white transition-colors duration-300"} rounded-md`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinanceTable
