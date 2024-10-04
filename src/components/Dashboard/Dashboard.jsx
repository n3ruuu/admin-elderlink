import { useEffect, useState } from "react"
import axios from "axios"
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
    const [isTotalHovered, setIsTotalHovered] = useState(false)
    const [isEventsHovered, setIsEventsHovered] = useState(false)
    const [isTransactionsHovered, setIsTransactionsHovered] = useState(false)

    useEffect(() => {
        const fetchTotalSeniorCitizens = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/members",
                )
                setTotalSeniorCitizens(response.data.length) // Count of members

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

        fetchTotalSeniorCitizens()
    }, [])

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
                                className={`transition-transform duration-700 ease-in-out transform hover:-translate-y-1 flex-1 relative`}
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
                                                <p>
                                                    Male:{" "}
                                                    {summaryData.gender.male}
                                                </p>
                                                <p>
                                                    Female:{" "}
                                                    {summaryData.gender.female}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    Age Group Distribution
                                                </p>
                                                {Object.entries(
                                                    summaryData.ageGroup,
                                                ).map(([ageGroup, count]) => (
                                                    <p key={ageGroup}>
                                                        {ageGroup}: {count}{" "}
                                                        seniors
                                                    </p>
                                                ))}
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    Street Distribution
                                                </p>
                                                {Object.entries(
                                                    summaryData.streetDistribution,
                                                ).map(([street, count]) => (
                                                    <p key={street}>
                                                        {street}: {count}{" "}
                                                        seniors
                                                    </p>
                                                ))}
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
                                className={`transition-transform duration-700 ease-in-out transform hover:-translate-y-1 flex-1 relative`}
                                onMouseEnter={() => {
                                    setIsTotalHovered(false)
                                    setIsEventsHovered(true)
                                    setIsTransactionsHovered(false)
                                }}
                                onMouseLeave={() => setIsEventsHovered(false)}
                            >
                                <DashboardCard
                                    icon={UpcomingEventsIcon}
                                    count="3"
                                    title="Upcoming Events"
                                    bgColor="bg-[#FFF1F8]"
                                />
                                {isEventsHovered && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-white p-4 shadow-lg rounded-lg z-10 flex flex-col justify-between">
                                        <h3 className="font-bold text-lg text-[#333]">
                                            Upcoming Events Summary
                                        </h3>
                                        <div className="flex-grow text-sm text-gray-700">
                                            <p>
                                                Details about upcoming events
                                                will be shown here.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recent Transactions Card */}
                        {(isTransactionsHovered ||
                            (!isTotalHovered && !isEventsHovered)) && (
                            <div
                                className={`transition-transform duration-700 ease-in-out transform hover:-translate-y-1 flex-1 relative`}
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
                                    count="10"
                                    title="Recent Transactions"
                                    bgColor="bg-[#EDFFEE]"
                                />
                                {isTransactionsHovered && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-white p-4 shadow-lg rounded-lg z-10 flex flex-col justify-between">
                                        <h3 className="font-bold text-lg text-[#333]">
                                            Recent Transactions Summary
                                        </h3>
                                        <div className="flex-grow text-sm text-gray-700">
                                            <p>
                                                Details about recent
                                                transactions will be shown here.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <ServiceRequests />
                </div>
                <History />
            </div>
        </section>
    )
}

export default Dashboard
