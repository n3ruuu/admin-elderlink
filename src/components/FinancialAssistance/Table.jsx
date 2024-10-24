/* eslint-disable react/prop-types */
import EditIcon from "../../assets/icons/edit.svg"
import ViewIcon from "../../assets/icons/view.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"
import moment from "moment" // Import Moment.js

const Table = ({
    membersData,
    handleOpenModal,
    handleArchiveClick,
    financialAssistanceRecords,
}) => {
    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Benefit Type
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Latest Date of Claim
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Status
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Claimer
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Relationship
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* Render existing members data */}
                    {membersData.map((row, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={row.id}
                        >
                            <td className="px-16 py-4 whitespace-nowrap">
                                {row.member_name}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.benefit_type}
                            </td>
                            <td className="whitespace-nowrap">
                                {moment(row.date_of_claim).format("MM-DD-YYYY")}
                            </td>
                            <td
                                className={`whitespace-nowrap font-[500] ${row.benefit_status === "claimed" ? "text-green-500" : "text-red-500"}`}
                            >
                                {row.benefit_status === "claimed"
                                    ? "Claimed"
                                    : "Unclaimed"}
                            </td>
                            <td className="whitespace-nowrap">{row.claimer}</td>
                            <td className="whitespace-nowrap">
                                {row.relationship}
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap flex gap-3 items-center">
                                <button
                                    aria-label="Edit"
                                    onClick={() => handleOpenModal(row)}
                                >
                                    <img src={EditIcon} alt="Edit" />
                                </button>
                                <button
                                    aria-label="View"
                                    onClick={() => handleArchiveClick(row)}
                                >
                                    <img src={ViewIcon} alt="View" />
                                </button>
                                <button aria-label="Archive">
                                    <img src={ArchiveIcon} alt="Archive" />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* Render newly added financial assistance records */}
                    {financialAssistanceRecords.map((record, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={`new-${index}`} // Ensure unique key
                        >
                            <td className="px-16 py-4 whitespace-nowrap">
                                {record.memberName}
                            </td>
                            <td className="whitespace-nowrap">
                                {record.benefitType}
                            </td>
                            <td className="whitespace-nowrap">
                                {moment(record.dateOfClaim).format(
                                    "MM-DD-YYYY",
                                )}
                            </td>
                            <td
                                className={`whitespace-nowrap font-[500] ${record.benefitStatus === "claimed" ? "text-green-500" : "text-red-500"}`}
                            >
                                {record.benefitStatus === "claimed"
                                    ? "Claimed"
                                    : "Unclaimed"}
                            </td>
                            <td className="whitespace-nowrap">
                                {record.claimer}
                            </td>
                            <td className="whitespace-nowrap">
                                {record.relationship}
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap flex gap-3 items-center">
                                <button
                                    aria-label="Edit"
                                    onClick={() => handleOpenModal(record)}
                                >
                                    <img src={EditIcon} alt="Edit" />
                                </button>
                                <button
                                    aria-label="View"
                                    onClick={() => handleArchiveClick(record)}
                                >
                                    <img src={ViewIcon} alt="View" />
                                </button>
                                <button aria-label="Archive">
                                    <img src={ArchiveIcon} alt="Archive" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table
