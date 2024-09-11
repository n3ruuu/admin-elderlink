/* eslint-disable react/prop-types */
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import SendIcon from "../../assets/icons/send-icon.svg"

const Table = ({ eventsData, filter, handleOpenModal, handleArchiveClick }) => {
    return (
        <div className="mt-8">
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                            Event Title
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Date
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Location
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Organizer
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Category
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {eventsData
                        .filter((event) =>
                            filter === "all"
                                ? true
                                : filter === "ongoing"
                                  ? event.status === "Ongoing"
                                  : event.status === "Archived",
                        )
                        .map((event) => (
                            <tr key={event.id}>
                                <td className="px-16 py-4 text-left whitespace-nowrap">
                                    {event.title}
                                </td>
                                <td className="text-left whitespace-nowrap">
                                    {event.date}
                                </td>
                                <td className="text-left whitespace-nowrap">
                                    {event.location}
                                </td>
                                <td className="text-left whitespace-nowrap">
                                    {event.organizer}
                                </td>
                                <td className="text-left whitespace-nowrap">
                                    {event.category}
                                </td>
                                <td className="px-8 text-left whitespace-nowrap">
                                    <button
                                        onClick={() => handleOpenModal(event)}
                                    >
                                        <img
                                            src={EditIcon}
                                            alt="Edit Icon"
                                            className="h-5"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleArchiveClick(event)
                                        }
                                        className="ml-2"
                                    >
                                        <img
                                            src={ArchiveIcon}
                                            alt="Archive Icon"
                                            className="h-5"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleArchiveClick(event)
                                        }
                                        className="ml-2"
                                    >
                                        <img
                                            src={SendIcon}
                                            alt="Send Icon"
                                            className="h-5"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table
