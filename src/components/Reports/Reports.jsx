import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"
import Header from "./Header"
import Table from "./Table"

const Reports = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [reportsData, setReportData] = useState([])

    // Fetch data from the backend when the component mounts
    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/reports/get-news") // Replace with your API endpoint
                setReportData(response.data) // Assuming the data is in response.data
            } catch (error) {
                console.error("Error fetching news data:", error)
            }
        }

        fetchNewsData()
    }, [])

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />

            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Table
                        reportsData={reportsData} // Pass filtered news data to Table
                        handleOpenModal={handleOpenModal}
                    />
                </div>
            </div>
            {isModalOpen && <Modal onClose={handleCloseModal} />}
        </section>
    )
}

export default Reports
