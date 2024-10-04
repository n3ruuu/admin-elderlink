import { useEffect, useState } from "react"
import Modal from "./Modal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"

const MembersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [memberToArchive, setMemberToArchive] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchMembersData()
    }, [])

    const fetchMembersData = async () => {
        try {
            const response = await fetch("http://localhost:5000/members")
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            setMembersData(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (member) => {
        setCurrentMember(member)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentMember(null)
    }

    const handleSave = async (updatedMember) => {
        if (currentMember) {
            // Editing an existing member
            try {
                const response = await fetch(
                    `http://localhost:5000/members/${currentMember.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedMember),
                    },
                )

                if (!response.ok) {
                    throw new Error("Failed to update member")
                }

                // Re-fetch members data to get updated list
                fetchMembersData()
            } catch (error) {
                console.error("Error updating member:", error)
            }
        } else {
            // Adding a new member
            try {
                const response = await fetch("http://localhost:5000/members", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedMember),
                })

                if (!response.ok) {
                    throw new Error("Failed to add member")
                }

                // Re-fetch members data to get updated list
                fetchMembersData()
            } catch (error) {
                console.error("Error adding member:", error)
            }
        }
        handleCloseModal() // Close the modal after saving
    }

    const handleImportCSV = (newMembers) => {
        // Update the members data with new members
        setMembersData((prevMembers) => [...prevMembers, ...newMembers])
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
            <Header handleOpenModal={() => handleOpenModal(null)} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards membersData={membersData} />
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
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
                    onImportCSV={handleImportCSV} // Pass the import function
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
