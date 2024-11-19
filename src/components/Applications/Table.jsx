/* eslint-disable react/prop-types */
import moment from "moment"
import ApproveIcon from "../../assets/icons/approve.svg"
import RejectIcon from "../../assets/icons/reject.svg"
import PreviewIcon from "../../assets/icons/preview.svg"
import UndoIcon from "../../assets/icons/cancel.svg"

const Table = ({ filteredData, onStatusUpdate }) => (
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
                    <td>
                        {moment(item.date_submitted).format("MMMM D, YYYY")}
                    </td>
                    <td>{item.form_type}</td>
                    <td>{item.status}</td>
                    <td className="flex pt-2">
                        <button
                            className="p-2 rounded-full hover:bg-gray-200"
                            aria-label="Preview"
                            onClick={() => {
                                if (item.file_path) {
                                    window.open(
                                        `http://localhost:5000/${item.file_path}`,
                                        "_blank",
                                    )
                                } else {
                                    alert(
                                        "No PDF file available for this item.",
                                    )
                                }
                            }}
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
                                    onClick={() =>
                                        onStatusUpdate(item.id, "Approved")
                                    }
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
                                    onClick={() =>
                                        onStatusUpdate(item.id, "Rejected")
                                    }
                                >
                                    <img
                                        src={RejectIcon}
                                        alt="Reject Icon"
                                        className="w-5 h-5"
                                    />
                                </button>
                            </>
                        )}

                        {item.status === "Approved" && (
                            <>
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200"
                                    aria-label="Cancel"
                                    onClick={() =>
                                        onStatusUpdate(item.id, "Pending")
                                    }
                                >
                                    <img
                                        src={UndoIcon}
                                        alt="Cancel Icon"
                                        className="w-5 h-5"
                                    />
                                </button>
                            </>
                        )}

                        {item.status === "Rejected" && (
                            <button
                                className="p-2 rounded-full hover:bg-gray-200"
                                aria-label="Cancel"
                                onClick={() =>
                                    onStatusUpdate(item.id, "Pending")
                                }
                            >
                                <img
                                    src={UndoIcon}
                                    alt="Cancel Icon"
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
