import { useEffect, useState } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import FinancialAssistanceModal from "./Modal" // Import the FinancialAssistanceModal
import ArchiveConfirmModal from "./ArchiveConfirmModal"
import SuccessModal from "./SuccessModal" // Import the SuccessModal

const FinancialAssistance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successTitle, setSuccessTitle] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isArchiving, setIsArchiving] = useState(false) // New state to manage archiving status
    const [currentMember, setCurrentMember] = useState(null)
    const [memberToArchive, setMemberToArchive] = useState(null)
    const [membersData, setMembersData] = useState([])

    useEffect(() => {
        fetchMembersData() // Fetch data on mount
    }, [])

    // Fetch members data from the database
    const fetchMembersData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/financial-assistance",
            )
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            setMembersData(data) // Set the fetched data to state
        } catch (error) {
            console.error("Error fetching members data:", error)
        }
    }

    // Opens modal for adding or editing a member
    const handleOpenModal = (member) => {
        setCurrentMember(member)
        setIsModalOpen(true)
    }

    // Closes the member modal
    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentMember(null)
    }

    // Show success modal after saving or archiving
    const handleShowSuccessModal = (title, message, archiving = false) => {
        setSuccessTitle(title)
        setSuccessMessage(message)
        setIsArchiving(archiving) // Determine if the action is archiving or saving
        setIsSuccessModalOpen(true)
    }

    // Function to handle saving financial assistance records
    const handleSave = async (newRecord) => {
        try {
            const response = await fetch(
                "http://localhost:5000/financial-assistance",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newRecord),
                },
            )

            if (!response.ok) {
                throw new Error("Failed to save financial assistance record.")
            }

            const savedRecord = await response.json()

            // Update membersData state with the newly saved record
            setMembersData((prevData) => [...prevData, savedRecord])

            // Close the modal after saving
            handleCloseModal()

            // Show success modal
            handleShowSuccessModal(
                "Record Saved",
                "The financial assistance record has been saved successfully.",
            )
            fetchMembersData()
            console.log("Success")
        } catch (error) {
            console.error("Error saving record:", error)
        }
    }

    // Opens confirmation modal for archiving a member
    const handleArchiveClick = (member) => {
        setMemberToArchive(member)
        setIsConfirmModalOpen(true)
    }

    // Confirms archiving and removes member
    const handleConfirmArchive = () => {
        setMembersData((prevData) =>
            prevData.filter((member) => member.id !== memberToArchive.id),
        )
        handleShowSuccessModal(
            "Member Archived",
            "The member has been archived successfully.",
            true,
        ) // Indicate that this is an archiving action
        handleCloseConfirmModal()
    }

    // Closes the archive confirmation modal
    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false)
        setMemberToArchive(null)
    }

    // Closes the success modal
    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false)
    }

    // Calculate statistics
    const totalBeneficiaries = membersData.length
    const totalAmountDisbursed = 10 // Example value
    const upcomingPayouts = 15 // Example value

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header Section */}
            <Header
                title="Financial Assistance"
                subtitle="Manage finances and benefits"
                onOpenModal={() => handleOpenModal(null)} // Open the modal for adding
            />

            {/* Content */}
            <div className="flex w-full h-full">
                {/* Left Section: Cards */}
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    {/* Stats Cards */}
                    <Cards
                        totalBeneficiaries={totalBeneficiaries}
                        totalAmountDisbursed={totalAmountDisbursed}
                        upcomingPayouts={upcomingPayouts}
                    />

                    {/* Financial Assistance Table */}
                    <Table
                        membersData={membersData}
                        handleOpenModal={handleOpenModal}
                        handleArchiveClick={handleArchiveClick}
                    />
                </div>
            </div>

            {/* Modals */}
            {isModalOpen && (
                <FinancialAssistanceModal
                    memberName={currentMember ? currentMember.name : ""}
                    onCancel={handleCloseModal}
                    onAdd={handleSave} // Pass handleSave function to modal
                    member={currentMember} // Pass member data to the modal
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
            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={handleCloseSuccessModal}
                    title={successTitle} // Dynamic title for the success modal
                    message={successMessage} // Dynamic message for the success modal
                    onGoToArchives={() => {
                        // Add your navigation logic here if needed
                    }}
                    isArchiving={isArchiving} // Pass whether this is an archiving action
                />
            )}
        </section>
    )
}

export default FinancialAssistance
