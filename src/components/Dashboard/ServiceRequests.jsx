import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import axios from "axios"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

const ServiceRequests = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Visits",
                data: [],
                borderColor: "#0096C7",
                backgroundColor: "#0096C7",
                tension: 0.3,
                fill: false,
                pointRadius: 4,
                pointBackgroundColor: "#0096C7",
            },
        ],
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/log")
                const logs = response.data
    
                // Aggregate data by date
                const aggregatedData = logs.reduce((acc, log) => {
                    // Standardize the date to ISO format for consistent sorting
                    const date = new Date(log.timestamp).toISOString().split("T")[0]
                    acc[date] = (acc[date] || 0) + 1
                    return acc
                }, {})
    
                // Sort dates in ascending order
                const sortedDates = Object.keys(aggregatedData).sort(
                    (a, b) => new Date(a) - new Date(b)
                )
                const sortedData = sortedDates.map((date) => aggregatedData[date])
    
                // Update chart data
                setChartData({
                    labels: sortedDates.map((date) =>
                        new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })
                    ),
                    datasets: [
                        {
                            label: "Service Requests",
                            data: sortedData,
                            borderColor: "#0096C7",
                            backgroundColor: "#0096C7",
                            tension: 0.3,
                            fill: false,
                            pointRadius: 4,
                            pointBackgroundColor: "#0096C7",
                        },
                    ],
                })
            } catch (error) {
                console.error("Error fetching logs:", error)
            } finally {
                setLoading(false)
            }
        }
    
        fetchLogs()
    }, [])
    
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: "top",
                align: "end",
            },
        },
    }

    return (
        <div className="bg-white rounded-[12px] h-[380px] w-full p-8 shadow-md">
            <h3 className="font-bold text-2xl mb-4">
                Service Requests by Senior Citizens
            </h3>
            <div className="h-[280px]">
                {loading ? (
                    <p>Loading data...</p>
                ) : (
                    <Line data={chartData} options={options} />
                )}
            </div>
        </div>
    )
}

export default ServiceRequests
