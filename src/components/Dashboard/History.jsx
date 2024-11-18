import { useEffect, useState } from "react"
import "./history.css" // Custom CSS for scrollbar styling

import eventIcon from "./assets/event.svg"
import pensionIcon from "./assets/pension.svg"
import smsIcon from "./assets/sms.svg"
import updateIcon from "./assets/update.svg"
import registerIcon from "./assets/register.svg"

const getIconForActivity = (title) => {
    switch (title) {
        case "New Registration":
            return registerIcon
        case "Pension Disbursement":
            return pensionIcon
        case "SMS Notification":
            return smsIcon
        case "Update Member Info":
            return updateIcon
        case "New Event":
            return eventIcon
        default:
            return null // Add a default icon if needed
    }
}

const History = () => {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch logs from the backend
        const fetchLogs = async () => {
            try {
                const response = await fetch("http://localhost:5000/log")
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()
                setActivities(data)
            } catch (error) {
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
                                    src={getIconForActivity(activity.action)}
                                    alt={`${activity.action} icon`}
                                    className="w-[25px] h-[25px]"
                                />
                            </div>
                            <div>
                                <p className="font-medium">{activity.action}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        activity.timestamp,
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default History
