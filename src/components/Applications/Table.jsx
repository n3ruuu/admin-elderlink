import { useState } from "react";
import ApproveIcon from "../../assets/icons/approve.svg";
import RejectIcon from "../../assets/icons/reject.svg";
import PreviewIcon from "../../assets/icons/preview.svg";
import UndoIcon from "../../assets/icons/cancel.svg";
import axios from "axios";
import moment from 'moment';
import Modal from "./Register/Modal";  // Import Modal component

const Table = ({ applications, onStatusUpdate }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Function to open the modal with the selected application
    const openModal = (application) => {
        setSelectedApplication(application);
        setIsModalVisible(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedApplication(null);
    };

    const handleStatusUpdate = async (application, status) => {
        console.log("Selected application in handleStatusUpdate:", application);

        if (status === "Approved") {
            try {
                const response = await axios.post("http://localhost:5000/members", {
                    firstName: application.firstName,
                    lastName: application.lastName,
                    middleName: application.middleName,
                    extension: application.extension,
                    dob: moment(application.dob).format("YYYY-MM-DD"),
                    sex: application.sex,
                    civilStatus: application.civilStatus,
                    address: application.address,
                    contactNumber: application.contactNumber,
                    controlNo: '',
                    purchaseBookletNo: '',
                    medicineBookletNo: '',
                    dateIssued: '',
                    medicalConditions: '',
                    medications: '',
                    guardianFirstName: application.guardianFirstName,
                    guardianMiddleName: application.guardianMiddleName,
                    guardianLastName: application.guardianLastName,
                    guardianEmail: application.guardianEmail,
                    guardianContact: application.guardianContact,
                    guardianRelationship: application.guardianRelationship,
                    status: "Active", // Default status for approved applications
                });

                console.log("Member added successfully:", response.data);
                // Optionally, update status in the UI or backend
                onStatusUpdate(application.id, "Approved");
                alert("Success");
            } catch (error) {
                console.error("Error while adding member:", error);
            }
        } else {
            onStatusUpdate(application.id, status); // For other statuses like Rejected
        }
    };

    return (
        <div>
            <table className="w-full bg-[#FFFFFF] shadow-xl rounded-xl">
                <thead className="text-[#767171CC]">
                    <tr className="border-b">
                        <th className="px-16 py-4 text-left font-[500]">Applicant Name</th>
                        <th className="text-left font-[500]">Form Type</th>
                        <th className="text-left font-[500]">Application Type</th>
                        <th className="text-left font-[500]">Application Status</th>
                        <th className="text-left font-[500]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((item, index) => (
                        <tr
                            className={`text-[#333333] font-[500] ${index % 2 === 0 ? "bg-white" : "bg-[#F5F5FA]"}`}
                            key={item.id}
                        >
                            <td className="px-16 py-4">{item.firstName}</td>
                            <td>OSCA Registration</td>
                            <td>{item.applicationType.charAt(0).toUpperCase() + item.applicationType.slice(1)} Registration</td>
                            <td>{item.applicationStatus}</td>
                            <td className="flex pt-2">
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200"
                                    aria-label="Preview"
                                    onClick={() => openModal(item)} // Open modal with selected application
                                >
                                    <img src={PreviewIcon} alt="Preview Icon" className="w-5 h-5" />
                                </button>

                                {item.applicationStatus === "Pending" && (
                                    <>
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200"
                                            aria-label="Approve"
                                            onClick={() => handleStatusUpdate(item, "Approved")}
                                        >
                                            <img src={ApproveIcon} alt="Approve Icon" className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200"
                                            aria-label="Reject"
                                            onClick={() => handleStatusUpdate(item, "Rejected")}
                                        >
                                            <img src={RejectIcon} alt="Reject Icon" className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {item.applicationStatus === "Approved" && (
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-200"
                                        aria-label="Cancel"
                                        onClick={() => handleStatusUpdate(item, "Pending")}
                                    >
                                        <img src={UndoIcon} alt="Cancel Icon" className="w-5 h-5" />
                                    </button>
                                )}

                                {item.applicationStatus === "Rejected" && (
                                    <button
                                        className="p-2 rounded-full hover:bg-gray-200"
                                        aria-label="Cancel"
                                        onClick={() => handleStatusUpdate(item, "Pending")}
                                    >
                                        <img src={UndoIcon} alt="Cancel Icon" className="w-5 h-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Conditionally render Modal */}
            {isModalVisible && selectedApplication && (
                <Modal onClose={closeModal} application={selectedApplication} />
            )}
        </div>
    );
};

export default Table;
