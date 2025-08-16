import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import axios from "axios"
import "../../css/calendar.css"
import moment from "moment"

const categoryColorsHex = {
  'Health & Wellness': '#2E8B57',     
  'Social Gathering': '#FF6F61',       
  'Workshops & Classes': '#FFA500',    
  'Fitness': '#1E90FF',                
  'Nutritional Support': '#B8860B',    
  'Community Outreach': '#6A5ACD',     
  'Assistance Programs': '#8B0000',    
}

const Calendar = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events")
      const today = moment().startOf('day')

      const formattedEvents = response.data
        .filter(event => event.status === "Active")
        .map(event => ({
          ...event,
          occurrences: getEventOccurrences(event),
        }))
        .flatMap(event => event.occurrences)
        .filter(event => moment(event.date).isSameOrAfter(today)) // Optional: exclude past events
        .map(event => ({
          ...event,
          backgroundColor: categoryColorsHex[event.category] || '#219EBC',
          borderColor: categoryColorsHex[event.category] || '#219EBC',
          textColor: '#fff',
        }))

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
        for (let date = startDate.clone(); date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'week')) {
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
        for (let date = startDate.clone(); date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'month')) {
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
        for (let date = startDate.clone(); date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'year')) {
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
        for (let date = startDate.clone(); date.isBefore(endDate) || date.isSame(endDate, 'day'); date.add(1, 'day')) {
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

  // Custom rendering to apply text color
  const renderEventContent = (eventInfo) => {
    return (
      <div style={{ color: eventInfo.event.extendedProps.textColor || '#fff', padding: '2px 4px' }}>
        <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
      </div>
    )
  }

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: null,
            center: "title",
            right: "prev,next",
          }}
          height="100%"
          eventContent={renderEventContent} // Use custom event rendering
        />
      </div>
    </div>
  )
}

export default Calendar
