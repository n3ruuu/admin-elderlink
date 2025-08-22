/* eslint-disable react/prop-types */
import moment from "moment"
import { useState } from "react"
import Papa from "papaparse"
import SuccessModal from "./SuccessModal"
import axios from "axios"

const Form = ({ formValues, onChange, onClose, handleSubmit, isFormValid, isEditMode }) => {
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [successModalMessage, setSuccessModalMessage] = useState("")
    const [successModalTitle, setSuccessModalTitle] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
        }
    }

    const handleImportCSV = () => {
        if (!selectedFile) {
            console.error("No file selected")
            return
        }

        if (!(selectedFile instanceof Blob)) {
            console.error("Selected file is not a valid Blob object")
            return
        }

        // Create a FileReader instance
        const reader = new FileReader()

        // Set the onload function to handle the CSV file once it's read
        reader.onload = () => {
            const fileContent = reader.result

            // Parse the CSV data using PapaParse
            Papa.parse(fileContent, {
                complete: (result) => {
                    const rows = result.data

                    // Process the rows to ensure proper data formatting
                    const formattedData = rows
                        .map((row, index) => {
                            // Check if row data is valid or skip invalid rows
                            if (index === 0 || !row.firstName || !row.lastName) return null // Skip invalid rows
                            return {
                                firstName: row.firstName || "",
                                lastName: row.lastName || "",
                                middleName: row.middleName || "", // Default empty if not available
                                extension: row.extension || "",
                                dob: moment(row.dob).format("YYYY-MM-DD"),
                                sex: row.sex || "",
                                civilStatus: row.civilStatus || "",
                                address: row.address || "",
                                contactNumber: row.contactNumber || "",
                                controlNo: row.controlNo || "",
                                purchaseBookletNo: row.purchaseBookletNo || "",
                                medicineBookletNo: row.medicineBookletNo || "",
                                dateIssued: moment(row.dateIssued).format("YYYY-MM-DD") || "",
                                medicalConditions: row.medicalConditions || "",
                                medications: row.medications || "",
                                guardianFirstName: row.guardianFirstName || "",
                                guardianMiddleName: row.guardianMiddleName || "",
                                guardianLastName: row.guardianLastName || "",
                                guardianEmail: row.guardianEmail || "",
                                guardianContact: row.guardianContact || "",
                                guardianRelationship: row.guardianRelationship || "",
                            }
                        })
                        .filter((row) => row !== null) // Remove null values from the array

                    console.log(formattedData)
                    // Optionally send the formatted data to your backend
                    sendDataToBackend(formattedData)

                    // After importing, make the POST request for allQuarterData
                    // sendQuarterDataToBackend(formattedData)

                    setSuccessModalTitle("Imported Members!")
                    setSuccessModalMessage("Members have been successfully imported.")
                    setIsSuccessModalOpen(true) // Open the success modal
                },
                header: true, // Assumes the first row is the header
                skipEmptyLines: true, // Skip empty lines if any
            })
        }

        // Read the file as text (for CSV)
        reader.readAsText(selectedFile)
    }

    // Function to handle importing data
    const sendDataToBackend = async (data, Q1, Q2, Q3, Q4) => {
        try {
            const response = await axios.post("http://5.181.217.153:5000/members/import-csv", data)
            console.log("Data imported successfully:", response.data)

            // After successful import, each member should now have a member_id returned by the backend
            const importedMembers = response.data.members // assuming the response contains an array of imported members

            // if (importedMembers && importedMembers.length > 0) {
            //     // Now pass the imported members' data to the next function along with the quarter data
            //     sendQuarterDataToBackend(importedMembers, Q1, Q2, Q3, Q4)
            // }

            // Optionally reset the selected file or do other UI updates
            setSelectedFile(null)
        } catch (error) {
            console.error("Error importing data:", error)
        }
    }

    // Function to handle the social pension data and send it to the backend
    // const sendQuarterDataToBackend = async (importedMembers, Q1, Q2, Q3, Q4) => {
    //     try {
    //         // Ensure Q1, Q2, Q3, and Q4 are passed correctly into the function
    //         const allQuarterData = [Q1, Q2, Q3, Q4].map((quarterData, idx) => ({
    //             quarter: `Q${idx + 1}`,
    //             disbursement_date: quarterData?.disbursement_date || null,
    //             claimer: quarterData?.claimer || null,
    //             relationship: quarterData?.relationship || null,
    //             proof: null, // Default proof as null
    //         }))

    //         console.log("Currently imported members:", importedMembers) // This will log the currently imported members

    //         // Check if there are any imported members
    //         if (importedMembers && importedMembers.length > 0) {
    //             // Loop through the imported members to send the social pension data for each
    //             for (const member of importedMembers) {
    //                 let memberId = member.id // Get the member_id from the imported member
    //                 let fullName = `${member.firstName} ${member.lastName}`
    //                 let controlNo = member.controlNo || null

    //                 // Prepare the social pension data
    //                 const socialPensionData = {
    //                     member_id: memberId, // Use the member_id from the import
    //                     control_no: controlNo,
    //                     full_name: fullName,
    //                     quarterData: allQuarterData,
    //                 }

    //                 // Send data to the backend
    //                 await axios.post("http://localhost:5000/financial-assistance/social-pension", socialPensionData)
    //             }
    //         } else {
    //             console.log("No imported members to process.")
    //         }
    //     } catch (error) {
    //         console.error("Error saving data:", error)
    //     }
    // }

    return (
        <>
            {/* Name Fields */}
            <div className="grid grid-cols-10 gap-4 mb-4">
                {/* First Name */}
                <div className="col-span-3">
                    <label htmlFor="firstName" className="block text-lg font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Juan"
                        required
                    />
                </div>

                {/* Middle Name */}
                <div className="col-span-3">
                    <label htmlFor="middleName" className="block text-lg font-medium text-gray-700 mb-1">
                        Middle Name
                    </label>
                    <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        value={formValues.middleName}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Santos"
                    />
                </div>

                {/* Last Name */}
                <div className="col-span-3">
                    <label htmlFor="lastName" className="block text-lg font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Dela Cruz"
                        required
                    />
                </div>

                {/* Name Extension */}
                <div className="col-span-1">
                    <label htmlFor="extension" className="block text-lg font-medium text-gray-700 mb-1">
                        Ex.
                    </label>
                    <input
                        type="text"
                        id="extension"
                        name="extension"
                        value={formValues.extension || ""}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Jr."
                    />
                </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <label htmlFor="dob" className="block text-lg font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={moment(formValues.dob).format("YYYY-MM-DD") || ""}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="sex" className="block text-lg font-medium text-gray-700 mb-1">
                        Sex <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="sex"
                        name="sex"
                        value={formValues.sex}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="civilStatus" className="block text-lg font-medium text-gray-700 mb-1">
                        Civil Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="civilStatus"
                        name="civilStatus"
                        value={formValues.civilStatus}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="address" className="block text-lg font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formValues.address}
                    onChange={onChange}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="House No, Street or Subdivision "
                    required
                />
            </div>

            <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                    <label htmlFor="contactNumber" className="block text-lg font-medium text-gray-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={formValues.contactNumber}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="09123456789"
                        required
                    />
                </div>

                <div className="flex-1">
                    <label htmlFor="controlNo" className="block text-lg font-medium text-gray-700 mb-1">
                        ID Control <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="controlNo"
                        name="controlNo"
                        value={formValues.controlNo}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="MOJ0001"
                        required
                    />
                </div>
            </div>
            {/* Additional Fields: Purchase Booklet, Medicine Booklet, Date Issued */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                    <label htmlFor="purchaseBookletNo" className="block text-lg font-medium text-gray-700 mb-1">
                        Purchase Booklet ID No.
                    </label>
                    <input
                        type="text"
                        id="purchaseBookletNo"
                        name="purchaseBookletNo"
                        value={formValues.purchaseBookletNo || ""}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="PB0001"
                    />
                </div>
                <div>
                    <label htmlFor="medicineBookletNo" className="block text-lg font-medium text-gray-700 mb-1">
                        Medicine Booklet ID No.
                    </label>
                    <input
                        type="text"
                        id="medicineBookletNo"
                        name="medicineBookletNo"
                        value={formValues.medicineBookletNo || ""}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="MB0001"
                    />
                </div>
                <div>
                    <label htmlFor="dateIssued" className="block text-lg font-medium text-gray-700 mb-1">
                        Date Issued
                    </label>
                    <input
                        type="date"
                        id="dateIssued"
                        name="dateIssued"
                        value={moment(formValues.dateIssued).format("YYYY-MM-DD") || ""}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <div>
                    {!isEditMode && (
                        <>
                            <input
                                type="file"
                                id="csvFile"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                className="px-6 h-[45px] py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold"
                                onClick={() => document.getElementById("csvFile").click()}
                            >
                                Import .CSV File
                            </button>

                            {/* Display selected file name with small "X" button to remove */}
                            {selectedFile && (
                                <div className="mt-2 text-gray-500 flex items-center">
                                    <p className="mr-2">{`Selected file: ${selectedFile?.name || "No file selected"}`}</p>

                                    <button
                                        type="button"
                                        className="text-red-500 text-xl font-bold"
                                        onClick={() => {
                                            setSelectedFile(null) // Clear the selected file
                                            document.getElementById("csvFile").value = "" // Reset the file input
                                        }}
                                    >
                                        &times; {/* "X" character */}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border w-[100px] h-[45px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!isFormValid && !selectedFile}
                        onClick={() => {
                            if (selectedFile) {
                                handleImportCSV() // Function to handle the CSV import
                            } else {
                                handleSubmit() // Function for Save or Next, based on isEditMode
                            }
                        }}
                        className={`w-[100px] h-[45px] font-bold py-2 px-4 rounded transition-colors duration-300 ${
                            selectedFile || isFormValid
                                ? "bg-[#219EBC] hover:bg-[#1A7A8A] text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {selectedFile ? "Import" : isEditMode ? "Save" : "Next"}
                    </button>
                </div>
            </div>
            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false)
                    onClose()
                }}
                title={successModalTitle}
                message={successModalMessage}
                onGoToArchives={() => console.log("Navigating to Archives")}
                isArchiving={false}
            />
        </>
    )
}

export default Form
