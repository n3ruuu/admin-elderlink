import { useEffect, useState } from "react"
import axios from "axios"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

import moment from "moment"

import DashboardHeader from "./DashboardHeader"
import DashboardCard from "./DashboardCard"
import ServiceRequests from "./ServiceRequests"
import History from "./History"

import TotalNumberIcon from "../../assets/icons/total-number.svg"
import UpcomingEventsIcon from "../../assets/icons/upcoming-events.svg"
import TransactionIcon from "../../assets/icons/transaction.svg"

const Dashboard = () => {
    // eslint-disable-next-line no-unused-vars
    const [totalSeniorCitizens, setTotalSeniorCitizens] = useState(0)
    const [activeSeniorCitizens, setActiveSeniorCitizens] = useState(0) // State for active senior citizens
    const [summaryData, setSummaryData] = useState({
        gender: { male: 0, female: 0 },
        ageGroup: {},
        streetDistribution: {},
    })
    const [upcomingEvents, setUpcomingEvents] = useState(0)
    const [upcomingEventDetails, setUpcomingEventDetails] = useState([])
    const [pendingApplications, setPendingApplications] = useState(0)
    const [isTotalHovered, setIsTotalHovered] = useState(false)
    const [isEventsHovered, setIsEventsHovered] = useState(false)
    const [isTransactionsHovered, setIsTransactionsHovered] = useState(false)
    const [pendingApplicationsDetails, setPendingApplicationsDetails] = useState([]) //

    const COLORS = ["#0088FE", "#FFBB28"]

    const categoryColorsHex = {
        "Health & Wellness": "#2E8B57",
        "Social Gathering": "#FF6F61",
        "Workshops & Classes": "#FFA500",
        Fitness: "#1E90FF",
        "Nutritional Support": "#B8860B",
        "Community Outreach": "#6A5ACD",
        "Assistance Programs": "#8B0000",
    }

    useEffect(() => {
        const fetchTotalSeniorCitizens = async () => {
            try {
                const response = await axios.get("http://5.181.217.153:5000/members")
                setTotalSeniorCitizens(response.data.length)

                // Filter active senior citizens
                const activeCitizens = response.data.filter((member) => member.status === "Active")
                setActiveSeniorCitizens(activeCitizens.length)

                const males = activeCitizens.filter((member) => member.sex === "Male").length
                const females = activeCitizens.filter((member) => member.sex === "Female").length

                const ageGroups = {
                    "60-65 years": activeCitizens.filter((member) => {
                        const age = getAgeFromDOB(member.dob)
                        return age >= 60 && age <= 65
                    }).length,
                    "66-75 years": activeCitizens.filter((member) => {
                        const age = getAgeFromDOB(member.dob)
                        return age >= 66 && age <= 75
                    }).length,
                    "76-85 years": activeCitizens.filter((member) => {
                        const age = getAgeFromDOB(member.dob)
                        return age >= 76 && age <= 85
                    }).length,
                    "85+ years": activeCitizens.filter((member) => {
                        const age = getAgeFromDOB(member.dob)
                        return age > 85
                    }).length,
                }

                // Helper function to calculate age from date of birth (dob) using Moment.js
                function getAgeFromDOB(dob) {
                    const birthDate = moment(dob) // Create a Moment object from the dob
                    const today = moment() // Get the current date as a Moment object
                    return today.diff(birthDate, "years") // Calculate the difference in years
                }

                const streets = activeCitizens.reduce((acc, member) => {
                    acc[member.address] = (acc[member.address] || 0) + 1
                    return acc
                }, {})

                setSummaryData({
                    gender: { male: males, female: females },
                    ageGroup: ageGroups,
                    streetDistribution: streets,
                })
            } catch (error) {
                console.error("Error fetching total senior citizens:", error)
            }
        }

        const fetchUpcomingEvents = async () => {
            try {
                const response = await axios.get("http://5.181.217.153:5000/events")
                console.log("Fetched events:", response.data) // Log the raw fetched events

                const upcomingEvents = []

                response.data.forEach((event) => {
                    // Skip events that are not active
                    if (event.status !== "Active") return

                    const startDate = moment(event.date)
                    const endDate = moment(event.endDate || startDate) // If no endDate, use startDate

                    // Handle One-Time events
                    if (event.recurrence === "One-Time") {
                        upcomingEvents.push({
                            ...event,
                            date: startDate.format("YYYY-MM-DD"),
                        })
                    } else {
                        // Handle recurring events (Daily, Weekly, Monthly, Yearly)
                        let recurrenceInterval = null
                        let dateFormat = "YYYY-MM-DD"

                        switch (event.recurrence) {
                            case "Daily":
                                recurrenceInterval = "days"
                                break
                            case "Weekly":
                                recurrenceInterval = "weeks"
                                break
                            case "Monthly":
                                recurrenceInterval = "months"
                                break
                            case "Yearly":
                                recurrenceInterval = "years"
                                break
                            default:
                                return // Skip unknown recurrence types
                        }

                        // Generate occurrences for recurring events
                        let date = startDate.clone()
                        while (date.isSameOrBefore(endDate, "day")) {
                            upcomingEvents.push({
                                ...event,
                                date: date.format(dateFormat),
                            })
                            date.add(1, recurrenceInterval)
                        }
                    }
                })

                // Sort events by date (earliest first)
                upcomingEvents.sort((a, b) => moment(a.date).diff(moment(b.date)))

                console.log("Upcoming events:", upcomingEvents) // Log the filtered upcoming events
                setUpcomingEventDetails(upcomingEvents) // Store the filtered upcoming events
                setUpcomingEvents(upcomingEvents.length) // Set the count of upcoming events
            } catch (error) {
                console.error("Error fetching upcoming events:", error)
            }
        }

        // Fetch pending applications from the backend
        const fetchPendingApplications = async () => {
            try {
                const response = await axios.get("http://5.181.217.153:5000/members/registrations")

                // Ensure response.data contains the expected structure
                const applications = response.data || []

                // Filter pending applications using applicationStatus
                const pendingApps = applications.filter((application) => application.applicationStatus === "Pending")

                // Set the state with the filtered pending applications and count
                setPendingApplications(pendingApps.length)
                setPendingApplicationsDetails(pendingApps)
            } catch (error) {
                console.error("Error fetching pending applications:", error)
            }
        }

        fetchTotalSeniorCitizens()
        fetchUpcomingEvents()
        fetchPendingApplications()
    }, [])

    // Prepare data for Pie Chart (Gender Distribution)
    const genderData = [
        { name: "Male", value: summaryData.gender.male },
        { name: "Female", value: summaryData.gender.female },
    ]

    // Prepare data for Age Group Bar Chart
    const ageData = Object.entries(summaryData.ageGroup).map(([age, count]) => ({
        ageGroup: age,
        Population: count,
    }))

    // Prepare data for Street Distribution Bar Chart
    const streetData = Object.entries(summaryData.streetDistribution).map(([street, count]) => ({
        street: street,
        Population: count,
    }))

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <DashboardHeader />
            <div className="flex w-full h-full">
                <div className="flex flex-col pl-16 pr-8">
                    <div className="flex gap-5 mb-5">
                        {/* Total Number of Senior Citizens Card */}
                        {(isTotalHovered || (!isEventsHovered && !isTransactionsHovered)) && (
                            <div
                                className="transition-transform duration-700 ease-in-out transform hover:-translate-y-1 flex-1 relative"
                                onMouseEnter={() => {
                                    setIsTotalHovered(true)
                                    setIsEventsHovered(false)
                                    setIsTransactionsHovered(false)
                                }}
                                onMouseLeave={() => setIsTotalHovered(false)}
                            >
                                <DashboardCard
                                    icon={TotalNumberIcon}
                                    count={activeSeniorCitizens}
                                    title="Total Number of Senior Citizens"
                                    bgColor="bg-[#FFF5E1]"
                                />
                                {isTotalHovered && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-white p-4 shadow-lg rounded-lg z-10 flex flex-col">
                                        <h3 className="font-bold text-2xl text-[#333]">Summary of Data</h3>
                                        <div className="flex-grow flex justify-around gap-4 text-gray-700 mt-2">
                                            <div>
                                                <p className="font-semibold">Gender Distribution</p>
                                                {/* Recharts Pie Chart for Gender Distribution */}

                                                <ResponsiveContainer width={200} height={200}>
                                                    <PieChart>
                                                        <Tooltip
                                                            formatter={(value, name) => [`${name}: ${value}`, name]}
                                                            labelFormatter={() => "Gender Distribution"} // Optional: You can customize the label
                                                        />
                                                        <Pie
                                                            data={genderData}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={60}
                                                        >
                                                            {genderData.map((entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={COLORS[index % COLORS.length]}
                                                                />
                                                            ))}
                                                        </Pie>
                                                        <Legend verticalAlign="bottom" height={36} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Age Group Distribution</p>
                                                {/* Recharts Bar Chart for Age Distribution */}
                                                <ResponsiveContainer width={300} height={190}>
                                                    <BarChart data={ageData}>
                                                        <XAxis dataKey="ageGroup" hide="true" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="Population" fill="#8884d8" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Street Distribution</p>
                                                {/* Recharts Bar Chart for Street Distribution */}
                                                <ResponsiveContainer width={300} height={190}>
                                                    <BarChart data={streetData}>
                                                        <XAxis dataKey="street" hide="true" />
                                                        <YAxis domain={[0, 10]} /> {/* Set range from 1 to 30 */}
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="Population" fill="#82ca9d" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Upcoming Events Card */}
                        {(isEventsHovered || (!isTotalHovered && !isTransactionsHovered)) && (
                            <div
                                className="transition-transform duration-700 ease-in-out transform hover:-translate-y-1 flex-1 relative"
                                onMouseEnter={() => {
                                    setIsTotalHovered(false)
                                    setIsEventsHovered(true)
                                    setIsTransactionsHovered(false)
                                }}
                                onMouseLeave={() => setIsEventsHovered(false)}
                            >
                                <DashboardCard
                                    icon={UpcomingEventsIcon}
                                    count={upcomingEvents}
                                    title="Upcoming Events"
                                    bgColor="bg-[#E1F5FE]"
                                />
                                {isEventsHovered && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-white p-4 shadow-lg rounded-lg z-10 flex flex-col">
                                        <h3 className="font-bold text-2xl text-[#333]">Upcoming Events Details</h3>
                                        <div className="flex w-full h-full overflow-x-auto space-x-4 py-2">
                                            {/* Display the active events horizontally */}
                                            {upcomingEventDetails.filter((event) => event.status === "Active").length >
                                            0 ? (
                                                <div className="flex flex-row space-x-4">
                                                    {upcomingEventDetails
                                                        .filter((event) => event.status === "Active")
                                                        .slice(0, upcomingEvents.length) // Limit to 3 active events
                                                        .map((event, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex-shrink-0 h-fit w-64 p-4 rounded-lg shadow-sm bg-[#219dbc79]"
                                                                style={{
                                                                    borderLeft: `8px solid ${categoryColorsHex[event.category] || "#219dbc"}`,
                                                                }}
                                                            >
                                                                <p className="font-semibold text-center pb-2">
                                                                    <strong>{event.title}</strong>
                                                                </p>
                                                                <p>
                                                                    {(() => {
                                                                        const d = new Date(event.date)
                                                                        const month = String(d.getMonth() + 1).padStart(
                                                                            2,
                                                                            "0",
                                                                        )
                                                                        const day = String(d.getDate()).padStart(2, "0")
                                                                        const year = d.getFullYear()
                                                                        return `${month}/${day}/${year}`
                                                                    })()}{" "}
                                                                    | <em>{event.location}</em>
                                                                </p>
                                                                <p>{event.description}</p>
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No active events at the moment.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pending Applications Card */}
                        {(isTransactionsHovered || (!isTotalHovered && !isEventsHovered)) && (
                            <div
                                className="transition-transform duration-700 ease-in-out transform hover:-translate-y-1 flex-1 relative"
                                onMouseEnter={() => {
                                    setIsTotalHovered(false)
                                    setIsEventsHovered(false)
                                    setIsTransactionsHovered(true)
                                }}
                                onMouseLeave={() => setIsTransactionsHovered(false)}
                            >
                                <DashboardCard
                                    icon={TransactionIcon}
                                    count={pendingApplications}
                                    title="Pending Applications"
                                    bgColor="bg-[#E1FFE1]"
                                />
                                {isTransactionsHovered && (
                                    <div className="absolute mb-4 top-0 left-0 w-full h-full bg-white p-6 shadow-lg rounded-lg z-10 flex flex-col space-y-4">
                                        <h3 className="font-bold text-2xl text-[#333]">Pending Applications Details</h3>
                                        <div className="flex flex-wrap gap-5 gap-x-8 overflow-x-hidden justify-center">
                                            {pendingApplicationsDetails.map((application, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-100 p-4 rounded-lg shadow-md w-[400px] mb-2"
                                                >
                                                    <div className="mb-4 border-b pb-3">
                                                        <p className="text-gray-700">
                                                            <strong>Applicant:</strong> {application.firstName}{" "}
                                                            {application.lastName}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <strong>Date Submitted:</strong>{" "}
                                                            {moment(application.date_submitted).format("MMMM D, YYYY")}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <strong>Form Type:</strong> OSCA Registration Form
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Service Requests Section */}
                    <ServiceRequests />
                </div>

                {/* History Section */}
                <History />
            </div>
        </section>
    )
}

export default Dashboard
