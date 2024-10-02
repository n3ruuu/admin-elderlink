import { useEffect, useState } from "react"
import Modal from "./Modal"
import ArchiveConfirmModal from "../ArchiveConfirmModal"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"

const MembersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [memberToArchive, setMemberToArchive] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [loading, setLoading] = useState(true) // Add loading state
    const [error, setError] = useState(null) // Add error state

    useEffect(() => {
        const fetchMembersData = async () => {
            try {
                const response = await fetch("http://localhost:5000/members") // Adjust the URL to match your backend
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const data = await response.json()
                setMembersData(data) // Set the fetched data
            } catch (err) {
                setError(err.message) // Set error message
            } finally {
                setLoading(false) // Set loading to false
            }
        }

        fetchMembersData()
    }, [])

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
            setMembersData((prevData) =>
                prevData.map((member) =>
                    member.id === updatedMember.id ? updatedMember : member,
                ),
            )
        } else {
            setMembersData((prevData) => [
                ...prevData,
                { ...updatedMember, id: prevData.length + 1 },
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
            <Header handleOpenModal={handleOpenModal} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards membersData={membersData} />
                    {loading ? ( // Show loading indicator
                        <div>Loading...</div>
                    ) : error ? ( // Show error message
                        <div>Error: {error}</div>
                    ) : (
                        <Table
                            membersData={membersData}
                            handleOpenModal={handleOpenModal}
                            handleArchiveClick={handleArchiveClick}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    member={currentMember}
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

export default MembersList
