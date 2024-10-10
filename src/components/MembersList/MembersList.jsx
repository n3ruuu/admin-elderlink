import { useEffect, useState } from "react"
import Modal from "./AddNewMemberModal/Modal" // Import your AddNewMemberModal
import SuccessModal from "./AddNewMemberModal/SuccessModal" // Import your SuccessModal
import Header from "./Header" // Import your Header component
import Cards from "./Cards" // Import your Cards component
import Table from "./Table" // Import your Table component

const MembersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // State for SuccessModal
    const [currentMember, setCurrentMember] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successModalMessage, setSuccessModalMessage] = useState("") // State to hold success message
    const [successModalTitle, setSuccessModalTitle] = useState("") // State to hold success modal title

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
        fetchMembersData()
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

                setMembersData((prevMembers) =>
                    prevMembers.map((member) =>
                        member.id === currentMember.id ? updatedMember : member,
                    ),
                )

                setSuccessModalTitle("Update Completed!") // Set title for editing
                setSuccessModalMessage("Member updated successfully!") // Update message for edit
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

                const newMember = await response.json()
                setMembersData((prevMembers) => [...prevMembers, newMember])

                setSuccessModalTitle("Member Added!") // Set title for adding
                setSuccessModalMessage("Member has been successfully added!") // Message for adding
            } catch (error) {
                console.error("Error adding member:", error)
            }
        }

        setIsSuccessModalOpen(true)
        handleCloseModal()
    }

    const handleArchiveMember = (archivedMemberId) => {
        // Remove archived member from state
        setMembersData((prevMembers) =>
            prevMembers.filter((member) => member.id !== archivedMemberId),
        )
    }

    const handleImportCSV = (newMembers) => {
        // Check for duplicates before adding new members
        const duplicates = newMembers.filter((newMember) =>
            membersData.some(
                (existingMember) =>
                    `${existingMember.firstName} ${existingMember.lastName}`.toLowerCase() ===
                    `${newMember.firstName} ${newMember.lastName}`.toLowerCase(),
            ),
        )

        if (duplicates.length > 0) {
            console.error("Duplicate members found:", duplicates)
            return
        }

        // Update the members data with new members if no duplicates
        setMembersData((prevMembers) => [...prevMembers, ...newMembers])
    }

    const activeMembers = membersData.filter(
        (member) => member.status === "Active",
    )

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header handleOpenModal={() => handleOpenModal(null)} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards membersData={activeMembers} />
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <Table
                            membersData={activeMembers}
                            handleOpenModal={handleOpenModal}
                            handleArchiveMember={handleArchiveMember}
                        />
                    )}
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    onImportCSV={handleImportCSV}
                    member={currentMember}
                    existingMembers={membersData}
                />
            )}
            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={successModalTitle} // Pass the dynamic title
                    message={successModalMessage} // Pass the dynamic message
                />
            )}
        </section>
    )
}

export default MembersList
