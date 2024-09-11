import FormsData from "../../data/forms.json"

const Table = () => {
    return (
        <table className="w-[90%] bg-[#FFFFFF] rounded-[12px] mx-16 shadow-xl">
            <thead className="font-[100] text-left border-b border-b-1">
                <tr className="text-[#767171CC]">
                    <th className="font-[500] px-16 py-4">Form Title</th>
                    <th className="font-[500] pl-4">Last Opened</th>
                    <th className="font-[500] pl-4">Category</th>
                    <th className="font-[500] pl-4"></th>
                </tr>
            </thead>
            <tbody>
                {FormsData.map((form, index) => (
                    <tr
                        className={`text-[#333333] font-[500] ${
                            index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"
                        }`}
                        key={form.id}
                    >
                        <td className="px-4 py-2">
                            <div className="flex items-center gap-4">
                                <img
                                    src={form.imagePath}
                                    alt={form.title}
                                    className="h-12 w-12 object-contain"
                                />
                                <span>{form.title}</span>
                            </div>
                        </td>
                        <td className="px-4 py-2">
                            {new Date(form.lastOpened).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">{form.category}</td>
                        <td className="px-4 py-2 text-right pr-8">
                            <button className="text-xl">⋮</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table
