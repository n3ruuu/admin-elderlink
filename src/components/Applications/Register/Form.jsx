/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import moment from "moment"

const Form = ({
    formValues,
    onChange,
    onClose,
    handleKeyPressConditions,
    handleKeyPressMedications,
    removeCondition,
    removeMedication,
}) => {
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Address Field */}
                <div>
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
                        placeholder="House No, Street or Subdivision"
                        disabled
                        required
                    />
                </div>

                {/* Contact Number Field */}
                <div>
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
                        disabled
                        required
                    />
                </div>
            </div>

            {/* Medical Conditions and Medications */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Medical Conditions */}
                <div>
                    <label htmlFor="medicalConditions" className="block text-lg font-medium text-gray-700 mb-1">
                        Medical Conditions
                    </label>
                    <input
                        type="text"
                        id="medicalConditions"
                        name="medicalConditions"
                        onKeyPress={handleKeyPressConditions}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formValues.medicalConditions.map((condition, index) => (
                            <div
                                key={index}
                                className="bg-[#219EBC] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#168B99]"
                                onClick={() => removeCondition(condition)}
                            >
                                {condition}{" "}
                                <span className="ml-2 font-bold transition-transform duration-300 transform hover:scale-125 hover:text-gray-300">
                                    &times;
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Medications */}
                <div>
                    <label htmlFor="medications" className="block text-lg font-medium text-gray-700 mb-1">
                        Medications
                    </label>
                    <input
                        type="text"
                        id="medications"
                        name="medications"
                        onKeyPress={handleKeyPressMedications}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formValues.medications.map((medication, index) => (
                            <div
                                key={index}
                                className="bg-[#219EBC] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#168B99]"
                                onClick={() => removeMedication(medication)}
                            >
                                {medication} <span className="ml-2 font-bold">&times;</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Guardian's Information */}
            <div className="mb-6">
                <label className="block text-xl font-semibold text-gray-700 mb-3">GUARDIAN'S INFORMATION</label>
                <div className="flex space-x-4">
                    {/* First Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardianFirstName" className="block text-lg font-medium text-gray-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="guardianFirstName"
                            name="guardianFirstName"
                            value={formValues.guardianFirstName || ""}
                            onChange={onChange}
                            disabled
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter first name"
                            required
                        />
                    </div>
                    {/* Last Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardianLastName" className="block text-lg font-medium text-gray-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="guardianLastName"
                            name="guardianLastName"
                            value={formValues.guardianLastName || ""}
                            onChange={onChange}
                            disabled
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter last name"
                            required
                        />
                    </div>
                    {/* Middle Name */}
                    <div className="w-1/3">
                        <label htmlFor="guardianMiddleName" className="block text-lg font-medium text-gray-700 mb-1">
                            Middle Name
                        </label>
                        <input
                            type="text"
                            id="guardianMiddleName"
                            name="guardianMiddleName"
                            disabled
                            value={formValues.guardianMiddleName || ""}
                            onChange={onChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter middle name"
                        />
                    </div>
                </div>

                {/* Contact No and Email Address */}
                <div className="flex space-x-4 mb-6 mt-6">
                    <div className="w-full">
                        <label htmlFor="guardianEmail" className="block text-lg font-medium text-gray-700 mb-1">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="guardianEmail"
                            name="guardianEmail"
                            value={formValues.guardianEmail || ""}
                            disabled
                            onChange={onChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter email address"
                            required
                        />
                    </div>
                </div>

                {/* Contact Number and guardianRelationship side by side */}
                <div className="flex space-x-4 mb-6">
                    <div className="w-1/2">
                        <label htmlFor="guardianContact" className="block text-lg font-medium text-gray-700 mb-1">
                            Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="guardianContact"
                            name="guardianContact"
                            value={formValues.guardianContact || ""}
                            disabled
                            onChange={onChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="09123456789"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="guardianRelationship" className="block text-lg font-medium text-gray-700 mb-1">
                            Relationship <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="relationship"
                            name="guardianRelationship"
                            disabled
                            value={formValues.guardianRelationship || ""}
                            onChange={onChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Relationship</option>
                            <option value="Parent">Parent</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Relative">Relative</option>
                            <option value="Guardian">Guardian</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <div className="flex flex-col items-start">
                        {/* Display file name with URL */}
                        {formValues.formFile && (
                            <p className="mt-2 text-gray-600 text-sm">
                                <a
                                    href={`http://localhost:5000/${formValues.formFile}`} // Assuming formFile contains the name of the uploaded file
                                    target="_blank" // Open in a new tab
                                    rel="noopener noreferrer" // Security measure when using target="_blank"
                                    className="cursor-pointer font-medium text-blue-500 hover:underline"
                                >
                                    {formValues.formFile.replace("uploads\\", "")}{" "}
                                    {/* Remove 'uploads/' from the path */}
                                </a>
                            </p>
                        )}
                    </div>

                    {/* Buttons on the right */}
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border w-[100px] text-lg h-[45px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Form
