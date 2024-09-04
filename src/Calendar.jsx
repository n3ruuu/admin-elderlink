import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import EventsData from "./data/events.json"
import "./css/calendar.css" // Import the external CSS file

const Calendar = () => {
    const [events, setEvents] = useState([])

    useEffect(() => {
        // Use imported JSON data directly
        const formattedEvents = EventsData.map((event) => ({
            title: event.title,
            date: formatDate(event.date),
            location: event.location,
            organizer: event.organizer,
            category: event.category,
        }))
        setEvents(formattedEvents)
    }, [])

    const formatDate = (dateStr) => {
        // Convert MM-DD-YYYY to YYYY-MM-DD
        const [month, day, year] = dateStr.split("-")
        return `${year}-${month}-${day}`
    }

    return (
        <div className="calendar-container">
            <div className="calendar-wrapper">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events} // Pass events to FullCalendar
                    headerToolbar={false} // Remove the entire header toolbar
                    height="100%"
                    themeSystem="standard"
                    dayCellDidMount={(info) => {
                        // Create a container for the event titles
                        const eventContainer = document.createElement("div")
                        eventContainer.className = "fc-daygrid-day-events"

                        // Add events to the container
                        events.forEach((event) => {
                            if (event.date === info.dateStr) {
                                const eventTitle = document.createElement("div")
                                eventTitle.textContent = event.title
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
