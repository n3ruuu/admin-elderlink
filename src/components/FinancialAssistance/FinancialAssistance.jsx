import { useEffect, useState } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import moment from "moment" // You can use moment.js to help with date manipulation
import SuccessModal from "./SuccessModal" // Import SuccessModal

const FinancialAssistance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // State for SuccessModal
    const [successModalMessage, setSuccessModalMessage] = useState("") // Success message state
    const [successModalTitle, setSuccessModalTitle] = useState("") // Success title state

    useEffect(() => {
        fetchMembersData()
    }, [])

    const fetchMembersData = async () => {
        try {
            const response = await fetch("http://localhost:5000/financial-assistance")
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

    const getMonthlyTotalPayouts = () => {
        const startOfMonth = moment().startOf("month")
        const endOfMonth = moment().endOf("month")

        return membersData.filter((member) => {
            const claimDate = moment(member.date_of_claim)
            return (
                member.status === "Active" && // Check if the status is "Active"
                claimDate.isBetween(startOfMonth, endOfMonth, null, "[]")
            )
        }).length // Return the number of active payouts in this month
    }

    // Calculate upcoming payouts for the current week
    const getUpcomingPayoutsThisWeek = () => {
        const startOfWeek = moment().startOf("week")
        const endOfWeek = moment().endOf("week")

        return membersData.filter((member) => {
            const claimDate = moment(member.date_of_claim)
            return (
                member.status === "Active" && // Check if the status is "Active"
                claimDate.isBetween(startOfWeek, endOfWeek, null, "[]")
            )
        }).length // Return the number of active payouts in this week
    }

    const handleSave = async () => {
        await fetchMembersData() // Refresh the members data
        setIsModalOpen(false) // Close the modal
        setCurrentMember(null) // Reset the current member

        if (currentMember) {
            // If we're editing an existing member
            setSuccessModalTitle("Update Completed!")
            setSuccessModalMessage("Member information has been successfully updated.")
        }

        setIsSuccessModalOpen(true) // Open the success modal
    }

    const totalBeneficiaries = membersData.length
    const upcomingPayouts = getUpcomingPayoutsThisWeek() // Payouts within this week
    const monthlyTotalPayouts = getMonthlyTotalPayouts() // Get the total for the current month

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
                        monthlyTotalPayouts={monthlyTotalPayouts}
                        upcomingPayouts={upcomingPayouts}
                    />
                    fetchMembersData()
                    <Table membersData={membersData} onEdit={handleOpenModal} fetchMembersData={fetchMembersData} />
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
                    member={currentMember}
                    onSave={handleSave} // Pass the handleSave function to the modal
                />
            )}
        </section>
    )
}

export default FinancialAssistance
