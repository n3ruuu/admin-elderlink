import { useEffect, useState } from "react"
import axios from "axios"
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

import DashboardHeader from "./DashboardHeader"
import DashboardCard from "./DashboardCard"
import ServiceRequests from "./ServiceRequests"
import History from "./History"

import TotalNumberIcon from "../../assets/icons/total-number.svg"
import UpcomingEventsIcon from "../../assets/icons/upcoming-events.svg"
import TransactionIcon from "../../assets/icons/transaction.svg"

import ApplicationsData from "../../data/applications.json"

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
    const [pendingApplicationsDetails, setPendingApplicationsDetails] =
        useState([]) //

    const COLORS = ["#0088FE", "#FFBB28"]

    useEffect(() => {
        const fetchTotalSeniorCitizens = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/members",
                )
                setTotalSeniorCitizens(response.data.length)

                // Filter active senior citizens
                const activeCitizens = response.data.filter(
                    (member) => member.status === "Active",
                )
                setActiveSeniorCitizens(activeCitizens.length)

                const males = activeCitizens.filter(
                    (member) => member.gender === "male",
                ).length
                const females = activeCitizens.filter(
                    (member) => member.gender === "female",
                ).length

                const ageGroups = {
                    "60-65 years": activeCitizens.filter(
                        (member) => member.age >= 60 && member.age <= 65,
                    ).length,
                    "66-75 years": activeCitizens.filter(
                        (member) => member.age >= 66 && member.age <= 75,
                    ).length,
                    "76-85 years": activeCitizens.filter(
                        (member) => member.age >= 76 && member.age <= 85,
                    ).length,
                    "85+ years": activeCitizens.filter(
                        (member) => member.age > 85,
                    ).length,
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
                const response = await axios.get("http://localhost:5000/events")
                const currentDate = new Date()

                // Filter events that are within the next month and have "Active" status
                const upcoming = response.data.filter((event) => {
                    const eventDate = new Date(event.date)
                    const diffTime = eventDate - currentDate
                    return (
                        event.status === "Active" &&
                        diffTime >= 0 &&
                        diffTime <= 30 * 24 * 60 * 60 * 1000 // within the next month
                    )
                })

                setUpcomingEventDetails(upcoming)
                setUpcomingEvents(upcoming.length)
            } catch (error) {
                console.error("Error fetching upcoming events:", error)
            }
        }
        // Fetch pending applications
        const fetchPendingApplications = () => {
            const pendingApps = ApplicationsData.filter(
                (application) => application.status === "Pending",
            )
            setPendingApplications(pendingApps.length)
            setPendingApplicationsDetails(pendingApps) // Set pending applications details
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
    const ageData = Object.entries(summaryData.ageGroup).map(
        ([age, count]) => ({
            ageGroup: age,
            Population: count,
        }),
    )

    // Prepare data for Street Distribution Bar Chart
    const streetData = Object.entries(summaryData.streetDistribution).map(
        ([street, count]) => ({
            street: street,
            Population: count,
        }),
    )

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <DashboardHeader />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-8">
                    <div className="flex gap-5 mb-5">
                        {/* Total Number of Senior Citizens Card */}
                        {(isTotalHovered ||
                            (!isEventsHovered && !isTransactionsHovered)) && (
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
                                        <h3 className="font-bold text-2xl text-[#333]">
                                            Summary of Data
                                        </h3>
                                        <div className="flex-grow flex justify-around gap-4 text-gray-700 mt-2">
                                            <div>
                                                <p className="font-semibold">
                                                    Gender Distribution
                                                </p>
                                                {/* Recharts Pie Chart for Gender Distribution */}

                                                <ResponsiveContainer
                                                    width={200}
                                                    height={200}
                                                >
                                                    <PieChart>
                                                        <Tooltip
                                                            formatter={(
                                                                value,
                                                                name,
                                                            ) => [
                                                                `${name}: ${value}`,
                                                                name,
                                                            ]}
                                                            labelFormatter={() =>
                                                                "Gender Distribution"
                                                            } // Optional: You can customize the label
                                                        />
                                                        <Pie
                                                            data={genderData}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={60}
                                                        >
                                                            {genderData.map(
                                                                (
                                                                    entry,
                                                                    index,
                                                                ) => (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={
                                                                            COLORS[
                                                                                index %
                                                                                    COLORS.length
                                                                            ]
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </Pie>
                                                        <Legend
                                                            verticalAlign="bottom"
                                                            height={36}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    Age Group Distribution
                                                </p>
                                                {/* Recharts Bar Chart for Age Distribution */}
                                                <ResponsiveContainer
                                                    width={300}
                                                    height={190}
                                                >
                                                    <BarChart data={ageData}>
                                                        <XAxis
                                                            dataKey="ageGroup"
                                                            hide="true"
                                                        />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar
                                                            dataKey="Population"
                                                            fill="#8884d8"
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    Street Distribution
                                                </p>
                                                {/* Recharts Bar Chart for Street Distribution */}
                                                <ResponsiveContainer
                                                    width={300}
                                                    height={190}
                                                >
                                                    <BarChart data={streetData}>
                                                        <XAxis
                                                            dataKey="street"
                                                            hide="true"
                                                        />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar
                                                            dataKey="Population"
                                                            fill="#82ca9d"
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Upcoming Events Card */}
                        {(isEventsHovered ||
                            (!isTotalHovered && !isTransactionsHovered)) && (
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
                                        <h3 className="font-bold text-2xl text-[#333]">
                                            Upcoming Events Details
                                        </h3>
                                        <div className="flex">
                                            {/* Display the active events horizontally */}
                                            {upcomingEventDetails.filter(
                                                (event) =>
                                                    event.status === "Active",
                                            ).length > 0 && (
                                                <div className="flex flex-row w-full overflow-x-auto space-x-4">
                                                    {upcomingEventDetails
                                                        .filter(
                                                            (event) =>
                                                                event.status ===
                                                                "Active",
                                                        ) // Only filter active events
                                                        .slice(0, 3) // Limit to 3 active events
                                                        .map((event, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex-shrink-0 w-48 p-4 mt-4 bg-gray-100 rounded-lg"
                                                            >
                                                                <p className="font-semibold">
                                                                    •{" "}
                                                                    <strong>
                                                                        {
                                                                            event.title
                                                                        }
                                                                    </strong>
                                                                </p>
                                                                <p>
                                                                    {new Date(
                                                                        event.date,
                                                                    ).toLocaleDateString()}{" "}
                                                                    |{" "}
                                                                    <em>
                                                                        {
                                                                            event.location
                                                                        }
                                                                    </em>
                                                                </p>
                                                                <p>
                                                                    {
                                                                        event.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pending Applications Card */}
                        {(isTransactionsHovered ||
                            (!isTotalHovered && !isEventsHovered)) && (
                            <div
                                className="transition-transform duration-700 ease-in-out transform hover:-translate-y-1 flex-1 relative"
                                onMouseEnter={() => {
                                    setIsTotalHovered(false)
                                    setIsEventsHovered(false)
                                    setIsTransactionsHovered(true)
                                }}
                                onMouseLeave={() =>
                                    setIsTransactionsHovered(false)
                                }
                            >
                                <DashboardCard
                                    icon={TransactionIcon}
                                    count={pendingApplications}
                                    title="Pending Applications"
                                    bgColor="bg-[#E1FFE1]"
                                />
                                {isTransactionsHovered && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-white p-6 shadow-lg rounded-lg z-10 flex flex-col space-y-4">
                                        <h3 className="font-bold text-2xl text-[#333]">
                                            Pending Applications Details
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {/* Loop through the applications and display them in pairs */}
                                            {pendingApplicationsDetails.map(
                                                (application, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-full sm:w-1/2 lg:w-1/2 xl:w-1/2"
                                                    >
                                                        <div className="mb-4 border-b pb-3">
                                                            <p className="text-gray-700">
                                                                <strong>
                                                                    Applicant:
                                                                </strong>{" "}
                                                                {
                                                                    application.applicant_name
                                                                }
                                                            </p>
                                                            <p className="text-gray-700">
                                                                <strong>
                                                                    Date
                                                                    Submitted:
                                                                </strong>{" "}
                                                                {
                                                                    application.date_submitted
                                                                }
                                                            </p>
                                                            <p className="text-gray-700">
                                                                <strong>
                                                                    Form Type:
                                                                </strong>{" "}
                                                                {
                                                                    application.form_type
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
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
