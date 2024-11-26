/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form" // Import the Form component
import moment from "moment"

const Modal = ({ onClose}) => {
  

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[40%]">
               
                <Form
                   
                    onClose={onClose} // Pass cancel function
                />
            </div>
        </div>
    )
}

export default Modal
