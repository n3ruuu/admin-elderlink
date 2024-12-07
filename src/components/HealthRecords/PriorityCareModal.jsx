/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import { useState } from "react"
import ElderlinkLogo from "../../assets/elderlink-logo.png"

// Inside the PriorityCareModal component
const PriorityCareModal = ({ isOpen, onClose, members }) => {
    if (!isOpen || !members || members.length === 0) return null

    const [currentPage, setCurrentPage] = useState(1)
    const membersPerPage = 10
    const loggedInUsername = localStorage.getItem("username") || ""

    // Calculate the index of the first and last member for the current page
    const indexOfLastMember = currentPage * membersPerPage
    const indexOfFirstMember = indexOfLastMember - membersPerPage

    // Slice the members array to get the members for the current page
    const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember)

    // Handle downloading CSV
    const handleDownload = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            "Full Name,Medical Condition,Medications\n" +
            members
                .map((member) => {
                    // Ensure that medicalConditions and medications are treated as single columns
                    const medicalConditions = Array.isArray(member.medicalConditions)
                        ? `"${member.medicalConditions.join(", ")}"` // Wrap in quotes to prevent column split
                        : `"${member.medicalConditions}"` // Ensure single value is also wrapped in quotes

                    const medications = Array.isArray(member.medications)
                        ? `"${member.medications.join(", ")}"` // Wrap in quotes to prevent column split
                        : `"${member.medications}"` // Ensure single value is also wrapped in quotes

                    // Combine the full name and fields, ensuring all values are wrapped in quotes as needed
                    return `${member.firstName} ${member.lastName},${medicalConditions},${medications}`
                })
                .join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "priority_care_members.csv")
        document.body.appendChild(link)
        link.click()
    }

    const handlePrint = () => {
        const printWindow = window.open("", "_blank", "width=800,height=600")
        printWindow.document.write(`
         <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                position: relative; /* Make the header position relative */
            }
            .header h1 {
                font-size: 1.8rem;
                margin: 0;
                color: #2c3e50;
            }
            .header img {
                position: absolute; /* Position the image absolutely */
                top: -18;
                right: 0;
                width: 100px; /* Adjust the size of the image */
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 30px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #f4f4f4;
                font-weight: bold;
                text-transform: uppercase;
            }
            .footer {
                margin-top: 40px;
                font-size: 0.9rem;
                text-align: left;
                color: #555;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src=${ElderlinkLogo} alt="Elderlink Logo" />
            <h1>Priority Care</h1>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Medical Conditions</th>
                    <th>Medications</th>
                    <th>Guardian</th>
                    <th>Relationship</th>
                    <th>Contact</th>
                </tr>
            </thead>
            <tbody>
                ${members
                    .map(
                        (member) => `
                            <tr>
                                <td>${member.firstName} ${member.lastName}</td>
                                <td>${member.medicalConditions.split(",").join(", ").trim()}</td>
                                <td>${member.medications.split(",").join(", ").trim()}</td>
                                <td>${member.guardianFirstName} ${member.guardianLastName}</td>
                                <td>${member.guardianRelationship}</td>
                                <td>${member.guardianContact}</td>
                            </tr>
                        `,
                    )
                    .join("")}
            </tbody>
        </table>
        <div class="footer">
            <p>Report Generated On: ${new Date().toLocaleString()}</p>
            <p>Report By: ${loggedInUsername}</p>
        </div>
    </body>
</html>

        `)
        printWindow.document.close()
        printWindow.print()
    }

    // Pagination controls
    const totalPages = Math.ceil(members.length / membersPerPage)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h3 className="text-xl font-bold mb-4">Priority Care Members</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 px-4 text-left">Full Name</th>
                                <th className="py-2 px-4 text-left">Medical Condition</th>
                                <th className="py-2 px-4 text-left">Medications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMembers.map((member, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-2 px-4">
                                        {member.firstName} {member.lastName}
                                    </td>
                                    <td className="py-2 px-4">
                                        {member.medicalConditions.split(",").join(", ").trim()}
                                    </td>
                                    <td className="py-2 px-4">{member.medications.split(",").join(", ").trim()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center space-x-4">
                        <button
                            className="bg-[#219EBC] hover:bg-[#1B7B9A] text-white py-2 px-4 rounded"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="flex items-center justify-center text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="bg-[#219EBC] hover:bg-[#1B7B9A] text-white py-2 px-4 rounded"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}

                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        className="bg-[#219EBC] hover:bg-[#1B7B9A] text-white py-2 px-4 rounded"
                        onClick={handleDownload}
                    >
                        Download as CSV
                    </button>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        onClick={handlePrint}
                    >
                        Print List
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PriorityCareModal
