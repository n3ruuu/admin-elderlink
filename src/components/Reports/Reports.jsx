import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import Header from "./Header"
import Table from "./Table"

const Reports = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [reportsData, setReportsData] = useState([])

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

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header onOpen={handleOpenModal} /> {/* Pass the function as a prop */}
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Table
                        reportsData={reportsData}
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
