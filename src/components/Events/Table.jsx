/* eslint-disable react/prop-types */
import { useState } from "react";
import EditIcon from "../../assets/icons/edit.svg";
import ArchiveIcon from "../../assets/icons/archive2.svg";
import SendIcon from "../../assets/icons/send-icon.svg";
import moment from "moment";
import EmailModal from "./EmailModal";

const Table = ({ eventsData, handleOpenModal, onArchiveClick }) => {
    const [isSMSModalOpen, setSMSModalOpen] = useState(false);

    // Filter events with status "Active"
    const activeEventsData = eventsData.filter((event) => event.status === "Active");

    // Sort the events by date (ascending)
    const sortedEvents = activeEventsData.sort((a, b) => (moment(a.date).isBefore(moment(b.date)) ? -1 : 1));

    // Function to generate event rows based on recurrence
    const getEventRows = (event) => {
        const rows = [];
        const startDate = moment(event.date);
        const endDate = moment(event.endDate);

        // Check the recurrence type and generate rows accordingly
        switch (event.recurrence) {
            case "Weekly":
                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'week')) {
                    rows.push({
                        ...event,
                        date: date.format("YYYY-MM-DD"),
                    });
                }
                break;
            case "Monthly":
                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'month')) {
                    rows.push({
                        ...event,
                        date: date.format("YYYY-MM-DD"),
                    });
                }
                break;
            case "Yearly":
                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'year')) {
                    rows.push({
                        ...event,
                        date: date.format("YYYY-MM-DD"),
                    });
                }
                break;
            case "Daily":
                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'days')) {
                    rows.push({
                        ...event,
                        date: date.format("YYYY-MM-DD"),
                    });
                }
                break;
            default:
                // For one-time events, only add the start date
                rows.push({
                    ...event,
                    date: startDate.format("YYYY-MM-DD"),
                });
                break;
        }

        return rows;
    };

    // Flatten the array of events considering recurrence
    const currentEvents = sortedEvents
        .map((event) => getEventRows(event))
        .flat();

    // Log the total number of event instances, including recurring events
    console.log("Total event instances (including recurrence):", currentEvents.length);

    return (
        <div className="mt-8">
            <table className="min-w-full bg-[#FFFFFF] justify-center rounded-xl shadow-xl">
                <thead className="text-[#767171CC] border-b">
                    <tr>
                        <th className="px-8 py-4 text-left font-medium">Title</th>
                        <th className="text-left font-medium">Date and Time</th>
                        <th className="text-left font-medium">Location</th>
                        <th className="text-left font-medium">Organizer</th>
                        <th className="text-left font-medium">Category</th>
                        <th className="text-left font-medium">Recurrence</th>
                        <th className="px-8 w-[150px] text-left font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEvents.map((event, index) => (
                        <tr
                            className={`text-[#333333] h-[100px] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={event.id}
                        >
                            <td className="px-8 align-top w-[300px] py-4 text-left">{event.title}</td>
                            <td className="text-left align-top w-[280px] py-4 whitespace-nowrap">
                                {moment(event.date).format("MMMM DD, YYYY")}
                            </td>
                            <td className="text-left align-top py-4">{event.location}</td>
                            <td className="text-left align-top py-4">{event.organizer}</td>
                            <td className="text-left align-top py-4">{event.category}</td>
                            <td className="text-left align-top py-4">{event.recurrence}</td>

                            <td className="px-8 pt-4 align-top py-4 text-left flex gap-3">
                                <button onClick={() => handleOpenModal(event)}>
                                    <img src={EditIcon} alt="Edit Icon" className="w-[20px]" />
                                </button>
                                <button onClick={() => onArchiveClick(event)}>
                                    <img src={ArchiveIcon} alt="Archive Icon" className="w-[20px]" />
                                </button>
                                <button onClick={() => setSMSModalOpen(true)}>
                                    <img src={SendIcon} alt="Send Icon" className="w-[20px]" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Compose SMS Modal */}
            <EmailModal isOpen={isSMSModalOpen} onClose={() => setSMSModalOpen(false)} />
        </div>
    );
};

export default Table;
