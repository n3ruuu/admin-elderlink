/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"
import SocialPensionTable from "./SocialPensionTable"
import ViewModal from "./ViewModal" // Import your ViewModal component

const Tables = ({ membersData, onEdit }) => {
    const [selectedMember, setSelectedMember] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedQuarter, setSelectedQuarter] = useState("") // Initially empty

    // Function to determine the current quarter using moment.js
    const getCurrentQuarter = () => {
        const currentMonth = moment().month() + 1 // Get the current month (1-12)
        if (currentMonth >= 1 && currentMonth <= 3) return "Q1"
        if (currentMonth >= 4 && currentMonth <= 6) return "Q2"
        if (currentMonth >= 7 && currentMonth <= 9) return "Q3"
        return "Q4" // for months 10-12
    }

    useEffect(() => {
        setSelectedQuarter(getCurrentQuarter())
    }, [])

    const socialPensionMembers = membersData.filter((member) => member.quarter === selectedQuarter)

    // Function to handle viewing a member's details
    const handleViewClick = (member) => {
        setSelectedMember(member)
        setIsModalOpen(true)
    }

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div>
            <div className="mb-4">
                <label htmlFor="quarter-select" className="mr-2 text-[#219EBC]">
                    Select Quarter:
                </label>
                <select
                    id="quarter-select"
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                </select>
            </div>

            <SocialPensionTable
                socialPensionMembers={socialPensionMembers}
                onEdit={onEdit}
                handleViewClick={handleViewClick} // Pass handleViewClick here\
            />

            {/* ViewModal to display member details */}
            {isModalOpen && selectedMember && (
                <ViewModal member={selectedMember} membersData={membersData} onClose={handleCloseModal} />
            )}
        </div>
    )
}

export default Tables
