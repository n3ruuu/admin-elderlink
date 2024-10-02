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
    const data = {
        labels: [
            "Mar 1",
            "Mar 3",
            "Mar 5",
            "Mar 7",
            "Mar 9",
            "Mar 11",
            "Mar 13",
            "Mar 15",
            "Mar 17",
            "Mar 19",
            "Mar 21",
            "Mar 23",
            "Mar 25",
            "Mar 27",
            "Mar 29",
        ],
        datasets: [
            {
                label: "Visits",
                data: [
                    50, 70, 65, 90, 30, 50, 85, 60, 45, 75, 90, 55, 85, 75, 60,
                ],
                borderColor: "#0096C7",
                backgroundColor: "#0096C7",
                tension: 0.3,
                fill: false,
                pointRadius: 4,
                pointBackgroundColor: "#0096C7",
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 125,
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
        <div className="bg-white rounded-[12px] h-[380px] p-8 shadow-md">
            <h3 className="font-bold text-2xl mb-4">
                Service Requests by Senior Citizens
            </h3>
            <div className="h-[280px]">
                <Line data={data} options={options} />
            </div>
        </div>
    )
}

export default ServiceRequests
