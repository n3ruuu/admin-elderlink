import Header from "./Header"
import Table from "./Table"

const Archives = () => {
    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <div className="flex w-full h-full">
                <Table />
            </div>
        </section>
    )
}

export default Archives
