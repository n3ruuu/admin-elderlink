import ArchivesData from "../../data/archives.json"

const Table = () => {
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
                    </tr>
                </thead>
                <tbody>
                    {ArchivesData.map((item, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                            }`}
                            key={index}
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table
