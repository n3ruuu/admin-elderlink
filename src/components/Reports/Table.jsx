/* eslint-disable react/prop-types */
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment"

const Table = ({ newsData, handleOpenModal, handleOpenArchiveModal }) => {
    return (
        <div className="mt-8">
            {/* Scrollable container with a fixed height */}
            <div className="overflow-y-auto max-h-[650px] w-full shadow-lg rounded-xl border">
                <table className="min-w-full bg-white">
                    <thead className="text-gray-500 border-b">
                        <tr>
                            <th className="px-16 py-4 text-left font-medium whitespace-nowrap">Report Name</th>
                            <th className="px-6 py-4 text-left font-medium">Report Type</th>
                            <th className="px-6 py-4 text-left font-medium">Created by</th>
                            <th className="px-6 py-4 text-left font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsData.map((news, index) => (
                            <tr
                                className={`text-[#333333] h-[100px] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                                key={news.id}
                            >
                                <td className="px-6 py-4 text-left align-top">{news.headline}</td>
                                <td className="px-6 py-4 text-left align-top">{news.author}</td>
                                <td className="px-6 py-4 text-left align-top whitespace-nowrap">
                                    {moment(news.date).format("MMMM D, YYYY")}
                                </td>
                                <td className="px-6 py-4 text-left align-top">{news.body}</td>
                                <td className="px-6 py-4 text-left">
                                    {news.images ? (
                                        <div className="flex gap-2 overflow-x-auto">
                                            {/* Parse the string into an array if necessary */}
                                            {Array.isArray(JSON.parse(news.images)) ? (
                                                JSON.parse(news.images).map((image, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={`http://localhost:5000/uploads/${image}`}
                                                        alt={`News Image ${idx + 1}`}
                                                        className="w-[100px] h-[60px] object-cover rounded-md"
                                                    />
                                                ))
                                            ) : (
                                                <img
                                                    src={`http://localhost:5000/uploads/${news.images}`}
                                                    alt="News"
                                                    className="w-[100px] h-[60px] object-cover rounded-md"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        "No Image"
                                    )}
                                </td>

                                <td className="px-6 py-4 text-left flex gap-2">
                                    <button onClick={() => handleOpenModal(news)}>
                                        <img src={EditIcon} alt="Edit Icon" className="h-5" />
                                    </button>

                                    <button onClick={() => handleOpenArchiveModal(news)}>
                                        <img src={ArchiveIcon} alt="Archive Icon" className="h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table
