/* eslint-disable react/prop-types */

const PriorityCareModal = ({ isOpen, onClose, members }) => {
    if (!isOpen || !members || members.length === 0) return null;

    const handleDownload = () => {
        const csvContent = "data:text/csv;charset=utf-8," + 
            "Full Name,Medical Condition,Medications\n" +
            members.map(member => 
                `${member.name},${member.medicalConditions},${member.medications}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "priority_care_members.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank", "width=800,height=600");
        printWindow.document.write(`
            <html>
                <head><title>Priority Care Members</title></head>
                <body>
                    <h3>Priority Care Members List</h3>
                    <table border="1" style="width: 100%; text-align: left; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Medical Condition</th>
                                <th>Medications</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${members.map(member => `
                                <tr>
                                    <td>${member.name}</td>
                                    <td>${member.medicalConditions}</td>
                                    <td>${member.medications}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h3 className="text-xl font-bold mb-4">Priority Care Members</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 px-4 text-left">Full Name</th>
                                <th className="py-2 px-4 text-left">Medical Condition</th>
                                <th className="py-2 px-4 text-left">Medications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id} className="border-b">
                                    <td className="py-2 px-4">{member.firstName} {member.middleName && `${member.middleName} `} {member.lastName}</td>
                                    <td className="py-2 px-4">{member.medicalConditions}</td>
                                    <td className="py-2 px-4">{member.medications}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={handleDownload}
                    >
                        Download as CSV
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded"
                        onClick={handlePrint}
                    >
                        Print List
                    </button>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriorityCareModal;
