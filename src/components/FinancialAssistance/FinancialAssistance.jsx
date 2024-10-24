/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./SearchNameModal"
import ArchiveConfirmModal from "./ArchiveConfirmModal"
import SuccessModal from "./SuccessModal" // Import the SuccessModal

const FinancialAssistance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // State for SuccessModal
    const [successTitle, setSuccessTitle] = useState("") // State for SuccessModal title
    const [successMessage, setSuccessMessage] = useState("") // State for SuccessModal message
    const [currentMember, setCurrentMember] = useState(null)
    const [memberToArchive, setMemberToArchive] = useState(null)
    const [membersData, setMembersData] = useState([])

    // New state for financial records
    const [financialRecords, setFinancialRecords] = useState([])

    // Fetch members data from the database
    useEffect(() => {
        const fetchMembersData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/financial-assistance",
                ) // Update this endpoint to match your backend
                const data = await response.json()
                setMembersData(data) // Set the fetched data to state
            } catch (error) {
                console.error("Error fetching members data:", error)
            }
        }
        fetchMembersData()
    }, [])

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
    const handleShowSuccessModal = (title, message) => {
        setSuccessTitle(title)
        setSuccessMessage(message)
        setIsSuccessModalOpen(true)
    }

    const handleSave = (updatedRecord) => {
        if (currentMember) {
            // Update existing member
            setMembersData((prevData) =>
                prevData.map((member) =>
                    member.id === updatedRecord.id ? updatedRecord : member,
                ),
            )
            handleShowSuccessModal(
                "Member Updated",
                "The member details have been updated successfully.",
            )
        } else {
            // Adding new financial record
            const newRecord = {
                ...updatedRecord,
                member_id: currentMember.id, // Reference the ID of the selected member
                member_name: currentMember.name, // Ensure the member name is included
                id: financialRecords.length + 1, // Simple ID generation
            }

            setFinancialRecords((prevRecords) => [...prevRecords, newRecord])

            // Sending POST request to save to your database
            fetch("http://localhost:5000/financial-assistance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newRecord),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Success:", data)
                    handleShowSuccessModal(
                        "Record Added",
                        "The financial assistance record has been added successfully.",
                    )
                })
                .catch((error) => {
                    console.error("Error:", error)
                })
        }
        handleCloseModal()
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
        )
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
                onOpenModal={() => handleOpenModal(null)} // Passing the correct prop name here
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
                    isArchiving={false} // Adjust this based on your logic
                />
            )}
        </section>
    )
}

export default FinancialAssistance
