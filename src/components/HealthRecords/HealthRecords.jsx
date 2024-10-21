import { useState, useEffect } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"
import SuccessModal from "./SuccessModal"

const HealthRecords = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successTitle, setSuccessTitle] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [priorityCareCount, setPriorityCareCount] = useState(0)
    const [recentUpdatesCount, setRecentUpdatesCount] = useState(0)

    const fetchMembersData = async () => {
        try {
            const response = await fetch("http://localhost:5000/health-records")
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            setMembersData(data)
        } catch (error) {
            console.error("Error fetching members data:", error)
        }
    }

    const fetchPriorityCareCount = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/health-records/priority-care/count",
            )
            const data = await response.json()
            setPriorityCareCount(data.count)
        } catch (error) {
            console.error("Error fetching priority care count:", error)
        }
    }

    const fetchRecentUpdatesCount = async () => {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        try {
            const response = await fetch(
                `http://localhost:5000/health-records?since=${oneWeekAgo.toISOString()}`,
            )
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            setRecentUpdatesCount(data.length)
        } catch (error) {
            console.error("Error fetching recent updates count:", error)
        }
    }

    useEffect(() => {
        fetchMembersData()
        fetchPriorityCareCount()
        fetchRecentUpdatesCount()
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
        try {
            const now = new Date().toISOString() // Get the current date
            updatedMember.record_date = now // Set the updated date

            if (currentMember) {
                // Editing existing member
                await fetch(
                    `http://localhost:5000/health-records/${updatedMember.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedMember),
                    },
                )
                setSuccessTitle("Health Record Updated!")
                setSuccessMessage(
                    "Member health record has been successfully updated.",
                )
                setRecentUpdatesCount((prevCount) => prevCount + 1) // Increment recent updates count
            } else {
                // Adding new member
                await fetch("http://localhost:5000/health-records", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedMember),
                })
                setSuccessTitle("Health Record Added!")
                setSuccessMessage(
                    "The health record has been successfully added to the list.",
                )
                setRecentUpdatesCount((prevCount) => prevCount + 1) // Increment recent updates count
            }

            fetchMembersData()
            fetchPriorityCareCount() // Refresh the priority care count

            handleCloseModal()
            setIsSuccessModalOpen(true)
        } catch (error) {
            console.error("Error saving health record:", error)
        }
    }

    const handleArchiveClick = () => {
        setIsConfirmModalOpen(true)
    }

    const totalRecords = membersData.length

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header onOpenModal={handleOpenModal} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards
                        totalRecords={totalRecords}
                        priorityCareCount={priorityCareCount}
                        recentUpdatesCount={recentUpdatesCount}
                    />
                    <Table
                        membersData={membersData}
                        onOpenModal={handleOpenModal}
                        onArchiveClick={handleArchiveClick}
                    />
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    member={currentMember}
                    membersList={membersData}
                />
            )}
            {isConfirmModalOpen && (
                <ArchiveConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                />
            )}
            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={successTitle}
                    message={successMessage}
                />
            )}
        </section>
    )
}

export default HealthRecords
