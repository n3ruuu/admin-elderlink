/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import Form from "./Form";
import moment from "moment"; // Import Moment.js

const Modal = ({ onClose, member, onSave, membersData }) => {
    const memberRecords = member
        ? membersData.filter((data) => data.member_id === member.member_id)
        : [];

    const [formValues, setFormValues] = useState({
        Q1: { disbursement_date: null, claimer: null, relationship: null },
        Q2: { disbursement_date: null, claimer: null, relationship: null },
        Q3: { disbursement_date: null, claimer: null, relationship: null },
        Q4: { disbursement_date: null, claimer: null, relationship: null },
        benefitType: "Social Pension",
    });

    const formatDateToLocal = (dateStr) => {
        return dateStr ? moment(dateStr).format("YYYY-MM-DD") : null;
    };

    useEffect(() => {
        if (member) {
            const updatedFormValues = { ...formValues };
            memberRecords.forEach((record) => {
                updatedFormValues[record.quarter] = {
                    disbursement_date: record.disbursement_date
                        ? formatDateToLocal(record.disbursement_date)
                        : null,
                    claimer: record.claimer || null,
                    relationship: record.relationship || null,
                };
            });
            updatedFormValues.benefitType = member.benefitType || "Social Pension";
            setFormValues(updatedFormValues);
        }
    }, [member]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [quarter, field] = name.split("_");

        setFormValues((prev) => ({
            ...prev,
            [quarter]: {
                ...prev[quarter],
                [field]: value || null,
            },
        }));
    };

    const handleDateChange = (quarter, date) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [quarter]: {
                ...prevValues[quarter],
                disbursement_date: date || null,
            },
        }));
    };

    const handleSubmit = async () => {
        const { benefitType, Q1, Q2, Q3, Q4 } = formValues;

        // Map quarters and ensure missing values are null
        const allQuarterData = [Q1, Q2, Q3, Q4].map((quarterData, idx) => ({
            quarter: `Q${idx + 1}`,
            disbursement_date: quarterData.disbursement_date || null,
            claimer: quarterData.claimer || null,
            relationship: quarterData.relationship || null,
            proof: null, // Add default proof as null
        }));

        try {
            const socialPensionData = {
                member_id: member?.member_id || null,
                benefitType,
                quarterData: allQuarterData,
            };

            if (member) {
                await axios.put(
                    `http://localhost:5000/financial-assistance/social-pension/${member.member_id}`,
                    socialPensionData
                );
            } else {
                await axios.post(
                    "http://localhost:5000/financial-assistance/social-pension",
                    socialPensionData
                );
            }

            onSave(); // Notify parent to refresh data
            onClose(); // Close the modal after saving
        } catch (error) {
            console.error("Error saving data", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[40%]">
                <Form
                    formValues={formValues}
                    onChange={handleInputChange}
                    onClose={onClose}
                    isFormValid={() => true} // Allow submission without validation
                    isEditMode={!!member}
                    handleSubmit={handleSubmit}
                    handleDateChange={handleDateChange}
                />
            </div>
        </div>
    );
};

export default Modal;
