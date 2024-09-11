/* eslint-disable react/prop-types */
import EditIcon from "../../assets/icons/edit.svg"
import ArchiveIcon from "../../assets/icons/archive2.svg"

const Table = ({ membersData, handleOpenModal, handleArchiveClick }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-[#FFFFFF] shadow-lg rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr>
                        <th className="px-16 py-4 text-left font-medium whitespace-nowrap">
                            Name
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Date of Birth
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Age
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Gender
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Address
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Phone Number
                        </th>
                        <th className="text-left font-medium whitespace-nowrap">
                            Email
                        </th>
                        <th className="px-8 text-left font-medium whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {membersData.map((member) => (
                        <tr key={member.id} className="border-b">
                            <td className="px-16 py-4 text-left">
                                {member.name}
                            </td>
                            <td className="text-left">{member.dob}</td>
                            <td className="text-left">{member.age}</td>
                            <td className="text-left">{member.gender}</td>
                            <td className="text-left">{member.address}</td>
                            <td className="text-left">{member.phone}</td>
                            <td className="text-left">{member.email}</td>
                            <td className="px-8 py-4 flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(member)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <img
                                        src={EditIcon}
                                        alt="Edit Icon"
                                        className="w-5 h-5"
                                    />
                                </button>
                                <button
                                    onClick={() => handleArchiveClick(member)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <img
                                        src={ArchiveIcon}
                                        alt="Archive Icon"
                                        className="w-5 h-5"
                                    />
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
