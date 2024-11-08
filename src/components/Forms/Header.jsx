/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/search.svg"

const Header = () => {
    return (
        <section className="w-full font-inter bg-[#F5F5FA] overflow-hidden">
            <div className="p-16 w-full pb-8 flex items-start justify-between">
                <div className="w-1/2">
                    <h1 className="text-6xl font-bold">Form Library</h1>
                    <p className="text-[#767171CC] mt-3">
                        Create forms aligned to the community's need
                    </p>
                </div>
                <div className="w-1/2 text-[#76717180]">
                    <div className=" relative w-full">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="p-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[70%]"
                            placeholder="Search..."
                        />
                        <img
                            src={SearchIcon}
                            alt="Search Icon"
                            className="absolute left-3 top-6 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Header
