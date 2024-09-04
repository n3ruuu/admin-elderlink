import { useState } from "react"
import SearchIcon from "../assets/icons/search.svg"
import BeneficiariesIcon from "../assets/icons/beneficiaries-icon.svg"
import PayoutIcon from "../assets/icons/payout-icon.svg"
import DisburseIcon from "../assets/icons/disburse-icon.svg"
import EditIcon from "../assets/icons/edit.svg"
import ArchiveIcon from "../assets/icons/archive2.svg"
import MembersListData from "../data/membersList.json"
import Modal from "../modals/FinancialAssistanceModal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"

const FinancialAssistance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [memberToArchive, setMemberToArchive] = useState(null)
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

    const handleArchiveClick = (member) => {
        setMemberToArchive(member)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmArchive = () => {
        setMembersData((prevData) =>
            prevData.filter((member) => member.id !== memberToArchive.id),
        )
        setIsConfirmModalOpen(false)
        setMemberToArchive(null)
    }

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false)
        setMemberToArchive(null)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header */}
            <div className="p-16 w-full pb-8 flex items-start">
                <div className="w-1/2">
                    <h1 className="text-6xl font-bold">Financial Assistance</h1>
                    <p className="text-[#767171CC] mt-3">
                        Manage finances and benefits
                    </p>
                </div>
                <div className="flex items-start w-1/2 text-[#76717180]">
                    <div className="relative w-full">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="p-3 pr-12 border border-gray-300 border-r-0 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
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
                        className="p-3 border h-[50px] border-gray-300 rounded-r-xl border-l-1 focus:outline-none"
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
                    <button
                        className="text-[#F5F5FA] bg-[#219EBC] w-full px-8 ml-4 text-[24px] py-2 rounded-xl"
                        onClick={() => handleOpenModal(null)} // Open modal for new member
                    >
                        &#43; Add Beneficiary
                    </button>
                </div>
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
                                    src={BeneficiariesIcon}
                                    alt="Total Number Icon"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-5xl">
                                    {membersData.length}
                                </h3>
                                <p className="text-[24px]">Total Benefiaries</p>
                            </div>
                        </div>
                        <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                            <div className="bg-[#FFF5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                                <img
                                    src={DisburseIcon}
                                    alt="Recent Transactions Icon"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-5xl">10</h3>
                                <p className="text-[24px]">
                                    Total Amount Disbursed
                                </p>
                            </div>
                        </div>
                        <div className="bg-white w-1/3 h-[200px] rounded-[12px] p-8 flex gap-4 items-center">
                            <div className="bg-[#FFF1F8] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                                <img src={PayoutIcon} alt="Birthday Icon" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-5xl">15</h3>
                                <p className="text-[24px]">Upcoming Payouts</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                            <thead className="text-[#767171CC]">
                                <tr>
                                    <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                                        Name
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Age
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Benefit Type
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Benefit Status
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Last Claimed
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Claimer
                                    </th>
                                    <th className="text-left font-medium whitespace-nowrap">
                                        Relationship
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
                                            {row.age}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.benefit_type}
                                        </td>
                                        <td
                                            className={`whitespace-nowrap font-[500] ${
                                                row.benefit_status === "Claimed"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {row.benefit_status}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.last_claimed}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.claimer}
                                        </td>
                                        <td className="whitespace-nowrap">
                                            {row.relationship}
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
                                                    src={ArchiveIcon}
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
            {isConfirmModalOpen && (
                <ArchiveConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={handleCloseConfirmModal}
                    onConfirm={handleConfirmArchive}
                    memberName={memberToArchive ? memberToArchive.name : ""}
                />
            )}
        </section>
    )
}

export default FinancialAssistance
