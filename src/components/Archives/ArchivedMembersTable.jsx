/* eslint-disable react/prop-types */

const Table = ({ membersData }) => {
    return (
        <div className="flex-1 flex flex-col pl-16 pr-16">
            <table className="w-full bg-[#FFFFFF] shadow-xl rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr className="border-b">
                        <th className="px-16 py-4 text-left font-[500]">
                            Name
                        </th>
                        <th className="text-left font-[500]">Date of Birth</th>
                        <th className="text-left font-[500]">Gender</th>
                        <th className="text-left font-[500]">Address</th>
                        <th className="text-left font-[500]">Status</th>
                        <th className="text-left font-[500]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {membersData.map((item, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            }`}
                            key={item.id}
                        >
                            <td className="px-16 py-4">{item.name}</td>
                            <td>{item.dob}</td>
                            <td>{item.gender}</td>
                            <td>{item.address}</td>
                            <td
                                className={
                                    item.status === "Deceased"
                                        ? "text-red-500"
                                        : ""
                                }
                            >
                                {item.status}
                            </td>
                            <td>
                                <button className="text-red-600 hover:text-red-800">
                                    Archive
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
