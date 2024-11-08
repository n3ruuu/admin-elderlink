import { useState, useEffect } from "react"
import moment from "moment"

const NewsTable = () => {
    const [news, setNews] = useState([]) // State to hold fetched News data

    useEffect(() => {
        // Fetch data from the API
        const fetchNews = async () => {
            try {
                const response = await fetch("http://localhost:5000/news")
                const data = await response.json()
                console.log(data) // Log the full response to see the data structure

                // Set all fetched news (both Active and Archived)
                setNews(data)
            } catch (error) {
                console.error("Error fetching News:", error)
            }
        }

        fetchNews()
    }, [])

    return (
        <div className="mt-8 mx-auto px-4">
            {/* Scrollable container with a fixed height */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] mx-16 ">
                {/* Set max height and enable vertical scrolling */}
                <table className="bg-[#FFFFFF] rounded-xl shadow-lg w-full">
                    <thead className="text-gray-500">
                        <tr>
                            <th className="px-6 py-4 text-left font-medium">
                                News Headline
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Author
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Body
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Photo
                            </th>
                            <th className="text-left font-medium whitespace-nowrap">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.length > 0 ? (
                            news.map((newsItem) => (
                                <tr
                                    key={newsItem.id}
                                    className="border-b last:border-none space-y-4"
                                >
                                    <td className="px-6 py-4 text-left align-top">
                                        {newsItem.headline}
                                    </td>
                                    <td className="px-6 py-4 text-left align-top">
                                        {newsItem.author}
                                    </td>
                                    <td className="px-6 py-4 text-left align-top whitespace-nowrap">
                                        {moment(newsItem.date).format(
                                            "MM-DD-YYYY",
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-left align-top">
                                        {newsItem.body}
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        {newsItem.image ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${newsItem.image}`}
                                                alt="News"
                                                className="w-[500px] h-[200px] object-cover rounded-md"
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td className="text-left text-red-500 align-top pt-4 whitespace-nowrap">
                                        {newsItem.status}
                                    </td>
                                    <td className="px-8 flex gap-2 text-[#219EBC] align-top font-semibold underline">
                                        Undo
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No news found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default NewsTable
