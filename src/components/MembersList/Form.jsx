/* eslint-disable react/prop-types */
import moment from "moment"

const Form = ({ formValues, onChange, onClose, handleSubmit, isFormValid, isEditMode }) => {
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
                        <button
                            type="button"
                            className="px-6 h-[45px] py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold"
                        >
                            Import .CSV File
                        </button>
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
                        // disabled={!isFormValid}
                        onClick={handleSubmit}
                        className={`w-[100px] h-[45px] font-bold py-2 px-4 rounded transition-colors duration-300 ${
                            isFormValid
                                ? "bg-[#219EBC] hover:bg-[#1A7A8A] text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {isEditMode ? "Save" : "Next"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Form
