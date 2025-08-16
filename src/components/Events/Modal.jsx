import { useState, useEffect } from "react";
import moment from "moment";
import FormFields from "./FormFields";

const Modal = ({ isOpen, onClose, onSave, event }) => {

    const loggedInUsername = localStorage.getItem("username") || ""


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        recurrence: "",
        date: "",
        time: "",
        location: "",
        organizer: loggedInUsername,
        endDate: "", // Added endDate
        recurrenceDates: [] // Array to store recurrence dates
    });

    const [isModified, setIsModified] = useState(false);

    const isEditMode = !!event;

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                title: event.title || "",
                description: event.description || "",
                category: event.category || "",
                recurrence: event.recurrence || "",
                date: event.date ? moment(event.date).format("YYYY-MM-DD") : "",
                time: event.time || "",
                location: event.location || "",
                organizer: loggedInUsername,
                endDate: event.endDate ? moment(event.endDate).format("YYYY-MM-DD") : "", // Set endDate
                recurrenceDates: event.recurrenceDates || [] // Set recurrenceDates if editing
            });
            setIsModified(false);
        } else {
            setFormData({
                title: "",
                description: "",
                category: "",
                recurrence: "",
                date: "",
                time: "",
                location: "",
                organizer: "",
                endDate: "", // Clear endDate when not editing
                recurrenceDates: [] // Clear recurrence dates when not editing
            });
        }
    }, [event, isEditMode]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setIsModified(true);
    };

    const generateRecurrenceDates = (startDate, endDate, recurrence) => {
        let dates = [];
        let currentDate = moment(startDate);
        const finalDate = moment(endDate);
    
        // Daily recurrence
        if (recurrence === "Daily") {
            while (currentDate <= finalDate) {
                dates.push(currentDate.format("YYYY-MM-DD"));
                currentDate.add(1, "days");
            }
        }
        // Weekly recurrence
        else if (recurrence === "Weekly") {
            while (currentDate <= finalDate) {
                dates.push(currentDate.format("YYYY-MM-DD"));
                currentDate.add(1, "weeks");
            }
        }
        // Monthly recurrence
        else if (recurrence === "Monthly") {
            while (currentDate <= finalDate) {
                dates.push(currentDate.format("YYYY-MM-DD"));
                currentDate.add(1, "months");
            }
        }
        // Yearly recurrence
        else if (recurrence === "Yearly") {
            while (currentDate <= finalDate) {
                dates.push(currentDate.format("YYYY-MM-DD"));
                currentDate.add(1, "years");
            }
        }
    
        return dates;
    };
    

    const isFormValid = () => {
        const requiredFields = ["title", "description", "category", "recurrence", "date", "time", "location", "organizer"];
        return requiredFields.every((field) => formData[field]?.trim() !== "");
    };

    const handleSave = () => {
        // Generate recurrence dates if recurrence is set
        const generatedRecurrenceDates = formData.recurrence 
            ? generateRecurrenceDates(formData.date, formData.endDate, formData.recurrence) 
            : [];
    
        // Update formData with the generated recurrence dates
        setFormData((prevData) => ({
            ...prevData,
            recurrenceDates: generatedRecurrenceDates // Set recurrenceDates in state
        }));
    
        // Create the updated event object with formData values, including generated recurrenceDates
        const updatedEvent = {
            ...event,
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            organizer: formData.organizer,
            category: formData.category,
            recurrence: formData.recurrence,
            endDate: formData.endDate, // Save endDate
            recurrenceDates: generatedRecurrenceDates // Save the generated recurrence dates
        };
    
        // Call the onSave callback with the updated event data
        onSave(updatedEvent);
    
        // Log the generated recurrence dates and formData for debugging
        console.log("Generated Recurrence Dates:", generatedRecurrenceDates);
        console.log("Updated Form Data:", formData);
    };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">{isEditMode && event.id ? "Edit Event" : "Add Event"}</h2>
                <form>
                    <FormFields formData={formData} onChange={handleChange} />

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-5">
                        <div className="flex gap-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="border w-[100px] self-right border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!isFormValid() || (isEditMode && !isModified)}
                                className={`bg-[#219EBC] hover:bg-[#1A7A8A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-[100px] ${
                                    !isFormValid() || (isEditMode && !isModified) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                {isEditMode && event.id ? "Save" : "Add"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
