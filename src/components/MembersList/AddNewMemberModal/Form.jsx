/* eslint-disable react/prop-types */
const Form = ({ formData, onChange, disabled }) => {
    // Added disabled prop
    return (
        <>
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="firstName"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={onChange}
                        disabled={disabled} // Set disabled state
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Juan"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="lastName"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={onChange}
                        disabled={disabled} // Set disabled state
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Dela Cruz"
                        required
                    />
                </div>
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="dob"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={onChange}
                        disabled={disabled} // Set disabled state
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="gender"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={onChange}
                        disabled={disabled} // Set disabled state
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>

            {/* Address */}
            <div className="mb-4">
                <label
                    htmlFor="address"
                    className="block text-lg font-medium text-gray-700 mb-1"
                >
                    Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    disabled={disabled} // Set disabled state
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="123 Main St."
                    required
                />
            </div>

            {/* Phone Number and Email */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        disabled={disabled} // Set disabled state
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="+63 912 345 6789"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-lg font-medium text-gray-700 mb-1"
                    >
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        disabled={disabled} // Set disabled state
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="example@email.com"
                        required
                    />
                </div>
            </div>
        </>
    )
}

export default Form