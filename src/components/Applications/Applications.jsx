import { useState, useEffect } from "react"
import axios from "axios"
import Header from "./Header"
import FilterButtons from "./FilterButtons"
import Table from "./Table"

const Applications = () => {
    const [filter, setFilter] = useState("all") // Current filter
    const [applications, setApplications] = useState([]) // Fetched applications
    const [searchQuery, setSearchQuery] = useState("") // Search query state

    // Fetch applications from the API
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get("http://localhost:5000/application")
                if (response.data?.data) {
                    setApplications(response.data.data) // Set fetched data
                } else {
                    setApplications([])
                }
            } catch (err) {
                console.error("Error fetching applications:", err)
            }
        }

        fetchApplications()
    }, [])

    // Update the status of an application
    const onStatusUpdate = async (id, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/application/update/${id}`,
                { status: newStatus }, // Send 'status' instead of 'newStatus'
            )
            if (response.status === 200) {
                // Update the status in the local state
                setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))
            } else {
                console.error("Failed to update status:", response.data)
            }
        } catch (err) {
            console.error("Error updating status:", err)
        }
    }

    const filteredData = applications.filter((item) => {
        const matchesFilter = filter === "all" || (item.status && item.status.toLowerCase() === filter)
        const matchesSearchQuery =
            item.applicant_name?.toLowerCase().includes(searchQuery.toLowerCase()) || // Assuming 'name' is a field
            item.form_type?.toLowerCase().includes(searchQuery.toLowerCase()) || // Add more fields as needed
            item.status?.toLowerCase().includes(searchQuery.toLowerCase()) // Add more fields as needed
        return matchesFilter && matchesSearchQuery
    })

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <FilterButtons filter={filter} setFilter={setFilter} />
                    <div className="mt-8">
                        <Table filteredData={filteredData} onStatusUpdate={onStatusUpdate} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Applications
