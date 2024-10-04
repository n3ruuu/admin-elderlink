// src/components/HealthRecords.jsx

import { useState } from "react"
import MembersListData from "../../data/membersList.json"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
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

    // Calculate statistics
    const totalRecords = membersData.length
    const priorityCareCount = membersData.filter(
        (member) => member.priority_care,
    ).length
    const recentUpdatesCount = membersData.filter(
        (member) => member.recent_updates,
    ).length

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header Section */}
            <Header onOpenModal={handleOpenModal} />

            {/* Content */}
            <div className="flex w-full h-full">
                {/* Left Section: Cards and Service Requests */}
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    {/* Stats Cards */}
                    <Cards
                        totalRecords={totalRecords}
                        priorityCareCount={priorityCareCount}
                        recentUpdatesCount={recentUpdatesCount}
                    />

                    {/* Health Records Table */}
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
            {isConfirmModalOpen && <ArchiveConfirmModal />}
        </section>
    )
}

export default HealthRecords
