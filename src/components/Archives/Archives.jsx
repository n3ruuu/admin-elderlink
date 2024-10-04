/* eslint-disable react/prop-types */
import { useState } from "react" // Import React and useState
import Header from "./Header"
import Table from "./Table"
import ViewModeSwitcher from "./ViewModeSwitcher" // Import the ViewModeSwitcher component

const Archives = () => {
    const [viewMode, setViewMode] = useState("list") // State to manage the view mode
    const [filter, setFilter] = useState("all") // State to manage the filter

    const handleViewModeChange = (mode) => {
        setViewMode(mode) // Update view mode
    }

    const handleFilterChange = (filterOption) => {
        setFilter(filterOption) // Update filter
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <div className="flex w-full h-full flex-col">
                {" "}
                {/* Use flex-col to stack components vertically */}
                <ViewModeSwitcher
                    handleViewModeChange={handleViewModeChange}
                    viewMode={viewMode}
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                />
                <Table viewMode={viewMode} filter={filter} />{" "}
                {/* Pass props to Table if needed */}
            </div>
        </section>
    )
}

export default Archives
