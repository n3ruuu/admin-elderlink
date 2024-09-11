import Header from "./Header"
import FormsCategories from "./FormsCategories"
import Table from "./Table"

const Forms = () => {
    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <FormsCategories />
            <p className="text-[#333333] text-[20px] mx-16 mt-8 mb-4">
                Recent Forms
            </p>
            <Table />
        </section>
    )
}

export default Forms
