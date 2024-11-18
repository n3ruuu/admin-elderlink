/* eslint-disable react/prop-types */
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment"

const Table = ({ newsData, handleOpenModal, handleOpenArchiveModal }) => {
    // Filter news with status "Active"
    const activeNewsData = newsData.filter((news) => news.status === "Active")

    return (
        <div className="mt-8">
            {/* Scrollable container with a fixed height */}
            <div className="overflow-y-auto max-h-[650px] w-full shadow-lg rounded-xl border">
                <table className="min-w-full bg-white">
                    <thead className="text-gray-500 border-b">
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
                            <th className="px-6 py-4 text-left font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeNewsData.map((news, index) => (
                            <tr
                                className={`text-[#333333] font-[500] ${
                                    index % 2 === 0
                                        ? "bg-white"
                                        : "bg-[#F5F5FA]"
                                }`}
                                key={news.id}
                            >
                                <td className="px-6 py-4 text-left align-top">
                                    {news.headline}
                                </td>
                                <td className="px-6 py-4 text-left align-top">
                                    {news.author}
                                </td>
                                <td className="px-6 py-4 text-left align-top whitespace-nowrap">
                                    {moment(news.date).format("MMMM D, YYYY")}
                                </td>
                                <td className="px-6 py-4 text-left align-top">
                                    {news.body}
                                </td>
                                <td className="px-6 py-4 text-left">
                                    {news.image ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${news.image}`}
                                            alt="News"
                                            className="w-[500px] h-[200px] object-cover rounded-md"
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td className="px-6 py-4 text-left flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(news)}
                                    >
                                        <img
                                            src={EditIcon}
                                            alt="Edit Icon"
                                            className="h-5"
                                        />
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleOpenArchiveModal(news)
                                        }
                                    >
                                        <img
                                            src={ArchiveIcon}
                                            alt="Archive Icon"
                                            className="h-5"
                                        />
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
