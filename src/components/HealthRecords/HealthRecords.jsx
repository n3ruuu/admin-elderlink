import { useState, useEffect } from "react"
import Header from "./Header"
import Cards from "./Cards"
import Table from "./Table"
import Modal from "./Modal"
import ArchiveConfirmModal from "./ArchiveModal"
import SuccessModal from "./SuccessModal"
import moment from "moment"

const HealthRecords = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [currentRecord, setCurrentRecord] = useState(null)
    const [membersData, setMembersData] = useState([])
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [successTitle, setSuccessTitle] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [recordToArchive, setRecordToArchive] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isArchiving, setIsArchiving] = useState(false)
    const [recentUpdates, setRecentUpdates] = useState([])

    const chronicConditions = [
        // Cardiovascular Conditions
        "Hypertension",
        "Heart Disease",
        "Stroke",

        // Metabolic and Endocrine Disorders
        "Diabetes Mellitus",

        // Respiratory Conditions
        "Chronic Obstructive Pulmonary Disease",
        "Asthma",

        // Neurological and Cognitive Conditions
        "Alzheimer's Disease",
        "Dementia",
        "Parkinson's Disease",

        // Renal and Liver Conditions
        "Chronic Kidney Disease",
        "Hepatitis B",
        "Hepatitis C",

        // Cancers
        "Lung Cancer",
        "Breast Cancer",
        "Liver Cancer",
        "Colorectal Cancer",
        "Cervical Cancer",
        "Ovarian Cancer",
        "Prostate Cancer",

        // Infectious Diseases
        "HIV/AIDS",

        // Musculoskeletal and Rheumatic Conditions
        "Arthritis",

        // Chronic Pain and Disability
        "Chronic Back Pain",
        "Osteoporosis",
    ]

    const priorityCareCount = [
        ...new Set(
            membersData
                .filter(
                    (member) =>
                        member.status === "Active" &&
                        member.medical_conditions
                            ?.split(",")
                            .some((condition) => chronicConditions.includes(condition.trim())),
                )
                .map((member) => member.health_record_id),
        ),
    ].length

    const fetchMembersData = async () => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:5000/health-records")
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            setMembersData(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
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

    useEffect(() => {
        fetchMembersData()
        fetchRecentUpdates()
    }, [])

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

    const filteredRecords = membersData.filter((member) => {
        const searchTermLower = searchTerm.toLowerCase()
        return (
            member.status === "Active" &&
            (member.member_name.toLowerCase().includes(searchTermLower) ||
                (member.medical_conditions && member.medical_conditions.toLowerCase().includes(searchTermLower)) ||
                (member.medications && member.medications.toLowerCase().includes(searchTermLower)) ||
                (member.guardian && member.guardian.toLowerCase().includes(searchTermLower)) ||
                (member.relationship && member.relationship.toLowerCase().includes(searchTermLower)) ||
                (member.emergency_contact &&
                    member.emergency_contact.toString().toLowerCase().includes(searchTermLower)))
        )
    })

    const handleOpenModal = (member) => {
        setCurrentRecord(member)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCurrentRecord(null)
    }

    const handleSave = async (updatedMember) => {
        try {
            const now = new Date().toISOString()
            updatedMember.record_date = now

            if (currentRecord) {
                // Updating existing health record
                await fetch(`http://localhost:5000/health-records/${updatedMember.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedMember),
                })

                setSuccessTitle("Health Record Updated!")
                setSuccessMessage("Member health record has been successfully updated.")

                // Log the update action
                await logAction(`Update Health Record`)
            } else {
                // Adding a new health record
                await fetch("http://localhost:5000/health-records", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedMember),
                })

                setSuccessTitle("Health Record Added!")
                setSuccessMessage("The health record has been successfully added to the list.")

                // Log the add action
                await logAction(`New Health Record`)
            }

            fetchMembersData() // Refresh the members data
            handleCloseModal()

            // Set isArchiving to false when adding a new record
            setIsSuccessModalOpen(true)
            setIsArchiving(false) // Set to false here, since it's not archiving
        } catch (error) {
            console.error("Error saving health record:", error)
        }
    }

    const handleArchiveClick = (member) => {
        setRecordToArchive(member)
        setIsArchiving(true) // Set isArchiving to true when archiving
        setIsConfirmModalOpen(true)
    }

    const handleConfirmArchive = async (selectedReason) => {
        if (!recordToArchive) return

        try {
            const response = await fetch(
                `http://localhost:5000/health-records/archive/${recordToArchive.health_record_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: selectedReason }),
                },
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to archive the health record")
            }

            // Update success message and modal state
            setSuccessTitle("Health Record Archived!")
            setSuccessMessage("The health record has been successfully archived.")

            await logAction("Archive Health Record")
            fetchMembersData() // Refresh the member data after archiving
            setIsSuccessModalOpen(true)
        } catch (error) {
            console.error("Error archiving health record:", error)
        } finally {
            setIsConfirmModalOpen(false)
            setRecordToArchive(null)
        }
    }

    const getActiveMembers = () => {
        return filteredRecords
    }

    const totalRecords = getActiveMembers().length

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header onOpenModal={handleOpenModal} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards
                        totalRecords={totalRecords}
                        recentUpdatesCount={recentUpdates.length} // Pass recentUpdatesCount prop
                        priorityCareCount={priorityCareCount}
                    />
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <Table
                            membersData={getActiveMembers()}
                            onOpenModal={handleOpenModal}
                            onArchiveClick={handleArchiveClick}
                            chronicConditions={chronicConditions}
                        />
                    )}
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    member={currentRecord}
                    membersList={membersData}
                />
            )}
            {isConfirmModalOpen && (
                <ArchiveConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirmArchive}
                />
            )}
            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={successTitle}
                    message={successMessage}
                    isArchiving={isArchiving} // Pass isArchiving here
                />
            )}
        </section>
    )
}

export default HealthRecords
