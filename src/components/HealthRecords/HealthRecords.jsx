import { useState, useEffect } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import SuccessModal from "./SuccessModal"
import PriorityCareModal from "./PriorityCareModal" // Import the new PriorityCareModal

const HealthRecords = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentRecord, setCurrentRecord] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [recentUpdates, setRecentUpdates] = useState([])
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successModalMessage, setSuccessModalMessage] = useState("")
    const [successModalTitle, setSuccessModalTitle] = useState("")
    const [isPriorityCareModalOpen, setIsPriorityCareModalOpen] = useState(false) // State for Priority Care Modal
    const [priorityCareMembers, setPriorityCareMembers] = useState([]) // State to store all priority care members
    const [searchQuery, setSearchQuery] = useState("")

    const chronicConditions = [
        "Cancer",
        "Heart Disease",
        "Stroke",
        "Chronic Respiratory Diseases",
        "Kidney Failure",
        "Severe Infections",
        "HIV/AIDS",
        "Diabetes",
        "Liver Cirrhosis",
        "Tuberculosis",
        "Hepatitis",
        "Severe Trauma",
        "Severe Asthma",
        "Parkinson's Disease",
        "Alzheimer's Disease",
        "Hypertension",
        "Multiple Organ Failure",
        "Severe Malaria",
        "Meningitis",
        "COPD",
        "Blood Disorders",
        "Heart Attack",
        "Organ Rejection",
        "Autoimmune Disorders",
        "Diabetes Complications",
        "Severe Mental Health Disorders",
    ]

    // Filter members who meet the chronic condition criteria
    const getPriorityCareMembers = (members) => {
        return members.filter((member) =>
            member.medicalConditions?.split(",").some((condition) => chronicConditions.includes(condition.trim())),
        )
    }

    const fetchMembersData = async () => {
        try {
            const response = await fetch("http://localhost:5000/members")
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            setMembersData(data)
            setPriorityCareMembers(getPriorityCareMembers(data)) // Set priority care members
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
        await fetchMembersData()
        setIsModalOpen(false)
        setCurrentRecord(null)

        if (currentRecord) {
            setSuccessModalTitle("Update Completed!")
            setSuccessModalMessage("Member information has been successfully updated.")
        } else {
            setSuccessModalTitle("Update Completed!")
            setSuccessModalMessage("Member information has been successfully updated.")
        }

        setIsSuccessModalOpen(true)
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

    // Open Priority Care Modal
    const handlePriorityCareClick = () => {
        setIsPriorityCareModalOpen(true)
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
            (member.medicalConditions && member.medicalConditions.toLowerCase().includes(lowercasedQuery)) ||
            (member.medications && member.medications.toLowerCase().includes(lowercasedQuery)) ||
            (member.guardianEmail && member.guardianEmail.toLowerCase().includes(lowercasedQuery)) ||
            (member.guardianContact && member.guardianContact.toLowerCase().includes(lowercasedQuery)) ||
            (member.guardianRelationship && member.guardianRelationship.toLowerCase().includes(lowercasedQuery)) ||
            (member.guardianFirstName && member.guardianFirstName.toLowerCase().includes(lowercasedQuery)) ||
            (member.guardianLastName && member.guardianLastName.toLowerCase().includes(lowercasedQuery))
        )
    })

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards
                        totalRecords={filteredMembers.length}
                        recentUpdatesCount={recentUpdates.length}
                        priorityCareCount={priorityCareMembers.length} // Display count of priority care members
                        onPriorityCareClick={handlePriorityCareClick} // Show all priority care members
                    />
                    <Table
                        membersData={filteredMembers}
                        onEdit={handleOpenModal}
                        chronicConditions={chronicConditions}
                        fetchMembersData={fetchMembersData}
                    />
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

            {isModalOpen && (
                <Modal onClose={handleCloseModal} member={currentRecord} onSave={handleSave} memberInfo={{}} />
            )}

            {/* Priority Care Modal */}
            {isPriorityCareModalOpen && (
                <PriorityCareModal
                    isOpen={isPriorityCareModalOpen}
                    onClose={() => setIsPriorityCareModalOpen(false)}
                    members={priorityCareMembers} // Pass all priority care members to the modal
                />
            )}
        </section>
    )
}

export default HealthRecords
