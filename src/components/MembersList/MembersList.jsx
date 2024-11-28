import Header from "./Header" // Import your Header component
import Cards from "./Cards" // Import your Cards component
import Table from "./Table" // Import your Table component
import membersData from "./members.json"

const MembersList = () => {
    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards membersData={membersData} />

                    <Table membersData={membersData} />
                </div>
            </div>
        </section>
    )
}

export default MembersList
