import { useState, useEffect } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import ArchiveConfirmModal from "./ArchiveModal"
import SuccessModal from "./SuccessModal"

const HealthRecords = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentRecord, setCurrentRecord] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [successTitle, setSuccessTitle] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [recentUpdatesCount, setRecentUpdatesCount] = useState(0)
    const [recordToArchive, setRecordToArchive] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isArchiving, setIsArchiving] = useState(false)

    // Fetch recentUpdatesCount from localStorage on initial render
    useEffect(() => {
        const storedUpdatesCount = localStorage.getItem("recentUpdatesCount")
        if (storedUpdatesCount) {
            setRecentUpdatesCount(Number(storedUpdatesCount)) // Convert to number if stored as string
        }
    }, [])

    const fetchMembersData = async () => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:5000/health-records")
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            setMembersData(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMembersData()
    }, [])

    const filteredRecords = membersData.filter((member) => {
        const searchTermLower = searchTerm.toLowerCase()
        return (
            member.status === "Active" &&
            (member.member_name.toLowerCase().includes(searchTermLower) ||
                (member.medical_conditions &&
                    member.medical_conditions
                        .toLowerCase()
                        .includes(searchTermLower)) ||
                (member.medications &&
                    member.medications
                        .toLowerCase()
                        .includes(searchTermLower)) ||
                (member.guardian &&
                    member.guardian.toLowerCase().includes(searchTermLower)) ||
                (member.relationship &&
                    member.relationship
                        .toLowerCase()
                        .includes(searchTermLower)) ||
                (member.emergency_contact &&
                    member.emergency_contact
                        .toString()
                        .toLowerCase()
                        .includes(searchTermLower)))
        )
    })

    const handleOpenModal = (member) => {
        setCurrentRecord(member)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentRecord(null)
    }

    const incrementUpdatesCount = () => {
        setRecentUpdatesCount((prevCount) => {
            const newCount = prevCount + 1
            localStorage.setItem("recentUpdatesCount", newCount) // Save to localStorage
            return newCount
        })
    }

    const handleSave = async (updatedMember) => {
        try {
            const now = new Date().toISOString()
            updatedMember.record_date = now

            if (currentRecord) {
                // Updating existing health record
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
                incrementUpdatesCount() // Increment count after update
            } else {
                // Adding a new health record
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
                incrementUpdatesCount() // Increment count after adding
            }

            fetchMembersData() // Refresh the members data
            handleCloseModal()

            // Set isArchiving to false when adding a new record
            setIsSuccessModalOpen(true)
            setIsArchiving(false) // Set to false here, since it's not archiving
        } catch (error) {
            console.error("Error saving health record:", error)
        }
    }

    const handleArchiveClick = (member) => {
        setRecordToArchive(member)
        setIsArchiving(true) // Set isArchiving to true when archiving
        setIsConfirmModalOpen(true)
    }

    const handleConfirmArchive = async (selectedReason) => {
        if (!recordToArchive) return

        try {
            const response = await fetch(
                `http://localhost:5000/health-records/archive/${recordToArchive.health_record_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: selectedReason }),
                },
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to archive the health record",
                )
            }

            setSuccessTitle("Health Record Archived!")
            setSuccessMessage(
                "The health record has been successfully archived.",
            )
            incrementUpdatesCount() // Increment count after archiving
            fetchMembersData() // Refresh the member data after archiving
            setIsSuccessModalOpen(true)
        } catch (error) {
            console.error("Error archiving health record:", error)
        } finally {
            setIsConfirmModalOpen(false)
            setRecordToArchive(null)
        }
    }

    const getActiveMembers = () => {
        return filteredRecords
    }

    const totalRecords = getActiveMembers().length

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header
                onOpenModal={handleOpenModal}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards
                        totalRecords={totalRecords}
                        recentUpdatesCount={recentUpdatesCount} // Pass recentUpdatesCount prop
                    />
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <Table
                            membersData={getActiveMembers()}
                            onOpenModal={handleOpenModal}
                            onArchiveClick={handleArchiveClick}
                        />
                    )}
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    member={currentRecord}
                    membersList={membersData}
                />
            )}
            {isConfirmModalOpen && (
                <ArchiveConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmArchive}
                />
            )}
            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={successTitle}
                    message={successMessage}
                    isArchiving={isArchiving} // Pass isArchiving here
                />
            )}
        </section>
    )
}

export default HealthRecords
