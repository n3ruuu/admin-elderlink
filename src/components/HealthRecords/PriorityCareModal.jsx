/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState } from "react"
import ElderlinkLogo from "../../assets/elderlink-logo.png"
import MojonLogo from "../../assets/mojon-logo.png"
import html2pdf from "html2pdf.js"

const PriorityCareModal = ({ isOpen, onClose, members }) => {
    if (!isOpen || !members || members.length === 0) return null

    const [currentPage, setCurrentPage] = useState(1)
    const membersPerPage = 10

    const indexOfLastMember = currentPage * membersPerPage
    const indexOfFirstMember = indexOfLastMember - membersPerPage
    const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember)
    const totalPages = Math.ceil(members.length / membersPerPage)

    const handlePageChange = (page) => setCurrentPage(page)
    const handleDownload = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            "Full Name,Medical Condition,Medications\n" +
            members
                .map((member) => {
                    const medicalConditions = member.medicalConditions
                        ? `"${member.medicalConditions
                              .toString()
                              .split(",")
                              .map((item) => item.trim())
                              .join(", ")}"`
                        : ""

                    const medications = member.medications
                        ? `"${member.medications
                              .toString()
                              .split(",")
                              .map((item) => item.trim())
                              .join(", ")}"`
                        : ""

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

    const handleDownloadPDF = () => {
        const element = document.createElement("div")

        const formatWithPipes = (value) =>
            value
                ? value
                      .toString()
                      .split(",")
                      .map((item) => item.trim())
                      .join(", ")
                : ""

        element.innerHTML = `
        <style>
        @page { 
            size: landscape; 
        }

        body { 
            font-family: 'Poppins', sans-serif; 
            margin: 20px; 
            color: #333; 
            background-color: #fff; 
        }

        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 20px; 
            border-bottom: 4px solid #219EBC; 
            padding-bottom: 15px; 
        }

        .header img { 
            height: 60px; 
        }

        .header h1 { 
            text-align: center; 
            color: #219EBC; 
            font-size: 24px; 
            margin: 0; 
            flex-grow: 1; 
        }

        .barangay-info { 
            font-size: 14px; 
            color: #555; 
            margin-top: 5px; 
            text-align: center; 
        }

        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            font-size: 14px; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
        }

        th, td { 
            border: 1px solid #ddd; 
            padding: 5px; 
            text-align: left; 
            vertical-align: top; 
        }

         th {
            text-align:center;
        }

        thead tr { 
            background-color: rgba(33, 158, 188, 0.8) !important; 
            color: white; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
        }

        th { 
            font-weight: 600; 
            letter-spacing: 0.5px; 
        }

        tr:nth-child(even) { 
            background-color: #f9f9f9; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
        }

        tr:hover { 
            background-color: #f1f1f1; 
        }

        .footer { 
            margin-top: 30px; 
            font-size: 12px; 
            color: #666; 
            text-align: right; 
            border-top: 1px solid #ccc; 
            padding-top: 10px; 
        }
        </style>


    <div class="header">
      <img src="${ElderlinkLogo}" alt="Elderlink Logo" />
      <h1>Priority Care Members Report</h1>
      <img src="${MojonLogo}" alt="Mojon Logo" />
    </div>

    <div class="barangay-info">
      <p><strong>Barangay Mojon</strong></p>
      <p>123 Main Street, Brgy. Mojon</p>
      <p>Contact No: (123) 456-7890</p>
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
            <td>${formatWithPipes(member.medicalConditions)}</td>
            <td>${formatWithPipes(member.medications)}</td>
            <td>${member.guardianFirstName || ""} ${member.guardianLastName || ""}</td>
            <td style="text-align:center;">${member.guardianRelationship || ""}</td>
            <td style="text-align:center;">${member.guardianContact || ""}</td>
          </tr>
        `,
            )
            .join("")}
      </tbody>
    </table>
  `

        const opt = {
            margin: [10, 10, 20, 10],
            filename: "priority_care_members.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, logging: false },
            jsPDF: { unit: "mm", format: "legal", orientation: "landscape" },
            pagebreak: { mode: ["css", "legacy"] },
        }

        html2pdf()
            .set(opt)
            .from(element)
            .toPdf()
            .get("pdf")
            .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages()
                const footerText = `Report Generated On: ${new Date().toLocaleString()} | Report By: ${localStorage.getItem("username") || ""}`

                pdf.setFont("Poppins", "normal") // fallback, visually similar to Poppins
                pdf.setFontSize(10)

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i)
                    const pageWidth = pdf.internal.pageSize.getWidth()
                    const pageHeight = pdf.internal.pageSize.getHeight()

                    // Footer left: Report info
                    pdf.text(footerText, 10, pageHeight - 10)

                    // Footer right: Page number
                    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10)
                }
            })
            .save()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl w-[80%] max-w-5xl shadow-lg flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#219EBC] text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                    <h3 className="text-lg font-bold">Priority Care Members</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        ✕
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-auto p-6">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 w-[25%] border">Full Name</th>
                                <th className="py-2 px-4 border">Medical Conditions</th>
                                <th className="py-2 px-4 border">Medications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMembers.map((member, index) => (
                                <tr key={index} className="border hover:bg-gray-50">
                                    <td className="py-2 px-4 whitespace-nowrap border">
                                        {member.firstName} {member.lastName}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        {member.medicalConditions
                                            ? member.medicalConditions
                                                  .toString()
                                                  .split(",")
                                                  .map((item) => item.trim())
                                                  .join(", ")
                                            : ""}
                                    </td>

                                    <td className="py-2 px-4 border">
                                        {member.medications
                                            ? member.medications
                                                  .toString()
                                                  .split(",")
                                                  .map((item) => item.trim())
                                                  .join(", ")
                                            : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 p-4">
                        <button
                            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 px-6 pb-6">
                    <button
                        className="bg-[#219EBC] hover:bg-[#1B7B9A] text-white py-2 px-4 rounded"
                        onClick={handleDownload}
                    >
                        Download CSV
                    </button>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        onClick={handleDownloadPDF}
                    >
                        Print
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PriorityCareModal
