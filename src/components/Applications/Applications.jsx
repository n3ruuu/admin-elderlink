import { useState } from "react"
import ApplicationsData from "../../data/applications.json"
import Header from "./Header"
import FilterButtons from "./FilterButtons"
import Table from "./Table"

const Applications = () => {
    const [filter, setFilter] = useState("all")
    const filteredData = ApplicationsData.filter(
        (item) => filter === "all" || item.status.toLowerCase() === filter,
    )

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <FilterButtons filter={filter} setFilter={setFilter} />
                    <div className="mt-8">
                        <Table filteredData={filteredData} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Applications
