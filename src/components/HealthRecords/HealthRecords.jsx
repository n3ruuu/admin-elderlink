import { useState, useEffect } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import SuccessModal from "./SuccessModal" // Import SuccessModal

const HealthRecords = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentRecord, setCurrentRecord] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [recentUpdates, setRecentUpdates] = useState([])
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // State for SuccessModal
    const [successModalMessage, setSuccessModalMessage] = useState("") // Success message state
    const [successModalTitle, setSuccessModalTitle] = useState("") // Success title state

    const chronicConditions = ["Hypertension", "Diabetes Mellitus"]

    const priorityCareCount = [
        ...new Set(
            membersData
                .filter((member) =>
                    member.medical_conditions
                        ?.split(",")
                        .some((condition) => chronicConditions.includes(condition.trim())),
                )
                .map((member) => member.health_record_id),
        ),
    ].length

    const fetchMembersData = async () => {
        try {
            const response = await fetch("http://localhost:5000/members")
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            setMembersData(data)
        } catch (error) {
            console.error("Error fetching members data:", error)
        }
    }

    const fetchRecentUpdates = async () => {
        try {
            const response = await fetch("http://localhost:5000/log")
            if (!response.ok) {
                throw new Error("Failed to fetch logs")
            }

            const logs = await response.json()
            const healthUpdates = logs.filter((log) => log.action.includes("Health"))
            setRecentUpdates(healthUpdates)
        } catch (error) {
            console.error("Error fetching recent updates:", error)
        }
    }

    const handleSave = async () => {
        await fetchMembersData() // Refresh the members data
        setIsModalOpen(false) // Close the modal
        setCurrentRecord(null) // Reset the current member

        if (currentRecord) {
            // If we're editing an existing member
            setSuccessModalTitle("Update Completed!")
            setSuccessModalMessage("Member information has been successfully updated.")
        }

        setIsSuccessModalOpen(true) // Open the success modal
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentRecord(null)
    }

    useEffect(() => {
        fetchMembersData()
        fetchRecentUpdates()
    }, [])

    const handleOpenModal = (member) => {
        setCurrentRecord(member)
        setIsModalOpen(true)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards
                        totalRecords={membersData.length}
                        recentUpdatesCount={recentUpdates.length} // Pass recentUpdatesCount prop
                        priorityCareCount={priorityCareCount}
                    />
                    <Table membersData={membersData} onEdit={handleOpenModal} chronicConditions={chronicConditions} />
                </div>
            </div>
            {/* Success Modal moved here */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={successModalTitle}
                message={successModalMessage}
                onGoToArchives={() => console.log("Navigating to Archives")} // Implement this function if needed
                isArchiving={false} // Adjust based on your use case
            />
            {isModalOpen && (
                <Modal
                    onClose={handleCloseModal}
                    member={currentRecord}
                    onSave={handleSave} // Pass the handleSave function to the modal
                />
            )}
        </section>
    )
}

export default HealthRecords
