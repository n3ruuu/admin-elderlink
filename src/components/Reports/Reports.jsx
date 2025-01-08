import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import Header from "./Header"
import Table from "./Table"

const Reports = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [reportsData, setReportsData] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    // Fetch reports data from the API
    const fetchReportsData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/reports/get-news") // Replace with your API endpoint
            const activeReports = response.data.filter((report) => report.status === "Active") // Filter active reports
            setReportsData(activeReports) // Update state with filtered data
        } catch (error) {
            console.error("Error fetching reports data:", error)
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchReportsData()
    }, [])

    // Close modal handler
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    // Open modal handler
    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    // Filter the reports based on the search query
    const filteredReports = reportsData.filter((report) => {
        const reportName = report.report_name ? report.report_name.toLowerCase() : ""
        const reportType = report.report_type ? report.report_type.toLowerCase() : ""
        const reportCreatedBy = report.created_by ? report.created_by.toLowerCase() : ""

        return (
            reportName.includes(searchQuery.toLowerCase()) || // Filter by report name
            reportType.includes(searchQuery.toLowerCase()) || // Filter by report type
            reportCreatedBy.includes(searchQuery.toLowerCase()) // Filter by report creator
        )
    })

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header onOpen={handleOpenModal} searchQuery={searchQuery} onSearchChange={handleSearchChange} />

            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Table
                        reportsData={filteredReports} // Pass the filtered data to the Table component
                        fetchReportsData={fetchReportsData} // Allow Table to trigger a data refresh
                    />
                </div>
            </div>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} fetchReportsData={fetchReportsData} />
            )}
        </section>
    )
}

export default Reports
