/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import SearchIcon from "../../assets/icons/search.svg"
import ImportIcon from "../../assets/icons/import.svg"

const Header = ({
    selectedCategory,
    onFileUpload,
    searchQuery,
    onSearchChange,
    onAddFormClick, // New prop for opening the add form modal
}) => {
    return (
        <section className="w-full font-inter bg-[#F5F5FA] overflow-hidden">
            <div className="p-16 w-full pb-8 flex items-start justify-between">
                <div className="w-1/2">
                    <h1 className="text-6xl font-bold">Form Library</h1>
                    <p className="text-[#767171CC] mt-3">Create forms aligned to the community's need</p>
                </div>
                <div className="w-1/2 text-[#333333] justify-end flex items-start">
                    <div className="relative w-full max-w-md mr-4">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="p-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                            placeholder="Search..."
                            value={searchQuery} // Bind search query state
                            onChange={onSearchChange} // Handle change
                        />
                        <img
                            src={SearchIcon}
                            alt="Search Icon"
                            className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                        />
                    </div>

                    {selectedCategory ? (
                        <button
                            className="bg-[#219EBC] text-white text-xl py-2.5 px-10 rounded-lg flex items-center gap-2"
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <img src={ImportIcon} alt="Import Icon" className="w-5 h-5" />
                            <span>Import File</span>
                        </button>
                    ) : (
                        <button
                            className="text-[#F5F5FA] bg-[#219EBC] px-8 text-[24px] py-2 rounded-lg hover:bg-[#1A7F8C]"
                            onClick={onAddFormClick} // Open the modal
                        >
                            &#43; Add Folder
                        </button>
                    )}
                </div>
            </div>
            <input type="file" id="fileInput" accept=".pdf" className="hidden" onChange={onFileUpload} />
        </section>
    )
}

export default Header
