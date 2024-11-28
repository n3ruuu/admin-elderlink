/* eslint-disable react/prop-types */
import { useState } from "react"
import ErrorModal from "./ErrorModal" // Import the ErrorModal

const Modal = ({ onClose, onNext }) => {
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        extension: "",
        dob: "",
        sex: "",
        civilStatus: "",
        address: "",
        contactNumber: "",
        idControl: "",
        purchaseBookletId: "", // Added field
        medicineBookletId: "", // Added field
        dateIssued: "", // Added field
    })

    const [errors, setErrors] = useState([])
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false) // Track error modal state

    const optionalFields = ["middleName", "extension", "purchaseBookletId", "medicineBookletId", "dateIssued"]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }

    const validateForm = () => {
        const errorMessages = []

        // Age validation (age can't be below 60)
        const dob = new Date(formValues.dob)
        const today = new Date()
        const age = today.getFullYear() - dob.getFullYear()
        if (age < 60) {
            errorMessages.push("Age must be 60 or above.")
        }

        // Name validation (no digits or special characters except for date)
        const namePattern = /^[A-Za-z\s]+$/
        if (!namePattern.test(formValues.firstName)) {
            errorMessages.push("First Name cannot contain digits or special characters.")
        }
        if (!namePattern.test(formValues.lastName)) {
            errorMessages.push("Last Name cannot contain digits or special characters.")
        }

        // Contact number validation (must follow format: +63 912 345 6789)
        const contactPattern = /^\+63 \d{3} \d{3} \d{4}$/
        if (!contactPattern.test(formValues.contactNumber)) {
            errorMessages.push("Contact Number must follow the format: +63 912 345 6789.")
        }

        // ID control validation (must follow format: MOJ0001)
        const idControlPattern = /^MOJ\d{4}$/
        if (!idControlPattern.test(formValues.idControl)) {
            errorMessages.push("ID Control must follow the format: MOJ0001.")
        }

        // Purchase Booklet ID validation (must follow format: PB0001)
        const purchaseBookletPattern = /^PB\d{4}$/
        if (
            formValues.purchaseBookletId && // If the field is not empty
            !purchaseBookletPattern.test(formValues.purchaseBookletId)
        ) {
            errorMessages.push("Purchase Booklet ID must follow the format: PB0001.")
        }

        // Medicine Booklet ID validation (must follow format: MB0001)
        const medicineBookletPattern = /^MB\d{4}$/
        if (
            formValues.medicineBookletId && // If the field is not empty
            !medicineBookletPattern.test(formValues.medicineBookletId)
        ) {
            errorMessages.push("Medicine Booklet ID must follow the format: MB0001.")
        }

        return errorMessages
    }

    const handleSubmit = () => {
        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            setIsErrorModalOpen(true) // Open the error modal
        } else {
            onNext()
        }
    }

    const isFormValid = Object.entries(formValues).every(([key, value]) =>
        optionalFields.includes(key) ? true : value.trim() !== "",
    )

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false) // Close the error modal
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <div className="p-2 bg-white">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Member</h2>
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-[#219EBC] rounded-full w-1/3"></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Step 1 of 3</p>
                    </div>

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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                value={formValues.dob}
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
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
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="widowed">Widowed</option>
                                <option value="separated">Separated</option>
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
                            onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="+63 912 345 6789"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="idControl" className="block text-lg font-medium text-gray-700 mb-1">
                                ID Control <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="idControl"
                                name="idControl"
                                value={formValues.idControl}
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="MOJ0001"
                                required
                            />
                        </div>
                    </div>
                    {/* Additional Fields: Purchase Booklet, Medicine Booklet, Date Issued */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="purchaseBookletId" className="block text-lg font-medium text-gray-700 mb-1">
                                Purchase Booklet ID No.
                            </label>
                            <input
                                type="text"
                                id="purchaseBookletId"
                                name="purchaseBookletId"
                                value={formValues.purchaseBookletId || ""}
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="PB0001"
                            />
                        </div>
                        <div>
                            <label htmlFor="medicineBookletId" className="block text-lg font-medium text-gray-700 mb-1">
                                Medicine Booklet ID No.
                            </label>
                            <input
                                type="text"
                                id="medicineBookletId"
                                name="medicineBookletId"
                                value={formValues.medicineBookletId || ""}
                                onChange={handleInputChange}
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
                                value={formValues.dateIssued || ""}
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            className="px-6 h-[45px] py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold"
                        >
                            Import .CSV File
                        </button>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="border w-[100px] h-[45px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                // disabled={!isFormValid}
                                onClick={onNext}
                                className={`w-[100px] h-[45px] font-bold py-2 px-4 rounded transition-colors duration-300 ${
                                    isFormValid
                                        ? "bg-[#219EBC] hover:bg-[#1A7A8A] text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Error Modal */}
                    {isErrorModalOpen && <ErrorModal errors={errors} onClose={handleCloseErrorModal} />}
                </div>
            </div>
        </div>
    )
}

export default Modal
