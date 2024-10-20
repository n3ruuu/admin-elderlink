import { useState, useEffect } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"

const HealthRecords = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [membersData, setMembersData] = useState([]) // Initialize as empty array

    // Fetch health records from the API
    useEffect(() => {
        const fetchMembersData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/health-records",
                )
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const data = await response.json()
                setMembersData(data) // Set the fetched data
            } catch (error) {
                console.error("Error fetching members data:", error)
            }
        }

        fetchMembersData()
    }, []) // Empty dependency array to run once on component mount

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
                    member.id === updatedMember.member_id
                        ? updatedMember
                        : member,
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

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header Section */}
            <Header onOpenModal={handleOpenModal} />

            {/* Content */}
            <div className="flex w-full h-full">
                {/* Left Section: Cards and Service Requests */}
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    {/* Stats Cards */}
                    <Cards totalRecords={totalRecords} />

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
                    membersList={membersData} // Pass the list of members for dropdown and search
                />
            )}
            {isConfirmModalOpen && <ArchiveConfirmModal />}
        </section>
    )
}

export default HealthRecords
