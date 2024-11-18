import { useState, useEffect } from "react"
import axios from "axios"
import Header from "./Header"
import FilterButtons from "./FilterButtons"
import Table from "./Table"

const Applications = () => {
    const [filter, setFilter] = useState("all") // Current filter
    const [applications, setApplications] = useState([]) // Fetched applications
    const [loading, setLoading] = useState(true) // Loading state
    const [error, setError] = useState(null) // Error state

    // Fetch applications from the API
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true)
                const response = await axios.get(
                    "http://localhost:5000/application",
                )
                if (response.data?.data) {
                    setApplications(response.data.data) // Set fetched data
                } else {
                    setApplications([])
                }
            } catch (err) {
                setError("Failed to load applications. Please try again later.")
                console.error("Error fetching applications:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [])

    // Filter applications based on the selected filter
    const filteredData = applications.filter(
        (item) =>
            filter === "all" ||
            (item.status && item.status.toLowerCase() === filter),
    )

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <FilterButtons filter={filter} setFilter={setFilter} />
                    <div className="mt-8">
                        {loading ? (
                            <p>Loading applications...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <Table filteredData={filteredData} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Applications
