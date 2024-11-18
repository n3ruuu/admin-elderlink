import { useEffect, useState } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import SuccessModal from "./SuccessModal"
import ArchiveModal from "./ArchiveModal"
import moment from "moment" // You can use moment.js to help with date manipulation

const FinancialAssistance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successTitle, setSuccessTitle] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isArchiving, setIsArchiving] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [recordToArchive, setRecordToArchive] = useState(null)
    const [searchTerm, setSearchTerm] = useState("") // Add state for search term

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const logAction = async (action) => {
        try {
            const response = await fetch("http://localhost:5000/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"), // Current timestamp in ISO format
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to log action")
            }

            console.log("Action logged successfully")
        } catch (error) {
            console.error("Error logging action:", error)
        }
    }

    const filteredBenefit = membersData.filter((member) => {
        const searchTermLower = searchTerm.toLowerCase() // Convert searchTerm to lowercase once to optimize performance
        return (
            member.status === "Active" && // Only include records with status "Active"
            ((member.financial_assistance_id &&
                member.financial_assistance_id
                    .toString()
                    .includes(searchTermLower)) ||
                (member.member_id &&
                    member.member_id.toString().includes(searchTermLower)) ||
                (member.member_name &&
                    member.member_name
                        .toLowerCase()
                        .includes(searchTermLower)) ||
                (member.benefit_type &&
                    member.benefit_type
                        .toLowerCase()
                        .includes(searchTermLower)) ||
                (member.date_of_claim &&
                    member.date_of_claim
                        .toLowerCase()
                        .includes(searchTermLower)) ||
                (member.benefit_status &&
                    member.benefit_status
                        .toLowerCase()
                        .includes(searchTermLower)) ||
                (member.claimer &&
                    member.claimer.toLowerCase().includes(searchTermLower)) ||
                (member.relationship &&
                    member.relationship
                        .toLowerCase()
                        .includes(searchTermLower)) ||
                (member.status &&
                    member.status.toLowerCase().includes(searchTermLower)))
        )
    })

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
            setCurrentMember(fetchedMemberData)
            setIsModalOpen(true)
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

    const handleShowSuccessModal = (title, message) => {
        setSuccessTitle(title)
        setSuccessMessage(message)
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

            // Determine action based on whether it's a new record or an update
            const action = currentMember
                ? "Update Financial Record"
                : "New Financial Record"

            // Log the action
            await logAction(action)

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
                currentMember ? "Record Updated" : "Record Saved",
                "The financial assistance record has been saved successfully.",
            )
            fetchMembersData()
            setIsArchiving(false)
        } catch (error) {
            console.error("Error saving record:", error)
        }
    }

    const handleArchiveClick = (member) => {
        setRecordToArchive(member)
        setIsConfirmModalOpen(true)
        setIsArchiving(true)
    }

    const handleConfirmArchive = async (selectedReason) => {
        if (!recordToArchive) return

        try {
            await fetch(
                `http://localhost:5000/financial-assistance/archive/${recordToArchive.financial_assistance_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: selectedReason }),
                },
            )

            await logAction(`Archive Financial Record`)

            setSuccessTitle("Financial Assistance Record Archived!")
            setSuccessMessage(
                "The financial assistance record has been successfully archived.",
            )
            fetchMembersData()
            setIsSuccessModalOpen(true)
            setIsArchiving(true)
            console.log(isArchiving)
        } catch (error) {
            console.error("Error archiving financial assistance record:", error)
        } finally {
            setIsConfirmModalOpen(false)
            setRecordToArchive(null)
        }
    }

    const getMonthlyTotalPayouts = () => {
        const startOfMonth = moment().startOf("month")
        const endOfMonth = moment().endOf("month")

        return membersData.filter((member) => {
            const claimDate = moment(member.date_of_claim)
            return claimDate.isBetween(startOfMonth, endOfMonth, null, "[]")
        }).length // Return the number of records (payouts) in this month
    }

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false)
    }

    // Calculate upcoming payouts for the current week
    const getUpcomingPayoutsThisWeek = () => {
        const startOfWeek = moment().startOf("week")
        const endOfWeek = moment().endOf("week")

        return membersData.filter((member) => {
            const claimDate = moment(member.date_of_claim)
            return claimDate.isBetween(startOfWeek, endOfWeek, null, "[]")
        }).length
    }

    const totalBeneficiaries = filteredBenefit.length
    const upcomingPayouts = getUpcomingPayoutsThisWeek() // Payouts within this week
    const monthlyTotalPayouts = getMonthlyTotalPayouts() // Get the total for the current month

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header
                title="Financial Assistance"
                subtitle="Manage finances and benefits"
                onOpenModal={() => handleOpenModal(null)}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards
                        totalBeneficiaries={totalBeneficiaries}
                        monthlyTotalPayouts={monthlyTotalPayouts}
                        upcomingPayouts={upcomingPayouts}
                    />
                    <Table
                        membersData={filteredBenefit}
                        onOpenModal={handleOpenModal}
                        handleEditClick={handleEditClick}
                        onArchiveClick={handleArchiveClick} // Pass handleArchive to the Table component
                    />
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    modalData={currentMember}
                    onCancel={handleCloseModal}
                    onAdd={handleSave}
                    onSave={handleSave}
                />
            )}

            {isConfirmModalOpen && (
                <ArchiveModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmArchive}
                />
            )}

            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={handleCloseSuccessModal}
                    title={successTitle}
                    message={successMessage}
                    isArchiving={isArchiving}
                />
            )}
        </section>
    )
}

export default FinancialAssistance
