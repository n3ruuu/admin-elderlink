import SearchBar from "../common/SearchBar"

const Header = () => {
    return (
        <div className="p-16 w-full pb-8 flex items-center justify-between">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Archives</h1>
                <p className="text-[#767171CC] mt-3">
                    Archived records of Elderlink
                </p>
            </div>
            <div className="w-1/2">
                <SearchBar />
            </div>
        </div>
    )
}

export default Header
