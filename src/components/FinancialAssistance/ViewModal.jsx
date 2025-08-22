/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import moment from "moment"
import axios from "axios" // Assuming you're using axios for API requests

const ViewModal = ({ member, onClose }) => {
    const [membersData, setMembersData] = useState([]) // Fetch members data
    const [fileUpload, setFileUpload] = useState({}) // Store files for each row
    const memberRecords = membersData.filter((data) => data.member_id === member.member_id)

    useEffect(() => {
        fetchMembersData()
    }, [])

    const fetchMembersData = async () => {
        try {
            const response = await fetch("http://5.181.217.153:5000/financial-assistance")
            if (!response.ok) throw new Error("Network response was not ok")
            const data = await response.json()
            setMembersData(data)
        } catch (error) {
            console.error("Error fetching members data:", error)
        }
    }

    // Handle file input change for each row
    const handleFileChange = async (e, recordIndex) => {
        const file = e.target.files[0]
        if (!file) {
            alert("Please select a file to upload.")
            return
        }

        setFileUpload((prevState) => ({
            ...prevState,
            [recordIndex]: file,
        }))

        // Upload the file immediately after selection
        await handleFileUpload(recordIndex, file)
    }

    // Handle file upload
    const handleFileUpload = async (recordIndex, file) => {
        const formData = new FormData()
        formData.append("proof", file)
        formData.append("member_id", member.member_id)
        formData.append("record_id", memberRecords[recordIndex].id) // Assuming there's an id for each record

        try {
            const response = await axios.post(
                "http://5.181.217.153:5000/financial-assistance/social-pension/upload-proof",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            )

            if (response.data.success) {
                alert("Proof uploaded successfully.")
                fetchMembersData() // Reload the data to reflect the changes
            } else {
                alert("Failed to upload proof.")
            }
        } catch (error) {
            console.error("Error uploading proof:", error)
            alert("An error occurred during the upload.")
        }
    }

    // Function to remove the uploaded proof
    const handleRemoveFile = async (recordIndex) => {
        const record = memberRecords[recordIndex]
        const filePath = record.proof

        try {
            const response = await axios.post(
                "http://5.181.217.153:5000/financial-assistance/social-pension/remove-proof",
                {
                    member_id: member.member_id,
                    record_id: record.id,
                    file_path: filePath,
                },
            )

            if (response.data.success) {
                alert("Proof removed successfully.")
                fetchMembersData() // Reload the data to reflect the changes
            } else {
                alert("Failed to remove proof.")
            }
        } catch (error) {
            console.error("Error removing proof:", error)
            alert("An error occurred during the removal.")
        }
    }

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-[1200px] overflow-y-auto max-h-[90%]">
                <h2 className="text-xl font-semibold mb-4">{member.full_name} | Social Pension Record</h2>
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Quarter</th>
                            <th className="px-4 py-2 text-left">Year</th>
                            <th className="px-4 py-2 text-left whitespace-nowrap">Disbursement Date</th>
                            <th className="px-4 py-2 text-left">Claimer</th>
                            <th className="px-4 py-2 text-left">Relationship</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left w-[200px]">Proof</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberRecords.map((record, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-2">{record.quarter}</td>
                                <td className="px-4 py-2">
                                    {record.disbursement_date ? moment(record.disbursement_date).format("YYYY") : ""}
                                </td>

                                <td className="px-4 py-2">
                                    {record.disbursement_date ? moment(record.disbursement_date).format("MMMM D") : ""}
                                </td>

                                <td className="px-4 py-2 whitespace-nowrap">{record.claimer}</td>
                                <td className="px-4 py-2">{record.relationship}</td>
                                <td
                                    className={`px-4 py-2 ${record.status === "Unclaimed" ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}`}
                                >
                                    {record.status}
                                </td>
                                <td className="px-4 py-2">
                                    {/* Upload File button for each row */}
                                    <div className="flex items-center">
                                        {record.proof ? (
                                            <>
                                                {/* Display the uploaded proof file name with a link to view it */}
                                                <a
                                                    href={`http://5.181.217.153:5000/${record.proof}`} // Assuming the proof file is served from this path
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#219EBC] font-semibold underline"
                                                >
                                                    View Proof
                                                </a>

                                                {/* Optionally, allow removal of the proof */}
                                                <button
                                                    onClick={() => handleRemoveFile(index)}
                                                    className="ml-5 text-red-500 font-semibold underline"
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {/* Show Upload button if no proof exists */}
                                                <button
                                                    onClick={() =>
                                                        document.getElementById(`file-upload-${index}`).click()
                                                    }
                                                    className="text-[#219EBC] font-semibold underline"
                                                >
                                                    {fileUpload[index]
                                                        ? fileUpload[index].name.length > 7
                                                            ? `${fileUpload[index].name.substring(0, 7)}...`
                                                            : fileUpload[index].name
                                                        : "Upload File"}
                                                </button>

                                                {/* Remove button if a file is selected but not uploaded */}
                                                {fileUpload[index] && (
                                                    <button
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="ml-5 text-red-500 font-semibold underline"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Hidden file input for uploading files */}
                                    <input
                                        id={`file-upload-${index}`}
                                        type="file"
                                        onChange={(e) => handleFileChange(e, index)}
                                        className="hidden"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={onClose}
                    className="mt-4 border w-[100px] h-[45px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300 mx-auto block"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default ViewModal
