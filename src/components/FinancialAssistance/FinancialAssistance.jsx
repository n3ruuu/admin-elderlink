import { useState } from "react"
import MembersListData from "../../data/membersList.json"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./SearchNameModal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"

const FinancialAssistance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [memberToArchive, setMemberToArchive] = useState(null)
    const [membersData, setMembersData] = useState(MembersListData)

    // Opens modal for adding or editing a member
    const handleOpenModal = (member) => {
        setCurrentMember(member)
        setIsModalOpen(true)
    }

    // Closes the member modal
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentMember(null)
    }

    // Save or update member
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

    // Opens confirmation modal for archiving a member
    const handleArchiveClick = (member) => {
        setMemberToArchive(member)
        setIsConfirmModalOpen(true)
    }

    // Confirms archiving and removes member
    const handleConfirmArchive = () => {
        setMembersData((prevData) =>
            prevData.filter((member) => member.id !== memberToArchive.id),
        )
        handleCloseConfirmModal()
    }

    // Closes the archive confirmation modal
    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false)
        setMemberToArchive(null)
    }

    // Calculate statistics
    const totalBeneficiaries = membersData.length
    const totalAmountDisbursed = 10 // Example value
    const upcomingPayouts = 15 // Example value

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header Section */}
            <Header
                title="Financial Assistance"
                subtitle="Manage finances and benefits"
                onOpenModal={() => handleOpenModal(null)} // Passing the correct prop name here
            />

            {/* Content */}
            <div className="flex w-full h-full">
                {/* Left Section: Cards */}
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    {/* Stats Cards */}
                    <Cards
                        totalBeneficiaries={totalBeneficiaries}
                        totalAmountDisbursed={totalAmountDisbursed}
                        upcomingPayouts={upcomingPayouts}
                    />

                    {/* Financial Assistance Table */}
                    <Table
                        membersData={membersData}
                        onOpenModal={handleOpenModal}
                        onArchiveClick={handleArchiveClick}
                    />
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
