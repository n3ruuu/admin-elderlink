import { useState, useEffect } from "react"
import axios from "axios"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import SuccessModal from "./SuccessModal"
import moment from "moment"

const MembersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [membersData, setMembersData] = useState([])
    const [currentMember, setCurrentMember] = useState(null)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successModalMessage, setSuccessModalMessage] = useState("")
    const [successModalTitle, setSuccessModalTitle] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    // Fetch members data from backend on component mount
    const fetchMembersData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/members")
            setMembersData(response.data)
        } catch (error) {
            console.error("Error fetching members data:", error)
        }
    }

    useEffect(() => {
        fetchMembersData()
    }, [])

    const handleSave = async () => {
        await fetchMembersData() // Refresh the members data
        setIsModalOpen(false) // Close the modal
        setCurrentMember(null) // Reset the current member

        if (currentMember) {
            setSuccessModalTitle("Update Completed!")
            setSuccessModalMessage("Member information has been successfully updated.")
        } else {
            setSuccessModalTitle("Member Added!")
            setSuccessModalMessage("New member has been successfully added.")
        }

        setIsSuccessModalOpen(true) // Open the success modal
    }

    const handleOpenModal = (member) => {
        setCurrentMember(member)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentMember(null)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    // Filter members based on the search query
    const filteredMembers = membersData.filter((member) => {
        const lowercasedQuery = searchQuery.toLowerCase()

        // Only include members with status 'Active'
        if (member.status !== "Active") {
            return false
        }

        return (
            member.firstName.toLowerCase().includes(lowercasedQuery) ||
            member.lastName.toLowerCase().includes(lowercasedQuery) ||
            member.controlNo.toLowerCase().includes(lowercasedQuery) ||
            member.civilStatus.toLowerCase().includes(lowercasedQuery) ||
            (member.contactNumber && member.contactNumber.toLowerCase().includes(lowercasedQuery)) ||
            (member.dob && moment(member.dob).format("MM-DD-YYYY").toLowerCase().includes(lowercasedQuery)) ||
            member.address.toLowerCase().includes(lowercasedQuery) ||
            (member.purchaseBookletNo && member.purchaseBookletNo.toLowerCase().includes(lowercasedQuery)) || // Added purchaseBookletNo filter
            (member.medicineBookletNo && member.medicineBookletNo.toLowerCase().includes(lowercasedQuery)) || // Added medicineBookletNo filter
            (member.dateIssued &&
                moment(member.dateIssued).format("MM-DD-YYYY").toLowerCase().includes(lowercasedQuery)) // Added dateIssued filter
        )
    })

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} fetchMembersData={fetchMembersData} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards membersData={filteredMembers} />
                    <Table membersData={filteredMembers} onEdit={handleOpenModal} fetchMembersData={fetchMembersData} />
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={successModalTitle}
                message={successModalMessage}
                onGoToArchives={() => console.log("Navigating to Archives")}
                isArchiving={false}
            />

            {isModalOpen && <Modal onClose={handleCloseModal} member={currentMember} onSave={handleSave} />}
        </section>
    )
}

export default MembersList
