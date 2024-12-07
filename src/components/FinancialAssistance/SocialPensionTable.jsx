/* eslint-disable react/prop-types */

import moment from "moment"
import EditIcon from "../../assets/icons/edit.svg"
import ViewIcon from "../../assets/icons/eye.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"

const SocialPensionTable = ({ socialPensionMembers, onEdit, handleViewClick }) => {
    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="pl-8 py-4 text-left font-medium whitespace-nowrap w-[10%]">Control No.</th>
                        <th className="text-left font-medium whitespace-nowrap">Full Name</th>
                        <th className="text-left font-medium whitespace-nowrap">Disbursement Date</th>
                        <th className="text-left font-medium whitespace-nowrap">Status</th>
                        <th className="text-left font-medium whitespace-nowrap">Claimer</th>
                        <th className="text-left font-medium whitespace-nowrap">Relationship</th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {socialPensionMembers.map((member, index) => {
                        const isNullData =
                            !member.disbursement_date && !member.claimer && !member.relationship;

                        const getStatusText = () => {
                            if (isNullData) return "N/A";
                            return member.status || "Unclaimed";
                        };

                        const getStatusColor = () => {
                            if (isNullData) return ""; // No color for N/A
                            if (member.status === "Claimed") return "text-green-500 font-semibold";
                            if (member.status === "Unclaimed") return "text-red-500 font-semibold";
                            return ""; // Default case
                        };

                        return (
                            <tr
                                key={member.id}
                                className={`${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            >
                                <td className="px-8 py-4 text-left">{member.control_no}</td>
                                <td className="text-left whitespace-nowrap">{member.full_name}</td>
                                <td className="whitespace-nowrap">
                                    {member.disbursement_date
                                        ? moment(member.disbursement_date).format("MMMM D, YYYY")
                                        : "N/A"}
                                </td>
                                <td className={`whitespace-nowrap ${getStatusColor()}`}>
                                    {getStatusText()}
                                </td>
                                <td className="whitespace-nowrap">{member.claimer || "N/A"}</td>
                                <td className="whitespace-nowrap">{member.relationship || "N/A"}</td>
                                <td className="px-8 py-4 whitespace-nowrap flex gap-3 items-center">
                                    <button aria-label="Edit" onClick={() => onEdit(member)}>
                                        <img src={EditIcon} alt="Edit" />
                                    </button>
                                    <button
                                        aria-label="View"
                                        onClick={() => handleViewClick(member)}
                                    >
                                        <img src={ViewIcon} alt="View" />
                                    </button>
                                    <button aria-label="Archive">
                                        <img src={ArchiveIcon} alt="Archive" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SocialPensionTable;