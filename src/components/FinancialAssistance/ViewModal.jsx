/* eslint-disable react/prop-types */
import moment from "moment"

const ViewModal = ({ member, onClose }) => {
    const renderQuarterData = (quarter) => {
        return (
            <tr>
                <td>{moment(member[`claimDate${quarter}`]).format("MMMM D, YYYY") || "N/A"}</td>
                <td>{quarter}</td>
                <td>{member[`claimer${quarter}`] || "N/A"}</td>
                <td>{member[`relationship${quarter}`] || "N/A"}</td>
                <td>
                    {member[`proof${quarter}`] ? (
                        <a
                            href={`http://localhost:5000/uploads/${member[`proof${quarter}`]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            View Proof
                        </a>
                    ) : (
                        "N/A"
                    )}
                </td>
                <td>{member[`benefitStatus${quarter}`] || "Unclaimed"}</td>
            </tr>
        )
    }

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-3/4 max-w-4xl">
                <h2 className="text-xl font-semibold mb-4">
                    {member.firstName} {member.middleName && `${member.middleName} `}
                    {member.lastName} Social Pension Record
                </h2>
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th>Month of Claim</th>
                            <th>Quarter</th>
                            <th>Claimer</th>
                            <th>Relationship</th>
                            <th>Proof</th>
                            <th>Benefit Status</th>
                        </tr>
                    </thead>
                    <tbody>{["Q1", "Q2", "Q3", "Q4"].map((quarter) => renderQuarterData(quarter))}</tbody>
                </table>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-md">
                    Close
                </button>
            </div>
        </div>
    )
}

export default ViewModal
