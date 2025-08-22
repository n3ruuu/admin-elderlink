import { useEffect, useState } from "react"
import "./history.css" // Custom CSS for scrollbar styling

import eventIcon from "./assets/events-d.svg"
import financeIcon from "./assets/finance-d.svg"
import formsIcon from "./assets/forms-d.svg"
import healthIcon from "./assets/health-d.svg"
import memberIcon from "./assets/member-d.svg"
import newsIcon from "./assets/news-d.svg"

const getIconForActivity = (title) => {
    if (title.includes("News")) return newsIcon
    if (title.includes("Event")) return eventIcon
    if (title.includes("Financial")) return financeIcon
    if (title.includes("Form")) return formsIcon
    if (title.includes("Health")) return healthIcon
    if (title.includes("Member")) return memberIcon
    if (title.includes("Report")) return formsIcon
    return null // Return null if no match is found
}

const History = () => {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null) // State for error handling

    useEffect(() => {
        // Fetch logs from the backend
        const fetchLogs = async () => {
            try {
                const response = await fetch("http://5.181.217.153:5000/log")
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()
                setActivities(data)
            } catch (error) {
                setError(error.message) // Set the error message
                console.error("Error fetching logs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div> // Display error if exists
    }

    return (
        <div className="bg-white w-1/4 h-[675px] rounded-[12px] p-8 mr-16">
            <h3 className="font-bold text-2xl mb-4">History</h3>
            <div className="overflow-y-auto h-[550px] custom-scrollbar">
                {activities.length === 0 ? (
                    <p>No activities to display.</p>
                ) : (
                    activities.map((activity, index) => (
                        <div key={index} className="flex items-center mb-4">
                            <div className="w-[60px] h-[60px] bg-[#E9FAFF] rounded-[20px] flex-shrink-0 mr-4 flex items-center justify-center">
                                <img
                                    src={getIconForActivity(activity.action)} // Default to formsIcon if no match
                                    alt={`${activity.action} icon`}
                                    className="w-[25px] h-[25px]"
                                />
                            </div>
                            <div>
                                <p className="font-medium">{activity.action}</p>
                                <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default History
