import { useState } from "react"
import Modal from "./Modal" // Import your AddNewMemberModal
import SuccessModal from "./SuccessModal" // Import your SuccessModal
import Header from "./Header" // Import your Header component
import Cards from "./Cards" // Import your Cards component
import Table from "./Table" // Import your Table component

const MembersList = () => {
   
    const membersData = [
        {
            id: 1,
            controlNo: "MOJ0001",
            fullName: "Juan Dela Cruz",
            dob: "1960-05-14",
            sex: "Male",
            civilStatus: "Married",
            address: "123 Sitio Kalayaan",
            contactNumber: "+639123456789",
        },
    ];

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <Header handleOpenModal={() => handleOpenModal(null)} />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-16">
                    <Cards membersData={membersData} />
                    
                        <Table
                            membersData={membersData}
                        />
                </div>
            </div>
        </section>
    )
}

export default MembersList
