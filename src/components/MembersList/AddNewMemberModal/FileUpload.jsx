/* eslint-disable react/prop-types */
import { useRef } from "react"
import Papa from "papaparse"
import moment from "moment"

const FileUpload = ({ fileName, setFileName, setImportedMembers }) => {
    const fileInputRef = useRef(null) // Create a reference for the file input

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFileName(file.name)

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log("Parsed CSV results:", results.data) // Debugging log

                    const members = results.data.map((member) => {
                        return {
                            name: member.name || "", // Access fullName directly
                            dob: moment(member.dob, "MM/DD/YYYY").format(
                                "YYYY-MM-DD",
                            ),
                            gender: member.gender || "male",
                            address: member.address || "",
                            phone: member.phone || "",
                            email: member.email || "",
                            age: moment().diff(
                                moment(member.dob, "MM/DD/YYYY"),
                                "years",
                            ),
                        }
                    })
                    setImportedMembers(members)
                },
                error: (error) => {
                    console.error("CSV parsing error:", error) // Log any parsing errors
                },
            })
        }
    }

    const handleClearFile = () => {
        setFileName("")
        setImportedMembers([]) // Clear imported members if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "" // Reset the file input value
        }
    }

    return (
        <div className="mb-4">
            <label
                htmlFor="fileUpload"
                className="block text-lg font-medium text-gray-700 mb-1"
            >
                Upload File
            </label>
            <input
                type="file"
                id="fileUpload"
                accept=".csv"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-md w-full p-2 mb-2"
                ref={fileInputRef} // Attach the ref to the input
            />
            {fileName && (
                <div className="flex items-center">
                    <span className="mr-2">{fileName}</span>
                    <button
                        onClick={handleClearFile}
                        className="text-gray-500 hover:text-gray-700"
                        title="Clear file"
                    >
                        &times; {/* This represents the "x" symbol */}
                    </button>
                </div>
            )}
        </div>
    )
}

export default FileUpload
