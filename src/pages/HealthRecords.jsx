import { useState } from "react"
import SearchIcon from "../assets/icons/search.svg"
import TotalNumberIcon from "../assets/icons/total-senior.svg"
import PriorityCareIcon from "../assets/icons/priority-care-icon.svg"
import RecentUpdatesIcon from "../assets/icons/recent-updates-icon.svg"
import EditIcon from "../assets/icons/edit2.svg"
import ViewIcon from "../assets/icons/view.svg"
import MembersListData from "../data/membersList.json"
import Modal from "../modals/HealthRecordsModal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"

const HealthRecords = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [membersData, setMembersData] = useState(MembersListData)

    const handleOpenModal = (member) => {
        setCurrentMember(member)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentMember(null)
    }

    const handleSave = (updatedMember) => {
        if (currentMember) {
            // Editing existing member
            setMembersData((prevData) =>
                prevData.map((member) =>
                    member.id === updatedMember.id ? updatedMember : member,
                ),
            )
        } else {
            // Adding new member
            setMembersData((prevData) => [
                ...prevData,
                { ...updatedMember, id: prevData.length + 1 }, // Simple ID generation
            ])
        }
        handleCloseModal()
    }

    const handleArchiveClick = () => {
        setIsConfirmModalOpen(true)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header */}
            <div className="p-16 pb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-6xl font-bold">Health Records</h1>
                    <p className="text-[#767171CC] mt-3">
                        Maintain comprehensive health records
                    </p>
                </div>
                <div className="ml-auto mr-[20px] flex space-x-4 max-w-md h-fit text-[#76717180]">
                    <div className="relative w-full">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="p-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                            placeholder="Search..."
                        />
                        <img
                            src={SearchIcon}
                            alt="Search Icon"
                            className="absolute right-3 top-6 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                        />
                    </div>
                    <select
                        name="category"
                        id="category"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                        <option className="text-[#000000]" value="all">
                            All Categories
                        </option>
                        <option className="text-[#000000]" value="category1">
                            Category 1
                        </option>
                        <option className="text-[#000000]" value="category2">
                            Category 2
                        </option>
                        <option className="text-[#000000]" value="category3">
                            Category 3
                        </option>
                    </select>
                </div>
                <button
                    className="text-[#F5F5FA] bg-[#219EBC] h-fit px-8 text-[24px] py-2 rounded-xl"
                    onClick={() => handleOpenModal(null)} // Open modal for new member
                >
                    &#43; Add New Record
                </button>
            </div>

            {/* Content */}
            <div className="flex w-full h-full">
                {/* Left Section: Cards and Service Requests */}
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    {/* Cards */}
                    <div className="flex gap-5 mb-5">
                        <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                            <div className="bg-[#EDFFEE] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                                <img
                                    src={TotalNumberIcon}
                                    alt="Total Number Icon"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-5xl">
                                    {membersData.length}
                                </h3>
                                <p className="text-[24px]">
                                    Total Health Records
                                </p>
                            </div>
                        </div>
                        <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                            <div className="bg-[#FFF1F8] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                                <img
                                    src={PriorityCareIcon}
                                    alt="Birthday Icon"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-5xl">15</h3>
                                <p className="text-[24px]">Priority Care</p>
                            </div>
                        </div>
                        <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                            <div className="bg-[#FFF5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                                <img
                                    src={RecentUpdatesIcon}
                                    alt="Recent Transactions Icon"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-5xl">10</h3>
                                <p className="text-[24px]">Recent Updates</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="min-w-full bg-[#FFFFFF] rounded-xl shadow-lg ">
                            <thead className="text-[#767171CC]">
                                <tr>
                                    <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                                        Name
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Medical Conditions
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Medications
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Allergies
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Emergency Contact
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Last Updated
                                    </th>
                                    <th className="px-8 text-left font-medium whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {membersData.map((row, index) => (
                                    <tr
                                        className={`text-[#333333] font-[500] ${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-[#F5F5FA]"
                                        }`}
                                        key={row.id}
                                    >
                                        <td className="px-16 py-4 whitespace-nowrap">
                                            {row.name}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.medical_conditions}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.medications}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.allergies}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.emergency_contact}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.last_updated}
                                        </td>

                                        <td className="px-8 py-4 whitespace-nowrap flex gap-5 items-center">
                                            <button
                                                aria-label="Edit"
                                                onClick={() =>
                                                    handleOpenModal(row)
                                                } // Pass member data to modal
                                            >
                                                <img
                                                    src={EditIcon}
                                                    alt="Edit"
                                                />
                                            </button>
                                            <button
                                                aria-label="Archive"
                                                onClick={() =>
                                                    handleArchiveClick(row)
                                                }
                                            >
                                                <img
                                                    src={ViewIcon}
                                                    alt="Archive"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    member={currentMember} // Pass member data to the modal
                />
            )}
            {isConfirmModalOpen && <ArchiveConfirmModal />}
        </section>
    )
}

export default HealthRecords
