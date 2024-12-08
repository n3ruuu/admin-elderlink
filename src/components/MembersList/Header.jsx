/* eslint-disable react/prop-types */
import { useState } from "react"
import SearchIcon from "../../assets/icons/search.svg"
import Modal from "./Modal"
import HealthRecordsModal from "../HealthRecords/Modal"
import FinancialRecordsModal from "../FinancialAssistance/Modal"

const Header = ({ searchQuery, onSearchChange }) => {
    const [currentStep, setCurrentStep] = useState(0) // Track modal steps

    const openNextModal = () => {
        setCurrentStep((prevStep) => prevStep + 1)
    }

    const closeAllModals = () => {
        console.log("CLOSING ALL MODALS")
        setCurrentStep(0)
    }

    const openPrevModal = () => {
        setCurrentStep(1)
    }

    const openSecondModal = () => {
        setCurrentStep(2)
    }

    return (
        <>
            <div className="p-16 w-full pb-8 flex">
                <div className="w-1/2">
                    <h1 className="text-6xl font-bold">Members List</h1>
                    <p className="text-[#767171CC] mt-3">Access and update member profiles</p>
                </div>
                <div className="flex w-1/2 justify-end gap-5 items-start text-[#333333]">
                    {/* Search Bar */}
                    <div className="w-[60%]">
                        <div className="relative w-full max-w-md">
                            <input
                                type="search"
                                name="search"
                                id="search"
                                className="p-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                                placeholder="Search..."
                                value={searchQuery} // Bind value to searchQuery
                                onChange={onSearchChange} // Handle search input change
                            />
                            <img
                                src={SearchIcon}
                                alt="Search Icon"
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                            />
                        </div>
                    </div>
                    <button
                        className="text-[#F5F5FA] bg-[#219EBC] px-8 text-[24px] py-2 rounded-lg hover:bg-[#1A7F8C]"
                        onClick={() => setCurrentStep(1)} // Start modal flow
                    >
                        &#43; Add Member
                    </button>
                </div>
            </div>

            {/* Modals */}
            {currentStep === 1 && <Modal isOpen={currentStep === 1} onClose={closeAllModals} onNext={openNextModal} />}
            {currentStep === 2 && <HealthRecordsModal onClose={openPrevModal} onNext={openNextModal} />}
            {currentStep === 3 && <FinancialRecordsModal onClose={openSecondModal} />}
        </>
    )
}

export default Header
