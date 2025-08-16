const ErrorModal = ({ errors, onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%]">
                <h2 className="text-xl font-bold text-red-500 mb-4">Form Errors</h2>
                <div className="space-y-4">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-start">
                            <span className="text-red-600 text-xl">⚠️</span>
                            <p className="ml-2 text-lg sm:text-xl text-gray-800">{error}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white text-xl w-[100px] h-[50px] rounded-md hover:bg-red-700 transition duration-200 ease-in-out"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
