/* eslint-disable react/prop-types */
import EditIcon from "../../assets/icons/edit.svg"
import ApproveIcon from "../../assets/icons/approve.svg"
import RejectIcon from "../../assets/icons/reject.svg"
import PreviewIcon from "../../assets/icons/preview.svg"
import PrintIcon from "../../assets/icons/print.svg"

const Table = ({ filteredData }) => (
    <table className="w-full bg-[#FFFFFF] shadow-xl rounded-xl">
        <thead className="text-[#767171CC]">
            <tr className="border-b">
                <th className="px-16 py-4 text-left font-[500]">
                    Applicant Name
                </th>
                <th className="text-left font-[500]">Date Submitted</th>
                <th className="text-left font-[500]">Form Type</th>
                <th className="text-left font-[500]">Status</th>
                <th className="text-left font-[500]">Actions</th>
            </tr>
        </thead>
        <tbody>
            {filteredData.map((item, index) => (
                <tr
                    className={`text-[#333333] font-[500] ${
                        index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                    }`}
                    key={item.id}
                >
                    <td className="px-16 py-4">{item.applicant_name}</td>
                    <td>{item.date_submitted}</td>
                    <td>{item.form_type}</td>
                    <td>{item.status}</td>
                    <td className="flex pt-2">
                        <button
                            className="p-2 rounded-full hover:bg-gray-200"
                            aria-label="Preview"
                        >
                            <img
                                src={PreviewIcon}
                                alt="Preview Icon"
                                className="w-5 h-5"
                            />
                        </button>

                        {item.status === "Pending" && (
                            <>
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200"
                                    aria-label="Approve"
                                >
                                    <img
                                        src={ApproveIcon}
                                        alt="Approve Icon"
                                        className="w-5 h-5"
                                    />
                                </button>
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200"
                                    aria-label="Reject"
                                >
                                    <img
                                        src={RejectIcon}
                                        alt="Reject Icon"
                                        className="w-5 h-5"
                                    />
                                </button>
                            </>
                        )}

                        {item.status === "Incomplete" && (
                            <>
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200"
                                    aria-label="Edit"
                                >
                                    <img
                                        src={EditIcon}
                                        alt="Edit Icon"
                                        className="w-5 h-5"
                                    />
                                </button>
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200"
                                    aria-label="Delete"
                                >
                                    <img
                                        src={RejectIcon}
                                        alt="Delete Icon"
                                        className="w-5 h-5"
                                    />
                                </button>
                            </>
                        )}

                        {item.status === "Approved" && (
                            <button
                                className="p-2 rounded-full hover:bg-gray-200"
                                aria-label="Print"
                            >
                                <img
                                    src={PrintIcon}
                                    alt="Print Icon"
                                    className="w-5 h-5"
                                />
                            </button>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default Table
