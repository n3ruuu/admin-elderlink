import { useEffect, useState } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal" // Import the FinancialAssistanceModal
import ArchiveConfirmModal from "./ArchiveConfirmModal"
import SuccessModal from "./SuccessModal" // Import the SuccessModal

const FinancialAssistance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successTitle, setSuccessTitle] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isArchiving, setIsArchiving] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [memberToArchive, setMemberToArchive] = useState(null)
    const [membersData, setMembersData] = useState([])

    const fetchMemberById = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:5000/financial-assistance/${id}`,
            )
            if (!response.ok) throw new Error("Failed to fetch member data")
            return await response.json()
        } catch (error) {
            console.error("Error fetching member data:", error)
            return null
        }
    }

    const handleEditClick = async (row) => {
        const fetchedMemberData = await fetchMemberById(
            row.financial_assistance_id,
        )
        if (fetchedMemberData) {
            console.log(fetchedMemberData)
            setCurrentMember(fetchedMemberData)
            setIsModalOpen(true) // Open the modal for editing
        }
    }

    useEffect(() => {
        fetchMembersData()
    }, [])

    const fetchMembersData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/financial-assistance",
            )
            if (!response.ok) throw new Error("Network response was not ok")
            const data = await response.json()
            setMembersData(data)
        } catch (error) {
            console.error("Error fetching members data:", error)
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

    const handleShowSuccessModal = (title, message, archiving = false) => {
        setSuccessTitle(title)
        setSuccessMessage(message)
        setIsArchiving(archiving)
        setIsSuccessModalOpen(true)
    }

    const handleSave = async (newRecord) => {
        try {
            const method = currentMember ? "PUT" : "POST"
            const endpoint = currentMember
                ? `http://localhost:5000/financial-assistance/${currentMember.financial_assistance_id}`
                : "http://localhost:5000/financial-assistance"

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRecord),
            })

            if (!response.ok)
                throw new Error("Failed to save financial assistance record.")

            const savedRecord = await response.json()

            setMembersData((prevData) => {
                if (currentMember) {
                    return prevData.map((member) =>
                        member.financial_assistance_id ===
                        savedRecord.financial_assistance_id
                            ? savedRecord
                            : member,
                    )
                }
                return [...prevData, savedRecord]
            })

            handleCloseModal()
            handleShowSuccessModal(
                "Record Saved",
                "The financial assistance record has been saved successfully.",
            )
            fetchMembersData()
        } catch (error) {
            console.error("Error saving record:", error)
        }
    }

    const handleArchiveClick = (member) => {
        setMemberToArchive(member)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmArchive = async () => {
        try {
            await fetch(
                `http://localhost:5000/financial-assistance/${memberToArchive.financial_assistance_id}`,
                {
                    method: "DELETE",
                },
            )

            setMembersData((prevData) =>
                prevData.filter(
                    (member) =>
                        member.financial_assistance_id !==
                        memberToArchive.financial_assistance_id,
                ),
            )
            handleShowSuccessModal(
                "Member Archived",
                "The member has been archived successfully.",
                true,
            )
            handleCloseConfirmModal()
        } catch (error) {
            console.error("Error archiving member:", error)
        }
    }

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false)
        setMemberToArchive(null)
    }

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false)
    }

    const totalBeneficiaries = membersData.length
    const totalAmountDisbursed = 10 // Example value
    const upcomingPayouts = 15 // Example value

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header
                title="Financial Assistance"
                subtitle="Manage finances and benefits"
                onOpenModal={() => handleOpenModal(null)}
            />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards
                        totalBeneficiaries={totalBeneficiaries}
                        totalAmountDisbursed={totalAmountDisbursed}
                        upcomingPayouts={upcomingPayouts}
                    />
                    <Table
                        membersData={membersData}
                        onOpenModal={handleOpenModal}
                        handleArchiveClick={handleArchiveClick}
                        handleEditClick={handleEditClick} // Pass handleEditClick as a prop
                    />
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    modalData={currentMember} // Pass the current member data for editing
                    onCancel={handleCloseModal}
                    onAdd={handleSave} // This should handle both add and save
                    onSave={handleSave} // Ensure this prop is included for editing
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
                    title={successTitle}
                    message={successMessage}
                    onGoToArchives={() => {
                        /* Add your navigation logic here if needed */
                    }}
                    isArchiving={isArchiving}
                />
            )}
        </section>
    )
}

export default FinancialAssistance
