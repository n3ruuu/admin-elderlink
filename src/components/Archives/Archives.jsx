/* eslint-disable react/prop-types */
import { useState } from "react"
import Header from "./Header" // Make sure this is the correct path
import ViewModeSwitcher from "./ViewModeSwitcher" // Make sure this is the correct path
import MembersListTable from "./Tables/MembersListTable" // Import the MembersListTable component
import HealthRecordsTable from "./Tables/HealthRecordsTable"
import EventsTable from "./Tables/EventsTable"
import NewsTable from "./Tables/NewsTable"
import FinanceTable from "./Tables/FinanceTable"

const Archives = () => {
    const [filter, setFilter] = useState("members") // Default filter
    const [viewMode, setViewMode] = useState("Archived") // Track view mode: "Archived" or "Members"

    const handleFilterChange = (filterOption) => {
        setFilter(filterOption) // Update filter
    }

    const handleViewModeChange = (mode) => {
        setViewMode(mode) // Update view mode to "Archived" or "Members"
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden ">
            <Header />
            <div className="flex w-full h-full flex-col">
                <ViewModeSwitcher
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                    viewMode={viewMode}
                    handleViewModeChange={handleViewModeChange}
                />

                {filter === "members" && <MembersListTable />}
                {filter === "health" && <HealthRecordsTable />}
                {filter === "finance" && <FinanceTable />}
                {filter === "events" && <EventsTable />}
                {filter === "news" && <NewsTable />}
            </div>
        </section>
    )
}

export default Archives
