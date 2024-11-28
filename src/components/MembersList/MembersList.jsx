import { useState, useEffect } from "react"
import axios from "axios"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import SuccessModal from "./SuccessModal" // Import SuccessModal

const MembersList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [membersData, setMembersData] = useState([])
    const [currentMember, setCurrentMember] = useState(null)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // State for SuccessModal
    const [successModalMessage, setSuccessModalMessage] = useState("") // Success message state
    const [successModalTitle, setSuccessModalTitle] = useState("") // Success title state

    // Fetch members data from backend on component mount
    const fetchMembersData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/members") // Adjust the URL based on your backend setup
            setMembersData(response.data)
        } catch (error) {
            console.error("Error fetching members data:", error)
        }
    }

    useEffect(() => {
        fetchMembersData()
    }, []) // Empty dependency array ensures it runs only once on mount

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

    const handleOpenModal = (member) => {
        setCurrentMember(member) // Pass the selected member's data to the modal
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentMember(null)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards membersData={membersData} />
                    <Table membersData={membersData} onEdit={handleOpenModal} />
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

export default MembersList
