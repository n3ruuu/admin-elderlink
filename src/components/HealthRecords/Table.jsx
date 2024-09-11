/* eslint-disable react/prop-types */

import EditIcon from "../../assets/icons/edit2.svg"
import ViewIcon from "../../assets/icons/view.svg"

const Table = ({ membersData, onOpenModal, onArchiveClick }) => {
    return (
        <div>
            <table className="min-w-full bg-[#FFFFFF] rounded-xl shadow-lg ">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Medical Conditions
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Medications
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Allergies
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Emergency Contact
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Last Updated
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {membersData.map((row, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            }`}
                            key={row.id}
                        >
                            <td className="px-16 py-4 whitespace-nowrap">
                                {row.name}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.medical_conditions}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.medications}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.allergies}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.emergency_contact}
                            </td>
                            <td className="whitespace-nowrap">
                                {row.last_updated}
                            </td>

                            <td className="px-8 py-4 whitespace-nowrap flex gap-5 items-center">
                                <button
                                    aria-label="Edit"
                                    onClick={() => onOpenModal(row)}
                                >
                                    <img src={EditIcon} alt="Edit" />
                                </button>
                                <button
                                    aria-label="Archive"
                                    onClick={() => onArchiveClick(row)}
                                >
                                    <img src={ViewIcon} alt="Archive" />
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
