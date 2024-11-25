/* eslint-disable react/prop-types */
import Form from "./Form"

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <form>
                    <Form onClose={onClose} />
                </form>
            </div>
        </div>
    )
}

export default Modal
