/* eslint-disable react/prop-types */
import { useState } from "react"
import SearchIcon from "../../assets/icons/search.svg"
import Modal from "./Modal" // Make sure to import the Modal component

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false) // Modal state

    const openModal = () => {
        setIsModalOpen(true) // Open the modal
    }

    const closeModal = () => {
        setIsModalOpen(false) // Close the modal
    }

    return (
        <div className="p-16 w-full pb-8 flex">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Reports</h1>
                <p className="text-[#767171CC] mt-3">Custom Report Generation</p>
            </div>
            <div className="flex w-1/2 items-start justify-end text-[#333333]">
                <div className="w-[60%]">
                    <div className="relative w-full max-w-md">
                        <div className="relative w-full">
                            <input
                                type="search"
                                name="search"
                                id="search"
                                value={searchQuery} // Bind input to state
                                onChange={(e) => setSearchQuery(e.target.value)} // Update state
                                className="p-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                                placeholder="Search..."
                            />
                            <img
                                src={SearchIcon}
                                alt="Search Icon"
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    className="text-[#F5F5FA] bg-[#219EBC] px-8 ml-4 text-[24px] py-2 rounded-lg hover:bg-[#1A7F8C]"
                    onClick={openModal} // Open modal when clicked
                >
                    &#43; New Report
                </button>
            </div>

            {/* Modal Component */}
            <Modal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    )
}

export default Header
