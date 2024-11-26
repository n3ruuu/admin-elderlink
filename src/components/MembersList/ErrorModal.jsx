const ErrorModal = ({ errors, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold text-red-500 mb-4">Form Errors</h2>
                <ul className="list-disc pl-6">
                    {errors.map((error, index) => (
                        <li key={index} className="text-red-600">{error}</li>
                    ))}
                </ul>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
