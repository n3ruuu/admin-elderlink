import SearchBar from "../common/SearchBar"

const Header = () => (
    <div className="p-16 w-full pb-8 flex items-start">
        <div className="w-1/2">
            <h1 className="text-6xl font-bold">Manage Applications</h1>
            <p className="text-[#767171CC] mt-3">
                Streamline application processing and approval workflows
            </p>
        </div>
        <SearchBar />
    </div>
)

export default Header
