/* eslint-disable react/prop-types */
import { useState } from "react"
import Header from "./Header" // Make sure this is the correct path
import ArchivedMembersTable from "./ArchivedMembersTable" // The name was changed in the implementation
import ViewModeSwitcher from "./ViewModeSwitcher" // Make sure this is the correct path
import ArchivesData from "../../data/archives.json" // Your data source

const Archives = () => {
    const [filter, setFilter] = useState("Active") // Filter only active members by default

    const handleFilterChange = (filterOption) => {
        setFilter(filterOption) // Update filter
    }

    // Filter the archive data based on the selected filter (in this case 'Active')
    const filteredMembers = ArchivesData.filter(
        (member) => member.status === filter,
    )

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <div className="flex w-full h-full flex-col">
                <ViewModeSwitcher
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                />
                <ArchivedMembersTable membersData={filteredMembers} />{" "}
                {/* Pass the filtered members */}
            </div>
        </section>
    )
}

export default Archives
