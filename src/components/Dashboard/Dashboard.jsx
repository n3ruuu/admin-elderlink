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

const Dashboard = () => {
    const [totalSeniorCitizens, setTotalSeniorCitizens] = useState(0)
    const [summaryData, setSummaryData] = useState({
        gender: { male: 0, female: 0 },
        ageGroup: {},
        streetDistribution: {},
    })
    const [upcomingEvents, setUpcomingEvents] = useState(0)
    const [pendingApplications, setPendingApplications] = useState(0)
    const [isTotalHovered, setIsTotalHovered] = useState(false)
    const [isEventsHovered, setIsEventsHovered] = useState(false)
    const [isTransactionsHovered, setIsTransactionsHovered] = useState(false)

    const COLORS = ["#0088FE", "#FFBB28"]

    useEffect(() => {
        const fetchTotalSeniorCitizens = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/members",
                )
                setTotalSeniorCitizens(response.data.length)

                const males = response.data.filter(
                    (member) => member.gender === "male",
                ).length
                const females = response.data.filter(
                    (member) => member.gender === "female",
                ).length

                const ageGroups = {
                    "60-65 years": response.data.filter(
                        (member) => member.age >= 60 && member.age <= 65,
                    ).length,
                    "66-75 years": response.data.filter(
                        (member) => member.age >= 66 && member.age <= 75,
                    ).length,
                    "76-85 years": response.data.filter(
                        (member) => member.age >= 76 && member.age <= 85,
                    ).length,
                    "85+ years": response.data.filter(
                        (member) => member.age > 85,
                    ).length,
                }

                const streets = response.data.reduce((acc, member) => {
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
                setUpcomingEvents(response.data.length)
            } catch (error) {
                console.error("Error fetching upcoming events:", error)
            }
        }

        const fetchPendingApplications = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/applications?status=pending",
                )
                setPendingApplications(response.data.length)
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
                                    count={totalSeniorCitizens}
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
