import { useEffect, useState } from "react"
import Modal from "./AddNewMemberModal/Modal"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"

const MembersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
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
            // You can set an error state here if you want to notify the user
            return
        }

        // Update the members data with new members if no duplicates
        setMembersData((prevMembers) => [...prevMembers, ...newMembers])
    }

    // Filter members to show only those with "Active" status
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
                            membersData={activeMembers} // Pass only active members to the Table
                            handleOpenModal={handleOpenModal}
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
                    onImportCSV={handleImportCSV}
                    member={currentMember}
                    existingMembers={membersData} // Pass existing members here
                />
            )}
        </section>
    )
}

export default MembersList
