/* eslint-disable react/prop-types */

// eslint-disable-next-line no-unused-vars
const FormFields = ({ formData, onChange }) => {
    return (
        <>
            {/* Event Title */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-1">
                    Event Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter event title"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-1">
                    Event Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    className="p-3 border border-gray-300 rounded-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter event description"
                    required
                />
            </div>

            {/* Category and Event Recurrence */}
            <div className="mb-4 flex space-x-4">
                <div className="w-full">
                    <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="" disabled>
                            Select Category
                        </option>
                        <option value="Social Gathering">Social Gathering</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Fitness">Fitness</option>
                    </select>
                </div>

                <div className="w-full">
                    <label htmlFor="recurrence" className="block text-lg font-medium text-gray-700 mb-1">
                        Event Recurrence <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="recurrence"
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="" disabled>
                            Select Recurrence
                        </option>
                        <option value="One-Time">One-time</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="date" className="block text-lg font-medium text-gray-700 mb-1">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="time" className="block text-lg font-medium text-gray-700 mb-1">
                        Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
            </div>

            {/* Location and Organizer */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter event location"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="organizer" className="block text-lg font-medium text-gray-700 mb-1">
                        Organizer <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="organizer"
                        name="organizer"
                        value={formData.organizer}
                        onChange={onChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter event organizer"
                        required
                    />
                </div>
            </div>
        </>
    )
}

export default FormFields
