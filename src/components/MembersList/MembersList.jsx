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
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
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

    const handleSave = async (updatedMember) => {
        if (currentMember) {
            // Editing an existing member
            setMembersData((prevData) =>
                prevData.map((member) =>
                    member.id === updatedMember.id ? updatedMember : member,
                ),
            )
        } else {
            // Adding a new member
            const newMember = {
                ...updatedMember,
                id: membersData.length
                    ? membersData[membersData.length - 1].id + 1
                    : 1, // Assign a new ID
            }

            // Send the new member data to your backend
            try {
                const response = await fetch("http://localhost:5000/members", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMember),
                })

                if (!response.ok) {
                    throw new Error("Failed to add member")
                }

                // If successful, update the local state
                setMembersData((prevData) => [...prevData, newMember])
            } catch (error) {
                console.error("Error adding member:", error)
                // Optionally, handle error state
            }
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
            <Header handleOpenModal={() => handleOpenModal(null)} />{" "}
            {/* Pass null to open modal for adding a member */}
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
                    member={currentMember} // Pass current member for editing or null for adding
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
