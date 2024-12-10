import { useState, useEffect } from "react"
import axios from "axios"
import Header from "./Header"
import FilterButtons from "./FilterButtons"
import Table from "./Table"

const Applications = () => {
    const [filter, setFilter] = useState("all") // Current filter
    const [applications, setApplications] = useState([]) // Fetched applications
    const [searchQuery, setSearchQuery] = useState("") // Search query state

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get("http://localhost:5000/members")
                console.log(response.data) // Log the response to check its structure

                // Filter applications based on the selected filter (only Pending, Approved, or Rejected)
                const filteredApplications = response.data.filter((item) => {
                    // Only consider statuses "Pending", "Approved", or "Rejected"
                    const validStatuses = ["pending", "approved", "rejected"]

                    if (filter === "all") {
                        // Show all applications with valid statuses
                        return validStatuses.includes(item.status.toLowerCase())
                    }

                    // Filter based on the selected filter
                    return item.status.toLowerCase() === filter && validStatuses.includes(item.status.toLowerCase())
                })

                setApplications(filteredApplications) // Set filtered applications
            } catch (err) {
                console.error("Error fetching applications:", err)
            }
        }

        fetchApplications()
    }, [filter]) // Include filter in the dependency array to refetch data when filter changes

    // Filter the applications by search query
    const filteredApplications = applications.filter((application) => {
        const fullName = `${application.firstName} ${application.lastName}`.toLowerCase()
        return fullName.includes(searchQuery.toLowerCase())
    })

    // Function to update member status (Approve or Reject)
    const onStatusUpdate = async (id, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:5000/application/members/${id}`, { status: newStatus })
            console.log("Status updated:", response.data)

            // Update the state with the new status
            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application.id === id ? { ...application, status: newStatus } : application,
                ),
            )
        } catch (err) {
            console.error("Error updating status:", err)
        }
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <FilterButtons filter={filter} setFilter={setFilter} />
                    <div className="mt-8">
                        {/* Pass the filtered applications to the Table */}
                        <Table applications={filteredApplications} onStatusUpdate={onStatusUpdate} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Applications
