/* eslint-disable react/prop-types */

// eslint-disable-next-line no-unused-vars
const FormFields = ({ formData, onChange }) => {
    const isEndDateVisible = formData.recurrence && formData.recurrence !== "One-Time";


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
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="Social Gathering">Social Gathering</option>
                        <option value="Workshops & Classes">Workshops & Classes</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Nutritional Support">Nutritional Support</option>
                        <option value="Community Outreach">Community Outreach</option>
                        <option value="Assistance Programs">Assistance Programs</option>
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

            {/* Date, Time, and End Date */}
            <div className={`grid ${isEndDateVisible ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-4`}>
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
                {isEndDateVisible && (
                    <div>
                        <label htmlFor="endDate" className="block text-lg font-medium text-gray-700 mb-1">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={onChange}
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                )}
            </div>

            {/* Location and Organizer */}
<div className="mb-4 grid grid-cols-2 gap-4">
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
            required
        />
    </div>
</div>

        </>
    )
}

export default FormFields
