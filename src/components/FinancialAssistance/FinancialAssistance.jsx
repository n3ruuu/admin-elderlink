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
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchMembersData()
    }, [])

    const fetchMembersData = async () => {
        try {
            const response = await fetch("http://localhost:5000/financial-assistance/social-pension") // Assuming endpoint is for social_pension table
            if (!response.ok) throw new Error("Network response was not ok")
            const data = await response.json()
            setMembersData(data)
        } catch (error) {
            console.error("Error fetching members data:", error)
        }
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

    const handleOpenModal = (member) => {
        setCurrentMember(member)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentMember(null)
        console.log("CLOSING")
    }

    const getMonthlyTotalPayouts = () => {
        const startOfMonth = moment().startOf("month");
        const endOfMonth = moment().endOf("month");
    
        return membersData.filter((member) => {
            const claimDate = moment(member.disbursement_date); // Assuming 'disbursement_date' is used to filter
            
            // Ensure the member's disbursement is unclaimed, not inactive, and within the current month
            return (
                member.status === "Unclaimed" && 
                member.memberStatus === "Inactive" && 
                claimDate.isBetween(startOfMonth, endOfMonth, null, "[]") // inclusive of start and end
            );
        }).length; // Return the number of active payouts in this month
    };
    

    // Calculate upcoming payouts for the current week
    const getUpcomingPayoutsThisWeek = () => {
        const startOfWeek = moment().startOf("week")
        const endOfWeek = moment().endOf("week")

        return membersData.filter((member) => {
            const claimDate = moment(member.disbursement_date) // Assuming 'disbursement_date' is used to filter
            return (
                member.status === "Unclaimed" && // Adjust status to 'Claimed' (or 'Unclaimed' if you prefer)
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
            setSuccessModalMessage("Member financial record has been successfully updated.")
            await logAction("Update Financial Record")
        }

        setIsSuccessModalOpen(true) // Open the success modal
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    // Filter members based on the search query
    const filteredMembers = membersData.filter((member) => {
        const lowercasedQuery = searchQuery.toLowerCase()
        if (member.memberStatus !== "Active") {
            return false
        }
        return (
            (member.full_name && member.full_name.toLowerCase().includes(lowercasedQuery)) ||
            (member.disbursement_date &&
                moment(member.disbursement_date).format("MMMM D, YYYY").toLowerCase().includes(lowercasedQuery)) ||
            (member.control_no && member.control_no.toLowerCase().includes(lowercasedQuery)) ||
            (member.status && member.status.toLowerCase().includes(lowercasedQuery)) ||
            (member.claimer && member.claimer.toLowerCase().includes(lowercasedQuery))
        )
    })

    // Calculate the total active beneficiaries by filtering out only unique 'member_id' values
    const totalBeneficiaries = new Set(filteredMembers.map((member) => member.member_id)).size
    const upcomingPayouts = getUpcomingPayoutsThisWeek() // Payouts within this week
    const monthlyTotalPayouts = getMonthlyTotalPayouts() // Get the total for the current month

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards
                        totalBeneficiaries={totalBeneficiaries}
                        monthlyTotalPayouts={monthlyTotalPayouts}
                        upcomingPayouts={upcomingPayouts}
                    />
                    <Table membersData={filteredMembers} onEdit={handleOpenModal} />
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
                    membersData={membersData}
                />
            )}
        </section>
    )
}

export default FinancialAssistance
