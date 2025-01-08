import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import axios from "axios" // Import axios for API calls
import "../../css/calendar.css" // Import the external CSS file
import moment from "moment" // Import Moment.js for date manipulation

const Calendar = () => {
    const [events, setEvents] = useState([])

    useEffect(() => {
        fetchEvents() // Call the function to fetch events
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/events") // Replace with your API endpoint
            const formattedEvents = response.data
                .filter((event) => event.status === "Active") // Filter to include only active events
                .map((event) => ({
                    ...event,
                    occurrences: getEventOccurrences(event),
                }))
                .flatMap((event) => event.occurrences) // Flatten the recurring events
            setEvents(formattedEvents)
        } catch (error) {
            console.error("Error fetching events:", error)
        }
    }

    const getEventOccurrences = (event) => {
        const occurrences = []
        const startDate = moment(event.date)
        const endDate = moment(event.endDate)

        switch (event.recurrence) {
            case "Weekly":
                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'week')) {
                    occurrences.push({
                        title: event.title,
                        date: date.format("YYYY-MM-DD"),
                        location: event.location,
                        organizer: event.organizer,
                        category: event.category,
                    })
                }
                break
            case "Monthly":
                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'month')) {
                    occurrences.push({
                        title: event.title,
                        date: date.format("YYYY-MM-DD"),
                        location: event.location,
                        organizer: event.organizer,
                        category: event.category,
                    })
                }
                break
            case "Yearly":
                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'year')) {
                    occurrences.push({
                        title: event.title,
                        date: date.format("YYYY-MM-DD"),
                        location: event.location,
                        organizer: event.organizer,
                        category: event.category,
                    })
                }
                break
            case "Daily":
                for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'day')) {
                    occurrences.push({
                        title: event.title,
                        date: date.format("YYYY-MM-DD"),
                        location: event.location,
                        organizer: event.organizer,
                        category: event.category,
                    })
                }
                break
            default:
                // For one-time events, only add the start date
                occurrences.push({
                    title: event.title,
                    date: startDate.format("YYYY-MM-DD"),
                    location: event.location,
                    organizer: event.organizer,
                    category: event.category,
                })
                break
        }

        return occurrences
    }

    return (
        <div className="calendar-container">
            <div className="calendar-wrapper">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events} // Pass events to FullCalendar
                    headerToolbar={{
                        left: null, // Navigation buttons
                        center: "title", // Center title
                        right: "prev,next",
                    }}
                    height="100%"
                    dayCellDidMount={(info) => {
                        // Create a container for the event titles
                        const eventContainer = document.createElement("div")
                        eventContainer.className = "fc-daygrid-day-events"

                        // Add events to the container
                        events.forEach((event) => {
                            if (event.date === info.dateStr) {
                                const eventTitle = document.createElement("div")
                                eventTitle.textContent = event.title
                                eventTitle.className = "event-title" // Add a class for styling
                                eventContainer.appendChild(eventTitle)
                            }
                        })

                        // Append the event container to the cell
                        info.el.appendChild(eventContainer)
                    }}
                />
            </div>
        </div>
    )
}

export default Calendar
