import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import axios from "axios" // Import axios for API calls
import "../../css/calendar.css" // Import the external CSS file

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
                    title: event.title,
                    date: formatDate(event.date),
                    location: event.location,
                    organizer: event.organizer,
                    category: event.category,
                }))
            setEvents(formattedEvents)
        } catch (error) {
            console.error("Error fetching events:", error)
        }
    }

    const formatDate = (dateStr) => {
        // Convert MM-DD-YYYY to YYYY-MM-DD
        const [month, day, year] = dateStr.split("-")
        return `${month}-${day}-${year}`
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
